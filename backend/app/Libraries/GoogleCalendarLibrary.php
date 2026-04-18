<?php

namespace App\Libraries;

use Google\Client;
use Google\Service\Calendar;
use App\Models\BookingSettingsModel;

class GoogleCalendarLibrary
{
    protected Client $client;
    protected Calendar $service;
    protected BookingSettingsModel $settingsModel;

    public function __construct()
    {
        $this->settingsModel = new BookingSettingsModel();
        
        $this->client = new Client();
        $this->client->setClientId(env('GOOGLE_CLIENT_ID'));
        $this->client->setClientSecret(env('GOOGLE_CLIENT_SECRET'));
        $this->client->setRedirectUri(env('GOOGLE_REDIRECT_URI'));
        $this->client->addScope(Calendar::CALENDAR);
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');

        $this->loadToken();
        $this->service = new Calendar($this->client);
    }

    /**
     * Load the token from settings and set it to the client.
     */
    protected function loadToken()
    {
        $tokenJson = $this->settingsModel->getSetting('google_oauth_token');
        if ($tokenJson) {
            $accessToken = json_decode($tokenJson, true);
            $this->client->setAccessToken($accessToken);

            if ($this->client->isAccessTokenExpired()) {
                if ($this->client->getRefreshToken()) {
                    $newToken = $this->client->fetchAccessTokenWithRefreshToken($this->client->getRefreshToken());
                    
                    // Merge refresh token if not present in the new set
                    if (!isset($newToken['refresh_token'])) {
                        $newToken['refresh_token'] = $accessToken['refresh_token'];
                    }

                    $this->settingsModel->setSetting('google_oauth_token', json_encode($newToken));
                }
            }
        }
    }

    /**
     * Get the Auth URL for the admin to login.
     */
    public function getAuthUrl(): string
    {
        return $this->client->createAuthUrl();
    }

    /**
     * Authenticate with the code from Google.
     */
    public function authenticate(string $code): array
    {
        $accessToken = $this->client->fetchAccessTokenWithAuthCode($code);
        $this->settingsModel->setSetting('google_oauth_token', json_encode($accessToken));
        return $accessToken;
    }

    /**
     * Is the client authenticated?
     */
    public function isConnected(): bool
    {
        return !$this->client->isAccessTokenExpired();
    }

    /**
     * Get busy slots for a range of time.
     */
    public function getFreeBusy(string $startTime, string $endTime): array
    {
        $calendarId = $this->settingsModel->getSetting('google_calendar_id', 'primary');
        
        $freeBusyRequest = new \Google\Service\Calendar\FreeBusyRequest();
        $freeBusyRequest->setTimeMin($startTime);
        $freeBusyRequest->setTimeMax($endTime);
        $freeBusyRequest->setItems([['id' => $calendarId]]);

        $response = $this->service->freebusy->query($freeBusyRequest);
        return $response->getCalendars()[$calendarId]->getBusy();
    }

    /**
     * Create a calendar event.
     */
    public function createEvent(array $eventData): string
    {
        $calendarId = $this->settingsModel->getSetting('google_calendar_id', 'primary');
        
        $event = new \Google\Service\Calendar\Event([
            'summary'     => $eventData['summary'],
            'description' => $eventData['description'] ?? '',
            'start' => [
                'dateTime' => $eventData['start'],
                'timeZone' => 'Europe/Rome',
            ],
            'end' => [
                'dateTime' => $eventData['end'],
                'timeZone' => 'Europe/Rome',
            ],
            'attendees' => [
                ['email' => $eventData['client_email']],
            ],
            'reminders' => [
                'useDefault' => true,
            ],
        ]);

        $event = $this->service->events->insert($calendarId, $event);
        return $event->getId();
    }

    /**
     * Update a calendar event.
     */
    public function updateEvent(string $eventId, array $eventData): bool
    {
        $calendarId = $this->settingsModel->getSetting('google_calendar_id', 'primary');
        try {
            $event = $this->service->events->get($calendarId, $eventId);
            
            if (isset($eventData['summary'])) {
                $event->setSummary($eventData['summary']);
            }
            if (isset($eventData['description'])) {
                $event->setDescription($eventData['description']);
            }
            // Update start/end if provided
            if (isset($eventData['start'])) {
                $event->getStart()->setDateTime($eventData['start']);
            }
            if (isset($eventData['end'])) {
                $event->getEnd()->setDateTime($eventData['end']);
            }

            $this->service->events->update($calendarId, $eventId, $event);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Delete a calendar event.
     */
    public function deleteEvent(string $eventId): bool
    {
        $calendarId = $this->settingsModel->getSetting('google_calendar_id', 'primary');
        try {
            $this->service->events->delete($calendarId, $eventId);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }
}
