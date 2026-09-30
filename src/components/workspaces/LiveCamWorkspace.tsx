import React, { useState, useRef, useEffect } from 'react';
import { Video, Camera, Radio, Shield, Settings, Sliders, Check, Download } from 'lucide-react';

export const LiveCamWorkspace: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [activeLut, setActiveLut] = useState<string>('teal_orange');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showLowerThird, setShowLowerThird] = useState<boolean>(true);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [producerName, setProducerName] = useState<string>('Alex Rivera');
  const [producerRole, setProducerRole] = useState<string>('Executive Studio Producer');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Unmount cleanup to stop camera hardware
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Recording timer
  useEffect(() => {
    let timer: number;
    if (isRecording) {
      timer = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
      setHasPermission(true);
    } catch (err) {
      console.warn('Camera access denied or unavailable, using studio test pattern:', err);
      setHasPermission(false);
      setIsCameraActive(true); // Fallback to simulated studio signal
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setIsRecording(false);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCaptureSnapshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (videoRef.current && hasPermission) {
      ctx.drawImage(videoRef.current, 0, 0, 1280, 720);
    } else {
      // Draw test card
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 1280, 720);
    }

    const link = document.createElement('a');
    link.download = `7camz-livecam-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0e1422] border border-slate-800">
        <div>
          <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <span>LiveCam & OBS Broadcast Suite</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono-numbers">
              Live Feed 1080p
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Real-time camera color grading LUTs, lower-third broadcast graphic overlays, and OBS virtual stream pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm shadow-cyan-400/20"
            >
              <Video className="w-4 h-4" />
              <span>Connect Camera Feed</span>
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Disconnect Camera</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stream Settings & Lower-Third Customizer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Broadcast LUT Filters
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'teal_orange', name: 'Teal & Orange' },
                { id: 'noir', name: 'Film Noir 35mm' },
                { id: 'nordic', name: 'Nordic Slate Cold' },
                { id: 'natural', name: 'Studio Natural' },
              ].map((lut) => (
                <button
                  key={lut.id}
                  onClick={() => setActiveLut(lut.id)}
                  className={`p-2.5 rounded-lg text-left font-semibold border transition-all cursor-pointer ${
                    activeLut === lut.id
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lut.name}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Lower-Third Graphics
              </h3>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Speaker Name</label>
                <input
                  type="text"
                  value={producerName}
                  onChange={(e) => setProducerName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Title / Designation</label>
                <input
                  type="text"
                  value={producerRole}
                  onChange={(e) => setProducerRole(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
              <label className="flex items-center justify-between p-2 rounded bg-slate-950 cursor-pointer">
                <span>Display Rule-of-Thirds Grid</span>
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="accent-cyan-400"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded bg-slate-950 cursor-pointer">
                <span>Show Lower-Third Overlay</span>
                <input
                  type="checkbox"
                  checked={showLowerThird}
                  onChange={(e) => setShowLowerThird(e.target.checked)}
                  className="accent-cyan-400"
                />
              </label>
            </div>

            {/* Snapshot button */}
            <button
              onClick={handleCaptureSnapshot}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Capture Studio Snapshot</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Viewport with Overlays */}
        <div className="lg:col-span-8">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-2xl">
            {/* Real Webcam Video element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-all ${
                activeLut === 'teal_orange'
                  ? 'contrast-125 saturate-125 sepia-25 hue-rotate-15'
                  : activeLut === 'noir'
                  ? 'grayscale contrast-150'
                  : activeLut === 'nordic'
                  ? 'hue-rotate-180 saturate-85 contrast-110'
                  : ''
              } ${isCameraActive && hasPermission ? 'block' : 'hidden'}`}
            />

            {/* Test Pattern / Virtual Studio Signal if camera not active or permission pending */}
            {(!isCameraActive || !hasPermission) && (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0c121e] to-[#121c2d] p-6 text-center">
                <img
                  src="/src/assets/images/sample_portrait_cyber_1790451811965.jpg"
                  alt="Studio Feed Simulation"
                  className="w-40 h-40 rounded-full object-cover border-2 border-cyan-400/40 mb-4 shadow-xl"
                  referrerPolicy="no-referrer"
                />
                <h4 className="text-base font-bold text-white mb-1">
                  7Camz Broadcast Control Monitor
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Connect your local webcam or use this broadcast signal for OBS streaming.
                </p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Start Live Camera
                </button>
              </div>
            )}

            {/* Rule of Thirds Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/10">
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-r border-b border-white/10" />
                <div className="border-b border-white/10" />
                <div className="border-r border-white/10" />
                <div className="border-r border-white/10" />
                <div />
              </div>
            )}

            {/* Top Right Live / Rec Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`px-3 py-1 rounded-full text-xs font-bold font-mono-numbers flex items-center gap-2 transition-all cursor-pointer ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/40'
                    : 'bg-black/60 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span>{isRecording ? `REC ${formatTimer(recordSeconds)}` : 'STANDBY'}</span>
              </button>
            </div>

            {/* Lower-Third Graphic Card */}
            {showLowerThird && (
              <div className="absolute bottom-6 left-6 max-w-md bg-black/85 backdrop-blur-md border-l-4 border-cyan-400 p-3.5 rounded-r-xl shadow-2xl animate-fade-in">
                <div className="text-sm font-extrabold text-white tracking-wide uppercase font-display">
                  {producerName}
                </div>
                <div className="text-xs text-cyan-300 font-medium font-mono-numbers">
                  {producerRole} · 7Camz-STUDIO Live
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
