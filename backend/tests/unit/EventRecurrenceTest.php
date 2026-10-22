<?php

use App\Models\EventModel;
use CodeIgniter\Test\CIUnitTestCase;

/**
 * @internal
 */
final class EventRecurrenceTest extends CIUnitTestCase
{
    private function series(string $start, ?string $end, int $interval = 7): array
    {
        return [
            'date'                     => $start,
            'recurrence_interval_days' => $interval,
            'recurrence_end_date'      => $end,
        ];
    }

    private function resolve(array $event, string $now): array
    {
        return EventModel::resolveOccurrence($event, new DateTimeImmutable($now));
    }

    public function testSingleEventIsUnchanged(): void
    {
        $event = $this->resolve(['date' => '2026-10-01 18:00:00', 'recurrence_interval_days' => null], '2026-10-22 12:00:00');

        $this->assertFalse($event['is_recurring']);
        $this->assertSame('2026-10-01 18:00:00', $event['date']);
    }

    public function testBeforeSeriesStartShowsFirstDate(): void
    {
        $event = $this->resolve($this->series('2026-11-02 18:00:00', '2026-12-31'), '2026-10-22 12:00:00');

        $this->assertTrue($event['is_recurring']);
        $this->assertSame('2026-11-02 18:00:00', $event['date']);
        $this->assertSame('2026-11-02 18:00:00', $event['series_start']);
    }

    public function testJumpsToNextOccurrenceOncePassed(): void
    {
        // Gio 1 ottobre 18:00, ogni 7 giorni: il 22 alle 12 la prossima e il 22 alle 18.
        $event = $this->resolve($this->series('2026-10-01 18:00:00', '2026-12-31'), '2026-10-22 12:00:00');
        $this->assertSame('2026-10-22 18:00:00', $event['date']);

        // Il 22 alle 19 quella occorrenza e iniziata: si passa al 29.
        $event = $this->resolve($this->series('2026-10-01 18:00:00', '2026-12-31'), '2026-10-22 19:00:00');
        $this->assertSame('2026-10-29 18:00:00', $event['date']);
    }

    public function testKeepsLocalTimeAcrossDstChange(): void
    {
        // In Italia l'ora legale finisce il 25 ottobre 2026.
        $event = $this->resolve($this->series('2026-10-20 18:00:00', '2026-12-31'), '2026-10-28 12:00:00');

        $this->assertSame('2026-11-03 18:00:00', $event['date']);
    }

    public function testDoesNotGoPastEndDate(): void
    {
        // Ultima occorrenza utile: 29 ottobre (il 5 novembre supera la fine).
        $event = $this->resolve($this->series('2026-10-01 18:00:00', '2026-11-03'), '2026-10-30 12:00:00');

        $this->assertSame('2026-10-29 18:00:00', $event['date']);
    }

    public function testOccurrenceOnEndDateIsIncluded(): void
    {
        $event = $this->resolve($this->series('2026-10-01 18:00:00', '2026-10-29'), '2026-10-23 12:00:00');

        $this->assertSame('2026-10-29 18:00:00', $event['date']);
    }

    public function testCustomInterval(): void
    {
        $event = $this->resolve($this->series('2026-10-01 18:00:00', '2026-12-31', 14), '2026-10-02 12:00:00');

        $this->assertSame('2026-10-15 18:00:00', $event['date']);
    }
}
