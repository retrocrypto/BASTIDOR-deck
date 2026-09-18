'use client';
import React, { useState, useMemo } from 'react';
export default function BastidorEstimator() {
// Slider States
const [areaSqFt, setAreaSqFt] = useState<number>(2500);
const [roofPitch, setRoofPitch] = useState<number>(6); // 6/12 pitch
const [materialType, setMaterialType] = useState<string>('architectural');
const [includeThermal, setIncludeThermal] = useState<boolean>(true);
const [include3dModel, setInclude3dModel] = useState<boolean>(true);
// Lead Form States
const [clientName, setClientName] = useState<string>('');
const [clientEmail, setClientEmail] = useState<string>('');
const [clientPhone, setClientPhone] = useState<string>('');
const [notes, setNotes] = useState<string>('');
const [submitted, setSubmitted] = useState<boolean>(false);
// Calculations
const calculations = useMemo(() => {
// Pitch Multiplier
const pitchFactor = 1 + (roofPitch / 12) * 0.15;
const adjustedArea = areaSqFt * pitchFactor;
    // Material Pricing per sq ft
    const rates: Record<string, number> = {
      asphalt: 4.5,
      architectural: 6.2,
      standing_seam: 11.5,
      slate_tile: 18.0,
    };

    const materialRate = rates[materialType] || 6.2;
    const baseMaterialCost = adjustedArea * materialRate;

    // Drone Scan & Software Processing
    let droneCost = 350; // base visual flight
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
// Construct pre-filled email to steven@bastidor.ca
const handleSendQuoteEmail = (e: React.FormEvent) => {
e.preventDefault();
    const subject = encodeURIComponent(
      `New Bastidor Quote & Demo Request - ${clientName || 'Valued Client'}`
    );

    const bodyText = `Hello Steven,

I would like to request an official quote / live demo for Bastidor Drone & Material Estimator.
--- CLIENT DETAILS ---
Name: ${clientName || 'Not provided'}
Email: ${clientEmail || 'Not provided'}
Phone: ${clientPhone || 'Not provided'}
Notes: ${notes || 'None'}
--- PROJECT ESTIMATE SUMMARY ---
Roof / Surface Area: ${areaSqFt.toLocaleString()} sq ft
Roof Pitch: ${roofPitch}/12
Material Selected: ${materialType.toUpperCase()}
Thermal Infrared Flight: ${includeThermal ? 'YES' : 'NO'}
3D Mesh Model: ${include3dModel ? 'YES' : 'NO'}
Calculated Effective Area: ${calculations.adjustedArea.toLocaleString()} sq ft
Estimated Material Cost: $${calculations.baseMaterialCost.toLocaleString()} CAD
Estimated Drone & Analytics Cost: $${calculations.droneCost.toLocaleString()} CAD
ESTIMATED TOTAL: $${calculations.totalEstimate.toLocaleString()} CAD
Please contact me to schedule a demo or finalize this estimate.
Thank you!`;
    const mailtoUrl = `mailto:steven@bastidor.ca?subject=${subject}&body=${encodeURIComponent(
      bodyText
    )}`;

    window.location.href = mailtoUrl;
    setSubmitted(true);
};
return (
<div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
{/* Header Bar */}
<header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
<div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
<div className="flex items-center gap-3">
<div className="h-9 w-9 bg-emerald-500 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-emerald-500/20">
B
</div>
<div>
<h1 className="font-bold text-lg leading-tight tracking-wide text-white">
BASTIDOR
</h1>
<p className="text-xs text-slate-400">
Drone & Material Estimator
</p>
</div>
</div>
<div className="flex items-center gap-4">
<ahref="/deck.html"className="text-xs font-semibold px-3 py-2 rounded-md bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition">
View Deck / Contact
</a>
<ahref="mailto:steven@bastidor.ca"className="text-xs font-semibold px-4 py-2 rounded-md bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition">
Direct Email
</a>
</div>
</div>
</header>
      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Title Banner */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-emerald-400 text-xs font-semibold tracking-wider uppercase bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full">
            Precision Roofing Analytics
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-3">
            Instant Material & Drone Flight Estimator
          </h2>
          <p className="text-slate-400 text-sm mt-2 max-w-2xl">
            Adjust the project sliders below to calculate custom material quantities and drone thermal inspection pricing. Send the quote directly to Steven Ramirez in one click.
          </p>
        </div>

        {/* Grid Layout: Sliders on Left, Quote & Email Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Interactive Sliders & Options (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              Project Parameters & Sliders
            </h3>

            {/* Slider 1: Surface Area */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-300">
                  Estimated Roof Surface Area
                </label>
                <span className="text-emerald-400 font-bold text-base">
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
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>500 sq ft</span>
                <span>5,000 sq ft</span>
                <span>10,000 sq ft</span>
              </div>
            </div>

            {/* Slider 2: Roof Pitch */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-300">
                  Roof Incline / Pitch
                </label>
                <span className="text-emerald-400 font-bold text-base">
                  {roofPitch} / 12 Pitch
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={roofPitch}
                onChange={(e) => setRoofPitch(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Low (1/12)</span>
                <span>Standard (6/12)</span>
                <span>Steep (12/12)</span>
              </div>
            </div>

            {/* Material Dropdown */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Material Grade & Type
              </label>
              <select
                value={materialType}
                onChange={(e) => setMaterialType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-emerald-500 text-sm"
              >
                <option value="asphalt">Standard Asphalt Shingles ($4.50 / sq ft)</option>
                <option value="architectural">Architectural 30-Yr Shingles ($6.20 / sq ft)</option>
                <option value="standing_seam">Standing Seam Metal Roofing ($11.50 / sq ft)</option>
                <option value="slate_tile">Slate / Custom Tile ($18.00 / sq ft)</option>
              </select>
            </div>

            {/* Drone Addons Toggles */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Drone Flight & Scanning Packages
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setIncludeThermal(!includeThermal)}
                  className={`p-4 rounded-xl border text-left transition flex justify-between items-center ${
                    includeThermal
                      ? 'border-emerald-500 bg-emerald-950/30 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold">Thermal FLIR Scan</div>
                    <div className="text-xs text-slate-400 mt-0.5">Detect moisture leaks</div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-800 rounded">
                    +$250
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setInclude3dModel(!include3dModel)}
                  className={`p-4 rounded-xl border text-left transition flex justify-between items-center ${
                    include3dModel
                      ? 'border-emerald-500 bg-emerald-950/30 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold">3D Photogrammetry</div>
                    <div className="text-xs text-slate-400 mt-0.5">CAD & BIM Mesh Model</div>
                  </div>
                  <span className="text-xs font-semibold px-2 py-1 bg-slate-800 rounded">
                    +$300
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Calculation + Direct Email Form (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Live Pricing Breakdown Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex justify-between items-center">
                <span>Calculated Estimate</span>
                <span className="text-xs font-normal text-slate-400">CAD Currency</span>
              </h3>

              <div className="space-y-3 mt-4 text-sm">
                <div className="flex justify-between text-slate-400">
                  <span>Adjusted Surface Area:</span>
                  <span className="text-slate-200 font-medium">
                    {calculations.adjustedArea.toLocaleString()} sq ft
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Materials & Hardware:</span>
                  <span className="text-slate-200 font-medium">
                    ${calculations.baseMaterialCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Drone Inspection & Software:</span>
                  <span className="text-slate-200 font-medium">
                    ${calculations.droneCost.toLocaleString()}
                  </span>
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                  <span className="font-bold text-white">Estimated Total:</span>
                  <span className="text-2xl font-black text-emerald-400">
                    ${calculations.totalEstimate.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Email / Demo Lead Capture Form Box */}
            <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="mb-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Send Quote & Schedule Demo
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Sends this exact configuration directly to{' '}
                  <strong className="text-emerald-400">steven@bastidor.ca</strong>.
                </p>
              </div>

              <form onSubmit={handleSendQuoteEmail} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name / Company"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone (Optional)"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    placeholder="Project notes or preferred demo time..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Click for Quote / Demo (steven@bastidor.ca)
                </button>

                {submitted && (
                  <p className="text-xs text-center text-emerald-400 font-medium mt-2">
                    ✓ Opening email draft addressed to steven@bastidor.ca...
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
);
}
