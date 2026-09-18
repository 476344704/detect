import React, { useState, useEffect } from 'react';

interface QuickDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickDiagnosticModal: React.FC<QuickDiagnosticModalProps> = ({ isOpen, onClose }) => {
  const [running, setRunning] = useState(true);

  const checks = [
    { label: 'RDMA Verbs 高速互联网络驱动', status: 'PASS', detail: 'mlx5_0: PORT_ACTIVE MTU=4096 (890 GB/s)' },
    { label: 'NVIDIA H800 x8 GPU 集群状态', status: 'PASS', detail: '8/8 卡就绪，显存分配 560GB/640GB 稳定' },
    { label: '144 路 RTSP/GB28181 视频流心跳', status: 'PASS', detail: '丢包率 0.01%，无花屏/关键帧断流' },
    { label: 'TensorRT / DeepStream 推理延迟', status: 'PASS', detail: '平均端到端时延 14.2ms (<20ms 超实时指标)' },
    { label: '防爆联动与语音广播网关通道', status: 'PASS', detail: 'PA 扬声器前置机 QPS 正常，心跳保持' },
  ];

  useEffect(() => {
    if (isOpen) {
      setRunning(true);
      const timer = setTimeout(() => setRunning(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#c4c5d7] rounded w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="px-4 py-3 bg-[#faf8ff] border-b border-[#c4c5d7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0037b0] text-[20px]">medical_services</span>
            <h3 className="font-semibold text-sm text-[#131b2e]">系统快速健康诊断 (Quick Diagnostic)</h3>
          </div>
          <button onClick={onClose} className="text-[#747686] hover:text-[#131b2e]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-[#f2f3ff] rounded border border-[#c4c5d7]">
            <div>
              <span className="font-semibold text-[#131b2e]">全系统 128 节点运行状态评级</span>
              <div className="text-[10px] font-mono text-[#747686] mt-0.5">Argus Self-Healing Engine v4.2</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold">
              {running ? '正在巡检...' : 'HEALTHY 100%'}
            </span>
          </div>

          <div className="space-y-2">
            {checks.map((item, idx) => (
              <div key={idx} className="p-2 border border-[#eaedff] rounded hover:bg-[#faf8ff] transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-[#131b2e]">{item.label}</span>
                  {running ? (
                    <span className="text-[#747686] font-mono">校验中...</span>
                  ) : (
                    <span className="text-emerald-700 font-mono font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      {item.status}
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-[#747686]">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-2.5 bg-[#faf8ff] border-t border-[#c4c5d7] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#1d4ed8] text-white text-xs font-medium hover:bg-[#0037b0] transition-colors"
          >
            完成并关闭
          </button>
        </div>
      </div>
    </div>
  );
};
