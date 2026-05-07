# UI HTML Assets for v1.4 Flow Map

CH_1_HTML = '''
<div class="flex flex-col h-full">
    <div class="h-14 bg-gradient-to-r from-purple-700 to-purple-500 flex items-center px-6 justify-between text-white shrink-0">
      <i class="ri-arrow-left-s-line text-2xl"></i>
      <span class="font-bold text-lg">赛事详情</span>
      <div class="w-16 h-7 bg-black/20 rounded-full flex items-center justify-center space-x-2">
        <i class="ri-more-fill text-xs"></i><span class="opacity-20 text-xs">|</span><i class="ri-close-line text-xs"></i>
      </div>
    </div>
    <div class="flex-1 bg-white overflow-y-auto no-scrollbar">
       <div class="h-44 bg-purple-800 relative flex flex-col items-center justify-center p-6 text-white text-center">
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20"></div>
          <div class="text-[10px] opacity-60 uppercase tracking-widest font-black mb-1">2026 Shanghai Championship</div>
          <h2 class="text-lg font-black leading-tight mb-2">2026上海马年新春摄影大赛</h2>
          <div class="px-6 py-1.5 bg-purple-400 rounded-lg shadow-lg text-sm font-black text-white">最高5000元奖励</div>
       </div>
       <div class="p-6 space-y-4">
          <div class="flex items-center space-x-2">
             <span class="px-2 py-0.5 border border-purple-200 text-purple-600 text-[10px] font-bold rounded bg-purple-50">作品239</span>
             <span class="px-2 py-0.5 border border-purple-200 text-purple-600 text-[10px] font-bold rounded bg-purple-50">获赞2271</span>
          </div>
          <div class="p-4 bg-purple-600 text-white rounded-2xl flex items-center justify-between shadow-xl">
             <div>
                <div class="text-[10px] font-bold opacity-60">NEW ITERATION</div>
                <div class="font-black">立即报名参赛</div>
             </div>
             <i class="ri-arrow-right-circle-fill text-2xl"></i>
          </div>
          <div class="pt-2 border-b flex justify-around text-sm font-black border-gray-100 text-gray-400">
             <span class="pb-2">排行</span>
             <span class="pb-2 text-purple-600 border-b-2 border-purple-600">作品</span>
          </div>
          <div class="py-4 space-y-4">
             <div class="h-10 bg-gray-50 rounded-lg flex items-center px-4 space-x-3">
               <i class="ri-search-line text-gray-400"></i>
               <span class="text-xs text-gray-300">按作品名、作者名搜索</span>
             </div>
          </div>
       </div>
    </div>
</div>
'''

CH_1_5_HTML = '''
<div class="flex flex-col h-full bg-white">
    <div class="h-16 bg-gray-50 border-b flex items-center px-10 font-bold text-xl shrink-0">
      <i class="ri-close-line mr-4 text-gray-400"></i> 报名参赛
    </div>
    <div class="flex-1 p-10 space-y-10 overflow-y-auto no-scrollbar">
       <div class="space-y-3">
          <label class="block text-sm font-bold text-gray-400 uppercase tracking-widest">代表社团</label>
          <div class="p-5 bg-gray-100 border-2 border-dashed rounded-2xl text-gray-400 font-bold">舞之魂舞蹈社 (锁定)</div>
       </div>
       <div class="space-y-4">
          <label class="block text-sm font-bold text-gray-400 uppercase tracking-widest">领队寄语 (3选1)</label>
          <div class="p-5 border-2 border-purple-600 rounded-2xl bg-purple-50 flex items-center justify-between text-purple-700 font-bold text-lg">
             我们要冲击冠军！ <i class="ri-checkbox-circle-fill"></i>
          </div>
       </div>
       <div class="space-y-3">
          <label class="block text-sm font-bold text-gray-400 uppercase tracking-widest">联系电话</label>
          <input type="text" value="139****1234" class="w-full p-5 bg-white border-2 rounded-2xl font-bold focus:border-purple-500 outline-none" />
       </div>
    </div>
    <div class="p-10 shrink-0">
      <button class="w-full py-5 bg-purple-600 text-white font-bold rounded-2xl text-xl shadow-xl shadow-purple-100">提交审核申请</button>
    </div>
</div>
'''

CC_24_HTML = '''
<div class="flex flex-col h-full bg-slate-50 font-sans">
     <div class="h-12 bg-slate-900 text-white flex items-center px-6 justify-between shrink-0">
       <div class="flex items-center space-x-2">
         <div class="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
         <div class="w-2.5 h-2.5 bg-amber-500 rounded-full"></div>
         <div class="w-2.5 h-2.5 bg-emerald-500 rounded-full"></div>
         <span class="ml-4 opacity-50 tracking-widest uppercase text-[10px]">Admin Console</span>
       </div>
     </div>
     <div class="flex-1 flex overflow-hidden">
       <div class="w-32 bg-slate-200 p-4 space-y-2 shrink-0">
          <div class="p-2 bg-white rounded shadow-sm font-bold border-l-4 border-purple-500 text-[10px]">报名审核</div>
          <div class="p-2 opacity-30 text-[10px]">证书配置</div>
       </div>
       <div class="flex-1 bg-white p-6 overflow-y-auto no-scrollbar">
          <h1 class="text-xl font-black mb-6 tracking-tighter">赛事报名管理</h1>
          <div class="p-4 bg-purple-50 rounded-xl mb-6 border border-purple-100">
             <div class="text-[10px] font-bold text-purple-600 mb-2 uppercase">Pending Audit</div>
             <div class="flex justify-between items-center">
                <span class="font-bold text-sm text-purple-900">舞之魂舞蹈社</span>
                <span class="px-2 py-0.5 bg-purple-200 text-purple-700 rounded text-[10px] font-black">待处理</span>
             </div>
          </div>
          <div class="space-y-4">
             <div class="text-[10px] font-bold text-gray-400 uppercase">审核操作</div>
             <textarea class="w-full p-3 bg-gray-50 border rounded-lg text-xs" placeholder="若驳回，请输入原因..."></textarea>
             <div class="flex gap-2">
                <button class="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-400">驳回申请</button>
                <button class="flex-1 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold">通过并准入</button>
             </div>
          </div>
       </div>
     </div>
</div>
'''

CC_10_3_HTML = '''
<div class="flex flex-col h-full bg-white">
    <div class="h-20 bg-white border-b flex items-center px-10 font-bold text-xl shrink-0">
       我的赛事
    </div>
    <div class="flex-1 bg-gray-100 p-8 space-y-8 overflow-y-auto no-scrollbar">
       <div class="bg-white rounded-3xl p-8 border-2 border-purple-500 shadow-xl relative overflow-hidden">
          <div class="absolute -top-4 -right-4 w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center opacity-30"><i class="ri-award-fill text-4xl text-purple-500"></i></div>
          <h3 class="font-black text-2xl mb-2 tracking-tighter">第1届官方赛事</h3>
          <p class="text-[10px] font-bold text-purple-600 uppercase mb-8 tracking-widest flex items-center">
             <span class="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 animate-pulse"></span> Status: Approved / 已准入
          </p>
          <div class="space-y-3">
             <button class="w-full py-4 bg-purple-50 text-purple-600 rounded-2xl font-black text-xs border border-purple-100">查看/分享邀请函</button>
             <button class="w-full py-4 bg-purple-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-purple-200">去稿件上传中心</button>
          </div>
       </div>
       <div class="p-6 bg-white rounded-2xl border border-gray-200 opacity-50">
          <div class="text-[10px] font-bold text-gray-400 uppercase mb-2">History Records</div>
          <div class="h-2 bg-gray-100 rounded-full w-3/4 mb-2"></div>
          <div class="h-2 bg-gray-100 rounded-full w-1/2"></div>
       </div>
    </div>
</div>
'''

AD_B1_HTML = '''
<div class="w-full h-full bg-black/70 flex items-center justify-center p-8">
    <div class="w-full bg-white rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
        <div class="p-4 bg-purple-700 text-white text-center text-[10px] font-black uppercase tracking-widest">
            公益赞助：泰康之家 · 粤园
        </div>
        <div class="p-10 space-y-8 text-center">
            <div class="relative w-24 h-24 mx-auto">
               <div class="w-full h-full bg-gray-100 rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                  <i class="ri-user-star-fill text-purple-300 text-4xl"></i>
               </div>
               <div class="absolute -bottom-1 -right-1 bg-purple-600 text-white rounded-full p-2 shadow-lg"><i class="ri-flag-fill text-xs"></i></div>
            </div>
            <div class="space-y-2">
               <div class="text-xl font-black text-gray-900">张大爷</div>
               <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
                  “快来参加！咱们社团需要你的一份力量，为荣誉而战！”
               </p>
            </div>
            <button class="w-full py-5 bg-purple-600 text-white font-black rounded-3xl text-lg shadow-2xl shadow-purple-100 uppercase tracking-tighter italic">接受并进入赛事</button>
        </div>
        <div class="p-4 text-center bg-gray-50">
           <span class="text-gray-300 text-[8px] font-black tracking-widest uppercase">Join the Championship</span>
        </div>
    </div>
</div>
'''

CC_10_HTML = '''
<div class="flex flex-col h-full bg-white">
     <div class="h-20 bg-white flex items-center px-10 justify-center relative border-b border-gray-50 shrink-0">
        <i class="ri-arrow-left-s-line text-2xl absolute left-10"></i>
        <span class="font-bold text-lg">我的社团管理</span>
     </div>
     <div class="flex-1 bg-gray-50/50 p-6 space-y-6 overflow-y-auto no-scrollbar">
        <div class="space-y-3">
           <h3 class="text-sm font-bold text-gray-400 px-4 flex justify-between uppercase tracking-widest">Basic</h3>
           <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div class="p-5 border-b flex justify-between items-center"><span class="font-medium">编辑社团信息</span> <i class="ri-arrow-right-s-line text-gray-300"></i></div>
              <div class="p-5 flex justify-between items-center"><span class="font-medium">社团设置</span> <i class="ri-arrow-right-s-line text-gray-300"></i></div>
           </div>
        </div>
        <div class="space-y-3">
           <h3 class="text-sm font-bold text-gray-400 px-4 uppercase tracking-widest">Management</h3>
           <div class="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <div class="p-5 border-b flex justify-between items-center bg-purple-50 cursor-pointer">
                <div class="flex items-center"><i class="ri-medal-fill text-purple-500 mr-3 text-xl"></i> <span class="font-black text-purple-900">官方赛事 [v1.4]</span></div>
                <i class="ri-arrow-right-s-line text-purple-300"></i>
              </div>
              <div class="p-5 border-b flex justify-between items-center opacity-40"><span class="font-medium">成员审核</span> <i class="ri-arrow-right-s-line text-gray-300"></i></div>
              <div class="p-5 flex justify-between items-center bg-purple-50">
                <span class="font-bold text-purple-900">社团活动 (含赛事花絮)</span> <i class="ri-arrow-right-s-line text-purple-300"></i>
              </div>
           </div>
        </div>
     </div>
</div>
'''

CC_12_HTML = '''
<div class="flex flex-col h-full bg-white">
    <div class="h-20 bg-white border-b flex items-center px-10 justify-center relative shrink-0">
       <i class="ri-arrow-left-s-line text-2xl absolute left-10 text-gray-800"></i>
       <span class="font-bold text-lg text-gray-800">设置活动</span>
    </div>
    <div class="flex-1 bg-gray-50/30 overflow-y-auto no-scrollbar p-6 space-y-6">
       <div class="p-4 bg-white border border-purple-100 rounded-2xl flex items-center shadow-md relative ring-4 ring-purple-600/10">
          <div class="absolute top-0 right-0 px-3 py-1 bg-purple-600 text-white text-[9px] font-black uppercase tracking-tighter rounded-bl-xl">Linked to Match</div>
          <div class="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-bold leading-none shrink-0">无封面</div>
          <div class="ml-4 flex-1 min-w-0">
             <div class="flex items-center mb-1">
                <h3 class="font-black text-sm text-gray-900 truncate">【官方赛事】排练花絮集</h3>
             </div>
             <p class="text-[9px] text-purple-400 font-bold">系统代建 · 自动同步至赛事</p>
          </div>
          <button class="px-3 py-2 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-bold whitespace-nowrap ml-2">管理内容</button>
       </div>
       <div class="p-4 bg-white border rounded-xl flex items-center shadow-sm opacity-30">
          <div class="w-12 h-12 bg-gray-100 rounded-lg shrink-0"></div>
          <div class="ml-4 flex-1 font-bold text-sm">其他普通活动</div>
       </div>
    </div>
    <div class="h-24 bg-white border-t p-6 shrink-0">
       <button class="w-full h-full bg-purple-600 text-white font-black rounded-full text-lg shadow-xl shadow-purple-100 tracking-tighter italic">新建活动</button>
    </div>
</div>
'''

CC_5_HTML = '''
<div class="flex flex-col h-full bg-white">
    <div class="h-48 bg-purple-800 relative p-6 flex flex-col text-white shrink-0">
       <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
       <div class="relative z-10 flex justify-between items-center mb-4">
          <i class="ri-arrow-left-s-line text-2xl"></i>
          <span class="font-bold text-lg">赛事花絮</span>
          <i class="ri-more-fill text-2xl"></i>
       </div>
       <div class="relative z-10 mt-auto">
          <h2 class="text-2xl font-black tracking-tighter">【官方赛事】排练花絮集</h2>
          <div class="mt-3 flex space-x-2">
             <span class="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-bold border border-white/10 uppercase tracking-widest">Linked Event</span>
          </div>
       </div>
    </div>
    <div class="flex-1 bg-white overflow-y-auto no-scrollbar">
        <div class="p-4 bg-purple-50 text-purple-800 text-[10px] border-b border-purple-100 font-bold italic">
            ★ 此活动由系统自动创建。您上传的花絮将自动出现在赛事官网上。
        </div>
        <div class="p-4 grid grid-cols-2 gap-3">
           <div class="bg-gray-100 rounded-xl aspect-square flex items-center justify-center border-4 border-dashed border-gray-200">
              <i class="ri-add-line text-4xl text-gray-300"></i>
           </div>
           <div class="bg-gray-50 rounded-xl aspect-square"></div>
        </div>
    </div>
    <div class="h-28 bg-white border-t p-6 shrink-0">
       <button class="w-full h-16 bg-purple-600 text-white font-black rounded-full text-xl shadow-xl shadow-purple-100">+ 上传作品</button>
    </div>
</div>
'''

CH_5_HTML = '''
<div class="flex flex-col h-full bg-gray-50">
    <div class="h-16 bg-white border-b flex items-center px-10 font-black text-xl tracking-tighter text-purple-900 shrink-0">
       精彩花絮瀑布流 [v1.4]
    </div>
    <div class="flex-1 p-4 grid grid-cols-2 gap-4 overflow-y-auto no-scrollbar">
        <div class="space-y-4">
            <div class="bg-white rounded-3xl shadow-md border border-purple-100 overflow-hidden">
                <div class="h-44 bg-purple-100 relative">
                   <div class="absolute inset-0 flex items-center justify-center text-purple-200 text-4xl font-black italic uppercase select-none">Video</div>
                </div>
                <div class="p-3">
                   <p class="text-[10px] font-black text-gray-800">舞之魂：赛前合影</p>
                   <div class="mt-2 flex items-center justify-between text-[8px] text-purple-400 font-bold">
                      <span>By 团长</span>
                      <span class="flex items-center"><i class="ri-heart-fill text-purple-400 mr-1"></i> 234</span>
                   </div>
                </div>
            </div>
        </div>
        <div class="space-y-4">
            <div class="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-64 bg-gray-50"></div>
        </div>
    </div>
</div>
'''

CH_5_1_HTML = '''
<div class="flex flex-col h-full bg-white">
    <div class="h-16 flex items-center justify-between px-6 border-b shrink-0 bg-white">
        <i class="ri-arrow-left-s-line text-2xl"></i>
        <span class="font-black text-lg uppercase tracking-tighter">Details</span>
        <i class="ri-more-fill text-2xl"></i>
    </div>
    <div class="flex-1 overflow-y-auto no-scrollbar">
       <div class="w-full aspect-square bg-purple-50 flex flex-col items-center justify-center relative border-b">
          <i class="ri-video-chat-fill text-5xl text-purple-200"></i>
          <div class="absolute bottom-6 flex space-x-2">
             <div class="w-2 h-2 rounded-full bg-purple-900"></div>
             <div class="w-2 h-2 rounded-full bg-purple-200"></div>
          </div>
       </div>
       <div class="p-8 space-y-6">
          <div class="flex items-center space-x-4">
             <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center border-2 border-white shadow-lg"><i class="ri-user-smile-fill text-purple-400 text-xl"></i></div>
             <div>
                <div class="font-black text-gray-900 tracking-tight">法拉孙 Fara</div>
                <div class="text-[10px] text-purple-400 font-bold uppercase">2026-04-10 18:30</div>
             </div>
          </div>
          <div class="p-4 bg-purple-50 border-2 border-dashed border-purple-200 rounded-2xl flex justify-between items-center">
             <div class="flex items-center space-x-3 text-purple-700">
                <i class="ri-bookmark-fill text-purple-400"></i>
                <span class="text-[10px] font-black uppercase">Linked to Match Event</span>
             </div>
             <i class="ri-arrow-right-s-line text-purple-300"></i>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed font-bold tracking-tight">今天排练非常成功，期待正式比赛！</p>
       </div>
    </div>
    <div class="h-28 bg-white border-t p-6 flex items-center space-x-4 shrink-0">
        <button class="flex-1 h-full bg-purple-600 text-white rounded-2xl flex items-center justify-center font-black text-xs space-x-2 shadow-lg shadow-purple-100">
           <i class="ri-thumb-up-fill"></i> <span>点赞支持</span>
        </button>
        <button class="flex-1 h-full bg-white border-2 border-purple-100 text-purple-600 rounded-2xl flex items-center justify-center font-black text-xs space-x-2">
           <i class="ri-share-forward-fill"></i> <span>分享</span>
        </button>
    </div>
</div>
'''

AD_B2_HTML = '''
<div class="w-full h-full bg-black/70 flex items-center justify-center p-8">
    <div class="w-full bg-white rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
        <div class="p-4 bg-purple-600 text-white text-center text-[10px] font-black uppercase tracking-widest">
            泰康人寿 为您的热爱鸣谢支持
        </div>
        <div class="p-10 space-y-8 text-center">
            <div class="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
               由 <span class="text-purple-900 font-black px-1.5 border-b-2 border-purple-500 italic">王大妈</span> 强烈邀请您帮忙拉票
            </div>
            <div class="aspect-square bg-purple-50 rounded-3xl flex flex-col items-center justify-center p-6 border border-purple-100">
                <div class="w-full h-full border-4 border-purple-200 border-dashed rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                    <i class="ri-heart-pulse-fill text-6xl text-purple-100 absolute -bottom-4 -right-4 rotate-12"></i>
                    <i class="ri-image-circle-fill text-5xl text-purple-200 z-10"></i>
                    <span class="text-[8px] font-black uppercase tracking-widest text-purple-300 mt-2 z-10">User Entry Poster</span>
                </div>
            </div>
            <div class="space-y-4">
               <h2 class="text-xl font-black italic tracking-tighter text-gray-900">投出宝贵一票 · 助力荣誉时刻</h2>
               <button class="w-full py-5 bg-purple-600 text-white font-black rounded-3xl text-lg shadow-2xl shadow-purple-100 uppercase tracking-tighter italic">帮他助力投票</button>
            </div>
        </div>
        <div class="p-4 bg-purple-50 flex items-center justify-center space-x-2">
           <i class="ri-shield-check-fill text-purple-500"></i>
           <span class="text-[8px] font-bold text-purple-300 italic uppercase">Security Verified Vote System</span>
        </div>
    </div>
</div>
'''

AD_B3_HTML = '''
<div class="w-full h-full bg-black/70 flex items-center justify-center p-8">
    <div class="w-full bg-white rounded-[32px] overflow-hidden flex flex-col shadow-2xl">
        <div class="p-4 bg-purple-600 text-white text-center text-[10px] font-black uppercase tracking-widest">
            活动公益支持伙伴：泰康养老
        </div>
        <div class="p-10 space-y-8 text-center">
            <div class="space-y-2">
               <h2 class="text-2xl font-black italic tracking-tighter text-gray-900">美好的瞬间</h2>
               <p class="text-xs text-gray-400 font-bold uppercase tracking-widest leading-relaxed px-4">分享并见证官方赛事·荣誉锦标赛的精彩瞬间</p>
            </div>
            <div class="aspect-video bg-purple-900 rounded-3xl flex flex-col items-center justify-center relative shadow-2xl overflow-hidden group">
                <div class="absolute inset-0 bg-gradient-to-t from-purple-900 to-transparent opacity-60"></div>
                <i class="ri-video-chat-fill text-6xl text-white/40 z-10"></i>
                <div class="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white/60 text-[8px] font-black uppercase tracking-widest">
                   <span>Honored Video Clip</span>
                   <span>00:15 HD</span>
                </div>
            </div>
            <button class="w-full py-5 bg-purple-600 text-white font-black rounded-3xl text-lg shadow-2xl shadow-purple-100 uppercase tracking-tighter italic">进入相册浏览详情</button>
        </div>
        <div class="p-4 text-center bg-gray-50">
          <span class="text-gray-300 text-[8px] font-black uppercase tracking-widest italic">Shared by ReadingGuild Pro v1.4</span>
        </div>
    </div>
</div>
'''

CH_2_HTML = '''
<div class="flex flex-col h-full bg-white">
    <div class="h-16 flex items-center justify-between px-6 border-b shrink-0">
        <div class="flex items-center space-x-1 text-gray-900">
           <i class="ri-arrow-left-s-line text-2xl"></i>
           <span class="font-bold">返回</span>
        </div>
        <span class="font-black text-lg uppercase tracking-tighter">Details</span>
        <i class="ri-more-fill text-2xl"></i>
    </div>
    <div class="h-14 px-6 flex items-center justify-between border-b bg-purple-50/50 shrink-0">
       <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center shadow-inner"><i class="ri-group-fill text-purple-400"></i></div>
          <span class="font-bold text-sm text-purple-800 tracking-tight">舞之魂舞蹈社 [v1.4]</span>
       </div>
       <i class="ri-arrow-right-s-line text-purple-400"></i>
    </div>
    <div class="flex-1 overflow-y-auto no-scrollbar">
       <div class="w-full aspect-square bg-gray-50 flex flex-col items-center justify-center relative border-b">
          <i class="ri-image-2-fill text-5xl text-gray-200"></i>
          <div class="absolute bottom-6 flex space-x-2">
             <div class="w-2 h-2 rounded-full bg-purple-600"></div>
             <div class="w-2 h-2 rounded-full bg-gray-200"></div>
          </div>
       </div>
       <div class="p-8 space-y-6">
          <div class="flex items-center space-x-4">
             <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white shadow-lg"><i class="ri-user-smile-fill text-gray-400 text-xl"></i></div>
             <div>
                <div class="font-black text-gray-900 tracking-tight">王大妈</div>
                 <div class="text-[10px] text-gray-400 font-bold uppercase">2026-03-05 10:30</div>
             </div>
          </div>
          <div class="p-5 bg-purple-50 border-2 border-dashed border-purple-100 rounded-2xl flex flex-col space-y-3">
             <div class="flex justify-between items-center">
                <span class="text-[10px] font-black text-purple-600 uppercase tracking-widest italic leading-none">Banner B-8</span>
                <i class="ri-advertisement-fill text-purple-200"></i>
             </div>
             <p class="text-xs font-bold text-purple-900 leading-relaxed italic">泰康之家：乐享健康长寿人生，预约参观名额</p>
          </div>
          <div>
             <h1 class="text-2xl font-black tracking-tighter text-gray-900 mb-3 uppercase">燕郊的早晨</h1>
             <p class="text-sm text-gray-600 leading-relaxed font-bold tracking-tight">记录咱们舞之魂社团在公园排练的精美瞬间。</p>
          </div>
       </div>
    </div>
     <div class="h-28 bg-white border-t p-6 flex items-center space-x-4 shrink-0">
        <button class="flex-1 h-full bg-purple-600 text-white rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-purple-100">
            <span class="font-black text-xl italic uppercase tracking-tighter">Vote for club</span>
            <span class="text-[10px] font-bold opacity-60">目前已获 1,234 票</span>
        </button>
        <button class="w-24 h-full border-2 border-purple-100 text-purple-600 rounded-2xl flex flex-col items-center justify-center">
           <i class="ri-share-forward-fill text-2xl mb-1"></i>
           <span class="text-[10px] font-black uppercase tracking-widest">Share</span>
        </button>
     </div>
</div>
'''

CH_1_5_SKEL = '''
<div class="flex flex-col h-full bg-white">
    <div class="h-14 bg-gray-100 flex items-center px-6 justify-between shrink-0">
      <div class="w-6 h-6 bg-gray-300 rounded-full"></div>
      <div class="w-24 h-4 bg-gray-300 rounded-full"></div>
      <div class="w-6 h-6 bg-gray-300 rounded-full"></div>
    </div>
    <div class="flex-1 p-8 space-y-8">
        <div class="space-y-3">
            <div class="w-20 h-3 bg-gray-200 rounded"></div>
            <div class="w-full h-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center px-4 text-gray-400 text-xs font-bold">[代表社团名 · 锁定]</div>
        </div>
        <div class="space-y-3">
            <div class="w-24 h-3 bg-gray-200 rounded"></div>
            <div class="w-full h-24 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 text-xs font-bold">[领队寄语选择区]</div>
        </div>
        <div class="space-y-3">
            <div class="w-20 h-3 bg-gray-200 rounded"></div>
            <div class="w-full h-12 bg-gray-100 rounded-xl"></div>
        </div>
    </div>
    <div class="p-8 shrink-0">
        <div class="w-full h-14 bg-purple-200 rounded-2xl flex items-center justify-center text-purple-500 font-bold">[提交报名申请]</div>
    </div>
</div>
'''

CH_5_SKEL = '''
<div class="flex flex-col h-full bg-gray-50">
    <div class="h-16 bg-white border-b flex items-center px-6 justify-between shrink-0">
        <div class="w-32 h-5 bg-gray-200 rounded"></div>
    </div>
    <div class="flex-1 p-4 grid grid-cols-2 gap-4">
        <div class="space-y-3">
            <div class="w-full aspect-[3/4] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 text-[10px] font-bold">[花絮视频/图片]</div>
            <div class="w-3/4 h-3 bg-gray-300 rounded"></div>
        </div>
        <div class="space-y-3 opacity-50">
            <div class="w-full aspect-[3/4] bg-gray-200 rounded-2xl"></div>
            <div class="w-1/2 h-3 bg-gray-300 rounded"></div>
        </div>
    </div>
</div>
'''

CH_5_1_SKEL = '''
<div class="flex flex-col h-full bg-white">
    <div class="h-14 border-b flex items-center px-6 justify-between shrink-0">
        <div class="w-6 h-6 bg-gray-200 rounded-full"></div>
        <div class="w-20 h-4 bg-gray-200 rounded"></div>
        <div class="w-6 h-6 bg-gray-200 rounded-full"></div>
    </div>
    <div class="flex-1 overflow-y-auto">
        <div class="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-300 font-bold">[多媒体播放区]</div>
        <div class="p-6 space-y-6">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div class="space-y-2">
                    <div class="w-24 h-3 bg-gray-300 rounded"></div>
                    <div class="w-16 h-2 bg-gray-100 rounded"></div>
                </div>
            </div>
            <div class="w-full h-12 bg-purple-50 rounded-xl border border-dashed border-purple-200 flex items-center px-4 text-purple-400 text-[10px] font-bold">[赛事/社团跳转入口]</div>
            <div class="space-y-2">
                <div class="w-full h-3 bg-gray-100 rounded"></div>
                <div class="w-full h-3 bg-gray-100 rounded"></div>
                <div class="w-2/3 h-3 bg-gray-100 rounded"></div>
            </div>
        </div>
    </div>
</div>
'''

UI_ASSETS = {
    'CH-1': CH_1_HTML,
    'CH-1-5': CH_1_5_HTML,
    'CH-1-5_SKEL': CH_1_5_SKEL,
    'CC-24': CC_24_HTML,
    'CC-10-3': CC_10_3_HTML,
    'AD-B1': AD_B1_HTML,
    'CC-10': CC_10_HTML,
    'CC-12': CC_12_HTML,
    'CC-5': CC_5_HTML,
    'CH-5': CH_5_HTML,
    'CH-5_SKEL': CH_5_SKEL,
    'CH-5-1': CH_5_1_HTML,
    'CH-5-1_SKEL': CH_5_1_SKEL,
    'AD-B2': AD_B2_HTML,
    'AD-B3': AD_B3_HTML,
    'CH-2': CH_2_HTML,
    'CC-4': '<div class="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">CC-4 · 社团主页<br>(存量页面)</div>',
    'CH-1-3': '<div class="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">CH-1-3 · 作品列表<br>(存量页面)</div>',
    'CH-3': '<div class="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">CH-3 · 提交作品表单<br>(存量页面)</div>'
}
