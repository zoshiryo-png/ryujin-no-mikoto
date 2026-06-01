import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

type Particle = {
  x: number
  y: number
  delay: number
  duration: number
  size: number
}

function Particles() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const arr: Particle[] = []
    for (let i = 0; i < 28; i++) {
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 6,
        duration: 7 + Math.random() * 9,
        size: 2 + Math.random() * 2,
      })
    }
    setParticles(arr)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold/50 animate-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            boxShadow: '0 0 8px rgba(184, 148, 31, 0.4)',
          }}
        />
      ))}
    </div>
  )
}

function Top() {
  const [hasDragon, setHasDragon] = useState(false)

  useEffect(() => {
    setHasDragon(!!localStorage.getItem('dragon_attribute'))
  }, [])

  return (
    <main className="relative min-h-svh flex flex-col items-center justify-center px-6 overflow-hidden">
      {/* 月の光（背景中央のぼんやり光） */}
      <div
        className="absolute top-1/2 left-1/2 w-[420px] h-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(248,246,240,0.18), rgba(184,148,31,0.08) 40%, transparent 70%)',
        }}
      />

      {/* 光の粒子 */}
      <Particles />

      {/* ヘッダー：月アイコン + ロゴ */}
      <header className="absolute top-8 left-0 right-0 flex items-center justify-center gap-3">
        <span
          className="w-5 h-5 rounded-full"
          style={{
            background:
              'radial-gradient(circle, #B8941F 0%, #8a6d12 60%, transparent 100%)',
            boxShadow: '0 0 10px rgba(184, 148, 31, 0.5)',
          }}
        />
        <span className="font-mincho text-sm text-gold tracking-[0.4em]">
          龍神の命
        </span>
      </header>

      {/* メイン */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h1 className="font-mincho text-6xl md:text-7xl font-medium text-moonlight tracking-[0.18em] leading-tight mb-10">
          龍神の命
        </h1>

        <p className="font-mincho text-base md:text-lg text-moonlight/75 leading-[2.2] tracking-wider mb-14">
          古き鳥居の前に立ち、
          <br />
          魂に寄り添う守護龍と出会う。
        </p>

        <Link
          to="/diagnosis"
          className="group relative font-mincho text-base md:text-lg text-moonlight tracking-[0.4em] px-12 py-4 border border-gold/60 rounded-full overflow-hidden transition-all duration-500 hover:border-gold hover:tracking-[0.5em]"
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                'radial-gradient(circle at center, rgba(184,148,31,0.18), transparent 70%)',
            }}
          />
          <span className="relative">縁 を 結 ぶ</span>
        </Link>

        <div className="flex items-center gap-4 mt-8 opacity-70">
          <span className="w-10 h-px bg-gold/40" />
          <span className="font-mincho text-xs text-moonlight/60 tracking-[0.4em]">
            約 3 分 の 内 観
          </span>
          <span className="w-10 h-px bg-gold/40" />
        </div>
      </div>

      {/* リピーター動線（diagnosis済みの人だけ） */}
      {hasDragon && (
        <Link
          to="/dragon"
          className="absolute bottom-16 font-mincho text-sm text-moonlight/40 tracking-[0.3em] hover:text-moonlight/80 transition-colors duration-500"
        >
          すでに龍と歩む方は こちら
        </Link>
      )}

      {/* フッター */}
      <footer className="absolute bottom-4 font-mincho text-[10px] text-moonlight/30 tracking-[0.3em]">
        © 2026 龍神の命
      </footer>
    </main>
  )
}

export default Top
