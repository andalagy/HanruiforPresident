export const factors = [
  { label: 'Charisma', max: 100, hint: 'Can he make a room forget why it was angry?' },
  { label: 'Political plot armor', max: 100, hint: 'Screenwriters are standing by.' },
  { label: 'International luck', max: 100, hint: 'The universe owes him a favor.' },
  { label: 'Diplomatic skills', max: 100, hint: 'Advanced nodding and strategic smiling.' },
  { label: 'Awkward handshake survival', max: 100, hint: 'The handshake is still happening.' },
  { label: 'Main character energy', max: 100, hint: 'Background music follows him everywhere.' },
  { label: 'Kimchi consumption', max: 10, hint: 'A completely made-up fermented multiplier.' },
  { label: 'Historical plot twist', max: 1000, hint: 'History has stopped reading the script.' },
];
export const defaults = [65, 42, 78, 50, 85, 72, 4, 250];
export const scenarios = [
  { title: 'The clerical error timeline', text: 'An intern puts Hanrui’s name on the wrong form. He is now a presidential candidate. Nobody wants to redo the paperwork.', multiplier: 4.7 },
  { title: 'Rock. Paper. Presidency.', text: 'Hanrui wins an international rock-paper-scissors championship. The trophy comes with a suspicious amount of executive power.', multiplier: 19 },
  { title: 'The meeting that never ended', text: 'Appointed Supreme Director of Extremely Important Meetings, Hanrui accidentally chairs the entire imaginary government.', multiplier: 8.2 },
  { title: 'A minor time-machine incident', text: 'A malfunctioning time machine lands Hanrui at the inauguration of a country that has never existed. The sash fits perfectly.', multiplier: 43 },
  { title: 'The nonexistent election', text: 'Hanrui accidentally wins an election that does not exist. Turnout: one. The voter: also Hanrui.', multiplier: 12 },
  { title: 'The fantasy inauguration', text: 'In this explicitly fictional fantasy universe, everyone elects Hanrui. Even the ballot box applauds. A perfectly imaginary 100%.', multiplier: 1, fantasy: true },
];
// FNV-style seed hash and a local PRNG: equal inputs always produce equal outputs.
export function randomFrom(seed: string) {
  let n = 2166136261;
  for (const c of seed) n = Math.imul(n ^ c.charCodeAt(0), 16777619);
  return () => { n += 0x6D2B79F5; let t = Math.imul(n ^ n >>> 15, 1 | n); t ^= t + Math.imul(t ^ t >>> 7, 61 | t); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function timelineFor(seed: string, index: number) { return Math.floor(randomFrom(`${seed}:timeline:${index}`)() * scenarios.length); }
export function simulate(values: number[], seed: string, chaos: boolean, timeline: number | null) {
  const rng = randomFrom(seed);
  const quantum = chaos ? 0.15 + rng() * 39.85 : 1;
  const multiplier = values.reduce((product, value, i) => product * (1 + Math.max(0, Math.min(value, factors[i].max)) / factors[i].max * 18), 1);
  const scenario = timeline === null ? null : scenarios[timeline];
  const probability = scenario?.fantasy ? 100 : Math.min(99.999, 1e-12 * multiplier * quantum * (scenario?.multiplier ?? 1));
  const chart = Array.from({length: 25}, (_, i) => ({ year: 1948 + Math.round(i * 78 / 24), likelihood: i === 24 ? probability : probability * (0.04 + rng() * 0.58) * (0.2 + i / 30) }));
  return { probability, quantum, chart, rating: ['Alarmingly polite', 'Weaponized small talk', 'Ambassador of awkward', 'Surprisingly potato-like'][Math.floor(rng() * 4)] };
}
export function formatProbability(p: number) { return p >= 1 ? p.toFixed(3) : p.toFixed(12).replace(/0+$/, '').replace(/\.$/, ''); }
export const achievementInfo = [
  { id: 'potato', name: 'Diplomatic Potato', description: 'Reach at least 1 charisma.', icon: '🥔' },
  { id: 'mystery', name: 'International Mystery Man', description: 'Max out political plot armor.', icon: '🕶️' },
  { id: 'tiny', name: 'Statistical Impossibility', description: 'Calculate a probability below 0.000001%.', icon: '🚀' },
  { id: 'president', name: 'Alternate Universe President', description: 'Discover the 100% fictional fantasy timeline.', icon: '👑' },
  { id: 'broken', name: 'Economist’s Worst Nightmare', description: 'Calculate with every factor at maximum, or break mathematics.', icon: '📉' },
];
export function unlockedFor(values: number[], p: number) { return [values[0] >= 1 && 'potato', values[1] === 100 && 'mystery', p < 1e-6 && 'tiny', p >= 100 && 'president', (values.every((v,i) => v === factors[i].max) || p > 100) && 'broken'].filter(Boolean) as string[]; }
