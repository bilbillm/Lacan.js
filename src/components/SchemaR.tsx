import schemaRUrl from '../svgs/lacan schema R_1.svg?url'

interface SchemaRProps {
  isExpanded?: boolean
}

export default function SchemaR({ isExpanded = false }: SchemaRProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full p-2">
      <div className="text-center mb-2">
        <span className={`font-light tracking-widest text-white/40 ${isExpanded ? 'text-xl' : 'text-base'}`}>
          Schema R
        </span>
      </div>
      <img 
        src={schemaRUrl} 
        alt="Schema R" 
        className="flex-1 w-full max-w-full max-h-full"
        style={{ display: 'block', filter: 'invert(1) opacity(0.8)' }}
      />
    </div>
  )
}
