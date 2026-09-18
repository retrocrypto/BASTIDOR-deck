// ... existing code ...
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

  // Construct dynamic mailto URL directly for trusted anchor clicks
  const mailtoUrl = useMemo(() => {
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
------------------------------------
ESTIMATED TOTAL: $${calculations.totalEstimate.toLocaleString()} CAD

Please contact me to schedule a demo or finalize this estimate.

Thank you!`;

    return `mailto:steven@bastidor.ca?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
  }, [clientName, clientEmail, clientPhone, notes, areaSqFt, roofPitch, materialType, includeThermal, include3dModel, calculations]);

  return (
// ... existing code ...
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

              <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name / Company"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="Email Address"
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

                <a
                  href={mailtoUrl}
                  onClick={() => setSubmitted(true)}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer text-center block"
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
                </a>

                {submitted && (
                  <p className="text-xs text-center text-emerald-400 font-medium mt-2">
                    ✓ Opening email client pre-addressed to steven@bastidor.ca...
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
