import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Traceability
    tracesSampleRate: 1.0,

    // Environment
    environment: process.env.NODE_ENV,
});
