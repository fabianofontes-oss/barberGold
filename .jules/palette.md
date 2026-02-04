## 2024-05-23 - Accessibility in Custom Inputs
**Learning:** The `MaskedInput` custom component lacked an `id` prop, forcing developers to leave labels unassociated (or wrap inputs in labels, which isn't always styled correctly). Custom form components must always expose `id` to allow `htmlFor` association.
**Action:** Audit other custom input components (like `SecureSecretInput` or `ImageUpload`) to ensure they forward `id` props for accessibility.
