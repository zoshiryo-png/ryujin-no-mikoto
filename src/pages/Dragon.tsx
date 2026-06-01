import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ATTRIBUTE_LABELS, type Attribute } from '../data/questions'
import {
  getStage,
  getStageName,
  getNextStageName,
  getDaysToNextStage,
  getDragonImagePath,
  toKanjiNumber,
} from '../data/dragons'

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
  const [totalDays, setTotalDays] = useState(1)

  useEffect(() => {
    const stored = localStorage.getItem('dragon_attribute') as Attribute | null
    if (!stored) {
      navigate('/')
      return
    }
    setAttribute(stored)

    const days = Number(localStorage.getItem('total_days') || '1')
    setTotalDays(days)
  }, [navigate])

  if (!attribute) return null

  const stage = getStage(totalDays)
  const stageName = getStageName(attribute, stage)
  const nextStageName = getNextStageName(attribute, stage)
  const daysToNext = getDaysToNextStage(totalDays)
  const dragonImage = getDragonImagePath(attribute, stage)
  const attributeLabel = ATTRIBUTE_LABELS[attribute]

  return (
    <main className="relative min-h-svh px-6 py-8 max-w-xl mx-auto">
      {/* ヘッダー：左に守護ラベル＆見出し、右上に経過日数 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-mincho text-xs text-gold tracking-[0.4em] mb-2">
            守 護 ・ 縁 の 場
          </div>
          <h1 className="font-mincho text-3xl text-moonlight tracking-wider">
            あなたの守護龍
          </h1>
        </div>
        <span className="font-mincho text-sm text-moonlight/60 tracking-[0.3em] mt-3">
          {toKanjiNumber(totalDays)}日目
        </span>
      </div>

      {/* 中央：龍ビジュアル */}
      <div className="relative flex items-center justify-center my-8 h-[400px]">
        {/* 大きく広がるオーラ（外側） */}
        <div
          className="absolute w-[480px] h-[480px] rounded-full blur-3xl pointer-events-none"
          style={{ background: ATTRIBUTE_AURAS[attribute] }}
        />

        {/* 内側の強いオーラ（画像と重なる） */}
        <div
          className="absolute w-[260px] h-[360px] rounded-full blur-2xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 70% at center, ${ATTRIBUTE_GLOW_COLOR[attribute]}, transparent 70%)`,
          }}
        />

        {/* 金の弧（円形プログレス風、回転） */}
        <svg
          className="absolute m-auto w-[320px] h-[320px] animate-spin-slow pointer-events-none"
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
            opacity="0.4"
          />
        </svg>

        {/* 龍画像：mask-image でエッジを羽化、mix-blend-mode で暗部を背景に溶かす */}
        <img
          src={dragonImage}
          alt={`${attributeLabel}・${stageName}`}
          className="relative z-10 h-[400px] w-auto object-contain animate-breathe"
          style={{
            maskImage:
              'radial-gradient(ellipse 70% 80% at center, black 35%, rgba(0,0,0,0.6) 65%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 80% at center, black 35%, rgba(0,0,0,0.6) 65%, transparent 100%)',
            mixBlendMode: 'screen',
          }}
        />
      </div>

      {/* 段階名 */}
      <div className="text-center mb-8">
        <div className="font-mincho text-xs text-gold tracking-[0.4em] mb-3">
          進 化 の 段 階
        </div>
        <h2 className="font-mincho text-3xl text-moonlight tracking-wider mb-3">
          {stageName}
        </h2>
        <p className="font-mincho text-sm text-moonlight/50 tracking-wider">
          {nextStageName !== null && daysToNext !== null
            ? `次の姿：${nextStageName} ・ あと${daysToNext}日`
            : '神域に至りました'}
        </p>
      </div>

      {/* 段階インジケータ */}
      <div className="flex items-center justify-center gap-6 mb-10">
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
      <div className="text-right mb-10">
        <span className="font-mincho text-sm text-gold tracking-[0.4em]">
          {attributeLabel} 覚 醒
        </span>
      </div>

      {/* 今日のメッセージへのリンク */}
      <div className="flex justify-center">
        <Link
          to="/message"
          className="group relative font-mincho text-base text-moonlight/85 tracking-[0.4em] px-10 py-3 border border-gold/40 rounded-full overflow-hidden transition-all duration-500 hover:border-gold/80 hover:text-moonlight"
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(circle at center, rgba(184,148,31,0.15), transparent 70%)',
            }}
          />
          <span className="relative">今 日 の 手 紙 を 読 む</span>
        </Link>
      </div>
    </main>
  )
}

export default Dragon
