## 2024-05-22 - [Server Action Input Validation]
**Vulnerability:** Missing server-side input validation in authentication Server Actions (`signInWithPasswordAction`, `signUpAction`). While client-side validation might exist, bypassing it (e.g., via direct API calls) could allow invalid data to reach the authentication provider or cause unnecessary API calls.
**Learning:** Even when using a backend-as-a-service like Supabase, "middle-man" Server Actions must still validate input to ensure data integrity and fail fast before making external network calls.
**Prevention:** Always implement a Zod schema for every Server Action and validate the input (`schema.safeParse`) as the very first step in the function.
