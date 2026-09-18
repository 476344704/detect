import React from 'react';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v4/streams/{cam_id}/live.m3u8',
      desc: '获取指定摄像机 H.265/H.264 超低延时切片流地址',
    },
    {
      method: 'POST',
      path: '/api/v4/ptz/{cam_id}/control',
      desc: '下发 PTZ 云台姿态控制指令 (pan, tilt, zoom, preset_id)',
    },
    {
      method: 'GET',
      path: '/api/v4/alerts/events',
      desc: '查询未闭环安全告警事件列表，支持 severity/location 过滤',
    },
    {
      method: 'POST',
      path: '/api/v4/alerts/{event_id}/dispatch',
      desc: '触发告警一键应急处置工单与现场广播联动',
    },
    {
      method: 'POST',
      path: '/api/v4/models/deploy',
      desc: '下发新编译模型权重镜像至指定边缘节点集群 (P2P 分发)',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#c4c5d7] rounded w-full max-w-2xl shadow-2xl overflow-hidden text-xs">
        <div className="px-4 py-3 bg-[#faf8ff] border-b border-[#c4c5d7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0037b0] text-[20px]">terminal</span>
            <h3 className="font-semibold text-sm text-[#131b2e]">Argus Open API 开发者接口文档</h3>
          </div>
          <button onClick={onClose} className="text-[#747686] hover:text-[#131b2e]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-96 overflow-y-auto font-mono">
          <div className="p-2.5 bg-[#f2f3ff] rounded border border-[#c4c5d7] text-[#434655] font-sans">
            Base URL: <code className="font-mono text-[#0037b0]">https://api.argus-ops.internal/v4</code> • 认证方式: Bearer API-Token (OAuth2 / Mutual TLS)
          </div>

          <div className="space-y-2">
            {endpoints.map((ep, i) => (
              <div key={i} className="p-2.5 rounded border border-[#eaedff] hover:bg-[#faf8ff]">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      ep.method === 'GET'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-bold text-[#131b2e]">{ep.path}</span>
                </div>
                <div className="text-[11px] text-[#747686] font-sans">{ep.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-2.5 bg-[#faf8ff] border-t border-[#c4c5d7] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#1d4ed8] text-white font-medium hover:bg-[#0037b0]"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
