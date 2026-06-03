import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ATTRIBUTE_LABELS, type Attribute } from '../data/questions'
import { getShrineById } from '../data/shrines'
import {
  hasVisitedShrineToday,
  recordShrineVisit,
  hasOfferedPhotoForShrineToday,
  recordShrinePhotoOffering,
  incrementShrineVisitCount,
  getShrineVisitCount,
  SHRINE_REWARDS,
} from '../data/spirit'
import BottomNav from '../components/BottomNav'

const ATTRIBUTE_TINT: Record<Attribute, string> = {
  seiryu: 'rgba(120,170,230,0.4)',
  hakuryu: 'rgba(230,235,245,0.35)',
  kokuryu: 'rgba(140,110,200,0.4)',
  kinryu: 'rgba(245,205,110,0.4)',
}

function ShrineDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const shrine = id ? getShrineById(id) : undefined
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [userAttribute, setUserAttribute] = useState<Attribute | null>(null)
  const [visited, setVisited] = useState(false)
  const [photoOffered, setPhotoOffered] = useState(false)
  const [visitCount, setVisitCount] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [showReward, setShowReward] = useState<string | null>(null)
  const [offering, setOffering] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('dragon_attribute') as Attribute | null
    if (!stored) {
      navigate('/')
      return
    }
    setUserAttribute(stored)
    if (id) {
      setVisited(hasVisitedShrineToday(id))
      setPhotoOffered(hasOfferedPhotoForShrineToday(id))
      setVisitCount(getShrineVisitCount(id))
    }
  }, [id, navigate])

  if (!shrine || !userAttribute) {
    return (
      <main className="min-h-svh flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-mincho text-moonlight/60 mb-6">
            社が見つかりませんでした。
          </p>
          <Link
            to="/pilgrimage"
            className="font-mincho text-gold/80 tracking-[0.3em]"
          >
            ← 巡礼へ戻る
          </Link>
        </div>
      </main>
    )
  }

  const handleOfferingClick = () => {
    if (offering || photoOffered || !fileInputRef.current) return
    fileInputRef.current.click()
  }

  const handleFileSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file || !id) return

    // 重要：画像データは読み込まず即破棄（龍神への供物として昇華）
    e.target.value = ''

    setOffering(true)

    // 奉納の演出（写真が「昇華」する2.5秒）
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // 「詣でる」と「写真奉納」の両方の魂気/縁を一度に付与
    const visitResult = recordShrineVisit(id)
    const photoResult = recordShrinePhotoOffering(id)

    if (visitResult.success) {
      incrementShrineVisitCount(id)
      setVisited(true)
      setVisitCount((c) => c + 1)
    }
    if (photoResult.success) {
      setPhotoOffered(true)
    }

    const rewards: string[] = []
    if (visitResult.success) rewards.push(`+${visitResult.reward} 魂気`)
    if (photoResult.success) rewards.push(`+${photoResult.reward} 縁`)

    setOffering(false)
    if (rewards.length > 0) {
      setShowReward(rewards.join(' ・ '))
      setTimeout(() => setShowReward(null), 3000)
    }
  }

  const isSameAttribute = userAttribute === shrine.attribute
  const todayDone = visited && photoOffered

  return (
    <>
      <main className="relative min-h-svh pb-28 max-w-xl mx-auto">
        {/* 戻るボタン */}
        <div className="absolute top-6 left-6 z-30">
          <Link
            to="/pilgrimage"
            className="w-10 h-10 rounded-full border border-moonlight/30 bg-night/60 backdrop-blur flex items-center justify-center text-moonlight/80 hover:border-moonlight/60 transition-colors duration-300"
          >
            <span className="text-lg leading-none">‹</span>
          </Link>
        </div>

        {/* ヒーロー画像 */}
        <div className="relative w-full aspect-[16/10] overflow-hidden">
          {!imageError ? (
            <img
              src={shrine.image}
              alt={shrine.name}
              onError={() => setImageError(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, ${ATTRIBUTE_TINT[shrine.attribute]}, rgba(11,22,38,0.95) 70%)`,
              }}
            />
          )}

          {/* 下部に向かって暗くするグラデーション */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(11,22,38,0.2) 0%, transparent 30%, transparent 50%, rgba(11,22,38,0.95) 100%)',
            }}
          />

          {/* 属性タグ */}
          <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full border border-gold/40 bg-night/70 backdrop-blur">
            <span className="font-mincho text-xs text-gold tracking-[0.4em]">
              {ATTRIBUTE_LABELS[shrine.attribute]}
            </span>
          </div>
        </div>

        {/* 本文 */}
        <div className="relative px-6 -mt-12 pb-6">
          <div className="mb-2 font-mincho text-xs text-gold/80 tracking-[0.4em]">
            聖 な る 鳥 居
          </div>
          <h1 className="font-mincho text-3xl md:text-4xl text-moonlight tracking-wider mb-3">
            {shrine.name}
          </h1>
          <div className="font-mincho text-sm text-moonlight/60 tracking-[0.2em] mb-6">
            {shrine.prefecture} ・ {shrine.area}
          </div>

          {/* 同属性ラベル */}
          {isSameAttribute && (
            <div
              className="rounded-full px-4 py-2 mb-6 inline-block border border-gold/40"
              style={{
                background: `linear-gradient(90deg, ${ATTRIBUTE_TINT[shrine.attribute]}, rgba(184,148,31,0.1))`,
              }}
            >
              <span className="font-mincho text-xs text-gold tracking-[0.3em]">
                ◎ あなたの守護龍と同じ縁
              </span>
            </div>
          )}

          {/* 物語 */}
          <div
            className="rounded-2xl border border-moonlight/15 p-6 mb-6"
            style={{
              background:
                'linear-gradient(180deg, rgba(20,30,55,0.4), rgba(11,22,38,0.6))',
            }}
          >
            <div className="font-mincho text-xs text-gold/80 tracking-[0.4em] mb-3">
              社 の 物 語
            </div>
            <p className="font-mincho text-base text-moonlight/90 leading-[2.0] tracking-wider">
              「{shrine.story}」
            </p>
          </div>

          {/* 参拝回数（あれば） */}
          {visitCount > 0 && (
            <div className="text-center mb-6">
              <span className="font-mincho text-xs text-moonlight/50 tracking-[0.3em]">
                累 計 {visitCount} 度 詣 で た
              </span>
            </div>
          )}
        </div>

        {/* 奉納カード（統合：参拝の写真を奉納 → 詣でる + 縁を結ぶ） */}
        <div className="px-6 mb-8">
          {/* 隠しfile input（モバイルではカメラも起動可） */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelected}
            className="hidden"
          />

          <button
            onClick={handleOfferingClick}
            disabled={todayDone || offering}
            className={`w-full rounded-2xl border p-6 flex items-center gap-4 text-left transition-all duration-300 ${
              todayDone
                ? 'border-moonlight/15 opacity-60'
                : offering
                ? 'border-gold/60 bg-gold/5'
                : 'border-gold/40 hover:border-gold/70 hover:bg-gold/5'
            }`}
            style={{
              background: todayDone
                ? 'rgba(11,22,38,0.3)'
                : 'linear-gradient(180deg, rgba(184,148,31,0.08), rgba(11,22,38,0.3))',
            }}
          >
            <div className="w-12 h-12 rounded-full border border-gold/50 flex items-center justify-center flex-shrink-0">
              {offering ? (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="animate-spin"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="#B8941F"
                    strokeWidth="1.3"
                    strokeDasharray="14 30"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 8h4l2-3h6l2 3h4v11H3V8z M12 17a4 4 0 100-8 4 4 0 000 8z"
                    stroke="#B8941F"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="font-mincho text-base text-moonlight tracking-wider">
                {offering
                  ? '龍神に捧げています...'
                  : todayDone
                  ? '本日 ・ 奉納した'
                  : '参拝の写真を奉納する'}
              </div>
              <div
                className={`font-mincho text-xs tracking-[0.2em] mt-1 ${
                  todayDone || offering ? 'text-moonlight/40' : 'text-gold/85'
                }`}
              >
                {offering
                  ? '写真は龍に捧げられ、跡を残さず昇華します'
                  : todayDone
                  ? '次の社へ、また縁を繋ぐ'
                  : `+${SHRINE_REWARDS.visit} 魂気 ・ +${SHRINE_REWARDS.photo} 縁`}
              </div>
            </div>
            {!offering && !todayDone && (
              <span className="font-mincho text-gold/70 text-lg">→</span>
            )}
          </button>

          {/* 補足説明 */}
          <p className="font-mincho text-xs text-moonlight/40 tracking-[0.2em] mt-3 text-center leading-relaxed">
            写真を選ぶと、龍神に捧げられて消えます。
            <br />
            あなたの端末にも、サーバーにも、何も残りません。
          </p>
        </div>

        {/* 奉納中の全画面オーバーレイ */}
        {offering && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, rgba(184,148,31,0.15), rgba(11,22,38,0.85) 70%)',
              backdropFilter: 'blur(2px)',
            }}
          >
            <div className="text-center">
              <div
                className="w-24 h-24 mx-auto mb-6 rounded-full animate-pulse"
                style={{
                  background:
                    'radial-gradient(circle, rgba(245,205,110,0.6), rgba(184,148,31,0.2) 50%, transparent 80%)',
                  boxShadow: '0 0 60px rgba(184,148,31,0.5)',
                }}
              />
              <p className="font-mincho text-base text-gold tracking-[0.4em]">
                奉 納
              </p>
              <p className="font-mincho text-xs text-moonlight/60 tracking-[0.3em] mt-3">
                写真が龍神へと昇華しています
              </p>
            </div>
          </div>
        )}

        {/* 報酬フラッシュ */}
        {showReward && (
          <div className="fixed inset-x-0 top-1/3 z-40 flex justify-center pointer-events-none">
            <div className="bg-gold/10 border border-gold/40 rounded-full px-8 py-3 backdrop-blur-md">
              <span className="font-mincho text-xl md:text-2xl text-gold tracking-[0.3em] animate-pulse">
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

export default ShrineDetail
