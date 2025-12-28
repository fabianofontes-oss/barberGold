## 2024-12-27 - LCP Optimization for Hero Images
**Learning:** Using `next/image` with `priority` and `sizes` for the largest image above the fold significantly improves LCP (Largest Contentful Paint) compared to using CSS `backgroundImage`.
**Action:** Always check the Hero section for unoptimized images (especially CSS backgrounds) and replace them with `<Image priority />` where possible.
