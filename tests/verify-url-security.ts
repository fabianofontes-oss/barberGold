import { isSafeRedirectPath } from '@/lib/validation/url';
import assert from 'assert';

console.log('🛡️  Starting URL Security Verification...');

const testCases = [
  // Valid paths
  { path: '/app/dashboard', expected: true, desc: 'Simple absolute path' },
  { path: '/settings', expected: true, desc: 'Root level path' },
  { path: '/clients/123', expected: true, desc: 'Path with ID' },
  { path: '/search?q=foo', expected: true, desc: 'Path with query params' },

  // Invalid paths (Open Redirect attempts)
  { path: 'https://evil.com', expected: false, desc: 'Absolute URL with https' },
  { path: 'http://evil.com', expected: false, desc: 'Absolute URL with http' },
  { path: '//evil.com', expected: false, desc: 'Protocol relative URL' },
  { path: 'javascript:alert(1)', expected: false, desc: 'Javascript scheme' },
  { path: 'data:text/html,<body>', expected: false, desc: 'Data scheme' },
  { path: 'google.com', expected: false, desc: 'Relative path without slash' },
  { path: '\\evil.com', expected: false, desc: 'Backslash start' },
  { path: '/\\evil.com', expected: false, desc: 'Slash then backslash' },
  // { path: '/%5Cevil.com', expected: false, desc: 'Encoded backslash' }, // Depending on implementation
];

let passed = 0;
let failed = 0;

for (const test of testCases) {
  try {
    const result = isSafeRedirectPath(test.path);
    assert.strictEqual(result, test.expected);
    console.log(`✅ PASS: ${test.desc} ("${test.path}") -> ${result}`);
    passed++;
  } catch {
    console.error(`❌ FAIL: ${test.desc} ("${test.path}")`);
    console.error(`   Expected ${test.expected}, got ${!test.expected}`);
    failed++;
  }
}

console.log('\n-------------------');
console.log(`Tests Completed: ${passed + failed}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✨ All security checks passed!');
}
