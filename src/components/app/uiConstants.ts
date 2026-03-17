export const HEADER_ENTRY_DELAY_MS = 2000
export const CARD_ENTRY_START_DELAY_MS = HEADER_ENTRY_DELAY_MS + 950
export const HEADER_SUBTITLE_STAGGER_MS = 250
export const HEADER_TITLE_DURATION_MS = 800
export const HEADER_SUBTITLE_DURATION_MS = 700

export const MOBILE_BREAKPOINT_PX = 960
export const MOBILE_VIEWPORT_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`

export const RESPONSIVE_SIZE_TOKENS = {
  shellPaddingInline: {
    desktop: 48,
    mobile: 20,
  },
  shellPaddingTop: {
    desktop: 96,
    mobile: 88,
  },
  shellPaddingBottom: {
    desktop: 48,
    mobile: 112,
  },
  headerTopOffset: {
    desktop: 48,
    mobile: 24,
  },
  progressBottomOffset: {
    desktop: 48,
    mobile: 24,
  },
  focusPaddingInline: {
    desktop: 0,
    mobile: 20,
  },
  focusPaddingBlock: {
    desktop: 0,
    mobile: 20,
  },
} as const

export const HEADER_RESPONSIVE_TOKENS = {
  containerMaxWidth: {
    desktop: 'none',
    mobile: `calc(100vw - ${RESPONSIVE_SIZE_TOKENS.shellPaddingInline.mobile * 2}px)`,
  },
  titleFontSize: {
    desktop: '2.35rem',
    mobile: '1.7rem',
  },
  titleTracking: {
    desktop: '0.35em',
    mobile: '0.2em',
  },
  subtitleFontSize: {
    desktop: '1.125rem',
    mobile: '0.8rem',
  },
  subtitleTracking: {
    desktop: '0.35em',
    mobile: '0.16em',
  },
  subtitleMaxWidth: {
    desktop: 'none',
    mobile: '28ch',
  },
} as const

export const GLASS_PANEL_RESPONSIVE_TOKENS = {
  contentInset: {
    desktop: 24,
    mobile: 14,
  },
  contentRadius: {
    desktop: 12,
    mobile: 10,
  },
} as const

export const GALLERY_PAGE_FADE_DURATION_S = 0.18
export const GALLERY_CARD_ENTRY_DURATION_S = 0.5
export const GALLERY_CARD_REENTER_DURATION_S = 0.32
export const GALLERY_CARD_STAGGER_S = 0.15

export const PROGRESS_BAR_ENTRY_DURATION_S = 0.65
export const PROGRESS_BAR_UPDATE_DURATION_S = 0.26
export const PROGRESS_BAR_TRACK_DURATION_S = 0.24
export const PROGRESS_LABEL_ENTRY_DURATION_S = 0.35
export const PROGRESS_LABEL_STAGGER_S = 0.08

export const FOCUS_EXIT_MS = 600
export const FOCUS_BACKDROP_FADE_S = 0.2
export const WHEEL_NAV_THRESHOLD = 30

export const GALLERY_CARD_WIDTH = 252
export const GALLERY_CARD_HEIGHT = 368

export const GALLERY_MOBILE_CARD_MAX_WIDTH = 336
export const GALLERY_MOBILE_CARD_HEIGHT = 280

export const GALLERY_LAYOUT_TOKENS = {
  desktop: {
    columns: 4,
    gap: 32,
    maxWidth: 1280,
    reflectionOffsetY: 112,
    reflectionHeightRatio: 0.41,
    reflectionOpacity: 0.34,
  },
  mobile: {
    columns: 1,
    gap: 20,
    maxWidth: GALLERY_MOBILE_CARD_MAX_WIDTH,
    reflectionOffsetY: 56,
    reflectionHeightRatio: 0.24,
    reflectionOpacity: 0.18,
  },
} as const

export const GALLERY_PROGRESS_TOKENS = {
  desktop: {
    widthViewport: 38,
    maxWidth: 360,
    labelFontRem: 0.65,
    labelTrackingEm: 0.28,
  },
  mobile: {
    widthViewport: 52,
    maxWidth: 240,
    labelFontRem: 0.72,
    labelTrackingEm: 0.22,
  },
} as const

export const FOCUS_PANEL_MAX_WIDTH = 540
export const FOCUS_PANEL_MAX_HEIGHT = 780

export const FOCUS_PANEL_VIEWPORT_SIZES = {
  desktop: {
    mainWidth: '60vw',
    secondaryWidth: '50vw',
    panelHeight: '80vh',
    mainCenteredLeft: '50%',
    mainShiftedLeft: '30%',
    secondaryPaddingRight: '10vw',
  },
  mobile: {
    panelWidth: '100%',
    mainHeight: 'min(70vh, 560px)',
    secondaryHeight: 'min(52vh, 420px)',
    stackGap: 20,
  },
} as const
