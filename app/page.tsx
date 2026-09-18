 None selected

Skip to content
Using Gmail with screen readers

1 of 12,567
BASTIDOR - Code phase 1 AI
Inbox

Steven Ramirez <stevenramirez1@gmail.com>
Attachments
9:58 AM (5 minutes ago)
to me

Code phase 1 AI


Steven Ramirez

 One attachment
  •  Scanned by Gmail
'use client';

import React, { useState, useMemo } from 'react';

type ScanMode = 'thermal' | 'pointcloud' | 'bim' | 'rgb';
type ActiveTab = 'lsm_inspector' | 'ntrip_rtk' | 'nfc_ledger' | 'material_scoper';

interface NFCTagEvent {
  id: string;
  tagId: string;
  locationName: string;
  timestamp: string;
  inspector: string;
  hash: string;
  status: 'VERIFIED' | 'PENDING' | 'FLAGGED';
}

interface DiscrepancyItem {
  id: string;
  element: string;
  deviation: string;
  riskScore: number;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  coordinates: string;
}

export default function BastidorV4SpatialAIEngine() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('lsm_inspector');
  const [scanMode, setScanMode] = useState<ScanMode>('thermal');
  const [isLiveScanning, setIsLiveScanning] = useState<boolean>(true);

  // Material Estimator Parameters
  const [areaSqFt, setAreaSqFt] = useState<number>(3500);
  const [roofPitch, setRoofPitch] = useState<number>(6);
  const [materialType, setMaterialType] = useState<string>('architectural');
  const [includeThermal, setIncludeThermal] = useState<boolean>(true);
  const [include3dModel, setInclude3dModel] = useState<boolean>(true);
  const [includeNfcAudit, setIncludeNfcAudit] = useState<boolean>(true);

  // Client Details & Contact State
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [mailClicked, setMailClicked] = useState<boolean>(false);

  const [nfcLogs, setNfcLogs] = useState<NFCTagEvent[]>([
    {
      id: 'LOG-8801',
      tagId: 'NTAG-424-C281',
      locationName: 'Structural Beam Joint - Grid C4',
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString() + ' EDT',
      inspector: 'S. Ramirez (Lead Auditor)',
      hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'VERIFIED',
    },
    {
      id: 'LOG-8802',
      tagId: 'NTAG-424-F109',
      locationName: 'Firestop Sleeve Core #04',
      timestamp: new Date(Date.now() - 1800000).toLocaleTimeString() + ' EDT',
      inspector: 'Field Tech #12 (Ontario Ops)',
      hash: '7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504d978c197',
      status: 'VERIFIED',
    },
  ]);

  const discrepancies: DiscrepancyItem[] = [
    {
      id: 'DSC-01',
      element: 'HVAC Ducting vs. Steel Column 4B',
      deviation: '+18.4 mm Lateral Shift',
      riskScore: 88,
      severity: 'HIGH',
      coordinates: '43.6532°N, 79.3832°W',
    },
    {
      id: 'DSC-02',
      element: 'Concrete Core Pour Thickness',
      deviation: '-4.2 mm Volumetric Delta',
      riskScore: 42,
      severity: 'MEDIUM',
      coordinates: '43.6535°N, 79.3835°W',
    },
    {
      id: 'DSC-03',
      element: 'Roof Parapet Wall Waterproof Membrane',
      deviation: 'Subsurface Thermal Moisture Anomaly',
      riskScore: 94,
      severity: 'HIGH',
      coordinates: '43.6529°N, 79.3828°W',
    },
  ];

  // Pitch formula: A_effective = A * [1 + (P/12) * 0.15]
  const calculations = useMemo(() => {
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

    let droneCost = 450;
    if (includeThermal) droneCost += 250;
    if (include3dModel) droneCost += 300;
    if (includeNfcAudit) droneCost += 350;

    const totalEstimate = baseMaterialCost + droneCost;

    return {
      pitchFactor: pitchFactor.toFixed(3),
      adjustedArea: Math.round(adjustedArea),
      baseMaterialCost: Math.round(baseMaterialCost),
      droneCost: Math.round(droneCost),
      totalEstimate: Math.round(totalEstimate),
    };
  }, [areaSqFt, roofPitch, materialType, includeThermal, include3dModel, includeNfcAudit]);

  const mailtoUrl = useMemo(() => {
    const subject = encodeURIComponent(
      `Bastidor V4.0 AI Spatial Scoping & Audit Request - ${clientName || 'Megaproject Client'}`
    );

    const bodyText = `Hello Steven Ramirez (Director of Operations),

I would like to request an official Bastidor V4.0 Spatial AI & Drone Telemetry Audit for my project site.

--- CLIENT & PROJECT IDENTIFICATION ---
Name/Company: ${clientName || 'Not specified'}
Email: ${clientEmail || 'Not specified'}
Phone: ${clientPhone || 'Not specified'}
Project Scope Notes: ${notes || 'None provided'}

--- SPATIAL & TELEMETRY PARAMETERS ---
Footprint Area: ${areaSqFt.toLocaleString()} sq ft
Roof Pitch/Slope: ${roofPitch}/12
Trigonometric Expansion Factor: ${calculations.pitchFactor}x
Calculated Effective Area: ${calculations.adjustedArea.toLocaleString()} sq ft
Selected Material System: ${materialType.toUpperCase()}

--- BASTIDOR V4.0 AI PAYLOAD SERVICES ---
• Radiometric Thermal IR Intrusion Scan: ${includeThermal ? 'ENABLED (Starting $250 CAD)' : 'DISABLED'}
• 3D Point Cloud / BIM Mesh Digital Twin: ${include3dModel ? 'ENABLED (Starting $300 CAD)' : 'DISABLED'}
• Cryptographic NFC Tag Audit Trail: ${includeNfcAudit ? 'ENABLED (Starting $350 CAD)' : 'DISABLED'}

--- CALCULATED FINANCIAL SUMMARY ---
Estimated Material Cost: $${calculations.baseMaterialCost.toLocaleString()} CAD
Estimated Spatial AI Telemetry & Flight Fee: $${calculations.droneCost.toLocaleString()} CAD
----------------------------------------------------
ESTIMATED TOTAL SCOPE: $${calculations.totalEstimate.toLocaleString()} CAD

Please contact me to schedule site calibration and cellular NTRIP RTK stream configuration.

Thank you!`;

    return `mailto:steven@bastidor.ca?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  }, [clientName, clientEmail, clientPhone, notes, areaSqFt, roofPitch, materialType, includeThermal, include3dModel, includeNfcAudit, calculations]);

  const handleCopyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('steven@bastidor.ca');
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSimulateNFCTap = () => {
    const newId = `LOG-${Math.floor(8800 + Math.random() * 100)}`;
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newLog: NFCTagEvent = {
      id: newId,
      tagId: `NTAG-424-X${Math.floor(100 + Math.random() * 900)}`,
      locationName: `Concrete Slab Core Tag #${Math.floor(1 + Math.random() * 20)}`,
      timestamp: new Date().toLocaleTimeString() + ' EDT',
      inspector: 'S. Ramirez (Verified Tap)',
      hash: randomHex,
      status: 'VERIFIED',
    };

    setNfcLogs([newLog, ...nfcLogs]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono selection:bg-emerald-500 selection:text-slate-950 pb-12">
      
      {/* Header */}
      <header className="border-b border-emerald-900/40 bg-slate-950/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-emerald-500/60 flex items-center justify-center text-emerald-400 font-extrabold shadow-lg shadow-emerald-500/10">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-wider text-white uppercase">
                  BASTIDOR V4.0
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono font-bold">
                  SPATIAL AI ENGINE
                </span>
              </div>
              <p className="text-xs text-emerald-400/90 font-sans font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Direct Contact: <a href="mailto:steven@bastidor.ca" className="underline hover:text-emerald-300 font-bold">steven@bastidor.ca</a>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-[10px] font-sans text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-emerald-400 font-bold">✓ SOC 2 TYPE 2</span>
              <span className="text-slate-600">|</span>
              <span>AWS ca-central-1</span>
            </div>

            <a
              href={mailtoUrl}
              onClick={() => setMailClicked(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-sans font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Steven Directly
            </a>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Top 4 Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-900/80 border border-emerald-900/50 rounded-xl p-3.5 relative overflow-hidden">
            <div className="flex justify-between items-start text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-sans">
              <span>ACTIVE SITES</span>
              <span className="text-emerald-400 font-bold">↑</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-white">
              12 <span className="text-xs text-emerald-400 font-normal">ONTARIO SITES</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-900/50 rounded-xl p-3.5 relative overflow-hidden">
            <div className="flex justify-between items-start text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-sans">
              <span>POINT CLOUD DENSITY</span>
              <span className="text-emerald-400 font-bold">↑</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-white">
              4.2 <span className="text-xs text-emerald-400 font-normal">TB (.LAS / .E57)</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-900/50 rounded-xl p-3.5 relative overflow-hidden">
            <div className="flex justify-between items-start text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-sans">
              <span>NTRIP RTK PRECISION</span>
              <span className="text-emerald-400 font-bold">1.2 cm</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-white">
              100% <span className="text-xs text-emerald-400 font-normal">VRS LOCK</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-emerald-900/50 rounded-xl p-3.5 relative overflow-hidden">
            <div className="flex justify-between items-start text-[11px] text-slate-400 uppercase tracking-wider mb-1 font-sans">
              <span>AUDIT LEDGER</span>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-white">
              2,450 <span className="text-xs text-emerald-400 font-normal">NFC TAPS</span>
            </div>
          </div>
        </div>

        {/* 4-Tab Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
          {[
            { id: 'lsm_inspector', label: '1. LSM BIM Inspector', icon: '🔍' },
            { id: 'ntrip_rtk', label: '2. Cellular NTRIP RTK', icon: '📡' },
            { id: 'nfc_ledger', label: '3. NFC Verified Tap Ledger', icon: '🛡️' },
            { id: 'material_scoper', label: '4. Dynamic Material Scoper', icon: '📐' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`px-4 py-2 rounded-xl text-xs font-sans font-bold transition flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: LSM BIM Inspector */}
        {activeTab === 'lsm_inspector' && (
          <div className="space-y-6">
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900/50 pb-3 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isLiveScanning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                  <span className="font-bold text-emerald-400 uppercase tracking-wider">
                    LSM ENGINE STREAM: {isLiveScanning ? 'ACTIVE POINT CLOUD PARSING' : 'PAUSED'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
                  <span>LAT: 43.6532°N</span>
                  <span>LON: 79.3832°W</span>
                  <span className="text-emerald-400">ALT: 112.4m</span>
                </div>
              </div>

              {/* Drone Radar HUD */}
              <div className="relative w-full h-72 sm:h-80 bg-slate-950 border border-emerald-900/60 rounded-xl overflow-hidden flex items-center justify-center">
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)`,
                    backgroundSize: '28px 28px'
                  }}
                ></div>

                <div className="absolute inset-6 sm:inset-8 border border-emerald-500/30 rounded-lg flex items-center justify-center pointer-events-none">
                  <div className="w-full h-full border border-dashed border-emerald-500/20 grid grid-cols-3 grid-rows-3 p-2 sm:p-4 gap-2 sm:gap-4">
                    <div className="border border-emerald-400/40 rounded flex items-center justify-center text-[9px] sm:text-[10px] text-emerald-400 font-bold">COLUMN 1A</div>
                    <div className="border border-amber-400/60 bg-amber-500/10 rounded flex items-center justify-center text-[9px] sm:text-[10px] text-amber-300 font-bold animate-pulse text-center">CLASH: HVAC DUCT</div>
                    <div className="border border-emerald-400/40 rounded flex items-center justify-center text-[9px] sm:text-[10px] text-emerald-400 font-bold">CONCRETE CORE #02</div>
                  </div>
                </div>

                {isLiveScanning && (
                  <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-emerald-500/20 via-emerald-500/5 to-transparent animate-pulse pointer-events-none"></div>
                )}

                <div className="relative w-36 sm:w-40 h-36 sm:h-40">
                  <div className="absolute top-2 left-2 w-7 sm:w-8 h-7 sm:h-8 rounded-full border-2 border-emerald-400/80 animate-spin"></div>
                  <div className="absolute top-2 right-2 w-7 sm:w-8 h-7 sm:h-8 rounded-full border-2 border-emerald-400/80 animate-spin"></div>
                  <div className="absolute bottom-2 left-2 w-7 sm:w-8 h-7 sm:h-8 rounded-full border-2 border-emerald-400/80 animate-spin"></div>
                  <div className="absolute bottom-2 right-2 w-7 sm:w-8 h-7 sm:h-8 rounded-full border-2 border-emerald-400/80 animate-spin"></div>

                  <svg className="w-full h-full text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" viewBox="0 0 100 100" fill="none">
                    <path d="M20 20 L50 50 L80 20 M20 80 L50 50 L80 80" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="50" cy="50" r="14" fill="#020617" stroke="currentColor" strokeWidth="2.5" />
                    <circle cx="50" cy="50" r="6" fill="#10b981" className="animate-pulse" />
                  </svg>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[10px] sm:text-xs text-emerald-400/80 bg-slate-950/90 backdrop-blur-sm p-2 rounded-lg border border-emerald-900/50 font-mono">
                  <div>MODEL: <span className="text-white font-bold">LSM-V4 SPATIAL</span></div>
                  <div>MODE: <span className="text-white font-bold">{scanMode.toUpperCase()}</span></div>
                  <div>DISCREPANCIES: <span className="text-amber-400 font-bold">3 CRITICAL</span></div>
                </div>
              </div>

              {/* Mode Selection Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
                <div className="flex flex-wrap gap-2">
                  {(['thermal', 'pointcloud', 'bim', 'rgb'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setScanMode(mode)}
                      className={`px-3 py-1.5 rounded-lg text-xs uppercase font-sans font-bold transition cursor-pointer ${
                        scanMode === mode
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {mode} Mode
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsLiveScanning(!isLiveScanning)}
                  className="px-3 py-1.5 bg-slate-950 border border-emerald-800 hover:border-emerald-500 text-emerald-400 rounded-lg text-xs font-sans font-bold transition cursor-pointer"
                >
                  {isLiveScanning ? 'PAUSE SCANNING' : 'RESUME SCAN'}
                </button>
              </div>
            </div>

            {/* Discrepancies Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl font-sans">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 font-mono flex items-center justify-between">
                <span>LSM BIM Discrepancy Parsing Output</span>
                <span className="text-xs text-emerald-400 font-normal">Revit / IFC Alignment</span>
              </h3>

              <div className="space-y-2">
                {discrepancies.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-slate-100 flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          item.severity === 'HIGH' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {item.severity} RISK
                        </span>
                        <span>{item.element}</span>
                      </div>
                      <div className="text-slate-400 text-[11px] font-mono mt-1">
                        Deviation: <span className="text-amber-300">{item.deviation}</span> | Coordinates: {item.coordinates}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-right">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase">Risk Score</div>
                        <div className="text-sm font-bold text-emerald-400">{item.riskScore} / 100</div>
                      </div>
                      <a
                        href={mailtoUrl}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] transition"
                      >
                        Dispatch Audit
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Cellular NTRIP RTK */}
        {activeTab === 'ntrip_rtk' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 font-sans">
            <h3 className="text-base font-bold text-slate-100 font-mono flex items-center justify-between">
              <span>CELLULAR NTRIP RTK TELEMETRY NODE</span>
              <span className="text-xs text-emerald-400 font-mono font-normal">LTE/5G VRS Active Stream</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="text-slate-500 uppercase text-[10px]">VRS Network Anchor</div>
                <div className="text-emerald-400 font-bold text-sm">Toronto-NTRIP-Node-04</div>
                <div className="text-slate-400 text-[11px]">Sub-centimeter RTK ephemeris locking active over local cellular node.</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="text-slate-500 uppercase text-[10px]">Horizontal Precision</div>
                <div className="text-emerald-400 font-bold text-sm">1.2 cm Absolute</div>
                <div className="text-slate-400 text-[11px]">Eliminates manual ground control targets for rapid site setup.</div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="text-slate-500 uppercase text-[10px]">Satellite Ephemeris Lock</div>
                <div className="text-emerald-400 font-bold text-sm">28 Satellites (GPS + GLONASS)</div>
                <div className="text-slate-400 text-[11px]">Dual-frequency signal retention under structural interference.</div>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              Connected drones and terrestrial quadrupeds maintain real-time coordinate streaming back to the Bastidor cloud engine for automated BIM alignment.
            </p>
          </div>
        )}

        {/* Tab 3: NFC Verified Tap Ledger */}
        {activeTab === 'nfc_ledger' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
              <div>
                <h3 className="text-base font-bold text-slate-100 uppercase">
                  NTAG 424 DNA Cryptographic "Verified Tap" Audit Ledger
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Insurer-grade physical asset verification. Every tap generates a dynamic AES-128 cryptographic event hash (H_event).
                </p>
              </div>

              <button
                onClick={handleSimulateNFCTap}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-sans rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                + Simulate NFC Tag Tap
              </button>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {nfcLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">{log.id}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                        {log.tagId}
                      </span>
                      <span className="font-bold text-white">{log.locationName}</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{log.timestamp}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 truncate">
                    Inspector: <span className="text-slate-200">{log.inspector}</span> | Cryptographic Hash: <span className="text-emerald-400/90 font-mono text-[10px]">{log.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Dynamic Material Scoper (Your Original Layout) */}
        {activeTab === 'material_scoper' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            <div className="lg:col-span-7 space-y-5 font-sans">
              
              {/* Surface Area Slider */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-bold text-slate-200">
                    Roof / Surface Area Footprint
                  </label>
                  <span className="text-emerald-400 font-mono font-bold text-lg bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-lg">
                    {areaSqFt.toLocaleString()} sq ft
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="15000"
                  step="100"
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
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
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  Trigonometric pitch multiplier factor: <span className="text-emerald-400 font-bold">{calculations.pitchFactor}x</span> (+{Math.round((roofPitch/12)*15)}% effective surface expansion).
                </p>
              </div>

              {/* Material Selector */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <label className="block text-sm font-bold text-slate-200 mb-3">
                  Material System
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'asphalt', name: '3-Tab Asphalt', price: '$4.50 / sq ft' },
                    { id: 'architectural', name: 'Architectural Shingle', price: '$6.20 / sq ft' },
                    { id: 'standing_seam', name: 'Standing Seam Metal', price: '$11.50 / sq ft' },
                    { id: 'slate_tile', name: 'Slate / Tile System', price: '$18.00 / sq ft' },
                  ].map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => setMaterialType(mat.id)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
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

              {/* Payload Services */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <label className="block text-sm font-bold text-slate-200 mb-3">
                  Bastidor V4.0 AI Spatial Payloads
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
                        <div className="text-xs font-bold text-slate-200">Radiometric Thermal IR Intrusion Sweep</div>
                        <div className="text-[11px] text-slate-400">Pinpoints subsurface wet substrate & envelope heat loss</div>
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
                        <div className="text-xs font-bold text-slate-200">3D Point Cloud & BIM Digital Twin</div>
                        <div className="text-[11px] text-slate-400">Millimeter-accurate photogrammetric mesh reconstruction</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">+$300 CAD (From)</span>
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includeNfcAudit}
                        onChange={(e) => setIncludeNfcAudit(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-200">Cryptographic NFC Physical Asset Audit</div>
                        <div className="text-[11px] text-slate-400">NTAG 424 DNA site tag setup & insurer risk log thread</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-400">+$350 CAD (From)</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Estimate Summary & Direct Mail Dispatch */}
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
                    <span>Spatial AI Flight & Analytics:</span>
                    <span className="font-mono text-slate-200">${calculations.droneCost.toLocaleString()} CAD</span>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-white">Estimated Total:</span>
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      ${calculations.totalEstimate.toLocaleString()} <span className="text-xs font-normal text-slate-400">CAD</span>
                    </span>
                  </div>
                </div>

                {/* Direct Contact & Submission Box */}
                <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    Submit Proposal to Steven Ramirez
                  </h4>

                  <input
                    type="text"
                    placeholder="Your Name / Enterprise Organization"
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
                    placeholder="Project details / Site location..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>

                  <a
                    href={mailtoUrl}
                    onClick={() => setMailClicked(true)}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-center cursor-pointer uppercase tracking-wider block"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Click to Email Quote (steven@bastidor.ca)
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002-2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2 2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
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
        )}

      </main>
    </div>
  );
}
Bastidor_V4.0_Spatial_AI_Engine.txt
Displaying Bastidor_V4.0_Spatial_AI_Engine.txt.
