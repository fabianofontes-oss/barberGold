import re
import sys

# Read the file with UTF-8 encoding
try:
    with open('src/modules/website/SaasLandingPage.tsx', 'r', encoding='utf-8') as f:
        content = f.read()
except:
    print("Error reading file with UTF-8, trying latin-1")
    with open('src/modules/website/SaasLandingPage.tsx', 'r', encoding='latin-1') as f:
        content = f.read()

# Track changes
changes_made = []

# 1. Fix Login link in header
old_login = r'<a\s+className="[^"]*"\s+href="#">Login</a>'
new_login = '<Link href="/login" className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg transition-all">Login</Link>'
if re.search(old_login, content, re.IGNORECASE):
    content = re.sub(old_login, new_login, content, flags=re.IGNORECASE)
    changes_made.append("✅ Fixed Login link")

# 2. Fix "Começar Teste" buttons
content = re.sub(
    r'(<[aA]\s+[^>]*href=)["\']#["\']([^>]*>Começar[^<]*</[aA]>)',
    r'\1"/register"\2',
    content
)
changes_made.append("✅ Fixed 'Começar Teste' buttons")

# 3. Fix Pricing plan links
content = re.sub(
    r'(<Link\s+href=)["\']#["\']([^>]*>Escolher Start)',
    r'\1="/register?plan=start"\2',
    content
)
content = re.sub(
    r'(<Link\s+href=)["\']#["\']([^>]*>Escolher Pro)',
    r'\1="/register?plan=pro"\2',
    content
)
content = re.sub(
    r'(<Link\s+href=)["\']#["\']([^>]*>Escolher Empire)',
    r'\1="/register?plan=empire"\2',
    content
)
changes_made.append("✅ Fixed Pricing plan links (Start, Pro, Empire)")

# 4. Fix footer links (keep as # since they're just footer links)
# Termos, Privacidade, Contato can stay as # for now

# Write the modified content back
with open('src/modules/website/SaasLandingPage.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n=== TASK 1 COMPLETED ===")
for change in changes_made:
    print(change)
print("\nFile saved successfully!")
