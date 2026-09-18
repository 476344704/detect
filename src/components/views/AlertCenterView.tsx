import React, { useState } from 'react';
import { AlertEvent, AlertStatus } from '../../types';
import { INITIAL_ALERTS } from '../../data/mockData';

interface AlertCenterViewProps {
  initialSelectedId?: string;
  onAlertStatusChange?: (alertId: string, status: AlertStatus) => void;
}

export const AlertCenterView: React.FC<AlertCenterViewProps> = ({
  initialSelectedId,
  onAlertStatusChange,
}) => {
  const [alerts, setAlerts] = useState<AlertEvent[]>(INITIAL_ALERTS);
  const [selectedId, setSelectedId] = useState<string>(
    initialSelectedId || INITIAL_ALERTS[0].id
  );
  const [statusFilter, setStatusFilter] = useState<'all' | AlertStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [compareMode, setCompareMode] = useState<'side-by-side' | 'raw' | 'ai'>('side-by-side');
  const [notice, setNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  };

  const selectedAlert = alerts.find((a) => a.id === selectedId) || alerts[0];

  const updateAlertStatus = (id: string, newStatus: AlertStatus, actionDesc: string) => {
    setAlerts((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updatedTimeline = [...item.timeline];
        if (newStatus === 'in_progress') {
          updatedTimeline.push({
            time: new Date().toLocaleTimeString(),
            title: '安保值班长已确认接单核实',
            desc: actionDesc,
            badge: '现场联动',
            elapsed: '+实时',
            status: 'current',
          });
        } else if (newStatus === 'closed') {
          updatedTimeline.push({
            time: new Date().toLocaleTimeString(),
            title: '事件已闭环结案并归档入库',
            desc: actionDesc,
            badge: '归档完成',
            elapsed: '+闭环',
            status: 'done',
          });
        }
        return {
          ...item,
          status: newStatus,
          timeline: updatedTimeline,
        };
      })
    );
    onAlertStatusChange?.(id, newStatus);
    showToast(`事件 ${id} 状态已更新: ${newStatus}`);
  };

  const filteredAlerts = alerts.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (
      searchQuery &&
      !a.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !a.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !a.camera.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-3 max-w-[1600px] mx-auto pb-6">
      {/* Toast Notice */}
      {notice && (
        <div className="fixed top-14 right-6 z-50 bg-[#131b2e] text-white px-3.5 py-2 rounded shadow-lg border border-[#c4c5d7]/50 font-mono text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Main Grid: Left Alert Feed List + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Alert List (5 cols) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-2.5 flex flex-col">
          {/* Header & Filter Search */}
          <div className="bg-white border border-[#c4c5d7] rounded p-3 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0037b0] text-[18px]">
                  notification_important
                </span>
                <h2 className="font-semibold text-xs text-[#131b2e]">智能告警事件流水</h2>
              </div>
              <span className="font-mono text-[11px] text-[#747686]">
                共 {alerts.length} 起 • 未复核 {alerts.filter((a) => a.status === 'unverified').length}
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="搜索事件编号、监控点位或责任人..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-7 pl-7 pr-2 bg-[#faf8ff] border border-[#c4c5d7] rounded text-xs text-[#131b2e] outline-none"
              />
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-[14px] text-[#747686]">
                search
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-[#1d4ed8] text-white font-medium'
                    : 'bg-[#faf8ff] border border-[#c4c5d7] text-[#434655] hover:bg-[#eaedff]'
                }`}
              >
                全部 ({alerts.length})
              </button>
              <button
                onClick={() => setStatusFilter('unverified')}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  statusFilter === 'unverified'
                    ? 'bg-[#ba1a1a] text-white font-medium'
                    : 'bg-[#faf8ff] border border-[#c4c5d7] text-[#ba1a1a] hover:bg-[#ffdad6]/40'
                }`}
              >
                未复核 ({alerts.filter((a) => a.status === 'unverified').length})
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  statusFilter === 'in_progress'
                    ? 'bg-amber-600 text-white font-medium'
                    : 'bg-[#faf8ff] border border-[#c4c5d7] text-amber-800 hover:bg-amber-50'
                }`}
              >
                处置中 ({alerts.filter((a) => a.status === 'in_progress').length})
              </button>
              <button
                onClick={() => setStatusFilter('closed')}
                className={`px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                  statusFilter === 'closed'
                    ? 'bg-emerald-600 text-white font-medium'
                    : 'bg-[#faf8ff] border border-[#c4c5d7] text-emerald-800 hover:bg-emerald-50'
                }`}
              >
                已闭环
              </button>
            </div>
          </div>

          {/* Alert Cards Feed */}
          <div className="space-y-2 overflow-y-auto max-h-[720px] pr-1">
            {filteredAlerts.map((item) => {
              const isSelected = item.id === selectedId;
              const isCritical = item.severity === 'critical';
              const isSevere = item.severity === 'severe';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-3 rounded border transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-[#0037b0] ring-1 ring-[#0037b0] shadow-sm bg-[#faf8ff]'
                      : 'border-[#c4c5d7] hover:border-[#747686]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isCritical
                            ? 'bg-rose-500 animate-ping'
                            : isSevere
                            ? 'bg-amber-500'
                            : 'bg-blue-500'
                        }`}
                      ></span>
                      <span className="font-mono text-[11px] font-semibold text-[#131b2e]">
                        {item.id}
                      </span>
                    </div>

                    <span
                      className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                        item.status === 'unverified'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.status === 'in_progress'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {item.status === 'unverified'
                        ? '待复核'
                        : item.status === 'in_progress'
                        ? '处置中'
                        : '已闭环'}
                    </span>
                  </div>

                  <h4 className="font-semibold text-xs text-[#131b2e] mt-1 line-clamp-1">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] font-mono text-[#747686] mt-1.5">
                    <span>{item.camera}</span>
                    <span className="font-semibold text-[#131b2e]">置信度 {item.confidence}%</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#747686] mt-1 pt-1.5 border-t border-[#eaedff]">
                    <span>{item.timestamp}</span>
                    <span className="text-rose-600">{item.sla}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail Inspector & Action Console (7 cols) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-3">
          {/* Header Card */}
          <div className="bg-white border border-[#c4c5d7] rounded p-3.5 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#eaedff]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#0037b0]">{selectedAlert.id}</span>
                  <span
                    className={`px-2 py-0.2 rounded font-mono text-xs font-bold ${
                      selectedAlert.severity === 'critical'
                        ? 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]/30'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {selectedAlert.severity === 'critical' ? '危急 (CRITICAL)' : '严重 (SEVERE)'}
                  </span>
                  <span className="px-2 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs">
                    置信度 {selectedAlert.confidence}%
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#131b2e] mt-1">{selectedAlert.title}</h2>
              </div>

              {/* View mode toggle */}
              <div className="flex items-center bg-[#faf8ff] border border-[#c4c5d7] rounded p-0.5 text-xs font-mono">
                <button
                  onClick={() => setCompareMode('side-by-side')}
                  className={`px-2 py-0.5 rounded ${
                    compareMode === 'side-by-side' ? 'bg-white shadow-xs font-bold text-[#1d4ed8]' : 'text-[#747686]'
                  }`}
                >
                  双目对比
                </button>
                <button
                  onClick={() => setCompareMode('raw')}
                  className={`px-2 py-0.5 rounded ${
                    compareMode === 'raw' ? 'bg-white shadow-xs font-bold text-[#1d4ed8]' : 'text-[#747686]'
                  }`}
                >
                  原始原图
                </button>
                <button
                  onClick={() => setCompareMode('ai')}
                  className={`px-2 py-0.5 rounded ${
                    compareMode === 'ai' ? 'bg-white shadow-xs font-bold text-[#1d4ed8]' : 'text-[#747686]'
                  }`}
                >
                  AI 特征图
                </button>
              </div>
            </div>

            {/* Video Snapshot Dual Comparison View */}
            <div className="mt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {(compareMode === 'side-by-side' || compareMode === 'raw') && (
                  <div className="relative rounded bg-black border border-slate-700 overflow-hidden h-64 md:h-72">
                    <img
                      src={selectedAlert.rawFrameUrl}
                      alt="Raw Frame"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-white font-mono text-[10px] border border-slate-700">
                      原始无损监控帧 (RAW FRAME)
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-slate-300 font-mono text-[10px]">
                      {selectedAlert.cameraDesc}
                    </div>
                  </div>
                )}

                {(compareMode === 'side-by-side' || compareMode === 'ai') && (
                  <div className="relative rounded bg-black border border-rose-500 overflow-hidden h-64 md:h-72">
                    <img
                      src={selectedAlert.aiFrameUrl}
                      alt="AI Detection Frame"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-950/90 text-rose-200 font-mono text-[10px] border border-rose-600 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span>
                      <span>AI 推理特征分析 (AI INFERENCE)</span>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-rose-300 font-mono text-[10px]">
                      特征: 明火烟雾轮廓提取 ({selectedAlert.confidence}%)
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Detail Badges */}
            <div className="mt-3 pt-3 border-t border-[#eaedff] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 bg-[#faf8ff] rounded border border-[#eaedff]">
                <div className="text-[#747686] text-[10px]">报警监控点位</div>
                <div className="font-semibold text-[#131b2e] mt-0.5 truncate">{selectedAlert.cameraDesc}</div>
              </div>
              <div className="p-2 bg-[#faf8ff] rounded border border-[#eaedff]">
                <div className="text-[#747686] text-[10px]">物理空间定位</div>
                <div className="font-semibold text-[#131b2e] mt-0.5 truncate">{selectedAlert.location}</div>
              </div>
              <div className="p-2 bg-[#faf8ff] rounded border border-[#eaedff]">
                <div className="text-[#747686] text-[10px]">边缘推理算力模型</div>
                <div className="font-semibold text-[#131b2e] mt-0.5 truncate">{selectedAlert.model}</div>
              </div>
              <div className="p-2 bg-[#faf8ff] rounded border border-[#eaedff]">
                <div className="text-[#747686] text-[10px]">工单流转责任人</div>
                <div className="font-semibold text-[#131b2e] mt-0.5 truncate">{selectedAlert.operator}</div>
              </div>
            </div>

            {/* Disposition Actions */}
            <div className="mt-3 pt-3 border-t border-[#eaedff] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateAlertStatus(
                      selectedAlert.id,
                      'in_progress',
                      '安保人员王建强携带防毒面具与干粉灭火器赶往就地处置'
                    )
                  }
                  className="px-3.5 py-1.5 rounded bg-[#1d4ed8] hover:bg-[#0037b0] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>一键确认并派发现场应急</span>
                </button>

                <button
                  onClick={() => showToast('现场防爆语音广播与声光警报已自动下发！')}
                  className="px-3 py-1.5 rounded bg-[#faf8ff] border border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6]/40 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">campaign</span>
                  <span>联动就地广播</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateAlertStatus(
                      selectedAlert.id,
                      'false_positive',
                      '特征图像已打包推送至模型微调样本池，打标 False-Positive'
                    );
                  }}
                  className="px-3 py-1.5 rounded bg-[#faf8ff] border border-[#c4c5d7] hover:bg-[#eaedff] text-[#434655] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">flag</span>
                  <span>标记误报回流模型</span>
                </button>

                <button
                  onClick={() =>
                    updateAlertStatus(
                      selectedAlert.id,
                      'closed',
                      '现场火势已由干粉灭火器扑灭，阀门已手动紧固复核无泄漏，工单结案归档'
                    )
                  }
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">task_alt</span>
                  <span>结案归档 (Close)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full Audit Disposition Timeline (时间轴) */}
          <div className="bg-white border border-[#c4c5d7] rounded p-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#0037b0]">route</span>
                <h3 className="font-semibold text-xs text-[#131b2e]">
                  全链路处置追踪时间轴 (Audit Trail &amp; SOP Execution)
                </h3>
              </div>
              <span className="font-mono text-[11px] text-[#747686]">SOP 预案: #F-02 化工火警处置</span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#eaedff]">
              {selectedAlert.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <div
                    className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center ${
                      step.status === 'done'
                        ? 'border-emerald-500 text-emerald-500'
                        : step.status === 'current'
                        ? 'border-[#0037b0] ring-4 ring-[#eaedff]'
                        : 'border-slate-300'
                    }`}
                  >
                    {step.status === 'done' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                    {step.status === 'current' && <span className="w-1.5 h-1.5 rounded-full bg-[#0037b0]"></span>}
                  </div>

                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#131b2e]">{step.time}</span>
                      <span className="font-semibold text-xs text-[#131b2e]">{step.title}</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#eaedff] text-[#0037b0] font-mono text-[10px]">
                        {step.badge}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#747686]">{step.elapsed}</span>
                  </div>

                  <p className="text-xs text-[#434655] mt-1 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
