import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ATTRIBUTE_LABELS, type Attribute } from '../data/questions'

// 属性ごとの光の珠の色
const ORB_GRADIENTS: Record<Attribute, string> = {
  seiryu:
    'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95), rgba(120,170,230,0.85) 30%, rgba(40,90,180,0.7) 65%, rgba(20,40,90,0.0) 100%)',
  hakuryu:
    'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.98), rgba(230,235,245,0.9) 35%, rgba(180,200,220,0.7) 65%, rgba(120,140,170,0.0) 100%)',
  kokuryu:
    'radial-gradient(circle at 35% 30%, rgba(220,210,255,0.9), rgba(140,110,200,0.85) 35%, rgba(60,30,110,0.7) 65%, rgba(20,10,50,0.0) 100%)',
  kinryu:
    'radial-gradient(circle at 35% 30%, rgba(255,250,220,0.98), rgba(245,205,110,0.9) 35%, rgba(184,148,31,0.7) 65%, rgba(110,80,20,0.0) 100%)',
}

// 属性ごとの粒子の色（タイトル文字色にも使う）
const ATTRIBUTE_TINTS: Record<Attribute, string> = {
  seiryu: '#9bbef2',
  hakuryu: '#e8ecf3',
  kokuryu: '#c2afe6',
  kinryu: '#f5cd6e',
}

type ConvergingParticle = {
  startAngle: number
  delay: number
  duration: number
  distance: number
}

function ConvergingParticles({
  color,
  show,
}: {
  color: string
  show: boolean
}) {
  const [particles, setParticles] = useState<ConvergingParticle[]>([])

  useEffect(() => {
    const arr: ConvergingParticle[] = []
    for (let i = 0; i < 30; i++) {
      arr.push({
        startAngle: Math.random() * 360,
        delay: Math.random() * 1.0,
        duration: 1.4 + Math.random() * 0.6,
        distance: 200 + Math.random() * 200,
      })
    }
    setParticles(arr)
  }, [])

  if (!show) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p, i) => {
        const dx = Math.cos((p.startAngle * Math.PI) / 180) * p.distance
        const dy = Math.sin((p.startAngle * Math.PI) / 180) * p.distance
        return (
          <span
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 10px ${color}`,
              transform: `translate(${dx}px, ${dy}px)`,
              animation: `converge ${p.duration}s ease-in ${p.delay}s forwards`,
            }}
          />
        )
      })}
    </div>
  )
}

function Result() {
  const navigate = useNavigate()
  const [attribute, setAttribute] = useState<Attribute | null>(null)
  const [phase, setPhase] = useState<'intro' | 'gather' | 'orb' | 'reveal' | 'cta'>(
    'intro'
  )

  useEffect(() => {
    const stored = localStorage.getItem('dragon_attribute') as Attribute | null
    if (!stored) {
      navigate('/diagnosis')
      return
    }
    setAttribute(stored)
  }, [navigate])

  useEffect(() => {
    if (!attribute) return
    const t1 = setTimeout(() => setPhase('gather'), 600)
    const t2 = setTimeout(() => setPhase('orb'), 2000)
    const t3 = setTimeout(() => setPhase('reveal'), 3000)
    const t4 = setTimeout(() => setPhase('cta'), 4000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [attribute])

  // 画面クリックで演出スキップ
  const handleSkip = () => {
    if (phase !== 'cta') setPhase('cta')
  }

  if (!attribute) return null

  const tint = ATTRIBUTE_TINTS[attribute]

  return (
    <main
      className="relative min-h-svh flex flex-col items-center justify-center px-6 overflow-hidden cursor-pointer"
      onClick={handleSkip}
      style={{ background: '#0B1626' }}
    >
      {/* 上部の語り（イントロ） */}
      <div
        className={`absolute top-[35%] left-0 right-0 text-center transition-opacity duration-1000 ${
          phase === 'intro' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="font-mincho text-sm text-moonlight/50 tracking-[0.4em]">
          いま、龍がゆっくりと姿を現します
        </p>
      </div>

      {/* 集まる光の粒子 */}
      <ConvergingParticles color={tint} show={phase === 'gather'} />

      {/* 光の珠 */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
          phase === 'orb' || phase === 'reveal' || phase === 'cta'
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-50'
        }`}
        style={{
          width: '160px',
          height: '160px',
          marginTop: phase === 'cta' || phase === 'reveal' ? '-80px' : '0',
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: ORB_GRADIENTS[attribute],
            boxShadow: `0 0 60px ${tint}40, 0 0 120px ${tint}20`,
          }}
        />
        {/* 金の弧（円形プログレス風） */}
        <svg
          className="absolute inset-0 -m-4 w-[calc(100%+32px)] h-[calc(100%+32px)] animate-spin-slow"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="#B8941F"
            strokeWidth="0.6"
            strokeDasharray="80 220"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* 「顕 ・ 現」ラベル + 出現メッセージ */}
      <div
        className={`absolute bottom-[28%] left-0 right-0 text-center transition-opacity duration-1000 ${
          phase === 'reveal' || phase === 'cta' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="font-mincho text-xs text-gold tracking-[0.5em] mb-4">
          顕 ・ 現
        </p>
        <p className="font-mincho text-2xl md:text-3xl text-moonlight tracking-wider">
          {ATTRIBUTE_LABELS[attribute]}があなたの傍に現れました
        </p>
      </div>

      {/* CTA */}
      <div
        className={`absolute bottom-[14%] left-0 right-0 flex justify-center transition-opacity duration-1000 ${
          phase === 'cta' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Link
          to="/dragon"
          className="group relative font-mincho text-base text-moonlight tracking-[0.4em] px-10 py-3.5 border border-gold/60 rounded-full overflow-hidden transition-all duration-500 hover:border-gold hover:tracking-[0.5em]"
          onClick={(e) => e.stopPropagation()}
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(circle at center, rgba(184,148,31,0.2), transparent 70%)',
            }}
          />
          <span className="relative">縁 を 確 か め る</span>
        </Link>
      </div>
    </main>
  )
}

export default Result
