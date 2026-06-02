import { NavLink } from 'react-router-dom'

type TabKey = 'home' | 'dragon' | 'pilgrimage' | 'ascension'

const TABS: Array<{
  key: TabKey
  to: string
  label: string
  icon: (active: boolean) => React.ReactNode
}> = [
  {
    key: 'home',
    to: '/',
    label: '入 口',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3l3 3-3 3-3-3 3-3z M12 9l3 3-3 3-3-3 3-3z M12 15l3 3-3 3-3-3 3-3z"
          stroke={active ? '#B8941F' : '#888'}
          strokeWidth="1.2"
          strokeLinejoin="round"
          fill={active ? '#B8941F22' : 'none'}
        />
      </svg>
    ),
  },
  {
    key: 'dragon',
    to: '/dragon',
    label: '守 護 龍',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={active ? '#B8941F' : '#888'}
          strokeWidth="1.2"
        />
        <path
          d="M12 6v6l4 2"
          stroke={active ? '#B8941F' : '#888'}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: 'pilgrimage',
    to: '/pilgrimage',
    label: '巡 礼',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 21s-7-7-7-12a7 7 0 1114 0c0 5-7 12-7 12z"
          stroke={active ? '#B8941F' : '#888'}
          strokeWidth="1.2"
        />
        <circle
          cx="12"
          cy="9"
          r="2.5"
          stroke={active ? '#B8941F' : '#888'}
          strokeWidth="1.2"
        />
      </svg>
    ),
  },
  {
    key: 'ascension',
    to: '/ascension',
    label: '昇 龍',
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 16l3-8 4 4 4-6 3 10"
          stroke={active ? '#B8941F' : '#888'}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="4" r="1.5" fill={active ? '#B8941F' : '#888'} />
      </svg>
    ),
  },
]

function BottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 backdrop-blur-md"
      style={{
        background:
          'linear-gradient(180deg, rgba(11,22,38,0.7) 0%, rgba(11,22,38,0.95) 100%)',
        borderTop: '1px solid rgba(184,148,31,0.2)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="max-w-xl mx-auto flex items-stretch justify-around">
        {TABS.map((tab) => (
          <NavLink
            key={tab.key}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-300 ${
                isActive ? '' : 'opacity-70 hover:opacity-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {tab.icon(isActive)}
                <span
                  className={`font-mincho text-[10px] tracking-[0.3em] ${
                    isActive ? 'text-gold' : 'text-moonlight/60'
                  }`}
                >
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
