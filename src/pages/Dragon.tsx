import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ATTRIBUTE_LABELS, type Attribute } from '../data/questions'
import { DRAGON_STAGES, getDragonImagePath } from '../data/dragons'
import { getTodayMessage, todayInKanji } from '../data/messages'
import {
  getEvolutionStatus,
  reportDeed,
  hasDoneTodayDeed,
  DEED_REWARDS,
  getKongi,
  getEn,
} from '../data/spirit'
import BottomNav from '../components/BottomNav'

const ATTRIBUTE_AURAS: Record<Attribute, string> = {
  seiryu:
    'radial-gradient(circle, rgba(120,170,230,0.45), rgba(60,100,180,0.2) 40%, transparent 75%)',
  hakuryu:
    'radial-gradient(circle, rgba(230,235,245,0.4), rgba(200,210,230,0.18) 40%, transparent 75%)',
  kokuryu:
    'radial-gradient(circle, rgba(140,110,200,0.45), rgba(70,40,130,0.2) 40%, transparent 75%)',
  kinryu:
    'radial-gradient(circle, rgba(245,205,110,0.45), rgba(184,148,31,0.2) 40%, transparent 75%)',
}

const ATTRIBUTE_GLOW_COLOR: Record<Attribute, string> = {
  seiryu: 'rgba(120,170,230,0.5)',
  hakuryu: 'rgba(230,235,245,0.45)',
  kokuryu: 'rgba(140,110,200,0.5)',
  kinryu: 'rgba(245,205,110,0.55)',
}

function Dragon() {
  const navigate = useNavigate()
  const [attribute, setAttribute] = useState<Attribute | null>(null)
  const [message, setMessage] = useState<string>('')
  const [, setKongi] = useState(0)
  const [, setEn] = useState(0)
  const [evolution, setEvolution] = useState<{
    stage: number
    kongi: number
    thresholdNext: number | null
    kongiToNext: number | null
  } | null>(null)
  const [devoteDone, setDevoteDone] = useState(false)
  const [visitDone, setVisitDone] = useState(false)
  const [showReward, setShowReward] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('dragon_attribute') as Attribute | null
    if (!stored) {
      navigate('/')
      return
    }
    setAttribute(stored)
    setMessage(getTodayMessage(stored))
    setKongi(getKongi())
    setEn(getEn())
    setEvolution(getEvolutionStatus(stored))
    setDevoteDone(hasDoneTodayDeed('devote'))
    setVisitDone(hasDoneTodayDeed('visit_shrine'))
  }, [navigate])

  const handleDeed = (deed: 'devote' | 'visit_shrine') => {
    const result = reportDeed(deed)
    if (result.success && result.reward) {
      setKongi(result.kongi)
      setEn(result.en)
      setEvolution(getEvolutionStatus(attribute!))
      if (deed === 'devote') setDevoteDone(true)
      if (deed === 'visit_shrine') setVisitDone(true)
      setShowReward(`+${result.reward.kongi} 魂気`)
      setTimeout(() => setShowReward(null), 2500)
    }
  }

  if (!attribute || !evolution) return null

  const stage = evolution.stage
  const stageName = DRAGON_STAGES[attribute][stage - 1]
  const nextStageName =
    stage < 6 ? DRAGON_STAGES[attribute][stage] : null
  const dragonImage = getDragonImagePath(attribute, stage)
  const attributeLabel = ATTRIBUTE_LABELS[attribute]

  return (
    <>
      <main className="relative min-h-svh px-6 pt-8 pb-28 max-w-xl mx-auto">
        {/* ヘッダー */}
        <div className="mb-4">
          <div className="font-mincho text-xs text-gold tracking-[0.4em] mb-2">
            守 護 ・ 縁 の 場
          </div>
          <h1 className="font-mincho text-3xl text-moonlight tracking-wider">
            あなたの守護龍
          </h1>
        </div>

        {/* 中央：龍ビジュアル（横方向に光が伸びる演出） */}
        <div className="relative flex items-center justify-center my-6 h-[380px]">
          {/* 最外オーラ */}
          <div
            className="absolute w-[560px] h-[460px] blur-3xl pointer-events-none opacity-80"
            style={{
              background: `radial-gradient(ellipse 60% 50% at center, ${ATTRIBUTE_GLOW_COLOR[attribute]}, transparent 80%)`,
            }}
          />

          {/* 横方向の光 */}
          <div
            className="absolute w-[680px] h-[240px] blur-3xl pointer-events-none opacity-60"
            style={{
              background: `radial-gradient(ellipse 80% 40% at center, ${ATTRIBUTE_GLOW_COLOR[attribute]}, transparent 75%)`,
            }}
          />

          {/* 金の弧 */}
          <svg
            className="absolute m-auto w-[340px] h-[340px] animate-spin-slow pointer-events-none"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#B8941F"
              strokeWidth="0.3"
              strokeDasharray="100 200"
              strokeLinecap="round"
              opacity="0.35"
            />
          </svg>

          {/* 龍画像（黒龍は背景に同化しすぎないよう明度を強める） */}
          <img
            src={dragonImage}
            alt={`${attributeLabel}・${stageName}`}
            className="relative z-10 h-[360px] w-auto object-contain animate-breathe"
            style={{
              maskImage:
                attribute === 'kokuryu'
                  ? 'radial-gradient(ellipse 55% 80% at center, black 30%, rgba(0,0,0,0.5) 65%, transparent 95%)'
                  : 'radial-gradient(ellipse 50% 75% at center, black 20%, rgba(0,0,0,0.6) 55%, transparent 95%)',
              WebkitMaskImage:
                attribute === 'kokuryu'
                  ? 'radial-gradient(ellipse 55% 80% at center, black 30%, rgba(0,0,0,0.5) 65%, transparent 95%)'
                  : 'radial-gradient(ellipse 50% 75% at center, black 20%, rgba(0,0,0,0.6) 55%, transparent 95%)',
              mixBlendMode: 'lighten',
              filter:
                attribute === 'kokuryu'
                  ? `contrast(1.3) brightness(1.35) saturate(1.2) drop-shadow(0 0 60px ${ATTRIBUTE_GLOW_COLOR[attribute]})`
                  : `contrast(1.15) brightness(1.08) drop-shadow(0 0 50px ${ATTRIBUTE_GLOW_COLOR[attribute]})`,
            }}
          />
        </div>

        {/* 段階名 */}
        <div className="text-center mb-4">
          <div className="font-mincho text-xs text-gold tracking-[0.4em] mb-2">
            進 化 の 段 階
          </div>
          <h2 className="font-mincho text-3xl text-moonlight tracking-wider mb-2">
            {stageName}
          </h2>
          <p className="font-mincho text-sm text-moonlight/50 tracking-wider">
            {nextStageName && evolution.thresholdNext !== null
              ? `次の姿：${nextStageName} ・ ${evolution.kongi} / ${evolution.thresholdNext} 魂気`
              : '神域に至りました'}
          </p>
        </div>

        {/* 段階インジケータ */}
        <div className="flex items-center justify-center gap-6 mb-8">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full transition-colors duration-500 ${
                  s <= stage ? 'bg-gold' : 'bg-moonlight/20'
                }`}
              />
              <span
                className={`font-mincho text-xs ${
                  s <= stage ? 'text-gold/90' : 'text-moonlight/30'
                }`}
              >
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* 右下：属性 覚醒 */}
        <div className="text-right mb-6">
          <span className="font-mincho text-sm text-gold tracking-[0.4em]">
            {attributeLabel} 覚 醒
          </span>
        </div>

        {/* 今日の言霊 */}
        <div
          className="relative rounded-2xl border border-gold/25 p-6 mb-6"
          style={{
            background:
              'linear-gradient(180deg, rgba(184,148,31,0.06), rgba(11,22,38,0.4))',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="#B8941F"
                strokeWidth="1.5"
              />
              <path
                d="M16 12h-4l3-3"
                stroke="#B8941F"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-mincho text-xs text-gold tracking-[0.4em]">
              今 日 の 言 霊
            </span>
          </div>
          <p className="font-mincho text-base md:text-lg text-moonlight tracking-wider leading-[2.1] mb-4">
            「{message}」
          </p>
          <div className="flex items-center justify-between">
            <span className="font-mincho text-xs text-gold/80 tracking-[0.3em]">
              ― {attributeLabel}より
            </span>
            <span className="font-mincho text-xs text-moonlight/50 tracking-[0.3em]">
              {todayInKanji()}
            </span>
          </div>
        </div>

        {/* 行動カード（2つ並列） */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => handleDeed('devote')}
            disabled={devoteDone}
            className={`relative rounded-2xl border p-5 text-left transition-all duration-300 ${
              devoteDone
                ? 'border-moonlight/15 opacity-60'
                : 'border-gold/30 hover:border-gold/60 hover:bg-gold/5'
            }`}
            style={{
              background:
                'linear-gradient(180deg, rgba(184,148,31,0.04), rgba(11,22,38,0.3))',
            }}
          >
            <div className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2v6m0 0l3-2m-3 2l-3-2 M12 22a6 6 0 006-6c0-3-2-5-6-8-4 3-6 5-6 8a6 6 0 006 6z"
                  stroke="#B8941F"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="font-mincho text-base text-moonlight tracking-wider mb-1">
              {DEED_REWARDS.devote.label}
            </div>
            <div
              className={`font-mincho text-xs tracking-[0.2em] ${
                devoteDone ? 'text-moonlight/40' : 'text-gold/90'
              }`}
            >
              {devoteDone ? '本日 ・ 捧げた' : `+${DEED_REWARDS.devote.kongi} 魂気`}
            </div>
          </button>

          <button
            onClick={() => handleDeed('visit_shrine')}
            disabled={visitDone}
            className={`relative rounded-2xl border p-5 text-left transition-all duration-300 ${
              visitDone
                ? 'border-moonlight/15 opacity-60'
                : 'border-gold/30 hover:border-gold/60 hover:bg-gold/5'
            }`}
            style={{
              background:
                'linear-gradient(180deg, rgba(184,148,31,0.04), rgba(11,22,38,0.3))',
            }}
          >
            <div className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L7 8h10l-5-6z M5 8v12h14V8 M9 14h6"
                  stroke="#B8941F"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="font-mincho text-base text-moonlight tracking-wider mb-1">
              {DEED_REWARDS.visit_shrine.label}
            </div>
            <div
              className={`font-mincho text-xs tracking-[0.2em] ${
                visitDone ? 'text-moonlight/40' : 'text-gold/90'
              }`}
            >
              {visitDone
                ? '本日 ・ 詣でた'
                : `+${DEED_REWARDS.visit_shrine.kongi} 魂気`}
            </div>
          </button>
        </div>

        {/* 縁を深める（昇龍への導線） */}
        <Link
          to="/ascension"
          className="block relative rounded-2xl border border-gold/40 p-6"
          style={{
            background:
              'linear-gradient(180deg, rgba(184,148,31,0.1), rgba(11,22,38,0.4))',
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mincho text-xs text-gold tracking-[0.4em] mb-2">
                {attributeLabel} の 契 り
              </div>
              <div className="font-mincho text-xl text-moonlight tracking-wider mb-1">
                縁 を 深 め る
              </div>
              <div className="font-mincho text-xs text-moonlight/50 tracking-wider">
                龍との対話 ・ 顕現 ・ より深き言霊
              </div>
            </div>
            <span className="font-mincho text-gold/80 text-lg">↗</span>
          </div>
        </Link>

        {/* 魂気が加算された時のフラッシュ */}
        {showReward && (
          <div className="fixed inset-x-0 top-1/3 z-40 flex justify-center pointer-events-none">
            <div className="bg-gold/10 border border-gold/40 rounded-full px-8 py-3 backdrop-blur-md">
              <span className="font-mincho text-2xl text-gold tracking-[0.3em] animate-pulse">
                {showReward}
              </span>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </>
  )
}

export default Dragon
