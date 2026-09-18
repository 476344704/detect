import React, { useState } from 'react';
import { CameraNode, PTZState } from '../../types';
import { MOCK_CAMERAS } from '../../data/mockData';

interface RealtimeMonitoringViewProps {
  onOpenSnapshotModal: (snap: { id: string; time: string; title: string; url: string }) => void;
}

export const RealtimeMonitoringView: React.FC<RealtimeMonitoringViewProps> = ({
  onOpenSnapshotModal,
}) => {
  const [cameras, setCameras] = useState<CameraNode[]>(MOCK_CAMERAS);
  const [selectedCamId, setSelectedCamId] = useState<string>('CAM-A1-03');
  const [gridLayout, setGridLayout] = useState<'2x2' | '3x3' | '1x1'>('2x2');
  const [showAiBoxes, setShowAiBoxes] = useState(true);
  const [workshopFilter, setWorkshopFilter] = useState('all');
  const [protocolFilter, setProtocolFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // PTZ State
  const [ptz, setPtz] = useState<PTZState>({
    zoom: 8.5,
    focus: 'auto',
    irNight: false,
    step: 5,
    pan: 124.0,
    tilt: -12.5,
  });

  const selectedCam = cameras.find((c) => c.id === selectedCamId) || cameras[0];

  const triggerNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 2500);
  };

  const handlePtzMove = (direction: string) => {
    setPtz((prev) => {
      let newPan = prev.pan;
      let newTilt = prev.tilt;
      const s = prev.step;
      if (direction.includes('left')) newPan = Math.max(0, newPan - s);
      if (direction.includes('right')) newPan = Math.min(360, newPan + s);
      if (direction.includes('up')) newTilt = Math.min(60, newTilt + s);
      if (direction.includes('down')) newTilt = Math.max(-60, newTilt - s);
      if (direction === 'center') {
        newPan = 180.0;
        newTilt = 0.0;
      }
      return { ...prev, pan: Number(newPan.toFixed(1)), tilt: Number(newTilt.toFixed(1)) };
    });
    triggerNotice(`PTZ 指令已下发: ${direction.toUpperCase()} (步长 ${ptz.step}°)`);
  };

  const handlePresetSelect = (presetName: string, pan: number, tilt: number, zoom: number) => {
    setPtz((prev) => ({ ...prev, pan, tilt, zoom }));
    triggerNotice(`云台已转至预置位: ${presetName}`);
  };

  const handleSnapshot = () => {
    const newSnap = {
      id: `snap-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      title: `${selectedCam.id} 手动瞬态抓拍`,
      url: selectedCam.imageUrl,
    };
    onOpenSnapshotModal(newSnap);
  };

  const filteredCameras = cameras.filter((cam) => {
    if (workshopFilter !== 'all' && cam.workshop !== workshopFilter) return false;
    if (protocolFilter !== 'all' && cam.protocol !== protocolFilter) return false;
    if (
      searchQuery &&
      !cam.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !cam.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !cam.ip.includes(searchQuery)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-3 max-w-[1600px] mx-auto pb-6">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="fixed top-14 right-6 z-50 bg-[#131b2e] text-white px-3.5 py-2 rounded shadow-lg border border-[#c4c5d7]/50 font-mono text-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-[16px]">check_circle</span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter & Toolbar */}
      <div className="bg-white border border-[#c4c5d7] rounded p-2.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Workshop selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#747686] font-medium">车间区域:</span>
            <select
              value={workshopFilter}
              onChange={(e) => setWorkshopFilter(e.target.value)}
              className="h-7 px-2 bg-[#faf8ff] border border-[#c4c5d7] rounded text-xs text-[#131b2e] outline-none"
            >
              <option value="all">全部车间 (4)</option>
              <option value="A1 智能总装车间">A1 智能总装车间 (3)</option>
              <option value="B2 智能立体物流仓">B2 智能立体物流仓 (1)</option>
            </select>
          </div>

          {/* Protocol */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#747686] font-medium">流协议:</span>
            <select
              value={protocolFilter}
              onChange={(e) => setProtocolFilter(e.target.value)}
              className="h-7 px-2 bg-[#faf8ff] border border-[#c4c5d7] rounded text-xs text-[#131b2e] outline-none"
            >
              <option value="all">全部 (RTSP/ONVIF)</option>
              <option value="RTSP">RTSP (UDP/TCP)</option>
              <option value="ONVIF">ONVIF Profile S</option>
            </select>
          </div>

          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              placeholder="快速搜索点位/IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 pl-6 pr-2 bg-[#faf8ff] border border-[#c4c5d7] rounded text-xs outline-none w-44"
            />
            <span className="material-symbols-outlined absolute left-1.5 top-1/2 -translate-y-1/2 text-[14px] text-[#747686]">
              search
            </span>
          </div>

          {/* AI Detection Toggle */}
          <button
            onClick={() => setShowAiBoxes(!showAiBoxes)}
            className={`h-7 px-2.5 rounded border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              showAiBoxes
                ? 'bg-[#eaedff] border-[#1d4ed8] text-[#0037b0] font-medium'
                : 'bg-white border-[#c4c5d7] text-[#747686]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">
              {showAiBoxes ? 'visibility' : 'visibility_off'}
            </span>
            <span>AI 检测框叠加</span>
          </button>
        </div>

        {/* Right Layout Mode & Fullscreen */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center bg-[#faf8ff] border border-[#c4c5d7] rounded p-0.5">
            <button
              onClick={() => setGridLayout('1x1')}
              className={`px-2 py-0.5 rounded text-xs ${
                gridLayout === '1x1' ? 'bg-white shadow-xs font-semibold text-[#1d4ed8]' : 'text-[#747686]'
              }`}
            >
              1x1
            </button>
            <button
              onClick={() => setGridLayout('2x2')}
              className={`px-2 py-0.5 rounded text-xs ${
                gridLayout === '2x2' ? 'bg-white shadow-xs font-semibold text-[#1d4ed8]' : 'text-[#747686]'
              }`}
            >
              2x2 (4路)
            </button>
            <button
              onClick={() => setGridLayout('3x3')}
              className={`px-2 py-0.5 rounded text-xs ${
                gridLayout === '3x3' ? 'bg-white shadow-xs font-semibold text-[#1d4ed8]' : 'text-[#747686]'
              }`}
            >
              3x3 (9路)
            </button>
          </div>

          <button
            onClick={() => triggerNotice('已激活全屏多路巡检模式 (ESC 退出)')}
            className="h-7 px-2.5 bg-white border border-[#c4c5d7] hover:bg-[#eaedff] text-[#434655] rounded flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">fullscreen</span>
            <span>全屏巡检</span>
          </button>
        </div>
      </div>

      {/* Main Container: Video Grid (Left) + PTZ Controls (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Video Wall (8 or 9 cols) */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-3">
          <div
            className={`grid gap-2.5 ${
              gridLayout === '1x1'
                ? 'grid-cols-1'
                : gridLayout === '2x2'
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {(gridLayout === '1x1' ? [selectedCam] : filteredCameras).map((cam) => {
              const isSelected = cam.id === selectedCamId;
              const isAlert = cam.status === 'alert';

              return (
                <div
                  key={cam.id}
                  onClick={() => setSelectedCamId(cam.id)}
                  className={`group relative bg-black rounded overflow-hidden cursor-pointer transition-all border-2 ${
                    isAlert
                      ? 'border-rose-500 shadow-md shadow-rose-500/20'
                      : isSelected
                      ? 'border-[#1d4ed8] shadow-md shadow-blue-500/20'
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                  style={{ minHeight: gridLayout === '1x1' ? '540px' : '280px' }}
                >
                  {/* Camera Image Stream */}
                  <img
                    src={cam.imageUrl}
                    alt={cam.name}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />

                  {/* AI Bounding Boxes (if enabled) */}
                  {showAiBoxes &&
                    cam.aiBoxes.map((box, idx) => (
                      <div
                        key={idx}
                        className={`absolute border-2 pointer-events-none transition-all ${
                          box.color === 'emerald'
                            ? 'border-emerald-400 bg-emerald-500/10'
                            : box.color === 'sky'
                            ? 'border-sky-400 bg-sky-500/10'
                            : box.color === 'rose'
                            ? 'border-rose-500 bg-rose-500/20 animate-pulse'
                            : 'border-amber-400 bg-amber-500/10'
                        }`}
                        style={{
                          top: box.top,
                          left: box.left,
                          width: box.width,
                          height: box.height,
                        }}
                      >
                        <span
                          className={`absolute -top-5 left-0 px-1 py-0.2 text-[9px] font-mono font-bold whitespace-nowrap rounded-xs ${
                            box.color === 'emerald'
                              ? 'bg-emerald-700 text-white'
                              : box.color === 'sky'
                              ? 'bg-sky-700 text-white'
                              : box.color === 'rose'
                              ? 'bg-rose-700 text-white'
                              : 'bg-amber-600 text-white'
                          }`}
                        >
                          {box.label} ({box.confidence})
                        </span>
                      </div>
                    ))}

                  {/* Top Bar Overlay */}
                  <div className="absolute top-0 left-0 right-0 p-2 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between text-white text-[11px] font-mono pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isAlert ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
                        }`}
                      ></span>
                      <span className="font-semibold text-white tracking-wide">{cam.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-black/60 text-slate-300 border border-slate-700 text-[9px]">
                        {cam.protocol}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400">{cam.fps.toFixed(1)} FPS</span>
                      <span className="text-slate-400">{cam.resolution}</span>
                    </div>
                  </div>

                  {/* Bottom Bar Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center justify-between text-white text-[10px] font-mono pointer-events-none">
                    <span className="text-slate-300">{cam.location}</span>
                    <span className="text-slate-400">{cam.bitrate}</span>
                  </div>

                  {/* Active Selection Indicator Ribbon */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#1d4ed8] text-white font-mono text-[9px] rounded font-semibold tracking-wider">
                      PTZ 聚焦中
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Stream Status Strip */}
          <div className="bg-white border border-[#c4c5d7] rounded p-2.5 flex items-center justify-between text-xs font-mono text-[#747686] shadow-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>边缘网关: H.265 硬解码就绪</span>
              </span>
              <span>•</span>
              <span>平均端到端时延: 13.8ms</span>
              <span>•</span>
              <span>码流总吞吐: 15.9 Mbps</span>
            </div>
            <div className="text-[#131b2e] font-semibold">
              当前选定: {selectedCam.id} ({selectedCam.ip})
            </div>
          </div>
        </div>

        {/* Right PTZ Control Panel (4 or 3 cols) */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-3">
          <div className="bg-white border border-[#c4c5d7] rounded shadow-xs overflow-hidden">
            {/* Header */}
            <div className="px-3.5 py-2.5 bg-[#faf8ff] border-b border-[#eaedff] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-xs text-[#131b2e] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#0037b0]">videocam</span>
                  <span>云台姿态与镜头控制 (PTZ)</span>
                </h3>
                <div className="text-[10px] font-mono text-[#747686] mt-0.5">
                  {selectedCam.id} • {selectedCam.ip}
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-semibold">
                ONVIF 就绪
              </span>
            </div>

            <div className="p-3 space-y-3 text-xs">
              {/* Virtual Joystick / 8-Way D-Pad */}
              <div className="flex flex-col items-center">
                <div className="text-[10px] font-mono text-[#747686] mb-2 flex items-center gap-2">
                  <span>水平 Pan: <strong className="text-[#131b2e]">{ptz.pan}°</strong></span>
                  <span>垂直 Tilt: <strong className="text-[#131b2e]">{ptz.tilt}°</strong></span>
                </div>

                <div className="relative w-36 h-36 bg-[#f2f3ff] border border-[#c4c5d7] rounded-full flex items-center justify-center shadow-inner">
                  {/* Up */}
                  <button
                    onClick={() => handlePtzMove('up')}
                    className="absolute top-1 w-8 h-8 rounded-full hover:bg-[#eaedff] active:bg-[#dce1ff] text-[#131b2e] flex items-center justify-center transition-colors cursor-pointer"
                    title="向上仰视"
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                  </button>
                  {/* Down */}
                  <button
                    onClick={() => handlePtzMove('down')}
                    className="absolute bottom-1 w-8 h-8 rounded-full hover:bg-[#eaedff] active:bg-[#dce1ff] text-[#131b2e] flex items-center justify-center transition-colors cursor-pointer"
                    title="向下俯视"
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                  </button>
                  {/* Left */}
                  <button
                    onClick={() => handlePtzMove('left')}
                    className="absolute left-1 w-8 h-8 rounded-full hover:bg-[#eaedff] active:bg-[#dce1ff] text-[#131b2e] flex items-center justify-center transition-colors cursor-pointer"
                    title="向左偏航"
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_left</span>
                  </button>
                  {/* Right */}
                  <button
                    onClick={() => handlePtzMove('right')}
                    className="absolute right-1 w-8 h-8 rounded-full hover:bg-[#eaedff] active:bg-[#dce1ff] text-[#131b2e] flex items-center justify-center transition-colors cursor-pointer"
                    title="向右偏航"
                  >
                    <span className="material-symbols-outlined text-[18px]">keyboard_arrow_right</span>
                  </button>
                  {/* Center / Home */}
                  <button
                    onClick={() => handlePtzMove('center')}
                    className="w-11 h-11 bg-white border border-[#c4c5d7] rounded-full hover:bg-[#eaedff] active:scale-95 text-[#0037b0] flex flex-col items-center justify-center font-mono text-[9px] font-bold shadow-xs transition-all cursor-pointer"
                    title="回原点居中"
                  >
                    <span className="material-symbols-outlined text-[15px]">center_focus_strong</span>
                    <span>HOME</span>
                  </button>
                </div>

                {/* Step selection */}
                <div className="mt-2.5 flex items-center gap-1 font-mono text-[11px]">
                  <span className="text-[#747686]">步长:</span>
                  {[1, 5, 10, 15].map((s) => (
                    <button
                      key={s}
                      onClick={() => setPtz((prev) => ({ ...prev, step: s }))}
                      className={`px-1.5 py-0.5 rounded border ${
                        ptz.step === s
                          ? 'bg-[#1d4ed8] text-white border-[#1d4ed8]'
                          : 'bg-[#faf8ff] text-[#434655] border-[#c4c5d7]'
                      }`}
                    >
                      {s}°
                    </button>
                  ))}
                </div>
              </div>

              {/* Optical Zoom Slider */}
              <div className="pt-2 border-t border-[#eaedff] space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#747686]">光学变焦 (Zoom):</span>
                  <span className="text-[#131b2e] font-bold">{ptz.zoom.toFixed(1)}x</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPtz((prev) => ({ ...prev, zoom: Math.max(1, prev.zoom - 1) }))}
                    className="w-6 h-6 rounded border border-[#c4c5d7] flex items-center justify-center hover:bg-[#faf8ff]"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={ptz.zoom}
                    onChange={(e) => setPtz({ ...ptz, zoom: parseFloat(e.target.value) })}
                    className="flex-1 accent-[#1d4ed8]"
                  />
                  <button
                    onClick={() => setPtz((prev) => ({ ...prev, zoom: Math.min(30, prev.zoom + 1) }))}
                    className="w-6 h-6 rounded border border-[#c4c5d7] flex items-center justify-center hover:bg-[#faf8ff]"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Infrared Night Vision & Focus */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setPtz((prev) => ({ ...prev, irNight: !prev.irNight }));
                    triggerNotice(`红外夜视补光已${!ptz.irNight ? '开启' : '关闭'}`);
                  }}
                  className={`p-2 rounded border text-left flex items-center gap-1.5 transition-colors cursor-pointer ${
                    ptz.irNight
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-medium'
                      : 'bg-[#faf8ff] border-[#c4c5d7] text-[#434655]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">nightlight</span>
                  <span>红外补光 {ptz.irNight ? '开' : '关'}</span>
                </button>

                <button
                  onClick={() => triggerNotice('自动对焦算法已完成二次校准')}
                  className="p-2 rounded border border-[#c4c5d7] bg-[#faf8ff] hover:bg-[#eaedff] text-left flex items-center gap-1.5 text-[#434655] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">filter_center_focus</span>
                  <span>自动校焦 (AF)</span>
                </button>
              </div>

              {/* Presets List */}
              <div className="pt-2 border-t border-[#eaedff]">
                <div className="text-xs font-semibold text-[#131b2e] mb-1.5 flex items-center justify-between">
                  <span>预置位快捷巡航 (Presets)</span>
                  <button
                    onClick={() => triggerNotice('当前角度已保存至新预置位 #05')}
                    className="text-[11px] text-[#1d4ed8] hover:underline"
                  >
                    + 存当前位
                  </button>
                </div>
                <div className="space-y-1">
                  {[
                    { name: '01 进料主闸口 (默认巡检)', pan: 124.0, tilt: -12.5, zoom: 8.5 },
                    { name: '02 机器人机械臂作业包络', pan: 180.0, tilt: -24.0, zoom: 14.0 },
                    { name: '03 物料周转接驳台', pan: 88.5, tilt: -5.0, zoom: 4.0 },
                    { name: '04 紧急消防栓与防爆隔离柜', pan: 310.0, tilt: 10.0, zoom: 18.0 },
                  ].map((p, i) => (
                    <button
                      key={i}
                      onClick={() => handlePresetSelect(p.name, p.pan, p.tilt, p.zoom)}
                      className="w-full text-left p-1.5 rounded hover:bg-[#eaedff] border border-transparent hover:border-[#c4c5d7] flex items-center justify-between font-mono text-[11px] transition-colors"
                    >
                      <span className="text-[#131b2e] font-sans truncate">{p.name}</span>
                      <span className="text-[#747686] shrink-0 text-[10px]">{p.pan}° / {p.zoom}x</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions (Snapshot & Siren) */}
              <div className="pt-2 border-t border-[#eaedff] grid grid-cols-2 gap-2">
                <button
                  onClick={handleSnapshot}
                  className="h-8 rounded bg-[#1d4ed8] hover:bg-[#0037b0] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                  <span>高清单帧抓拍</span>
                </button>
                <button
                  onClick={() => triggerNotice('就地防爆声光警报已触发鸣响！')}
                  className="h-8 rounded bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">volume_up</span>
                  <span>就地声光警示</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
