import React, { useState } from 'react';
import { NavTabId } from '../../types';

interface SituationOverviewViewProps {
  onNavigateTab: (tab: NavTabId) => void;
  onSelectAlertForInspection?: (alertId: string) => void;
}

export const SituationOverviewView: React.FC<SituationOverviewViewProps> = ({
  onNavigateTab,
  onSelectAlertForInspection,
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '24h' | '7d'>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPin, setSelectedPin] = useState<'HM-04' | 'PN-12' | null>('HM-04');
  const [hoveredHour, setHoveredHour] = useState<string | null>(null);

  const [queueItems, setQueueItems] = useState([
    {
      id: 'EV-20250519-0941',
      time: '14:31:08',
      cam: 'CAM-HM-04',
      sub: '危化品库南走道 #2',
      type: '烟感/明火疑似',
      typeColor: 'rose',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD09xsixIsEql1xAnEuP1Bqf2yPQR3c2PyKU8I71QV-ovNiLyfUqxEK-I8bYLX4P7Ty73P1wnw_qgP5oDcSSwMyoRu3lIv111aoHHhqBfoyg8gKbpEL0UHerjc_ezmwec0yOztTNn-VwNB-TMI6x_xkqu4YbP26H2D-Z0eqfPcJlODIwXHMm0QtFOcsV0T4Lju1lsENY_qyIZqTHWjBHfLGMnYzJv5L_60rSZ-TyTn5F4gTcHEzGKL2',
      confidence: '96.8%',
      status: 'pending',
    },
    {
      id: 'EV-20250519-0931',
      time: '14:28:44',
      cam: 'CAM-PN-12',
      sub: '北侧围墙 04 绊线区',
      type: '周界非法攀爬越界',
      typeColor: 'amber',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd2EW9oHOFhWXsoMbUpfcKkvo0xAPpEPj6VjQ2abJJ27s3weu8EfXvEOe6xXbhM_XEbbyhLzwse_SA20medaJzYP2dAYV86C7j1sx5JuQof-ckQnPJod8YtWpilW8y272u0vuCA04qfZ4eLcjdM1f01SWEAicgR9g4aPAxNTgkcAq252V9jO40qpEEk10ycCSul3f0HVAfoTUoljs-Og8GOzhZ2zUeulwatGU-eMhf8__5zVFUg1-O',
      confidence: '94.2%',
      status: 'pending',
    },
    {
      id: 'EV-20250519-0925',
      time: '14:21:10',
      cam: 'CAM-WH-18',
      sub: '物流立体库 2号卸货台',
      type: '未穿戴高反马甲',
      typeColor: 'blue',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCY3IEkcYFb1OkcKtzb7HQY-ARIWDddIW9EJ2IFA2iQwSXBiocpar1uYjvwuxpmT5AFSFl6gHKZu0Nf9QpdNA4iUXvxjqPW3PC12bqFTwIgRpxJ91Vl4NUFX61_1FgkT--qxUzQiu9pZekvbQevuk4Q4Kdb6gpidBEOdBNRvzM5sKcJxqvjW0Y3n8PTEVXYp9vdlzLI_iFuu-ZwZUKE6wJ5e2MFBsQW-47c12uigsqaZjQMB3Du6sbh',
      confidence: '91.5%',
      status: 'pending',
    },
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleQuickAction = (id: string, action: string) => {
    setQueueItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-6">
      {/* Workspace Breadcrumb & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-1">
        <div>
          <div className="flex items-center gap-2 text-[#747686] text-xs">
            <span>全域安防管控中心</span>
            <span>/</span>
            <span className="text-[#131b2e] font-medium">监控数据综合态势总览</span>
          </div>
          <h1 className="text-xl font-semibold text-[#131b2e] tracking-tight mt-0.5">
            综合态势感知总览 (Overview &amp; Telemetry)
          </h1>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="inline-flex items-center gap-1 bg-white border border-[#c4c5d7] rounded p-0.5 text-[#434655]">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                timeRange === 'today' ? 'bg-[#eaedff] font-semibold text-[#0037b0]' : 'hover:text-[#131b2e]'
              }`}
            >
              今日实时
            </button>
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                timeRange === '24h' ? 'bg-[#eaedff] font-semibold text-[#0037b0]' : 'hover:text-[#131b2e]'
              }`}
            >
              近 24 小时
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                timeRange === '7d' ? 'bg-[#eaedff] font-semibold text-[#0037b0]' : 'hover:text-[#131b2e]'
              }`}
            >
              近 7 天
            </button>
          </div>
          <button
            onClick={handleRefresh}
            className="h-8 px-2.5 bg-white border border-[#c4c5d7] text-[#434655] hover:bg-[#eaedff] rounded flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin text-[#1d4ed8]' : ''}`}
            >
              refresh
            </span>
            <span>自动刷新 (3s)</span>
          </button>
        </div>
      </div>

      {/* 4 Top Key Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: 摄像头状态 */}
        <div className="bg-white border border-[#c4c5d7] rounded p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#747686] text-xs">全域摄像头总数</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-[#131b2e] tracking-tight">3,842</span>
                <span className="text-xs font-mono text-[#747686]">台</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-mono text-xs font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 98.6% 在线
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#eaedff] grid grid-cols-3 text-center gap-1 font-mono text-xs">
            <div className="bg-[#faf8ff] rounded py-1 border border-[#eaedff]">
              <div className="text-[#747686] text-[10px]">正常</div>
              <div className="text-[#131b2e] font-bold mt-0.5">3,788</div>
            </div>
            <div className="bg-amber-50 rounded py-1 border border-amber-200">
              <div className="text-amber-700 text-[10px]">故障</div>
              <div className="text-amber-900 font-bold mt-0.5">12</div>
            </div>
            <div className="bg-rose-50 rounded py-1 border border-rose-200">
              <div className="text-rose-700 text-[10px]">离线</div>
              <div className="text-rose-900 font-bold mt-0.5">42</div>
            </div>
          </div>
        </div>

        {/* Card 2: 今日触发事件 */}
        <div className="bg-white border border-[#c4c5d7] rounded p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#747686] text-xs">今日触发事件</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-[#131b2e] tracking-tight">142</span>
                <span className="text-xs font-mono text-[#747686]">起</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#eaedff] text-[#0037b0] border border-[#c4c5d7] rounded font-mono text-xs font-semibold">
              闭环率 90.1%
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#eaedff] flex items-center justify-between font-mono text-xs px-1">
            <div>
              <span className="text-[#747686]">已处置闭环:</span>
              <span className="font-bold text-[#131b2e] ml-1">128 起</span>
            </div>
            <div className="flex items-center text-[#434655]">
              <span className="material-symbols-outlined text-[14px] mr-0.5 text-[#747686]">timer</span>
              <span>均响应 <strong className="text-[#131b2e] font-semibold">3.2m</strong></span>
            </div>
          </div>
        </div>

        {/* Card 3: 智能分析吞吐 */}
        <div className="bg-white border border-[#c4c5d7] rounded p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#747686] text-xs">智能视频分析吞吐</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-[#131b2e] tracking-tight">18,450</span>
                <span className="text-xs font-mono text-[#747686]">FPS 峰值</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-[#dce1ff] text-[#001551] border border-[#b7c4ff] rounded font-mono text-xs font-semibold">
              14ms 时延
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#eaedff] space-y-1">
            <div className="flex justify-between text-xs font-mono text-[#434655]">
              <span>48 边缘节点均载</span>
              <span className="font-bold text-[#131b2e]">68.2%</span>
            </div>
            <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#1d4ed8] h-full rounded-full" style={{ width: '68.2%' }}></div>
            </div>
          </div>
        </div>

        {/* Card 4: AI 模型健康度 */}
        <div className="bg-white border border-[#c4c5d7] rounded p-3.5 flex flex-col justify-between shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[#747686] text-xs">AI 模型健康度</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-[#131b2e] tracking-tight">98.4%</span>
                <span className="text-xs font-mono text-emerald-600 font-semibold">精度保持</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded font-mono text-xs font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 漂移检测正常
            </span>
          </div>
          <div className="mt-3 pt-2 border-t border-[#eaedff] flex items-center justify-between font-mono text-xs px-1">
            <div className="flex items-center gap-1">
              <span className="text-[#747686]">模型管线:</span>
              <span className="text-[#131b2e] font-bold">8/8 在线</span>
            </div>
            <span className="text-[#747686]">YOLOv8 + ViT-Edge</span>
          </div>
        </div>
      </section>

      {/* Main Workbench Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left Column: 24h Trend Chart & Regional Risk Index (5 cols) */}
        <section className="xl:col-span-5 space-y-4 flex flex-col">
          {/* 24h 告警发生与处理趋势图 */}
          <div className="bg-white border border-[#c4c5d7] rounded flex-1 flex flex-col shadow-xs">
            <div className="h-10 px-3.5 border-b border-[#eaedff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#747686]">stacked_line_chart</span>
                <h3 className="font-semibold text-xs text-[#131b2e]">24小时告警发生与处理趋势</h3>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="flex items-center gap-1 text-rose-700">
                  <span className="w-2 h-2 rounded-xs bg-rose-500"></span>紧急
                </span>
                <span className="flex items-center gap-1 text-amber-700">
                  <span className="w-2 h-2 rounded-xs bg-amber-500"></span>严重
                </span>
                <span className="flex items-center gap-1 text-blue-700">
                  <span className="w-2 h-2 rounded-xs bg-blue-500"></span>提示
                </span>
                <span className="flex items-center gap-1 text-emerald-700">
                  <span className="w-2 h-0.5 bg-emerald-500"></span>已闭环
                </span>
              </div>
            </div>

            <div className="p-3.5 flex-1 flex flex-col justify-between">
              <div className="relative w-full h-44">
                <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 460 160">
                  {/* Grid Lines */}
                  <line stroke="#f1f5f9" strokeDasharray="3 3" x1="30" x2="450" y1="20" y2="20" />
                  <line stroke="#f1f5f9" strokeDasharray="3 3" x1="30" x2="450" y1="55" y2="55" />
                  <line stroke="#f1f5f9" strokeDasharray="3 3" x1="30" x2="450" y1="95" y2="95" />
                  <line stroke="#e2e8f0" x1="30" x2="450" y1="135" y2="135" />

                  {/* Y-Axis labels */}
                  <text className="fill-slate-400 font-mono text-[10px]" x="8" y="24">30</text>
                  <text className="fill-slate-400 font-mono text-[10px]" x="8" y="60">20</text>
                  <text className="fill-slate-400 font-mono text-[10px]" x="8" y="100">10</text>
                  <text className="fill-slate-400 font-mono text-[10px]" x="14" y="139">0</text>

                  {/* T1: 02:00 */}
                  <g onMouseEnter={() => setHoveredHour('02:00 (紧急 7, 严重 10, 提示 15)')} onMouseLeave={() => setHoveredHour(null)} className="cursor-pointer">
                    <rect fill="#3b82f6" height="15" rx="1" width="14" x="50" y="120" />
                    <rect fill="#f59e0b" height="10" rx="1" width="14" x="50" y="110" />
                    <rect fill="#ef4444" height="7" rx="1" width="14" x="50" y="103" />
                  </g>

                  {/* T2: 06:00 */}
                  <g onMouseEnter={() => setHoveredHour('06:00 (紧急 7, 严重 15, 提示 20)')} onMouseLeave={() => setHoveredHour(null)} className="cursor-pointer">
                    <rect fill="#3b82f6" height="20" rx="1" width="14" x="110" y="115" />
                    <rect fill="#f59e0b" height="15" rx="1" width="14" x="110" y="100" />
                    <rect fill="#ef4444" height="7" rx="1" width="14" x="110" y="93" />
                  </g>

                  {/* T3: 10:00 (Peak) */}
                  <g onMouseEnter={() => setHoveredHour('10:00 告警高峰 (紧急 22, 严重 30, 提示 40)')} onMouseLeave={() => setHoveredHour(null)} className="cursor-pointer">
                    <rect fill="#3b82f6" height="40" rx="1" width="14" x="170" y="95" />
                    <rect fill="#f59e0b" height="30" rx="1" width="14" x="170" y="65" />
                    <rect fill="#ef4444" height="22" rx="1" width="14" x="170" y="43" />
                  </g>

                  {/* T4: 14:00 (Active current) */}
                  <g onMouseEnter={() => setHoveredHour('14:00 当前 (紧急 18, 严重 25, 提示 35)')} onMouseLeave={() => setHoveredHour(null)} className="cursor-pointer">
                    <rect fill="#3b82f6" height="35" rx="1" width="14" x="230" y="100" />
                    <rect fill="#f59e0b" height="25" rx="1" width="14" x="230" y="75" />
                    <rect fill="#ef4444" height="18" rx="1" width="14" x="230" y="57" />
                  </g>

                  {/* T5: 18:00 */}
                  <g onMouseEnter={() => setHoveredHour('18:00 (紧急 10, 严重 20, 提示 25)')} onMouseLeave={() => setHoveredHour(null)} className="cursor-pointer">
                    <rect fill="#3b82f6" height="25" rx="1" width="14" x="290" y="110" />
                    <rect fill="#f59e0b" height="20" rx="1" width="14" x="290" y="90" />
                    <rect fill="#ef4444" height="10" rx="1" width="14" x="290" y="80" />
                  </g>

                  {/* T6: 22:00 */}
                  <g onMouseEnter={() => setHoveredHour('22:00 (紧急 6, 严重 10, 提示 12)')} onMouseLeave={() => setHoveredHour(null)} className="cursor-pointer">
                    <rect fill="#3b82f6" height="12" rx="1" width="14" x="350" y="123" />
                    <rect fill="#f59e0b" height="10" rx="1" width="14" x="350" y="113" />
                    <rect fill="#ef4444" height="6" rx="1" width="14" x="350" y="107" />
                  </g>

                  {/* T7: 00:00 */}
                  <g onMouseEnter={() => setHoveredHour('00:00 (紧急 4, 严重 8, 提示 8)')} onMouseLeave={() => setHoveredHour(null)} className="cursor-pointer">
                    <rect fill="#3b82f6" height="8" rx="1" width="14" x="410" y="127" />
                    <rect fill="#f59e0b" height="8" rx="1" width="14" x="410" y="119" />
                    <rect fill="#ef4444" height="4" rx="1" width="14" x="410" y="115" />
                  </g>

                  {/* Closed Loop Resolution Trend Line (Emerald) */}
                  <path
                    d="M 57 108 L 117 96 L 177 49 L 237 62 L 297 82 L 357 109 L 417 116"
                    fill="none"
                    stroke="#10b981"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                  />
                  <circle cx="57" cy="108" fill="#ffffff" r="3" stroke="#10b981" strokeWidth="2" />
                  <circle cx="117" cy="96" fill="#ffffff" r="3" stroke="#10b981" strokeWidth="2" />
                  <circle cx="177" cy="49" fill="#ffffff" r="3.5" stroke="#10b981" strokeWidth="2" />
                  <circle cx="237" cy="62" fill="#ffffff" r="3" stroke="#10b981" strokeWidth="2" />
                  <circle cx="297" cy="82" fill="#ffffff" r="3" stroke="#10b981" strokeWidth="2" />
                  <circle cx="357" cy="109" fill="#ffffff" r="3" stroke="#10b981" strokeWidth="2" />
                  <circle cx="417" cy="116" fill="#ffffff" r="3" stroke="#10b981" strokeWidth="2" />
                </svg>
              </div>

              {/* X Axis labels */}
              <div className="flex justify-between pl-8 pr-2 font-mono text-[11px] text-[#747686] mt-1">
                <span>02:00</span>
                <span>06:00</span>
                <span>10:00 (高峰)</span>
                <span>14:00 (当前)</span>
                <span>18:00</span>
                <span>22:00</span>
                <span>00:00</span>
              </div>

              {/* Metric Summary Strip */}
              <div className="mt-2.5 p-2 bg-[#faf8ff] border border-[#eaedff] rounded flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5 text-[#434655]">
                  <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">info</span>
                  {hoveredHour ? (
                    <span className="font-mono text-emerald-800">{hoveredHour}</span>
                  ) : (
                    <span>
                      10:15 触发高峰时段峰值 <strong className="text-[#131b2e]">92</strong> 次/小时，平均闭环处置完成时长{' '}
                      <strong className="text-[#131b2e]">2.8m</strong>
                    </span>
                  )}
                </div>
                <span className="font-mono text-xs text-emerald-600 font-semibold">处置流转正常</span>
              </div>
            </div>
          </div>

          {/* 重点区域风险态势综合评级 */}
          <div className="bg-white border border-[#c4c5d7] rounded shadow-xs">
            <div className="h-10 px-3.5 border-b border-[#eaedff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#747686]">assessment</span>
                <h3 className="font-semibold text-xs text-[#131b2e]">重点区域风险态势综合评级</h3>
              </div>
              <span className="font-mono text-[11px] text-[#747686]">更新于 14:32</span>
            </div>
            <div className="divide-y divide-[#eaedff]">
              {/* Row 1 */}
              <div className="p-3 hover:bg-[#faf8ff] transition-colors flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-rose-100 text-rose-800 flex items-center justify-center font-mono text-xs font-bold">
                    01
                  </span>
                  <div>
                    <div className="font-semibold text-xs text-[#131b2e] flex items-center gap-1.5">
                      <span>危化品暂存库 (HazMat Depot)</span>
                      <span className="px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] rounded font-mono">
                        高危关注
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#747686] mt-0.5">
                      点位: CAM-HM-01~16 • 异常烟感待复核 (1)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-bold text-rose-600">89.4</div>
                  <div className="text-[10px] font-mono text-[#747686]">风险指数 (Max 100)</div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="p-3 hover:bg-[#faf8ff] transition-colors flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-amber-100 text-amber-800 flex items-center justify-center font-mono text-xs font-bold">
                    02
                  </span>
                  <div>
                    <div className="font-semibold text-xs text-[#131b2e] flex items-center gap-1.5">
                      <span>北侧园区周界隔离带 (Perimeter North)</span>
                      <span className="px-1.5 py-0.2 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] rounded font-mono">
                        中度警戒
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#747686] mt-0.5">
                      点位: CAM-PN-01~48 • 越界绊线检测 (3)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-bold text-amber-600">74.2</div>
                  <div className="text-[10px] font-mono text-[#747686]">风险指数 (Max 100)</div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="p-3 hover:bg-[#faf8ff] transition-colors flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-blue-100 text-blue-800 flex items-center justify-center font-mono text-xs font-bold">
                    03
                  </span>
                  <div>
                    <div className="font-semibold text-xs text-[#131b2e] flex items-center gap-1.5">
                      <span>物流立体仓配中心 (Warehouse Log-B)</span>
                      <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] rounded font-mono">
                        常态稳定
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#747686] mt-0.5">
                      点位: CAM-WH-01~82 • 人车混行检测正常
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-bold text-emerald-600">38.5</div>
                  <div className="text-[10px] font-mono text-[#747686]">风险指数 (Max 100)</div>
                </div>
              </div>

              {/* Row 4 */}
              <div className="p-3 hover:bg-[#faf8ff] transition-colors flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-xs font-bold">
                    04
                  </span>
                  <div>
                    <div className="font-semibold text-xs text-[#131b2e] flex items-center gap-1.5">
                      <span>精密总装车间 A3 (Assembly Line)</span>
                      <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] rounded font-mono">
                        安全受控
                      </span>
                    </div>
                    <div className="font-mono text-[11px] text-[#747686] mt-0.5">
                      点位: CAM-AS-01~64 • 安全帽/工装佩戴率 99.8%
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-base font-bold text-emerald-600">19.0</div>
                  <div className="text-[10px] font-mono text-[#747686]">风险指数 (Max 100)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Topology Map + Pending Incident Queue (7 cols) */}
        <section className="xl:col-span-7 space-y-4 flex flex-col">
          {/* 园区全景监控点位拓扑与重点点位网格 */}
          <div className="bg-white border border-[#c4c5d7] rounded flex flex-col shadow-xs">
            <div className="h-10 px-3.5 border-b border-[#eaedff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#747686]">map</span>
                <h3 className="font-semibold text-xs text-[#131b2e]">园区全景监控点位分布与态势拓扑</h3>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="px-2 py-0.5 bg-[#faf8ff] border border-[#c4c5d7] rounded text-[#434655]">
                  层级: 科技园区 L1 物理层
                </span>
                <div className="flex items-center gap-1.5 pl-2 border-l border-[#c4c5d7]">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span> 告警 (2)
                  <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1"></span> 正常 (324)
                </div>
              </div>
            </div>

            {/* High Precision Topological Map */}
            <div className="p-3.5">
              <div className="relative w-full h-72 bg-[#0f172a] rounded border border-slate-800 overflow-hidden select-none">
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>

                {/* Campus Blueprint SVG */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 280">
                  {/* Zone Boundaries */}
                  <polygon
                    points="40,30 220,30 250,110 40,110"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeDasharray="4 2"
                    strokeWidth="1.5"
                  />
                  <text fill="#64748b" fontFamily="JetBrains Mono" fontSize="11" x="50" y="50">
                    ZONE A • 危化品库
                  </text>

                  <polygon
                    points="280,30 500,30 520,130 280,130"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  <text fill="#64748b" fontFamily="JetBrains Mono" fontSize="11" x="290" y="50">
                    ZONE B • 立体物流仓
                  </text>

                  <polygon
                    points="540,40 670,40 670,220 540,220"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  <text fill="#64748b" fontFamily="JetBrains Mono" fontSize="11" x="550" y="60">
                    ZONE C • 园区周界
                  </text>

                  <polygon
                    points="70,140 480,140 480,260 70,260"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />
                  <text fill="#64748b" fontFamily="JetBrains Mono" fontSize="11" x="80" y="160">
                    ZONE D • 智能智造精密车间
                  </text>

                  {/* Optical Fiber Links */}
                  <path
                    d="M 140 75 L 290 80 L 390 190 L 600 70"
                    opacity="0.6"
                    stroke="#1d4ed8"
                    strokeDasharray="2 4"
                    strokeWidth="1"
                  />

                  {/* Normal Camera Node Points */}
                  <circle cx="340" cy="90" fill="#10b981" r="4" />
                  <circle cx="420" cy="70" fill="#10b981" r="4" />
                  <circle cx="210" cy="200" fill="#10b981" r="4" />
                  <circle cx="320" cy="220" fill="#10b981" r="4" />
                  <circle cx="610" cy="180" fill="#10b981" r="4" />

                  {/* Critical Alert Node 1: HM-04 */}
                  <g onClick={() => setSelectedPin('HM-04')} className="cursor-pointer">
                    <circle className="animate-ping" cx="140" cy="75" fill="#ef4444" opacity="0.4" r="9" />
                    <circle cx="140" cy="75" fill="#ef4444" r="5.5" stroke="#ffffff" strokeWidth="1.5" />
                  </g>

                  {/* Critical Alert Node 2: PN-12 */}
                  <g onClick={() => setSelectedPin('PN-12')} className="cursor-pointer">
                    <circle className="animate-ping" cx="600" cy="70" fill="#f59e0b" opacity="0.4" r="9" />
                    <circle cx="600" cy="70" fill="#f59e0b" r="5.5" stroke="#ffffff" strokeWidth="1.5" />
                  </g>
                </svg>

                {/* Interactive Floating Telemetry Popover */}
                {selectedPin && (
                  <div className="absolute top-4 left-36 sm:left-44 w-72 bg-white rounded border border-[#c4c5d7] shadow-lg p-3 z-10 text-xs">
                    <div className="flex items-center justify-between pb-1.5 border-b border-[#eaedff]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span className="font-semibold text-[#131b2e]">
                          {selectedPin === 'HM-04' ? 'CAM-HM-04 告警详情' : 'CAM-PN-12 告警详情'}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 font-bold">
                        {selectedPin === 'HM-04' ? '危急级别' : '严重级别'}
                      </span>
                    </div>

                    <div className="mt-2 flex gap-2">
                      <div className="w-20 h-16 bg-slate-900 rounded overflow-hidden relative shrink-0 border border-slate-200">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5gIa91KD60yTrYq-qRxiAB8hGxFceMUdGz3fWdTqzAyP-e7fJzxvrONwv1OVQAtxEOz47SUWi1_Kengo-MWwogDDaUZKnzsVZpCX2nmPd_mSnQeta8ToHf1AOlxzUwG6wbUlGTKXb3Jo3-oUGQUgwkDfppb3Q0NtphL5baCIUyxUV40WB61k3UzkWZItkS_YjrsFaIeggXPwoB7tsIViRhYdvoOdB_fYUW9sfsaPUiSkDP6kjqlAy"
                          alt="Campus Snapshot"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-[9px] text-white font-mono text-center">
                          {selectedPin}
                        </span>
                      </div>
                      <div className="flex-1 font-mono text-[11px] space-y-0.5">
                        <div className="text-[#131b2e] font-sans font-semibold">
                          {selectedPin === 'HM-04' ? '烟气微扩散疑似' : '周界绊线越界'}
                        </div>
                        <div className="text-[#747686]">
                          置信度: <strong className="text-[#131b2e]">{selectedPin === 'HM-04' ? '96.8%' : '94.2%'}</strong>
                        </div>
                        <div className="text-[#747686]">
                          模型: {selectedPin === 'HM-04' ? 'ViT-SmokeDet v2' : 'DeepSORT-v3.5'}
                        </div>
                        <div className="text-[#747686]">14:31:08 (2分钟前)</div>
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#eaedff] flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedPin(null)}
                        className="h-6 px-2 bg-[#faf8ff] hover:bg-[#eaedff] text-[#434655] rounded text-xs"
                      >
                        忽略
                      </button>
                      <button
                        onClick={() => {
                          onNavigateTab('alerts');
                          onSelectAlertForInspection?.('EV-20250519-0941');
                        }}
                        className="h-6 px-2.5 bg-[#1d4ed8] text-white text-xs font-medium rounded hover:bg-[#0037b0] transition-colors"
                      >
                        立即派单
                      </button>
                    </div>
                  </div>
                )}

                {/* Bottom Toolbar in Topology */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-slate-800/90 backdrop-blur-xs rounded p-1 border border-slate-700 text-white">
                  <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-xs" title="放大">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                  <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-xs" title="缩小">
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <button
                    onClick={() => setSelectedPin('HM-04')}
                    className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-xs"
                    title="重置居中"
                  >
                    <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
                  </button>
                  <span className="w-px h-3 bg-slate-700 mx-0.5"></span>
                  <button className="w-6 h-6 flex items-center justify-center hover:bg-slate-700 rounded text-xs" title="图层切换">
                    <span className="material-symbols-outlined text-[16px]">layers</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 待复核高危告警快速处理队列 */}
          <div className="bg-white border border-[#c4c5d7] rounded flex-1 flex flex-col shadow-xs">
            <div className="h-10 px-3.5 border-b border-[#eaedff] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#747686]">rule</span>
                <h3 className="font-semibold text-xs text-[#131b2e]">待复核高危告警快速处置队列</h3>
                <span className="px-2 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-mono font-bold">
                  {queueItems.filter((i) => i.status === 'pending').length} 待处置
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('alerts')}
                className="text-xs text-[#1d4ed8] hover:underline font-medium cursor-pointer"
              >
                批量派单处理
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#faf8ff] text-[#747686] font-mono text-[11px] border-b border-[#c4c5d7]">
                    <th className="py-2 px-3">时间戳</th>
                    <th className="py-2 px-3">监控点位 / 区域</th>
                    <th className="py-2 px-3">异常类型</th>
                    <th className="py-2 px-3">AI 抓拍</th>
                    <th className="py-2 px-3">置信度</th>
                    <th className="py-2 px-3 text-right">处置动作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaedff]">
                  {queueItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#faf8ff] transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[#747686]">{item.time}</td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#131b2e]">{item.cam}</div>
                        <div className="text-[#747686] font-mono text-[11px]">{item.sub}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[11px] font-medium inline-flex items-center gap-1 ${
                            item.typeColor === 'rose'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : item.typeColor === 'amber'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.typeColor === 'rose'
                                ? 'bg-rose-500'
                                : item.typeColor === 'amber'
                                ? 'bg-amber-500'
                                : 'bg-blue-500'
                            }`}
                          ></span>
                          {item.type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="w-12 h-8 rounded bg-slate-900 border border-slate-200 overflow-hidden relative">
                          <img
                            src={item.img}
                            alt="Snap thumbnail"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#131b2e] font-semibold">{item.confidence}</td>
                      <td className="py-2.5 px-3 text-right">
                        {item.status === 'pending' ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => {
                                handleQuickAction(item.id, 'confirmed');
                                onNavigateTab('alerts');
                                onSelectAlertForInspection?.(item.id);
                              }}
                              className="px-2 py-1 bg-[#1d4ed8] hover:bg-[#0037b0] text-white rounded text-[11px] font-medium transition-colors"
                            >
                              一键确认
                            </button>
                            <button
                              onClick={() => handleQuickAction(item.id, 'false_positive')}
                              className="px-2 py-1 bg-[#faf8ff] hover:bg-[#eaedff] text-[#434655] border border-[#c4c5d7] rounded text-[11px] transition-colors"
                            >
                              误报
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            已处置 ({item.status})
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="h-9 px-3.5 border-t border-[#eaedff] flex items-center justify-between font-mono text-[11px] text-[#747686] bg-[#faf8ff]">
              <span>当前队列平均响应延迟: 1.4 秒 • 自动化规则预分流: 86%</span>
              <button
                onClick={() => onNavigateTab('alerts')}
                className="hover:text-[#1d4ed8] cursor-pointer flex items-center gap-0.5"
              >
                <span>查看完整告警事件流水</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
