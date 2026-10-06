import React, { useState } from 'react';
import {
  TECHNICAL_MANUALS,
  CONNECTOR_PINOUTS,
  INSTRUMENT_EQ_TABLE,
  CABLE_GAUGE_TABLE,
  ASSETS,
  ManualDocument,
} from '../data/audioEngineeringData';
import { BookOpen, Table, Calculator, Search, CheckSquare, Square, Cable } from 'lucide-react';

type SubView = 'manuals' | 'eq-table' | 'pinouts' | 'cables-calc';

export const ManualsAndTables: React.FC = () => {
  const [subView, setSubView] = useState<SubView>('manuals');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeManual, setActiveManual] = useState<ManualDocument>(TECHNICAL_MANUALS[0]);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [imgError, setImgError] = useState<boolean>(false);

  // Interactive Impedance & Electrical Calculator State
  const [speakerImpedance, setSpeakerImpedance] = useState<number>(8);
  const [speakerCount, setSpeakerCount] = useState<number>(2);
  const [systemWatts, setSystemWatts] = useState<number>(6000);
  const [gridVoltage, setGridVoltage] = useState<number>(220);

  const toggleCheck = (key: string) => {
    setCheckedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const categories = ['Todos', 'Sistemas & PA', 'Consoles & Digital', 'RF & Palco', 'Elétrica & Acústica'];

  const filteredManuals = TECHNICAL_MANUALS.filter((m) => {
    const matchesCat = selectedCategory === 'Todos' || m.category === selectedCategory;
    const matchesQuery =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const filteredEq = INSTRUMENT_EQ_TABLE.filter(
    (item) =>
      item.instrument.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Parallel impedance & estimated DC resistance
  const parallelOhms = speakerImpedance / speakerCount;
  const expectedDcRe = parallelOhms * 0.75;
  // Current draw with power factor 0.85 and Class-D efficiency
  const currentAmps = systemWatts / (gridVoltage * 0.85);

  return (
    <section className="space-y-6">
      {/* Header & Sub-Navigation */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs font-mono text-amber-400 mb-1">
            Acervo de Engenharia de Som · Normas AES / IEC
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
            Manuais Técnicos, Tabelas e Pinagens
          </h2>
        </div>

        {/* Interactive Section Selector (No horizontal scrollbar) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setSubView('manuals')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[40px] flex items-center gap-2 ${
              subView === 'manuals'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            Manuais de Campo
          </button>
          <button
            type="button"
            onClick={() => setSubView('eq-table')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[40px] flex items-center gap-2 ${
              subView === 'eq-table'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Table className="w-4 h-4 shrink-0" />
            Tabela de EQ
          </button>
          <button
            type="button"
            onClick={() => setSubView('pinouts')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[40px] flex items-center gap-2 ${
              subView === 'pinouts'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Cable className="w-4 h-4 shrink-0" />
            Pinagem Conectores
          </button>
          <button
            type="button"
            onClick={() => setSubView('cables-calc')}
            className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[40px] flex items-center gap-2 ${
              subView === 'cables-calc'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0" />
            Cabos & Impedância
          </button>
        </div>
      </div>

      {/* SUBVIEW 1: TECHNICAL MANUALS */}
      {subView === 'manuals' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 5 Cols: Filterable List of Manuals */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por tema (ex: Smaart, Dante, Ganho, Cardióide)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap min-h-[36px] ${
                    selectedCategory === cat
                      ? 'bg-slate-100 text-slate-950 font-semibold'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-2.5">
              {filteredManuals.map((manual) => (
                <button
                  key={manual.id}
                  type="button"
                  onClick={() => setActiveManual(manual)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    activeManual.id === manual.id
                      ? 'bg-slate-900 border-amber-500/70'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <span className="font-mono text-amber-400 font-semibold">
                      Manual {manual.number}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{manual.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{manual.level}</span>
                    <span aria-hidden="true">·</span>
                    <span>{manual.readTime}</span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-100 leading-snug">
                    {manual.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{manual.summary}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Right 7 Cols: Active Manual Reader & Interactive Field Checklist */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-amber-400 font-semibold">
                  Documento Técnico {activeManual.number}
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeManual.category}</span>
                <span aria-hidden="true">·</span>
                <span>Nível {activeManual.level}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-50">
                {activeManual.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">{activeManual.summary}</p>
            </div>

            {/* Key Engineering Formula Callout */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-slate-400">Equação / Referência de Engenharia:</span>
              <code className="text-sm font-mono tabular-nums text-amber-400 font-semibold">
                {activeManual.keyFormula}
              </code>
            </div>

            {/* Sections & Interactive Setup Checklists */}
            <div className="space-y-6">
              {activeManual.sections.map((sec, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-base font-semibold text-slate-100">
                    {idx + 1}. {sec.heading}
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{sec.body}</p>

                  {sec.checklist && (
                    <div className="pt-2 space-y-2">
                      <div className="text-xs font-mono text-slate-400">
                        Checklist Operacional de Campo (Clique para marcar durante a montagem):
                      </div>
                      {sec.checklist.map((item, cIdx) => {
                        const key = `${activeManual.id}-${idx}-${cIdx}`;
                        const isChecked = !!checkedItems[key];
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => toggleCheck(key)}
                            className={`w-full text-left p-3 rounded-xl border transition-colors flex items-start gap-3 min-h-[44px] ${
                              isChecked
                                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                                : 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                            )}
                            <span className="text-xs sm:text-sm leading-relaxed">{item}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Technical Diagram Visual Slot with Resilient Fallback */}
            <div className="pt-4 border-t border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                <div className="sm:col-span-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/3]">
                  {!imgError ? (
                    <img
                      src={ASSETS.lineArray}
                      alt="Diagrama isométrico de sistema Line Array e Subwoofers"
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs font-mono text-slate-400">
                      Diagrama Técnico Line Array WST & Cardióide
                    </div>
                  )}
                </div>
                <div className="sm:col-span-7 space-y-1.5">
                  <div className="text-xs font-mono text-amber-400">
                    Nota de Rigging e Acoplamento Acústico
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Antes de içar o cluster no motor (talha), confira sempre o pino de segurança nos ângulos de splay do bumper e meça a impedância de cada via no multipino Speakon NL8 ao nível do solo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBVIEW 2: SURGICAL EQ & COMPRESSION TABLE */}
      {subView === 'eq-table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Tabela Técnica de Equalização Cirúrgica e Dinâmica por Instrumento
              </h3>
              <p className="text-xs text-slate-400">
                Valores de referência para ponto de partida em PAs alinhados; ajuste sempre ouvindo o contexto da mixagem
              </p>
            </div>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar instrumento..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400">
                  <th className="py-3 px-3">Instrumento</th>
                  <th className="py-3 px-3">HPF (Low Cut)</th>
                  <th className="py-3 px-3">Fundamental / Peso</th>
                  <th className="py-3 px-3">Corte de Lama (Mud)</th>
                  <th className="py-3 px-3">Presença / Ataque</th>
                  <th className="py-3 px-3">Compressão & Tempos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs font-mono tabular-nums">
                {filteredEq.map((row) => (
                  <tr key={row.instrument} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3 font-sans">
                      <div className="font-semibold text-slate-100 text-sm">{row.instrument}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{row.notes}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">{row.highPassHz}</td>
                    <td className="py-3.5 px-3 text-emerald-400">{row.fundamentalHz}</td>
                    <td className="py-3.5 px-3 text-rose-400">{row.mudCutHz}</td>
                    <td className="py-3.5 px-3 text-amber-400">{row.presenceBoostHz}</td>
                    <td className="py-3.5 px-3 text-slate-300">
                      <div>Ratio {row.compressionRatio}</div>
                      <div className="text-[11px] text-slate-400">{row.attackRelease}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBVIEW 3: CONNECTOR PINOUTS */}
      {subView === 'pinouts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CONNECTOR_PINOUTS.map((conn) => (
            <div
              key={conn.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="border-b border-slate-800 pb-3">
                  <div className="text-xs font-mono text-amber-400">{conn.standard}</div>
                  <h3 className="text-lg font-semibold text-slate-100 mt-0.5">{conn.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{conn.application}</p>
                </div>

                <div className="space-y-2">
                  {conn.pins.map((p) => (
                    <div
                      key={p.pin}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <span className="font-mono font-semibold text-xs text-amber-400">
                          {p.pin}
                        </span>
                        <span className="mx-2 text-slate-600">·</span>
                        <span className="text-xs font-semibold text-slate-100">{p.signal}</span>
                        <div className="text-[11px] text-slate-400 mt-0.5">{p.notes}</div>
                      </div>
                      <div className="text-[11px] font-mono text-slate-300 shrink-0">
                        Condutor: {p.wireColor}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                <span className="font-semibold">Dica Prática de Bancada: </span>
                {conn.fieldTip}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBVIEW 4: SPEAKER CABLE GAUGE TABLE & IMPEDANCE/POWER CALCULATOR */}
      {subView === 'cables-calc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Cols: Cable Gauge Reference Table */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Tabela de Bitola de Cabos Speakon (Perda Máxima de 0,5 dB)
              </h3>
              <p className="text-xs text-slate-400">
                Comprimento máximo recomendado do cabo entre o rack de amplificadores e as caixas acústicas
              </p>
            </div>

            <div className="w-full">
              <table className="w-full text-left border-collapse font-mono tabular-nums text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                    <th className="py-3 px-3">Bitola AWG / mm²</th>
                    <th className="py-3 px-3 text-right">Ω / km</th>
                    <th className="py-3 px-3 text-right">Carga 8 Ω</th>
                    <th className="py-3 px-3 text-right">Carga 4 Ω</th>
                    <th className="py-3 px-3 text-right">Carga 2 Ω</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {CABLE_GAUGE_TABLE.map((row) => (
                    <tr key={row.awg} className="hover:bg-slate-800/30">
                      <td className="py-3.5 px-3 font-sans">
                        <div className="font-semibold text-slate-100 font-mono">
                          {row.mm2} ({row.awg})
                        </div>
                        <div className="text-[11px] text-slate-400">{row.recommendedUse}</div>
                      </td>
                      <td className="py-3.5 px-3 text-right text-slate-300">
                        {row.resistanceOhmPerKm.toFixed(2)} Ω
                      </td>
                      <td className="py-3.5 px-3 text-right text-emerald-400 font-semibold">
                        até {row.maxDist8OhmM} m
                      </td>
                      <td className="py-3.5 px-3 text-right text-amber-400 font-semibold">
                        até {row.maxDist4OhmM} m
                      </td>
                      <td className="py-3.5 px-3 text-right text-rose-400 font-semibold">
                        até {row.maxDist2OhmM} m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right 5 Cols: Live Impedance & Main Power Calculator */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Calculadora de Associação de Caixas e Elétrica
              </h3>
              <p className="text-xs text-slate-400">
                Verifique impedância resultante no amplificador, leitura esperada no multímetro (Re DC) e corrente do disjuntor
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="calc-z" className="text-slate-300 font-medium">
                    Impedância Individual de Cada Caixa
                  </label>
                  <span className="font-mono tabular-nums text-amber-400 font-semibold">
                    {speakerImpedance} Ohms
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[4, 8, 16].map((z) => (
                    <button
                      key={z}
                      type="button"
                      onClick={() => setSpeakerImpedance(z)}
                      className={`py-2 rounded-lg text-xs font-mono border min-h-[40px] ${
                        speakerImpedance === z
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      {z} Ω
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="calc-qty" className="text-slate-300 font-medium">
                    Quantidade de Caixas em Paralelo no Canal
                  </label>
                  <span className="font-mono tabular-nums text-amber-400 font-semibold">
                    {speakerCount} caixas
                  </span>
                </div>
                <input
                  id="calc-qty"
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={speakerCount}
                  onChange={(e) => setSpeakerCount(Number(e.target.value))}
                  className="w-full audio-fader"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="calc-watts" className="text-slate-300 font-medium">
                    Potência Total do Sistema de Áudio (Watts)
                  </label>
                  <span className="font-mono tabular-nums text-slate-200 font-semibold">
                    {systemWatts} W
                  </span>
                </div>
                <input
                  id="calc-watts"
                  type="range"
                  min={1000}
                  max={40000}
                  step={1000}
                  value={systemWatts}
                  onChange={(e) => setSystemWatts(Number(e.target.value))}
                  className="w-full audio-fader"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-300">Tensão da Rede AC:</span>
                <div className="flex gap-2">
                  {[127, 220].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setGridVoltage(v)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border min-h-[38px] ${
                        gridVoltage === v
                          ? 'bg-slate-100 text-slate-950 border-white font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      {v} VAC
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Readout */}
            <div className="grid grid-cols-2 gap-3 font-mono tabular-nums pt-3 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">Impedância Final AC</div>
                <div
                  className={`text-lg font-semibold ${
                    parallelOhms < 2 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {parallelOhms.toFixed(2)} Ω
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {parallelOhms < 2 ? '■ Risco de Proteção (< 2Ω)' : '● Carga Segura'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-[11px] text-slate-400">Leitura Multímetro (Re)</div>
                <div className="text-lg font-semibold text-amber-400">
                  ~{expectedDcRe.toFixed(1)} Ω DC
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Nos pinos 1+ e 1-</div>
              </div>

              <div className="col-span-2 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">
                    Corrente Estimada em {gridVoltage}V (FP 0.85)
                  </div>
                  <div className="text-base font-semibold text-sky-400">
                    {currentAmps.toFixed(1)} Amperes (Regime Contínuo)
                  </div>
                </div>
                <div className="text-right text-xs text-slate-300">
                  Disjuntor sugerido:{' '}
                  <span className="text-amber-400 font-semibold">
                    {Math.ceil((currentAmps * 1.25) / 10) * 10} A
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
