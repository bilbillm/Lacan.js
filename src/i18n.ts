export type Language = 'zh' | 'en'

export interface LocalizedText {
  zh: string
  en: string
}

export const uiCopy = {
  app: {
    skipToContent: { zh: '跳到主要内容', en: 'Skip to main content' },
    switchToLanguage: { zh: '切换到英文', en: 'Switch to Chinese' },
    switchToTheme: {
      day: { zh: '切换到夜间模式', en: 'Switch to night mode' },
      night: { zh: '切换到昼间模式', en: 'Switch to day mode' },
    },
    openMenu: { zh: '打开导航菜单', en: 'Open navigation menu' },
    closeMenu: { zh: '关闭导航菜单', en: 'Close navigation menu' },
  },
  nav: {
    theory: { zh: '图式', en: 'Schemas' },
    timeline: { zh: '发展史', en: 'Timeline' },
    borromean: { zh: '波罗米结', en: 'Borromean' },
  },
  hero: {
    eyebrow: { zh: '精神分析的空间架构', en: 'The Spatial Architecture of Psychoanalysis' },
    statement: {
      zh: '让能指、欲望与主体的位置变得可见。',
      en: 'Making the positions of signifier, desire, and subject visible.',
    },
    explore: { zh: '进入理论图式', en: 'Enter the schemas' },
    index: { zh: '开放索引 / 08', en: 'Open index / 08' },
    quotes: {
      zh: [
        '无意识像语言一样被结构。',
        '人的欲望是他者的欲望。',
        '我在我不思考之处存在。',
        '真理具有虚构的结构。',
        '爱，就是给予你所没有的东西。',
        '能指为另一个能指代表主体。',
        '不存在元语言。',
        '不存在性关系。',
        '症状是一种隐喻。',
        '分析家只从自身获得授权。',
      ],
      en: [
        'The unconscious is structured like a language.',
        "Man's desire is the desire of the Other.",
        'I am where I do not think.',
        'Truth has the structure of a fiction.',
        'To love is to give what one does not have.',
        'A signifier represents the subject for another signifier.',
        'There is no metalanguage.',
        'There is no sexual relationship.',
        'The symptom is a metaphor.',
        'The analyst authorizes himself only by himself.',
      ],
    },
  },
  theory: {
    sectionNumber: '01',
    eyebrow: { zh: '理论图式', en: 'Theory Atlas' },
    title: { zh: '阅读关系，而不是孤立的概念', en: 'Read relations, not isolated concepts' },
    intro: {
      zh: '八组图式把拉康理论中的位置、切割与转换组织成可操作的视觉结构。',
      en: 'Eight constructions turn positions, cuts, and transformations in Lacanian theory into explorable visual structures.',
    },
    groups: {
      core: { zh: '核心图式', en: 'Core Schemas' },
      extended: { zh: '扩展构造', en: 'Extended Constructions' },
    },
    openPanel: { zh: '打开理论档案', en: 'Open theory dossier' },
  },
  dossier: {
    close: { zh: '关闭理论档案', en: 'Close theory dossier' },
    source: { zh: '出处', en: 'Source' },
    interaction: { zh: '交互阅读', en: 'Interactive reading' },
    waiting: {
      zh: '操作图式后，关系说明会在这里展开。',
      en: 'Interact with the diagram to reveal a relational reading here.',
    },
  },
  timeline: {
    sectionNumber: '02',
    eyebrow: { zh: '思想档案', en: 'Archive of Ideas' },
    title: { zh: '精神分析发展史', en: 'A History of Psychoanalysis' },
    subtitle: {
      zh: '从癔症研究到拉康之后，十个切面构成一条不平直的思想轨迹。',
      en: 'Ten cuts trace an uneven path from the study of hysteria to the field after Lacan.',
    },
    openEvent: { zh: '打开事件档案', en: 'Open event archive' },
    close: { zh: '关闭事件档案', en: 'Close event archive' },
    illustrationAlt: { zh: '档案图像', en: 'archive image' },
  },
  borromean: {
    sectionNumber: '03',
    eyebrow: { zh: '拓扑收束', en: 'Topological Closure' },
    title: { zh: '三界并不叠加，它们彼此锁合', en: 'The three registers do not stack. They interlock.' },
    subtitle: {
      zh: '任取一环，其余两环便彼此松脱。选择一个界，观察整个结构如何改变重心。',
      en: 'Remove one ring and the other two fall apart. Select a register and watch the structure shift its emphasis.',
    },
    svgTitle: {
      zh: '符号界、想象界与实在界构成的波罗米结',
      en: 'A Borromean knot formed by the Symbolic, Imaginary, and Real',
    },
    selectRing: { zh: '选择一个界', en: 'Select a register' },
    rings: {
      S: {
        label: { zh: '符号界', en: 'Symbolic' },
        title: { zh: 'S / 符号界', en: 'S / The Symbolic' },
        body: {
          zh: '语言、法则与差异构成主体可以被指认的位置；它不是词语的集合，而是能指之间的关系网络。',
          en: 'Language, law, and difference form the positions from which a subject can be named: not a collection of words, but a network of signifying relations.',
        },
      },
      I: {
        label: { zh: '想象界', en: 'Imaginary' },
        title: { zh: 'I / 想象界', en: 'I / The Imaginary' },
        body: {
          zh: '形象、相似性与认同给予自我一种完整感，同时也制造竞争、误认与对镜像的依赖。',
          en: 'Images, resemblance, and identification lend the ego a sense of wholeness while producing rivalry, misrecognition, and dependence on the image.',
        },
      },
      R: {
        label: { zh: '实在界', en: 'Real' },
        title: { zh: 'R / 实在界', en: 'R / The Real' },
        body: {
          zh: '实在界不是现实本身，而是符号化无法完全收编的余剩；它从结构的裂口处持续返回。',
          en: 'The Real is not reality itself but the remainder symbolization cannot absorb, returning at the points where structure fails.',
        },
      },
    },
  },
  footer: {
    eyebrow: { zh: '分析不是给出答案', en: 'Analysis does not give answers' },
    title: {
      zh: ['而是让主体听见，', '自己话语中的裂缝。'],
      en: ['It lets the subject hear', 'the fissure in their own speech.'],
    },
    designedBy: { zh: '设计：Lumoren', en: 'Designed by Lumoren' },
    association: { zh: '觉心精神分析论坛', en: 'Juexin Psychoanalysis Forum' },
    backToTop: { zh: '回到开端', en: 'Return to the beginning' },
  },
} as const
