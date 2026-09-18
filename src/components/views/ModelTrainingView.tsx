import React, { useState, useEffect } from 'react';
import { INITIAL_LOGS, MOCK_REGISTRY } from '../../data/mockData';
import { TrainingLog } from '../../types';

interface ModelTrainingViewProps {
  onOpenDeployModal: () => void;
}

export const ModelTrainingView: React.FC<ModelTrainingViewProps> = ({ onOpenDeployModal }) => {
  const [isTraining, setIsTraining] = useState(true);
  const [currentEpoch, setCurrentEpoch] = useState(45);
  const [step, setStep] = useState(14400);
  const [trainLoss, setTrainLoss] = useState(0.142);
  const [mAP, setMap] = useState(78.4);
  const [logs, setLogs] = useState<TrainingLog[]>(INITIAL_LOGS);
  const [notice, setNotice] = useState<string | null>(null);

  // Hyperparameters
  const [backbone, setBackbone] = useState('Vision-LLM-7B');
  const [dataset, setDataset] = useState('HazMat-Safety-v4');
  const [totalEpochs, setTotalEpochs] = useState(100);
  const [batchSize, setBatchSize] = useState(64);
  const [learningRate, setLearningRate] = useState('3.5e-4');
  const [loraRank, setLoraRank] = useState(16);
  const [loraAlpha, setLoraAlpha] = useState(32);
  const [quantMode, setQuantMode] = useState('int8');

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 2500);
  };

  // Simulated live step progression
  useEffect(() => {
    if (!isTraining) return;
    const interval = setInterval(() => {
      setStep((prev) => {
        const nextStep = prev + 10;
        if (nextStep % 50 === 0) {
          const newLoss = Math.max(0.08, Number((0.142 - (nextStep - 14400) * 0.00005).toFixed(4)));
          setTrainLoss(newLoss);
          const newLog: TrainingLog = {
            timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
            level: 'TRAIN',
            message: `Epoch [${currentEpoch}/${totalEpochs}] [Step ${nextStep}/32000] - lr: ${learningRate} - loss: ${newLoss.toFixed(
              4
            )} - grad_norm: 0.84`,
          };
          setLogs((l) => [...l.slice(-20), newLog]);
        }
        return nextStep;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isTraining, currentEpoch, totalEpochs, learningRate]);

  return (
    <div className="space-y-3 max-w-[1600px] mx-auto pb-6">
      {/* Toast Notice */}
      {notice && (
        <div className="fixed top-14 right-6 z-50 bg-[#131b2e] text-white px-3.5 py-2 rounded shadow-lg border border-[#c4c5d7]/50 font-mono text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
          <span>{notice}</span>
        </div>
      )}

      {/* Top Banner: Active Distributed Job Telemetry */}
      <div className="bg-white border border-[#c4c5d7] rounded p-3.5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-[#eaedff]">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#0037b0] border border-[#c4c5d7] font-mono text-xs font-bold">
                JOB ID: train-run-9842
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-xs font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {isTraining ? 'RUNNING 分布式训练中' : 'PAUSED 已暂停'}
              </span>
            </div>
            <h2 className="text-base font-bold text-[#131b2e] mt-1">
              视觉大模型端侧微调与蒸馏作业 (Vision-LLM-7B + LoRA Adapter)
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                setIsTraining(!isTraining);
                showToast(isTraining ? '训练作业已挂起暂停' : '训练作业已恢复执行');
              }}
              className={`h-8 px-3 rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                isTraining
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isTraining ? 'pause' : 'play_arrow'}
              </span>
              <span>{isTraining ? '暂停训练' : '恢复训练'}</span>
            </button>

            <button
              onClick={() => {
                showToast(`检查点已成功落盘至 S3: s3://argus-checkpoints/v2.4/epoch_${currentEpoch}_step${step}.pt`);
                const saveLog: TrainingLog = {
                  timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
                  level: 'AUTOSAVE',
                  message: `Manual Checkpoint saved: s3://argus-checkpoints/v2.4/manual_epoch_${currentEpoch}.pt (6.4 GB/s)`,
                };
                setLogs((l) => [...l, saveLog]);
              }}
              className="h-8 px-3 rounded bg-white hover:bg-[#eaedff] text-[#131b2e] border border-[#c4c5d7] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px] text-[#0037b0]">save</span>
              <span>存检查点 (Checkpoint)</span>
            </button>

            <button
              onClick={onOpenDeployModal}
              className="h-8 px-3.5 rounded bg-[#1d4ed8] hover:bg-[#0037b0] text-white font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
              <span>边缘发布 (Deploy)</span>
            </button>
          </div>
        </div>

        {/* 4 Telemetry Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
          <div className="p-2.5 bg-[#faf8ff] rounded border border-[#eaedff]">
            <div className="text-[#747686] text-xs font-mono">集群算力利用率</div>
            <div className="text-xl font-bold text-[#131b2e] font-mono mt-0.5">94.2%</div>
            <div className="text-[10px] font-mono text-[#747686] mt-0.5">
              8x H800 (560GB/640GB 显存)
            </div>
          </div>
          <div className="p-2.5 bg-[#faf8ff] rounded border border-[#eaedff]">
            <div className="text-[#747686] text-xs font-mono">训练吞吐速率</div>
            <div className="text-xl font-bold text-[#131b2e] font-mono mt-0.5">1,420 fps</div>
            <div className="text-[10px] font-mono text-[#747686] mt-0.5">RDMA RoCEv2 (890 GB/s)</div>
          </div>
          <div className="p-2.5 bg-[#faf8ff] rounded border border-[#eaedff]">
            <div className="text-[#747686] text-xs font-mono">当前收敛损失 (Loss)</div>
            <div className="text-xl font-bold text-emerald-600 font-mono mt-0.5">
              {trainLoss.toFixed(4)}
            </div>
            <div className="text-[10px] font-mono text-emerald-700 mt-0.5">稳步下降，无梯度爆炸</div>
          </div>
          <div className="p-2.5 bg-[#faf8ff] rounded border border-[#eaedff]">
            <div className="text-[#747686] text-xs font-mono">验证集精度 (mAP@0.5)</div>
            <div className="text-xl font-bold text-[#1d4ed8] font-mono mt-0.5">{mAP}%</div>
            <div className="text-[10px] font-mono text-[#1d4ed8] mt-0.5">相比基准模型 +4.2%</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Config Panel (4 cols) + Right Monitoring & Registry (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Hyperparameter Form (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white border border-[#c4c5d7] rounded p-3.5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#0037b0]">tune</span>
                <h3 className="font-semibold text-xs text-[#131b2e]">超参数与 LoRA 微调配置</h3>
              </div>
              <span className="text-[10px] font-mono text-[#747686]">NCCL 8-GPU 并行</span>
            </div>

            {/* Backbone */}
            <div>
              <label className="block text-xs font-medium text-[#131b2e] mb-1">主干网络基座</label>
              <select
                value={backbone}
                onChange={(e) => setBackbone(e.target.value)}
                className="w-full h-8 px-2 bg-[#faf8ff] border border-[#c4c5d7] rounded text-xs text-[#131b2e] outline-none"
              >
                <option value="Vision-LLM-7B">Vision-LLM-7B (Qwen2-VL 工业预训练)</option>
                <option value="YOLOv10-X">YOLOv10-X (Baseline Master)</option>
                <option value="RT-Pose-v2">RT-Pose-v2 (姿态估计蒸馏版)</option>
              </select>
            </div>

            {/* Dataset */}
            <div>
              <label className="block text-xs font-medium text-[#131b2e] mb-1">训练样本数据集</label>
              <select
                value={dataset}
                onChange={(e) => setDataset(e.target.value)}
                className="w-full h-8 px-2 bg-[#faf8ff] border border-[#c4c5d7] rounded text-xs text-[#131b2e] outline-none"
              >
                <option value="HazMat-Safety-v4">HazMat-Safety-v4 (180万标注帧 + 误报回流)</option>
                <option value="Perimeter-Intrusion-v2">Perimeter-Intrusion-v2 (周界样本库)</option>
                <option value="PPE-Detection-2025">PPE-Detection-2025 (劳保合规检测)</option>
              </select>
            </div>

            {/* Epochs Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#131b2e] font-medium">总迭代轮数 (Epochs)</span>
                <span className="text-[#0037b0] font-bold">{totalEpochs}</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="10"
                value={totalEpochs}
                onChange={(e) => setTotalEpochs(parseInt(e.target.value))}
                className="w-full accent-[#1d4ed8]"
              />
            </div>

            {/* Batch Size & Learning Rate */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-[#131b2e] mb-1">全局 Batch Size</label>
                <input
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value))}
                  className="w-full h-8 px-2 bg-[#faf8ff] border border-[#c4c5d7] rounded text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#131b2e] mb-1">Base LR (AdamW)</label>
                <input
                  type="text"
                  value={learningRate}
                  onChange={(e) => setLearningRate(e.target.value)}
                  className="w-full h-8 px-2 bg-[#faf8ff] border border-[#c4c5d7] rounded text-xs font-mono"
                />
              </div>
            </div>

            {/* LoRA Rank Slider */}
            <div className="pt-2 border-t border-[#eaedff]">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-[#131b2e] font-medium">LoRA 秩 (Rank r)</span>
                <span className="text-[#0037b0] font-bold">r = {loraRank}</span>
              </div>
              <input
                type="range"
                min="4"
                max="64"
                step="4"
                value={loraRank}
                onChange={(e) => setLoraRank(parseInt(e.target.value))}
                className="w-full accent-[#1d4ed8]"
              />
              <div className="text-[10px] font-mono text-[#747686] mt-0.5">
                可训练参数量: ~{(loraRank * 1.18).toFixed(1)}M (占总参 0.26%)
              </div>
            </div>

            {/* Target Quantization */}
            <div>
              <label className="block text-xs font-medium text-[#131b2e] mb-1">端侧推理目标量化</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setQuantMode('int8')}
                  className={`p-2 rounded border text-xs text-left font-mono ${
                    quantMode === 'int8'
                      ? 'border-[#1d4ed8] bg-[#eaedff] text-[#0037b0] font-bold'
                      : 'border-[#c4c5d7] text-[#434655]'
                  }`}
                >
                  <div>TensorRT INT8</div>
                  <div className="text-[10px] text-[#747686]">1.42GB / 11ms</div>
                </button>
                <button
                  type="button"
                  onClick={() => setQuantMode('fp16')}
                  className={`p-2 rounded border text-xs text-left font-mono ${
                    quantMode === 'fp16'
                      ? 'border-[#1d4ed8] bg-[#eaedff] text-[#0037b0] font-bold'
                      : 'border-[#c4c5d7] text-[#434655]'
                  }`}
                >
                  <div>TensorRT FP16</div>
                  <div className="text-[10px] text-[#747686]">2.18GB / 14ms</div>
                </button>
              </div>
            </div>

            <button
              onClick={() => showToast('超参配置已热更新并广播至 8 个 GPU Worker 节点')}
              className="w-full h-8 rounded bg-[#1d4ed8] hover:bg-[#0037b0] text-white text-xs font-medium transition-colors cursor-pointer mt-1"
            >
              热更新超参数 (Apply Hyperparameters)
            </button>
          </div>

          {/* 8-GPU Cluster Nodes Matrix */}
          <div className="bg-white border border-[#c4c5d7] rounded p-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#eaedff]">
              <h4 className="font-semibold text-xs text-[#131b2e] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">memory</span>
                <span>8x NVIDIA H800 节点拓扑</span>
              </h4>
              <span className="text-[10px] font-mono text-emerald-700">8/8 在线</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[10px]">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((gpu) => (
                <div key={gpu} className="p-1.5 bg-[#faf8ff] rounded border border-[#eaedff]">
                  <div className="text-[#747686]">GPU {gpu}</div>
                  <div className="font-bold text-[#131b2e] mt-0.5">94%</div>
                  <div className="text-emerald-700 text-[9px]">72°C</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Monitoring & Registry (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Curve Visualization: Loss & mAP */}
          <div className="bg-white border border-[#c4c5d7] rounded p-3.5 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#0037b0]">show_chart</span>
                <h3 className="font-semibold text-xs text-[#131b2e]">
                  训练收敛曲线与验证集 mAP@0.5 实时演进
                </h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2.5 h-0.5 bg-emerald-500"></span> Train Loss (下降)
                </span>
                <span className="flex items-center gap-1 text-[#1d4ed8]">
                  <span className="w-2.5 h-0.5 bg-[#1d4ed8]"></span> Val mAP (上升)
                </span>
              </div>
            </div>

            <div className="relative w-full h-48 mt-3">
              <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
                {/* Horizontal Guide Lines */}
                <line stroke="#f1f5f9" strokeDasharray="3 3" x1="40" x2="580" y1="20" y2="20" />
                <line stroke="#f1f5f9" strokeDasharray="3 3" x1="40" x2="580" y1="60" y2="60" />
                <line stroke="#f1f5f9" strokeDasharray="3 3" x1="40" x2="580" y1="100" y2="100" />
                <line stroke="#e2e8f0" x1="40" x2="580" y1="140" y2="140" />

                {/* Y Axis Labels */}
                <text className="fill-slate-400 font-mono text-[10px]" x="10" y="24">0.60 / 90%</text>
                <text className="fill-slate-400 font-mono text-[10px]" x="10" y="64">0.40 / 75%</text>
                <text className="fill-slate-400 font-mono text-[10px]" x="10" y="104">0.20 / 60%</text>
                <text className="fill-slate-400 font-mono text-[10px]" x="10" y="144">0.00 / 45%</text>

                {/* Train Loss Curve (Falling) */}
                <path
                  d="M 50 25 C 100 70, 180 110, 300 125 S 480 132, 570 134"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                />

                {/* Val mAP Curve (Rising) */}
                <path
                  d="M 50 135 C 120 110, 200 75, 300 55 S 480 44, 570 42"
                  fill="none"
                  stroke="#1d4ed8"
                  strokeWidth="2.5"
                />

                {/* Current Epoch marker vertical line */}
                <line stroke="#ba1a1a" strokeDasharray="2 2" strokeWidth="1.5" x1="300" x2="300" y1="20" y2="140" />
                <circle cx="300" cy="125" r="4" fill="#10b981" />
                <circle cx="300" cy="55" r="4" fill="#1d4ed8" />
                <text className="fill-[#ba1a1a] font-mono text-[10px] font-bold" x="305" y="32">
                  Epoch 45 (当前)
                </text>
              </svg>
            </div>

            <div className="flex justify-between px-10 text-xs font-mono text-[#747686] mt-1">
              <span>Epoch 0</span>
              <span>Epoch 25</span>
              <span>Epoch 50</span>
              <span>Epoch 75</span>
              <span>Epoch 100</span>
            </div>
          </div>

          {/* Model Registry Table */}
          <div className="bg-white border border-[#c4c5d7] rounded shadow-xs overflow-hidden">
            <div className="px-3.5 py-2.5 bg-[#faf8ff] border-b border-[#eaedff] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#0037b0]">inventory_2</span>
                <h3 className="font-semibold text-xs text-[#131b2e]">模型资产与边缘版本库 (Model Registry)</h3>
              </div>
              <span className="text-[10px] font-mono text-[#747686]">共 3 个历史版本</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="bg-[#faf8ff] text-[#747686] text-[11px] border-b border-[#eaedff]">
                    <th className="py-2 px-3 font-sans">版本号 / 标签</th>
                    <th className="py-2 px-3 font-sans">网络架构</th>
                    <th className="py-2 px-3">mAP@0.5</th>
                    <th className="py-2 px-3">推理时延</th>
                    <th className="py-2 px-3 font-sans">边缘覆盖度</th>
                    <th className="py-2 px-3 font-sans text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaedff]">
                  {MOCK_REGISTRY.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#faf8ff] transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#131b2e] flex items-center gap-1.5">
                          <span>{item.version}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              item.tag === 'LATEST'
                                ? 'bg-blue-100 text-blue-800'
                                : item.tag === 'BASELINE'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.tag}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-[#434655] font-sans">{item.architecture}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#131b2e]">{item.map05}</span>
                        {item.map05Delta && (
                          <span className="text-emerald-600 text-[10px] ml-1">{item.map05Delta}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[#131b2e]">{item.latency}</span>
                        {item.latencyDelta && (
                          <span className="text-emerald-600 text-[10px] ml-1">{item.latencyDelta}</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-sans text-[#434655]">{item.edgeCoverage}</td>
                      <td className="py-2.5 px-3 text-right">
                        {item.canRollout ? (
                          <button
                            onClick={onOpenDeployModal}
                            className="px-2.5 py-1 bg-[#1d4ed8] hover:bg-[#0037b0] text-white rounded text-[11px] font-sans font-medium transition-colors"
                          >
                            一键下发
                          </button>
                        ) : (
                          <span className="text-[#747686] text-[11px] font-sans">现行基准</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Log Console */}
          <div className="bg-[#0f172a] border border-slate-800 rounded p-3 shadow-md font-mono text-[11px] text-slate-300">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-white font-semibold">分布式训练控制台终端实时流 (stdout)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLogs([])}
                  className="text-slate-400 hover:text-white text-[10px]"
                >
                  清空日志
                </button>
              </div>
            </div>

            <div className="space-y-1 max-h-40 overflow-y-auto font-mono text-[10.5px]">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                  <span
                    className={`px-1 py-0.2 rounded-xs text-[9px] font-bold shrink-0 ${
                      log.level === 'TRAIN'
                        ? 'bg-blue-900/60 text-blue-300'
                        : log.level === 'AUTOSAVE'
                        ? 'bg-amber-900/60 text-amber-300'
                        : log.level === 'CHECK'
                        ? 'bg-emerald-900/60 text-emerald-300'
                        : log.level === 'METRICS'
                        ? 'bg-purple-900/60 text-purple-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {log.level}
                  </span>
                  <span className="text-slate-200">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
