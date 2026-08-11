import { CalendarOutlined, CaretDownOutlined, PlayCircleFilled } from '@ant-design/icons';
import './room-detail.css';
import './room-detail-overrides.css';

const mainNav = ['首页','兴趣电商','一类电商','直播','退货','财务','广告','库存','订单','店铺','弹幕','报表','设置'];
const tabs = ['当日投产','引流分析','直播分析','直播场次','直播榜单','时段分析'];

export function RoomDetail({ onOpenReview }) {
  return <div className="room-page">
    <header className="room-topbar"><div className="room-brand"><div className="room-logo-crop"><img src="/source-ui.png" alt="数智罗盘"/></div><strong>数智罗盘</strong></div><nav>{mainNav.map(item=><button className={item==='直播'?'active':''} key={item}>{item}{['兴趣电商','一类电商','店铺','设置'].includes(item)&&<CaretDownOutlined/>}</button>)}</nav><div className="room-user"><span>陈</span><b>陈旭光</b><CaretDownOutlined/></div></header>
    <section className="room-summary"><div className="room-cover"></div><div className="room-basic"><strong>创维静享循环扇A</strong><span>● 抖音</span></div><div className="room-kpis"><em>推</em><span>秉方</span><em className="green">目标</em><span>5.04</span><em className="orange">考核</em><span>4.70</span><em className="pink">盈亏</em><span>4.55</span></div><div className="room-account"><i>SKYWORTH<br/>直播中</i><div><strong>创维生活电器旗舰店</strong><span>抖音号：79108397655</span></div><button><PlayCircleFilled/></button></div></section>
    <section className="room-tabs"><div>{tabs.map(tab=><button className={tab==='时段分析'?'active':''} key={tab}>{tab}</button>)}<button className="review-entry" onClick={onOpenReview}>AI直播复盘</button></div><div className="room-date"><span><CalendarOutlined/> 2026/08/11　-　2026/08/11</span>{['今日','昨日','近7日','近30日','本月'].map((label,index)=><button className={index===0?'active':''} key={label}>{label}</button>)}</div></section>
    <main className="room-content"><section className="analysis-card"><h2>直播爆量时段分析</h2><p>平均小时GMV</p><div className="chart"><i></i><b>最高1.6w</b><span>最低0</span><small>0-1　　1-2　　2-3　　3-4　　4-5　　5-6　　6-7　　7-8　　8-9　　9-10</small></div></section><section className="metric-card"><h2>凌晨时段数据 <small>（01:00-05:59）</small></h2><div>{[['直播时长','2.0h'],['消耗','1,206.23'],['综合GMV','8,496.82'],['综合ROI','7.04'],['预估人数','0.02'],['直播间费用（w）','0.03'],['预估毛利（w）','-0.02']].map(([label,value],index)=><article className={index>3?'warm':''} key={label}><span>{label}</span><strong>{value}</strong></article>)}</div></section></main>
  </div>;
}
