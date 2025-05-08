<?php
class Log
{
    private static $baseDir = __DIR__ . '/logs';

    public static function event($category, $event, $data = [])
    {
        $now = new DateTime();
        $year = $now->format('Y');
        $month = $now->format('m');
        $day = $now->format('d');

        $dir = self::$baseDir . "/$year/$month";
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }

        $filename = "$category-$day.log";
        $file = $dir . '/' . $filename;

        $entry = array_merge([
            'timestamp' => $now->format('Y-m-d H:i:s'),
            'category' => $category,
            'event' => $event
        ], $data);

        file_put_contents($file, json_encode($entry) . PHP_EOL, FILE_APPEND);
    }

    public static function auth($event, $userId = null, $details = [])
    {
        $data = array_merge([
            'userId' => $userId ?? 'guest',
            'ip' => $_SERVER['REMOTE_ADDR']
        ], $details);
        self::event('auth', $event, $data);
    }

    public static function system($event, $competitionId, $details = [])
    {
        $data = array_merge([
            'competitionId' => $competitionId,
        ], $details);
        self::event('system', $event, $data);
    }

}
