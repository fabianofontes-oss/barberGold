## 2024-05-23 - [Input Validation for Auth Actions]
**Vulnerability:** Missing input validation in server actions (signInWithPasswordAction, signUpAction) allowed potentially invalid or malicious data to be passed directly to the Supabase client.
**Learning:** Even when using a BAAS like Supabase, input validation should happen at the application boundary (Server Actions) to fail fast and provide better error feedback.
**Prevention:** Implemented Zod schemas for all auth inputs and validated them before calling external services. This pattern should be applied to all Server Actions.
