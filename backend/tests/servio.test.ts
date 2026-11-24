import assert from 'assert';
import { workshopDb } from '../src/db/store';
import { BayScheduler } from '../src/services/bayScheduler';
import { JobCardStateMachine } from '../src/services/jobCardStateMachine';

console.log('🧪 Starting Servio Workshop Platform Test Suite...\n');

workshopDb.seed();

// Test 1: Service Bay Allocation & Conflict Resolution
console.log('▶ Test 1: Workshop Service Bay Scheduling & Conflict Prevention');
const availableBay = workshopDb.bays.find((b) => b.status === 'AVAILABLE')!;
assert.ok(availableBay, 'Must have at least one available bay seeded.');

// Assign bay to a new job card
const assigned = BayScheduler.assignBay(availableBay.id, 'jc-new-2026-002');
assert.strictEqual(assigned.status, 'OCCUPIED');
assert.strictEqual(assigned.currentJobCardId, 'jc-new-2026-002');

// Attempt conflicting assignment to the same bay -> Must throw error!
assert.throws(
  () => {
    BayScheduler.assignBay(availableBay.id, 'jc-conflict-003');
  },
  /Conflict: Bay.*is currently occupied/,
  'Must reject double-booking of physical service bay.'
);
console.log('  ✔ Passed: Bay allocated, double-booking conflict prevented atomically.\n');

// Test 2: Job Card State Machine & Prohibited Transition Prevention
console.log('▶ Test 2: Digital Job Card State Machine Validation');
const testCard = workshopDb.jobCards[0];
assert.strictEqual(testCard.status, 'IN_PROGRESS');

// Attempt prohibited jump: IN_PROGRESS -> INVOICED directly -> Must fail!
assert.throws(
  () => {
    JobCardStateMachine.transitionStatus(testCard.id, 'INVOICED');
  },
  /Invalid lifecycle transition/,
  'Must reject skipping QA_TESTING and COMPLETED stages.'
);

// Valid transition: IN_PROGRESS -> QA_TESTING
const inQa = JobCardStateMachine.transitionStatus(testCard.id, 'QA_TESTING');
assert.strictEqual(inQa.status, 'QA_TESTING');
console.log('  ✔ Passed: Prohibited transition blocked, QA stage advance approved.\n');

// Test 3: Parts & Labor Line Item Billing & 5% VAT Calculation
console.log('▶ Test 3: Parts & Labor Dynamic Ledger & Tax Recalculation');
const initialSubtotal = testCard.subtotal;
JobCardStateMachine.addLineItem(testCard.id, {
  description: 'Brake Pad Replacement Set (Front Axle)',
  type: 'PART',
  quantity: 1,
  unitPrice: 400.0,
});

assert.strictEqual(testCard.subtotal, initialSubtotal + 400.0);
assert.strictEqual(testCard.taxAmount, Number(((initialSubtotal + 400.0) * 0.05).toFixed(2)));
console.log('  ✔ Passed: Labor/Part recorded, VAT recalculated dynamically.\n');

// Test 4: Job Card Completion, Auto Bay Release & Vehicle Telematics Archiving
console.log('▶ Test 4: Job Completion, Bay Release & Service History Archiving');
const vehicle = workshopDb.vehicles.find((v) => v.id === testCard.vehicleId)!;
const initialHistoryCount = vehicle.serviceHistory.length;

// Complete the job card
const completedCard = JobCardStateMachine.transitionStatus(testCard.id, 'COMPLETED');
assert.strictEqual(completedCard.status, 'COMPLETED');

// Bay should now be released
const assignedBay = workshopDb.bays.find((b) => b.id === testCard.assignedBayId)!;
assert.strictEqual(assignedBay.status, 'AVAILABLE');

// Service history should have new record
assert.strictEqual(vehicle.serviceHistory.length, initialHistoryCount + 1);
console.log('  ✔ Passed: Bay released to pool, vehicle service history updated.\n');

console.log('🎉 ALL SERVIO WORKSHOP PLATFORM TESTS PASSED SUCCESSFULLY!');
