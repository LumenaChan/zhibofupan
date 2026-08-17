import { useMemo, useRef, useState } from 'react';
import { ArrowLeftOutlined, CaretDownFilled, CheckOutlined, CloseOutlined, CopyOutlined, DownOutlined, EditOutlined, ExclamationCircleOutlined, LeftOutlined, LinkOutlined, MenuFoldOutlined, MenuUnfoldOutlined, MessageOutlined, MoreOutlined, PauseCircleFilled, PlayCircleFilled, PlusOutlined, SearchOutlined, SendOutlined, SettingOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';
import transcript from './transcript-data';
import { categoryOrder, speechCategoryKeywords } from './speech-category-keywords';
import latestContentClassification from '../../AI直播复盘_真实口播关键词分类映射_最新版.json';
import naturalQuestionReport from '../report/natural-question.md?raw';
import overallDiagnosisReport from '../report/overall-diagnosis.md?raw';
import danmuDiagnosisReport from '../report/danmu-diagnosis.md?raw';
import speechOptimizationReport from '../report/speech-optimization.md?raw';
import violationReport from '../report/violation-report.md?raw';

const comments = [
  {time:'00:00:00',level:18,user:'明***',text:'刚拍了'}, {time:'00:00:00',level:3,user:'w***',text:'有送驱蚊液是吗？'},
  {time:'00:00:00',level:3,user:'阳***',text:'台式怎么拍'}, {time:'00:00:00',level:4,user:'徐***',text:'我也下单了'},
  {time:'00:00:31',level:3,user:'6***',text:'买了'}, {time:'00:00:54',level:3,user:'阳***',text:'不是立式的吗？怎么变台式了？'},
  {time:'00:01:38',level:0,user:'爱***',text:'已下单，加急，'}, {time:'00:02:08',level:2,user:'快***',text:'下单了'},
  {time:'00:02:17',level:23,user:'香蕉***',text:'风速大不大'}, {time:'00:03:08',level:7,user:'N***',text:'我怎么拍不了'},
  {time:'00:03:12',level:23,user:'容***',text:'我也买了'}, {time:'00:03:28',level:24,user:'擦***',text:'279的风是不是要比199大啊'},
  {time:'00:03:57',level:23,user:'擦***',text:'看一下我是不是买对了的'}, {time:'00:05:22',level:3,user:'花***',text:'家里没蚊子的拍哪一个？'},
  {time:'00:05:40',level:13,user:'不***',text:'好用吗'}, {time:'00:08:54',level:18,user:'明***',text:'刚拍了199'},
  {time:'00:09:13',level:1,user:'勇***',text:'已拍'}, {time:'00:09:17',level:12,user:'梅***',text:'发哪家快递？'},
  {time:'00:10:07',level:1,user:'李***',text:'199不能买啊199高'}, {time:'00:10:50',level:1,user:'李***',text:'哈喽，美女我179高了179了那199要了179买完了'},
  {time:'00:14:12',level:23,user:'香蕉***',text:'我也买199的'}, {time:'00:14:59',level:2,user:'篮球***',text:'风扇高度多少？'},
  {time:'00:15:29',level:23,user:'香蕉***',text:'加急'}, {time:'00:15:52',level:23,user:'香蕉***',text:'我买的是199的'},
  {time:'00:17:06',level:1,user:'福***',text:'风速怎么样'}, {time:'00:17:21',level:1,user:'福***',text:'质保多久'},
  {time:'00:17:51',level:23,user:'香蕉***',text:'云南多久能到'}, {time:'00:18:02',level:26,user:'风***',text:'钻石风扇刚到家，又看上你这款叫我怎么办'},
  {time:'00:18:25',level:2,user:'爱***',text:'多重'}, {time:'00:18:51',level:11,user:'墨***',text:'多大啊'},
  {time:'00:19:08',level:3,user:'X***',text:'下单了'}, {time:'00:21:01',level:11,user:'墨***',text:'买了'},
  {time:'00:21:25',level:11,user:'墨***',text:'怎么领？'}, {time:'00:24:10',level:6,user:'吃***',text:'哪款有语音控制的'},
  {time:'00:24:19',level:1,user:'贵***',text:'那好啊，美女我'}, {time:'00:25:20',level:1,user:'闰***',text:'有效距离多远'},
  {time:'00:25:30',level:1,user:'贵***',text:'真有你说那么好吗？'}, {time:'00:25:43',level:6,user:'木***',text:'可以声控的吗'},
  {time:'00:27:53',level:24,user:'美***',text:'怎么不回答问题'}, {time:'00:27:55',level:1,user:'贵***',text:'怎么进不去呢'},
  {time:'00:28:23',level:23,user:'香蕉***',text:'我的没送遥控吗'}, {time:'00:29:19',level:23,user:'香蕉***',text:'送几样东西'},
  {time:'00:29:55',level:16,user:'昕***',text:'196是台立两用嘛？'}, {time:'00:30:49',level:4,user:'玲***',text:'我买了'},
  {time:'00:31:22',level:4,user:'玲***',text:'风扇多大直径'}, {time:'00:33:14',level:4,user:'玲***',text:'158元的是310x310x1050是不是'},
  {time:'00:33:25',level:10,user:'爱心***',text:'158的有遥控器么'}, {time:'00:35:52',level:23,user:'香蕉***',text:'我买了'},
  {time:'00:37:40',level:23,user:'香蕉***',text:'早时候买的哪个不送遥控'}
];

const categoryColors = ['#5b8ff9','#61d9a8','#f6bd4a','#7666f2','#6dc8ec','#a78bfa','#f38f5d','#52b7a8'];
const contentClassification = latestContentClassification.taxonomy.map((category,index)=>({
  name:category.category,
  color:categoryColors[index],
  children:category.subcategories.map(subcategory=>({name:subcategory.subcategory, keywords:subcategory.keywords}))
}));
const danmuCategoryKeywords = {
  '购买成交':['刚拍了','怎么拍','下单了','买了','已下单','怎么拍不了','我也买了','买对了','拍哪一个','刚拍了199','已拍','199不能买','买完了','我也买199的','我买的是199的','怎么进不去','我买了'],
  '价格优惠':['279','199','179','196','158元','158的'],
  '功能性能':['风速大不大','风是不是要比199大','风速怎么样','语音控制','声控'],
  '规格参数':['高度多少','多重','多大啊','有效距离多远','多大直径','310x310x1050'],
  '款式选购':['台式','立式','怎么变台式','买对了','拍哪一个','279的风是不是要比199大','钻石风扇','这款','哪款','台立两用','哪个不送遥控'],
  '赠品权益':['送驱蚊液','怎么领','没送遥控','送几样东西','有遥控器','不送遥控'],
  '物流售后':['加急','发哪家快递','质保多久','云南多久能到','刚到家','没送遥控'],
  '体验反馈':['好用吗','真有你说那么好吗','怎么不回答问题']
};
const danmuCategoryOrder = Object.keys(danmuCategoryKeywords);
const sensitiveRiskKeywords = {
  '价格优惠风险':['清仓','国补','国库','国股','国五','果补','双重叠加','原价599','原价5599','省四百多块','不会再有这个价','之后不会再上了','清完不再补'],
  '稀缺促单风险':['就这三个名额','就这四个名额','就这五个名额','只有这四个了','还能送这五位','再送两位','只能加两单','30秒时间','20秒时间','一分钟时间','过点不再等','现货确实不多','没货了','正在支付的全部清空','不买的话咱就让给新人'],
  '排名绝对化风险':['五大榜单的榜首','五大榜单都在top 1的位置','榜首','top 1','全平台全类目','全平台全联盟','全平台全链路','只有它这一款'],
  '性能功效风险':['比普通风扇凉快2到3倍','凉快2到3倍','连开七天七夜不带发热发烫','连开七天7夜不带发热发烫','隔6米','抑菌器','新风机','防霉抗菌的扇叶','防霉','防潮','防短路','吹的风舒服干净'],
  '数据背书风险':['粉丝量三百多万','累计销量一百多万台','卖一百多万台','26年新款','检测报告','经过检测'],
  '商品承诺风险':['199直接就发二号5599的顶配机器','买到199直接就发2号599的顶配','直接升级发2号599的顶配版本','所有功能都有','所有功能全部都有','送驱蚊液','送遥控器','送驱蚊','送遥控','不送驱蚊','不送遥控','不带语音'],
  '售后履约风险':['七天无理由','两年的整机质保','升级了两年的整机质保','质保两年','两年之内有啥问题','联系我们创维客服','全部安排现货','安排现货','现在就发','四通一达的现在就发走']
};
const orderedKeywords = Object.fromEntries(categoryOrder.map(category=>[category,[...speechCategoryKeywords[category]].sort((a,b)=>b.length-a.length)]));
const keywordCandidates = categoryOrder.flatMap(category => orderedKeywords[category].map(keyword=>({category,keyword}))).sort((a,b)=>b.keyword.length-a.keyword.length || a.keyword.localeCompare(b.keyword));
const findKeywordMatches = text => {
  const candidates = keywordCandidates.flatMap(({category,keyword}) => {
    const hits=[]; let start=text.indexOf(keyword);
    while(start!==-1){ hits.push({category,keyword,start,end:start+keyword.length}); start=text.indexOf(keyword,start+keyword.length); }
    return hits;
  }).sort((a,b)=>b.keyword.length-a.keyword.length || a.start-b.start);
  const accepted=[];
  candidates.forEach(hit=>{ if(!accepted.some(item=>hit.start<item.end&&item.start<hit.end)) accepted.push(hit); });
  return accepted.sort((a,b)=>a.start-b.start);
};
const contentClassificationCandidates = contentClassification.flatMap(category=>category.children.flatMap(subcategory=>subcategory.keywords.flatMap(keyword=>keyword.source_match_terms.map(term=>({category:category.name,subcategory:subcategory.name,keyword:keyword.keyword,term}))))).sort((a,b)=>b.term.length-a.term.length || a.term.localeCompare(b.term));
const findContentClassificationMatches = text => {
  const candidates = contentClassificationCandidates.flatMap(({category,subcategory,keyword,term})=>{
    const hits=[]; let start=text.indexOf(term);
    while(start!==-1){ hits.push({category,subcategory,keyword,term,start,end:start+term.length}); start=text.indexOf(term,start+term.length); }
    return hits;
  }).sort((a,b)=>b.term.length-a.term.length || a.start-b.start);
  const accepted=[];
  candidates.forEach(hit=>{if(!accepted.some(item=>hit.start<item.end&&item.start<hit.end))accepted.push(hit);});
  return accepted.sort((a,b)=>a.start-b.start);
};
const riskCandidates = Object.entries(sensitiveRiskKeywords).flatMap(([riskType,keywords])=>keywords.map(keyword=>({riskType,keyword}))).sort((a,b)=>b.keyword.length-a.keyword.length || a.keyword.localeCompare(b.keyword));
const findRiskMatches = text => {
  const candidates = riskCandidates.flatMap(({riskType,keyword}) => {
    const hits=[]; let start=text.indexOf(keyword);
    while(start!==-1){ hits.push({riskType,keyword,start,end:start+keyword.length}); start=text.indexOf(keyword,start+keyword.length); }
    return hits;
  }).sort((a,b)=>b.keyword.length-a.keyword.length || a.start-b.start);
  const accepted=[];
  candidates.forEach(hit=>{ if(!accepted.some(item=>hit.start<item.end&&item.start<hit.end)) accepted.push(hit); });
  return accepted.sort((a,b)=>a.start-b.start);
};
const danmuCandidates = danmuCategoryOrder.flatMap(category=>danmuCategoryKeywords[category].map(keyword=>({category,keyword}))).sort((a,b)=>b.keyword.length-a.keyword.length || a.keyword.localeCompare(b.keyword));
const findDanmuMatches = text => {
  const candidates=danmuCandidates.flatMap(({category,keyword})=>{const hits=[];let start=text.indexOf(keyword);while(start!==-1){hits.push({category,keyword,start,end:start+keyword.length});start=text.indexOf(keyword,start+keyword.length);}return hits;}).sort((a,b)=>b.keyword.length-a.keyword.length || a.start-b.start);
  const accepted=[]; candidates.forEach(hit=>{if(!accepted.some(item=>hit.start<item.end&&item.start<hit.end))accepted.push(hit);});
  return accepted.sort((a,b)=>a.start-b.start);
};
const categorizedComments = comments.map(item=>{const danmuMatches=findDanmuMatches(item.text);return {...item,danmuMatches,danmuCategories:[...new Set(danmuMatches.map(match=>match.category))]};});
const categorizedTranscript = transcript.map(item => {
  const keywordMatches = findKeywordMatches(item.text);
  const contentMatches = findContentClassificationMatches(item.text);
  const riskMatches = findRiskMatches(item.text);
  const categoryMatches = categoryOrder.reduce((result,category)=>{ const words=[...new Set(keywordMatches.filter(hit=>hit.category===category).map(hit=>hit.keyword))]; if(words.length) result[category]=words; return result; },{});
  const legacyTags = Object.keys(categoryMatches);
  const contentTags = [...new Set(contentMatches.map(hit=>hit.category))];
  const contentSubcategories = [...new Set(contentMatches.map(hit=>hit.subcategory))];
  return { ...item, tags:contentSubcategories, legacyTags, categoryMatches, keywordMatches, contentMatches, contentTags, riskMatches, hasRisk:riskMatches.length>0 };
});

const reviewVideos = [
  {name:'创维静享驱蚊空气循环扇专场复盘',mode:'自有直播',account:'创维生活电器旗舰店'},
  {name:'海尔洗衣机专场复盘',mode:'自有直播',account:'海尔宛瑾专卖店'},
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

function Brand() {
  return <div className="ws-brand"><div className="ws-logo-crop"><img src="/source-ui.png" alt=""/></div><strong>数智罗盘</strong></div>;
}

const toSeconds = value => value.split(':').reduce((total,part)=>total*60+Number(part),0);
const toTime = total => { const h=Math.floor(total/3600); const m=Math.floor(total%3600/60); const s=Math.floor(total%60); return [h,m,s].map(v=>String(v).padStart(2,'0')).join(':'); };
const videoDuration = '00:38:53';
const naturalQuestion = '请帮我总结这场直播目前最需要优先改进的问题。';
const reportByQuestion = {
  [naturalQuestion]: naturalQuestionReport,
  'AI整体诊断报告': overallDiagnosisReport,
  'AI弹幕诊断报告': danmuDiagnosisReport,
  'AI话术优化报告': speechOptimizationReport,
  'AI违规报告': violationReport
};
const reasoningByQuestion = {
  [naturalQuestion]: { duration:'12 秒', text:'我先综合检查了本场直播的主播口播、用户弹幕和违规风险，没有单独依据某一个指标下结论。口播侧最明显的问题是SKU、价格、功能和赠品信息反复交叉出现；弹幕侧则持续出现“买哪个、买对了吗、哪个有语音、有没有遥控”等选款确认问题，说明用户已经有较强购买意向，但决策路径仍不够清晰。\n\n同时，我进一步检查了这些高频销售表达是否只是话术质量问题，发现“TOP1”“凉快2到3倍”“连开七天七夜不发热”“不会再有这个价”等表达还存在重复性的合规风险。因此在多个问题之间进行优先级比较后，我认为当前最值得优先处理的是：先降低用户的选款和决策成本，同时替换已经形成固定循环的高风险销售话术。' },
  'AI整体诊断报告': { duration:'15 秒', text:'我先从整场直播视角检查主播在产品介绍、价值表达、成交促进、互动答疑、信任建立和售后保障等环节的表现，再结合弹幕判断这些内容是否真正解决了用户需求。本场主播的产品信息输出和成交引导都比较充分，并不存在明显的“无话可说”或产品介绍不足问题。\n\n进一步交叉分析后发现，真正的问题集中在信息组织方式：价格、版本、功能、赠品和促单信息高频重复，但缺少足够稳定的结构，导致用户进入购买阶段后仍需要反复确认SKU和权益。同时部分核心销售话术存在重复性风险。因此整体诊断不应简单归结为“促单不足”，而应重点关注信息结构、用户决策效率、问题承接质量和合规表达四个方向。' },
  'AI弹幕诊断报告': { duration:'11 秒', text:'我先对49条有效弹幕进行语义归类，没有直接把关键词命中次数当作用户真实需求。例如“刚拍了199”虽然包含价格数字，但核心意图是购买确认；“158的有遥控器么”核心也不是价格，而是在确认对应SKU的功能配置。\n\n继续结合弹幕时间与主播后续口播后可以看到，本场用户已经明显进入购买和选款阶段，关注点主要集中在版本选择、功能参数、赠品权益、物流售后和实际使用效果。主播对高度、语音、质保等标准问题回应较好，但对SKU比较、历史订单权益、地区物流和部分复杂问题容易只回答一部分。因此本场弹幕反映出的核心问题不是用户兴趣不足，而是用户已经想买，但仍存在较高的决策确认成本。' },
  'AI话术优化报告': { duration:'13 秒', text:'我没有尝试重写整场直播话术，而是先筛选对用户决策影响最大的原始表达，重点检查产品卖点、用户疑问回应、成交引导和高频重复话术。判断时主要关注四件事：用户能不能快速听懂、有没有明确用户价值、能不能形成购买理由，以及是否能够自然引导下一步行动。\n\n本场比较突出的问题并不是主播表达能力弱，而是部分话术信息密度过高、结论先于证据，并且复杂问题的回答不够直接。例如SKU区别经常分散在多轮介绍中，“凉快2到3倍”等表达又过度依赖强结论。因此优化重点应该是把话术调整为先给结论、再讲差异、用场景解释价值、用演示和事实增强可信度，而不是单纯增加更多销售词。' },
  'AI违规报告': { duration:'14 秒', text:'我先根据风险词库召回疑似问题，但没有把敏感词命中直接判断为违规。例如“七天无理由”“两年质保”“送遥控器”等表达本身可能属于正常商品权益，只有在缺少真实依据或与实际规则不一致时才可能产生风险，因此不能仅凭关键词生成违规结论。\n\n随后结合前后口播语境重新审核高风险片段，最终重点确认了价格承诺、排名宣传、效果夸大和效果保证等问题。其中“TOP1”“凉快2到3倍”“连开七天七夜不发热”等表达在本场多次重复，说明它们已经进入主播固定销售话术，而非偶发口误。因此本场违规优化的重点不是简单屏蔽几个敏感词，而是替换这些反复使用的高风险表达模板，从源头降低下一场直播的重复风险。' }
};

export function Workspace({ video, onBack }) {
  const transcriptAnchorEnabled = false;
  const quickAnalysisEntryEnabled = false;
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:02:40');
  const [videoSeconds, setVideoSeconds] = useState(160);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [centerCollapsed, setCenterCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  // 左右栏按容器比例控制，中栏始终占用剩余空间。
  const [leftWidth, setLeftWidth] = useState(15);
  const [rightWidth, setRightWidth] = useState(30);
  const [compassOpen, setCompassOpen] = useState(false);
  const [selectedCompassPrimary, setSelectedCompassPrimary] = useState('');
  const [selectedCompassSecondary, setSelectedCompassSecondary] = useState('');
  const [highFreqOpen, setHighFreqOpen] = useState(false);
  const [frequencyCategory, setFrequencyCategory] = useState(contentClassification[0].name);
  const [frequencySubcategory, setFrequencySubcategory] = useState('');
  const [sensitiveOn, setSensitiveOn] = useState(false);
  const [selectedWord, setSelectedWord] = useState('');
  const [selectedWordScope, setSelectedWordScope] = useState(null);
  const [inlineHighlight, setInlineHighlight] = useState(null);
  const [linked, setLinked] = useState(true);
  const [linkConfigOpen, setLinkConfigOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [locateHour, setLocateHour] = useState('00');
  const [locateMinute, setLocateMinute] = useState('02');
  const [locateSecond, setLocateSecond] = useState('40');
  const [transcriptAnchorMinute, setTranscriptAnchorMinute] = useState('');
  const [commentPage, setCommentPage] = useState(1);
  const [danmuCompassOpen, setDanmuCompassOpen] = useState(false);
  const [activeDanmuCategory, setActiveDanmuCategory] = useState('');
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
  const [sentQuickPrompts, setSentQuickPrompts] = useState({});
  const [messages, setMessages] = useState([
    { role:'user', text:naturalQuestion, question:naturalQuestion },
    { role:'assistant', text:naturalQuestionReport, markdown:true, reasoning:reasoningByQuestion[naturalQuestion].text, duration:reasoningByQuestion[naturalQuestion].duration, question:naturalQuestion }
  ]);
  const dragRef = useRef(null);
  const workspaceGridRef = useRef(null);
  const chatScrollRef = useRef(null);
  const inputRef = useRef(null);
  const fabDraggedRef = useRef(false);

  const primaryCompassStats = useMemo(() => contentClassification.map(category => {
    const count = categorizedTranscript.filter(item=>item.contentTags.includes(category.name)).length;
    return {...category,count,percent:Math.round(count / categorizedTranscript.length * 100)};
  }).sort((a,b)=>b.percent-a.percent || b.count-a.count), []);
  const activeCompassPrimary = primaryCompassStats.find(item=>item.name===selectedCompassPrimary) || primaryCompassStats[0];
  const activeCompassSegments = useMemo(() => categorizedTranscript.filter(item=>item.contentTags.includes(activeCompassPrimary.name)), [activeCompassPrimary]);
  const compassSecondaryStats = useMemo(() => activeCompassPrimary.children.map((subcategory,index)=>{
    const items = activeCompassSegments.filter(item=>item.contentMatches.some(hit=>hit.category===activeCompassPrimary.name&&hit.subcategory===subcategory.name));
    return {name:subcategory.name,index,count:items.length,percent:activeCompassSegments.length?Math.round(items.length/activeCompassSegments.length*100):0,items,keywords:subcategory.keywords};
  }), [activeCompassPrimary,activeCompassSegments]);
  const activeCompassSecondaryData = compassSecondaryStats.find(item=>item.name===selectedCompassSecondary);
  const topSecondaryCategories = useMemo(() => contentClassification.flatMap(category=>category.children.map(subcategory=>({
    name:subcategory.name,
    category:category.name,
    count:categorizedTranscript.filter(item=>item.contentMatches.some(hit=>hit.category===category.name&&hit.subcategory===subcategory.name)).length
  }))).sort((a,b)=>b.count-a.count || a.name.localeCompare(b.name)).slice(0,5), []);
  const radarPoints = primaryCompassStats.map((item,index)=>{
    const angle=(-90+index*60)*Math.PI/180;
    const radius=30 + (item.percent/Math.max(...primaryCompassStats.map(stat=>stat.percent),1))*42;
    return { ...item, x:100+Math.cos(angle)*radius, y:94+Math.sin(angle)*radius, labelX:100+Math.cos(angle)*82, labelY:98+Math.sin(angle)*82 };
  });

  const categorySegmentCounts = useMemo(() => Object.fromEntries(categoryOrder.map(category=>[category,categorizedTranscript.filter(item=>item.legacyTags.includes(category)).length])), []);
  const danmuCompass = useMemo(() => {
    const counts=Object.fromEntries(danmuCategoryOrder.map(category=>[category,categorizedComments.filter(item=>item.danmuCategories.includes(category)).length]));
    const total=Object.values(counts).reduce((sum,count)=>sum+count,0);
    return danmuCategoryOrder.map(category=>({category,count:counts[category],percent:total?Math.round(counts[category]/total*100):0}));
  }, []);
  const sensitiveSegmentCount = useMemo(() => categorizedTranscript.filter(item=>item.hasRisk).length, []);
  const keywordStats = useMemo(() => {
    const stats = new Map();
    categorizedTranscript.forEach(item=>item.keywordMatches.forEach(hit=>{
      const key=`${hit.category}::${hit.keyword}`;
      const current=stats.get(key)||{keyword:hit.keyword,category:hit.category,occurrenceCount:0,segmentTimes:new Set()};
      current.occurrenceCount += 1;
      current.segmentTimes.add(item.time);
      stats.set(key,current);
    }));
    return [...stats.values()].map(item=>({...item,segmentCount:item.segmentTimes.size})).sort((a,b)=>b.occurrenceCount-a.occurrenceCount || b.segmentCount-a.segmentCount || a.keyword.localeCompare(b.keyword));
  }, []);
  const activeFrequencyCategory = contentClassification.find(category=>category.name===frequencyCategory) || contentClassification[0];
  const frequencyPrimaryStats = useMemo(() => contentClassification.map(category=>({
    ...category,
    count:categorizedTranscript.filter(item=>item.contentMatches.some(hit=>hit.category===category.name)).length
  })), []);
  const frequencySecondaryStats = useMemo(() => activeFrequencyCategory.children.map(subcategory=>({
    ...subcategory,
    count:categorizedTranscript.filter(item=>item.contentMatches.some(hit=>hit.category===activeFrequencyCategory.name&&hit.subcategory===subcategory.name)).length
  })), [activeFrequencyCategory]);
  const frequencyScopeMatches = useMemo(() => categorizedTranscript.flatMap(item=>item.contentMatches.filter(hit=>hit.category===activeFrequencyCategory.name&&(!frequencySubcategory||hit.subcategory===frequencySubcategory)).map(hit=>({...hit,time:item.time}))), [activeFrequencyCategory,frequencySubcategory]);
  const frequencyScopeSegmentCount = useMemo(() => new Set(frequencyScopeMatches.map(hit=>hit.time)).size, [frequencyScopeMatches]);
  const visibleKeywordStats = useMemo(() => {
    const stats=new Map();
    frequencyScopeMatches.forEach(hit=>{
      const key=`${hit.category}::${hit.subcategory}::${hit.keyword}`;
      const current=stats.get(key)||{keyword:hit.keyword,category:hit.category,subcategory:hit.subcategory,occurrenceCount:0,segmentTimes:new Set()};
      current.occurrenceCount+=1; current.segmentTimes.add(hit.time); stats.set(key,current);
    });
    return [...stats.values()].map(item=>({...item,segmentCount:item.segmentTimes.size})).sort((a,b)=>b.occurrenceCount-a.occurrenceCount||b.segmentCount-a.segmentCount||a.keyword.localeCompare(b.keyword));
  }, [frequencyScopeMatches]);
  const frequencyScopeLabel = frequencySubcategory ? `${activeFrequencyCategory.name} > ${frequencySubcategory}` : activeFrequencyCategory.name;

  const applyFrequencyCategory = category => { setFrequencyCategory(category); setFrequencySubcategory(''); setSelectedWord(''); setSelectedWordScope(null); setActiveTag('全部口播'); setTranscriptPage(1); };
  const toggleFrequencySubcategory = subcategory => { setFrequencySubcategory(current=>current===subcategory?'':subcategory); setSelectedWord(''); setSelectedWordScope(null); setActiveTag('全部口播'); setTranscriptPage(1); };
  const clearFrequencyFilter = () => {
    setSelectedWord('');
    setSelectedWordScope(null);
    setActiveTag('全部口播');
    setTranscriptPage(1);
  };

  const filteredTranscript = useMemo(() => categorizedTranscript.filter(item => {
    const searchOk = !search || item.text.includes(search);
    if (sensitiveOn) return searchOk && item.hasRisk;
    const primaryFilter = primaryCompassStats.find(category=>category.name===activeTag);
    const tagOk = activeTag === '全部口播' || (primaryFilter ? item.contentTags.includes(primaryFilter.name) : item.legacyTags?.includes(activeTag));
    const secondaryOk = !selectedCompassSecondary || !primaryFilter || activeCompassSecondaryData?.items.includes(item);
    const highlightFilters = [];
    if (selectedWord) highlightFilters.push(selectedWordScope ? item.contentMatches.some(hit=>hit.keyword===selectedWord&&hit.category===selectedWordScope.category&&(!selectedWordScope.subcategory||hit.subcategory===selectedWordScope.subcategory)) : item.text.includes(selectedWord));
    const highlightOk = highlightFilters.length === 0 || highlightFilters.some(Boolean);
    return searchOk && tagOk && secondaryOk && highlightOk;
  }), [search, activeTag, selectedWord, selectedWordScope, sensitiveOn, primaryCompassStats, selectedCompassSecondary, activeCompassSecondaryData]);

  const commentPageSize = 50;
  const transcriptPageSize = 30;
  const filteredComments = activeDanmuCategory ? categorizedComments.filter(item=>item.danmuCategories.includes(activeDanmuCategory)) : categorizedComments;
  const visibleComments = filteredComments.slice((commentPage-1)*commentPageSize,commentPage*commentPageSize);
  const visibleTranscript = filteredTranscript.slice((transcriptPage-1)*transcriptPageSize,transcriptPage*transcriptPageSize);
  const commentPages = Math.max(1,Math.ceil(filteredComments.length/commentPageSize));
  const transcriptPages = Math.max(1,Math.ceil(filteredTranscript.length/transcriptPageSize));
  const transcriptAnchorTimes = useMemo(() => Array.from({length:Math.floor(toSeconds(videoDuration)/300)+1},(_,index)=>toTime(index*300)),[]);

  const jumpToTime = value => {
    const safe = /^\d{2}:\d{2}:\d{2}$/.test(value) ? value : '00:00:00';
    const seconds = Math.min(toSeconds(videoDuration),toSeconds(safe));
    const target = toTime(seconds); const [h,m,s] = target.split(':');
    setVideoSeconds(seconds); setCurrentTime(target); setLocateHour(h); setLocateMinute(m); setLocateSecond(s);
  };

  const handleVideoProgress = event => {
    const value = Number(event.currentTarget.value);
    setVideoSeconds(value);
    if (linked) { const target=toTime(value); const [h,m,s]=target.split(':'); setCurrentTime(target); setLocateHour(h); setLocateMinute(m); setLocateSecond(s); }
  };

  const nearestTranscriptTime = categorizedTranscript.reduce((best,item)=>Math.abs(toSeconds(item.time)-toSeconds(currentTime))<Math.abs(toSeconds(best)-toSeconds(currentTime))?item.time:best,categorizedTranscript[0].time);
  const nearestCommentTime = comments.reduce((best,item)=>Math.abs(toSeconds(item.time)-toSeconds(currentTime))<Math.abs(toSeconds(best)-toSeconds(currentTime))?item.time:best,comments[0].time);

  const renderText = (text, item) => {
    const activePrimaryFilter = primaryCompassStats.find(category=>category.name===activeTag);
    const categoryMatches = selectedWord
      ? selectedWordScope
        ? item.contentMatches.filter(hit=>hit.keyword===selectedWord&&hit.category===selectedWordScope.category&&(!selectedWordScope.subcategory||hit.subcategory===selectedWordScope.subcategory)).map(hit=>({...hit,kind:'category'}))
        : item.keywordMatches.filter(hit=>hit.keyword===selectedWord).map(hit=>({...hit,kind:'category'}))
      : activePrimaryFilter
        ? item.contentMatches.filter(hit=>hit.category===activePrimaryFilter.name && (!selectedCompassSecondary || hit.subcategory===selectedCompassSecondary)).map(hit=>({...hit,kind:'category'}))
        : activeTag!=='全部口播' ? item.keywordMatches.filter(hit=>hit.category===activeTag).map(hit=>({...hit,kind:'category'})) : [];
    const riskMatches=sensitiveOn ? item.riskMatches.map(hit=>({...hit,kind:'risk'})) : [];
    const inlineMatches=inlineHighlight?.time===item.time ? (inlineHighlight.type==='risk'?item.riskMatches.map(hit=>({...hit,kind:'risk'})):item.contentMatches.filter(hit=>hit.category===inlineHighlight.value||hit.subcategory===inlineHighlight.value).map(hit=>({...hit,kind:'category'}))) : [];
    const matches=[...riskMatches,...categoryMatches,...inlineMatches].sort((a,b)=>(a.kind==='risk'?0:1)-(b.kind==='risk'?0:1) || (b.end-b.start)-(a.end-a.start) || a.start-b.start).reduce((accepted,hit)=>accepted.some(item=>hit.start<item.end&&item.start<hit.end)?accepted:[...accepted,hit],[]).sort((a,b)=>a.start-b.start);
    if(!matches.length && !search) return text;
    const parts=[]; let cursor=0;
    matches.forEach((hit,index)=>{ if(hit.start>cursor) parts.push(text.slice(cursor,hit.start)); parts.push(<mark className={hit.kind==='risk'?'sensitive-mark':'category-mark'} key={`${hit.start}-${index}`}>{text.slice(hit.start,hit.end)}</mark>); cursor=hit.end; });
    if(cursor<text.length) parts.push(text.slice(cursor));
    return parts;
  };

  const renderDanmuText = item => {
    const matches = activeDanmuCategory ? item.danmuMatches.filter(match=>match.category===activeDanmuCategory) : [];
    if(!matches.length) return item.text;
    const parts=[]; let cursor=0;
    matches.forEach((match,index)=>{if(match.start>cursor)parts.push(item.text.slice(cursor,match.start));parts.push(<mark className="danmu-mark" key={`${match.start}-${index}`}>{item.text.slice(match.start,match.end)}</mark>);cursor=match.end;});
    if(cursor<item.text.length)parts.push(item.text.slice(cursor));
    return parts;
  };

  const renderMarkdown = source => {
    const lines=source.replace(/\\([#*_\-|])/g,'$1').replace(/\r/g,'').split('\n');
    const blocks=[]; let index=0;
    const inline = (value,key) => {
      const segments=value.split(/(\*\*[^*]+\*\*)/g);
      return segments.map((segment,i)=>segment.startsWith('**')&&segment.endsWith('**')?<strong key={`${key}-${i}`}>{segment.slice(2,-2)}</strong>:segment);
    };
    while(index<lines.length){
      const line=lines[index].trim();
      if(!line){index+=1;continue;}
      if(/^#{1,3}\s/.test(line)){const level=line.match(/^#+/)[0].length;const Tag=`h${level}`;blocks.push(<Tag key={index}>{inline(line.replace(/^#{1,3}\s/,''),index)}</Tag>);index+=1;continue;}
      if(/^[-*]\s+/.test(line)){const items=[];while(index<lines.length&&/^[-*]\s+/.test(lines[index].trim())){items.push(<li key={index}>{inline(lines[index].trim().replace(/^[-*]\s+/,''),index)}</li>);index+=1;}blocks.push(<ul key={`list-${index}`}>{items}</ul>);continue;}
      if(/^\d+\.\s+/.test(line)){const items=[];while(index<lines.length&&/^\d+\.\s+/.test(lines[index].trim())){items.push(<li key={index}>{inline(lines[index].trim().replace(/^\d+\.\s+/,''),index)}</li>);index+=1;}blocks.push(<ol key={`list-${index}`}>{items}</ol>);continue;}
      if(/^>\s?/.test(line)){blocks.push(<blockquote key={index}>{inline(line.replace(/^>\s?/,''),index)}</blockquote>);index+=1;continue;}
      if(/^---+$/.test(line)){blocks.push(<hr key={index}/>);index+=1;continue;}
      if(line.includes('|')){let divider=index+1;while(divider<lines.length&&!lines[divider].trim())divider+=1;if(divider<lines.length&&/^\s*\|?\s*:?-{2,}/.test(lines[divider].trim())){const cells=line.split('|').filter(Boolean).map(value=>value.trim());const columnCount=cells.length;const gridColumns=columnCount===2?'minmax(0,28fr) minmax(0,72fr)':`minmax(0,${columnCount===3?24:columnCount===4?20:18}fr) ${Array.from({length:columnCount-1},()=>`minmax(0,${(100-(columnCount===3?24:columnCount===4?20:18))/(columnCount-1)}fr)`).join(' ')}`;index=divider+1;const rows=[];while(index<lines.length){if(!lines[index].trim()){index+=1;continue;}if(!lines[index].includes('|'))break;rows.push(lines[index].split('|').filter(Boolean).map(value=>value.trim()));index+=1;}blocks.push(<div className={`report-table-wrap columns-${columnCount}`} key={`table-${index}`}><div className="report-grid" style={{gridTemplateColumns:gridColumns}}>{cells.map((cell,i)=><div className="report-grid-cell head" key={`head-${i}`}>{cell}</div>)}{rows.flatMap((row,rowIndex)=>cells.map((_,columnIndex)=><div className="report-grid-cell" key={`${rowIndex}-${columnIndex}`}>{inline(row[columnIndex]||'',`${rowIndex}-${columnIndex}`)}</div>))}</div></div>);continue;}}
      const paragraph=[];while(index<lines.length&&lines[index].trim()&&!/^#{1,3}\s|^[-*]\s+|^\d+\.\s+|^>\s?|^---+$/.test(lines[index].trim())){paragraph.push(lines[index].trim());index+=1;}blocks.push(<p key={`p-${index}`}>{inline(paragraph.join(' '),index)}</p>);
    }
    return blocks;
  };

  const startResize = (edge, event) => {
    event.preventDefault();
    const grid = workspaceGridRef.current;
    const availableWidth = Math.max(1, (grid?.getBoundingClientRect().width ?? window.innerWidth) - 12);
    dragRef.current = { edge, startX:event.clientX, availableWidth, left:leftWidth, right:rightWidth };
    const move = e => {
      const delta = e.clientX - dragRef.current.startX;
      const deltaPercent = delta / dragRef.current.availableWidth * 100;
      if (edge === 'left') setLeftWidth(Math.max(10, Math.min(80 - dragRef.current.right, dragRef.current.left + deltaPercent)));
      else setRightWidth(Math.max(20, Math.min(80 - dragRef.current.left, dragRef.current.right - deltaPercent)));
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
    const report=reportByQuestion[question];
    const reasoning=reasoningByQuestion[question]||{duration:'12 秒',text:'已提取与该问题相关的口播片段、观众反馈和内容分类，按风险、转化影响与可执行性排序后形成建议。'};
    setMessages(list => [...list,{role:'user',text:question,question},{role:'assistant',text:report||'已基于整场口播、弹幕和内容分类完成分析。建议先处理高风险表达，再围绕“卖点—权益—行动指令”重组当前话术节奏。',markdown:Boolean(report),reasoning:reasoning.text,duration:reasoning.duration,question}]);
    if (fromQuickAnalysis) setUsedQuestions(items=>({...items,[question]:true}));
    setInput(''); setFollowupReference(null); setAnalysisOpen(false);
  };

  const submitInput = () => { if (input.trim()) sendQuestion(input.trim()); };
  const copyAnswer = async (text,index) => { try { await navigator.clipboard?.writeText(text); } finally { setCopiedIndex(index); setTimeout(()=>setCopiedIndex(-1),1600); } };
  const scrollToLatest = () => { const node=chatScrollRef.current; if(node){node.scrollTo({top:node.scrollHeight,behavior:'smooth'});setShowScrollBottom(false);} };
  const handleChatScroll = event => { const node=event.currentTarget; setShowScrollBottom(node.scrollHeight-node.scrollTop-node.clientHeight>32); const top=node.getBoundingClientRect().top; const userMessages=[...node.querySelectorAll('.message.user[data-question]')]; let current=userMessages[0]; userMessages.forEach(item=>{if(item.getBoundingClientRect().top<=top+52) current=item;}); if(current?.dataset.question) setActiveAnchor(current.dataset.question); };
  const beginFabDrag = event => { if(event.button!==0) return; const panel=event.currentTarget.closest('.ai-panel'); const rect=panel.getBoundingClientRect(); const start={x:event.clientX,y:event.clientY,left:event.currentTarget.getBoundingClientRect().left-rect.left,top:event.currentTarget.getBoundingClientRect().top-rect.top}; fabDraggedRef.current=false; const move=e=>{const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)+Math.abs(dy)>3)fabDraggedRef.current=true;setFabPosition({left:Math.max(8,Math.min(rect.width-104,start.left+dx)),top:Math.max(66,Math.min(rect.height-42,start.top+dy))});}; const up=()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',up);}; window.addEventListener('pointermove',move);window.addEventListener('pointerup',up); };
  const saveSessionName = index => { const next=sessionDraft.trim(); if(next) setSessionNames(items=>items.map((item,i)=>i===index?next:item)); setEditingSession(-1); };
  const gridStyle = {
    '--left-column': leftCollapsed ? '48px' : `${leftWidth}fr`,
    gridTemplateColumns: `${leftCollapsed ? '48px' : `minmax(0,${leftWidth}fr)`} 6px ${centerCollapsed ? '48px' : rightCollapsed ? 'minmax(0,1fr)' : `minmax(0,${100-leftWidth-rightWidth}fr)`} 6px ${rightCollapsed ? '48px' : centerCollapsed ? 'minmax(430px,1fr)' : `minmax(0,${rightWidth}fr)`}`
  };

  return <div className="workspace-shell">
    <header className="ws-topbar"><Brand/><nav>{['首页','兴趣电商','一类电商','直播','退货','财务','广告','库存','订单','店铺','弹幕'].map(i=><button className={i==='直播'?'active':''} key={i}>{i}{['兴趣电商','一类电商'].includes(i)&&<CaretDownFilled/>}</button>)}</nav><div className="ws-user"><span>陈</span>陈旭光<DownOutlined/></div></header>
    <section className="workspace-header"><button className="back" onClick={onBack}><ArrowLeftOutlined/>返回列表</button><div className="video-switch"><button onClick={()=>setVideoSwitchOpen(v=>!v)}><h1>{selectedVideo.name}</h1><DownOutlined/></button>{videoSwitchOpen&&<div>{reviewVideos.map(item=><button className={item.name===selectedVideo.name?'active':''} key={item.name} onClick={()=>{setSelectedVideo(item);setVideoSwitchOpen(false)}}><strong>{item.name}</strong><span>{item.account}</span></button>)}</div>}</div><div className="title"><span className="ws-status">分析完成</span></div><div className="meta"><span>{selectedVideo.account}</span><i></i><span>李嘉珂</span><i></i><span>创维静享驱蚊空气循环扇</span><i></i><span>{videoDuration.slice(3)}</span><i></i><span>口播 11,806 字</span><span className="speech-speed">口播速度 308 字/分钟 <span className="speed-help"><ExclamationCircleOutlined/><span className="speed-tooltip">口播速度 = 口播总字数 ÷ 实际说话总时长；静默、音乐和无口播区间不计入说话时长。</span></span></span></div><div className="link-config"><button className={linked?'active':''} onClick={()=>{setLinkConfigOpen(v=>!v);setMoreMenuOpen(false)}}><LinkOutlined/>联动配置</button>{linkConfigOpen&&<div><label><input type="checkbox" checked={linked} onChange={e=>setLinked(e.target.checked)}/><span>视频、口播与弹幕时间联动</span></label><small>开启后，拖动视频或点击时间戳将同步定位三类内容。</small></div>}</div><div className="workspace-more"><button className="ws-more" aria-label="更多功能" onClick={()=>{setMoreMenuOpen(v=>!v);setLinkConfigOpen(false)}}><MoreOutlined/></button>{moreMenuOpen&&<div className="workspace-more-menu"><button disabled><strong>导出话术</strong><span>暂未开放</span></button></div>}</div></section>
    <div ref={workspaceGridRef} className={'workspace-grid '+(centerCollapsed?'center-collapsed':'')} style={gridStyle}>
      <aside className={'video-panel '+(leftCollapsed?'collapsed':'')}>
        <button className="collapse-btn" aria-label={leftCollapsed?'展开视频与弹幕':'收起视频与弹幕'} onClick={()=>setLeftCollapsed(v=>!v)}>{leftCollapsed?<MenuUnfoldOutlined/>:<MenuFoldOutlined/>}</button>
        {leftCollapsed ? <span className="vertical-label">视频与弹幕</span> : <><div className="panel-title"><strong>直播画面</strong><span>原始证据</span></div><div className="portrait-video"><img className="live-frame" src="/untitle.png" alt="直播画面"/><div className="video-controls"><button className="play-main" aria-label={playing?'暂停':'播放'} onClick={()=>setPlaying(v=>!v)}>{playing?<PauseCircleFilled/>:<PlayCircleFilled/>}</button><span>{toTime(videoSeconds)}</span><input aria-label="视频播放进度" type="range" min="0" max={toSeconds(videoDuration)} value={Math.min(videoSeconds,toSeconds(videoDuration))} onInput={handleVideoProgress} onChange={handleVideoProgress}/><span>{videoDuration.slice(3)}</span></div></div><div className="comment-head"><strong>弹幕</strong><span>识别 {comments.length} 条</span><div className="comment-tools"><button className={'danmu-compass-trigger '+(danmuCompassOpen?'active':'')} onClick={()=>setDanmuCompassOpen(open=>!open)}>弹幕分类 <CaretDownFilled/></button><button className="comment-search"><SearchOutlined/></button></div></div>{danmuCompassOpen&&<section className="danmu-compass"><header><div><strong>弹幕分类</strong><span>按关键词命中的弹幕分类</span></div><button aria-label="关闭弹幕分类" onClick={()=>setDanmuCompassOpen(false)}><CloseOutlined/></button></header><div>{danmuCompass.map(item=><button key={item.category} className={activeDanmuCategory===item.category?'active':''} onClick={()=>{setActiveDanmuCategory(category=>category===item.category?'':item.category);setCommentPage(1);setDanmuCompassOpen(false)}}><span>{item.category}</span><em>{item.percent}% · {item.count}</em></button>)}</div></section>}<div className="comment-list">{visibleComments.map((item,index)=><button title={`弹幕时间 ${item.time}`} key={`${item.time}-${item.user}-${index}`} onClick={()=>{setVideoSeconds(toSeconds(item.time));if(linked){const [h,m,s]=item.time.split(':');setCurrentTime(item.time);setLocateHour(h);setLocateMinute(m);setLocateSecond(s)}}} className={nearestCommentTime===item.time?'active':''}><span className="comment-level">Lv.{item.level}</span><strong>{item.user}</strong><em>{renderDanmuText(item)}</em></button>)}</div><div className="evidence-pagination"><button disabled={commentPage===1} onClick={()=>setCommentPage(p=>p-1)}><LeftOutlined/></button><span>{commentPage}/{commentPages}</span><button disabled={commentPage===commentPages} onClick={()=>setCommentPage(p=>p+1)}><DownOutlined/></button></div></>}
      </aside>
      <div className="resizer" role="separator" aria-label="调整视频栏宽度" aria-orientation="vertical" onMouseDown={e=>startResize('left',e)}></div>
      <main className={'transcript-panel '+(centerCollapsed?'collapsed':'')}>
        <button className="collapse-btn" aria-label={centerCollapsed?'展开口播与内容分析':'收起口播与内容分析'} onClick={()=>setCenterCollapsed(v=>{const next=!v;if(next)setRightCollapsed(false);return next;})}>{centerCollapsed?<MenuUnfoldOutlined/>:<MenuFoldOutlined/>}</button>
        {centerCollapsed ? <span className="vertical-label">口播与内容分析</span> : <><div className="transcript-toolbar"><div className="toolbar-locate"><strong>口播稿</strong><span className="locator-label"><SwapOutlined/>快速定位</span><input aria-label="小时" type="number" min="0" max="99" value={locateHour} onFocus={e=>e.currentTarget.select()} onChange={e=>setLocateHour(e.target.value)}/><b>:</b><input aria-label="分钟" type="number" min="0" max="59" value={locateMinute} onFocus={e=>e.currentTarget.select()} onChange={e=>setLocateMinute(e.target.value)}/><b>:</b><input aria-label="秒" type="number" min="0" max="59" value={locateSecond} onFocus={e=>e.currentTarget.select()} onChange={e=>setLocateSecond(e.target.value)}/><button onClick={()=>jumpToTime(`${String(locateHour).padStart(2,'0')}:${String(locateMinute).padStart(2,'0')}:${String(locateSecond).padStart(2,'0')}`)}>跳转</button></div><div className="analysis-actions"><div className="transcript-search"><button aria-label="搜索口播稿" className={searchOpen||search?'active':''} onClick={()=>setSearchOpen(v=>!v)}><SearchOutlined/></button>{searchOpen&&<div className="transcript-search-popover"><SearchOutlined/><input autoFocus placeholder="搜索全部口播" value={search} onChange={event=>{setSearch(event.target.value);setTranscriptPage(1)}}/><button onClick={()=>{setSearch('');setSearchOpen(false);setTranscriptPage(1)}}>清空</button></div>}</div><button className={'compass-toggle '+(compassOpen?'active':'')} onClick={()=>{setCompassOpen(v=>!v);setHighFreqOpen(false)}}>内容分类 <CaretDownFilled/></button><button className={highFreqOpen||selectedWord?'active':''} onClick={()=>{setHighFreqOpen(v=>!v);setCompassOpen(false)}}>高频词{selectedWord&&<em>1</em>}</button><button className={sensitiveOn?'active':''} onClick={()=>{setSensitiveOn(v=>!v);setTranscriptPage(1)}}>敏感词 <em>{sensitiveSegmentCount}</em></button></div></div>
        {compassOpen && <section className="compass-panel compass-panel-v2"><header><div><strong>内容分类</strong><span>基于关键词命中的口播内容构成</span></div><button onClick={()=>setCompassOpen(false)}>收起 <CaretDownFilled/></button></header><section className="primary-overview"><strong className="compass-section-title">一级分类总览</strong><div className="primary-overview-main"><div className="radar-wrap"><svg viewBox="0 0 200 188" role="img" aria-label="六维内容分类雷达图"><title>六维内容分类雷达图</title>{[28,46,64].map(radius=><polygon key={radius} className="radar-grid" points={Array.from({length:6},(_,index)=>{const angle=(-90+index*60)*Math.PI/180;return `${100+Math.cos(angle)*radius},${94+Math.sin(angle)*radius}`}).join(' ')}/>)}{radarPoints.map(point=><line className="radar-axis" key={`axis-${point.name}`} x1="100" y1="94" x2={point.labelX} y2={point.labelY}/>)}<polygon className="radar-shape" points={radarPoints.map(point=>`${point.x},${point.y}`).join(' ')}/>{radarPoints.map(point=><g className="radar-node" key={point.name} onClick={()=>{setSelectedCompassPrimary(point.name);setSelectedCompassSecondary('');setActiveTag(point.name);setTranscriptPage(1)}}><title>{`${point.name}：${point.percent}% · ${point.count} 条`}</title><circle cx={point.x} cy={point.y} r="3" fill={point.color}/><text x={point.labelX} y={point.labelY} textAnchor={point.labelX<88?'end':point.labelX>112?'start':'middle'}>{point.name}</text></g>)}</svg></div><div className="primary-category-list">{primaryCompassStats.map(category=><button key={category.name} className={activeCompassPrimary.name===category.name?'active':''} onClick={()=>{setSelectedCompassPrimary(category.name);setSelectedCompassSecondary('');setActiveTag(category.name);setSelectedWord('');setTranscriptPage(1)}}><span className="primary-dot" style={{background:category.color}}></span><strong>{category.name}</strong><em>{category.percent}% · {category.count}</em><i><b style={{width:`${Math.min(100,category.percent*3)}%`,background:category.color}}></b></i></button>)}</div></div></section><section className="secondary-overview"><strong className="compass-section-title">二级分类明细</strong><div className="secondary-current">当前分类：<b>{activeCompassPrimary.name}</b><span>共命中 {activeCompassPrimary.count} 条 · 占全部口播 {activeCompassPrimary.percent}%</span></div><div className="secondary-category-list">{compassSecondaryStats.map(item=><button title={`${item.name}\n典型命中词：${item.keywords.slice(0,6).map(keyword=>keyword.keyword).join('、') || '暂无命中词'}`} className={selectedCompassSecondary===item.name?'active':''} key={item.name} onClick={()=>{const isSelected=selectedCompassSecondary===item.name;setSelectedCompassSecondary(isSelected?'':item.name);setActiveTag(activeCompassPrimary.name);setSelectedWord('');setTranscriptPage(1);setCompassOpen(false)}}><strong>{item.name}</strong><em>{item.percent}% · {item.count}</em><i><b style={{width:`${item.percent}%`,background:activeCompassPrimary.color}}></b></i></button>)}</div></section><footer><span>同一条口播可命中多个分类，各分类占比独立计算</span><button onClick={()=>{setSelectedCompassPrimary('');setSelectedCompassSecondary('');setSelectedWord('');setActiveTag('全部口播');setTranscriptPage(1);setCompassOpen(false)}}>清除筛选</button></footer></section>}
        <div className="transcript-quick-locate"><strong>快速定位</strong><div><input aria-label="口播稿快速定位" type="range" min="0" max={toSeconds(videoDuration)} step="60" value={Math.min(videoSeconds,toSeconds(videoDuration))} onChange={event=>jumpToTime(toTime(Number(event.target.value)))}/><span className="current-locate">{toTime(Math.min(videoSeconds,toSeconds(videoDuration))).slice(0,5)}</span><div className="locate-ticks">{['00:00','5min','10min','15min','20min','25min','30min','35min','40min'].map(label=><span key={label}>{label}</span>)}</div></div>
        </div>
{highFreqOpen&&<section className="frequency-panel frequency-panel-v2"><header><div><strong>高频词</strong><span>{frequencyScopeLabel} · {frequencyScopeSegmentCount} 条口播命中</span></div><button onClick={()=>{clearFrequencyFilter();setHighFreqOpen(false)}}>清除关键词筛选</button></header><section className="frequency-classification"><strong>话术分类</strong><div className="frequency-primary-tags" role="tablist" aria-label="高频词一级分类">{frequencyPrimaryStats.map(category=><button key={category.name} role="tab" aria-selected={frequencyCategory===category.name} className={frequencyCategory===category.name?'active':''} onClick={()=>applyFrequencyCategory(category.name)}>{category.name}<b>{category.count}</b></button>)}</div>{activeFrequencyCategory.name!=='问题解答'&&<><strong className="frequency-secondary-title">{activeFrequencyCategory.name}</strong><div className="frequency-secondary-tags" role="tablist" aria-label="高频词二级分类">{frequencySecondaryStats.map(subcategory=><button key={subcategory.name} role="tab" aria-selected={frequencySubcategory===subcategory.name} className={frequencySubcategory===subcategory.name?'active':''} onClick={()=>toggleFrequencySubcategory(subcategory.name)}>{subcategory.name}<b>{subcategory.count}</b></button>)}</div></>}</section><div className="frequency-list-head"><strong>高频关键词</strong><span>出现次数 <DownOutlined/></span></div><div className="frequency-keyword-grid">{visibleKeywordStats.length?visibleKeywordStats.map(item=><button title={`出现${item.occurrenceCount}次，涉及${item.segmentCount}条口播`} className={selectedWordScope&&selectedWord===item.keyword&&selectedWordScope.category===item.category&&selectedWordScope.subcategory===item.subcategory?'active':''} key={`${item.category}-${item.subcategory}-${item.keyword}`} onClick={()=>{const isSelected=selectedWord===item.keyword&&selectedWordScope?.category===item.category&&selectedWordScope?.subcategory===item.subcategory;if(isSelected){clearFrequencyFilter()}else{setActiveTag('全部口播');setSelectedWord(item.keyword);setSelectedWordScope({category:item.category,subcategory:item.subcategory});setTranscriptPage(1)}setHighFreqOpen(false)}}><strong>{item.keyword}</strong><span>{item.occurrenceCount}次</span></button>):<div className="frequency-empty">该分类暂无命中关键词</div>}</div></section>}
        <div className="locate-strip"><button className={activeTag==='全部口播'?'active':''} onClick={()=>{setActiveTag('全部口播');setSelectedCompassPrimary('');setSelectedCompassSecondary('');setSelectedWord('');setSelectedWordScope(null);setTranscriptPage(1)}}>全部口播</button>{topSecondaryCategories.map(item=><button key={`${item.category}-${item.name}`} className={activeTag===item.category&&selectedCompassSecondary===item.name?'active':''} onClick={()=>{setSelectedCompassPrimary(item.category);setSelectedCompassSecondary(item.name);setActiveTag(item.category);setSelectedWord('');setSelectedWordScope(null);setTranscriptPage(1)}}>{item.name}</button>)}<span>{selectedWord?<><b>{selectedWordScope?frequencyScopeLabel:frequencyCategory} &gt; {selectedWord}</b> · 共命中 {filteredTranscript.length} 条口播 / 出现 {(selectedWordScope?visibleKeywordStats.find(item=>item.keyword===selectedWord&&item.category===selectedWordScope.category&&item.subcategory===selectedWordScope.subcategory):keywordStats.find(item=>item.keyword===selectedWord&&item.category===frequencyCategory))?.occurrenceCount||0} 次 <button onClick={clearFrequencyFilter}>清除筛选</button></>:<>定位结果 {filteredTranscript.length} 条</>}</span></div>
        <div className="transcript-list">{visibleTranscript.map((item,index)=>{const isMinuteMarker=index===0||visibleTranscript[index-1]?.minute!==item.minute;const toggleInline=(type,value)=>setInlineHighlight(current=>current?.time===item.time&&current.type===type&&current.value===value?null:{time:item.time,type,value});return <article key={item.time} className={nearestTranscriptTime===item.time?'current ':''} onClick={()=>{setVideoSeconds(toSeconds(item.time));if(linked){const [h,m,s]=item.time.split(':');setCurrentTime(item.time);setLocateHour(h);setLocateMinute(m);setLocateSecond(s)}}}><div className="minute minute-anchor" onMouseEnter={()=>transcriptAnchorEnabled&&isMinuteMarker&&setTranscriptAnchorMinute(item.minute)} onMouseLeave={()=>transcriptAnchorEnabled&&setTranscriptAnchorMinute('')}>{isMinuteMarker?item.minute:''}{transcriptAnchorEnabled&&isMinuteMarker&&transcriptAnchorMinute===item.minute&&<section className="transcript-anchor-popover" onClick={event=>event.stopPropagation()}><strong>点击时间点快速跳转</strong><div className="transcript-anchor-times">{transcriptAnchorTimes.map(time=><button key={time} onClick={()=>{jumpToTime(time);setTranscriptAnchorMinute('')}}>{time.slice(0,5)}</button>)}</div><div className="anchor-quick-locate"><span>快速定位</span><input aria-label="小时" type="number" min="0" max="99" value={locateHour} onFocus={event=>event.currentTarget.select()} onChange={event=>setLocateHour(event.target.value)}/><b>:</b><input aria-label="分钟" type="number" min="0" max="59" value={locateMinute} onFocus={event=>event.currentTarget.select()} onChange={event=>setLocateMinute(event.target.value)}/><b>:</b><input aria-label="秒" type="number" min="0" max="59" value={locateSecond} onFocus={event=>event.currentTarget.select()} onChange={event=>setLocateSecond(event.target.value)}/><button onClick={()=>{jumpToTime(`${String(locateHour).padStart(2,'0')}:${String(locateMinute).padStart(2,'0')}:${String(locateSecond).padStart(2,'0')}`);setTranscriptAnchorMinute('')}}>跳转</button></div></section>}</div><div className="utterance"><div className="utterance-meta"><button>{item.time}</button>{(item.tags.length>0||item.hasRisk)&&<span>{item.tags.map(t=><em className={inlineHighlight?.time===item.time&&inlineHighlight.type==='category'&&inlineHighlight.value===t?'active':''} key={t} onClick={event=>{event.stopPropagation();toggleInline('category',t)}}>{t}</em>)}{item.hasRisk&&<em className={'sensitive-tag '+(inlineHighlight?.time===item.time&&inlineHighlight.type==='risk'?'active':'')} onClick={event=>{event.stopPropagation();toggleInline('risk','敏感')}}>敏感</em>}</span>}</div><p>{renderText(item.text,item)}</p></div></article>})}</div><div className="evidence-pagination transcript-pagination"><button disabled={transcriptPage===1} onClick={()=>setTranscriptPage(p=>p-1)}><LeftOutlined/></button><span>{transcriptPage}/{transcriptPages}</span><button disabled={transcriptPage===transcriptPages} onClick={()=>setTranscriptPage(p=>p+1)}><DownOutlined/></button></div></>}
      </main>
      <div className="resizer" role="separator" aria-label="调整AI助手栏宽度" aria-orientation="vertical" onMouseDown={e=>startResize('right',e)}></div>
      <aside className={'ai-panel '+(rightCollapsed?'collapsed':'')}>
        <header><div><strong>AI复盘助手</strong><span>基于当前视频分析</span></div>{rightCollapsed&&<span className="vertical-label ai-vertical-label">AI复盘助手</span>}<button className="session-btn" onClick={()=>setSessionOpen(v=>!v)}><MessageOutlined/>会话列表<em>{sessionNames.length}</em></button><button aria-label="新建会话"><PlusOutlined/></button><button className="ai-collapse" aria-label={rightCollapsed?'展开AI复盘助手':'收起AI复盘助手'} onClick={()=>{if(centerCollapsed){setRightCollapsed(false);return;}setRightCollapsed(v=>!v);setSessionOpen(false);setAnalysisOpen(false)}}>{rightCollapsed?<MenuFoldOutlined/>:<MenuUnfoldOutlined/>}</button></header>
        {sessionOpen && <div className="session-drawer"><div><strong>会话列表</strong><button aria-label="关闭会话列表" onClick={()=>setSessionOpen(false)}><CloseOutlined/></button></div>{sessionNames.map((name,index)=><div className={'session-item '+(index===0?'active':'')} key={name+index}><div>{editingSession===index?<input autoFocus value={sessionDraft} onChange={e=>setSessionDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')saveSessionName(index);if(e.key==='Escape')setEditingSession(-1)}}/>:<span>{name}</span>}<small>{index===0?'刚刚 · 陈旭光':index===1?'08月09日 · 董佳楠':'08月09日 · 石嘉慧'}</small></div><button aria-label={editingSession===index?'保存会话名称':'编辑会话名称'} onClick={()=>editingSession===index?saveSessionName(index):(setEditingSession(index),setSessionDraft(name))}>{editingSession===index?<CheckOutlined/>:<EditOutlined/>}</button></div>)}</div>}
        {quickAnalysisEntryEnabled&&<button className="analysis-fab" style={fabPosition.left===null?undefined:{left:fabPosition.left,right:'auto',top:fabPosition.top}} onPointerDown={beginFabDrag} onClick={()=>{if(fabDraggedRef.current){fabDraggedRef.current=false;return;}setAnalysisOpen(true)}}><MessageOutlined/><span>快捷分析</span></button>}
        {analysisOpen&&<section className="analysis-drawer"><header><div><strong>快捷分析</strong><span>已生成报告的问题不可重复发送</span></div><button aria-label="关闭快捷分析" onClick={()=>setAnalysisOpen(false)}><CloseOutlined/></button></header><div className="quick-groups">{quickGroups.map(group=><button key={group.name} className={activeGroup===group.name?'active':''} onClick={()=>setActiveGroup(activeGroup===group.name?'':group.name)}>{group.name}</button>)}</div>{activeGroup&&<div className="quick-questions">{quickGroups.find(g=>g.name===activeGroup)?.questions.map(q=>usedQuestions[q]?<button className="used" key={q} onClick={()=>jumpToQuestion(q)}><span>{q}</span><em>已生成 · 查看报告</em></button>:<button key={q} onClick={()=>sendQuestion(q,true)}>{q}<SendOutlined/></button>)}{quickGroups.find(g=>g.name===activeGroup)?.disabled?.map(q=><button className="disabled" key={q} title="需关联直播经营数据，后续开放" disabled>{q}<small>后续开放</small></button>)}</div>}</section>}
        <nav className="conversation-anchors" aria-label="会话锚点" onPointerEnter={()=>setAnchorPopoverOpen(true)} onPointerLeave={()=>setAnchorPopoverOpen(false)}>{messages.filter(msg=>msg.role==='user').map((msg,index)=><button key={msg.question||index} aria-label={`跳转到问题：${msg.text}`} className={activeAnchor===msg.question?'active':''} onClick={()=>jumpToQuestion(msg.question)}><i></i></button>)}<div className={'anchor-popover '+(anchorPopoverOpen?'open':'')}>{messages.filter(msg=>msg.role==='user').map((msg,index)=><button key={msg.question||index} className={activeAnchor===msg.question?'active':''} onClick={()=>jumpToQuestion(msg.question)}><b>Q{index+1}.</b><span>{msg.text}</span></button>)}</div></nav>
        <div className="chat-scroll" ref={chatScrollRef} onScroll={handleChatScroll}>{messages.map((msg,index)=>{const reasoningOpen=msg.role==='assistant'?(expandedReasoning[index]??true):false;return <div data-question={msg.question} className={'message '+msg.role+(focusedQuestion===msg.question?' focused':'')} key={index}>{msg.role==='assistant'&&<div className="bot">AI</div>}<div className="bubble">{msg.role==='assistant'&&<div className="reasoning"><button onClick={()=>setExpandedReasoning(items=>({...items,[index]:!reasoningOpen}))}><strong>已深度思考（用时 {msg.duration}）</strong><CaretDownFilled className={reasoningOpen?'open':''}/></button>{reasoningOpen&&<p>{msg.reasoning}</p>}</div>}<div className={'answer-text '+(msg.markdown?'markdown-answer':'')}>{msg.markdown?renderMarkdown(msg.text):msg.text}</div>{msg.role==='assistant'&&<div className="feedback"><div><button onClick={()=>copyAnswer(msg.text,index)}><CopyOutlined/>{copiedIndex===index?'已复制':'复制'}</button><button>有帮助</button><button>没帮助</button><button onClick={()=>{setFollowupReference({text:msg.text,question:msg.question});setInput('');inputRef.current?.focus()}}>进一步提问</button></div><button className="export-answer">导出</button></div>}</div></div>})}</div>
        {showScrollBottom&&<button className="scroll-latest" aria-label="回到最新对话" onClick={scrollToLatest}><DownOutlined/></button>}
        {followupReference&&<div className="followup-reference"><button title="定位到被引用的回答" onClick={()=>jumpToQuestion(followupReference.question)}><span>追问引用：{followupReference.text}</span></button><button aria-label="取消引用回答" onClick={()=>{setFollowupReference(null);setInput('')}}><CloseOutlined/></button><small>围绕当前引用的回答继续提问...</small></div>}
        <footer className="chat-input"><div className="identity"><button><UserOutlined/>运营复盘专家<DownOutlined/></button><span>当前会话身份</span></div><div className="assistant-quick-prompts">{['AI整体诊断报告','AI话术优化报告','AI弹幕诊断报告','AI违规报告'].map(question=>sentQuickPrompts[question]?<div className="used" key={question}><span>{question}</span><i>·</i><button onClick={()=>jumpToQuestion(question)}>查看</button></div>:<button key={question} onClick={()=>{setSentQuickPrompts(items=>({...items,[question]:true}));sendQuestion(question)}}>{question}</button>)}</div><div className="input-box"><textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} placeholder="围绕当前直播自由提问，支持询问指定时间…" onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();submitInput()}}}></textarea><div><button><SettingOutlined/>引用整场</button><span>{input.length}/2000</span><button className="send" disabled={!input.trim()} onClick={submitInput}><SendOutlined/></button></div></div><small>AI生成内容可能存在误差，请结合原始视频人工核对</small></footer>
      </aside>
    </div>
  </div>;
}

