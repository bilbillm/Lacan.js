import type { Language, LocalizedText } from '../i18n'

export interface TimelineEvent {
  year: number;
  title: LocalizedText;
  description: LocalizedText;
}

export function getTimelineEventText(event: TimelineEvent, language: Language) {
  return {
    title: event.title[language],
    description: event.description[language],
  }
}

export const timelineEvents: TimelineEvent[] = [
  {
    year: 1885,
    title: {
      zh: "弗洛伊德赴巴黎学习",
      en: "Freud Studies in Paris",
    },
    description: {
      zh: "西格蒙德·弗洛伊德赴巴黎师从让-马丁·沙可，研究癔症与催眠疗法，为精神分析的诞生奠定基础。",
      en: "Sigmund Freud studied with Jean-Martin Charcot in Paris, examining hysteria and hypnosis and laying groundwork for psychoanalysis.",
    },
  },
  {
    year: 1900,
    title: {
      zh: "《梦的解析》出版",
      en: "The Interpretation of Dreams Published",
    },
    description: {
      zh: "弗洛伊德发表《梦的解析》，提出梦是愿望的满足，开创了无意识心理学的全新领域。",
      en: "Freud published The Interpretation of Dreams, arguing that dreams fulfill wishes and opening a new psychology of the unconscious.",
    },
  },
  {
    year: 1910,
    title: {
      zh: "国际精神分析协会成立",
      en: "International Psychoanalytical Association Founded",
    },
    description: {
      zh: "第二届纽伦堡大会上成立国际精神分析协会（IPA），荣格当选首任主席，精神分析运动正式制度化。",
      en: "At the second Nuremberg congress, the IPA was founded with Jung as its first president, formally institutionalizing the psychoanalytic movement.",
    },
  },
  {
    year: 1920,
    title: {
      zh: "《超越快乐原则》发表",
      en: "Beyond the Pleasure Principle Published",
    },
    description: {
      zh: "弗洛伊德提出死本能（Thanatos）概念，引入重复强迫与二元驱力理论，修正早期心理拓扑模型。",
      en: "Freud introduced the death drive, repetition compulsion, and a dual theory of drives, revising his earlier psychic topology.",
    },
  },
  {
    year: 1936,
    title: {
      zh: "拉康提交镜像阶段论文",
      en: "Lacan Presents the Mirror Stage",
    },
    description: {
      zh: "雅克·拉康在马林巴德国际精神分析大会上提交《镜像阶段》论文，提出婴儿通过镜像识别建构自我的理论。",
      en: "Jacques Lacan presented the mirror stage at the Marienbad congress, theorizing how the infant constructs the ego through specular recognition.",
    },
  },
  {
    year: 1953,
    title: {
      zh: "拉康《罗马演讲》",
      en: "Lacan's Rome Discourse",
    },
    description: {
      zh: "拉康在罗马发表《言语与语言在精神分析中的功能与领域》，提出“回归弗洛伊德”口号，强调语言与能指的核心地位。",
      en: "In Rome, Lacan delivered Function and Field of Speech and Language in Psychoanalysis, calling for a return to Freud and centering language and the signifier.",
    },
  },
  {
    year: 1964,
    title: {
      zh: "拉康创立巴黎弗洛伊德学派",
      en: "Lacan Founds the École Freudienne de Paris",
    },
    description: {
      zh: "因与IPA在分析训练制度上的决裂，拉康创立巴黎弗洛伊德学派（École Freudienne de Paris），开启学派分裂时期。",
      en: "After breaking with the IPA over analytic training, Lacan founded the École Freudienne de Paris, opening a period of institutional division.",
    },
  },
  {
    year: 1973,
    title: {
      zh: "《电视》出版",
      en: "Television Published",
    },
    description: {
      zh: "拉康发表《电视》文本，以高度凝练的风格总结其后期思想，涉及拓扑学、实在界与症状等核心概念。",
      en: "Lacan published Television, a condensed statement of his later thought on topology, the Real, and the symptom.",
    },
  },
  {
    year: 1981,
    title: {
      zh: "拉康逝世",
      en: "Lacan Dies",
    },
    description: {
      zh: "雅克·拉康于巴黎逝世，其学派随后解散，但其思想深刻影响当代哲学、文学理论与临床精神分析。",
      en: "Jacques Lacan died in Paris. His school dissolved soon after, but his thought continued to shape philosophy, literary theory, and clinical psychoanalysis.",
    },
  },
  {
    year: 1990,
    title: {
      zh: "精神分析当代转向",
      en: "Contemporary Turns in Psychoanalysis",
    },
    description: {
      zh: "在后拉康时代，精神分析逐渐与女性主义、酷儿理论及政治哲学交叉，发展出全新的理论话语与临床实践。",
      en: "After Lacan, psychoanalysis increasingly intersected with feminism, queer theory, and political philosophy, producing new theoretical and clinical vocabularies.",
    },
  },
];
