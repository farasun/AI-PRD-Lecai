import os

OUTPUT_DIR = "/Users/sunfala/Documents/AntiGravity/AI-PRD-Lecai/drafts/v1.4/flow"

def gen_html(title, date, nodes, edges, filename):
    html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
  <style>
    .no-scrollbar::-webkit-scrollbar {{ display: none; }}
    .no-scrollbar {{ -ms-overflow-style: none; scrollbar-width: none; }}
    .bg-dot-grid {{
      background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
      background-size: 20px 20px;
    }}
  </style>
</head>
<body class="m-0 p-0 bg-gray-200 no-scrollbar">
  <div style="position:fixed;top:24px;left:24px;z-index:50;background:rgba(17,24,39,0.85);backdrop-filter:blur(8px);border-radius:12px;padding:12px 20px;">
    <div style="font-size:16px;font-weight:700;color:#fff;">{title}</div>
    <div style="font-size:12px;color:#9ca3af;margin-top:4px;">v1.4 · Low-Fi Flow Map · {date}</div>
  </div>
  <div class="relative bg-dot-grid w-[3500px] h-[2500px] no-scrollbar font-sans text-gray-900">
    <svg class="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <marker id="arrow-gray" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#94a3b8" />
        </marker>
      </defs>'''
    for edge in edges:
        s_node = nodes[edge['start']]
        e_node = nodes[edge['end']]
        
        # Calculate centers/anchors based on type
        def get_anchor(node, side):
            ntype = node.get('type', 'mobile')
            if ntype == 'logic':
                w, h = 240, 120
            elif ntype == 'admin':
                w, h = 600 * 0.65, 400 * 0.65
            else:
                w, h = 375 * 0.65, 812 * 0.65
            
            if side == 'right': return node['x'] + w, node['y'] + h/2
            if side == 'left': return node['x'], node['y'] + h/2
            if side == 'top': return node['x'] + w/2, node['y']
            if side == 'bottom': return node['x'] + w/2, node['y'] + h
            return node['x'] + w/2, node['y'] + h/2

        if edge.get('path_type') == 'loop_top':
            start_x, start_y = get_anchor(s_node, 'top')
            end_x, end_y = get_anchor(e_node, 'top')
            path_d = f"M {start_x} {start_y} C {start_x} {start_y-150}, {end_x} {end_y-150}, {end_x} {end_y}"
            label_x = (start_x + end_x) / 2
            label_y = min(start_y, end_y) - 80
        elif edge.get('path_type') == 'vertical':
            start_x, start_y = get_anchor(s_node, 'bottom')
            end_x, end_y = get_anchor(e_node, 'top')
            path_d = f"M {start_x} {start_y} C {start_x} {start_y+50}, {end_x} {end_y-50}, {end_x} {end_y}"
            label_x = (start_x + end_x) / 2
            label_y = (start_y + end_y) / 2
        else:
            start_x, start_y = get_anchor(s_node, 'right')
            end_x, end_y = get_anchor(e_node, 'left')
            path_d = f"M {start_x} {start_y} C {start_x+100} {start_y}, {end_x-100} {end_y}, {end_x} {end_y}"
            label_x = (start_x + end_x) / 2
            label_y = (start_y + end_y) / 2
            
        label = edge['label']
        html += f'''
      <path d="{path_d}" stroke="#94a3b8" stroke-width="2" fill="none" marker-end="url(#arrow-gray)" />
      <rect x="{label_x - len(label)*7 - 10}" y="{label_y - 15}" width="{len(label)*14 + 20}" height="30" fill="#f8fafc" rx="4" />
      <text x="{label_x}" y="{label_y + 5}" fill="#64748b" font-size="14" font-weight="500" text-anchor="middle">{label}</text>'''

    html += '''
    </svg>'''

    for node_id, node in nodes.items():
        v14_tag = ""
        if node.get('is_new'):
            v14_tag = '<span class="ml-2 px-1.5 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded uppercase">v1.4 新增</span>'
        elif node.get('is_modified'):
            v14_tag = '<span class="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-600 text-[10px] font-bold rounded uppercase">v1.4 改造</span>'

        node_type = node.get('type', 'mobile') # Default to mobile
        content = node.get('html')
        
        if not content:
            # Default placeholder logic for all types
            content = f'''
        <div class="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
            <i class="ri-instance-line text-4xl mb-2"></i>
            <span class="px-6 text-center font-bold">{node['label']}</span>
            <div class="mt-4 w-1/2 h-2 bg-gray-200 rounded-full"></div>
            <div class="mt-2 w-1/3 h-2 bg-gray-200 rounded-full"></div>
        </div>'''

        if node_type == 'logic':
            # Flat rectangle, no mockup
            shell_class = "w-[240px] h-[120px] bg-gray-100 border-2 border-gray-300 rounded-xl shadow-md overflow-hidden flex items-center justify-center p-4"
            node_body = content
            # Adjust offset for connections if needed, but the gen_html assumes fixed scale
        elif node_type == 'admin':
            # Wide rectangle
            shell_class = "w-[600px] h-[400px] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden transform scale-[0.65] origin-top-left flex flex-col"
            node_body = content
        else:
            # Standard mobile
            shell_class = "w-[375px] h-[812px] bg-white border border-gray-200 rounded-[40px] shadow-2xl overflow-hidden transform scale-[0.65] origin-top-left"
            node_body = content

        html += f'''
    <div class="absolute" style="left: {node['x']}px; top: {node['y']}px;">
      <div id="{node['id']}" class="absolute -top-10 left-0 bg-gray-900 text-white text-sm px-3 py-1 rounded shadow-sm z-10 flex items-center whitespace-nowrap">
        {node['label']}
        {v14_tag}
      </div>
      <div class="{shell_class}">
        {node_body}
      </div>
    </div>'''

    html += '''
  </div>
</body>
</html>'''

    with open(os.path.join(OUTPUT_DIR, filename), "w", encoding="utf-8") as f:
        f.write(html)

from ui_data import UI_ASSETS

# 1. Registration Flow
nodes1 = {
    'A': {'id': 'CH-1', 'label': 'CH-1 · 赛事详情页-整体', 'x': 100, 'y': 300, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('CH-1')},
    'B': {'id': 'CH-1-5', 'label': 'CH-1-5 · 赛事-社团报名', 'x': 500, 'y': 300, 'is_new': True, 'type': 'mobile', 'html': UI_ASSETS.get('CH-1-5_SKEL')},
    'C': {'id': 'CC-24', 'label': 'CC-24 · 赛事报名审核', 'x': 900, 'y': 300, 'is_new': True, 'type': 'admin', 'html': UI_ASSETS.get('CC-24')},
    'D': {'id': 'MsgRefuse', 'label': '站内信通知(驳回)', 'x': 1300, 'y': 50, 'type': 'logic'},
    'F': {'id': 'MsgPass', 'label': '站内信通知(通过)', 'x': 1300, 'y': 400, 'type': 'logic'},
    'H': {'id': 'AutoCreate', 'label': '系统自动创建配套活动', 'x': 1300, 'y': 750, 'type': 'logic'},
    'E': {'id': 'CC-10-3', 'label': 'CC-10-3 · 赛事记录中心', 'x': 1700, 'y': 300, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('CC-10-3')},
    'G': {'id': 'AD-B1', 'label': 'AD-B1 · 邀请参赛落地弹窗', 'x': 2100, 'y': 300, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('AD-B1')},
    'I': {'id': 'CC-10', 'label': 'CC-10 · 我的社团管理', 'x': 1700, 'y': -250, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('CC-10')}
}
edges1 = [
    {'start': 'A', 'end': 'B', 'label': '团长点击“立即报名”'},
    {'start': 'B', 'end': 'C', 'label': '提交报名表单'},
    {'start': 'C', 'end': 'D', 'label': 'S端管理员拒绝'},
    {'start': 'C', 'end': 'F', 'label': 'S端管理员通过'},
    {'start': 'C', 'end': 'H', 'label': '审核通过后台触发'},
    {'start': 'D', 'end': 'E', 'label': '团长查看驳回原因'},
    {'start': 'F', 'end': 'E', 'label': '团长收到喜报'},
    {'start': 'E', 'end': 'G', 'label': '分享参赛邀请函'},
    {'start': 'I', 'end': 'E', 'label': '官方赛事磁贴', 'path_type': 'vertical'},
    {'start': 'E', 'end': 'B', 'label': '修正后重新发起', 'path_type': 'loop_top'}
]
gen_html('官方荣耀赛 · 报名审核流程', '2026-04-27', nodes1, edges1, 'registration-flow-v2.html')

# 2. Highlights Flow
nodes2 = {
    'A': {'id': 'Trigger', 'label': 'S端赛事报名审核通过', 'x': 100, 'y': 300, 'type': 'logic'},
    'B': {'id': 'AutoCreate', 'label': '系统自动创建配套活动', 'x': 500, 'y': 300, 'type': 'logic'},
    'C': {'id': 'MsgNotify', 'label': '站内信通知', 'x': 900, 'y': 50, 'type': 'logic'},
    'D': {'id': 'CC-12', 'label': 'CC-12 · 社团活动管理', 'x': 900, 'y': 400, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('CC-12')},
    'E': {'id': 'CC-5', 'label': 'CC-5 · 社团活动详情', 'x': 1300, 'y': 400, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('CC-5')},
    'F': {'id': 'MemberUpload', 'label': '成员进入社团活动', 'x': 900, 'y': 750, 'type': 'logic'},
    'G': {'id': 'CH-5', 'label': 'CH-5 · 赛事-花絮列表', 'x': 1700, 'y': 400, 'is_new': True, 'type': 'mobile', 'html': UI_ASSETS.get('CH-5_SKEL')},
    'H': {'id': 'CH-5-1', 'label': 'CH-5-1 · 赛事-花絮详情', 'x': 2100, 'y': 400, 'is_new': True, 'type': 'mobile', 'html': UI_ASSETS.get('CH-5-1_SKEL')},
    'I': {'id': 'AD-B3', 'label': 'AD-B3 · 花絮分享弹窗', 'x': 2500, 'y': 400, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('AD-B3')},
    'J': {'id': 'EndEvent', 'label': '赛事截止/收官', 'x': 900, 'y': 1100, 'type': 'logic'},
    'K': {'id': 'Archive', 'label': '归档只读页', 'x': 1700, 'y': 750, 'type': 'mobile'}
}
edges2 = [
    {'start': 'A', 'end': 'B', 'label': '系统自动触发'},
    {'start': 'B', 'end': 'C', 'label': '异步通知'},
    {'start': 'B', 'end': 'D', 'label': '业务绑定'},
    {'start': 'D', 'end': 'E', 'label': '展示参赛标识'},
    {'start': 'F', 'end': 'E', 'label': '上传花絮内容'},
    {'start': 'E', 'end': 'G', 'label': '自动汇总作品'},
    {'start': 'G', 'end': 'H', 'label': '点击瀑布流卡片'},
    {'start': 'H', 'end': 'I', 'label': '触发分享落地广告'},
    {'start': 'J', 'end': 'E', 'label': '锁定'},
    {'start': 'E', 'end': 'K', 'label': '自动切换状态'}
]
gen_html('官方荣耀赛 · 花絮生命周期流', '2026-04-27', nodes2, edges2, 'highlights-flow-v2.html')

# 3. Participation Flow
nodes3 = {
    'A': {'id': 'CH-1', 'label': 'CH-1 · 赛事详情页-整体', 'x': 100, 'y': 400, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('CH-1')},
    'B': {'id': 'CH-1-3', 'label': 'CH-1-3 · 赛事-作品列表', 'x': 500, 'y': 400, 'type': 'mobile', 'html': UI_ASSETS.get('CH-1-3')},
    'C1': {'id': 'CheckLeader', 'label': '校验团长权限', 'x': 900, 'y': 100, 'type': 'logic'},
    'D1': {'id': 'CH-3', 'label': 'CH-3 · 赛事提交作品表单', 'x': 1300, 'y': 100, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('CH-3')},
    'E1': {'id': 'AuditLogic', 'label': 'S端作品审核逻辑', 'x': 1700, 'y': 100, 'type': 'logic'},
    'C2': {'id': 'JumpActivity', 'label': '跳转至社团专属活动', 'x': 900, 'y': 500, 'type': 'logic'},
    'D2': {'id': 'CC-5', 'label': 'CC-5 · 社团活动详情', 'x': 1300, 'y': 500, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('CC-5')},
    'E2': {'id': 'NoScore', 'label': '不计入成绩', 'x': 1700, 'y': 500, 'type': 'logic'},
    'F': {'id': 'CH-2', 'label': 'CH-2 · 赛事作品详情-图片', 'x': 900, 'y': 850, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('CH-2')},
    'G': {'id': 'AD-B2', 'label': 'AD-B2 · 拉票分享弹窗', 'x': 1300, 'y': 850, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('AD-B2')},
    'H': {'id': 'ExternalUser', 'label': '外部用户进入落地页', 'x': 1700, 'y': 850, 'type': 'logic'}
}
edges3 = [
    {'start': 'A', 'end': 'B', 'label': '进入作品区'},
    {'start': 'B', 'end': 'C1', 'label': '团长点击“上传参赛作品”'},
    {'start': 'C1', 'end': 'D1', 'label': '通过'},
    {'start': 'D1', 'end': 'E1', 'label': '提交正式参赛作品'},
    {'start': 'E1', 'end': 'B', 'label': '计入成绩并展示', 'path_type': 'loop_top'},
    {'start': 'B', 'end': 'C2', 'label': '团员点击“上传花絮”'},
    {'start': 'C2', 'end': 'D2', 'label': '跳转'},
    {'start': 'D2', 'end': 'E2', 'label': '提交排练花絮'},
    {'start': 'B', 'end': 'F', 'label': '点击单个作品'},
    {'start': 'F', 'end': 'G', 'label': '点击“点赞拉票”'},
    {'start': 'G', 'end': 'H', 'label': '分享至微信朋友圈/群'}
]
gen_html('官方荣耀赛 · 参赛与拉票流', '2026-04-27', nodes3, edges3, 'participation-flow-v2.html')

# 4. Navigation Flow
nodes4 = {
    'CH1-2': {'id': 'CH-1-2', 'label': 'CH-1-2 · 赛事-团队热度排行', 'x': 100, 'y': 150, 'is_modified': True, 'type': 'mobile'},
    'CH1-3': {'id': 'CH-1-3', 'label': 'CH-1-3 · 赛事-作品列表', 'x': 100, 'y': 550, 'is_modified': True, 'type': 'mobile'},
    'CH2': {'id': 'CH-2', 'label': 'CH-2 · 赛事作品详情-图片', 'x': 100, 'y': 950, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('CH-2')},
    'CC4': {'id': 'CC-4', 'label': 'CC-4 · 社团主页', 'x': 700, 'y': 550, 'type': 'mobile', 'html': UI_ASSETS.get('CC-4')},
    'CC5': {'id': 'CC-5', 'label': 'CC-5 · 社团活动详情(专属)', 'x': 1400, 'y': 550, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('CC-5')},
    'CH1': {'id': 'CH-1', 'label': 'CH-1 · 赛事详情页-整体', 'x': 2000, 'y': 250, 'is_modified': True, 'type': 'mobile', 'html': UI_ASSETS.get('CH-1')},
    'CH1-3F': {'id': 'CH-1-3F', 'label': 'CH-1-3 · 作品列表(本社团)', 'x': 2000, 'y': 850, 'type': 'mobile'}
}
edges4 = [
    {'start': 'CH1-2', 'end': 'CC4', 'label': '社团名点击'},
    {'start': 'CH1-3', 'end': 'CC4', 'label': '社团标识点击'},
    {'start': 'CH2', 'end': 'CC4', 'label': '社团标识点击'},
    {'start': 'CC5', 'end': 'CH1', 'label': '顶部入口①'},
    {'start': 'CC5', 'end': 'CH1-3F', 'label': '顶部入口②'}
]
gen_html('官方荣耀赛 · 双向跳转关系 (Fc-09/10)', '2026-04-27', nodes4, edges4, 'navigation-flow-v2.html')

print("All Low-Fi Flow Maps generated successfully!")
