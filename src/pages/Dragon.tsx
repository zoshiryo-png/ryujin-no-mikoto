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
  KONGI_THRESHOLDS,
} from '../data/spirit'
import BottomNav from '../components/BottomNav'

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
  const [videoError, setVideoError] = useState(false)

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
    // 属性/段階が変わるたびに動画を再試行
    setVideoError(false)
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

  // ─────────────────────────────────────────
  // 開発モード専用：段階・属性ジャンプ
  // 本番ビルド（vite build）では import.meta.env.DEV が false になり
  // パネル自体が描画されないので、世界観は壊れない
  // ─────────────────────────────────────────
  const jumpToStage = (s: number) => {
    if (!attribute) return
    const newKongi = KONGI_THRESHOLDS[s - 1]
    localStorage.setItem('kongi', String(newKongi))
    setKongi(newKongi)
    setEvolution(getEvolutionStatus(attribute))
    setVideoError(false) // 動画フォールバックを再試行
  }

  const switchAttribute = (a: Attribute) => {
    localStorage.setItem('dragon_attribute', a)
    setAttribute(a)
    setMessage(getTodayMessage(a))
    setEvolution(getEvolutionStatus(a))
    setVideoError(false)
  }

  if (!attribute || !evolution) return null

  const stage = evolution.stage
  const stageName = DRAGON_STAGES[attribute][stage - 1]
  const nextStageName =
    stage < 6 ? DRAGON_STAGES[attribute][stage] : null
  const dragonImage = getDragonImagePath(attribute, stage)
  const dragonVideo = `/dragons/${attribute}_${stage}.mp4`
  const attributeLabel = ATTRIBUTE_LABELS[attribute]

  // 龍のフィルター（属性ごとの色補正）
  const dragonFilter =
    attribute === 'kokuryu'
      ? `contrast(1.25) brightness(1.3) saturate(1.2) drop-shadow(0 0 60px ${ATTRIBUTE_GLOW_COLOR[attribute]})`
      : `contrast(1.1) brightness(1.05) drop-shadow(0 0 50px ${ATTRIBUTE_GLOW_COLOR[attribute]})`

  // 画像（PNG）用：closest-sideで内接円に絞り、上下辺の薄い見切れを解消
  const dragonImageStyle = {
    maskImage:
      'radial-gradient(circle closest-side at center, black 72%, rgba(0,0,0,0.55) 88%, transparent 100%)',
    WebkitMaskImage:
      'radial-gradient(circle closest-side at center, black 72%, rgba(0,0,0,0.55) 88%, transparent 100%)',
    mixBlendMode: 'lighten' as const,
    filter: dragonFilter,
  }

  // 動画（MP4）用：龍が画面を支配する没入感重視
  // closest-sideで真円、中央の「くっきり領域」を広く取って龍の存在感を強める
  const dragonVideoStyle = {
    maskImage:
      'radial-gradient(circle closest-side at center, black 72%, rgba(0,0,0,0.5) 88%, transparent 100%)',
    WebkitMaskImage:
      'radial-gradient(circle closest-side at center, black 72%, rgba(0,0,0,0.5) 88%, transparent 100%)',
    mixBlendMode: 'lighten' as const,
    transform: 'scale(1.0)',
    filter: dragonFilter,
  }

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

        {/* 中央：龍ビジュアル（横方向に光が伸びる演出、没入感重視で大きめに） */}
        <div className="relative flex items-center justify-center my-6 h-[460px]">
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

          {/* 龍ビジュアル（動画があれば動画、なければ画像） */}
          {!videoError ? (
            <video
              key={dragonVideo}
              src={dragonVideo}
              autoPlay
              loop
              muted
              playsInline
              onError={() => setVideoError(true)}
              className="relative z-10 h-[500px] w-[500px] object-cover animate-breathe"
              style={dragonVideoStyle}
            />
          ) : (
            <img
              src={dragonImage}
              alt={`${attributeLabel}・${stageName}`}
              className="relative z-10 h-[500px] w-[500px] object-cover animate-breathe"
              style={dragonImageStyle}
            />
          )}
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

      {/* ─────── 開発モード専用デバッグパネル ─────── */}
      {/* 本番ビルドでは描画されない（import.meta.env.DEV === false） */}
      {import.meta.env.DEV && (
        <div
          className="fixed top-3 right-3 z-50 flex flex-col gap-2 p-2.5 rounded-xl border border-moonlight/20 backdrop-blur-md"
          style={{ background: 'rgba(11,22,38,0.75)' }}
        >
          {/* ラベル */}
          <div className="font-mincho text-[10px] text-moonlight/40 tracking-[0.3em] text-center">
            DEV
          </div>

          {/* 属性切替 */}
          <div className="flex gap-1.5">
            {(['seiryu', 'hakuryu', 'kokuryu', 'kinryu'] as Attribute[]).map(
              (a) => (
                <button
                  key={a}
                  onClick={() => switchAttribute(a)}
                  title={ATTRIBUTE_LABELS[a]}
                  className={`w-7 h-7 font-mincho text-xs rounded-md transition-colors ${
                    attribute === a
                      ? 'bg-gold/25 text-gold border border-gold/40'
                      : 'bg-moonlight/5 text-moonlight/50 border border-moonlight/10 hover:bg-moonlight/10'
                  }`}
                >
                  {ATTRIBUTE_LABELS[a].charAt(0)}
                </button>
              )
            )}
          </div>

          {/* 段階切替 */}
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((s) => {
              const isCurrent = stage === s
              return (
                <button
                  key={s}
                  onClick={() => jumpToStage(s)}
                  title={`段階 ${s}：${DRAGON_STAGES[attribute][s - 1]}`}
                  className={`w-6 h-6 font-mincho text-xs rounded-md transition-colors ${
                    isCurrent
                      ? 'bg-gold/25 text-gold border border-gold/40'
                      : 'bg-moonlight/5 text-moonlight/50 border border-moonlight/10 hover:bg-moonlight/10'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <BottomNav />
    </>
  )
}

export default Dragon
