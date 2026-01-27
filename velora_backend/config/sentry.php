<?php

return [
    'dsn' => env('SENTRY_LARAVEL_DSN', env('SENTRY_DSN')),
    'release' => env('APP_VERSION'),
    'environment' => env('APP_ENV'),
    'traces_sample_rate' => (float) (env('SENTRY_TRACES_SAMPLE_RATE', 0.0)),
    'profiles_sample_rate' => (float) (env('SENTRY_PROFILES_SAMPLE_RATE', 0.0)),
    'send_default_pii' => false,
    'in_app_exclude' => [
        app_path('Providers'),
    ],
    'in_app_include' => [
        app_path(),
    ],
    'report_exception_handler_invocations' => true,
];
