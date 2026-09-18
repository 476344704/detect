import React from 'react';
import { NavTabId } from '../types';

interface SidebarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  unresolvedAlertCount: number;
  onOpenDiagnostic: () => void;
  onOpenAuditLogs: () => void;
  onOpenApiDocs: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unresolvedAlertCount,
  onOpenDiagnostic,
  onOpenAuditLogs,
  onOpenApiDocs,
}) => {
  const navItems: Array<{ id: NavTabId; label: string; icon: string; badge?: number }> = [
    { id: 'overview', label: '态势大屏', icon: 'dashboard' },
    { id: 'monitoring', label: '实时监控', icon: 'videocam' },
    { id: 'alerts', label: '告警中心', icon: 'notification_important', badge: unresolvedAlertCount },
    { id: 'training', label: '模型训练', icon: 'psychology' },
    { id: 'config', label: '系统配置', icon: 'settings' },
  ];

  return (
    <aside className="fixed top-12 left-0 bottom-0 w-60 flex flex-col justify-between p-2 border-r border-[#c4c5d7] bg-white z-30 select-none">
      <div>
        {/* Header Engine / Shield */}
        <div className="p-2 mb-2 border-b border-[#c4c5d7]/60 flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#1d4ed8]/10 border border-[#1d4ed8]/20 flex items-center justify-center text-[#1d4ed8] shrink-0">
            <span className="material-symbols-outlined text-[18px]">security</span>
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-mono font-semibold text-[#131b2e] leading-tight flex items-center gap-1.5">
              <span>ARGUS 4.2</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-[11px] font-mono text-[#747686] truncate leading-tight mt-0.5">
              Cluster Active • 128 Nodes
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full text-left pl-3 pr-3 py-2 flex items-center gap-2.5 rounded-r transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#eaedff] text-[#0037b0] border-l-2 border-[#0037b0] font-medium'
                    : 'text-[#434655] hover:text-[#131b2e] hover:bg-[#f2f3ff]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    isActive ? 'text-[#0037b0]' : 'text-[#747686]'
                  }`}
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="text-xs">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-auto px-1.5 py-0.2 rounded font-mono text-[10px] font-semibold ${
                      isActive ? 'bg-[#ba1a1a] text-white' : 'bg-[#ffdad6] text-[#93000a]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Diagnostic CTA */}
        <div className="mt-4 px-1">
          <button
            id="btn-quick-diagnostic"
            onClick={onOpenDiagnostic}
            className="w-full h-8 px-2.5 rounded border border-[#c4c5d7] bg-[#faf8ff] hover:bg-[#eaedff] text-[#131b2e] font-mono text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[15px] text-[#0037b0]">medical_services</span>
            <span>Quick Diagnostic</span>
          </button>
        </div>
      </div>

      {/* Footer Nav & Telemetry */}
      <div className="pt-2 border-t border-[#c4c5d7]/60 space-y-0.5">
        <button
          onClick={onOpenAuditLogs}
          className="w-full text-left text-[#434655] hover:text-[#131b2e] pl-3 pr-3 py-1.5 flex items-center gap-2 rounded hover:bg-[#f2f3ff] transition-colors text-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">receipt_long</span>
          <span>Audit Logs</span>
        </button>
        <button
          onClick={onOpenApiDocs}
          className="w-full text-left text-[#434655] hover:text-[#131b2e] pl-3 pr-3 py-1.5 flex items-center gap-2 rounded hover:bg-[#f2f3ff] transition-colors text-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-[15px]">terminal</span>
          <span>API Docs</span>
        </button>

        <div className="px-3 pt-2 text-[10px] font-mono text-[#747686] flex justify-between items-center">
          <span>Latency: 14ms</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>v4.2.8-prod • Region AP-1</span>
          </span>
        </div>
      </div>
    </aside>
  );
};
