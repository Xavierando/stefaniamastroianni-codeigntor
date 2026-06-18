<?php

namespace App\Controllers\Api\Concerns;

/**
 * Builds URL-safe slugs that are guaranteed unique on the model's `slug` column,
 * appending -2, -3, … on collision. Prevents two items sharing a URL (which made
 * the second item unreachable, since show() resolves by first() match).
 */
trait GeneratesSlug
{
    protected function uniqueSlug($model, string $source, $excludeId = null): string
    {
        $base = strtolower(trim(preg_replace('/[^A-Za-z0-9]+/', '-', $source), '-'));
        if ($base === '') {
            $base = 'item';
        }

        $slug   = $base;
        $suffix = 2;
        while ($this->slugExists($model, $slug, $excludeId)) {
            $slug = $base . '-' . $suffix;
            $suffix++;
        }

        return $slug;
    }

    private function slugExists($model, string $slug, $excludeId): bool
    {
        $builder = $model->where('slug', $slug);
        if ($excludeId !== null && $excludeId !== '') {
            $builder->where('id !=', $excludeId);
        }

        return $builder->countAllResults() > 0;
    }
}
