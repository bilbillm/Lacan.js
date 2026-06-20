import type { Language, LocalizedText } from '../../i18n'

export interface PanelData {
  id: string
  title: string
  galleryLabel?: string
  mobileDescription?: string
  text: {
    title: LocalizedText
    galleryLabel: LocalizedText
    mobileDescription: LocalizedText
  }
}

export type SchemaKey = 'SchemaL' | 'SchemaR' | 'SchemaI' | 'SchemaD'

export interface PanelDefinition extends PanelData {
  schemaKey?: SchemaKey
  interactive: boolean
}

export function getPanelText(panel: PanelData, language: Language) {
  return {
    title: panel.text.title[language],
    galleryLabel: panel.text.galleryLabel[language],
    mobileDescription: panel.text.mobileDescription[language],
  }
}

export const panels: PanelDefinition[] = [
  {
    id: 'panel-1',
    title: 'Mirror Stage',
    galleryLabel: 'Mirror Stage',
    mobileDescription: 'A schema of recognition, rivalry, and the first split image of the ego.',
    text: {
      title: { zh: '镜像阶段', en: 'Mirror Stage' },
      galleryLabel: { zh: '镜像阶段', en: 'Mirror Stage' },
      mobileDescription: {
        zh: '关于识别、竞争，以及自我最初裂分影像的图式。',
        en: 'A schema of recognition, rivalry, and the first split image of the ego.',
      },
    },
    schemaKey: 'SchemaL',
    interactive: true,
  },
  {
    id: 'panel-2',
    title: 'The Symbolic',
    galleryLabel: 'The Symbolic',
    mobileDescription: 'Language arranges the subject through signifiers, law, and address.',
    text: {
      title: { zh: '符号界', en: 'The Symbolic' },
      galleryLabel: { zh: '符号界', en: 'The Symbolic' },
      mobileDescription: {
        zh: '语言通过能指、法则与召唤来安排主体的位置。',
        en: 'Language arranges the subject through signifiers, law, and address.',
      },
    },
    schemaKey: 'SchemaR',
    interactive: false,
  },
  {
    id: 'panel-3',
    title: 'The Imaginary',
    galleryLabel: 'The Imaginary',
    mobileDescription: 'Images and identifications bind perception into a fragile consistency.',
    text: {
      title: { zh: '想象界', en: 'The Imaginary' },
      galleryLabel: { zh: '想象界', en: 'The Imaginary' },
      mobileDescription: {
        zh: '影像与认同把感知缝合成一种脆弱的一致性。',
        en: 'Images and identifications bind perception into a fragile consistency.',
      },
    },
    schemaKey: 'SchemaI',
    interactive: true,
  },
  {
    id: 'panel-4',
    title: 'The Real',
    galleryLabel: 'The Real',
    mobileDescription: 'The impossible remainder presses where symbolization reaches its limit.',
    text: {
      title: { zh: '实在界', en: 'The Real' },
      galleryLabel: { zh: '实在界', en: 'The Real' },
      mobileDescription: {
        zh: '无法被符号化的余剩，在意义抵达边界处持续施压。',
        en: 'The impossible remainder presses where symbolization reaches its limit.',
      },
    },
    schemaKey: 'SchemaD',
    interactive: true,
  },
  {
    id: 'panel-5',
    title: 'Panel 5',
    galleryLabel: 'Panel 5',
    mobileDescription: 'A reserved chamber for the next diagram in the analytic sequence.',
    text: {
      title: { zh: '面板五', en: 'Panel 5' },
      galleryLabel: { zh: '面板五', en: 'Panel 5' },
      mobileDescription: {
        zh: '为分析序列中的下一张图式预留的空间。',
        en: 'A reserved chamber for the next diagram in the analytic sequence.',
      },
    },
    interactive: false,
  },
  {
    id: 'panel-6',
    title: 'Panel 6',
    galleryLabel: 'Panel 6',
    mobileDescription: 'A placeholder surface for future relations between speech and desire.',
    text: {
      title: { zh: '面板六', en: 'Panel 6' },
      galleryLabel: { zh: '面板六', en: 'Panel 6' },
      mobileDescription: {
        zh: '为言说与欲望之间的后续关系保留的页面。',
        en: 'A placeholder surface for future relations between speech and desire.',
      },
    },
    interactive: false,
  },
  {
    id: 'panel-7',
    title: 'Panel 7',
    galleryLabel: 'Panel 7',
    mobileDescription: 'A blank interval held for another cut through Lacan’s topology.',
    text: {
      title: { zh: '面板七', en: 'Panel 7' },
      galleryLabel: { zh: '面板七', en: 'Panel 7' },
      mobileDescription: {
        zh: '为拉康拓扑学的另一道切口保留的空白间隔。',
        en: 'A blank interval held for another cut through Lacan’s topology.',
      },
    },
    interactive: false,
  },
  {
    id: 'panel-8',
    title: 'Panel 8',
    galleryLabel: 'Panel 8',
    mobileDescription: 'A final index awaiting expansion into a full analytic panel.',
    text: {
      title: { zh: '面板八', en: 'Panel 8' },
      galleryLabel: { zh: '面板八', en: 'Panel 8' },
      mobileDescription: {
        zh: '等待展开为完整分析面板的最后索引。',
        en: 'A final index awaiting expansion into a full analytic panel.',
      },
    },
    interactive: false,
  },
]
