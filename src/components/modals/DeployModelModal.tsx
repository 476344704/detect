import React, { useState } from 'react';

interface DeployModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeploySuccess: (version: string) => void;
}

export const DeployModelModal: React.FC<DeployModelModalProps> = ({
  isOpen,
  onClose,
  onDeploySuccess,
}) => {
  const [selectedVersion, setSelectedVersion] = useState('v2.4.0-candidate');
  const [targetNodes, setTargetNodes] = useState<'gray' | 'all'>('gray');
  const [quantization, setQuantization] = useState<'int8' | 'fp16'>('int8');
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!isOpen) return null;

  const handleDeploy = () => {
    setIsDeploying(true);
    let p = 0;
    const timer = setInterval(() => {
      p += 25;
      setProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsDeploying(false);
          onDeploySuccess(selectedVersion);
          onClose();
        }, 400);
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#c4c5d7] rounded w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="px-4 py-3 bg-[#faf8ff] border-b border-[#c4c5d7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#1d4ed8] text-[20px]">rocket_launch</span>
            <h3 className="font-semibold text-sm text-[#131b2e]">模型一键编译与边缘发布 (Edge Rollout)</h3>
          </div>
          <button onClick={onClose} className="text-[#747686] hover:text-[#131b2e]">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-[#131b2e] mb-1">选择发布版本</label>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="w-full h-8 px-2 bg-[#faf8ff] border border-[#c4c5d7] rounded text-xs text-[#131b2e] outline-none"
            >
              <option value="v2.4.0-candidate">v2.4.0-candidate (Vision-LLM-7B + LoRA Rank 16, mAP 78.4%)</option>
              <option value="v2.3.1-production">v2.3.1-production (YOLOv10-X Master, mAP 74.2%)</option>
              <option value="v2.2.0-legacy">v2.2.0-legacy (RT-Pose-v1)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-[#131b2e] mb-1">分发范围</label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 p-2 rounded border border-[#c4c5d7] cursor-pointer hover:bg-[#faf8ff]">
                  <input
                    type="radio"
                    name="target"
                    checked={targetNodes === 'gray'}
                    onChange={() => setTargetNodes('gray')}
                    className="text-[#1d4ed8]"
                  />
                  <span>灰度验证 (12/128 节点)</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded border border-[#c4c5d7] cursor-pointer hover:bg-[#faf8ff]">
                  <input
                    type="radio"
                    name="target"
                    checked={targetNodes === 'all'}
                    onChange={() => setTargetNodes('all')}
                    className="text-[#1d4ed8]"
                  />
                  <span>全网全量下发 (128/128 节点)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-medium text-[#131b2e] mb-1">推理加速引擎格式</label>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 p-2 rounded border border-[#c4c5d7] cursor-pointer hover:bg-[#faf8ff]">
                  <input
                    type="radio"
                    name="quant"
                    checked={quantization === 'int8'}
                    onChange={() => setQuantization('int8')}
                    className="text-[#1d4ed8]"
                  />
                  <span>TensorRT INT8 (1.42 GB)</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded border border-[#c4c5d7] cursor-pointer hover:bg-[#faf8ff]">
                  <input
                    type="radio"
                    name="quant"
                    checked={quantization === 'fp16'}
                    onChange={() => setQuantization('fp16')}
                    className="text-[#1d4ed8]"
                  />
                  <span>TensorRT FP16 (2.18 GB)</span>
                </label>
              </div>
            </div>
          </div>

          {isDeploying && (
            <div className="p-3 bg-[#f2f3ff] border border-[#c4c5d7] rounded space-y-1.5">
              <div className="flex justify-between font-mono text-[11px]">
                <span>边缘节点拉取镜像与权重中...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-[#eaedff] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1d4ed8] transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2.5 bg-[#faf8ff] border-t border-[#c4c5d7] flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#747686]">分发协议: WireGuard P2P 加密互联</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isDeploying}
              className="px-3 py-1.5 rounded border border-[#c4c5d7] hover:bg-[#eaedff] text-xs font-medium text-[#434655]"
            >
              取消
            </button>
            <button
              onClick={handleDeploy}
              disabled={isDeploying}
              className="px-4 py-1.5 rounded bg-[#1d4ed8] hover:bg-[#0037b0] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span>确认开始下发</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
