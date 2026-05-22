interface BorromeanKnot2DProps {
  isExpanded?: boolean
}

const RINGS = [
  {
    id: 'real',
    stroke: '#93c5fd',
    transform: 'rotate(-8 180 158)',
    path: 'M 96 158 C 96 102, 138 74, 180 74 C 222 74, 264 102, 264 158 C 264 214, 222 242, 180 242 C 138 242, 96 214, 96 158 Z',
  },
  {
    id: 'symbolic',
    stroke: '#f9a8d4',
    transform: 'rotate(58 138 210)',
    path: 'M 54 210 C 54 154, 96 126, 138 126 C 180 126, 222 154, 222 210 C 222 266, 180 294, 138 294 C 96 294, 54 266, 54 210 Z',
  },
  {
    id: 'imaginary',
    stroke: '#fcd34d',
    transform: 'rotate(-58 222 210)',
    path: 'M 138 210 C 138 154, 180 126, 222 126 C 264 126, 306 154, 306 210 C 306 266, 264 294, 222 294 C 180 294, 138 266, 138 210 Z',
  },
] as const

export default function BorromeanKnot2D({ isExpanded = false }: BorromeanKnot2DProps) {
  const titleSizeClass = isExpanded ? 'text-xl' : 'text-base'
  const wrapperPaddingClass = isExpanded ? 'p-4' : 'p-3'
  const strokeWidth = isExpanded ? 12 : 10

  return (
    <div className={`absolute inset-0 flex h-full w-full flex-col items-center justify-center ${wrapperPaddingClass}`}>
      <div className="mb-2 text-center">
        <span className={`font-light tracking-widest text-white/40 ${titleSizeClass}`}>
          Borromean Knot 2D
        </span>
      </div>

      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/8 bg-white/[0.03] px-3 py-4">
        <svg
          viewBox="0 0 360 320"
          aria-label="Borromean Knot 2D"
          className="h-full w-full max-w-[26rem]"
          style={{ filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.08))' }}
        >
          <defs>
            <radialGradient id="borromeanGlow" cx="50%" cy="50%" r="65%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          <ellipse cx="180" cy="172" rx="126" ry="110" fill="url(#borromeanGlow)" opacity="0.4" />

          {RINGS.map((ring) => (
            <path
              key={ring.id}
              d={ring.path}
              transform={ring.transform}
              fill="none"
              stroke={ring.stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.92}
            />
          ))}

          <circle cx="180" cy="158" r="4" fill="rgba(255,255,255,0.55)" />
          <circle cx="138" cy="214" r="4" fill="rgba(255,255,255,0.42)" />
          <circle cx="222" cy="214" r="4" fill="rgba(255,255,255,0.42)" />
        </svg>
      </div>
    </div>
  )
}
