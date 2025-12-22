import re

# Read the SaasLandingPage file
try:
    with open('src/modules/website/SaasLandingPage.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
except:
    with open('src/modules/website/SaasLandingPage.tsx', 'r', encoding='latin-1') as f:
        content = f.read()

# Check if file already has 'use client' directive
has_use_client = "'use client'" in content or '"use client"' in content

# Prepare the imports to add
new_imports = """'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
"""

# If doesn't have 'use client', add all imports at the top
if not has_use_client:
    # Find the first import statement and replace with our imports
    content = re.sub(
        r"import Link from 'next/link';",
        new_imports,
        content,
        count=1
    )
    print("✅ Added 'use client' and necessary imports")
else:
    # Just ensure useState and useRouter are imported
    if 'useState' not in content:
        content = re.sub(
            r"(import.*from 'react';)",
            r"import { useState } from 'react';",
            content
        )
    if 'useRouter' not in content:
        content = content.replace(
            "import Link from 'next/link';",
            "import Link from 'next/link';\nimport { useRouter } from 'next/navigation';"
        )
    print("✅ Ensured all necessary imports exist")

# Add state and router initialization at the beginning of component
# Find the component function and add state
component_start_pattern = r"(export default function SaasLandingPage\(\)\s*\{)"
router_state_code = r"""\1
  const router = useRouter();
  const [reservedSlug, setReservedSlug] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSlugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reservedSlug.trim()) {
      router.push(`/register?slug=${reservedSlug.trim()}`);
    }
  };
"""

content = re.sub(component_start_pattern, router_state_code, content)
print("✅ Added slug reservation logic (useState + handleSlugSubmit)")

# Write the file back
with open('src/modules/website/SaasLandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n=== SLUG INPUT LOGIC ADDED ===")
print("Now you need to manually update the Hero Section input to use:")
print("  - value={reservedSlug}")
print("  - onChange={(e) => setReservedSlug(e.target.value)}")
print("  - onSubmit={handleSlugSubmit}")
print("\nFile saved!")
