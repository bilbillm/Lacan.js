export type Language = 'zh' | 'en'

export interface LocalizedText {
  zh: string
  en: string
}

export const uiCopy = {
  app: {
    headerSubtitle: {
      zh: '精神分析的空间架构',
      en: 'The Spatial Architecture of Psychoanalysis',
    },
    switchToLanguage: {
      zh: '切换到英文',
      en: 'Switch to Chinese',
    },
    switchToTheme: {
      day: {
        zh: '切换到夜间模式',
        en: 'Switch to night mode',
      },
      night: {
        zh: '切换到昼间模式',
        en: 'Switch to day mode',
      },
    },
  },
  splash: {
    kicker: {
      zh: '公告',
      en: 'Notice',
    },
    headline: {
      zh: '症状说出主体尚未能说出的话。',
      en: 'The symptom speaks what the subject cannot yet say.',
    },
    category: {
      zh: '精神分析临床',
      en: 'Psychoanalytic clinic',
    },
  },
  homeSignature: {
    designedBy: {
      zh: '设计：Lumoren',
      en: 'Designed by Lumoren',
    },
    forum: {
      zh: '觉心论坛',
      en: 'Juexin Forum',
    },
  },
  focus: {
    close: {
      zh: '关闭聚焦视图',
      en: 'Close focus view',
    },
  },
  gallery: {
    fallbackDescription: {
      zh: '进入图式及其分析关系的紧凑入口。',
      en: 'A compact entry into the diagram and its analytic relations.',
    },
    previousPage: {
      zh: '上一页',
      en: 'Previous page',
    },
    nextPage: {
      zh: '下一页',
      en: 'Next page',
    },
    pageStatus: {
      zh: '第 {current} / {total} 页',
      en: 'Page {current} / {total}',
    },
  },
  timeline: {
    title: {
      zh: '精神分析发展史',
      en: 'History of Psychoanalysis',
    },
    subtitle: {
      zh: '精神分析思想时间线',
      en: 'A Timeline of Psychoanalytic Thought',
    },
    illustrationAlt: {
      zh: '插图',
      en: 'illustration',
    },
    closeButton: {
      zh: '关闭',
      en: 'Close',
    },
    closeHint: {
      zh: '点击空白处关闭',
      en: 'Click outside to close',
    },
  },
  borromean: {
    title: {
      zh: '波罗米结',
      en: 'Borromean Knot',
    },
    subtitle: {
      zh: 'RSI 三界锁合',
      en: 'The RSI Interconnection',
    },
    svgTitle: {
      zh: '波罗米结：符号界、想象界、实在界交错锁合',
      en: 'Borromean knot: the Symbolic, Imaginary, and Real interlock',
    },
    copy: {
      zh: '三枚完整圆环，两两不相连，但三者交织，任取其一，其余便散。交叉处上下交替，每个环与另两环各交叉一次，形成拓扑锁合。',
      en: 'Three complete rings are not linked in pairs, yet the three interlock. Remove any one ring, and the remaining two fall apart. The crossings alternate over and under so each ring crosses the other two once.',
    },
    desktopCopyLine1: {
      zh: '三枚完整圆环，两两不相连——但三者交织，任取其一，其余便散。',
      en: 'Three complete rings are not linked in pairs, yet the three interlock.',
    },
    desktopCopyLine2: {
      zh: '交叉处上下交替：每个环与另两环各交叉一次，形成拓扑锁合。',
      en: 'The crossings alternate over and under, forming a topological lock.',
    },
    rings: {
      S: {
        zh: '符号界',
        en: 'Symbolic',
      },
      I: {
        zh: '想象界',
        en: 'Imaginary',
      },
      R: {
        zh: '实在界',
        en: 'Real',
      },
    },
  },
} as const
