// 魂気（こんき）・縁（えん）システム
// 行動報告で魂気が貯まり、神社の写真奉納で縁が貯まる
// 進化は累計魂気で判定する

import { type Attribute } from './questions'

// 行動の種類
export type Deed = 'devote' | 'visit_shrine' | 'offer_photo'

// 各行動で得られる魂気・縁の量
export const DEED_REWARDS: Record<
  Deed,
  { kongi: number; en: number; label: string }
> = {
  devote: { kongi: 24, en: 0, label: '心を捧げる' },
  visit_shrine: { kongi: 80, en: 0, label: '神社を訪れる' },
  offer_photo: { kongi: 0, en: 80, label: '参拝の写真を奉納する' },
}

// 進化に必要な累計魂気の閾値（段階2に到達する条件）
// 各段階の閾値：段階1（光の珠）→2（赤ちゃん）→3（小龍）→4（属性龍）→5（上位龍）→6（神格龍）
export const KONGI_THRESHOLDS = [0, 100, 400, 1000, 2500, 5000]

// 魂気の取得
export function getKongi(): number {
  return Number(localStorage.getItem('kongi') || '0')
}

// 縁の取得
export function getEn(): number {
  return Number(localStorage.getItem('en') || '0')
}

// 魂気・縁の追加
export function addReward(deed: Deed): { kongi: number; en: number } {
  const reward = DEED_REWARDS[deed]
  const newKongi = getKongi() + reward.kongi
  const newEn = getEn() + reward.en
  localStorage.setItem('kongi', String(newKongi))
  localStorage.setItem('en', String(newEn))
  return { kongi: newKongi, en: newEn }
}

// 今日その行動を既に行ったかチェック（同じ日に同じ報告を複数回するのは防ぐ）
export function hasDoneTodayDeed(deed: Deed): boolean {
  const today = new Date()
  const key = `deed_${deed}_${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`
  return !!localStorage.getItem(key)
}

export function markDeedToday(deed: Deed) {
  const today = new Date()
  const key = `deed_${deed}_${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`
  localStorage.setItem(key, '1')
}

// 行動報告で魂気を加算（1日1回制限）
export function reportDeed(
  deed: Deed
): { success: boolean; kongi: number; en: number; reward?: { kongi: number; en: number } } {
  if (hasDoneTodayDeed(deed)) {
    return { success: false, kongi: getKongi(), en: getEn() }
  }
  const reward = DEED_REWARDS[deed]
  const result = addReward(deed)
  markDeedToday(deed)
  return { success: true, kongi: result.kongi, en: result.en, reward }
}

// 累計魂気から段階を計算
export function getStageFromKongi(kongi: number): number {
  for (let stage = 6; stage >= 1; stage--) {
    if (kongi >= KONGI_THRESHOLDS[stage - 1]) return stage
  }
  return 1
}

// 次の段階までに必要な魂気
export function getKongiToNextStage(kongi: number): number | null {
  const current = getStageFromKongi(kongi)
  if (current >= 6) return null
  return KONGI_THRESHOLDS[current] - kongi
}

// 現在の段階を取得（魂気で判定、attribute はパラメータとして渡されるが
// データ層では未使用、表示用は dragons.ts に任せる）
export function getCurrentStage(): number {
  return getStageFromKongi(getKongi())
}

// 累計魂気と「次の姿まで」の表現
export function getEvolutionStatus(_attribute: Attribute): {
  stage: number
  kongi: number
  thresholdNext: number | null
  kongiToNext: number | null
} {
  const kongi = getKongi()
  const stage = getStageFromKongi(kongi)
  const thresholdNext = stage < 6 ? KONGI_THRESHOLDS[stage] : null
  const kongiToNext = stage < 6 ? KONGI_THRESHOLDS[stage] - kongi : null
  return { stage, kongi, thresholdNext, kongiToNext }
}
