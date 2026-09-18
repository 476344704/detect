import React, { useState } from 'react';
import { ModelPolicy } from '../../types';
import { INITIAL_POLICIES } from '../../data/mockData';

export const SystemConfigView: React.FC = () => {
  const [policies, setPolicies] = useState<ModelPolicy[]>(INITIAL_POLICIES);
  const [notice, setNotice] = useState<string | null>(null);

  // Global settings
  const [autoSlaMinutes, setAutoSlaMinutes] = useState(5);
  const [retentionDays, setRetentionDays] = useState(60);
  const [gb28181Enabled, setGb28181Enabled] = useState(true);
  const [ga1400Enabled, setGa1400Enabled] = useState(true);

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  };

  const handleConfidenceChange = (id: string, val: number) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, confidenceThreshold: val } : p))
    );
  };

  const handleFpsChange = (id: string, val: number) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, fps: val } : p))
    );
  };

  const handleToggleRunning = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, running: !p.running } : p))
    );
  };

  const handleSaveAll = () => {
    showToast('调度策略已全网下发生效！所有边缘算力节点配置已热更新。');
  };

  const handleResetDefaults = () => {
    setPolicies(INITIAL_POLICIES);
    showToast('已重置所有策略为出厂推荐生产基准参数。');
  };

  return (
    <div className="space-y-3 max-w-[1600px] mx-auto pb-6">
      {/* Toast Notice */}
      {notice && (
        <div className="fixed top-14 right-6 z-50 bg-[#131b2e] text-white px-3.5 py-2 rounded shadow-lg border border-[#c4c5d7]/50 font-mono text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white border border-[#c4c5d7] rounded p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0037b0] text-[20px]">tune</span>
            <h1 className="text-base font-bold text-[#131b2e]">
              算法编排与调度策略 (Algorithm &amp; Policy Orchestration)
            </h1>
          </div>
          <div className="text-xs font-mono text-[#747686] mt-1 flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>全局边缘计算集群: 128 / 128 节点在线</span>
            </span>
            <span>•</span>
            <span>算力池总负载 68.4% (FP16/INT8)</span>
            <span>•</span>
            <span>调度时钟周期: 100ms</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={handleResetDefaults}
            className="h-8 px-3 rounded bg-white hover:bg-[#eaedff] text-[#434655] border border-[#c4c5d7] font-medium transition-colors cursor-pointer"
          >
            重置默认基准
          </button>
          <button
            onClick={handleSaveAll}
            className="h-8 px-3.5 rounded bg-[#1d4ed8] hover:bg-[#0037b0] text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[16px]">cloud_sync</span>
            <span>保存并全网同步生效</span>
          </button>
        </div>
      </div>

      {/* 4 Model Policy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {policies.map((policy) => {
          const isErrorColor = policy.color === 'error';
          const isSecondary = policy.color === 'secondary';

          return (
            <div
              key={policy.id}
              className={`bg-white border rounded p-4 shadow-xs transition-all ${
                policy.running
                  ? 'border-[#c4c5d7] hover:border-[#1d4ed8]'
                  : 'border-slate-200 bg-slate-50/60 opacity-80'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#eaedff]">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded flex items-center justify-center ${
                      isErrorColor
                        ? 'bg-rose-100 text-rose-700'
                        : isSecondary
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-[#0037b0]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{policy.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#131b2e] flex items-center gap-1.5">
                      <span>{policy.name}</span>
                      <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-[#eaedff] text-[#434655]">
                        {policy.version}
                      </span>
                    </h3>
                    <div className="text-[11px] font-mono text-[#747686] mt-0.5">
                      SHA: {policy.sha} • {policy.description}
                    </div>
                  </div>
                </div>

                {/* Switch button */}
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#747686]">
                    {policy.running ? '运行中' : '已挂起'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={policy.running}
                      onChange={() => handleToggleRunning(policy.id)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4 bg-[#c4c5d7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#1d4ed8]"></div>
                  </label>
                </div>
              </div>

              {/* Edge Node & Channel allocation */}
              <div className="py-2.5 grid grid-cols-2 gap-2 text-xs font-mono border-b border-[#eaedff]">
                <div>
                  <span className="text-[#747686] text-[10px]">边缘计算承载节点</span>
                  <div className="font-semibold text-[#131b2e] mt-0.5 truncate">{policy.node}</div>
                  <span className="text-[10px] text-[#0037b0]">{policy.engine}</span>
                </div>
                <div>
                  <span className="text-[#747686] text-[10px]">绑定视频分析通道</span>
                  <div className="font-semibold text-[#131b2e] mt-0.5">
                    {policy.boundChannels} / {policy.totalChannels} 路
                  </div>
                  <div className="w-full bg-[#eaedff] h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-[#1d4ed8] h-full rounded-full"
                      style={{ width: `${(policy.boundChannels / policy.totalChannels) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Sliders for Confidence & FPS */}
              <div className="pt-2.5 space-y-3 text-xs font-mono">
                {/* Confidence Threshold */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#131b2e] font-sans font-medium">基础判定置信度阈值 (Confidence)</span>
                    <span className="font-bold text-[#1d4ed8]">{policy.confidenceThreshold.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.50"
                    max="0.99"
                    step="0.01"
                    value={policy.confidenceThreshold}
                    onChange={(e) => handleConfidenceChange(policy.id, parseFloat(e.target.value))}
                    className="w-full accent-[#1d4ed8]"
                  />
                  <div className="text-[10px] text-[#747686] flex justify-between mt-0.5">
                    <span>{policy.thresholdHint}</span>
                    <span>高敏 &lt;---&gt; 零误报</span>
                  </div>
                </div>

                {/* Sampling FPS */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[#131b2e] font-sans font-medium">推理抽帧检测频率 (Sampling FPS)</span>
                    <span className="font-bold text-[#131b2e]">{policy.fps} FPS</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={policy.fps}
                    onChange={(e) => handleFpsChange(policy.id, parseInt(e.target.value))}
                    className="w-full accent-[#1d4ed8]"
                  />
                  <div className="text-[10px] text-[#747686] flex justify-between mt-0.5">
                    <span>{policy.fpsHint}</span>
                    <span>5 FPS ~ 30 FPS</span>
                  </div>
                </div>

                {/* NMS Mode Display */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-[#434655]">
                  <span>非极大值抑制 (NMS IoU): {policy.nmsIou}</span>
                  <span className="px-2 py-0.5 rounded bg-[#faf8ff] border border-[#c4c5d7] text-[#131b2e]">
                    {policy.nmsMode}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Global Security & Retention Policy */}
      <div className="bg-white border border-[#c4c5d7] rounded p-3.5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#0037b0]">shield</span>
            <h3 className="font-semibold text-xs text-[#131b2e]">全局安全策略与视频存证合规配置</h3>
          </div>
          <span className="text-[10px] font-mono text-[#747686]">GB/T 28181-2022 &amp; GA/T 1400 视图库</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* SLA Timeout */}
          <div className="p-3 bg-[#faf8ff] rounded border border-[#eaedff] space-y-1">
            <span className="text-[#747686] font-medium">工单处置 SLA 超时升级</span>
            <div className="flex items-center gap-2 mt-1">
              <input
                type="number"
                value={autoSlaMinutes}
                onChange={(e) => setAutoSlaMinutes(parseInt(e.target.value))}
                className="w-16 h-7 px-2 bg-white border border-[#c4c5d7] rounded font-mono font-bold text-center"
              />
              <span className="font-mono text-[#131b2e]">分钟未响应自动升级</span>
            </div>
          </div>

          {/* Retention Days */}
          <div className="p-3 bg-[#faf8ff] rounded border border-[#eaedff] space-y-1">
            <span className="text-[#747686] font-medium">告警事件高清录像切片存留期</span>
            <div className="flex items-center gap-2 mt-1">
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                className="h-7 px-2 bg-white border border-[#c4c5d7] rounded font-mono font-bold"
              >
                <option value="30">30 天 (标准归档)</option>
                <option value="60">60 天 (危化品重点合规)</option>
                <option value="90">90 天 (国家防爆安标)</option>
              </select>
            </div>
          </div>

          {/* GB28181 */}
          <div className="p-3 bg-[#faf8ff] rounded border border-[#eaedff] flex items-center justify-between">
            <div>
              <div className="font-medium text-[#131b2e]">GB/T 28181 上级公安对接</div>
              <div className="text-[10px] font-mono text-[#747686] mt-0.5">SIP 级联信令转接中</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={gb28181Enabled}
                onChange={(e) => setGb28181Enabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-[#c4c5d7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#1d4ed8]"></div>
            </label>
          </div>

          {/* GA1400 */}
          <div className="p-3 bg-[#faf8ff] rounded border border-[#eaedff] flex items-center justify-between">
            <div>
              <div className="font-medium text-[#131b2e]">GA/T 1400 视图特征库推送</div>
              <div className="text-[10px] font-mono text-[#747686] mt-0.5">自动上传人脸/车牌元数据</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ga1400Enabled}
                onChange={(e) => setGa1400Enabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-[#c4c5d7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#1d4ed8]"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
