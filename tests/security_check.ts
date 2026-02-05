import { isSafeRedirectPath } from '../src/lib/security';

console.log('🛡️  Running Security Checks...\n');

const testCases = [
  { path: '/app/dashboard', expected: true, desc: 'Valid internal path' },
  { path: '/', expected: true, desc: 'Root path' },
  { path: '/profile?id=123', expected: true, desc: 'Path with query params' },
  { path: 'https://evil.com', expected: false, desc: 'Absolute URL' },
  { path: '//evil.com', expected: false, desc: 'Protocol relative URL' },
  { path: '/\\evil.com', expected: false, desc: 'Backslash bypass attempt' },
  { path: 'javascript:alert(1)', expected: false, desc: 'Javascript scheme' },
  { path: '/app\n/dashboard', expected: false, desc: 'Newline injection' },
  { path: '', expected: false, desc: 'Empty string' },
  { path: null, expected: false, desc: 'Null input' },
  { path: undefined, expected: false, desc: 'Undefined input' },
];

let failed = false;

testCases.forEach(({ path, expected, desc }) => {
  const result = isSafeRedirectPath(path as any);
  if (result !== expected) {
    console.error(`❌ FAILED: ${desc}`);
    console.error(`   Input: "${path}"`);
    console.error(`   Expected: ${expected}, Got: ${result}\n`);
    failed = true;
  } else {
    console.log(`✅ PASSED: ${desc}`);
  }
});

if (failed) {
  console.error('\n❌ Security check FAILED');
  process.exit(1);
} else {
  console.log('\n✅ All security checks PASSED');
  process.exit(0);
}
