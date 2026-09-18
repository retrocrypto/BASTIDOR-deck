'use client';

import React, { useState, useMemo } from 'react';

export default function BastidorEstimatorApp() {
  const [areaSqFt, setAreaSqFt] = useState<number>(2500);
  const [roofPitch, setRoofPitch] = useState<number>(6); // e.g. 6/12 pitch
  const [materialType, setMaterialType] = useState<string>('architectural');
  const [includeThermal, setIncludeThermal] = useState<boolean>(true);
  const [include3dModel, setInclude3dModel] = useState<boolean>(true);

  // Client Details
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [mailClicked, setMailClicked] = useState<boolean>(false);

  const calculations = useMemo(() => {
    // Pitch Factor calculation
    const pitchFactor = 1 + (roofPitch / 12) * 0.15;
    const adjustedArea = areaSqFt * pitchFactor;

    // Rates per sq ft
    const rates: Record<string, number> = {
      asphalt: 4.5,
      architectural: 6.2,
      standing_seam: 11.5,
      slate_tile: 18.0,
    };

    const materialRate = rates[materialType] || 6.2;
    const baseMaterialCost = adjustedArea * materialRate;

    // Drone inspection costs
    let droneCost = 350; // base inspection
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
Thermal Infrared Flight: ${includeThermal ? 'YES' : 'NO'}
3D Mesh Model: ${include3dModel ? 'YES' : 'NO'}

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-16">
      {}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
                B
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Bastidor Drone &amp; Material Estimator
              </h1>
            </div>
            {/* Email prominently displayed directly under top-left header */}
            <p className="text-xs sm:text-sm text-emerald-400 font-medium mt-1 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Direct Quote &amp; Demo Contact: <a href="mailto:steven@bastidor.ca" className="underline hover:text-emerald-300 font-bold">steven@bastidor.ca</a>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={mailtoUrl}
              onClick={() => setMailClicked(true)}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Email Steven Directly
            </a>
          </div>
        </div>
      </header>

      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Interactive Sliders & Options */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Surface Area Slider */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-bold text-slate-200">
                  Roof / Surface Area (Sq Ft)
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
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>500 sq ft</span>
                <span>5,000 sq ft</span>
                <span>10,000 sq ft</span>
              </div>
            </div>

            {/* Pitch Slider */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
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
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <p className="text-xs text-slate-400 mt-2">
                Higher pitch increases total waste factor and actual surface area (+{Math.round((roofPitch/12)*15)}% multiplier).
              </p>
            </div>

            {/* Material Selector */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
              <label className="block text-sm font-bold text-slate-200 mb-3">
                Material Grade &amp; Type
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
                    className={`p-3.5 rounded-xl border text-left transition ${
                      materialType === mat.id
                        ? 'border-emerald-500 bg-emerald-950/40 text-white'
                        : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm text-slate-100">{mat.name}</div>
                    <div className="text-xs text-emerald-400 font-mono mt-0.5">{mat.price}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Drone Analytics Services */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
              <label className="block text-sm font-bold text-slate-200 mb-3">
                Bastidor Drone Inspection Options
              </label>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={includeThermal}
                      onChange={(e) => setIncludeThermal(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-200">Thermal Infrared Scan</div>
                      <div className="text-xs text-slate-400">Detect subsurface moisture and thermal leaks</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">+$250 CAD</span>
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={include3dModel}
                      onChange={(e) => setInclude3dModel(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-200">3D Mesh Digital Twin</div>
                      <div className="text-xs text-slate-400">High-resolution photogrammetry model</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">+$300 CAD</span>
                </label>
              </div>
            </div>

          </div>

          {}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Pricing Summary Box */}
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <h3 className="text-lg font-extrabold text-white mb-4 border-b border-slate-800 pb-3 flex items-center justify-between">
                <span>Estimate Summary</span>
                <span className="text-xs font-mono text-emerald-400 font-normal">CAD $</span>
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Effective Roof Area:</span>
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
                  <span className="text-base font-bold text-white">Estimated Total:</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    ${calculations.totalEstimate.toLocaleString()} <span className="text-xs font-normal text-slate-400">CAD</span>
                  </span>
                </div>
              </div>

              {/* Direct Mail Form */}
              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Submit Proposal to Steven Ramirez
                </h4>

                <input
                  type="text"
                  placeholder="Your Name / Organization"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <textarea
                  rows={2}
                  placeholder="Additional project details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                ></textarea>

                {/* Primary Mailto Trigger Anchor */}
                <a
                  href={mailtoUrl}
                  onClick={() => setMailClicked(true)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 text-center cursor-pointer block"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Click to Email Quote (steven@bastidor.ca)
                </a>

                {/* Secondary Fallback Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {copied ? '✓ Email Copied to Clipboard!' : 'Copy Email Address (steven@bastidor.ca)'}
                </button>

                {mailClicked && (
                  <p className="text-xs text-center text-emerald-400 font-medium pt-1">
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
