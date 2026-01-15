
import { createClientSchema } from './schemas';
import { z } from 'zod';

console.log('Running Schema Tests...');
let failed = false;

function assert(condition: boolean, message: string) {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        failed = true;
    } else {
        console.log(`✅ PASS: ${message}`);
    }
}

const validData = {
  name: 'John Doe',
  phone: '(11) 91234-5678',
  email: 'john@example.com',
};

// Test 1: Valid Data
try {
  createClientSchema.parse(validData);
  assert(true, 'Valid data parsed successfully');
} catch (e) {
  assert(false, `Valid data rejected: ${e}`);
}

// Test 2: Invalid Name
try {
  createClientSchema.parse({ ...validData, name: 'A' });
  assert(false, 'Invalid name accepted');
} catch (e) {
  assert(e instanceof z.ZodError, 'Invalid name rejected');
}

// Test 3: Empty Phone
try {
  createClientSchema.parse({ ...validData, phone: '' });
  assert(true, 'Empty phone accepted');
} catch (e) {
  assert(false, `Empty phone rejected: ${e}`);
}

// Test 4: Missing Phone Field
try {
    const noPhone: any = { ...validData };
    delete noPhone.phone;
    createClientSchema.parse(noPhone);
    assert(false, 'Missing phone field accepted (Schema should require string)');
} catch (e) {
    assert(e instanceof z.ZodError, 'Missing phone field rejected by schema (Action converts it to empty string)');
}

if (failed) {
    console.error('\nTests FAILED');
    process.exit(1);
} else {
    console.log('\nAll tests PASSED');
    process.exit(0);
}
