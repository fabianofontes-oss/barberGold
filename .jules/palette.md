## 2024-10-26 - Accessibility Gaps in Complex UI
**Learning:** Dense interfaces like the Point of Sale (POS) often sacrifice accessibility for density, relying heavily on icon-only buttons without labels.
**Action:** Audit high-density modules (`src/modules/pdv`, `src/modules/agenda`) for missing ARIA labels on icon buttons to ensure keyboard/screen-reader usability.
