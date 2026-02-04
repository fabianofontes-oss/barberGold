import { isSafeRedirectPath } from '../src/lib/validation/url';

const testCases = [
  { path: '/app/dashboard', expected: true, description: 'Valid relative path' },
  { path: '/login', expected: true, description: 'Valid relative path' },
  { path: '/', expected: true, description: 'Root path' },
  { path: '/app/settings?foo=bar', expected: true, description: 'Path with query params' },

  // Vulnerability vectors
  { path: 'https://evil.com', expected: false, description: 'Absolute URL (https)' },
  { path: 'http://evil.com', expected: false, description: 'Absolute URL (http)' },
  { path: '//evil.com', expected: false, description: 'Protocol relative URL' },
  { path: '\\\\evil.com', expected: false, description: 'Backslashes' },
  { path: '/\\evil.com', expected: false, description: 'Slash then backslash' },
  { path: 'javascript:alert(1)', expected: false, description: 'Javascript scheme' },
  { path: 'data:text/html,<script>alert(1)</script>', expected: false, description: 'Data scheme' },
  { path: '  /app', expected: false, description: 'Leading space' },
  { path: '', expected: false, description: 'Empty string' },
  { path: null as any, expected: false, description: 'Null' },
  { path: undefined as any, expected: false, description: 'Undefined' },
];

let failed = false;

console.log('🛡️  Verifying URL Security Logic...\n');

testCases.forEach(({ path, expected, description }) => {
  const result = isSafeRedirectPath(path);
  if (result !== expected) {
    console.error(`❌ FAILED: ${description}`);
    console.error(`   Input: "${path}"`);
    console.error(`   Expected: ${expected}, Got: ${result}`);
    failed = true;
  } else {
    console.log(`✅ PASSED: ${description}`);
  }
});

if (failed) {
  console.error('\n❌ Security verification FAILED');
  process.exit(1);
} else {
  console.log('\n✅ Security verification PASSED');
  process.exit(0);
}
