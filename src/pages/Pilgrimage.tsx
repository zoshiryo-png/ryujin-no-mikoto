import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ATTRIBUTE_LABELS, type Attribute } from '../data/questions'
import { SHRINES } from '../data/shrines'
import { reportDeed, hasDoneTodayDeed, DEED_REWARDS, getEn } from '../data/spirit'
import BottomNav from '../components/BottomNav'

const ATTRIBUTE_PIN_COLOR: Record<Attribute, string> = {
  seiryu: '#9bbef2',
  hakuryu: '#e8ecf3',
  kokuryu: '#c2afe6',
  kinryu: '#f5cd6e',
}

function Pilgrimage() {
  const navigate = useNavigate()
  const [, setEn] = useState(0)
  const [offerDone, setOfferDone] = useState(false)
  const [showReward, setShowReward] = useState<string | null>(null)
  const [attribute, setAttribute] = useState<Attribute | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('dragon_attribute') as Attribute | null
    if (!stored) {
      navigate('/')
      return
    }
    setAttribute(stored)
    setEn(getEn())
    setOfferDone(hasDoneTodayDeed('offer_photo'))
  }, [navigate])

  const handleOffer = () => {
    const result = reportDeed('offer_photo')
    if (result.success && result.reward) {
      setEn(result.en)
      setOfferDone(true)
      setShowReward(`+${result.reward.en} 縁`)
      setTimeout(() => setShowReward(null), 2500)
    }
  }

  if (!attribute) return null

  return (
    <>
      <main className="relative min-h-svh px-6 pt-8 pb-28 max-w-xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="font-mincho text-xs text-gold tracking-[0.4em] mb-2">
              巡 礼 ・ じ ゅ ん れ い
            </div>
            <h1 className="font-mincho text-3xl text-moonlight tracking-wider">
              龍の社をめぐる
            </h1>
          </div>
          <span className="font-mincho text-xs text-moonlight/50 tracking-[0.3em] mt-4">
            {SHRINES.length}つの鳥居
          </span>
        </div>

        {/* 日本地図（簡易SVG） */}
        <div
          className="relative rounded-2xl border border-gold/20 overflow-hidden mb-4 aspect-[4/5]"
          style={{
            background:
              'linear-gradient(180deg, rgba(11,22,38,0.8), rgba(20,30,55,0.6))',
          }}
        >
          {/* 日本地図のシンプルなシルエット */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* 日本列島の超簡易シルエット */}
            <path
              d="M 14,88 Q 18,82 22,82 L 28,72 Q 34,68 38,62 L 42,58 Q 46,54 48,48 L 52,42 Q 56,40 58,36 L 60,32 Q 62,26 64,22 L 68,18 Q 72,16 74,14 L 78,12 L 80,16 L 76,22 L 70,28 L 66,34 L 62,42 L 58,48 L 54,52 L 50,56 L 46,62 L 42,68 L 36,74 L 30,80 L 24,86 L 18,90 Z"
              fill="rgba(60,100,160,0.25)"
              stroke="rgba(100,140,200,0.4)"
              strokeWidth="0.3"
            />
            {/* 神社のピン */}
            {SHRINES.map((shrine) => (
              <g key={shrine.id}>
                <circle
                  cx={shrine.mapX}
                  cy={shrine.mapY}
                  r="1.2"
                  fill={ATTRIBUTE_PIN_COLOR[shrine.attribute]}
                  opacity="0.9"
                >
                  <animate
                    attributeName="r"
                    values="1.2;1.8;1.2"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            ))}
          </svg>
          {/* 「近くの社」表示（モック） */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-full border border-gold/25 bg-night/60 backdrop-blur px-4 py-2">
            <span className="font-mincho text-xs text-moonlight/70 tracking-[0.2em]">
              近 く の 社
            </span>
            <span className="font-mincho text-xs text-gold/80 tracking-[0.2em]">
              ◎ 12 km
            </span>
          </div>
        </div>

        {/* 写真奉納カード */}
        <button
          onClick={handleOffer}
          disabled={offerDone}
          className={`w-full rounded-2xl border p-5 mb-8 flex items-center gap-4 text-left transition-all duration-300 ${
            offerDone
              ? 'border-moonlight/15 opacity-60'
              : 'border-gold/35 hover:border-gold/60 hover:bg-gold/5'
          }`}
          style={{
            background:
              'linear-gradient(180deg, rgba(184,148,31,0.06), rgba(11,22,38,0.3))',
          }}
        >
          <div className="w-11 h-11 rounded-full border border-gold/50 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 8h4l2-3h6l2 3h4v11H3V8z M12 17a4 4 0 100-8 4 4 0 000 8z"
                stroke="#B8941F"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-mincho text-base text-moonlight tracking-wider">
              {DEED_REWARDS.offer_photo.label}
            </div>
            <div
              className={`font-mincho text-xs tracking-[0.2em] mt-1 ${
                offerDone ? 'text-moonlight/40' : 'text-gold/85'
              }`}
            >
              {offerDone
                ? '本日 ・ 奉納した'
                : `+${DEED_REWARDS.offer_photo.en} 縁 ・ 古き物語を解き放つ`}
            </div>
          </div>
          <span className="font-mincho text-gold/70 text-lg">→</span>
        </button>

        {/* 神社一覧 */}
        <div className="mb-6">
          <h2 className="font-mincho text-sm text-moonlight/60 tracking-[0.4em] mb-4">
            聖 な る 鳥 居
          </h2>
          <div className="flex flex-col gap-4">
            {SHRINES.map((shrine) => (
              <div
                key={shrine.id}
                className="rounded-2xl border border-moonlight/15 overflow-hidden"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(20,30,55,0.4), rgba(11,22,38,0.6))',
                }}
              >
                {/* 上部：神社の想像ビジュアル（属性色のグラデーション） */}
                <div
                  className="relative h-32 flex items-center justify-center"
                  style={{
                    background: `radial-gradient(ellipse at 30% 50%, ${ATTRIBUTE_PIN_COLOR[shrine.attribute]}20, rgba(11,22,38,0.95) 70%)`,
                  }}
                >
                  {/* 鳥居シルエット（SVG） */}
                  <svg
                    width="80"
                    height="60"
                    viewBox="0 0 80 60"
                    className="opacity-70"
                  >
                    <path
                      d="M 8,12 L 72,12 L 68,18 L 12,18 Z M 16,4 L 64,4 L 60,12 L 20,12 Z M 22,18 L 22,56 M 58,18 L 58,56 M 18,30 L 62,30"
                      fill="none"
                      stroke="#B8941F"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                  </svg>
                  {/* 属性タグ */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full border border-gold/40 bg-night/60 backdrop-blur">
                    <span className="font-mincho text-xs text-gold tracking-[0.3em]">
                      {ATTRIBUTE_LABELS[shrine.attribute]}
                    </span>
                  </div>
                </div>

                {/* 下部：神社名と詳細 */}
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-mincho text-base text-moonlight tracking-wider">
                      {shrine.name}
                    </div>
                    <div className="font-mincho text-xs text-moonlight/50 tracking-[0.2em] mt-1">
                      {shrine.prefecture} ・ {shrine.area}
                    </div>
                  </div>
                  <button className="font-mincho text-sm text-gold/90 tracking-[0.2em]">
                    詣 で る →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 縁の加算フラッシュ */}
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

export default Pilgrimage
