import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Crosshair, RotateCcw, Sliders, Radio, Activity, Compass } from 'lucide-react';

type SimMode = 'sub-array' | 'delay-tower' | 'signal-generator';

interface SubPreset {
  id: string;
  name: string;
  description: string;
  freqHz: number;
  spacingM: number;
  delayMs: number;
  invertSub2: boolean;
  orientation: 'front-back' | 'left-right';
}

const SUB_PRESETS: SubPreset[] = [
  {
    id: 'end-fire',
    name: 'End-Fire (λ/4 em Linha)',
    description: '2 fileiras apontadas para a frente espaçadas em 1/4 de onda com delay progressivo na caixa frontal.',
    freqHz: 63,
    spacingM: 1.36,
    delayMs: 3.96,
    invertSub2: false,
    orientation: 'front-back',
  },
  {
    id: 'cardioid-csa',
    name: 'Cardióide Invertido (CSA)',
    description: 'Caixa traseira voltada para o palco com polaridade 180° e delay igual ao espaçamento físico.',
    freqHz: 63,
    spacingM: 1.36,
    delayMs: 3.96,
    invertSub2: true,
    orientation: 'front-back',
  },
  {
    id: 'lr-power-alley',
    name: 'L/R Separados (Becos de Energia)',
    description: 'Subs separados nas laterais do palco (6m) criando lóbulos e vales de cancelamento fora do eixo central.',
    freqHz: 63,
    spacingM: 6.0,
    delayMs: 0.0,
    invertSub2: false,
    orientation: 'left-right',
  },
  {
    id: 'mono-center',
    name: 'Monobloco Central Acoplado',
    description: 'Caixas coladas no centro (0.6m) operando em fase para cobertura omnidirecional uniforme sem nulos.',
    freqHz: 63,
    spacingM: 0.6,
    delayMs: 0.0,
    invertSub2: false,
    orientation: 'left-right',
  },
];

export const AcousticSimulator: React.FC = () => {
  const [simMode, setSimMode] = useState<SimMode>('sub-array');

  // --- MODE 1: SUBWOOFER 2D INTERFERENCE & POLAR SANDBOX ---
  const [activePresetId, setActivePresetId] = useState<string>('end-fire');
  const [freqHz, setFreqHz] = useState<number>(63);
  const [tempC, setTempC] = useState<number>(21);
  const [spacingM, setSpacingM] = useState<number>(1.36);
  const [delayMs, setDelayMs] = useState<number>(3.96);
  const [invertSub2, setInvertSub2] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<'front-back' | 'left-right'>('front-back');
  // Virtual Measurement Mic position in venue coordinates (meters: x in [-10, 10], y in [-6, 14])
  const [micPos, setMicPos] = useState<{ x: number; y: number }>({ x: 0, y: 8.5 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const polarCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Speed of sound & wavelength calculations
  const speedOfSound = 331.4 + 0.6 * tempC;
  const wavelengthM = speedOfSound / freqHz;
  const quarterWaveM = wavelengthM / 4;
  const quarterWaveDelayMs = (quarterWaveM / speedOfSound) * 1000;

  // Apply preset
  const applySubPreset = (preset: SubPreset) => {
    setActivePresetId(preset.id);
    setFreqHz(preset.freqHz);
    setSpacingM(preset.spacingM);
    setDelayMs(preset.delayMs);
    setInvertSub2(preset.invertSub2);
    setOrientation(preset.orientation);
  };

  // Auto-optimize for current frequency and temperature
  const autoAlignQuarterWave = () => {
    const optSpacing = Number((wavelengthM / 4).toFixed(2));
    const optDelay = Number(((optSpacing / speedOfSound) * 1000).toFixed(2));
    setSpacingM(optSpacing);
    setDelayMs(optDelay);
    setOrientation('front-back');
  };

  // Compute source coordinates in meters
  // Stage center is at (0, 0). Audience is y > 0 (downwards on screen), Stage rear is y < 0 (upwards on screen)
  const getSourcePositions = useCallback(() => {
    if (orientation === 'front-back') {
      return {
        s1: { x: 0, y: 0 }, // Rear reference subwoofer
        s2: { x: 0, y: spacingM }, // Front subwoofer (towards audience)
      };
    } else {
      return {
        s1: { x: -spacingM / 2, y: 0 }, // Left subwoofer
        s2: { x: spacingM / 2, y: 0 }, // Right subwoofer
      };
    }
  }, [orientation, spacingM]);

  // Calculate complex acoustic summation at point (px, py)
  const evaluatePointAcoustics = useCallback(
    (px: number, py: number) => {
      const { s1, s2 } = getSourcePositions();
      const d1 = Math.max(0.35, Math.hypot(px - s1.x, py - s1.y));
      const d2 = Math.max(0.35, Math.hypot(px - s2.x, py - s2.y));

      const k = (2 * Math.PI * freqHz) / speedOfSound;
      const omega = 2 * Math.PI * freqHz;
      const tau2 = delayMs / 1000;
      const pol2 = invertSub2 ? Math.PI : 0;

      const phi1 = k * d1;
      const phi2 = k * d2 + omega * tau2 + pol2;

      // Amplitude with distance attenuation (normalized to 1m reference)
      const a1 = 1 / Math.sqrt(d1);
      const a2 = 1 / Math.sqrt(d2);

      const re = a1 * Math.cos(phi1) + a2 * Math.cos(phi2);
      const im = a1 * Math.sin(phi1) + a2 * Math.sin(phi2);
      const mag = Math.hypot(re, im);

      // Relative phase difference between the two waves at the point (0° to 180°)
      let deltaDeg = (Math.abs(phi1 - phi2) * 180) / Math.PI;
      deltaDeg = deltaDeg % 360;
      if (deltaDeg > 180) deltaDeg = 360 - deltaDeg;

      // Relative summation gain compared to a single speaker at same midpoint distance
      const avgAmp = (a1 + a2) / 2;
      const relativeDb = 20 * Math.log10(Math.max(0.05, mag / avgAmp));

      return { d1, d2, deltaDeg, relativeDb, mag };
    },
    [getSourcePositions, freqHz, speedOfSound, delayMs, invertSub2]
  );

  // Draw 2D Sound Field Canvas
  useEffect(() => {
    if (simMode !== 'sub-array') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Coordinate mapping: x in [-11m, +11m], y in [-6m (stage rear), +15m (audience front)]
    const xMin = -11;
    const xMax = 11;
    const yMin = -6;
    const yMax = 15;

    const toWorldX = (px: number) => xMin + (px / width) * (xMax - xMin);
    const toWorldY = (py: number) => yMin + (py / height) * (yMax - yMin);
    const toScreenX = (wx: number) => ((wx - xMin) / (xMax - xMin)) * width;
    const toScreenY = (wy: number) => ((wy - yMin) / (yMax - yMin)) * height;

    // Render acoustic pressure field on a 4px grid for fast 60fps interaction
    const step = 4;
    for (let py = 0; py < height; py += step) {
      const wy = toWorldY(py);
      for (let px = 0; px < width; px += step) {
        const wx = toWorldX(px);
        const { relativeDb } = evaluatePointAcoustics(wx, wy);

        // Map relativeDb (-18 dB to +6 dB) to clean acoustic thermal palette
        // +6 dB (Constructive sum): Warm Amber/Gold
        // 0 dB (Nominal): Deep Cyan/Azure
        // -12 dB (Cancellation null): Dark Slate/Indigo
        let r = 15;
        let g = 23;
        let b = 42;

        if (relativeDb >= 2.0) {
          // Constructive zone (+2 to +6 dB)
          const t = Math.min(1, (relativeDb - 2.0) / 4.0);
          r = Math.round(14 + t * 231); // -> 245 (Amber 500)
          g = Math.round(116 + t * 42); // -> 158
          b = Math.round(144 - t * 133); // -> 11
        } else if (relativeDb >= -4.0) {
          // Nominal transition zone (-4 to +2 dB)
          const t = (relativeDb + 4.0) / 6.0;
          r = Math.round(15 + t * 0);
          g = Math.round(35 + t * 81);
          b = Math.round(65 + t * 79);
        } else {
          // Cancellation zone (-18 to -4 dB)
          const t = Math.max(0, (relativeDb + 18.0) / 14.0);
          r = Math.round(9 + t * 6);
          g = Math.round(13 + t * 22);
          b = Math.round(24 + t * 41);
        }

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(px, py, step, step);
      }
    }

    // Draw metric grid lines every 2 meters
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let gx = -10; gx <= 10; gx += 2) {
      const sx = toScreenX(gx);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
    }
    for (let gy = -4; gy <= 14; gy += 2) {
      const sy = toScreenY(gy);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
    }

    // Draw Stage Boundary Line (y = -0.5m)
    const stageLineY = toScreenY(-0.5);
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.35)';
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, stageLineY);
    ctx.lineTo(width, stageLineY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels for Stage vs Audience
    ctx.font = '600 11px "IBM Plex Mono", monospace';
    ctx.fillStyle = 'rgba(248, 250, 252, 0.7)';
    ctx.fillText('PALCO (ÁREA DE REJEIÇÃO TRASEIRA)', 14, stageLineY - 10);
    ctx.fillText('PLATEIA / HOUSE MIX (EIXO DE RADIAÇÃO 0°)', 14, height - 12);

    // Draw Subwoofer Enclosures
    const { s1, s2 } = getSourcePositions();
    const drawSub = (pos: { x: number; y: number }, label: string, inverted: boolean) => {
      const sx = toScreenX(pos.x);
      const sy = toScreenY(pos.y);
      ctx.save();
      ctx.fillStyle = inverted ? '#EF4444' : '#F8FAFC';
      ctx.strokeStyle = '#0B0F17';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(sx - 13, sy - 9, 26, 18, 4);
      ctx.fill();
      ctx.stroke();

      ctx.font = '600 10px "IBM Plex Mono", monospace';
      ctx.fillStyle = '#0B0F17';
      ctx.textAlign = 'center';
      ctx.fillText(label, sx, sy + 3.5);
      ctx.restore();
    };

    drawSub(s1, 'S1', false);
    drawSub(s2, invertSub2 ? 'S2Ø' : 'S2', invertSub2);

    // Draw Virtual Measurement Microphone (RTA Probe)
    const mx = toScreenX(micPos.x);
    const my = toScreenY(micPos.y);

    // Dashed distance lines from S1 & S2 to Mic
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(toScreenX(s1.x), toScreenY(s1.y));
    ctx.lineTo(mx, my);
    ctx.moveTo(toScreenX(s2.x), toScreenY(s2.y));
    ctx.lineTo(mx, my);
    ctx.stroke();
    ctx.setLineDash([]);

    // Mic target reticle
    ctx.beginPath();
    ctx.arc(mx, my, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(11, 15, 23, 0.85)';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#38BDF8';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mx, my, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#38BDF8';
    ctx.fill();

    ctx.font = '600 11px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#38BDF8';
    ctx.fillText(`MIC RTA (${micPos.x.toFixed(1)}m, ${micPos.y.toFixed(1)}m)`, mx + 14, my + 4);
  }, [simMode, evaluatePointAcoustics, getSourcePositions, invertSub2, micPos]);

  // Draw Polar Directivity Diagram
  useEffect(() => {
    if (simMode !== 'sub-array') return;
    const canvas = polarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const maxR = Math.min(cx, cy) - 22;

    ctx.clearRect(0, 0, w, h);

    // Concentric dB rings (0 dB, -6 dB, -12 dB, -18 dB)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75, 1.0].forEach((ratio) => {
      ctx.beginPath();
      ctx.arc(cx, cy, maxR * ratio, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(cx, cy - maxR);
    ctx.lineTo(cx, cy + maxR);
    ctx.moveTo(cx - maxR, cy);
    ctx.lineTo(cx + maxR, cy);
    ctx.stroke();

    ctx.font = '600 10px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'center';
    ctx.fillText('180° PALCO', cx, 13);
    ctx.fillText('0° PLATEIA', cx, h - 5);

    // Evaluate far-field polar pattern at radius R = 25m
    ctx.beginPath();
    for (let deg = 0; deg <= 360; deg += 2) {
      // Angle 0° points down (0, +1), Angle 180° points up (0, -1)
      const rad = (deg * Math.PI) / 180;
      const wx = Math.sin(rad) * 25;
      const wy = Math.cos(rad) * 25;
      const { relativeDb } = evaluatePointAcoustics(wx, wy);
      // Map relativeDb [-18..+6] to radius [0..maxR]
      const norm = Math.max(0.08, Math.min(1, (relativeDb + 18) / 24));
      const r = norm * maxR;
      const px = cx + Math.sin(rad) * r;
      const py = cy + Math.cos(rad) * r;
      if (deg === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(245, 158, 11, 0.22)';
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [simMode, evaluatePointAcoustics]);

  // Handle clicking/dragging on the 2D canvas to move the Virtual RTA Mic
  const handleCanvasPointer = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const wx = -11 + (px / rect.width) * 22;
    const wy = -6 + (py / rect.height) * 21;
    setMicPos({
      x: Number(Math.max(-10, Math.min(10, wx)).toFixed(1)),
      y: Number(Math.max(-5, Math.min(14, wy)).toFixed(1)),
    });
  };

  const micMetrics = evaluatePointAcoustics(micPos.x, micPos.y);
  const frontAxisMetrics = evaluatePointAcoustics(0, 12);
  const rearStageMetrics = evaluatePointAcoustics(0, -4);
  const frontToBackRatioDb = Math.max(0, frontAxisMetrics.relativeDb - rearStageMetrics.relativeDb);

  // --- MODE 2: DELAY TOWER ALIGNMENT & SPL CALCULATOR ---
  const [paSplAt1m, setPaSplAt1m] = useState<number>(136);
  const [towerDistanceM, setTowerDistanceM] = useState<number>(35);
  const [haasEffectMs, setHaasEffectMs] = useState<number>(12);
  const [propagationType, setPropagationType] = useState<'line-array' | 'point-source'>('line-array');

  const acousticFlightMs = (towerDistanceM / speedOfSound) * 1000;
  const totalTowerDelayMs = acousticFlightMs + haasEffectMs;
  const attenuationFactor = propagationType === 'line-array' ? 10 : 20;
  const splAtTowerPosition = paSplAt1m - attenuationFactor * Math.log10(Math.max(1, towerDistanceM));
  const splAtFoh25m = paSplAt1m - attenuationFactor * Math.log10(25);

  // --- MODE 3: REAL WEB AUDIO API TEST SIGNAL GENERATOR ---
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [signalType, setSignalType] = useState<'sine' | 'pink-noise'>('sine');
  const [genFreqHz, setGenFreqHz] = useState<number>(100);
  const [genVolumeDb, setGenVolumeDb] = useState<number>(-18);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscNodeRef = useRef<OscillatorNode | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const stopSignalGenerator = useCallback(() => {
    try {
      if (oscNodeRef.current) {
        oscNodeRef.current.stop();
        oscNodeRef.current.disconnect();
        oscNodeRef.current = null;
      }
      if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
        noiseNodeRef.current.disconnect();
        noiseNodeRef.current = null;
      }
    } catch {
      // ignore if already stopped
    }
    setIsAudioPlaying(false);
  }, []);

  const startSignalGenerator = useCallback(
    (type: 'sine' | 'pink-noise', freq: number, volDb: number) => {
      stopSignalGenerator();
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const gain = ctx.createGain();
      gain.gain.value = Math.pow(10, volDb / 20);
      gain.connect(ctx.destination);
      gainNodeRef.current = gain;

      if (type === 'sine') {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.connect(gain);
        osc.start();
        oscNodeRef.current = osc;
      } else {
        // Paul Kellet's Pink Noise filter algorithm (-3 dB/octave)
        const bufferSize = ctx.sampleRate * 3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        noise.connect(gain);
        noise.start();
        noiseNodeRef.current = noise;
      }

      setIsAudioPlaying(true);
    },
    [stopSignalGenerator]
  );

  // Live update frequency & gain when sliders move
  useEffect(() => {
    if (oscNodeRef.current && audioCtxRef.current) {
      oscNodeRef.current.frequency.setValueAtTime(genFreqHz, audioCtxRef.current.currentTime);
    }
  }, [genFreqHz]);

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(Math.pow(10, genVolumeDb / 20), audioCtxRef.current.currentTime);
    }
  }, [genVolumeDb]);

  useEffect(() => {
    return () => {
      stopSignalGenerator();
    };
  }, [stopSignalGenerator]);

  return (
    <section className="space-y-6">
      {/* Section Header & Segmented Mode Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs font-mono text-amber-400 mb-1">
            Laboratório Interativo de Engenharia Acústica · Tempo Real
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
            Simulador de Acústica, Fase e Alinhamento
          </h2>
        </div>

        {/* Interactive Filter Tabs (No horizontal scrollbar; wraps cleanly) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setSimMode('sub-array')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[40px] flex items-center gap-2 ${
              simMode === 'sub-array'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            Arranjos de Sub 2D
          </button>
          <button
            type="button"
            onClick={() => setSimMode('delay-tower')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[40px] flex items-center gap-2 ${
              simMode === 'delay-tower'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4 shrink-0" />
            Torres de Delay & SPL
          </button>
          <button
            type="button"
            onClick={() => setSimMode('signal-generator')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[40px] flex items-center gap-2 ${
              simMode === 'signal-generator'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4 shrink-0" />
            Gerador de Áudio RTA
          </button>
        </div>
      </div>

      {/* MODE 1: SUBWOOFER 2D INTERFERENCE SANDBOX */}
      {simMode === 'sub-array' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Cols: Interactive Stage Canvas (Two-Zone Sandbox Layout) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-slate-100">
                  Mapa de Pressão Sonora 2D e Sonda RTA Virtual
                </h3>
                <p className="text-xs text-slate-400">
                  Clique em qualquer ponto do palco ou da plateia para posicionar o microfone de medição
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-slate-300">
                <span>● +6 dB Soma</span>
                <span>·</span>
                <span>▲ 0 dB Nominal</span>
                <span>·</span>
                <span>■ -15 dB Nulo</span>
              </div>
            </div>

            {/* Main 2D Wave Interference Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <canvas
                ref={canvasRef}
                width={620}
                height={380}
                onClick={handleCanvasPointer}
                className="w-full h-[290px] sm:h-[360px] cursor-crosshair block"
              />
            </div>

            {/* Bottom Readout Strip for the Virtual Measurement Mic + Polar Plot */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2 border-t border-slate-800/80 items-center">
              <div className="sm:col-span-7 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                  <Crosshair className="w-4 h-4 shrink-0" />
                  <span>LEITURA DO MICROFONE RTA EM ({micPos.x.toFixed(1)}m, {micPos.y.toFixed(1)}m)</span>
                </div>
                <div className="grid grid-cols-3 gap-3 font-mono tabular-nums">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="text-[11px] text-slate-400">Diferença Fase</div>
                    <div className="text-base font-semibold text-slate-100">
                      {micMetrics.deltaDeg.toFixed(0)}°
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="text-[11px] text-slate-400">Resultado SPL</div>
                    <div
                      className={`text-base font-semibold ${
                        micMetrics.relativeDb >= 1.5
                          ? 'text-emerald-400'
                          : micMetrics.relativeDb <= -5
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {micMetrics.relativeDb >= 0 ? '+' : ''}
                      {micMetrics.relativeDb.toFixed(1)} dB
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <div className="text-[11px] text-slate-400">Rejeição Palco</div>
                    <div className="text-base font-semibold text-amber-400">
                      -{frontToBackRatioDb.toFixed(1)} dB
                    </div>
                  </div>
                </div>
                <p className="text-xs font-mono text-slate-300">
                  {micMetrics.deltaDeg <= 60
                    ? '● EM FASE (ACOPLAMENTO CONSTRUTIVO — Ganho de Energia)'
                    : micMetrics.deltaDeg <= 120
                    ? '▲ TRANSIÇÃO DE FASE (Soma Parcial / Filtro Pente)'
                    : '■ CANCELAMENTO DESTRUTIVO (Oposição de Fase 180°)'}
                </p>
              </div>

              {/* Polar Plot Mini-Canvas */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center bg-slate-950 border border-slate-800/80 rounded-xl p-2">
                <canvas
                  ref={polarCanvasRef}
                  width={150}
                  height={150}
                  className="w-[136px] h-[136px] block"
                />
                <span className="text-[11px] font-mono text-slate-400 mt-1">
                  Padrão Polar Horizontal ({freqHz} Hz)
                </span>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Control & Concept Deck */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-5">
            <div>
              <h3 className="text-base font-semibold text-slate-100 mb-2">
                Presets Clássicos de Engenharia de Graves
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SUB_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applySubPreset(preset)}
                    className={`text-left p-2.5 rounded-xl border transition-colors min-h-[44px] ${
                      activePresetId === preset.id
                        ? 'bg-amber-500/15 border-amber-500/60 text-slate-50'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-semibold truncate">{preset.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Labeled Parameter Sliders */}
            <div className="space-y-4 pt-3 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="sim-freq" className="text-slate-300 font-medium">
                    Frequência de Sintonização (f)
                  </label>
                  <span className="font-mono tabular-nums text-amber-400 font-semibold">
                    {freqHz} Hz (λ = {wavelengthM.toFixed(2)} m)
                  </span>
                </div>
                <input
                  id="sim-freq"
                  type="range"
                  min={35}
                  max={125}
                  step={1}
                  value={freqHz}
                  onChange={(e) => setFreqHz(Number(e.target.value))}
                  className="w-full audio-fader"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="sim-spacing" className="text-slate-300 font-medium">
                    Espaçamento Físico entre Caixas (d)
                  </label>
                  <span className="font-mono tabular-nums text-amber-400 font-semibold">
                    {spacingM.toFixed(2)} m (λ/4 ideal: {quarterWaveM.toFixed(2)} m)
                  </span>
                </div>
                <input
                  id="sim-spacing"
                  type="range"
                  min={0.4}
                  max={8.0}
                  step={0.05}
                  value={spacingM}
                  onChange={(e) => setSpacingM(Number(e.target.value))}
                  className="w-full audio-fader"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="sim-delay" className="text-slate-300 font-medium">
                    Delay Eletrônico no DSP da Caixa 2 (τ)
                  </label>
                  <span className="font-mono tabular-nums text-amber-400 font-semibold">
                    {delayMs.toFixed(2)} ms (λ/4 ideal: {quarterWaveDelayMs.toFixed(2)} ms)
                  </span>
                </div>
                <input
                  id="sim-delay"
                  type="range"
                  min={0}
                  max={15}
                  step={0.05}
                  value={delayMs}
                  onChange={(e) => setDelayMs(Number(e.target.value))}
                  className="w-full audio-fader"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="sim-temp" className="text-slate-300 font-medium">
                    Temperatura Ambiente (Velocidade do Som)
                  </label>
                  <span className="font-mono tabular-nums text-slate-300">
                    {tempC} °C ({speedOfSound.toFixed(1)} m/s)
                  </span>
                </div>
                <input
                  id="sim-temp"
                  type="range"
                  min={5}
                  max={40}
                  step={1}
                  value={tempC}
                  onChange={(e) => setTempC(Number(e.target.value))}
                  className="w-full audio-fader"
                />
              </div>

              {/* Dual-State Toggles for Polarity & Orientation */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setInvertSub2((prev) => !prev)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-mono font-medium transition-colors min-h-[44px] ${
                    invertSub2
                      ? 'bg-rose-500/20 border-rose-500/60 text-rose-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  Polaridade S2: {invertSub2 ? 'Ø 180° (Invert.)' : '0° (Normal)'}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setOrientation((prev) => (prev === 'front-back' ? 'left-right' : 'front-back'))
                  }
                  className="px-3 py-2.5 rounded-xl border bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 text-xs font-mono font-medium transition-colors min-h-[44px]"
                >
                  Eixo: {orientation === 'front-back' ? 'Frente / Trás' : 'L / R Lateral'}
                </button>
              </div>

              {/* Quick Action to Auto-Calculate Optimal Quarter-Wave */}
              <button
                type="button"
                onClick={autoAlignQuarterWave}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                Calcular e Aplicar Alinhamento λ/4 Exato ({freqHz} Hz)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: DELAY TOWER ALIGNMENT & SPL CALCULATOR */}
      {simMode === 'delay-tower' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Perfil Longitudinal de Propagação Acústica e Torres de Delay
              </h3>
              <p className="text-xs text-slate-400">
                Sincronismo temporal com precedência psicoacústica (Efeito Haas) e queda de pressão sonora por distância
              </p>
            </div>

            {/* Interactive SVG Longitudinal Arena Cross-Section */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
              <svg viewBox="0 0 600 220" className="w-full h-auto overflow-visible">
                {/* Distance Grid */}
                {[0, 15, 30, 45, 60, 75].map((distM) => {
                  const x = 45 + (distM / 80) * 520;
                  return (
                    <g key={distM}>
                      <line
                        x1={x}
                        y1={20}
                        x2={x}
                        y2={175}
                        stroke="rgba(148,163,184,0.12)"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={x}
                        y={195}
                        fill="#94A3B8"
                        fontSize="10"
                        textAnchor="middle"
                        fontFamily="IBM Plex Mono, monospace"
                      >
                        {distM}m
                      </text>
                    </g>
                  );
                })}

                {/* Ground Plane */}
                <line x1={30} y1={175} x2={580} y2={175} stroke="#334155" strokeWidth="2" />

                {/* Main PA Line Array at x=45 (0m) */}
                <rect x={36} y={42} width={16} height={38} rx={3} fill="#F59E0B" />
                <text x={45} y={32} fill="#F59E0B" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="IBM Plex Mono, monospace">
                  PA PRINCIPAL (0m)
                </text>

                {/* FOH House Mix at 25m */}
                {(() => {
                  const fohX = 45 + (25 / 80) * 520;
                  return (
                    <g>
                      <rect x={fohX - 14} y={155} width={28} height={20} rx={3} fill="#0EA5E9" />
                      <text x={fohX} y={147} fill="#38BDF8" fontSize="9" textAnchor="middle" fontFamily="IBM Plex Mono, monospace">
                        FOH 25m ({splAtFoh25m.toFixed(1)} dB)
                      </text>
                    </g>
                  );
                })()}

                {/* Delay Tower at dynamic distance */}
                {(() => {
                  const towerX = 45 + (towerDistanceM / 80) * 520;
                  return (
                    <g>
                      <line x1={towerX} y1={65} x2={towerX} y2={175} stroke="#F8FAFC" strokeWidth="2.5" />
                      <rect x={towerX - 7} y={55} width={14} height={26} rx={2} fill="#10B981" />
                      <text
                        x={towerX}
                        y={44}
                        fill="#34D399"
                        fontSize="10"
                        fontWeight="600"
                        textAnchor="middle"
                        fontFamily="IBM Plex Mono, monospace"
                      >
                        TORRE DELAY ({towerDistanceM}m · {totalTowerDelayMs.toFixed(1)} ms)
                      </text>
                      {/* Wavefront Arrow from PA to Delay Tower */}
                      <line
                        x1={56}
                        y1={105}
                        x2={towerX - 8}
                        y2={105}
                        stroke="#F59E0B"
                        strokeWidth="1.5"
                        strokeDasharray="5 3"
                      />
                      <text
                        x={(56 + towerX) / 2}
                        y={97}
                        fill="#FBBF24"
                        fontSize="10"
                        textAnchor="middle"
                        fontFamily="IBM Plex Mono, monospace"
                      >
                        Tempo de Voo: {acousticFlightMs.toFixed(2)} ms
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Key Engineering Readouts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono tabular-nums">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">Voo Acústico Puro</div>
                <div className="text-lg font-semibold text-slate-100">
                  {acousticFlightMs.toFixed(2)} ms
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40">
                <div className="text-[11px] text-amber-300">Delay no DSP (+Haas)</div>
                <div className="text-lg font-semibold text-amber-400">
                  {totalTowerDelayMs.toFixed(2)} ms
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">SPL na House Mix (25m)</div>
                <div className="text-lg font-semibold text-sky-400">
                  {splAtFoh25m.toFixed(1)} dB
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">PA Residual na Torre</div>
                <div className="text-lg font-semibold text-emerald-400">
                  {splAtTowerPosition.toFixed(1)} dB
                </div>
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Delay Tower Controls */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-base font-semibold text-slate-100">
              Parâmetros de Alinhamento da Torre
            </h3>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label htmlFor="tower-dist" className="text-slate-300 font-medium">
                  Distância do PA até a Torre de Delay
                </label>
                <span className="font-mono tabular-nums text-amber-400 font-semibold">
                  {towerDistanceM} metros
                </span>
              </div>
              <input
                id="tower-dist"
                type="range"
                min={10}
                max={75}
                step={1}
                value={towerDistanceM}
                onChange={(e) => setTowerDistanceM(Number(e.target.value))}
                className="w-full audio-fader"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label htmlFor="haas-ms" className="text-slate-300 font-medium">
                  Margem de Precedência (Efeito Haas)
                </label>
                <span className="font-mono tabular-nums text-amber-400 font-semibold">
                  +{haasEffectMs} ms
                </span>
              </div>
              <input
                id="haas-ms"
                type="range"
                min={0}
                max={20}
                step={1}
                value={haasEffectMs}
                onChange={(e) => setHaasEffectMs(Number(e.target.value))}
                className="w-full audio-fader"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Adicionar de +10 ms a +15 ms garante que o cérebro humano localize a imagem sonora vindo do palco, e não da caixa da torre.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <label htmlFor="pa-spl" className="text-slate-300 font-medium">
                  SPL Máximo do PA a 1 Metro
                </label>
                <span className="font-mono tabular-nums text-slate-200 font-semibold">
                  {paSplAt1m} dB SPL
                </span>
              </div>
              <input
                id="pa-spl"
                type="range"
                min={120}
                max={146}
                step={1}
                value={paSplAt1m}
                onChange={(e) => setPaSplAt1m(Number(e.target.value))}
                className="w-full audio-fader"
              />
            </div>

            <div className="pt-2">
              <div className="text-xs text-slate-300 font-medium mb-2">
                Regime de Decaimento Acústico (Lei do Inverso da Distância)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPropagationType('line-array')}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition-colors min-h-[44px] ${
                    propagationType === 'line-array'
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Line Array (-3 dB / dobra)
                </button>
                <button
                  type="button"
                  onClick={() => setPropagationType('point-source')}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition-colors min-h-[44px] ${
                    propagationType === 'point-source'
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Point Source (-6 dB / dobra)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: WEB AUDIO API REAL TEST SIGNAL GENERATOR */}
      {simMode === 'signal-generator' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">
                    Gerador de Sinais de Referência para Passagem de Som
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sintetizador Web Audio API de alta precisão para injetar tons puros ou Ruído Rosa na mesa
                  </p>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-300">
                  {isAudioPlaying ? '● SINAL ATIVO NA SAÍDA' : '■ SAÍDA MUTADA'}
                </span>
              </div>

              {/* Quick Frequency Octave Buttons */}
              <div>
                <div className="text-xs text-slate-400 mb-2">
                  Frequências Padrão ISO de Oitava (Acesso Rápido):
                </div>
                <div className="flex flex-wrap gap-2">
                  {[40, 63, 80, 100, 160, 250, 500, 1000, 2500, 4000, 8000, 12000].map((hz) => (
                    <button
                      key={hz}
                      type="button"
                      onClick={() => {
                        setSignalType('sine');
                        setGenFreqHz(hz);
                        if (isAudioPlaying && signalType !== 'sine') {
                          startSignalGenerator('sine', hz, genVolumeDb);
                        }
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-mono tabular-nums border transition-colors min-h-[40px] ${
                        signalType === 'sine' && genFreqHz === hz
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {hz >= 1000 ? `${hz / 1000} kHz` : `${hz} Hz`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fine Frequency Slider */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <label htmlFor="gen-freq" className="text-slate-300 font-medium">
                      Frequência do Oscilador Senoidal
                    </label>
                    <span className="font-mono tabular-nums text-amber-400 font-semibold">
                      {genFreqHz} Hz (Período T = {(1000 / genFreqHz).toFixed(2)} ms)
                    </span>
                  </div>
                  <input
                    id="gen-freq"
                    type="range"
                    min={25}
                    max={12000}
                    step={1}
                    value={genFreqHz}
                    onChange={(e) => setGenFreqHz(Number(e.target.value))}
                    className="w-full audio-fader"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <label htmlFor="gen-vol" className="text-slate-300 font-medium">
                      Nível de Saída Master (Atenuação Segura)
                    </label>
                    <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                      {genVolumeDb} dBFS
                    </span>
                  </div>
                  <input
                    id="gen-vol"
                    type="range"
                    min={-42}
                    max={-6}
                    step={1}
                    value={genVolumeDb}
                    onChange={(e) => setGenVolumeDb(Number(e.target.value))}
                    className="w-full audio-fader"
                  />
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Generator Trigger & Signal Selector */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <Activity className="w-4 h-4 text-amber-400" />
                  <span>MODO: {signalType === 'sine' ? `SENOIDE PURA ${genFreqHz} Hz` : 'RUÍDO ROSA (-3 dB/OCT)'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setSignalType('sine');
                    if (isAudioPlaying) startSignalGenerator('sine', genFreqHz, genVolumeDb);
                  }}
                  className={`p-3 rounded-xl border text-xs font-medium transition-colors min-h-[44px] ${
                    signalType === 'sine'
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  Onda Senoidal Pura
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSignalType('pink-noise');
                    if (isAudioPlaying) startSignalGenerator('pink-noise', genFreqHz, genVolumeDb);
                  }}
                  className={`p-3 rounded-xl border text-xs font-medium transition-colors min-h-[44px] ${
                    signalType === 'pink-noise'
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  Ruído Rosa (RTA)
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (isAudioPlaying) {
                    stopSignalGenerator();
                  } else {
                    startSignalGenerator(signalType, genFreqHz, genVolumeDb);
                  }
                }}
                className={`w-full py-3.5 px-5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2.5 min-h-[48px] ${
                  isAudioPlaying
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {isAudioPlaying ? (
                  <>
                    <VolumeX className="w-5 h-5 shrink-0" />
                    Mutar Gerador de Áudio (Mute)
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 shrink-0" />
                    Ativar Gerador de Áudio ({genVolumeDb} dBFS)
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
