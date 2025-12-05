import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, LabelList } from 'recharts';
import { Calculator, ArrowRight, CheckCircle2, AlertCircle, Settings2, BarChart3, ChevronRight } from 'lucide-react';
import { NUMBERS, HITS, ConstraintType, SolverResult } from './types';
import { solveSequence } from './services/sequenceSolver';
import { NumberBadge } from './components/NumberBadge';

const ConstraintSelect: React.FC<{
  label: string;
  value: ConstraintType;
  onChange: (val: ConstraintType) => void;
}> = ({ label, value, onChange }) => {
  
  // Convert complex value to string for the select element
  const selectValue = typeof value === 'number' ? value.toString() : value;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'any' || val === 'hit') {
      onChange(val);
    } else {
      onChange(parseInt(val, 10));
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <select
          value={selectValue}
          onChange={handleChange}
          className="w-full appearance-none bg-white border border-slate-300 text-slate-700 py-2.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium shadow-sm transition-shadow"
        >
          <optgroup label="General Constraints">
            <option value="any">Any Number</option>
            <option value="hit">Hit Group (-3, -6, -9)</option>
          </optgroup>
          <optgroup label="Specific Number">
            {NUMBERS.map(num => (
              <option key={num} value={num.toString()}>
                {num > 0 ? '+' : ''}{num}
              </option>
            ))}
          </optgroup>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
          <ChevronRight className="w-4 h-4 rotate-90" />
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [target, setTarget] = useState<number>(49);
  const [reqLast, setReqLast] = useState<ConstraintType>('hit');
  const [req2nd, setReq2nd] = useState<ConstraintType>('hit');
  const [req3rd, setReq3rd] = useState<ConstraintType>('hit');
  
  const [result, setResult] = useState<SolverResult | null>(null);
  const [isSolving, setIsSolving] = useState(false);

  const handleSolve = () => {
    setIsSolving(true);
    // Use setTimeout to allow UI to update to "Solving..." state before heavy computation
    // although for this algorithm it's nearly instant.
    setTimeout(() => {
      const res = solveSequence(target, reqLast, req2nd, req3rd);
      setResult(res);
      setIsSolving(false);
    }, 100);
  };

  // Trigger solve on mount or param change? Let's make it manual for better UX or debounced.
  // Manual is safer for user intent.
  useEffect(() => {
    // Initial solve for the demo values
    handleSolve();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">
                Sequence Solver
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm text-slate-500 font-medium">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Positive
             </div>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span> Negative
             </div>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span> Hit Group
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-6 text-slate-800">
                <Settings2 className="w-5 h-5" />
                <h2 className="font-bold text-lg">Configuration</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Target Sum</label>
                  <input
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                    className="w-full text-2xl font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center transition-colors"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <p className="text-sm text-slate-400 font-medium mb-2">Tail Constraints (Last 3)</p>
                  <ConstraintSelect label="Third Last" value={req3rd} onChange={setReq3rd} />
                  <ConstraintSelect label="Second Last" value={req2nd} onChange={setReq2nd} />
                  <ConstraintSelect label="Last (End)" value={reqLast} onChange={setReqLast} />
                </div>

                <button
                  onClick={handleSolve}
                  disabled={isSolving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSolving ? (
                    'Searching...'
                  ) : (
                    <>
                      Solve Sequence <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Legend / Info */}
            <div className="bg-slate-100 rounded-xl p-5 text-sm text-slate-600 leading-relaxed border border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">How it works</h3>
              <p>The solver uses a Breadth-First Search (BFS) to find the shortest path to match the target sum, ensuring the "Tail" constraints are met exactly.</p>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="font-semibold text-slate-800 mb-2">Available Numbers:</p>
                <div className="flex flex-wrap gap-1.5">
                  {NUMBERS.map(n => (
                    <span key={n} className={`px-2 py-1 rounded text-xs font-mono font-bold ${HITS.includes(n) ? 'bg-rose-100 text-rose-700' : 'bg-white text-slate-600 border border-slate-200'}`}>
                      {n > 0 ? '+' : ''}{n}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8">
            {result ? (
              result.found ? (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Success Card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                    <div className="bg-emerald-50/50 border-b border-emerald-100 p-4 flex items-center gap-3">
                      <div className="bg-emerald-100 p-1.5 rounded-full">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-emerald-900 font-bold">Optimal Solution Found</h3>
                      <div className="ml-auto flex items-center gap-2 text-sm text-emerald-700 font-medium">
                        <span className="bg-white px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                          Length: {result.totalLength}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Sequence Breakdown</div>
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Body Part */}
                        {result.body.map((num, i) => (
                          <React.Fragment key={`body-${i}`}>
                            <NumberBadge value={num} />
                            {i < result.body.length - 1 && <div className="w-2 h-0.5 bg-slate-200" />}
                          </React.Fragment>
                        ))}

                        {/* Connector if body exists */}
                        {result.body.length > 0 && <div className="w-6 h-0.5 bg-slate-300 dashed-line mx-1" />}

                        {/* Tail Part */}
                        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 border-dashed">
                          {result.tail.map((num, i) => (
                            <React.Fragment key={`tail-${i}`}>
                              <div className="relative group">
                                <NumberBadge value={num} isHit={true} /> {/* Force hit styling logic for tail visual consistency if desired, or rely on value */}
                                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                  {i === 0 ? '3rd' : i === 1 ? '2nd' : 'Last'}
                                </div>
                              </div>
                              {i < result.tail.length - 1 && <div className="w-2 h-0.5 bg-slate-200" />}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-end text-slate-500 font-mono text-sm">
                         Sum check: {result.sequence.reduce((a, b) => a + b, 0)} (Target: {target})
                      </div>
                    </div>
                  </div>

                  {/* Visualization Chart */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <BarChart3 className="w-5 h-5 text-indigo-500" />
                      <h3 className="font-bold text-slate-800">Cumulative Sum Progression</h3>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={result.cumulativeSteps} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                          <XAxis 
                            dataKey="step" 
                            stroke="#94a3b8" 
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Steps', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 12 }}
                          />
                          <YAxis 
                            stroke="#94a3b8" 
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Total Sum', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                          />
                          <ReferenceLine y={target} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Target', fill: '#ef4444', fontSize: 10, position: 'right' }} />
                          <ReferenceLine y={0} stroke="#64748b" strokeWidth={1} />
                          
                          <Line 
                            type="monotone" 
                            dataKey="sum" 
                            stroke="#4f46e5" 
                            strokeWidth={3} 
                            dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                            animationDuration={1500}
                          >
                             <LabelList dataKey="value" position="top" offset={10} fontSize={10} fill="#64748b" formatter={(val: number) => val !== 0 ? (val > 0 ? `+${val}` : val) : ''} />
                          </Line>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>
              ) : (
                // Not Found State
                <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8 flex flex-col items-center text-center animate-fade-in">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No Solution Found</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    We searched all possible combinations within a reasonable depth ({50}) and value range, but could not reach <span className="font-mono font-bold text-slate-700">{target}</span> with the given tail constraints.
                  </p>
                  <p className="mt-4 text-sm text-slate-400">Try changing the constraints or the target sum.</p>
                </div>
              )
            ) : (
               // Empty State
               <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                  <Calculator className="w-12 h-12 mb-4 opacity-20" />
                  <p>Configure the parameters and click Solve</p>
               </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
