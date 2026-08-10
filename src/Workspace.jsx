import { useMemo, useRef, useState } from 'react';
import { ArrowLeftOutlined, CaretDownFilled, CheckOutlined, CloseOutlined, CopyOutlined, DownOutlined, EditOutlined, ExclamationCircleOutlined, LeftOutlined, LinkOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MessageOutlined, MoreOutlined, PauseCircleFilled, PlayCircleFilled, PlusOutlined, SearchOutlined, SendOutlined, SettingOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';

const transcript = [
  { time: '00:00:08', minute: '00:00', text: '大家上午好，欢迎来到海尔宛瑾专卖店，今天给大家带来的是云溪洗烘套装。' },
  { time: '00:00:32', minute: '00:00', text: '刚进入直播间的朋友可以先点一下关注，右上角加入粉丝团，后面会有专属福利。', tags: ['关注力', '粉团话术'] },
  { time: '00:01:12', minute: '00:01', text: '这套洗衣机是精华洗技术，能够快速激活洗衣液，针对领口袖口这些顽固污渍洗得更干净。', tags: ['塑品', '产品卖点'] },
  { time: '00:01:58', minute: '00:01', text: '家里有宝宝或者容易过敏的朋友尤其适合，高温除菌以后衣物穿起来会更安心。', tags: ['塑品', '目标人群'] },
  { time: '00:02:40', minute: '00:02', text: '今天直播间到手价只要六千九百九十九，错过今天就恢复原价，这是全年最低价。', tags: ['促单', '疑似违规'], risk: true },
  { time: '00:03:16', minute: '00:03', text: '拍下以后客服会联系大家确认送货时间，免费送装一体，不需要另外付安装费。', tags: ['售后', '服务保障'] },
  { time: '00:04:05', minute: '00:04', text: '还在犹豫的朋友直接点击下方小黄车，前二十名再送一年洗衣液，现在库存只剩最后八套。', tags: ['促单', '下单指令'] },
  { time: '00:05:24', minute: '00:05', text: '大家最关心的尺寸我再讲一次，预留位置宽六百毫米、高八百五十毫米就可以安装。', tags: ['塑品', '属性功能'] },
  { time: '00:06:18', minute: '00:06', text: '云溪套装支持洗烘联动，洗衣结束后烘干机会自动匹配程序，不需要大家再次操作。', tags: ['塑品', '产品卖点'] },
  { time: '00:07:06', minute: '00:07', text: '刚才问噪音的朋友可以放心，夜间模式运行声音更轻，家里有老人孩子也不会影响休息。', tags: ['互动', '目标人群'] },
  { time: '00:08:22', minute: '00:08', text: '现在拍下还可以享受免费送装一体和整机延保，具体覆盖区域请在下单前咨询客服。', tags: ['售后', '服务保障'] },
  { time: '00:09:15', minute: '00:09', text: '库存提示已经变黄了，想要白色套装的朋友先拍下锁定库存，不合适也支持七天无理由。', tags: ['促单', '下单指令'] },
  { time: '00:10:04', minute: '00:10', text: '新进直播间的朋友点一下关注，我马上再完整演示一次精华洗程序的操作步骤。', tags: ['关注力', '迎新话术'] },
  { time: '00:11:28', minute: '00:11', text: '这款不是容量越大就越费水，它会根据衣物重量自动调整用水量和洗涤时长。', tags: ['塑品', '疑虑化解'] },
  { time: '00:12:36', minute: '00:12', text: '价格权益以商品详情页实时展示为准，大家点击小黄车就能看到当前可领取的优惠券。', tags: ['促单', '合规表达'] },
];

const comments = [
  {time:'00:00:46',level:12,user:'海风轻轻',text:'洗衣机尺寸是多少？'},
  {time:'00:01:18',level:8,user:'小熊软糖',text:'有宝宝可以用吗'},
  {time:'00:01:37',level:21,user:'星河入梦',text:'烘干会不会缩水'},
  {time:'00:02:03',level:5,user:'小满同学',text:'今天什么价格'},
  {time:'00:02:48',level:18,user:'橙子汽水',text:'全年最低价是真的吗'},
  {time:'00:03:21',level:9,user:'简单生活',text:'安装收费吗'},
  {time:'00:04:12',level:16,user:'柠檬树下',text:'送什么赠品'},
  {time:'00:05:30',level:26,user:'北方的风',text:'老小区能送上楼吗'},
  {time:'00:05:48',level:7,user:'七月微光',text:'白色有现货吗'},
  {time:'00:06:02',level:14,user:'一颗小豆子',text:'可以以旧换新吗'},
  {time:'00:06:26',level:11,user:'夏日薄荷',text:'洗烘联动需要联网吗'},
  {time:'00:06:52',level:19,user:'月亮邮差',text:'夜间洗衣声音大不大'},
  {time:'00:07:14',level:6,user:'可乐不加冰',text:'安装需要提前预约吗'},
  {time:'00:07:39',level:23,user:'星星泡饭',text:'旧机器可以帮忙搬走吗'},
  {time:'00:08:07',level:15,user:'山茶花开',text:'延保是几年呀'},
  {time:'00:08:43',level:10,user:'橘子海',text:'县城也能送装一体吗'},
  {time:'00:09:18',level:28,user:'清风徐来',text:'白色还有多少库存'},
  {time:'00:09:46',level:13,user:'布丁奶茶',text:'优惠券在哪里领取'},
  {time:'00:10:21',level:17,user:'云朵收藏家',text:'能再演示一下精华洗吗'},
  {time:'00:11:03',level:9,user:'南风知意',text:'一家四口容量够用吗'},
  {time:'00:11:44',level:20,user:'小岛来信',text:'耗水量会不会很高'},
  {time:'00:12:12',level:7,user:'晚风吹过',text:'支持花呗分期吗'}
];

const frequentWords = [
  {word:'直播间',count:86,category:'互动力'},
  {word:'大家',count:73,category:'互动力'},
  {word:'今天',count:48,category:'促单/线索'},
  {word:'洗衣机',count:42,category:'塑品'},
  {word:'点击',count:31,category:'促单/线索'},
  {word:'安心',count:19,category:'售后'}
];

const reviewVideos = [
  {name:'海尔洗衣机专场复盘',mode:'自有直播',account:'海尔宛瑾专卖店'},
  {name:'康佳吸尘器竞品话术复盘',mode:'竞品直播',account:'康佳宇盈专卖店'},
  {name:'苏泊尔洗地机早场复盘',mode:'自有直播',account:'苏泊尔全能机皇洗地机'},
  {name:'海尔冰箱主播训练复盘',mode:'自有直播',account:'海尔优选旗舰店'}
];

const quickGroups = [
  { name:'AI脚本拆解', questions:['拆解整场直播脚本结构','分析话术循环与节奏','总结直播框架和风格'] },
  { name:'话术质检', questions:['检查表达是否清晰完整','找出承接不自然的段落','给出话术质量改进建议'] },
  { name:'优化原文', questions:['优化代表性核心话术','将促单表达改得更精炼','增强产品卖点表达'] },
  { name:'AI诊断直播间', questions:['问题诊断','分析高转化成交话术','优化营销塑品方式','话术循环时长','诊断并给出优化话术','分析目标用户画像','拆解分析互动手段','拆解直播框架和风格','防退款策略提炼'], disabled:['为什么自然流推荐变少','如何提高直播间GPM','整场数据诊断','分析排品逻辑和优化方案'] },
  { name:'AI查违规', questions:['价格欺诈与价格标示违规','极限词与《广告法》违规','虚假宣传与功效夸大行为违规','查商品描述不合规语句','涉及利益诱导违规','其它违规原因帮我查找违规句子'] },
  { name:'AI分析弹幕', questions:['总结观众高频关注问题','分析弹幕情绪与购买顾虑','提取需要主播回应的问题'] },
  { name:'AI提取话术', questions:['提取营销塑品话术','提取粉团话术','提取迎新话术','提取逼单话术','提取互动话术','提炼直播钩子话术','提取直播人设话术','提取行业金句'] },
];

const compass = [
  ['互动力',18,'#5b8ff9'],['关注力',12,'#61d9a8'],['促单/线索',24,'#f6bd4a'],['塑品',31,'#7666f2'],['售后',9,'#6dc8ec'],['其他',6,'#a78bfa']
];

function Brand() {
  return <div className="ws-brand"><div className="ws-logo-crop"><img src="/source-ui.png" alt=""/></div><strong>数智罗盘</strong></div>;
}

const toSeconds = value => value.split(':').reduce((total,part)=>total*60+Number(part),0);
const toTime = total => { const h=Math.floor(total/3600); const m=Math.floor(total%3600/60); const s=Math.floor(total%60); return [h,m,s].map(v=>String(v).padStart(2,'0')).join(':'); };

export function Workspace({ video, onBack }) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:02:40');
  const [videoSeconds, setVideoSeconds] = useState(160);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [centerCollapsed, setCenterCollapsed] = useState(false);
  const [leftWidth, setLeftWidth] = useState(330);
  const [centerWidth, setCenterWidth] = useState(560);
  const [compassOpen, setCompassOpen] = useState(false);
  const [highFreqOpen, setHighFreqOpen] = useState(false);
  const [sensitiveOn, setSensitiveOn] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [linked, setLinked] = useState(true);
  const [linkConfigOpen, setLinkConfigOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [locateHour, setLocateHour] = useState('00');
  const [locateMinute, setLocateMinute] = useState('02');
  const [locateSecond, setLocateSecond] = useState('40');
  const [transcriptAnchorMinute, setTranscriptAnchorMinute] = useState('');
  const [commentPage, setCommentPage] = useState(1);
  const [transcriptPage, setTranscriptPage] = useState(1);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [sessionNames, setSessionNames] = useState(['直播问题诊断与优化','合规风险专项检查','优秀话术提取']);
  const [editingSession, setEditingSession] = useState(-1);
  const [sessionDraft, setSessionDraft] = useState('');
  const [videoSwitchOpen, setVideoSwitchOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(reviewVideos.find(item=>item.name===video?.name) || reviewVideos[0]);
  const [activeGroup, setActiveGroup] = useState('AI诊断直播间');
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState({});
  const [focusedQuestion, setFocusedQuestion] = useState('');
  const [activeAnchor, setActiveAnchor] = useState('请帮我总结这场直播目前最需要优先改进的问题。');
  const [anchorPopoverOpen, setAnchorPopoverOpen] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState({});
  const [copiedIndex, setCopiedIndex] = useState(-1);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [fabPosition, setFabPosition] = useState({ left:null, top:70 });
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeTag, setActiveTag] = useState('全部口播');
  const [input, setInput] = useState('');
  const [followupReference, setFollowupReference] = useState(null);
  const [messages, setMessages] = useState([
    { role:'user', text:'请帮我总结这场直播目前最需要优先改进的问题。', question:'请帮我总结这场直播目前最需要优先改进的问题。' },
    { role:'assistant', text:'这场直播最需要优先改进的是促单表达的可信度与节奏。主播在 00:02:40 使用了“全年最低价”等高风险绝对化表达，同时在商品卖点讲解后缺少自然的权益承接。建议先修正合规表达，再建立“卖点—人群—权益—下单路径”的完整闭环。', reasoning:'已综合促单节点、风险话术和观众追问：先识别高风险绝对化表述，再检查卖点到权益的承接是否完整，并结合弹幕中的价格疑问判断优先级。', duration:'12 秒', question:'请帮我总结这场直播目前最需要优先改进的问题。' }
  ]);
  const dragRef = useRef(null);
  const chatScrollRef = useRef(null);
  const inputRef = useRef(null);
  const fabDraggedRef = useRef(false);

  const filteredTranscript = useMemo(() => transcript.filter(item => {
    const searchOk = !search || item.text.includes(search);
    const tagOk = activeTag === '全部口播' || item.tags?.includes(activeTag);
    const highlightFilters = [];
    if (selectedWord) highlightFilters.push(item.text.includes(selectedWord));
    if (sensitiveOn) highlightFilters.push(Boolean(item.risk));
    const highlightOk = highlightFilters.length === 0 || highlightFilters.some(Boolean);
    return searchOk && tagOk && highlightOk;
  }), [search, activeTag, selectedWord, sensitiveOn]);

  const commentPageSize = 50;
  const transcriptPageSize = 30;
  const visibleComments = comments.slice((commentPage-1)*commentPageSize,commentPage*commentPageSize);
  const visibleTranscript = filteredTranscript.slice((transcriptPage-1)*transcriptPageSize,transcriptPage*transcriptPageSize);
  const commentPages = Math.ceil(comments.length/commentPageSize);
  const transcriptPages = Math.max(1,Math.ceil(filteredTranscript.length/transcriptPageSize));
  const transcriptAnchorTimes = useMemo(() => Array.from({length:Math.floor(toSeconds('02:46:38')/300)+1},(_,index)=>toTime(index*300)),[]);

  const jumpToTime = value => {
    const safe = /^\d{2}:\d{2}:\d{2}$/.test(value) ? value : '00:00:00';
    const seconds = Math.min(toSeconds('02:46:38'),toSeconds(safe));
    const target = toTime(seconds); const [h,m,s] = target.split(':');
    setVideoSeconds(seconds); setCurrentTime(target); setLocateHour(h); setLocateMinute(m); setLocateSecond(s);
  };

  const handleVideoProgress = event => {
    const value = Number(event.currentTarget.value);
    setVideoSeconds(value);
    if (linked) { const target=toTime(value); const [h,m,s]=target.split(':'); setCurrentTime(target); setLocateHour(h); setLocateMinute(m); setLocateSecond(s); }
  };

  const nearestTranscriptTime = transcript.reduce((best,item)=>Math.abs(toSeconds(item.time)-toSeconds(currentTime))<Math.abs(toSeconds(best)-toSeconds(currentTime))?item.time:best,transcript[0].time);
  const nearestCommentTime = comments.reduce((best,item)=>Math.abs(toSeconds(item.time)-toSeconds(currentTime))<Math.abs(toSeconds(best)-toSeconds(currentTime))?item.time:best,comments[0].time);

  const renderText = text => {
    const terms = [sensitiveOn ? '全年最低价' : '', selectedWord, search].filter(Boolean);
    if (!terms.length) return text;
    const regex = new RegExp(`(${terms.map(term=>term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|')})`,'g');
    return text.split(regex).map((part,index)=>terms.includes(part)?<mark className={part==='全年最低价'?'sensitive-mark':'freq-mark'} key={index}>{part}</mark>:part);
  };

  const startResize = (edge, event) => {
    event.preventDefault();
    dragRef.current = { edge, startX:event.clientX, left:leftWidth, center:centerWidth };
    const move = e => {
      const delta = e.clientX - dragRef.current.startX;
      if (edge === 'left') { setLeftWidth(Math.max(250, Math.min(470, dragRef.current.left + delta))); setCenterWidth(Math.max(420, dragRef.current.center - delta)); }
      else setCenterWidth(Math.max(420, Math.min(720, dragRef.current.center + delta)));
    };
    const up = () => { document.removeEventListener('mousemove',move); document.removeEventListener('mouseup',up); };
    document.addEventListener('mousemove',move); document.addEventListener('mouseup',up);
  };

  const jumpToQuestion = question => {
    setAnalysisOpen(false); setFocusedQuestion(question); setActiveAnchor(question); setAnchorPopoverOpen(false);
    requestAnimationFrame(()=>{
      const node = chatScrollRef.current?.querySelector(`[data-question="${question}"]`);
      node?.scrollIntoView({behavior:'smooth',block:'center'});
    });
  };

  const sendQuestion = (question, fromQuickAnalysis=false) => {
    if (fromQuickAnalysis && usedQuestions[question]) { jumpToQuestion(question); return; }
    setMessages(list => [...list,{role:'user',text:question,question},{role:'assistant',text:'已基于整场口播、弹幕和内容罗盘完成分析。建议先处理高风险表达，再围绕“卖点—权益—行动指令”重组当前话术节奏。',reasoning:'已提取与该问题相关的口播片段、观众反馈和内容分类，按风险、转化影响与可执行性排序后形成建议。',duration:'12 秒',question}]);
    if (fromQuickAnalysis) setUsedQuestions(items=>({...items,[question]:true}));
    setInput(''); setFollowupReference(null); setAnalysisOpen(false);
  };

  const submitInput = () => { if (input.trim()) sendQuestion(input.trim()); };
  const copyAnswer = async (text,index) => { try { await navigator.clipboard?.writeText(text); } finally { setCopiedIndex(index); setTimeout(()=>setCopiedIndex(-1),1600); } };
  const scrollToLatest = () => { const node=chatScrollRef.current; if(node){node.scrollTo({top:node.scrollHeight,behavior:'smooth'});setShowScrollBottom(false);} };
  const handleChatScroll = event => { const node=event.currentTarget; setShowScrollBottom(node.scrollHeight-node.scrollTop-node.clientHeight>32); const top=node.getBoundingClientRect().top; const userMessages=[...node.querySelectorAll('.message.user[data-question]')]; let current=userMessages[0]; userMessages.forEach(item=>{if(item.getBoundingClientRect().top<=top+52) current=item;}); if(current?.dataset.question) setActiveAnchor(current.dataset.question); };
  const beginFabDrag = event => { if(event.button!==0) return; const panel=event.currentTarget.closest('.ai-panel'); const rect=panel.getBoundingClientRect(); const start={x:event.clientX,y:event.clientY,left:event.currentTarget.getBoundingClientRect().left-rect.left,top:event.currentTarget.getBoundingClientRect().top-rect.top}; fabDraggedRef.current=false; const move=e=>{const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)+Math.abs(dy)>3)fabDraggedRef.current=true;setFabPosition({left:Math.max(8,Math.min(rect.width-104,start.left+dx)),top:Math.max(66,Math.min(rect.height-42,start.top+dy))});}; const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);}; window.addEventListener('pointermove',move);window.addEventListener('pointerup',up); };
  const saveSessionName = index => { const next=sessionDraft.trim(); if(next) setSessionNames(items=>items.map((item,i)=>i===index?next:item)); setEditingSession(-1); };
  const gridStyle = { gridTemplateColumns: `${leftCollapsed ? 48 : leftWidth}px 6px ${centerCollapsed ? 48 : centerWidth}px 6px minmax(430px,1fr)` };

  return <div className="workspace-shell">
    <header className="ws-topbar"><Brand/><nav>{['首页','兴趣电商','一类电商','直播','退货','财务','广告','库存','订单','店铺','弹幕'].map(i=><button className={i==='直播'?'active':''} key={i}>{i}</button>)}</nav><div className="ws-user"><span>陈</span>陈旭光<DownOutlined/></div></header>
    <div className="ws-subnav"><button>总览</button><button>直播间</button><button>主播</button><button className="active">AI直播复盘</button><em>小程序</em></div>
    <section className="workspace-header"><button className="back" onClick={onBack}><ArrowLeftOutlined/>返回列表</button><div className="video-switch"><button onClick={()=>setVideoSwitchOpen(v=>!v)}><h1>{selectedVideo.name}</h1><DownOutlined/></button>{videoSwitchOpen&&<div>{reviewVideos.map(item=><button className={item.name===selectedVideo.name?'active':''} key={item.name} onClick={()=>{setSelectedVideo(item);setVideoSwitchOpen(false)}}><strong>{item.name}</strong><span>{item.account} · {item.mode}</span></button>)}</div>}</div><div className="title"><span className={'mode-tag '+(selectedVideo.mode==='竞品直播'?'purple':'')}>{selectedVideo.mode}</span><span className="ws-status">分析完成</span></div><div className="meta"><span>{selectedVideo.account}</span><i></i><span>董佳楠、石嘉慧</span><i></i><span>海尔云溪洗烘套装</span><i></i><span>02:46:38</span><i></i><span>口播 28,647 字</span><span className="speech-speed">口播速度 238 字/分钟 <span className="speed-help"><ExclamationCircleOutlined/><span className="speed-tooltip">口播速度 = 口播总字数 ÷ 实际说话总时长；静默、音乐和无口播区间不计入说话时长。</span></span></span></div><div className="link-config"><button className={linked?'active':''} onClick={()=>{setLinkConfigOpen(v=>!v);setMoreMenuOpen(false)}}><LinkOutlined/>联动配置</button>{linkConfigOpen&&<div><label><input type="checkbox" checked={linked} onChange={e=>setLinked(e.target.checked)}/><span>视频、口播与弹幕时间联动</span></label><small>开启后，拖动视频或点击时间戳将同步定位三类内容。</small></div>}</div><div className="workspace-more"><button className="ws-more" aria-label="更多功能" onClick={()=>{setMoreMenuOpen(v=>!v);setLinkConfigOpen(false)}}><MoreOutlined/></button>{moreMenuOpen&&<div className="workspace-more-menu"><button disabled><strong>导出话术</strong><span>暂未开放</span></button></div>}</div></section>
    <div className="workspace-grid" style={gridStyle}>
      <aside className={'video-panel '+(leftCollapsed?'collapsed':'')}>
        <button className="collapse-btn" aria-label={leftCollapsed?'展开视频与弹幕':'收起视频与弹幕'} onClick={()=>setLeftCollapsed(v=>!v)}>{leftCollapsed?<MenuUnfoldOutlined/>:<MenuFoldOutlined/>}</button>
        {leftCollapsed ? <span className="vertical-label">视频与弹幕</span> : <><div className="panel-title"><strong>直播画面</strong><span>原始证据</span></div><div className="portrait-video"><div className="live-frame"><span>海尔云溪<br/>洗烘套装</span><small>AI 直播复盘示例画面</small></div><button className="play-main" onClick={()=>setPlaying(v=>!v)}>{playing?<PauseCircleFilled/>:<PlayCircleFilled/>}</button><div className="video-controls"><span>{toTime(videoSeconds)}</span><input aria-label="视频播放进度" type="range" min="0" max={toSeconds('02:46:38')} value={videoSeconds} onInput={handleVideoProgress} onChange={handleVideoProgress}/><span>02:46:38</span></div></div><div className="comment-head"><strong>弹幕</strong><span>识别 1,286 条</span><button><SearchOutlined/></button></div><div className="comment-list">{visibleComments.map(item=><button title={`弹幕时间 ${item.time}`} key={item.time+item.user} onClick={()=>{setVideoSeconds(toSeconds(item.time));if(linked){const [h,m,s]=item.time.split(':');setCurrentTime(item.time);setLocateHour(h);setLocateMinute(m);setLocateSecond(s)}}} className={nearestCommentTime===item.time?'active':''}><span className="comment-level">Lv.{item.level}</span><strong>{item.user}</strong><em>{item.text}</em></button>)}</div><div className="evidence-pagination"><button disabled={commentPage===1} onClick={()=>setCommentPage(p=>p-1)}><LeftOutlined/></button><span>{commentPage}/{commentPages}</span><button disabled={commentPage===commentPages} onClick={()=>setCommentPage(p=>p+1)}><DownOutlined/></button></div></>}
      </aside>
      <div className="resizer" role="separator" aria-label="调整视频栏宽度" aria-orientation="vertical" onMouseDown={e=>startResize('left',e)}></div>
      <main className={'transcript-panel '+(centerCollapsed?'collapsed':'')}>
        <button className="collapse-btn" aria-label={centerCollapsed?'展开口播与内容分析':'收起口播与内容分析'} onClick={()=>setCenterCollapsed(v=>!v)}>{centerCollapsed?<MenuUnfoldOutlined/>:<MenuFoldOutlined/>}</button>
        {centerCollapsed ? <span className="vertical-label">口播与内容分析</span> : <><div className="transcript-toolbar"><div className="toolbar-locate"><strong>口播稿</strong><span className="locator-label"><SwapOutlined/>快速定位</span><input aria-label="小时" type="number" min="0" max="99" value={locateHour} onFocus={e=>e.currentTarget.select()} onChange={e=>setLocateHour(e.target.value)}/><b>:</b><input aria-label="分钟" type="number" min="0" max="59" value={locateMinute} onFocus={e=>e.currentTarget.select()} onChange={e=>setLocateMinute(e.target.value)}/><b>:</b><input aria-label="秒" type="number" min="0" max="59" value={locateSecond} onFocus={e=>e.currentTarget.select()} onChange={e=>setLocateSecond(e.target.value)}/><button onClick={()=>jumpToTime(`${String(locateHour).padStart(2,'0')}:${String(locateMinute).padStart(2,'0')}:${String(locateSecond).padStart(2,'0')}`)}>跳转</button></div><div className="analysis-actions"><div className="transcript-search"><button aria-label="搜索口播稿" className={searchOpen||search?'active':''} onClick={()=>setSearchOpen(v=>!v)}><SearchOutlined/></button>{searchOpen&&<div className="transcript-search-popover"><SearchOutlined/><input autoFocus placeholder="搜索全部口播" value={search} onChange={event=>{setSearch(event.target.value);setTranscriptPage(1)}}/><button onClick={()=>{setSearch('');setSearchOpen(false);setTranscriptPage(1)}}>清空</button></div>}</div><button className={'compass-toggle '+(compassOpen?'active':'')} onClick={()=>{setCompassOpen(v=>!v);setHighFreqOpen(false)}}>内容罗盘 <CaretDownFilled/></button><button className={highFreqOpen||selectedWord?'active':''} onClick={()=>{setHighFreqOpen(v=>!v);setCompassOpen(false)}}>高频词{selectedWord&&<em>1</em>}</button><button className={sensitiveOn?'active':''} onClick={()=>{setSensitiveOn(v=>!v);setTranscriptPage(1)}}>敏感词 <em>3</em></button></div></div>
        {compassOpen && <section className="compass-panel"><header><div><strong>内容罗盘</strong><span>内容构成占比，非能力评分</span></div><button onClick={()=>setCompassOpen(false)}>收起 <CaretDownFilled/></button></header><div className="compass-body"><div className="donut"><strong>100%</strong><span>已分类内容</span></div><div className="compass-bars">{compass.map(([name,val,color])=><button key={name} onClick={()=>{setActiveTag(name);setCompassOpen(false)}}><span>{name}</span><i><b style={{width:val*2.5+'px',background:color}}></b></i><em>{val}%</em></button>)}</div></div><footer>分类覆盖率 87.6% · 多标签语句已按标签数量平均分摊</footer></section>}
        {highFreqOpen&&<section className="frequency-panel"><header><div><strong>高频词</strong><span>点击词语筛选并高亮全部命中位置</span></div><button onClick={()=>{setSelectedWord('');setTranscriptPage(1);setHighFreqOpen(false)}}>清除选择</button></header><div>{frequentWords.map(item=><button className={selectedWord===item.word?'active':''} key={item.word} onClick={()=>{setSelectedWord(selectedWord===item.word?'':item.word);setTranscriptPage(1);setHighFreqOpen(false)}}><strong>{item.word}</strong><span>{item.count} 次</span><em>{item.category}</em></button>)}</div></section>}
        <div className="locate-strip"><button className={activeTag==='全部口播'?'active':''} onClick={()=>{setActiveTag('全部口播');setTranscriptPage(1)}}>全部口播</button>{['促单','塑品','关注力','疑似违规'].map(tag=><button key={tag} className={activeTag===tag?'active':''} onClick={()=>{setActiveTag(tag);setTranscriptPage(1)}}>{tag}</button>)}<span>定位结果 {filteredTranscript.length} 条</span></div>
        <div className="transcript-list">{visibleTranscript.map((item,index)=>{const isMinuteMarker=index===0||visibleTranscript[index-1]?.minute!==item.minute;return <article key={item.time} className={(nearestTranscriptTime===item.time?'current ':'')+(item.risk?'risk':'')} onClick={()=>{setVideoSeconds(toSeconds(item.time));if(linked){const [h,m,s]=item.time.split(':');setCurrentTime(item.time);setLocateHour(h);setLocateMinute(m);setLocateSecond(s)}}}><div className="minute minute-anchor" onMouseEnter={()=>isMinuteMarker&&setTranscriptAnchorMinute(item.minute)} onMouseLeave={()=>setTranscriptAnchorMinute('')}>{isMinuteMarker?item.minute:''}{isMinuteMarker&&transcriptAnchorMinute===item.minute&&<section className="transcript-anchor-popover" onClick={event=>event.stopPropagation()}><strong>点击时间点快速跳转</strong><div className="transcript-anchor-times">{transcriptAnchorTimes.map(time=><button key={time} onClick={()=>{jumpToTime(time);setTranscriptAnchorMinute('')}}>{time.slice(0,5)}</button>)}</div><div className="anchor-quick-locate"><span>快速定位</span><input aria-label="小时" type="number" min="0" max="99" value={locateHour} onFocus={event=>event.currentTarget.select()} onChange={event=>setLocateHour(event.target.value)}/><b>:</b><input aria-label="分钟" type="number" min="0" max="59" value={locateMinute} onFocus={event=>event.currentTarget.select()} onChange={event=>setLocateMinute(event.target.value)}/><b>:</b><input aria-label="秒" type="number" min="0" max="59" value={locateSecond} onFocus={event=>event.currentTarget.select()} onChange={event=>setLocateSecond(event.target.value)}/><button onClick={()=>{jumpToTime(`${String(locateHour).padStart(2,'0')}:${String(locateMinute).padStart(2,'0')}:${String(locateSecond).padStart(2,'0')}`);setTranscriptAnchorMinute('')}}>跳转</button></div></section>}</div><div className="utterance"><div className="utterance-meta"><button>{item.time}</button>{item.tags&&<span>{item.tags.map(t=><em key={t}>{t}</em>)}</span>}</div><p>{renderText(item.text)}</p></div></article>})}</div><div className="evidence-pagination transcript-pagination"><button disabled={transcriptPage===1} onClick={()=>setTranscriptPage(p=>p-1)}><LeftOutlined/></button><span>{transcriptPage}/{transcriptPages}</span><button disabled={transcriptPage===transcriptPages} onClick={()=>setTranscriptPage(p=>p+1)}><DownOutlined/></button></div></>}
      </main>
      <div className="resizer" role="separator" aria-label="调整AI助手栏宽度" aria-orientation="vertical" onMouseDown={e=>startResize('right',e)}></div>
      <aside className="ai-panel">
        <header><div><strong>AI复盘助手</strong><span>基于当前视频分析</span></div><button className="session-btn" onClick={()=>setSessionOpen(v=>!v)}><MessageOutlined/>会话列表<em>{sessionNames.length}</em></button><button aria-label="新建会话"><PlusOutlined/></button></header>
        {sessionOpen && <div className="session-drawer"><div><strong>会话列表</strong><button aria-label="关闭会话列表" onClick={()=>setSessionOpen(false)}><CloseOutlined/></button></div>{sessionNames.map((name,index)=><div className={'session-item '+(index===0?'active':'')} key={name+index}><div>{editingSession===index?<input autoFocus value={sessionDraft} onChange={e=>setSessionDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')saveSessionName(index);if(e.key==='Escape')setEditingSession(-1)}}/>:<span>{name}</span>}<small>{index===0?'刚刚 · 陈旭光':index===1?'08月09日 · 董佳楠':'08月09日 · 石嘉慧'}</small></div><button aria-label={editingSession===index?'保存会话名称':'编辑会话名称'} onClick={()=>editingSession===index?saveSessionName(index):(setEditingSession(index),setSessionDraft(name))}>{editingSession===index?<CheckOutlined/>:<EditOutlined/>}</button></div>)}</div>}
        <button className="analysis-fab" style={fabPosition.left===null?undefined:{left:fabPosition.left,right:'auto',top:fabPosition.top}} onPointerDown={beginFabDrag} onClick={()=>{if(fabDraggedRef.current){fabDraggedRef.current=false;return;}setAnalysisOpen(true)}}><MessageOutlined/><span>快捷分析</span></button>
        {analysisOpen&&<section className="analysis-drawer"><header><div><strong>快捷分析</strong><span>已生成报告的问题不可重复发送</span></div><button aria-label="关闭快捷分析" onClick={()=>setAnalysisOpen(false)}><CloseOutlined/></button></header><div className="quick-groups">{quickGroups.map(group=><button key={group.name} className={activeGroup===group.name?'active':''} onClick={()=>setActiveGroup(activeGroup===group.name?'':group.name)}>{group.name}</button>)}</div>{activeGroup&&<div className="quick-questions">{quickGroups.find(g=>g.name===activeGroup)?.questions.map(q=>usedQuestions[q]?<button className="used" key={q} onClick={()=>jumpToQuestion(q)}><span>{q}</span><em>已生成 · 查看报告</em></button>:<button key={q} onClick={()=>sendQuestion(q,true)}>{q}<SendOutlined/></button>)}{quickGroups.find(g=>g.name===activeGroup)?.disabled?.map(q=><button className="disabled" key={q} title="需关联直播经营数据，后续开放" disabled>{q}<small>后续开放</small></button>)}</div>}</section>}
        <nav className="conversation-anchors" aria-label="会话锚点" onPointerEnter={()=>setAnchorPopoverOpen(true)} onPointerLeave={()=>setAnchorPopoverOpen(false)}>{messages.filter(msg=>msg.role==='user').map((msg,index)=><button key={msg.question||index} aria-label={`跳转到问题：${msg.text}`} className={activeAnchor===msg.question?'active':''} onClick={()=>jumpToQuestion(msg.question)}><i></i></button>)}<div className={'anchor-popover '+(anchorPopoverOpen?'open':'')}>{messages.filter(msg=>msg.role==='user').map((msg,index)=><button key={msg.question||index} className={activeAnchor===msg.question?'active':''} onClick={()=>jumpToQuestion(msg.question)}><b>Q{index+1}.</b><span>{msg.text}</span></button>)}</div></nav>
        <div className="chat-scroll" ref={chatScrollRef} onScroll={handleChatScroll}>{messages.map((msg,index)=><div data-question={msg.question} className={'message '+msg.role+(focusedQuestion===msg.question?' focused':'')} key={index}>{msg.role==='assistant'&&<div className="bot">AI</div>}<div className="bubble">{msg.role==='assistant'&&<div className="reasoning"><button onClick={()=>setExpandedReasoning(items=>({...items,[index]:!items[index]}))}><strong>已深度思考（用时 {msg.duration}）</strong><CaretDownFilled className={expandedReasoning[index]?'open':''}/></button>{expandedReasoning[index]&&<p>{msg.reasoning}</p>}</div>}<div className="answer-text">{msg.text}</div>{msg.role==='assistant'&&<div className="feedback"><div><button onClick={()=>copyAnswer(msg.text,index)}><CopyOutlined/>{copiedIndex===index?'已复制':'复制'}</button><button>有帮助</button><button>没帮助</button><button onClick={()=>{setFollowupReference({text:msg.text,question:msg.question});setInput('');inputRef.current?.focus()}}>进一步提问</button></div><button className="export-answer">导出</button></div>}</div></div>)}</div>
        {showScrollBottom&&<button className="scroll-latest" aria-label="回到最新对话" onClick={scrollToLatest}><DownOutlined/></button>}
        {followupReference&&<div className="followup-reference"><button title="定位到被引用的回答" onClick={()=>jumpToQuestion(followupReference.question)}><span>追问引用：{followupReference.text}</span></button><button aria-label="取消引用回答" onClick={()=>{setFollowupReference(null);setInput('')}}><CloseOutlined/></button><small>围绕当前引用的回答继续提问...</small></div>}
        <footer className="chat-input"><div className="identity"><button><UserOutlined/>运营复盘专家<DownOutlined/></button><span>当前会话身份</span></div><div className="input-box"><textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} placeholder="围绕当前直播自由提问，支持询问指定时间…" onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitInput()}}}></textarea><div><button><SettingOutlined/>引用整场</button><span>{input.length}/2000</span><button className="send" disabled={!input.trim()} onClick={submitInput}><SendOutlined/></button></div></div><small>AI生成内容可能存在误差，请结合原始视频人工核对</small></footer>
      </aside>
    </div>
  </div>;
}
