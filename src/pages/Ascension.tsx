import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ATTRIBUTE_LABELS, type Attribute } from '../data/questions'
import BottomNav from '../components/BottomNav'

const PREMIUM_BENEFITS = [
  'より深き日々の言霊',
  'いつでも 龍と対話する',
  'AR ― 龍の顕現',
  '秘されし龍族の解放',
  '幽玄なる意匠の数々',
  '古き神話を紐解く',
]

function Ascension() {
  const navigate = useNavigate()
  const [attribute, setAttribute] = useState<Attribute | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('dragon_attribute') as Attribute | null
    if (!stored) {
      navigate('/')
      return
    }
    setAttribute(stored)
  }, [navigate])

  const handleAscend = () => {
    alert(
      '昇龍は、まだ準備中です。\n月のお守りとして、しばらく後にご用意します。'
    )
  }

  if (!attribute) return null

  const attributeLabel = ATTRIBUTE_LABELS[attribute]

  return (
    <>
      <main className="relative min-h-svh px-6 pt-10 pb-32 max-w-xl mx-auto">
        {/* 上部のエンブレム（菱形の金） */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 flex items-center justify-center">
            {/* 外側の円 */}
            <div
              className="absolute inset-0 rounded-full border border-gold/50"
              style={{
                background:
                  'radial-gradient(circle, rgba(184,148,31,0.25), transparent 70%)',
              }}
            />
            {/* 菱形 */}
            <div
              className="w-10 h-10 rotate-45 border-2 border-gold"
              style={{
                background:
                  'linear-gradient(135deg, rgba(245,205,110,0.5), rgba(184,148,31,0.3))',
                boxShadow: '0 0 20px rgba(184,148,31,0.4)',
              }}
            />
          </div>
        </div>

        {/* 「{属性}の契り」 */}
        <div className="font-mincho text-sm text-gold tracking-[0.4em] text-center mb-3">
          {attributeLabel} の 契 り
        </div>

        {/* 「縁を深める」大見出し */}
        <h1
          className="font-mincho text-4xl text-center tracking-[0.15em] mb-4"
          style={{
            background:
              'linear-gradient(180deg, #F5DC96 0%, #B8941F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          縁 を 深 め る
        </h1>

        {/* 説明文 */}
        <p className="font-mincho text-sm text-moonlight/70 tracking-wider text-center leading-loose mb-10">
          深き導きと、神聖なる血脈、
          <br />
          そして龍の顕現を、その手に。
        </p>

        {/* 特典リスト */}
        <div className="flex flex-col gap-3 mb-10">
          {PREMIUM_BENEFITS.map((benefit, i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-2xl border border-moonlight/15 px-5 py-4"
              style={{
                background:
                  'linear-gradient(180deg, rgba(20,30,55,0.4), rgba(11,22,38,0.5))',
              }}
            >
              {/* チェックマーク */}
              <div
                className="w-7 h-7 rounded-full border border-gold/50 flex items-center justify-center flex-shrink-0"
                style={{
                  background:
                    'radial-gradient(circle, rgba(184,148,31,0.2), transparent 70%)',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#B8941F"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-mincho text-base text-moonlight tracking-wider">
                {benefit}
              </span>
            </div>
          ))}
        </div>

        {/* 昇龍CTA */}
        <button
          onClick={handleAscend}
          className="w-full rounded-full py-5 mb-3 transition-all duration-300 hover:opacity-95"
          style={{
            background:
              'linear-gradient(180deg, #F5DC96 0%, #B8941F 100%)',
            boxShadow: '0 4px 24px rgba(184,148,31,0.4)',
          }}
        >
          <span className="font-mincho text-lg text-night tracking-[0.4em] font-medium">
            昇 龍 す る ・ 月 ¥980
          </span>
        </button>

        {/* 注意書き */}
        <p className="font-mincho text-xs text-moonlight/40 tracking-[0.3em] text-center">
          いつでも解約可能 ・ 七日間の試し
        </p>
      </main>

      <BottomNav />
    </>
  )
}

export default Ascension
