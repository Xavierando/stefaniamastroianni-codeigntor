<?php

namespace App\Libraries;

/**
 * Errore di backup/ripristino con un messaggio pensato per l'admin: il
 * controller lo mostra cosi com'e, mentre gli altri errori restano nel log.
 */
class BackupException extends \RuntimeException
{
}
