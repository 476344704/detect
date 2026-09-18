import React from 'react';

interface SnapshotPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshot: { id: string; time: string; title: string; url: string } | null;
}

export const SnapshotPreviewModal: React.FC<SnapshotPreviewModalProps> = ({
  isOpen,
  onClose,
  snapshot,
}) => {
  if (!isOpen || !snapshot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-[#131b2e] border border-[#747686] rounded w-full max-w-2xl shadow-2xl overflow-hidden text-white">
        <div className="px-4 py-3 bg-[#283044] flex items-center justify-between border-b border-[#747686]/40">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-emerald-400">photo_camera</span>
            <span className="font-semibold text-sm">抓拍瞬态高清全景取样</span>
            <span className="text-xs font-mono text-slate-300">[{snapshot.time}]</span>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-white">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 flex flex-col items-center">
          <div className="relative w-full h-80 bg-black rounded overflow-hidden flex items-center justify-center border border-slate-700">
            <img
              src={snapshot.url}
              alt={snapshot.title}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-2 left-2 bg-black/80 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-xs">
              RAW FRAME • 3840x2160 • H.265
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 text-emerald-400 font-mono text-[10px] px-2 py-0.5 rounded border border-emerald-500/40">
              {snapshot.title}
            </div>
          </div>

          <div className="w-full mt-3 flex items-center justify-between text-xs text-slate-300 font-mono">
            <span>SHA-256 存证数字指纹: 8f9c31d042...9a</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  alert('存证高清图像已保存至下载目录');
                }}
                className="px-3 py-1 bg-[#1d4ed8] hover:bg-[#0037b0] text-white rounded font-sans text-xs transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                <span>下载原图存证</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
