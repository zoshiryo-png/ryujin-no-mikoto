import { type Attribute } from './questions'

// 属性別の段階名（仕様書通り）
export const DRAGON_STAGES: Record<Attribute, string[]> = {
  seiryu: ['光の珠', '赤ちゃん龍', '小龍', '風龍', '蒼天龍', '天翔青龍'],
  hakuryu: ['光の珠', '赤ちゃん白龍', '小白龍', '霧龍', '月白龍', '天照白龍'],
  kokuryu: ['光の珠', '赤ちゃん黒龍', '小黒龍', '影龍', '深淵龍', '冥導黒龍'],
  kinryu: ['光の珠', '赤ちゃん金龍', '小金龍', '煌龍', '天金龍', '瑞光金龍'],
}

// 各段階に到達する累計日数
export const STAGE_THRESHOLDS = [0, 3, 7, 21, 60, 180]

export function getStage(totalDays: number): number {
  if (totalDays >= 180) return 6
  if (totalDays >= 60) return 5
  if (totalDays >= 21) return 4
  if (totalDays >= 7) return 3
  if (totalDays >= 3) return 2
  return 1
}

export function getStageName(attribute: Attribute, stage: number): string {
  return DRAGON_STAGES[attribute][stage - 1]
}

export function getNextStageName(
  attribute: Attribute,
  currentStage: number
): string | null {
  if (currentStage >= 6) return null
  return DRAGON_STAGES[attribute][currentStage]
}

export function getDaysToNextStage(totalDays: number): number | null {
  const currentStage = getStage(totalDays)
  if (currentStage >= 6) return null
  return STAGE_THRESHOLDS[currentStage] - totalDays
}

export function getDragonImagePath(
  attribute: Attribute,
  stage: number
): string {
  return `/dragons/${attribute}_${stage}.png`
}

// 数字を漢数字に変換（1〜999）
export function toKanjiNumber(num: number): string {
  if (num === 0) return '零'

  const ones = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const tens = ['', '十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十']

  if (num < 10) return ones[num]
  if (num < 20) return num === 10 ? '十' : `十${ones[num - 10]}`
  if (num < 100) {
    const ten = Math.floor(num / 10)
    const one = num % 10
    return `${tens[ten]}${ones[one]}`
  }

  const hundred = Math.floor(num / 100)
  const rest = num % 100
  let result = hundred === 1 ? '百' : `${ones[hundred]}百`
  if (rest > 0) result += toKanjiNumber(rest)
  return result
}
