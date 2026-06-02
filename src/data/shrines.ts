import { type Attribute } from './questions'

export type Shrine = {
  id: string
  name: string
  prefecture: string
  area: string
  attribute: Attribute
  // 地図上の位置（日本地図SVG内での相対座標 0-100で表現）
  mapX: number
  mapY: number
  // 一言の物語
  story: string
}

// 龍神にまつわる主要神社（仕様書 + Lovableで設計済みのもの）
export const SHRINES: Shrine[] = [
  {
    id: 'togakushi',
    name: '戸隠神社',
    prefecture: '長野県',
    area: '長野市戸隠',
    attribute: 'hakuryu',
    mapX: 58,
    mapY: 25,
    story: '霧と杉の参道を抜けると、龍の鱗のような階段が現れる。',
  },
  {
    id: 'kuzuryu',
    name: '九頭龍神社',
    prefecture: '神奈川県',
    area: '箱根',
    attribute: 'seiryu',
    mapX: 56,
    mapY: 42,
    story: '芦ノ湖の静かな水面の下、九つの頭をもつ龍が眠るという。',
  },
  {
    id: 'omiwa',
    name: '大神神社',
    prefecture: '奈良県',
    area: '桜井',
    attribute: 'kinryu',
    mapX: 42,
    mapY: 48,
    story: '三輪山そのものをご神体とする、日本最古の神社の一つ。',
  },
  {
    id: 'aoshima',
    name: '青島神社',
    prefecture: '宮崎県',
    area: '青島',
    attribute: 'seiryu',
    mapX: 28,
    mapY: 70,
    story: '海に浮かぶ熱帯の島、龍宮の入口と伝えられる地。',
  },
  {
    id: 'kifune',
    name: '貴船神社',
    prefecture: '京都府',
    area: '左京区',
    attribute: 'kokuryu',
    mapX: 41,
    mapY: 46,
    story: '水を司る高龗神（たかおかみのかみ）が祀られる、雨乞いの聖地。',
  },
  {
    id: 'murou-ryuketsu',
    name: '室生龍穴神社',
    prefecture: '奈良県',
    area: '宇陀',
    attribute: 'kokuryu',
    mapX: 43,
    mapY: 49,
    story: '岩窟の奥に龍が棲むという、雨と祈りの古社。',
  },
  {
    id: 'tanashi',
    name: '田無神社',
    prefecture: '東京都',
    area: '西東京市',
    attribute: 'seiryu',
    mapX: 56,
    mapY: 40,
    story: '五龍神を祀る、都内屈指の龍神社。',
  },
  {
    id: 'sefa-utaki',
    name: '斎場御嶽',
    prefecture: '沖縄県',
    area: '南城市',
    attribute: 'hakuryu',
    mapX: 13,
    mapY: 90,
    story: '琉球王国最高の聖地、女性神官の祈りの場。',
  },
]

export function getShrineById(id: string): Shrine | undefined {
  return SHRINES.find((s) => s.id === id)
}

export function getShrinesByAttribute(attribute: Attribute): Shrine[] {
  return SHRINES.filter((s) => s.attribute === attribute)
}
