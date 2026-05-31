import type { TutorialScenario } from '../types';

export const leaveApprovalScenario: TutorialScenario = {
  id: 'leave-approval',
  title: '员工请假审批系统',
  description: '搭建一个完整的请假申请与自动审批流程系统',
  icon: '🏖️',
  chapters: [
    {
      id: 'ch1',
      title: '建表单',
      subtitle: '建数据入口',
      steps: [
        {
          id: 'ch1-s1',
          type: 'info-card',
          title: '第 1 章：建表单',
          narration:
            '我们来搭一个**请假管理系统**。\n\n第一步，做一张让大家填的**请假申请表**。在低代码里，表单就是数据的入口——每次有人提交申请，数据就会自动进入系统。\n\n接下来，你需要把几个字段拖进画布，完成这张表单。',
          next: '准备好了，开始！',
          navigateTo: 'form',
        },
        {
          id: 'ch1-s2',
          type: 'spotlight',
          narration:
            '这是**表单设计器**。\n\n👈 左侧：字段库（你的"积木盒子"）\n🖼️ 中间：画布（搭表单的地方）\n⚙️ 右侧：属性配置区\n\n把左侧字段拖到中间画布，表单就搭好了！',
          target: 'form-designer-area',
          next: '明白了，开始拖！',
          navigateTo: 'form',
        },
        {
          id: 'ch1-s3',
          type: 'gated',
          narration: '第 1 步：把「**成员**」字段拖入表单画布。\n\n这个字段用来记录"是谁在提申请"，点击后会显示成员选择器。',
          target: 'field-member',
          completeWhen: {
            event: 'state',
            stateCheck: (s) => s.formFields.some((f) => f.type === 'member'),
          },
          hint: '在左侧字段库里找到「成员」，把它拖进中间画布区域。',
          helpAction: 'add-member-field',
          navigateTo: 'form',
        },
        {
          id: 'ch1-s4',
          type: 'gated',
          narration: '第 2 步：把「**日期区间**」字段拖入画布。\n\n用来填写**请假起止日期**，系统会自动计算请假天数。',
          target: 'field-daterange',
          completeWhen: {
            event: 'state',
            stateCheck: (s) => s.formFields.some((f) => f.type === 'daterange'),
          },
          hint: '找到「日期区间」字段，拖入画布。',
          helpAction: 'add-daterange-field',
          navigateTo: 'form',
        },
        {
          id: 'ch1-s5',
          type: 'gated',
          narration: '第 3 步：把「**下拉单选**」字段拖入画布。\n\n用来选择**请假类型**（事假/病假/年假），我们稍后会配置选项。',
          target: 'field-select',
          completeWhen: {
            event: 'state',
            stateCheck: (s) => s.formFields.some((f) => f.type === 'select'),
          },
          hint: '找到「下拉单选」字段，拖入画布。',
          helpAction: 'add-select-field',
          navigateTo: 'form',
        },
        {
          id: 'ch1-s6',
          type: 'gated',
          narration: '第 4 步：把「**多行文本**」字段拖入画布。\n\n用来填写**请假事由**，让审批人了解请假原因。',
          target: 'field-textarea',
          completeWhen: {
            event: 'state',
            stateCheck: (s) => s.formFields.some((f) => f.type === 'textarea'),
          },
          hint: '找到「多行文本」字段，拖入画布。',
          helpAction: 'add-textarea-field',
          navigateTo: 'form',
        },
        {
          id: 'ch1-cfg1',
          type: 'gated',
          narration:
            '表单基础字段搭完了！现在来**配置选项**。\n\n点击画布里的「**请假类型**」字段选中它，然后在右侧属性面板的选项区点「**+ 添加选项**」，输入「**调休假**」并确认。',
          target: 'field-select-on-canvas',
          completeWhen: {
            event: 'state',
            stateCheck: (s) =>
              s.formFields.some(
                (f) => f.type === 'select' && f.options?.some((o) => o.label === '调休假')
              ),
          },
          hint: '先点击画布中的「请假类型」字段选中它，再在右侧面板找到选项区，点「+ 添加选项」输入调休假。',
          helpAction: 'add-option-调休假',
          navigateTo: 'form',
        },
        {
          id: 'ch1-cfg2',
          type: 'gated',
          narration: '点击画布里的「**请假起止**」字段，在右侧属性面板打开「**必填**」开关——以后不填就提交不了。',
          target: 'field-daterange-on-canvas',
          completeWhen: {
            event: 'state',
            stateCheck: (s) => s.formFields.some((f) => f.type === 'daterange' && f.required),
          },
          hint: '点击画布里的「请假起止」字段，然后在右侧配置面板勾选「必填」复选框。',
          helpAction: 'set-daterange-required',
          navigateTo: 'form',
        },
        {
          id: 'ch1-cfg3',
          type: 'gated',
          narration:
            '再从左侧拖一个「**附件**」字段进来，在右侧属性面板把它的标题改为「**病历附件**」。',
          target: 'field-attachment',
          completeWhen: {
            event: 'state',
            stateCheck: (s) =>
              s.formFields.some((f) => f.type === 'attachment' && f.label === '病历附件'),
          },
          hint: '从左侧「高级字段」组拖入「附件」字段，然后在右侧属性面板把「字段标题」改为「病历附件」。',
          helpAction: 'add-attachment-rename',
          navigateTo: 'form',
        },
        {
          id: 'ch1-cfg4',
          type: 'gated',
          narration:
            '现在做个**字段联动**：让「病历附件」只在请病假时才出现。\n\n点击「病历附件」字段使其被选中，在右侧面板找到「**显隐规则**」区域，设置「当 请假类型 = 病假 时，显示」，然后点「保存规则」。',
          target: 'open-visibility-rule',
          completeWhen: {
            event: 'state',
            stateCheck: (s) =>
              s.visibilityRules.some(
                (r) => r.action === 'show' && r.conditions.some((c) => c.operator === 'eq')
              ),
          },
          hint: '先点击「病历附件」字段，在右侧配置面板中展开「显隐规则」，填写条件后保存。',
          helpAction: 'add-visibility-rule',
          navigateTo: 'form',
        },
        {
          id: 'ch1-cfg5',
          type: 'reveal',
          narration:
            '搞定！这就是「**字段联动**」——表单会根据填写内容自动变化。\n\n第 3 章用一遍时，你选「病假」就能看到病历附件自动冒出来。',
          next: '继续 →',
          navigateTo: 'form',
        },
        {
          id: 'ch1-s7',
          type: 'reveal',
          title: '🎉 表单搭好了！',
          narration:
            '你刚刚搭出了一张完整的**请假申请表**——\n\n✅ 申请人（成员字段）\n✅ 请假起止（日期区间，已设必填）\n✅ 请假类型（含调休假等选项）\n✅ 请假事由（多行文本）\n✅ 病历附件（病假时才显示）\n\n在低代码里，拖拽 + 简单配置，就完成了传统开发需要写几十行代码的工作。',
          next: '进入第 2 章：配流程 →',
          navigateTo: 'form',
        },
      ],
    },
    {
      id: 'ch2',
      title: '配流程',
      subtitle: '让它自动流转',
      steps: [
        {
          id: 'ch2-s1',
          type: 'info-card',
          title: '第 2 章：配流程',
          narration:
            '表单只是数据的**入口**，还需要设置审批流程，让提交的申请**自动流转**到对的人手上。\n\n接下来，你要给请假系统配一个简单的审批流程：\n\n提交 → 直属主管审批 → 完成',
          next: '来配审批吧',
          navigateTo: 'flow',
        },
        {
          id: 'ch2-s2',
          type: 'spotlight',
          narration:
            '这是**流程设计器**。\n\n每个应用默认有"发起人"和"结束"两个节点，中间空着，等你来填。\n\n点击节点之间的「**+**」按钮，就能插入新节点。',
          target: 'flow-designer-area',
          next: '明白了，开始配',
          navigateTo: 'flow',
        },
        {
          id: 'ch2-s3',
          type: 'gated',
          narration:
            '点击流程图中「发起人」和「结束」之间的「**+**」按钮，添加一个**审批节点**。',
          target: 'flow-add-btn',
          completeWhen: {
            event: 'state',
            stateCheck: (s) => s.flowNodes.some((n) => n.type === 'approval'),
          },
          hint: '点击流程图中间的「+」蓝色按钮，选择「审批节点」。',
          helpAction: 'add-approval-node',
          navigateTo: 'flow',
        },
        {
          id: 'ch2-s4',
          type: 'gated',
          narration:
            '点击刚添加的**审批节点**，为它配置审批人。\n\n选择「**直属主管**」作为审批人。',
          target: 'flow-approval-node',
          completeWhen: {
            event: 'state',
            stateCheck: (s) =>
              s.flowNodes.some(
                (n) => n.type === 'approval' && (n.approvers?.length ?? 0) > 0
              ),
          },
          hint: '点击审批节点打开配置面板，在审批人列表中选择「直属主管」。',
          helpAction: 'set-approval-manager',
          navigateTo: 'flow',
        },
        {
          id: 'ch2-s5',
          type: 'branch',
          title: '想加一个条件分支吗？',
          narration:
            '在实际场景中，**请假超过 3 天**往往需要多一级总监审批。\n\n要演示这个功能吗？',
          branches: [
            { id: 'yes', label: '加上条件分支', description: '演示请假天数条件路由' },
            { id: 'no', label: '跳过，继续', description: '直接看结果' },
          ],
          navigateTo: 'flow',
        },
        {
          id: 'ch2-s6',
          type: 'reveal',
          title: '✨ 流程配好了！',
          narration:
            '现在，每当有人提交请假申请，系统会**自动通知直属主管**来审批。\n\n这就是低代码最核心的价值之一——用可视化操作，把纸面审批流程变成**自动运转的系统**，再也不用发邮件、打电话找人审批了。',
          next: '进入第 3 章：用一遍 →',
          navigateTo: 'flow',
        },
      ],
    },
    {
      id: 'ch3',
      title: '用一遍',
      subtitle: '使用端闭环',
      steps: [
        {
          id: 'ch3-s1',
          type: 'info-card',
          title: '第 3 章：发布并使用',
          narration:
            '搭好的系统需要**发布**，才能让大家真正使用。\n\n接下来你要做三件事：\n\n① 发布应用\n② 以「员工」身份提交一条请假申请\n③ 切换到「主管」身份审批它\n\n这一章是最重要的——你将亲眼看到自己搭的系统跑起来！',
          next: '出发！',
          navigateTo: 'form',
        },
        {
          id: 'ch3-s2',
          type: 'gated',
          narration:
            '点击右上角的「**发布**」按钮，将应用正式发布上线。',
          target: 'publish-button',
          completeWhen: {
            event: 'state',
            stateCheck: (s) => s.isPublished,
          },
          hint: '找到顶部导航栏中的蓝色「发布」按钮并点击。',
          helpAction: 'publish-app',
          navigateTo: 'form',
        },
        {
          id: 'ch3-s3',
          type: 'spotlight',
          narration:
            '🎊 **应用上线啦！**\n\n现在切换到「**使用端**」，以员工身份体验一下自己搭的系统。',
          target: 'tab-usage',
          next: '切换到使用端',
          navigateTo: 'usage',
        },
        {
          id: 'ch3-s4',
          type: 'gated',
          narration:
            '填写这张请假申请表，然后点击**提交**。\n\n（感受一下作为员工用自己搭的系统是什么感觉）',
          target: 'usage-submit-btn',
          completeWhen: {
            event: 'state',
            stateCheck: (s) => s.submissions.length > 0,
          },
          hint: '填写表单中的各个字段，最后点击「提交申请」按钮。',
          helpAction: 'submit-form',
          navigateTo: 'usage',
        },
        {
          id: 'ch3-s5',
          type: 'gated',
          narration:
            '点击「**切换到主管**」按钮，然后处理这条待审批的请假。\n\n（感受一下作为审批人是什么体验）',
          target: 'switch-role-btn',
          completeWhen: {
            event: 'state',
            stateCheck: (s) =>
              s.submissions.length > 0 &&
              s.submissions[s.submissions.length - 1]?.status === 'approved',
          },
          hint: '点击「切换到主管」，然后在待处理列表中点击「通过」。',
          helpAction: 'approve-submission',
          navigateTo: 'usage',
        },
        {
          id: 'ch3-s6',
          type: 'reveal',
          title: '🎊 一条完整流程跑通了！',
          narration:
            '从**填表 → 提交 → 审批 → 完成**，这整条路就是低代码帮你自动化的那条路。\n\n你看到了：\n✅ 员工提交申请（数据进入系统）\n✅ 系统通知主管（自动流转）\n✅ 主管审批通过（状态更新）\n\n现在去看看数据是怎么沉淀的！',
          next: '进入第 4 章：看数据 →',
          navigateTo: 'data',
        },
      ],
    },
    {
      id: 'ch4',
      title: '看数据',
      subtitle: '报表 + 仪表盘',
      steps: [
        {
          id: 'ch4-s1',
          type: 'info-card',
          title: '第 4 章：数据可视化',
          narration:
            '系统运转起来后，数据会不断积累。\n\n**报表**和**仪表盘**能让你一眼看清数据趋势，帮助做出更好的决策。\n\n接下来，你要：\n\n① 建一张按请假类型统计的饼图报表\n② 把它放进仪表盘',
          next: '来建个报表',
          navigateTo: 'reports',
        },
        {
          id: 'ch4-s2',
          type: 'gated',
          narration:
            '选择「**饼图**」类型，统计维度选「请假类型」，然后点击「**生成报表**」按钮。',
          target: 'report-generate-btn',
          completeWhen: {
            event: 'state',
            stateCheck: (s) => s.reports.length > 0,
          },
          hint: '点击「饼图」类型选项，确认维度为「请假类型」，然后点击「生成报表」。',
          helpAction: 'create-report',
          navigateTo: 'reports',
        },
        {
          id: 'ch4-s3',
          type: 'gated',
          narration:
            '把报表卡片**拖入右侧仪表盘**区域，完成你的"管理驾驶舱"。',
          target: 'report-card-draggable',
          completeWhen: {
            event: 'state',
            stateCheck: (s) => s.dashboard.length > 0,
          },
          hint: '拖拽报表卡片，放入右侧的仪表盘放置区域。',
          helpAction: 'add-to-dashboard',
          navigateTo: 'reports',
        },
        {
          id: 'ch4-s4',
          type: 'reveal',
          title: '🏆 恭喜完成！',
          narration:
            '你刚刚用低代码，从零搭出了一个**完整的请假管理系统**：\n\n✅ 一张可配置的请假申请表\n✅ 自动流转的审批流程\n✅ 实时数据记录与查询\n✅ 可视化数据报表\n✅ 管理驾驶舱仪表盘\n\n这就是低代码的魔法——平时需要开发团队花**数周**完成的事，你一个人用**几十分钟**就做到了。\n\n**自由模式已解锁！**你现在可以随意探索这个系统的各个功能了。',
          isComplete: true,
          next: '解锁自由模式 🎮',
          navigateTo: 'dashboard',
        },
      ],
    },
  ],
};
