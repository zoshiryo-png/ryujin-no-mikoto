import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ATTRIBUTE_LABELS, type Attribute } from '../data/questions'
import {
  getTodayMessage,
  getTodayKey,
  todayInKanji,
} from '../data/messages'

const ATTRIBUTE_TINTS: Record<Attribute, string> = {
  seiryu: 'rgba(120,170,230,0.4)',
  hakuryu: 'rgba(230,235,245,0.35)',
  kokuryu: 'rgba(140,110,200,0.4)',
  kinryu: 'rgba(245,205,110,0.4)',
}

function Message() {
  const navigate = useNavigate()
  const [attribute, setAttribute] = useState<Attribute | null>(null)
  const [message, setMessage] = useState<string>('')
  const [read, setRead] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('dragon_attribute') as Attribute | null
    if (!stored) {
      navigate('/')
      return
    }
    setAttribute(stored)
    setMessage(getTodayMessage(stored))

    const todayKey = getTodayKey()
    const lastReadKey = localStorage.getItem('message_read_key')
    setRead(lastReadKey === todayKey)
  }, [navigate])

  const handleRead = () => {
    localStorage.setItem('message_read_key', getTodayKey())
    setRead(true)
  }

  if (!attribute) return null

  return (
    <main className="relative min-h-svh flex flex-col items-center justify-center px-8 py-12 max-w-xl mx-auto">
      {/* 属性色の薄いオーラ（背景） */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${ATTRIBUTE_TINTS[attribute]}, transparent 70%)`,
        }}
      />

      {/* 日付（漢数字） */}
      <div className="font-mincho text-sm text-gold/80 tracking-[0.4em] mb-12 relative">
        {todayInKanji()}
      </div>

      {/* メッセージ本文 */}
      <div className="relative max-w-md text-center mb-16">
        {message.split('\n').map((line, i) => (
          <p
            key={i}
            className="font-mincho text-xl md:text-2xl text-moonlight tracking-wider leading-[2.2] mb-1"
          >
            {line}
          </p>
        ))}
      </div>

      {/* 属性ラベル（控えめ） */}
      <div className="font-mincho text-xs text-moonlight/40 tracking-[0.5em] mb-12 relative">
        ― {ATTRIBUTE_LABELS[attribute]}より ―
      </div>

      {/* 「また明日」ボタン or 既読状態 */}
      <div className="relative">
        {read ? (
          <span className="font-mincho text-sm text-moonlight/40 tracking-[0.4em]">
            縁、つないだ
          </span>
        ) : (
          <button
            onClick={handleRead}
            className="group relative font-mincho text-base text-moonlight/80 tracking-[0.4em] px-10 py-3 border border-gold/40 rounded-full overflow-hidden transition-all duration-500 hover:border-gold/80 hover:text-moonlight"
          >
            <span className="relative">ま た 明 日</span>
          </button>
        )}
      </div>

      {/* 戻るリンク */}
      <Link
        to="/dragon"
        className="absolute bottom-8 font-mincho text-xs text-moonlight/40 tracking-[0.3em] hover:text-moonlight/70 transition-colors"
      >
        守 護 龍 へ
      </Link>
    </main>
  )
}

export default Message
