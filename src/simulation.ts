export const factors = [
  { label: '个人魅力', max: 100, hint: '他能让全场忘记刚才为什么生气吗？' },
  { label: '政治剧情护甲', max: 100, hint: '编剧已经就位。' },
  { label: '国际运气', max: 100, hint: '宇宙欠他一个人情。' },
  { label: '外交技巧', max: 100, hint: '高级点头术与战略性微笑。' },
  { label: '尴尬握手生存力', max: 100, hint: '这场握手还没有结束。' },
  { label: '主角光环', max: 100, hint: '背景音乐始终如影随形。' },
  { label: '泡菜摄入量', max: 10, hint: '一项发酵而成的神秘加成。' },
  { label: '历史反转系数', max: 1000, hint: '历史已经不按剧本走了。' },
];
export const defaults = [65, 42, 78, 50, 85, 72, 4, 250];
export const scenarios = [
  { title: '文书乌龙时间线', text: '实习生把最高领袖陈汉瑞的名字填错了表格。如今他成了最高领袖候选人，而所有人都不愿意重做手续。', multiplier: 4.7 },
  { title: '石头、剪刀、最高领袖。', text: '最高领袖陈汉瑞赢得国际石头剪刀布大赛。奖杯附赠了多得可疑的行政权力。', multiplier: 19 },
  { title: '永不散会的会议', text: '被任命为“极其重要会议最高主任”后，最高领袖陈汉瑞一不留神主持了整个政府。', multiplier: 8.2 },
  { title: '小小的时光机事故', text: '失灵的时光机把最高领袖陈汉瑞送到一个从未存在过的国家的就职典礼。绶带竟然刚好合身。', multiplier: 43 },
  { title: '不存在的选举', text: '最高领袖陈汉瑞意外赢得了一场不存在的选举。投票人数：一。投票人：还是最高领袖陈汉瑞。', multiplier: 12 },
  { title: '陈汉瑞的就职典礼', text: '在这条时间线中，所有人都选举最高领袖陈汉瑞。连投票箱也鼓起了掌。全票通过，百分之百。', multiplier: 1, fantasy: true },
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
  return { probability, quantum, chart, rating: ['礼貌得令人警觉', '闲聊已武器化', '尴尬外交大使', '意外地像一颗土豆'][Math.floor(rng() * 4)] };
}
export function formatProbability(p: number) { return p >= 1 ? p.toFixed(3) : p.toFixed(12).replace(/0+$/, '').replace(/\.$/, ''); }
export const achievementInfo = [
  { id: 'potato', name: '外交土豆', description: '个人魅力达到至少一点。', icon: '🥔' },
  { id: 'mystery', name: '国际神秘人物', description: '将政治剧情护甲调至最大。', icon: '🕶️' },
  { id: 'tiny', name: '统计学不可能事件', description: '计算出低于 0.000001% 的概率。', icon: '🚀' },
  { id: 'president', name: '最高领袖陈汉瑞', description: '发现陈汉瑞的百分之百就职时间线。', icon: '👑' },
  { id: 'broken', name: '经济学家的噩梦', description: '将所有变量调至最大后计算，或突破数学极限。', icon: '📉' },
];
export function unlockedFor(values: number[], p: number) { return [values[0] >= 1 && 'potato', values[1] === 100 && 'mystery', p < 1e-6 && 'tiny', p >= 100 && 'president', (values.every((v,i) => v === factors[i].max) || p > 100) && 'broken'].filter(Boolean) as string[]; }
