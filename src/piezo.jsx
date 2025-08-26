import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Footprints, Battery, Calculator, Sparkles, Building2 } from "lucide-react";
import { Card, CardContent } from "./components/ui/Card";
import { Button } from "./components/ui/Button";

/**
 * Electricity-Generating Tiles – Single-file React page
 * - TailwindCSS for styling
 * - shadcn/ui Cards & Buttons
 * - framer-motion for interactions
 *
 * Notes:
 * - All assumptions are adjustable in the Impact Calculator.
 * - Default cost: ₹110 per sq ft (user requirement).
 */

const currency = (n) => `₹${n.toLocaleString("en-IN")}`;
const num = (n, d = 0) => n.toLocaleString("en-IN", { maximumFractionDigits: d, minimumFractionDigits: d });

export default function App() {
  // --- Calculator state ---
  const [areaSqft, setAreaSqft] = useState(500); // area covered by tiles
  const [trafficPerDay, setTrafficPerDay] = useState(8000); // people/day typical mall footfall
  const [stepsPerPerson, setStepsPerPerson] = useState(4); // average steps on the tiled zone
  const [joulesPerStep, setJoulesPerStep] = useState(1.5); // energy captured per step (J)
  const [efficiency, setEfficiency] = useState(0.7); // storage+inversion efficiency
  const [tariffINR, setTariffINR] = useState(8); // ₹/kWh

  // --- Costs ---
  const COST_PER_SQFT = 110; // ₹
  const capex = useMemo(() => areaSqft * COST_PER_SQFT, [areaSqft]);

  // --- Energy math ---
  const rawJoulesDay = useMemo(() => trafficPerDay * stepsPerPerson * joulesPerStep, [trafficPerDay, stepsPerPerson, joulesPerStep]);
  const netJoulesDay = useMemo(() => rawJoulesDay * efficiency, [rawJoulesDay, efficiency]);
  const kWhDay = useMemo(() => netJoulesDay / 3600000, [netJoulesDay]);
  const kWhMonth = useMemo(() => kWhDay * 30, [kWhDay]);
  const dailySavings = useMemo(() => kWhDay * tariffINR, [kWhDay, tariffINR]);
  const monthlySavings = useMemo(() => kWhMonth * tariffINR, [kWhMonth, tariffINR]);
  const simplePaybackMonths = useMemo(() => (monthlySavings > 0 ? capex / monthlySavings : Infinity), [capex, monthlySavings]);

  // --- Interactive tile ---
  const [liveSteps, setLiveSteps] = useState(0);
  const [tileCharged, setTileCharged] = useState(false);

  const handleStep = () => {
    setLiveSteps((s) => s + 1);
    setTileCharged(true);
    setTimeout(() => setTileCharged(false), 400);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/60 px-3 py-1 ring-1 ring-slate-700 mb-4">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Prototype concept for high-footfall spaces</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-semibold leading-tight">
                Electricity‑Generating Tiles
              </h1>
              <p className="mt-3 text-slate-300 max-w-2xl">
                Turn footsteps into usable electricity. Perfect for malls, transit hubs, campuses, and smart-city corridors. Explore how it works and estimate real‑world impact with the calculator below.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="#how-it-works"><Button className="rounded-2xl text-base px-5">See How It Works</Button></a>
                <a href="#calculator"><Button variant="secondary" className="rounded-2xl text-base px-5">Impact Calculator</Button></a>
              </div>
            </div>

            {/* Interactive Tile */}
            <div className="flex-1 w-full">
              <Card className="bg-slate-900/60 border-slate-800 shadow-2xl rounded-3xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Footprints className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Try the Tile</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative">
                        <motion.button
                          onClick={handleStep}
                          whileTap={{ scale: 0.96 }}
                          className="relative w-52 h-52 rounded-3xl bg-slate-800 ring-4 ring-slate-700 shadow-xl overflow-hidden"
                        >
                          {/* glow */}
                          <AnimatePresence>
                            {tileCharged && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.9 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-cyan-400/30"
                              />
                            )}
                          </AnimatePresence>
                          {/* inner grid lines */}
                          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:16px_16px]" />
                          <div className="absolute inset-x-0 bottom-0 p-2 text-center text-sm text-slate-300">Click to step ⚡</div>
                        </motion.button>
                      </div>
                      <div className="mt-3 text-slate-300 text-sm">Live steps on demo tile: <span className="font-semibold text-white">{liveSteps}</span></div>
                    </div>

                    {/* Flow visualization */}
                    <div className="flex flex-col gap-3 justify-center">
                      <FlowItem icon={<Zap className="h-5 w-5" />} title="Pressure → Voltage" desc="Piezo layers deform under footstep creating electrical potential." active={tileCharged} />
                      <FlowItem icon={<Battery className="h-5 w-5" />} title="Rectify & Store" desc="AC output is conditioned and stored in a battery/capacitor bank." active={tileCharged} />
                      <FlowItem icon={<Building2 className="h-5 w-5" />} title="Power Loads" desc="Energy supports LED signage, ambient lighting, kiosks, or sensors." active={tileCharged} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard icon={<Zap />} title="Piezoelectric Stack">
              Each tile contains a piezoelectric stack sandwiched in a rugged composite. When stepped on, the stack produces a small burst of electricity.
            </InfoCard>
            <InfoCard icon={<Battery />} title="Power Electronics">
              The raw output is rectified, smoothed, and routed to storage. Energy can be buffered to run LEDs, displays, or fed into a microgrid.
            </InfoCard>
            <InfoCard icon={<Calculator />} title="Sized for Footfall">
              Output scales with people and steps. Use the calculator to model your mall’s corridor or atrium and compare costs vs. savings.
            </InfoCard>
          </div>
        </div>
      </section>

      {/* Cost & Calculator */}
      <section id="calculator" className="py-4 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="bg-slate-900/60 border-slate-800 rounded-3xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2"><Calculator className="h-5 w-5" /><h3 className="text-lg font-medium">Impact Calculator</h3></div>

                <Field label={`Area (sq ft)`}>
                  <input type="range" min={50} max={5000} step={10} value={areaSqft} onChange={(e)=>setAreaSqft(parseInt(e.target.value))} className="w-full" />
                  <div className="text-sm text-slate-300">{num(areaSqft)} sq ft</div>
                </Field>

                <Field label={`Foot Traffic (people/day)`}>
                  <input type="range" min={500} max={100000} step={500} value={trafficPerDay} onChange={(e)=>setTrafficPerDay(parseInt(e.target.value))} className="w-full" />
                  <div className="text-sm text-slate-300">{num(trafficPerDay)}</div>
                </Field>

                <Field label={`Avg Steps on Tiles per Person` }>
                  <input type="range" min={1} max={20} step={1} value={stepsPerPerson} onChange={(e)=>setStepsPerPerson(parseInt(e.target.value))} className="w-full" />
                  <div className="text-sm text-slate-300">{num(stepsPerPerson)}</div>
                </Field>

                <Field label={`Energy Captured per Step (J)`}>
                  <input type="range" min={0.2} max={5} step={0.1} value={joulesPerStep} onChange={(e)=>setJoulesPerStep(parseFloat(e.target.value))} className="w-full" />
                  <div className="text-sm text-slate-300">{num(joulesPerStep,1)} J/step</div>
                </Field>

                <Field label={`System Efficiency (0–1)`}>
                  <input type="range" min={0.3} max={0.95} step={0.01} value={efficiency} onChange={(e)=>setEfficiency(parseFloat(e.target.value))} className="w-full" />
                  <div className="text-sm text-slate-300">{num(efficiency,2)}</div>
                </Field>

                <Field label={`Electricity Tariff (₹/kWh)`}>
                  <input type="range" min={4} max={20} step={0.5} value={tariffINR} onChange={(e)=>setTariffINR(parseFloat(e.target.value))} className="w-full" />
                  <div className="text-sm text-slate-300">{num(tariffINR,1)} ₹/kWh</div>
                </Field>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-slate-900/60 border-slate-800 rounded-3xl lg:col-span-2">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Stat title="CapEx (Tiles Only)" value={currency(capex)} subtitle={`@ ₹${COST_PER_SQFT}/sq ft for ${num(areaSqft)} sq ft`} />
                  <Stat title="Daily Energy" value={`${num(kWhDay,3)} kWh`} subtitle={`${num(netJoulesDay,0)} J net`} />
                  <Stat title="Monthly Energy" value={`${num(kWhMonth,2)} kWh`} subtitle={`${num(kWhDay,3)} kWh/day`} />
                  <Stat title="Daily Savings" value={currency(dailySavings.toFixed(0))} subtitle={`@ ₹${num(tariffINR,1)}/kWh`} />
                  <Stat title="Monthly Savings" value={currency(monthlySavings.toFixed(0))} subtitle={`≈ ${num(kWhMonth,2)} kWh`} />
                  <Stat title="Simple Payback" value={`${isFinite(simplePaybackMonths) ? num(simplePaybackMonths,1) : "—"} months`} subtitle="(tiles cost only)" />
                </div>

                <div className="mt-6 text-sm text-slate-400 leading-relaxed">
                  <p className="mb-2">
                    <strong className="text-slate-200">Assumptions:</strong> Values here are illustrative and adjustable. Actual output depends on tile design, piezo stack, load electronics, and placement.
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Coverage cost fixed at <span className="text-slate-200 font-medium">₹110/sq ft</span> (as specified).</li>
                    <li>Foot traffic typical for mid-to-large Indian malls (configure as needed).</li>
                    <li>Energy per step default <span className="text-slate-200 font-medium">1.5 J</span>; adjust slider to explore conservative/optimistic cases.</li>
                  </ul>
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                  <a href="#contact"><Button className="rounded-2xl text-base px-6">Request a Demo</Button></a>
                  <div className="text-slate-400 text-sm">Ideal sites: <span className="text-slate-200">malls, metro stations, airports, stadiums, campuses</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact / Footer */}
      <section id="contact" className="py-10 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-semibold">Step into the Future</h3>
              <p className="text-slate-300 mt-2">Want this in your mall? Share your corridor size and footfall to receive a tailored estimate and deployment plan.</p>
            </div>
            <Card className="bg-slate-900/60 border-slate-800 rounded-3xl">
              <CardContent className="p-6">
                <form className="grid grid-cols-1 gap-3">
                  <input placeholder="Your Name" className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2" />
                  <input placeholder="Email or Phone" className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2" />
                  <textarea placeholder="Tell us your area (sq ft) & daily footfall" className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 h-24" />
                  <Button type="button" className="rounded-2xl">Send Inquiry</Button>
                </form>
              </CardContent>
            </Card>
          </div>
          <p className="text-slate-500 text-xs mt-6">© {new Date().getFullYear()} Electricity‑Generating Tiles Concept. For demonstration and academic use.</p>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ icon, title, children }) {
  return (
    <Card className="bg-slate-900/60 border-slate-800 rounded-3xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-slate-800/70 ring-1 ring-slate-700">{icon}</div>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{children}</p>
      </CardContent>
    </Card>
  );
}

function Stat({ title, value, subtitle }) {
  return (
    <div className="p-4 rounded-2xl bg-slate-950/50 ring-1 ring-slate-800">
      <div className="text-slate-400 text-xs uppercase tracking-wide">{title}</div>
      <div className="text-xl sm:text-2xl font-semibold mt-1">{value}</div>
      {subtitle && <div className="text-slate-400 text-xs mt-1">{subtitle}</div>}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-sm text-slate-200 mb-1">{label}</div>
      {children}
    </div>
  );
}

function FlowItem({ icon, title, desc, active }) {
  return (
    <div className={`relative p-3 rounded-2xl ring-1 ${active ? "bg-emerald-900/20 ring-emerald-700/40" : "bg-slate-950/40 ring-slate-800"}`}>
      <div className="flex items-center gap-2">
        <div className={`p-2 rounded-xl ${active ? "bg-emerald-800/50" : "bg-slate-800/70"}`}>
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-slate-300">{desc}</div>
        </div>
      </div>
    </div>
  );
}
