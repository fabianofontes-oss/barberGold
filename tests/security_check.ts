
import { isSafeRedirectPath } from '../src/lib/security';

console.log('🛡️ Running Security Verification...');

const tests = [
  // Safe paths
  { input: '/app/dashboard', expected: true, desc: 'Simple path' },
  { input: '/profile', expected: true, desc: 'Simple path 2' },
  { input: '/users/123/edit', expected: true, desc: 'Nested path' },
  { input: '/search?q=test', expected: true, desc: 'Path with query' },

  // Unsafe paths (Open Redirect attempts)
  { input: 'https://evil.com', expected: false, desc: 'Absolute URL (https)' },
  { input: 'http://evil.com', expected: false, desc: 'Absolute URL (http)' },
  { input: '//evil.com', expected: false, desc: 'Protocol relative URL' },
  { input: '\\\\evil.com', expected: false, desc: 'Double backslash' },
  { input: '/\\evil.com', expected: false, desc: 'Slash backslash' },
  { input: 'javascript:alert(1)', expected: false, desc: 'Javascript scheme' },
  { input: ' /google.com', expected: false, desc: 'Leading space' },

  // Control characters
  { input: '/\x00', expected: false, desc: 'Null byte' },
  { input: '/\n', expected: false, desc: 'Newline' },

  // Edge cases
  { input: '', expected: false, desc: 'Empty string' },
  { input: null, expected: false, desc: 'Null' },
  { input: undefined, expected: false, desc: 'Undefined' },
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  const result = isSafeRedirectPath(test.input as any);
  if (result === test.expected) {
    passed++;
  } else {
    console.error(`❌ FAILED: ${test.desc} (Input: "${test.input}") - Expected ${test.expected}, got ${result}`);
    failed++;
  }
});

console.log(`\n✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);

if (failed > 0) {
  console.error('⚠️ Security verification failed!');
  process.exit(1);
} else {
  console.log('✨ All security checks passed!');
}
