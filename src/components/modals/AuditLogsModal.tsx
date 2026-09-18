import React from 'react';

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const logs = [
    { time: '14:32:08', user: '王建强 (SecOps Lead)', action: '接收现场告警工单 EV-20250519-0941 并下发干粉灭火联动', ip: '10.240.12.8' },
    { time: '14:28:44', user: '自动策略引擎', action: 'CAM-PN-12 触发周界非法入侵，自动派单至现场安保值班组', ip: 'Cluster-East-A' },
    { time: '14:15:00', user: 'SecOps Admin', action: '执行模型微调超参同步，更新 Base Learning Rate = 3.5e-4', ip: '10.240.1.100' },
    { time: '14:02:18', user: '运维主管', action: '调整 CAM-A1-03 PTZ 云台巡航预置位 #01，步长 5° 锁定', ip: '10.240.14.2' },
    { time: '13:55:40', user: '系统守护进程', action: '完成 48 边缘节点自动化心跳轮询，网络平均延迟 14ms', ip: 'Localhost' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#c4c5d7] rounded w-full max-w-2xl shadow-2xl overflow-hidden">
        <div className="px-4 py-3 bg-[#faf8ff] border-b border-[#c4c5d7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0037b0] text-[20px]">receipt_long</span>
            <h3 className="font-semibold text-sm text-[#131b2e]">不可篡改安全操作审计日志 (Audit Logs)</h3>
          </div>
          <button onClick={onClose} className="text-[#747686] hover:text-[#131b2e]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-96 text-xs font-mono">
          <div className="space-y-2">
            {logs.map((l, i) => (
              <div key={i} className="p-2.5 rounded border border-[#eaedff] hover:bg-[#faf8ff] flex flex-col gap-1">
                <div className="flex items-center justify-between text-[#747686]">
                  <span className="text-[#0037b0] font-semibold">{l.time}</span>
                  <span>{l.ip}</span>
                </div>
                <div className="text-[#131b2e] font-sans text-xs">
                  <span className="font-medium text-[#434655] mr-1.5">{l.user}:</span>
                  {l.action}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-2.5 bg-[#faf8ff] border-t border-[#c4c5d7] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#faf8ff] border border-[#c4c5d7] text-xs font-medium text-[#434655] hover:bg-[#eaedff]"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
