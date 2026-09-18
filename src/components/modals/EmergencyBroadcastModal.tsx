import React, { useState } from 'react';

interface EmergencyBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (area: string, message: string) => void;
}

export const EmergencyBroadcastModal: React.FC<EmergencyBroadcastModalProps> = ({
  isOpen,
  onClose,
  onBroadcast,
}) => {
  const [targetZone, setTargetZone] = useState('all');
  const [broadcastType, setBroadcastType] = useState('evacuation');
  const [customMsg, setCustomMsg] = useState('紧急通知：化工反应车间B区出现突发隐患，请有关区域人员立即按预案疏散避险！');
  const [soundAlarm, setSoundAlarm] = useState(true);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      onBroadcast(targetZone, customMsg);
      setSent(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white border-2 border-[#ba1a1a] rounded w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#ffdad6] px-4 py-3 flex items-center justify-between border-b border-[#ba1a1a]/30">
          <div className="flex items-center gap-2 text-[#93000a]">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <h3 className="font-semibold text-sm">全网紧急广播联动控制台 (Emergency Broadcast)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#93000a] hover:bg-[#ba1a1a]/10 rounded p-1"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3.5 text-xs">
          <p className="text-[#434655] leading-relaxed">
            该指令将直接劫持园区内全部公共广播（PA）系统、巡检手持对讲机以及现场扬声器前置机，下发高优先级防爆避险语音指令。
          </p>

          <div>
            <label className="block font-medium text-[#131b2e] mb-1">目标广播覆盖区域</label>
            <select
              value={targetZone}
              onChange={(e) => setTargetZone(e.target.value)}
              className="w-full h-8 px-2.5 bg-[#faf8ff] border border-[#c4c5d7] rounded text-xs text-[#131b2e] outline-none"
            >
              <option value="all">全园区广播通道 (144 路覆盖全域)</option>
              <option value="chemical">化工反应车间B区 &amp; 3号反应塔裙楼</option>
              <option value="storage">危化品储能仓与装卸驳运栈桥</option>
              <option value="perimeter">外围电子围栏周界与安防门禁</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-[#131b2e] mb-1">广播预设模版</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setBroadcastType('evacuation');
                  setCustomMsg('紧急通知：化工反应车间B区出现突发隐患，请有关区域人员立即按预案疏散避险！');
                }}
                className={`p-2 rounded border text-left ${
                  broadcastType === 'evacuation'
                    ? 'border-[#ba1a1a] bg-[#ffdad6]/40 text-[#ba1a1a] font-medium'
                    : 'border-[#c4c5d7] hover:bg-[#faf8ff] text-[#434655]'
                }`}
              >
                🚨 突发险情疏散避险
              </button>
              <button
                type="button"
                onClick={() => {
                  setBroadcastType('perimeter');
                  setCustomMsg('警告：您已进入高压防护警戒禁区，请立即原路退回并出示作业通行证！');
                }}
                className={`p-2 rounded border text-left ${
                  broadcastType === 'perimeter'
                    ? 'border-[#ba1a1a] bg-[#ffdad6]/40 text-[#ba1a1a] font-medium'
                    : 'border-[#c4c5d7] hover:bg-[#faf8ff] text-[#434655]'
                }`}
              >
                ⚠️ 周界禁区入侵驱离
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium text-[#131b2e] mb-1">自定义 TTS 语音播报文本</label>
            <textarea
              rows={3}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full p-2 bg-[#faf8ff] border border-[#c4c5d7] rounded text-xs text-[#131b2e] outline-none font-mono"
            />
          </div>

          <div className="flex items-center justify-between p-2 rounded bg-[#f2f3ff] border border-[#c4c5d7]">
            <span className="font-medium text-[#131b2e]">联动微型消防站声光警报柱鸣响</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={soundAlarm}
                onChange={(e) => setSoundAlarm(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-[#c4c5d7] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-[#ba1a1a]"></div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#faf8ff] border-t border-[#c4c5d7] flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#747686]">高危操作：操作计入不可逆安全审计日志</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded border border-[#c4c5d7] hover:bg-[#eaedff] text-xs font-medium text-[#434655]"
            >
              取消
            </button>
            <button
              onClick={handleSend}
              disabled={sent}
              className="px-4 py-1.5 rounded bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
            >
              {sent ? (
                <>
                  <span className="material-symbols-outlined text-[15px] animate-spin">refresh</span>
                  <span>下发广播指令中...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[15px]">campaign</span>
                  <span>立即启动全网广播</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
