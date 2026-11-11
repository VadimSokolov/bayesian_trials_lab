/* Copyright 2026 Nytel. MIT License. Minimal test harness for the Node test runner. */
'use strict';
const tests = [];
function test(name, fn) { tests.push({ name: name, fn: fn }); }
function assert(c, msg) { if (!c) throw new Error(msg || 'assertion failed'); }
function near(a, b, tol, msg) { if (!(Math.abs(a - b) <= tol)) throw new Error((msg || 'near') + ': got ' + a + ', expected ' + b + ' (tol ' + tol + ')'); }
async function run() {
  let pass = 0, fail = 0;
  for (const t of tests) {
    const t0 = Date.now();
    try { await t.fn(); pass++; console.log('PASS  ' + t.name + '  (' + (Date.now() - t0) + ' ms)'); }
    catch (e) { fail++; console.log('FAIL  ' + t.name + '\n      ' + (e && e.message)); }
  }
  console.log('\n' + pass + ' passed, ' + fail + ' failed, ' + tests.length + ' total');
  return fail;
}
module.exports = { test, assert, near, run };
