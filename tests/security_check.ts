import { isSafeRedirectPath } from '../src/lib/security';

const testCases = [
  { input: '/dashboard', expected: true },
  { input: '/app/settings', expected: true },
  { input: '/', expected: true },
  { input: 'https://evil.com', expected: false },
  { input: '//evil.com', expected: false },
  { input: '/\\evil.com', expected: false },
  { input: 'javascript:alert(1)', expected: false },
  { input: '', expected: false },
  { input: null, expected: false },
  { input: undefined, expected: false },
  { input: '/foo\r\nbar', expected: false },
];

let failed = false;

console.log('Running security checks for isSafeRedirectPath...');

for (const { input, expected } of testCases) {
  const result = isSafeRedirectPath(input as any);
  if (result !== expected) {
    console.error(`❌ FAILED: Input "${input}" | Expected ${expected} | Got ${result}`);
    failed = true;
  } else {
    console.log(`✅ PASS: "${input}"`);
  }
}

if (failed) {
  console.error('Security checks FAILED');
  process.exit(1);
} else {
  console.log('All security checks PASSED');
}
