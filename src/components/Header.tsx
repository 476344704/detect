import React, { useState } from 'react';

interface HeaderProps {
  onOpenEmergency: () => void;
  onOpenDeploy: () => void;
  onSearchQuery?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEmergency,
  onOpenDeploy,
  onSearchQuery,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const notifications = [
    { id: 1, title: '化工反应车间B区产生新明火告警', time: '1 分钟前', unread: true },
    { id: 2, title: 'Node-Alpha (RTX 4090x4) 显存负载超过 85%', time: '8 分钟前', unread: true },
    { id: 3, title: '模型 v2.4.0-candidate 验证集完成 15,000 帧评测', time: '22 分钟前', unread: false },
  ];

  return (
    <header className="h-12 w-full px-4 flex justify-between items-center border-b border-[#c4c5d7] bg-[#faf8ff] z-40 fixed top-0 left-0 right-0 select-none">
      {/* Brand and Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#0037b0] text-white flex items-center justify-center font-bold text-xs">
            A
          </div>
          <span className="font-semibold text-base tracking-tight text-[#131b2e]">
            Argus Vision Ops
          </span>
          <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#eaedff] text-[#434655]">
            v4.2-PROD
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-64 md:w-80 hidden sm:block">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#747686] text-[16px]">
            search
          </span>
          <input
            type="text"
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
              onSearchQuery?.(e.target.value);
            }}
            placeholder="搜索模型、检查点、集群节点或作业 ID..."
            className="w-full h-8 pl-8 pr-12 text-xs bg-white border border-[#c4c5d7] rounded focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8] outline-none text-[#131b2e] placeholder:text-[#747686] transition-all"
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#747686] border border-[#c4c5d7] px-1 rounded bg-[#faf8ff]">
            ⌘K
          </span>
        </div>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-2.5">
        {/* Cluster Telemetry Status Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 bg-[#eaedff] rounded border border-[#c4c5d7] text-[11px] font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[#434655]">AI 推理引擎:</span>
          <span className="text-[#131b2e] font-semibold">99.82% 稳定</span>
        </div>

        {/* Emergency Broadcast Button */}
        <button
          id="btn-emergency-broadcast"
          onClick={onOpenEmergency}
          className="h-8 px-2.5 md:px-3 text-xs font-medium rounded bg-white border border-[#ba1a1a] text-[#ba1a1a] hover:bg-[#ffdad6]/40 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">warning</span>
          <span className="hidden md:inline font-mono">Emergency Broadcast</span>
          <span className="md:hidden">应急</span>
        </button>

        {/* Deploy Model Button */}
        <button
          id="btn-deploy-model"
          onClick={onOpenDeploy}
          className="h-8 px-3 text-xs font-medium rounded bg-[#1d4ed8] text-white hover:bg-[#0037b0] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
          <span className="font-mono">Deploy Model</span>
        </button>

        <div className="h-4 w-[1px] bg-[#c4c5d7] mx-1"></div>

        {/* Icon Action Group */}
        <div className="flex items-center gap-1 text-[#434655] relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#eaedff] hover:text-[#131b2e] transition-colors relative cursor-pointer"
            title="通知中心"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-10 right-0 w-80 bg-white border border-[#c4c5d7] rounded shadow-lg p-3 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#eaedff] font-semibold text-[#131b2e]">
                <span>系统通知与告警 (3)</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-[#747686] hover:text-[#131b2e]"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
              <div className="divide-y divide-[#eaedff] max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2 hover:bg-[#faf8ff] px-1 rounded transition-colors">
                    <div className="flex items-start justify-between">
                      <span className="font-medium text-[#131b2e] line-clamp-1">{n.title}</span>
                      {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8] mt-1 shrink-0"></span>}
                    </div>
                    <span className="text-[10px] font-mono text-[#747686]">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onOpenDeploy}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#eaedff] hover:text-[#131b2e] transition-colors cursor-pointer"
            title="调优控制"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>

        <div className="h-4 w-[1px] bg-[#c4c5d7] mx-1"></div>

        {/* User Profile */}
        <div className="relative">
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-1 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <div className="w-7 h-7 rounded-full bg-[#dae2fd] border border-[#c4c5d7] overflow-hidden flex items-center justify-center">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCESjDQDU-UL8AMcdq5EI3hbF3Cm6uiL8PT4S5l_t0Vra8ZWZpsaOEVaELa4QtYPDsZuX5UK4IIR1S6jcgh6wwbtJyplcLSyp6MS_GPGJowUqvf4Rz97V-yokMUsDHgguyR0fcWB5G6tOTj67SF5VfAZp8JNQj2nhUQrydFwlQzs-_imfMCFrdO9X3rJCyQljs9yKdVf9aX8ZDJDK69yVVyLLVFvYSh6Y7Wl95qmYNbIOXPCfRswJv"
                alt="SecOps Admin Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="hidden lg:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-[#131b2e]">王建强 (SecOps Lead)</span>
              <span className="text-[10px] font-mono text-[#747686] mt-0.5">Tier-3 Node • Cluster 01</span>
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute top-10 right-0 w-52 bg-white border border-[#c4c5d7] rounded shadow-lg p-2 z-50 text-xs space-y-1">
              <div className="px-2 py-1.5 border-b border-[#eaedff]">
                <div className="font-semibold text-[#131b2e]">王建强</div>
                <div className="text-[10px] font-mono text-[#747686]">ID: OP-8842 (指挥权激活)</div>
              </div>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-[#eaedff] flex items-center gap-1.5 text-[#131b2e]"
              >
                <span className="material-symbols-outlined text-[15px]">badge</span>
                <span>身份认证与权限</span>
              </button>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left px-2 py-1.5 rounded hover:bg-[#eaedff] flex items-center gap-1.5 text-[#131b2e]"
              >
                <span className="material-symbols-outlined text-[15px]">switch_account</span>
                <span>切换至旁路审计节点</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
