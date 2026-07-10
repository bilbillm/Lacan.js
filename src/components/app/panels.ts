import type { Language, LocalizedText } from '../../i18n'

export type TheoryGroup = 'core' | 'extended'
export type PanelAccent = 'ink' | 'vermilion' | 'cobalt'
export type VisualizationKey =
  | 'schema-l'
  | 'schema-r'
  | 'schema-i'
  | 'graph-desire'
  | 'four-discourses'
  | 'sexuation'
  | 'optical-model'
  | 'subject-topology'

export interface LocalizedInsight {
  title: LocalizedText
  body: LocalizedText
}

export interface LocalizedPanelText {
  eyebrow: LocalizedText
  title: LocalizedText
  indexTitle: LocalizedText
  shortTitle: LocalizedText
  summary: LocalizedText
  body: LocalizedText
  interactionHint: LocalizedText
}

export interface TheoryPanelDefinition {
  id: string
  group: TheoryGroup
  visualizationKey: VisualizationKey
  accent: PanelAccent
  text: LocalizedPanelText
  source: LocalizedText
  insights: Record<string, LocalizedInsight>
}

export function getPanelText(panel: TheoryPanelDefinition, language: Language) {
  return {
    eyebrow: panel.text.eyebrow[language],
    title: panel.text.title[language],
    indexTitle: panel.text.indexTitle[language],
    shortTitle: panel.text.shortTitle[language],
    summary: panel.text.summary[language],
    body: panel.text.body[language],
    interactionHint: panel.text.interactionHint[language],
    source: panel.source[language],
  }
}

const insight = (
  zhTitle: string,
  enTitle: string,
  zhBody: string,
  enBody: string,
): LocalizedInsight => ({
  title: { zh: zhTitle, en: enTitle },
  body: { zh: zhBody, en: enBody },
})

export const panels: TheoryPanelDefinition[] = [
  {
    id: 'panel-1',
    group: 'core',
    visualizationKey: 'schema-l',
    accent: 'vermilion',
    text: {
      eyebrow: { zh: '图式 L / 1954', en: 'Schema L / 1954' },
      title: { zh: '主体、大他者与自我', en: 'Subject, Other, and Ego' },
      indexTitle: { zh: '主体 / 大他者 / 自我', en: 'Subject / Other / Ego' },
      shortTitle: { zh: '图式 L', en: 'Schema L' },
      summary: {
        zh: '四个位置与两条交叉轴线，展示主体如何被语言和镜像关系分割。',
        en: 'Four positions and two crossing axes show how language and the image divide the subject.',
      },
      body: {
        zh: '图式 L 把主体关系压缩成一张结构地图：象征轴连接主体与大他者，想象轴则在自我与小他者之间形成遮蔽。主体并不直接掌握自己的言说，而是在交叉关系中被定位。',
        en: 'Schema L condenses subjectivity into a structural map. The symbolic axis links subject and big Other, while the imaginary axis between ego and little other screens that relation. Speech locates the subject before the subject can master it.',
      },
      interactionHint: {
        zh: '依次选择两个节点，查看它们之间的结构关系。',
        en: 'Select two nodes to read the relation between their positions.',
      },
    },
    source: {
      zh: '拉康，《研讨班 II：弗洛伊德理论与精神分析技术中的自我》，1954–55。',
      en: 'Jacques Lacan, Seminar II: The Ego in Freud\'s Theory and in the Technique of Psychoanalysis, 1954–55.',
    },
    insights: {
      S_A: insight('主体 ↔ 大他者', 'Subject ↔ big Other', '象征轴标示主体的言说从大他者处获得位置；话语总先于说话者存在。', 'The symbolic axis marks how speech receives its position from the big Other; discourse precedes the speaker.'),
      S_a: insight('主体 ↔ 小他者', 'Subject ↔ little other', '主体只能经由他者的形象接近自己，因此任何自我把握都包含误认。', 'The subject approaches itself through the other\'s image, so every self-grasp includes misrecognition.'),
      'S_a-prime': insight('主体 ↔ 自我', 'Subject ↔ ego', '自我不是主体的透明中心，而是主体在镜像关系中形成的对象。', 'The ego is not the transparent center of the subject but an object formed in the specular relation.'),
      A_a: insight('大他者 ↔ 小他者', 'big Other ↔ little other', '具体他者被语言中的位置编码；想象关系从未脱离象征秩序。', 'The concrete other is coded by positions in language; imaginary relations never stand outside the symbolic order.'),
      'A_a-prime': insight('大他者 ↔ 自我', 'big Other ↔ ego', '自我借用大他者提供的名称与理想来维持一致性。', 'The ego borrows names and ideals supplied by the big Other to sustain its coherence.'),
      'a-prime_a': insight('自我 ↔ 小他者', 'ego ↔ little other', '想象轴既产生认同，也产生竞争：相似性总伴随着对位置的争夺。', 'The imaginary axis produces both identification and rivalry: resemblance carries a struggle over position.'),
    },
  },
  {
    id: 'panel-2',
    group: 'core',
    visualizationKey: 'schema-r',
    accent: 'cobalt',
    text: {
      eyebrow: { zh: '图式 R / 1958', en: 'Schema R / 1958' },
      title: { zh: '现实的场域', en: 'The Field of Reality' },
      indexTitle: { zh: '现实的场域', en: 'The Field of Reality' },
      shortTitle: { zh: '图式 R', en: 'Schema R' },
      summary: {
        zh: '现实并非天然给定，而是在想象场与象征场的缝合中获得稳定。',
        en: 'Reality is not simply given; it stabilizes where imaginary and symbolic fields are stitched together.',
      },
      body: {
        zh: '图式 R 描绘主体的现实如何被两个异质场域共同支撑。想象认同给予形象，象征秩序给予位置；两者围合出的区域才表现为可居住的现实。',
        en: 'Schema R describes reality as supported by two heterogeneous fields. Imaginary identification supplies images, symbolic order supplies positions, and the region enclosed between them appears as inhabitable reality.',
      },
      interactionHint: {
        zh: '选择想象场、象征场或现实区域，查看各自的结构功能。',
        en: 'Select the imaginary field, symbolic field, or reality zone to inspect its function.',
      },
    },
    source: {
      zh: '拉康，《论任何可能的精神病治疗的先决问题》，1958。',
      en: 'Jacques Lacan, On a Question Prior to Any Possible Treatment of Psychosis, 1958.',
    },
    insights: {
      imaginary: insight('想象场', 'Imaginary field', '形象、身体一致性与自我认同在这一侧组织经验，使世界显得连续。', 'Images, bodily unity, and ego identification organize experience here, lending the world an appearance of continuity.'),
      symbolic: insight('象征场', 'Symbolic field', '亲属、名称、法则与能指链为主体分配可以被言说的位置。', 'Kinship, names, law, and signifying chains assign the subject positions from which it can be spoken.'),
      reality: insight('现实区域', 'Reality zone', '现实是两个场域暂时缝合的结果，而不是与结构无关的外部事实。', 'Reality is the provisional result of stitching these fields together, not an external fact independent of structure.'),
    },
  },
  {
    id: 'panel-3',
    group: 'core',
    visualizationKey: 'schema-i',
    accent: 'ink',
    text: {
      eyebrow: { zh: '图式 I / 1958', en: 'Schema I / 1958' },
      title: { zh: '精神病性重构', en: 'Psychotic Reconstruction' },
      indexTitle: { zh: '精神病性 / 重构', en: 'Psychotic / Reconstruction' },
      shortTitle: { zh: '图式 I', en: 'Schema I' },
      summary: {
        zh: '当关键能指未被纳入象征秩序，主体如何重新组织可居住的世界。',
        en: 'How a subject reconstructs an inhabitable world when a decisive signifier is not inscribed in the symbolic order.',
      },
      body: {
        zh: '图式 I 并非单纯描述崩解，而是描绘一种重建工作。妄想隐喻重新连接形象、名称与主体位置，使被破坏的现实获得新的边界。',
        en: 'Schema I does not describe collapse alone; it maps a work of reconstruction. Delusional metaphor reconnects images, names, and subjective positions so a damaged reality can acquire new boundaries.',
      },
      interactionHint: {
        zh: '选择两个端点，查看重构如何跨越想象场与象征场。',
        en: 'Select two endpoints to see how reconstruction crosses imaginary and symbolic fields.',
      },
    },
    source: {
      zh: '拉康，《论任何可能的精神病治疗的先决问题》，1958。',
      en: 'Jacques Lacan, On a Question Prior to Any Possible Treatment of Psychosis, 1958.',
    },
    insights: {
      S_O: insight('主体 ↔ 他者', 'Subject ↔ Other', '被扰动的主体位置尝试在一个重新组织的大他者中获得新的地址。', 'A disturbed subjective position seeks a new address in a reorganized Other.'),
      S_Sym: insight('主体 ↔ 象征场', 'Subject ↔ symbolic field', '象征缺口无法由既有法则自动填补，新的命名工作因而成为重构核心。', 'The symbolic gap cannot be filled automatically by existing law, making a new work of naming central to reconstruction.'),
      S_Im: insight('主体 ↔ 想象场', 'Subject ↔ imaginary field', '身体与形象关系承担稳定作用，为主体建立临时边界。', 'Relations to body and image take on a stabilizing role, giving the subject provisional boundaries.'),
      O_Sym: insight('他者 ↔ 象征场', 'Other ↔ symbolic field', '大他者的秩序不再显得完整，言语可能以侵入性的方式返回。', 'The order of the big Other no longer appears complete, and speech may return in an intrusive form.'),
      O_Im: insight('他者 ↔ 想象场', 'Other ↔ imaginary field', '他者的形象获得过度确定性，既可能威胁主体，也可能支撑重建。', 'The other\'s image acquires excessive certainty, becoming either a threat or a support for reconstruction.'),
      Sym_Im: insight('象征场 ↔ 想象场', 'Symbolic ↔ imaginary fields', '妄想隐喻在两个场域之间建立新的缝合，使现实重新取得一致性。', 'Delusional metaphor creates a new stitch between the two fields, allowing reality to regain consistency.'),
    },
  },
  {
    id: 'panel-4',
    group: 'core',
    visualizationKey: 'graph-desire',
    accent: 'vermilion',
    text: {
      eyebrow: { zh: '欲望图 / 1960', en: 'Graph of Desire / 1960' },
      title: { zh: '能指与欲望', en: 'Signifier and Desire' },
      indexTitle: { zh: '能指与欲望', en: 'Signifier and Desire' },
      shortTitle: { zh: '欲望图', en: 'Graph of Desire' },
      summary: {
        zh: '需求经过语言后不再原样返回，欲望在言说的两层回路之间产生。',
        en: 'Need does not return unchanged after language; desire emerges between two circuits of speech.',
      },
      body: {
        zh: '欲望图把言说展开成上下两层。下层处理陈述与意义，上层触及询问、幻想与“他者要我怎样”的问题。欲望不是等待满足的对象，而是需求被语言切割后留下的运动。',
        en: 'The graph unfolds speech across two levels. The lower circuit handles statement and meaning; the upper reaches demand, fantasy, and the question of what the Other wants. Desire is not an object awaiting satisfaction but the movement left when language cuts through need.',
      },
      interactionHint: {
        zh: '选择两个节点，查看欲望回路如何跨越陈述与询问。',
        en: 'Select two nodes to trace how desire crosses statement and question.',
      },
    },
    source: {
      zh: '拉康，《主体的颠覆与欲望的辩证法》，1960。',
      en: 'Jacques Lacan, The Subversion of the Subject and the Dialectic of Desire, 1960.',
    },
    insights: {
      S_O: insight('主体 ↔ 大他者', 'Subject ↔ big Other', '主体的问题通过大他者的能指库获得形式，但答案从不封闭。', 'The subject\'s question takes form through the Other\'s treasury of signifiers, but the answer never closes.'),
      S_D: insight('主体 ↔ 需求', 'Subject ↔ demand', '需求一旦被说出便超出具体需要，同时要求爱与承认。', 'Once spoken, demand exceeds concrete need and also asks for love and recognition.'),
      S_a: insight('主体 ↔ 对象 a', 'Subject ↔ object a', '对象 a 不是欲望的终点，而是使欲望持续运转的原因。', 'Object a is not desire\'s destination but the cause that keeps desire in motion.'),
      O_D: insight('大他者 ↔ 需求', 'big Other ↔ demand', '需求必须借用大他者的语言，因此总带着他者回应的印记。', 'Demand must borrow the Other\'s language and therefore carries the mark of the Other\'s response.'),
      O_a: insight('大他者 ↔ 对象 a', 'big Other ↔ object a', '大他者中的缺失使对象 a 成为不可被最终命名的余剩。', 'A lack in the Other leaves object a as a remainder that cannot be finally named.'),
      D_a: insight('需求 ↔ 对象 a', 'demand ↔ object a', '任何满足都留下差额；这个差额不是失败，而是欲望得以继续的条件。', 'Every satisfaction leaves a difference; that difference is not failure but the condition for desire to continue.'),
    },
  },
  {
    id: 'panel-5',
    group: 'extended',
    visualizationKey: 'four-discourses',
    accent: 'cobalt',
    text: {
      eyebrow: { zh: '话语结构 / 1969', en: 'Discourse Structure / 1969' },
      title: { zh: '四种话语', en: 'The Four Discourses' },
      indexTitle: { zh: '四种话语', en: 'The Four Discourses' },
      shortTitle: { zh: '四种话语', en: 'Four Discourses' },
      summary: {
        zh: '四个项轮换占据施动者、他者、真理与产品的位置，形成四种社会联结。',
        en: 'Four terms rotate through agent, other, truth, and product to form four social bonds.',
      },
      body: {
        zh: '主人、大学、癔症者与分析家话语并不是职业分类，而是话语如何组织权威、知识、分裂主体与对象 a 的四种方式。每次四分之一转都会改变谁在发言、谁被召唤，以及什么被压在横线之下。',
        en: 'Master, university, hysteric, and analyst discourse are not professions but four ways discourse arranges authority, knowledge, divided subject, and object a. Each quarter-turn changes who speaks, who is addressed, and what remains beneath the bar.',
      },
      interactionHint: { zh: '切换四种话语，观察四个项如何轮换位置。', en: 'Switch discourses and watch the four terms rotate through their positions.' },
    },
    source: { zh: '拉康，《研讨班 XVII：精神分析的反面》，1969–70。', en: 'Jacques Lacan, Seminar XVII: The Other Side of Psychoanalysis, 1969–70.' },
    insights: {
      master: insight('主人话语', 'Master discourse', 'S1 以命令的位置召唤知识 S2；被遮蔽的是分裂主体，产品则是无法被统摄的对象 a。', 'S1 commands knowledge S2; the divided subject remains as truth beneath the bar, while object a is produced as remainder.'),
      university: insight('大学话语', 'University discourse', '知识 S2 以中立面貌发言，却由主人能指 S1 支撑，并把对象当作被管理者。', 'Knowledge S2 speaks in a neutral voice while being supported by master-signifier S1 and addressing the object as what is to be administered.'),
      hysteric: insight('癔症者话语', 'Hysteric discourse', '分裂主体向主人能指发问，迫使其生产知识，却不断暴露答案的不足。', 'The divided subject questions the master-signifier, forcing it to produce knowledge while exposing the insufficiency of every answer.'),
      analyst: insight('分析家话语', 'Analyst discourse', '分析家占据对象 a 的位置，使分裂主体发言，并让新的主人能指出现在产品位置。', 'The analyst occupies the place of object a, causing the divided subject to speak and allowing a new master-signifier to emerge as product.'),
    },
  },
  {
    id: 'panel-6',
    group: 'extended',
    visualizationKey: 'sexuation',
    accent: 'vermilion',
    text: {
      eyebrow: { zh: '逻辑公式 / 1972', en: 'Logical Formulae / 1972' },
      title: { zh: '性化公式', en: 'Formulae of Sexuation' },
      indexTitle: { zh: '性化公式', en: 'Formulae of Sexuation' },
      shortTitle: { zh: '性化公式', en: 'Sexuation' },
      summary: {
        zh: '两组量词逻辑描述主体与菲勒斯功能的关系，而不是生理性别分类。',
        en: 'Two quantifier logics describe positions toward the phallic function rather than biological categories.',
      },
      body: {
        zh: '公式的左右两侧不是“男人与女人”的经验清单，而是两种逻辑位置：一侧以例外支撑全体，另一侧没有构成全体的例外，因此被称为“不全”。主体可能以复杂方式同这些位置发生关系。',
        en: 'The two sides are not empirical lists of men and women but logical positions. One side grounds the all in an exception; the other has no exception capable of closing a totality and is therefore called not-all. Subjects may relate to these positions in complex ways.',
      },
      interactionHint: { zh: '选择一条公式，查看量词、否定与菲勒斯功能如何组合。', en: 'Select a formula to read how quantifier, negation, and phallic function combine.' },
    },
    source: { zh: '拉康，《研讨班 XX：再来一次》，1972–73。', en: 'Jacques Lacan, Seminar XX: Encore, 1972–73.' },
    insights: {
      left_exception: insight('存在一个例外', 'There exists an exception', '例外并非逃离法则，而是让“所有”看起来能够闭合的逻辑支点。', 'The exception does not simply escape the law; it is the logical support that lets the all appear closed.'),
      left_all: insight('所有都受制于功能', 'All are submitted to the function', '全称命题借助例外建立一个可计数的整体。', 'The universal proposition builds a countable whole by relying on the exception.'),
      right_no_exception: insight('不存在构成全体的例外', 'No exception closes the set', '这一侧没有一个外部位置可以保证整体封闭。', 'On this side no external position can guarantee the closure of the whole.'),
      right_not_all: insight('并非全部受制', 'Not-all submitted', '“不全”不是部分缺失，而是无法把这一侧写成一个完成的普遍整体。', 'Not-all is not a missing portion but the impossibility of writing this side as a completed universal whole.'),
    },
  },
  {
    id: 'panel-7',
    group: 'extended',
    visualizationKey: 'optical-model',
    accent: 'cobalt',
    text: {
      eyebrow: { zh: '光学模型 / 1953', en: 'Optical Model / 1953' },
      title: { zh: '自我理想与理想自我', en: 'Ego Ideal and Ideal Ego' },
      indexTitle: { zh: '自我理想 / 理想自我', en: 'Ego Ideal / Ideal Ego' },
      shortTitle: { zh: '光学模型', en: 'Optical Model' },
      summary: {
        zh: '镜面、视点与花束实验说明完整自我形象依赖一个被安排的位置。',
        en: 'Mirrors, viewpoint, and the bouquet experiment show that a coherent ego image depends on an arranged position.',
      },
      body: {
        zh: '拉康借用布阿斯的倒置花束实验区分理想自我与自我理想。图像是否成立，不只取决于对象，也取决于主体站在哪里、从哪个象征位置观看。',
        en: 'Lacan adapts Bouasse\'s inverted bouquet experiment to distinguish ideal ego from ego ideal. Whether the image coheres depends not only on the object but on where the subject stands and from which symbolic position it looks.',
      },
      interactionHint: { zh: '移动观察点，比较实像汇聚与虚像定位。', en: 'Move the observer to compare real-image convergence with virtual-image placement.' },
    },
    source: { zh: '拉康，《研讨班 I》，1953–54；《关于丹尼尔·拉加什报告的评论》，1960。', en: 'Jacques Lacan, Seminar I, 1953–54; Remarks on Daniel Lagache\'s Presentation, 1960.' },
    insights: {
      real_image: insight('实像区', 'Real-image zone', '当视点落在可汇聚区域，隐藏的花束与花瓶形成看似完整的实像。', 'When the viewpoint enters the convergence zone, hidden bouquet and vase form an apparently coherent real image.'),
      virtual_image: insight('虚像区', 'Virtual-image zone', '视点离开汇聚条件后，完整形象只能被定位在镜后；一致性暴露为位置效应。', 'Outside the convergence conditions, the coherent image can only be located behind the mirror, revealing unity as an effect of position.'),
    },
  },
  {
    id: 'panel-8',
    group: 'extended',
    visualizationKey: 'subject-topology',
    accent: 'ink',
    text: {
      eyebrow: { zh: '主体拓扑 / 1961', en: 'Topology of the Subject / 1961' },
      title: { zh: '切割、表面与边界', en: 'Cuts, Surfaces, and Boundaries' },
      indexTitle: { zh: '切割 / 表面 / 边界', en: 'Cuts / Surfaces / Boundaries' },
      shortTitle: { zh: '主体拓扑', en: 'Subject Topology' },
      summary: {
        zh: '莫比乌斯带、环面与交叉帽让内外、孔洞和切割成为主体结构的一部分。',
        en: 'Möbius strip, torus, and cross-cap make inside/outside, holes, and cuts part of subjective structure.',
      },
      body: {
        zh: '拓扑对象不是理论的装饰插图。它们迫使我们放弃稳定的内外二分：一次切割可能改变整个表面，一条边界可能回到自身，缺口也可能比实体更具组织作用。',
        en: 'Topological objects are not decorative illustrations. They force us to abandon a stable inside/outside split: one cut can transform an entire surface, an edge can return to itself, and a hole can organize more than a solid body.',
      },
      interactionHint: { zh: '切换三个表面，观察边界与孔洞如何改变主体模型。', en: 'Switch surfaces to see how boundaries and holes alter the model of the subject.' },
    },
    source: { zh: '拉康，《研讨班 IX：认同》，1961–62。', en: 'Jacques Lacan, Seminar IX: Identification, 1961–62.' },
    insights: {
      mobius: insight('莫比乌斯带', 'Möbius strip', '只有一个面的带子让内与外连续相接；沿表面前进会在不跨越边界的情况下抵达“另一面”。', 'A one-sided strip joins inside and outside continuously; following its surface reaches the other side without crossing an edge.'),
      torus: insight('环面', 'Torus', '围绕孔洞的两种回路区分需求的重复与欲望无法被填满的中心。', 'Two circuits around the hole distinguish repeated demand from the center desire cannot fill.'),
      crosscap: insight('交叉帽', 'Cross-cap', '自我交叉的表面把切割写进结构，展示幻想如何围绕不可还原的缺口组织。', 'A self-intersecting surface writes the cut into the structure, showing how fantasy organizes itself around an irreducible gap.'),
    },
  },
]

export const panelById = new Map(panels.map((panel) => [panel.id, panel]))
