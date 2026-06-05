import { useEffect, useState } from 'react'
import { MOBILE_VIEWPORT_MEDIA_QUERY } from './uiConstants'

export default function useMobileViewport() {
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_VIEWPORT_MEDIA_QUERY)
    const handleViewportChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobileViewport(event.matches)
    }

    handleViewportChange(mediaQuery)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleViewportChange)
      return () => mediaQuery.removeEventListener('change', handleViewportChange)
    }

    mediaQuery.addListener(handleViewportChange)
    return () => mediaQuery.removeListener(handleViewportChange)
  }, [])

  return isMobileViewport
}
