import { isSafeRedirectPath } from '../src/lib/validation/url';
import assert from 'assert';

console.log('Running URL validation tests...');

const testCases = [
  // Safe paths
  { input: '/dashboard', expected: true, desc: 'Simple path' },
  { input: '/app/dashboard', expected: true, desc: 'Nested path' },
  { input: '/app/settings?tab=profile', expected: true, desc: 'Path with query params' },
  { input: '/login', expected: true, desc: 'Login path' },

  // Unsafe paths
  { input: 'https://evil.com', expected: false, desc: 'Absolute URL' },
  { input: 'http://evil.com', expected: false, desc: 'Absolute URL (http)' },
  { input: '//evil.com', expected: false, desc: 'Protocol relative URL' },
  { input: '\\\\evil.com', expected: false, desc: 'Backslashes' },
  { input: '/\\evil.com', expected: false, desc: 'Mixed slashes' },
  { input: 'javascript:alert(1)', expected: false, desc: 'Javascript URI' },
  { input: '/javascript:alert(1)', expected: true, desc: 'Path looking like js (safe as path)' }, // Technically this is a file named "javascript:alert(1)" at root.
  { input: '', expected: false, desc: 'Empty string' },
  { input: null, expected: false, desc: 'Null' },
  { input: undefined, expected: false, desc: 'Undefined' },
  { input: '   /trim', expected: false, desc: 'Leading whitespace' }, // Starts with space, not /
];

let failed = false;

testCases.forEach(({ input, expected, desc }) => {
  try {
    const result = isSafeRedirectPath(input as any);
    assert.strictEqual(result, expected);
    console.log(`✅ ${desc}`);
  } catch (e) {
    console.error(`❌ ${desc}: expected ${expected}, got ${!expected}`);
    failed = true;
  }
});

if (failed) {
  console.error('Some tests failed!');
  process.exit(1);
} else {
  console.log('All tests passed!');
}
