'use client';

import React, { useState, useMemo } from 'react';

export default function BastidorEstimatorApp() {
  const [areaSqFt, setAreaSqFt] = useState<number>(2500);
  const [roofPitch, setRoofPitch] = useState<number>(6); // 6/12 pitch default
  const [materialType, setMaterialType] = useState<string>('architectural');
  const [includeThermal, setIncludeThermal] = useState<boolean>(true);
  const [include3dModel, setInclude3dModel] = useState<boolean>(true);

  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [cameraMode, setCameraMode] = useState<'thermal' | 'rgb' | 'mesh'>('thermal');

  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [mailClicked, setMailClicked] = useState<boolean>(false);

  const calculations = useMemo(() => {
    // Trigonometric effective surface area expansion formula
    const pitchFactor = 1 + (roofPitch / 12) * 0.15;
    const adjustedArea = areaSqFt * pitchFactor;

    const rates: Record<string, number> = {
      asphalt: 4.5,
      architectural: 6.2,
      standing_seam: 11.5,
      slate_tile: 18.0,
    };

    const materialRate = rates[materialType] || 6.2;
    const baseMaterialCost = adjustedArea * materialRate;

    let droneCost = 350; // Base flight scanning fee
    if (includeThermal) droneCost += 250;
    if (include3dModel) droneCost += 300;

    const totalEstimate = baseMaterialCost + droneCost;

    return {
      adjustedArea: Math.round(adjustedArea),
      baseMaterialCost: Math.round(baseMaterialCost),
      droneCost: Math.round(droneCost),
      totalEstimate: Math.round(totalEstimate),
    };
  }, [areaSqFt, roofPitch, materialType, includeThermal, include3dModel]);

  const mailtoUrl = useMemo(() => {
    const subject = encodeURIComponent(
      `Bastidor Quote & Demo Request - ${clientName || 'Valued Client'}`
    );

    const bodyText = `Hello Steven,

I would like to request an official quote / demo for Bastidor Drone & Material Estimator.

--- CLIENT CONTACT DETAILS ---
Name: ${clientName || 'Not provided'}
Email: ${clientEmail || 'Not provided'}
Phone: ${clientPhone || 'Not provided'}
Notes: ${notes || 'None'}

--- PROJECT ESTIMATE PARAMETERS ---
Roof / Surface Area: ${areaSqFt.toLocaleString()} sq ft
Roof Pitch: ${roofPitch}/12
Material Selected: ${materialType.toUpperCase()}
Thermal Infrared Flight: ${includeThermal ? 'YES (Starting $250 CAD)' : 'NO'}
3D Mesh Model: ${include3dModel ? 'YES (Starting $300 CAD)' : 'NO'}

--- CALCULATED FIGURES ---
Calculated Effective Area: ${calculations.adjustedArea.toLocaleString()} sq ft
Estimated Material Cost: $${calculations.baseMaterialCost.toLocaleString()} CAD
Estimated Drone & Analytics Cost: $${calculations.droneCost.toLocaleString()} CAD
------------------------------------
ESTIMATED TOTAL: $${calculations.totalEstimate.toLocaleString()} CAD

Please contact me at your earliest convenience to review this estimate.

Thank you!`;

    return `mailto:steven@bastidor.ca?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  }, [clientName, clientEmail, clientPhone, notes, areaSqFt, roofPitch, materialType, includeThermal, include3dModel, calculations]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('steven@bastidor.ca');
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono selection:bg-emerald-500 selection:text-slate-950 pb-20">
      
      {}
      <header className="border-b border-emerald-900/40 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-extrabold text-xl shadow-lg shadow-emerald-500/10">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-wider text-white uppercase flex items-center gap-2">
                BASTIDOR
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                  v2.4 TELEMETRY
                </span>
              </h1>
              <p className="text-xs text-emerald-400/90 font-sans font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Direct Contact: <a href="mailto:steven@bastidor.ca" className="underline hover:text-emerald-300 font-bold">steven@bastidor.ca</a>
              </p>
            </div>
          </div>

          <a
            href={mailtoUrl}
            onClick={() => setMailClicked(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Steven Directly
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-900/80 border border-emerald-900/50 rounded-xl p-3.5 relative overflow-hidden group hover:border-emerald-500/50 transition">
            <div className="flex justify-between items-start text-xs text-slate-400 uppercase tracking-wider mb-1 font-sans">
              <span>Active Missions</span>
              <span className="text-emerald-400 font-bold">↑</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              12 <span className="text-xs text-emerald-400 font-normal">sites</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-900/50 rounded-xl p-3.5 relative overflow-hidden group hover:border-emerald-500/50 transition">
            <div className="flex justify-between items-start text-xs text-slate-400 uppercase tracking-wider mb-1 font-sans">
              <span>Footage Captured</span>
              <span className="text-emerald-400 font-bold">↑</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              4.2 <span className="text-xs text-emerald-400 font-normal">TB</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-900/50 rounded-xl p-3.5 relative overflow-hidden group hover:border-emerald-500/50 transition">
            <div className="flex justify-between items-start text-xs text-slate-400 uppercase tracking-wider mb-1 font-sans">
              <span>Flight Hours</span>
              <span className="text-slate-500">→</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              847 <span className="text-xs text-emerald-400 font-normal">hrs</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-900/50 rounded-xl p-3.5 relative overflow-hidden group hover:border-emerald-500/50 transition">
            <div className="flex justify-between items-start text-xs text-slate-400 uppercase tracking-wider mb-1 font-sans">
              <span>Coverage Area</span>
              <span className="text-emerald-400 font-bold">↑</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              2,450 <span className="text-xs text-emerald-400 font-normal">acres</span>
            </div>
          </div>
        </div>

        {}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/50 pb-3 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isScanning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              <span className="font-bold text-emerald-400 uppercase tracking-wider">
                LIVE FEED: {isScanning ? 'ACTIVE SCANNING' : 'STANDBY'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>LAT: 34.0522°N</span>
              <span>LON: 118.2437°W</span>
              <span className="text-emerald-400">ALT: 153.0m</span>
            </div>
          </div>

          {/* Grid Canvas Screen */}
          <div className="relative w-full h-64 sm:h-72 bg-slate-950 border border-emerald-900/60 rounded-xl overflow-hidden flex items-center justify-center">
            <div 
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
                backgroundSize: '24px 24px'
              }}
            ></div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-emerald-500/20 flex items-center justify-center">
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-emerald-500/40 border-dashed"></div>
              </div>
            </div>

            {isScanning && (
              <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent animate-pulse pointer-events-none"></div>
            )}

            {/* Drone Vector HUD Graphic */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40">
                <div className="absolute top-2 left-2 w-8 h-8 rounded-full border-2 border-emerald-400/80 animate-spin"></div>
                <div className="absolute top-2 right-2 w-8 h-8 rounded-full border-2 border-emerald-400/80 animate-spin"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 rounded-full border-2 border-emerald-400/80 animate-spin"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full border-2 border-emerald-400/80 animate-spin"></div>

                <svg className="w-full h-full text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" viewBox="0 0 100 100" fill="none">
                  <path d="M20 20 L50 50 L80 20 M20 80 L50 50 L80 80" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="50" cy="50" r="14" fill="#020617" stroke="currentColor" strokeWidth="2.5" />
                  <circle cx="50" cy="50" r="6" fill="#10b981" className="animate-pulse" />
                  <path d="M50 36 L50 22 M50 64 L50 78 M36 50 L22 50 M64 50 L78 50" stroke="currentColor" strokeWidth="1.5" />
                </svg>

                <div className="absolute top-24 left-1/2 -translate-x-1/2 w-28 h-20 bg-gradient-to-b from-emerald-400/30 via-emerald-500/10 to-transparent blur-xs pointer-events-none origin-top clip-path-polygon"></div>
              </div>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[10px] sm:text-xs text-emerald-400/80 bg-slate-950/80 backdrop-blur-xs p-2 rounded-lg border border-emerald-900/50">
              <div>UNIT: <span className="text-white font-bold">DJI-M30T ENGINE</span></div>
              <div className="flex items-center gap-2">
                <span>MODE: <span className="text-white font-bold">{cameraMode.toUpperCase()}</span></span>
                <span className="text-emerald-400 font-bold">BATTERY: 78%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
            <div className="flex gap-2">
              {(['thermal', 'rgb', 'mesh'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCameraMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs uppercase font-sans font-bold transition ${
                    cameraMode === mode
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {mode} Scan
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsScanning(!isScanning)}
              className="px-3 py-1.5 bg-slate-950 border border-emerald-800 hover:border-emerald-500 text-emerald-400 rounded-lg text-xs font-sans font-bold transition"
            >
              {isScanning ? 'PAUSE SCANNER' : 'START LIVE SCAN'}
            </button>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-7 space-y-5 font-sans">
            
            {/* Surface Area Slider */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-slate-200">
                  Roof / Surface Area
                </label>
                <span className="text-emerald-400 font-mono font-bold text-lg bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-lg">
                  {areaSqFt.toLocaleString()} sq ft
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono">
                <span>500 sq ft</span>
                <span>5,000 sq ft</span>
                <span>10,000 sq ft</span>
              </div>
            </div>

            {/* Pitch Slider */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-slate-200">
                  Roof Slope / Pitch
                </label>
                <span className="text-emerald-400 font-mono font-bold text-lg bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-lg">
                  {roofPitch} / 12
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={roofPitch}
                onChange={(e) => setRoofPitch(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <p className="text-xs text-slate-400 mt-2">
                Multiplier adjustments include surface pitch expansion (+{Math.round((roofPitch/12)*15)}% effective waste factor).
              </p>
            </div>

            {/* Material Selector */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <label className="block text-sm font-bold text-slate-200 mb-3">
                Material Grade &amp; Options
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'asphalt', name: '3-Tab Asphalt', price: '$4.50 / sq ft' },
                  { id: 'architectural', name: 'Architectural Shingle', price: '$6.20 / sq ft' },
                  { id: 'standing_seam', name: 'Standing Seam Metal', price: '$11.50 / sq ft' },
                  { id: 'slate_tile', name: 'Slate / Tile', price: '$18.00 / sq ft' },
                ].map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setMaterialType(mat.id)}
                    className={`p-3 rounded-xl border text-left transition ${
                      materialType === mat.id
                        ? 'border-emerald-500 bg-emerald-950/40 text-white'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-100">{mat.name}</div>
                    <div className="text-xs text-emerald-400 font-mono mt-0.5">{mat.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
              <label className="block text-sm font-bold text-slate-200 mb-3">
                Bastidor Drone Payload Services
              </label>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeThermal}
                      onChange={(e) => setIncludeThermal(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-200">Thermal Infrared Flight Scan</div>
                      <div className="text-[11px] text-slate-400">Detect subsurface water intrusion &amp; envelope energy loss</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">+$250 CAD (From)</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={include3dModel}
                      onChange={(e) => setInclude3dModel(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-200">3D Mesh Digital Twin</div>
                      <div className="text-[11px] text-slate-400 font-sans">High-precision photogrammetry point-cloud model</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">+$300 CAD (From)</span>
                </label>
              </div>
            </div>

          </div>

          {}
          <div className="lg:col-span-5 font-sans space-y-6">
            
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <h3 className="text-base font-extrabold text-white mb-4 border-b border-slate-800 pb-3 flex items-center justify-between font-mono">
                <span>ESTIMATE SUMMARY</span>
                <span className="text-xs font-mono text-emerald-400 font-normal">CAD $</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Effective Surface Area:</span>
                  <span className="font-mono text-slate-200 font-bold">{calculations.adjustedArea.toLocaleString()} sq ft</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Estimated Material Cost:</span>
                  <span className="font-mono text-slate-200">${calculations.baseMaterialCost.toLocaleString()} CAD</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Drone Flight &amp; Analytics:</span>
                  <span className="font-mono text-slate-200">${calculations.droneCost.toLocaleString()} CAD</span>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Estimated Total:</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    ${calculations.totalEstimate.toLocaleString()} <span className="text-xs font-normal text-slate-400">CAD</span>
                  </span>
                </div>
              </div>

              {/* Direct Email Submission */}
              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  Submit Proposal to Steven Ramirez
                </h4>

                <input
                  type="text"
                  placeholder="Your Name / Organization"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Additional project details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                ></textarea>

                {/* Primary Direct Mailto Anchor */}
                <a
                  href={mailtoUrl}
                  onClick={() => setMailClicked(true)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-center cursor-pointer block uppercase tracking-wider"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>

                  Click to Email Quote (steven@bastidor.ca)
                </a>

                {/* Fallback Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {copied ? '✓ Email Copied to Clipboard!' : 'Copy Email Address (steven@bastidor.ca)'}
                </button>

                {mailClicked && (
                  <p className="text-[11px] text-center text-emerald-400 font-medium pt-1">
                    ✓ Opening mail client pre-addressed to steven@bastidor.ca...
                  </p>
                )}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
