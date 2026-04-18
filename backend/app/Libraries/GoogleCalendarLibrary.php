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
    protected const DEFAULT_TIMEZONE = 'Europe/Rome';

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

        log_message('info', "[GoogleCalendar] Initialized with Client ID: " . (env('GOOGLE_CLIENT_ID') ? 'Set' : 'MISSING'));
        log_message('info', "[GoogleCalendar] Redirect URI: " . env('GOOGLE_REDIRECT_URI'));

        $this->loadToken();
        $this->service = new Calendar($this->client);
    }

    /**
     * Load the token from settings and set it to the client.
     */
    protected function loadToken()
    {
        try {
            $tokenJson = $this->settingsModel->getSetting('google_oauth_token');
            if ($tokenJson) {
                log_message('info', "[GoogleCalendar] Token found in settings.");
                $accessToken = json_decode($tokenJson, true);
                if (!$accessToken) {
                    log_message('error', "[GoogleCalendar] Failed to decode token JSON.");
                    return;
                }

                $this->client->setAccessToken($accessToken);

                if ($this->client->isAccessTokenExpired()) {
                    log_message('info', "[GoogleCalendar] Access token expired. Attempting refresh...");
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
        } catch (\Exception $e) {
            log_message('error', '[GoogleCalendar] Token load/refresh error: ' . $e->getMessage());
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
        log_message('info', "[GoogleCalendar] Authenticating with code...");
        $accessToken = $this->client->fetchAccessTokenWithAuthCode($code);
        
        if (isset($accessToken['error'])) {
            log_message('error', "[GoogleCalendar] Authentication error: " . ($accessToken['error_description'] ?? $accessToken['error']));
        } else {
            log_message('info', "[GoogleCalendar] Authentication successful. Token obtained.");
        }

        $this->settingsModel->setSetting('google_oauth_token', json_encode($accessToken));
        return $accessToken;
    }

    /**
     * Is the client authenticated? (Basic check)
     */
    public function isConnected(): bool
    {
        $token = $this->client->getAccessToken();
        return $token && !$this->client->isAccessTokenExpired();
    }

    /**
     * Deep check of connection health.
     */
    public function verifyConnection(): bool
    {
        if (!$this->isConnected()) {
            return false;
        }

        try {
            // Try to fetch the primary calendar metadata as a lightweight check
            $this->service->calendars->get('primary');
            log_message('info', "[GoogleCalendar] Connection verified successfully.");
            return true;
        } catch (\Exception $e) {
            log_message('error', "[GoogleCalendar] Connection verification failed: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get busy slots for a range of time.
     */
    public function getFreeBusy(string $startTime, string $endTime): array
    {
        if (!$this->isConnected()) {
            return [];
        }

        try {
            $calendarId = $this->settingsModel->getSetting('google_calendar_id', 'primary');
            
            $freeBusyRequest = new \Google\Service\Calendar\FreeBusyRequest();
            $freeBusyRequest->setTimeMin($startTime);
            $freeBusyRequest->setTimeMax($endTime);
            $freeBusyRequest->setItems([['id' => $calendarId]]);

            $response = $this->service->freebusy->query($freeBusyRequest);
            $calendars = $response->getCalendars();
            
            if (isset($calendars[$calendarId])) {
                return $calendars[$calendarId]->getBusy();
            }
            
            return [];
        } catch (\Exception $e) {
            log_message('error', '[GoogleCalendar] FreeBusy error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Create a calendar event.
     */
    public function createEvent(array $eventData): ?string
    {
        if (!$this->isConnected()) {
            return null;
        }

        $calendarId = $this->settingsModel->getSetting('google_calendar_id', 'primary');
        
        try {
            $event = new \Google\Service\Calendar\Event([
                'summary'     => $eventData['summary'],
                'description' => $eventData['description'] ?? '',
                'start' => [
                    'dateTime' => $eventData['start'],
                    'timeZone' => self::DEFAULT_TIMEZONE,
                ],
                'end' => [
                    'dateTime' => $eventData['end'],
                    'timeZone' => self::DEFAULT_TIMEZONE,
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
        } catch (\Exception $e) {
            log_message('error', '[GoogleCalendar] Event creation error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Update a calendar event.
     */
    public function updateEvent(string $eventId, array $eventData): bool
    {
        if (!$this->isConnected()) {
            return false;
        }

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
                $event->getStart()->setTimeZone(self::DEFAULT_TIMEZONE);
            }
            if (isset($eventData['end'])) {
                $event->getEnd()->setDateTime($eventData['end']);
                $event->getEnd()->setTimeZone(self::DEFAULT_TIMEZONE);
            }

            $this->service->events->update($calendarId, $eventId, $event);
            return true;
        } catch (\Exception $e) {
            log_message('error', '[GoogleCalendar] Event update error: ' . $e->getMessage() . " (ID: $eventId)");
            return false;
        }
    }

    /**
     * Delete a calendar event.
     */
    public function deleteEvent(string $eventId): bool
    {
        if (!$this->isConnected()) {
            return false;
        }

        $calendarId = $this->settingsModel->getSetting('google_calendar_id', 'primary');
        try {
            $this->service->events->delete($calendarId, $eventId);
            return true;
        } catch (\Exception $e) {
            log_message('error', '[GoogleCalendar] Event deletion error: ' . $e->getMessage() . " (ID: $eventId)");
            return false;
        }
    }
}
