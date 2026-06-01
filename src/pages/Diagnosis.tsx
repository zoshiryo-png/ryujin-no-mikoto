import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  QUESTIONS,
  shuffle,
  decideAttribute,
  type Attribute,
  type Choice,
} from '../data/questions'

const KANJI_NUMBERS = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

function Diagnosis() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Attribute[]>([])
  const [shuffledChoices, setShuffledChoices] = useState<Choice[]>([])
  const [fading, setFading] = useState(false)

  useEffect(() => {
    if (currentIndex < QUESTIONS.length) {
      setShuffledChoices(shuffle(QUESTIONS[currentIndex].choices))
    }
  }, [currentIndex])

  const goToNext = (newAnswers: Attribute[]) => {
    if (currentIndex + 1 < QUESTIONS.length) {
      setFading(true)
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
        setFading(false)
      }, 250)
    } else {
      const { main, sub } = decideAttribute(newAnswers)
      localStorage.setItem('dragon_attribute', main)
      localStorage.setItem('sub_attribute', sub)
      localStorage.setItem('answered_at', new Date().toISOString())
      // total_days を初期化
      if (!localStorage.getItem('total_days')) {
        localStorage.setItem('total_days', '1')
      }
      navigate('/result')
    }
  }

  const handleChoice = (attribute: Attribute) => {
    const newAnswers = [...answers, attribute]
    setAnswers(newAnswers)
    goToNext(newAnswers)
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setFading(true)
      setTimeout(() => {
        setCurrentIndex(currentIndex - 1)
        setAnswers(answers.slice(0, -1))
        setFading(false)
      }, 200)
    }
  }

  const currentQuestion = QUESTIONS[currentIndex]
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100

  if (!currentQuestion) return null

  return (
    <main className="relative min-h-svh px-6 py-10 max-w-xl mx-auto">
      {/* 上部：戻るボタン + 数字表記 */}
      <div className="flex items-center justify-between mb-4">
        {currentIndex > 0 ? (
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full border border-moonlight/25 flex items-center justify-center text-moonlight/70 hover:border-moonlight/60 transition-colors duration-300 text-lg leading-none"
            aria-label="前の問いへ戻る"
          >
            ‹
          </button>
        ) : (
          <span className="w-10 h-10" />
        )}
        <span className="font-mincho text-sm text-moonlight/70 tracking-[0.35em]">
          {String(currentIndex + 1).padStart(2, '0')} / 10
        </span>
        <span className="w-10 h-10" />
      </div>

      {/* プログレスバー（細い金の線） */}
      <div className="h-px w-full bg-moonlight/10 mb-14 overflow-hidden">
        <div
          className="h-full bg-gold transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* コンテンツ（フェードトランジション） */}
      <div
        className={`transition-opacity duration-300 ${
          fading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* 「内観 ・ 第〇問」 */}
        <div className="font-mincho text-sm text-gold tracking-[0.4em] mb-6">
          内 観 ・ 第 {KANJI_NUMBERS[currentIndex]} 問
        </div>

        {/* 質問文 */}
        <h2 className="font-mincho text-3xl md:text-4xl text-moonlight tracking-wider leading-[1.6] mb-14">
          {currentQuestion.question}
        </h2>

        {/* 選択肢カード */}
        <div className="flex flex-col gap-4">
          {shuffledChoices.map((choice, i) => (
            <button
              key={`${currentIndex}-${i}`}
              onClick={() => handleChoice(choice.attribute)}
              className="px-6 py-6 rounded-2xl border border-moonlight/20 bg-moonlight/[0.03] hover:bg-moonlight/[0.07] hover:border-gold/50 transition-all duration-500 text-left"
            >
              <span className="font-mincho text-base md:text-lg text-moonlight/95 tracking-wider leading-relaxed">
                {choice.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Diagnosis
