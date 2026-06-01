export type Attribute = 'seiryu' | 'hakuryu' | 'kokuryu' | 'kinryu'

export type Choice = {
  text: string
  attribute: Attribute
}

export type Question = {
  id: number
  question: string
  choices: Choice[]
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: '今、目を閉じると、ふっと浮かぶ景色は？',
    choices: [
      { text: '山の稜線 ― 風が抜けていく場所', attribute: 'seiryu' },
      { text: '夜の水辺 ― 月光がやわらかく揺れる', attribute: 'hakuryu' },
      { text: '夜の森 ― 小さく灯る火のそば', attribute: 'kokuryu' },
      { text: '夕暮れの稲田 ― 黄金色に染まる', attribute: 'kinryu' },
    ],
  },
  {
    id: 2,
    question: 'あなたを表すとしたら、どの時刻が近い?',
    choices: [
      { text: '夜明け ― 薄青に染まる時間', attribute: 'seiryu' },
      { text: '白い夕暮れ ― 月がのぼる前', attribute: 'hakuryu' },
      { text: '深い夜更け ― 灯りが落ちて', attribute: 'kokuryu' },
      { text: '日の入り前 ― すべてが黄金に染まる', attribute: 'kinryu' },
    ],
  },
  {
    id: 3,
    question: '大切な人が傷ついている時、最初にかけたい言葉は?',
    choices: [
      { text: '「ゆっくりでいい、一緒に進もう」 ― 寄り添う前進', attribute: 'seiryu' },
      { text: '「無理しないで、そばにいるよ」 ― やわらかな受容', attribute: 'hakuryu' },
      { text: '「本当はどう感じている?」 ― 静かな深さ', attribute: 'kokuryu' },
      { text: '「あなたは満たされる人」 ― 豊かさの祈り', attribute: 'kinryu' },
    ],
  },
  {
    id: 4,
    question: '自分が一番「自分らしく」いられるのは?',
    choices: [
      { text: '始まりの瞬間 ― 何かを動かす時', attribute: 'seiryu' },
      { text: '支える時間 ― 誰かに寄り添う時', attribute: 'hakuryu' },
      { text: '向き合う夜 ― 一人になる時', attribute: 'kokuryu' },
      { text: '巡る場所 ― 豊かさが流れる時', attribute: 'kinryu' },
    ],
  },
  {
    id: 5,
    question: 'もし神社で、深く願うことを選ぶなら?',
    choices: [
      { text: '追い風を ― 進むべき方角へ', attribute: 'seiryu' },
      { text: '静けさを ― 心のゆるしへ', attribute: 'hakuryu' },
      { text: '答えを ― 自分の真ん中へ', attribute: 'kokuryu' },
      { text: '豊かさを ― 巡り満ちる流れへ', attribute: 'kinryu' },
    ],
  },
  {
    id: 6,
    question: '今、心が引き寄せられる色は?',
    choices: [
      { text: '夜明け前の蒼 ― 深く澄んだ青', attribute: 'seiryu' },
      { text: '月の白 ― 霧のように淡い', attribute: 'hakuryu' },
      { text: '夜の藍 ― 漆のように深い', attribute: 'kokuryu' },
      { text: '稲穂の金 ― やわらかく光る', attribute: 'kinryu' },
    ],
  },
  {
    id: 7,
    question: '心が疲れた日、あなたを静かに救うのは?',
    choices: [
      { text: '外の空気 ― ただ吸い込むこと', attribute: 'seiryu' },
      { text: '湯と眠り ― 身を沈めること', attribute: 'hakuryu' },
      { text: 'ひとり時間 ― 何も話さないこと', attribute: 'kokuryu' },
      { text: 'ゆっくりの食 ― ただ味わうこと', attribute: 'kinryu' },
    ],
  },
  {
    id: 8,
    question: 'あなたの根っこにある一語は?',
    choices: [
      { text: '自由 ― 進み続けるための言葉', attribute: 'seiryu' },
      { text: '優しさ ― 受け入れるための言葉', attribute: 'hakuryu' },
      { text: '真実 ― 自分と向き合うための言葉', attribute: 'kokuryu' },
      { text: '豊かさ ― 巡らせるための言葉', attribute: 'kinryu' },
    ],
  },
  {
    id: 9,
    question: 'もしあなたが龍だったら、どこに棲む?',
    choices: [
      { text: '雲の海へ ― 風の通り道', attribute: 'seiryu' },
      { text: '静かな湖の底へ ― 月光が差す場所', attribute: 'hakuryu' },
      { text: '深い洞穴へ ― 星が見える夜', attribute: 'kokuryu' },
      { text: '黄金の宮殿へ ― 人が集う場所', attribute: 'kinryu' },
    ],
  },
  {
    id: 10,
    question: 'あなたが守護龍に、そっと望むことは?',
    choices: [
      { text: '背中をかすめてほしい ― 進む先で', attribute: 'seiryu' },
      { text: 'ただそばにいてほしい ― 何も言わず', attribute: 'hakuryu' },
      { text: '本当の自分を映してほしい ― 静かに', attribute: 'kokuryu' },
      { text: '豊かさへ導いてほしい ― 優しく', attribute: 'kinryu' },
    ],
  },
]

export const ATTRIBUTE_LABELS: Record<Attribute, string> = {
  seiryu: '青龍',
  hakuryu: '白龍',
  kokuryu: '黒龍',
  kinryu: '金龍',
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function decideAttribute(answers: Attribute[]): {
  main: Attribute
  sub: Attribute
} {
  const count: Record<Attribute, number> = {
    seiryu: 0,
    hakuryu: 0,
    kokuryu: 0,
    kinryu: 0,
  }
  answers.forEach((a) => count[a]++)

  const sorted = (Object.entries(count) as [Attribute, number][]).sort(
    ([, a], [, b]) => b - a
  )

  // 最多が同点の場合は最後の答えを採用
  if (sorted[0][1] === sorted[1][1]) {
    return { main: answers[answers.length - 1], sub: sorted[1][0] }
  }

  return { main: sorted[0][0], sub: sorted[1][0] }
}
