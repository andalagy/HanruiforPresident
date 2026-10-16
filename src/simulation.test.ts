import { test } from 'node:test';
import assert from 'node:assert/strict';
import { defaults, factors, simulate, timelineFor, unlockedFor, formatProbability } from './simulation.ts';
test('identical seeds reproduce quantum modifiers and complete charts', () => {
  assert.deepEqual(simulate(defaults, 'HC-001', true, 2), simulate(defaults, 'HC-001', true, 2));
  assert.notEqual(simulate(defaults, 'HC-001', true, 2).quantum, simulate(defaults, 'HC-002', true, 2).quantum);
  assert.equal(timelineFor('42', 4), timelineFor('42', 4));
});
test('zero factors preserve the tiny baseline and sliders change it', () => {
  assert.equal(simulate(factors.map(() => 0), '42', false, null).probability, 1e-12);
  assert.ok(simulate(defaults, '42', false, null).probability > 1e-12);
  assert.equal(formatProbability(1e-12), '0.000000000001');
});
test('100% only occurs in the explicitly fictional fantasy timeline', () => {
  assert.equal(simulate(defaults, '42', false, 5).probability, 100);
  assert.ok(simulate(factors.map(f => f.max), '42', true, 3).probability < 100);
});
test('all five achievements have reachable triggers', () => {
  assert.deepEqual(unlockedFor(factors.map(f => f.max), 999.999), ['potato','mystery','president','broken']);
  assert.ok(unlockedFor(defaults, 1e-12).includes('tiny'));
});
