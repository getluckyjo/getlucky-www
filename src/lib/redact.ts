/**
 * Keep credentials out of the logs.
 *
 * Database drivers are careless about this. `@neondatabase/serverless` puts the
 * entire connection string — password and all — into the message of the error
 * it throws on a malformed URL. Our route catches that error and logs the
 * message, so a single typo in an environment variable wrote a live database
 * password into the platform log, where it stays until the retention window
 * rolls and is readable by anyone with access to the project.
 *
 * That happened on 24 August 2026 while wiring up the WhatsApp lead feed. The
 * password had to be rotated. The fix is not to be more careful — it is to make
 * the careless case safe.
 */

/**
 * Strip `user:password@` out of any URL in a string.
 *
 * Deliberately blunt. It runs over an error message we did not write and cannot
 * predict, so it looks for the shape of a credential rather than trying to
 * parse the message. The username survives, because knowing which role failed
 * is the useful half of the diagnosis and is not a secret.
 */
export function redactSecrets(text: string): string {
  return text.replace(
    // scheme://user:password@  →  scheme://user:REDACTED@
    /([a-z][a-z0-9+.-]*:\/\/)([^\s:/@]+):([^\s@]+)@/gi,
    "$1$2:REDACTED@",
  );
}

/** The same, for whatever an unknown `catch` gives us. */
export function safeErrorMessage(error: unknown): string {
  return redactSecrets(error instanceof Error ? error.message : String(error));
}
