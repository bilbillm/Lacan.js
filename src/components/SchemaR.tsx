import schemaRUrl from '../svgs/lacan schema R_1.svg?url'
import schemaRGalleryUrl from '../pngs/lacan-schema-R_1.png'

interface SchemaRProps {
  isExpanded?: boolean
}

export default function SchemaR({ isExpanded = false }: SchemaRProps) {
  const imageUrl = isExpanded ? schemaRUrl : schemaRGalleryUrl

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center w-full h-full p-2">
      <div className="text-center mb-2">
        <span
          className={`tracking-widest ${isExpanded ? 'text-xl' : 'text-base'}`}
          style={{
            color: 'var(--lacan-muted)',
            fontFamily: 'var(--lacan-title-font)',
            fontWeight: 700,
          }}
        >
          Schema R
        </span>
      </div>
      <img 
        src={imageUrl} 
        alt="Schema R" 
        className="flex-1 w-full h-full object-contain"
        style={{
          display: 'block',
          maxWidth: '100%',
          maxHeight: '100%',
          filter: 'sepia(0.35) saturate(0.78) contrast(1.08) brightness(0.86) opacity(0.88)',
        }}
      />
    </div>
  )
}
