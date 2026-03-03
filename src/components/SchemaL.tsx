// Schema L 顶点坐标常量 (100x100 坐标系)
const NODES = {
  S: { x: 20, y: 20 },        // (Es) S - 左上
  a_other: { x: 80, y: 20 }, // a 小他者 - 右上
  a_ego: { x: 20, y: 80 },    // a' 想象自我 - 左下
  A: { x: 80, y: 80 },        // A 大他者 - 右下
  MID: { x: 50, y: 50 },      // 对角线中点
} as const

interface SchemaLProps {
  isExpanded?: boolean
}

export default function SchemaL({ isExpanded = false }: SchemaLProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full">
      {/* 标题 */}
      <div className="absolute top-4 left-0 right-0 text-center">
        <span className={`font-light tracking-widest text-white/40 ${isExpanded ? 'text-2xl' : 'text-lg'}`}>
          Schema L
        </span>
      </div>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-8 pointer-events-none"
        preserveAspectRatio="xMidYMid meet"
      >
      <defs>
        {/* 发光滤镜 */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="rgba(255,255,255,0.5)" />
        </filter>

        {/* 实线箭头 */}
        <marker
          id="arrowSolid"
          markerWidth="4"
          markerHeight="4"
          refX="3"
          refY="2"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L4,2 L0,4 L1,2 Z" fill="rgba(255,255,255,0.5)" />
        </marker>

        {/* 虚线箭头 */}
        <marker
          id="arrowDashed"
          markerWidth="4"
          markerHeight="4"
          refX="3"
          refY="2"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L4,2 L0,4 L1,2 Z" fill="rgba(255,255,255,0.5)" />
        </marker>
      </defs>

      {/* 顶层水平线: (Es)S -> a 小他者 - 单向箭头缩短一半，虚线 */}
      <line
        x1={NODES.S.x}
        y1={NODES.S.y}
        x2={50}
        y2={NODES.a_other.y}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        markerEnd="url(#arrowDashed)"
      />

      {/* 虚线: 箭头末尾 -> a 小他者 */}
      <line
        x1={50}
        y1={NODES.a_other.y}
        x2={NODES.a_other.x}
        y2={NODES.a_other.y}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />

      {/* 底层水平线: A 大他者 -> a' 想象自我 - 单向箭头（1/2长度） */}
      <line
        x1={NODES.A.x}
        y1={NODES.A.y}
        x2={50}
        y2={NODES.a_ego.y}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.5"
        markerEnd="url(#arrowSolid)"
      />

      {/* 底层水平线: A 大他者 -> a' 想象自我 - 剩余部分实线 */}
      <line
        x1={50}
        y1={NODES.a_ego.y}
        x2={NODES.a_ego.x}
        y2={NODES.a_ego.y}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.5"
      />

      {/* 对角线: A 大他者 -> (Es)S - 右下角半段实线 */}
      <line
        x1={NODES.A.x}
        y1={NODES.A.y}
        x2={NODES.MID.x}
        y2={NODES.MID.y}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.5"
        markerEnd="url(#arrowSolid)"
      />

      {/* 对角线: A 大他者 -> (Es)S - 左上角半段虚线箭头（1/2长度） */}
      <line
        x1={NODES.MID.x}
        y1={NODES.MID.y}
        x2={35}
        y2={35}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        markerEnd="url(#arrowDashed)"
      />

      {/* 对角线: A 大他者 -> (Es)S - 虚线剩余部分 */}
      <line
        x1={35}
        y1={35}
        x2={NODES.S.x}
        y2={NODES.S.y}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.5"
        strokeDasharray="2 2"
      />

      {/* 对角线: a 小他者 -> a' 想象自我 (想象关系) - 实线单向箭头，长度为实线的2/3 */}
      <line
        x1={NODES.a_other.x}
        y1={NODES.a_other.y}
        x2={40}
        y2={60}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.5"
        markerEnd="url(#arrowSolid)"
      />

      {/* 完整实线: a 小他者 -> a' 想象自我 (想象关系) - 2/3到终点 */}
      <line
        x1={40}
        y1={60}
        x2={NODES.a_ego.x}
        y2={NODES.a_ego.y}
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.5"
      />

      {/* 节点 S - (Es) S */}
      <circle
        cx={NODES.S.x}
        cy={NODES.S.y}
        r="1.5"
        fill="rgba(255,255,255,0.8)"
        filter="url(#glow)"
      />

      {/* 节点 a 小他者 */}
      <circle
        cx={NODES.a_other.x}
        cy={NODES.a_other.y}
        r="1.5"
        fill="rgba(255,255,255,0.8)"
        filter="url(#glow)"
      />

      {/* 节点 a' 想象自我 */}
      <circle
        cx={NODES.a_ego.x}
        cy={NODES.a_ego.y}
        r="1.5"
        fill="rgba(255,255,255,0.8)"
        filter="url(#glow)"
      />

      {/* 节点 A 大他者 */}
      <circle
        cx={NODES.A.x}
        cy={NODES.A.y}
        r="1.5"
        fill="rgba(255,255,255,0.8)"
        filter="url(#glow)"
      />

      {/* 标签 (Es) S */}
      <text
        x={NODES.S.x - 5}
        y={NODES.S.y}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize="3.5"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
        fontWeight="300"
        fill="rgba(255,255,255,0.6)"
      >
        (Es) S
      </text>

      {/* 标签 a 小他者 */}
      <text
        x={NODES.a_other.x + 5}
        y={NODES.a_other.y}
        textAnchor="start"
        dominantBaseline="middle"
        fontSize="3.5"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
        fontWeight="300"
        fill="rgba(255,255,255,0.6)"
      >
        a 小他者
      </text>

      {/* 标签 a' */}
      <text
        x={NODES.a_ego.x - 5}
        y={NODES.a_ego.y}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize="3.5"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
        fontWeight="300"
        fill="rgba(255,255,255,0.6)"
      >
        a'
      </text>

      {/* 标签 A 大他者 */}
      <text
        x={NODES.A.x + 5}
        y={NODES.A.y}
        textAnchor="start"
        dominantBaseline="middle"
        fontSize="3.5"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
        fontWeight="300"
        fill="rgba(255,255,255,0.6)"
      >
        A 大他者
      </text>

      {/* 对角线文本: 无意识 (A 大他者到(Es)S的实线箭头旁) - 45度倾斜 */}
      <text
        x={68}
        y={60}
        textAnchor="middle"
        fontSize="2.5"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
        fontWeight="300"
        fill="rgba(255,255,255,0.5)"
        transform="rotate(-45, 68, 60)"
      >
        无意识
      </text>

      {/* 对角线文本: 想象关系 (a 小他者到a'想象自我的实线箭头旁) - -45度倾斜 */}
      <text
        x={58}
        y={35}
        textAnchor="middle"
        fontSize="2.5"
        fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif"
        fontWeight="300"
        fill="rgba(255,255,255,0.5)"
        transform="rotate(-45, 58, 35)"
      >
        想象关系
      </text>
    </svg>
    </div>
  )
}
