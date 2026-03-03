import schemaRSvgContent from '../svgs/lacan schema R_1.svg?raw'
import { useMemo, useRef, useEffect } from 'react'

interface SchemaRProps {
  isExpanded?: boolean
}

export default function SchemaR({ isExpanded = false }: SchemaRProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // 处理 SVG 内容，将黑色改为白色
  const processedSvg = useMemo(() => {
    let svg = schemaRSvgContent

    // 将黑色 stroke 替换为白色半透明
    svg = svg.replace(/stroke:rgb\(0%,0%,0%\)/g, 'stroke:rgba(255,255,255,0.5)')
    svg = svg.replace(/stroke:rgb\(0%, 0%, 0%\)/g, 'stroke:rgba(255,255,255,0.5)')
    // 将黑色 fill 替换为白色（节点）
    svg = svg.replace(/fill:rgb\(0%,0%,0%\)/g, 'fill:rgba(255,255,255,0.8)')
    svg = svg.replace(/fill:rgb\(0%, 0%, 0%\)/g, 'fill:rgba(255,255,255,0.8)')
    // 将白色 fill 替换为透明
    svg = svg.replace(/fill:rgb\(100%,100%,100%\)/g, 'fill:transparent')
    svg = svg.replace(/fill:rgb\(100%, 100%, 100%\)/g, 'fill:transparent')

    return svg
  }, [])

  // 使用 useEffect 绑定事件监听
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const svgElement = container.querySelector('svg')
    if (!svgElement) return

    // 确保所有 SVG 元素不可交互
    const allElements = svgElement.querySelectorAll('*')
    allElements.forEach(el => {
      (el as SVGElement).style.pointerEvents = 'none'
    })
  }, [processedSvg])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full p-2">
      {/* CSS 锁定交互范围 */}
      <style>{`
        .lacan-svg-container svg * {
          pointer-events: none !important;
        }
      `}</style>
      {/* 标题 */}
      <div className="text-center mb-2">
        <span className={`font-light tracking-widest text-white/40 ${isExpanded ? 'text-xl' : 'text-base'}`}>
          Schema R
        </span>
      </div>
      {/* 使用处理后的 SVG 内容 - 居中 */}
      <div
        ref={containerRef}
        className="lacan-svg-container flex-1 w-full flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: processedSvg }}
      />
    </div>
  )
}
