import { useMemo, useState } from 'react';
import { CaretDownFilled, CaretUpFilled, DeleteOutlined, DownloadOutlined, EditOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Workspace } from './Workspace.jsx';
import { RoomDetail } from './RoomDetail.jsx';

const initialRows = [
  { id: 1, name: '海尔洗衣机专场复盘', file: '2026-08-09_海尔洗衣机晚场.mp4', mode: '自有直播', account: '海尔宛瑾专卖店', anchor: '董佳楠、石嘉慧', product: '海尔云溪洗烘套装', duration: '02:46:38', status: '分析完成', progress: 100, uploaded: '2026/08/09 23:18', reports: 6 },
  { id: 2, name: '康佳吸尘器竞品话术复盘', file: '康佳无线吸尘器直播录屏.mov', mode: '竞品直播', account: '康佳宇盈专卖店', anchor: '竞品主播A', product: '康佳无线吸尘器', duration: '01:58:12', status: '部分异常', progress: 100, uploaded: '2026/08/09 20:42', reports: 3, stage: '弹幕抽帧识别异常', detail: '部分视频片段画面模糊，已完成口播稿与内容分析；02:13:00—02:16:20 的弹幕未能识别。', retryStage: '正在识别弹幕' },
  { id: 3, name: '苏泊尔洗地机早场复盘', file: '苏泊尔洗地机_0810早场.mp4', mode: '自有直播', account: '苏泊尔全能机皇洗地机', anchor: '曹婷婷', product: '苏泊尔洗地机A9', duration: '02:23:05', status: '分析中', progress: 68, uploaded: '2026/08/10 08:12', reports: 0, stage: '正在进行音频 ASR 识别' },
  { id: 4, name: '海尔冰箱主播训练复盘', file: '海尔冰箱培训场.mp4', mode: '自有直播', account: '海尔优选旗舰店', anchor: '陈佳佳', product: '海尔零距离自由嵌冰箱', duration: '01:35:47', status: '等待分析', progress: 0, uploaded: '2026/08/10 09:02', reports: 0 },
  { id: 5, name: '美妆竞品促单话术分析', file: '竞品录屏_美妆专场.mkv', mode: '竞品直播', account: '芙丽芳丝官方直播间', anchor: '竞品主播B、竞品主播C', product: '氨基酸洁面套装', duration: '00:52:31', status: '分析失败', progress: 36, uploaded: '2026/08/08 18:33', reports: 0, stage: '音频 ASR 识别失败', detail: '语音识别服务在第 19 分钟请求超时，未生成口播稿及后续内容分析。', retryStage: '正在进行音频 ASR 识别' },
  { id: 6, name: '小熊养生壶午场直播', file: '小熊养生壶_0810午场.mp4', mode: '自有直播', account: '小熊官方旗舰店', anchor: '林小雅', product: '小熊养生壶 YSH-C18', duration: '--:--:--', status: '上传中', progress: 57, uploaded: '刚刚', reports: 0, stage: '正在上传视频' },
  { id: 7, name: '追觅扫地机直播复盘', file: '追觅扫地机_晚场录屏.mp4', mode: '自有直播', account: '追觅官方旗舰店', anchor: '李梦', product: '追觅 X50 Pro', duration: '03:02:16', status: '分析中', progress: 14, uploaded: '2026/08/10 10:04', reports: 0, stage: '正在转码' },
  { id: 8, name: '飞利浦剃须刀竞品分析', file: '飞利浦剃须刀竞品直播.mp4', mode: '竞品直播', account: '飞利浦个护直播间', anchor: '竞品主播D', product: '飞利浦剃须刀 S7886', duration: '01:16:44', status: '分析中', progress: 27, uploaded: '2026/08/10 09:48', reports: 0, stage: '正在进行音频抽离' },
  { id: 9, name: '戴森吹风机晨场复盘', file: '戴森吹风机_0810晨场.mp4', mode: '自有直播', account: '戴森官方旗舰店', anchor: '周可', product: '戴森 Supersonic', duration: '01:42:08', status: '分析中', progress: 82, uploaded: '2026/08/10 09:24', reports: 0, stage: '正在识别弹幕' },
  { id: 10, name: '九阳破壁机直播分析', file: '九阳破壁机直播回放.mp4', mode: '自有直播', account: '九阳厨电旗舰店', anchor: '王晨', product: '九阳破壁机 L18-Y928S', duration: '02:08:30', status: '分析中', progress: 94, uploaded: '2026/08/10 08:55', reports: 0, stage: '正在进行内容分析' },
  { id: 11, name: '美的空调夜场复盘', file: '美的空调夜场_0809.mp4', mode: '自有直播', account: '美的空调旗舰店', anchor: '韩璐', product: '美的风尊科技版', duration: '02:31:12', status: '部分异常', progress: 100, uploaded: '2026/08/09 22:12', reports: 4, stage: '口播稿内容识别异常', detail: '已获得完整转码、音频和弹幕结果；部分口播段落分类置信度低于阈值，未生成内容罗盘。', retryStage: '正在进行内容分析' },
  { id: 12, name: '格力风扇直播回放', file: '格力循环扇直播回放.mp4', mode: '自有直播', account: '格力生活电器旗舰店', anchor: '陈果', product: '格力循环扇 FX-15X', duration: '01:08:39', status: '分析失败', progress: 8, uploaded: '2026/08/09 17:26', reports: 0, stage: '转码失败', detail: '检测到源视频编码参数不受支持，未能生成统一分析格式。', retryStage: '正在转码' },
  { id: 13, name: '松下洗烘套装竞品复盘', file: '松下洗烘套装竞品场.mov', mode: '竞品直播', account: '松下洗护直播间', anchor: '竞品主播E', product: '松下白月光洗烘套装', duration: '01:47:51', status: '分析失败', progress: 21, uploaded: '2026/08/09 15:40', reports: 0, stage: '音频抽离失败', detail: '视频音轨读取中断，未能抽取可供 ASR 识别的音频文件。', retryStage: '正在进行音频抽离' },
];

const tabs = ['全部', '上传中', '等待分析', '分析中', '分析完成', '部分异常', '分析失败'];
const statusTone = { '分析完成': 'success', '部分异常': 'warning', '分析中': 'processing', '等待分析': 'waiting', '分析失败': 'danger', '上传中': 'processing' };

function SortableHeader({ label, field, sortKey, sortDir, onSort }) {
  return <button className="sort-header" onClick={() => onSort(field)}>{label}<span className="sort-arrows"><CaretUpFilled className={sortKey === field && sortDir === 'asc' ? 'selected' : ''}/><CaretDownFilled className={sortKey === field && sortDir === 'desc' ? 'selected' : ''}/></span></button>;
}

function MoreMenu({ row, open, onToggle, onAction }) {
  return <div className="more-wrap"><button onClick={onToggle}>更多</button>{open && <div className="more-menu">
    <button onClick={() => onAction('编辑基础信息')}><EditOutlined/><span>编辑基础信息</span></button>
    <button onClick={() => onAction('下载原视频')}><DownloadOutlined/><span>下载原视频</span></button>
    <i></i>
    <button className="danger" onClick={() => onAction('删除视频')}><DeleteOutlined/><span>删除视频</span></button>
  </div>}</div>;
}

function LogoCrop() {
  return <div className="brand-lockup" aria-label="数智罗盘"><div className="logo-crop"><img src="/source-ui.png" alt="" /></div><strong>数智罗盘</strong></div>;
}

function UploadModal({ onClose, onSubmit }) {
  const [file, setFile] = useState('');
  const [name, setName] = useState('');
  const [anchor, setAnchor] = useState('');
  const [product, setProduct] = useState('');
  const canSubmit = file && name && anchor && product;

  return <div className="modal-mask" onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <section className="upload-modal" role="dialog" aria-modal="true" aria-label="上传直播视频">
      <header><div><h2>上传直播视频</h2><p>上传完成后系统将自动进行口播、弹幕与内容分析</p></div><button className="close" onClick={onClose}>×</button></header>
      <div className="modal-body">
        <div className="field"><label>视频文件 <b>*</b></label><label className={'dropzone ' + (file ? 'has-file' : '')}><input type="file" accept="video/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f.name); if (!name) setName(f.name.replace(/\.[^.]+$/, '')); } }} /><span className="upload-mark">↑</span><strong>{file || '点击或拖拽上传直播视频'}</strong><small>{file ? '文件已就绪，最长支持 3 小时' : '支持 MP4、MOV、FLV、MKV，单个视频最长 3 小时'}</small></label></div>
        <div className="form-grid">
          <div className="field full"><label>复盘名称 <b>*</b></label><input value={name} onChange={e => setName(e.target.value)} placeholder="默认使用文件名称，可修改" maxLength={100}/></div>
          <div className="field"><label>关联主播 <b>*</b></label><select value={anchor} onChange={e => setAnchor(e.target.value)}><option value="">请选择主播，可多选</option><option>董佳楠</option><option>石嘉慧</option><option>曹婷婷</option></select></div>
          <div className="field full"><label>关联主推产品 <b>*</b></label><select value={product} onChange={e => setProduct(e.target.value)}><option value="">请选择产品或“暂无明确主推产品”</option><option>海尔云溪洗烘套装</option><option>苏泊尔洗地机A9</option><option>暂无明确主推产品</option></select></div>
          <div className="field"><label>直播日期</label><input type="date" /></div>
          <div className="field full"><label>备注</label><textarea placeholder="填写仅供内部查看的补充信息，不进入 AI 分析上下文" maxLength={1000}></textarea></div>
        </div>
      </div>
      <footer><span>单次仅上传一个视频，可同时建立多个任务</span><div><button className="secondary" onClick={onClose}>取消</button><button className="primary" disabled={!canSubmit} onClick={() => { onSubmit({ name, file, account: '创维生活电器旗舰店', anchor: anchor || '未填写', product: product || '未填写' }); onClose(); }}>开始上传</button></div></footer>
    </section>
  </div>;
}

function RetryDetailModal({ row, onClose, onRetry }) {
  return <div className="modal-mask" onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <section className="retry-modal" role="dialog" aria-modal="true" aria-label="任务异常详情">
      <header><div><h2>{row.status === '部分异常' ? '任务异常详情' : '任务失败详情'}</h2><p>确认原因后，可从异常环节重新执行，已完成的结果将被保留。</p></div><button className="close" onClick={onClose}>×</button></header>
      <div className="retry-body"><div className="retry-summary"><span className={row.status === '部分异常' ? 'warning' : 'danger'}></span><div><strong>{row.stage}</strong><small>任务进度 {row.progress}% · {row.uploaded}</small></div></div><div className="retry-detail"><strong>问题说明</strong><p>{row.detail}</p></div><div className="retry-detail"><strong>重试范围</strong><p>将从“{row.retryStage}”开始重试；转码、音频、ASR、弹幕识别及内容分析的已完成步骤不会重复执行。</p></div></div>
      <footer><button className="secondary" onClick={onClose}>暂不处理</button><button className="primary" onClick={() => onRetry(row)}>重新提交</button></footer>
    </section>
  </div>;
}

export function App() {
  const [activeTab, setActiveTab] = useState('全部');
  const [status, setStatus] = useState('全部状态');
  const [keyword, setKeyword] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [rows, setRows] = useState(initialRows);
  const [toast, setToast] = useState('');
  const [sortKey, setSortKey] = useState('uploaded');
  const [sortDir, setSortDir] = useState('desc');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [view, setView] = useState('list');
  const [activeVideo, setActiveVideo] = useState(null);
  const [retryRow, setRetryRow] = useState(null);

  const visibleRows = useMemo(() => rows.filter(row => {
    const tabOk = activeTab === '全部' || row.status === activeTab;
    const statusOk = status === '全部状态' || row.status === status;
    const q = keyword.trim().toLowerCase();
    const keywordOk = !q || [row.name,row.file,row.account,row.anchor,row.product].some(v => v.toLowerCase().includes(q));
    return tabOk && statusOk && keywordOk;
  }).sort((a, b) => {
    const normalize = row => sortKey === 'uploaded' ? (row.uploaded === '刚刚' ? '9999/99/99 99:99' : row.uploaded) : sortKey === 'reports' ? row.reports : row.duration;
    const left = normalize(a); const right = normalize(b);
    const result = left > right ? 1 : left < right ? -1 : 0;
    return sortDir === 'asc' ? result : -result;
  }), [rows, activeTab, status, keyword, sortKey, sortDir]);

  const changeSort = field => {
    if (sortKey === field) setSortDir(value => value === 'asc' ? 'desc' : 'asc');
    else { setSortKey(field); setSortDir(field === 'uploaded' ? 'desc' : 'asc'); }
  };

  const notify = text => { setToast(text); setTimeout(() => setToast(''), 2200); };
  const addUpload = values => {
    setRows(prev => [{ id: Date.now(), ...values, duration: '--:--:--', status: '上传中', progress: 18, uploaded: '刚刚', reports: 0 }, ...prev]);
    setActiveTab('全部'); notify('上传任务创建成功，已开始上传');
  };
  const retryTask = row => { setRows(items => items.map(item => item.id === row.id ? {...item, status:'分析中', progress:Math.max(8, Math.min(item.progress, 85)), stage:row.retryStage, detail:undefined, retryStage:undefined} : item)); setRetryRow(null); setActiveTab('全部'); notify('已重新提交任务，将从异常环节继续处理'); };

  if (view === 'workspace') return <Workspace video={activeVideo} onBack={() => setView('list')}/>;
  if (view === 'room') return <RoomDetail onOpenReview={() => setView('list')}/>;

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><LogoCrop /></div>
      <nav>{['首页','兴趣电商','一类电商','直播','退货','财务','广告','库存','订单','店铺','弹幕'].map(item => <button key={item} className={item === '直播' ? 'active' : ''}>{item}{['兴趣电商','一类电商'].includes(item) && <CaretDownFilled/>}</button>)}</nav>
      <div className="profile"><div className="avatar">陈</div><span>陈旭光</span><span className="chev">⌄</span></div>
    </header>
    <main>
      <section className="review-room-summary"><div className="review-room-cover"></div><div className="review-room-basic"><strong>创维静享循环扇A</strong><span>● 抖音</span></div><div className="review-room-kpis"><em>推</em><span>秉方</span><em className="green">目标</em><span>5.04</span><em className="orange">考核</em><span>4.70</span><em className="pink">盈亏</em><span>4.55</span></div><div className="review-room-account"><i>SKYWORTH<br/>直播中</i><div><strong>创维生活电器旗舰店</strong><span>抖音号：79108397655</span></div></div></section>
      <section className="review-room-tabs"><div>{['当日投产','引流分析','直播分析','直播场次','直播榜单'].map(tab=><button key={tab}>{tab}</button>)}<button onClick={() => setView('room')}>时段分析</button><button className="active">AI直播复盘</button></div><button className="primary review-upload" onClick={() => setShowUpload(true)}>＋ 上传视频</button></section>
      <section className="page-card">
        <div className="filter-panel">
          <div className="filter-row">
            <label className="search"><input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="搜索复盘名称、文件、主播或产品"/></label>
            <label><select value={status} onChange={e => setStatus(e.target.value)}><option>全部状态</option>{tabs.slice(1).map(t => <option key={t}>{t}</option>)}</select></label>
            <label><div className="date-range">2026/08/01 <i>至</i> 2026/08/10</div></label>
            <div className="filter-actions"><button className="primary" onClick={() => notify(`已找到 ${visibleRows.length} 条记录`)}>查询</button><button className="secondary" onClick={() => { setKeyword(''); setStatus('全部状态'); setActiveTab('全部'); }}>重置</button></div>
          </div>
        </div>
        <div className="status-tabs">{tabs.map(t => <button key={t} className={activeTab === t ? 'active' : ''} onClick={() => setActiveTab(t)}>{t}<em>{t === '全部' ? rows.length : rows.filter(r => r.status === t).length}</em></button>)}</div>
        <div className="table-toolbar"><span>共 <b>{visibleRows.length}</b> 个视频任务</span><div><button className="secondary" onClick={() => notify('列表已刷新')}>刷新</button></div></div>
        <div className="table-wrap"><table><thead><tr><th className="review">复盘视频</th><th>关联信息</th><th><SortableHeader label="视频时长" field="duration" sortKey={sortKey} sortDir={sortDir} onSort={changeSort}/></th><th>分析状态</th><th><SortableHeader label="上传时间" field="uploaded" sortKey={sortKey} sortDir={sortDir} onSort={changeSort}/></th><th><SortableHeader label="AI报告" field="reports" sortKey={sortKey} sortDir={sortDir} onSort={changeSort}/></th><th className="ops">操作</th></tr></thead><tbody>
          {visibleRows.map(row => <tr key={row.id}><td><div className="video-cell"><div className="thumb"></div><div><strong title={row.name}>{row.name}</strong><small title={row.file}>{row.file}</small></div></div></td><td><div className="info-stack"><strong>{row.account}</strong><span>主播：{row.anchor}</span><span>产品：{row.product}</span></div></td><td>{row.duration}</td><td><div className={'status ' + statusTone[row.status]}><span></span>{row.status}</div>{['上传中','分析中'].includes(row.status) && <div className="progress"><i style={{width: row.progress+'%'}}></i><small>{row.progress}% · {row.stage}</small></div>}{['部分异常','分析失败'].includes(row.status) && <small className={'status-note '+(row.status === '分析失败' ? 'danger-text' : '')}>{row.stage}</small>}</td><td>{row.uploaded}</td><td><b>{row.reports || '--'}</b></td><td><div className="operation-list">{['分析完成','部分异常'].includes(row.status) && <button onClick={() => { setActiveVideo(row); setView('workspace'); }}>进入复盘</button>}{['分析失败','部分异常'].includes(row.status) && <button onClick={() => setRetryRow(row)}>重试</button>}<MoreMenu row={row} open={openMenuId === row.id} onToggle={() => setOpenMenuId(openMenuId === row.id ? null : row.id)} onAction={action => { setOpenMenuId(null); notify(`${action}：${row.name}`); }}/></div></td></tr>)}
          {visibleRows.length === 0 && <tr><td colSpan="7"><div className="empty"><strong>没有找到匹配的视频</strong><span>调整筛选条件，或上传一段新的直播视频</span><button className="primary" onClick={() => setShowUpload(true)}>上传视频</button></div></td></tr>}
        </tbody></table></div>
        <div className="pagination"><div className="page-summary">共 {visibleRows.length} 条</div><div className="page-size"><select><option>10条/页</option><option>20条/页</option><option>50条/页</option></select></div><div className="page-numbers"><button className="page-arrow" onClick={() => notify('当前已经是第一页')}><LeftOutlined/></button><button className="page-number active">1</button><button className="page-arrow" onClick={() => notify('当前已经是最后一页')}><RightOutlined/></button></div><div className="page-jump"><span>前往</span><input defaultValue="1" inputMode="numeric"/><span>页</span></div></div>
      </section>
    </main>
    {showUpload && <UploadModal onClose={() => setShowUpload(false)} onSubmit={addUpload}/>} {retryRow && <RetryDetailModal row={retryRow} onClose={() => setRetryRow(null)} onRetry={retryTask}/>} {toast && <div className="toast"><span>✓</span>{toast}</div>}
  </div>;
}
