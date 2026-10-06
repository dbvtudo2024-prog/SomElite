import React, { useState } from 'react';
import {
  EMERGENCY_PROTOCOLS,
  BENCH_REPAIR_GUIDES,
  ASSETS,
  EmergencyProtocol,
} from '../data/audioEngineeringData';
import { Wrench, Zap, AlertTriangle, CheckCircle2, ClipboardCheck, Send } from 'lucide-react';

type RepairTab = 'sos-consult' | 'bench-repair';

interface SavedConsultation {
  id: string;
  timestamp: string;
  environment: string;
  equipment: string;
  symptom: string;
  measurement: string;
  immediateAction: string;
  technicalDiagnosis: string;
  verificationMetric: string;
}

export const RepairAndConsultation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RepairTab>('sos-consult');
  const [selectedProtocol, setSelectedProtocol] = useState<EmergencyProtocol>(
    EMERGENCY_PROTOCOLS[0]
  );
  const [imgError, setImgError] = useState<boolean>(false);

  // Interactive Rapid Technical Consultation Form State
  const [envType, setEnvType] = useState<string>('Show Ao Vivo (Emergência de Palco)');
  const [equipType, setEquipType] = useState<string>('Amplificador / Caixas Acústicas');
  const [symptomInput, setSymptomInput] = useState<string>('');
  const [measurementInput, setMeasurementInput] = useState<string>('');
  const [consultations, setConsultations] = useState<SavedConsultation[]>([
    {
      id: 'c-init-1',
      timestamp: 'Hoje · Atendimento Rápido',
      environment: 'Show Ao Vivo (Emergência de Palco)',
      equipment: 'Console Digital & Stagebox via Cat6',
      symptom: 'Estalos digitais esporádicos em todos os canais e LED Sync piscando no rack de palco',
      measurement: 'Cabo Cat6 UTP de 75 metros passando junto ao cabo trifásico de iluminação',
      immediateAction:
        'Afastar imediatamente o cabo Cat6 a pelo menos 40 cm dos cabos de força AC/Dimmer e travar o Clock Master internamente em 48 kHz caso haja conversor externo instável.',
      technicalDiagnosis:
        'Indução eletromagnética severa de SCR/Dimmer em cabo UTP sem blindagem ou switch com função Green Ethernet (EEE 802.3az) ativa atrasando pacotes de sincronismo PTP.',
      verificationMetric:
        'Zero erros de CRC no diagnóstico de porta e cabo F/UTP Cat6 blindado com conectores EtherCON aterrados no chassis.',
    },
  ]);

  const handleGenerateConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomInput.trim()) return;

    const lower = (symptomInput + ' ' + measurementInput + ' ' + equipType).toLowerCase();

    let immediateAction =
      'Isolar o canal ou via afetada utilizando o PFL/Solo do console, acionar o bypass do processamento suspeito e substituir o cabeamento de interligação imediato.';
    let technicalDiagnosis =
      'Possível degradação na linha de transmissão balanceada ou assimetria de ganho/impedância entre estágios.';
    let verificationMetric =
      'Aferir continuidade pino-a-pino (Pinos 1, 2 e 3) e confirmar tensão Neutro-Terra < 2.0 VAC.';

    if (
      lower.includes('hum') ||
      lower.includes('zumbido') ||
      lower.includes('ruído') ||
      lower.includes('terra') ||
      lower.includes('60hz') ||
      lower.includes('60 hz')
    ) {
      immediateAction =
        'Inserir imediatamente um Direct Box Passivo (transformador isolador 1:1) na linha com ruído e acionar a chave GROUND LIFT. Nunca remova o terra elétrico AC de segurança.';
      technicalDiagnosis =
        'Loop de terra (Ground Loop) por diferença de potencial entre o aterramento do palco e da House Mix, ou fonte chaveada de notebook/instrumento sem isolamento galvânico.';
      verificationMetric =
        'Medir tensão AC entre Neutro e Terra com multímetro (deve ser < 2.0 VAC) e confirmar queda do pico de 60 Hz / 120 Hz no RTA.';
    } else if (
      lower.includes('microfonia') ||
      lower.includes('feedback') ||
      lower.includes('apito')
    ) {
      immediateAction =
        'Reduzir -4 dB no Master do barramento afetado, desativar compressores nos envios de monitor de palco e aplicar corte estreito (Q = 10) na frequência apontada pelo RTA.';
      technicalDiagnosis =
        'Excesso de ganho acústico de malha fechada (Gain Before Feedback excedido) ou posicionamento incorreto do monitor em relação ao ângulo nulo do microfone (180° para Cardióide, 125° para Supercardióide).';
      verificationMetric =
        'Margem de estabilidade mínima de +6 dB antes do início de anelamento (ringing) com microfone aberto no palco.';
    } else if (
      lower.includes('protect') ||
      lower.includes('curto') ||
      lower.includes('queimou') ||
      lower.includes('amplificador') ||
      lower.includes('ohm')
    ) {
      immediateAction =
        'Desligar o amplificador, desconectar o cabo Speakon da saída traseira e religar o amplificador sem carga para distinguir entre falha na linha de caixas ou queima interna de saída.';
      technicalDiagnosis =
        'Se o amplificador desarma sem cabo conectado, há curto nos MOSFETs de saída ou presença de tensão DC no borne. Se arma normalmente sem o cabo, há curto no conector Speakon ou bobina de falante derretida.';
      verificationMetric =
        'Medir resistência DC (Re) no cabo Speakon desconectado: deve estar entre 2.7 Ω (carga 4Ω) e 6.2 Ω (carga 8Ω), nunca abaixo de 1.5 Ω.';
    } else if (
      lower.includes('dante') ||
      lower.includes('rede') ||
      lower.includes('clock') ||
      lower.includes('corte') ||
      lower.includes('cat6')
    ) {
      immediateAction =
        'Verificar no Dante Controller a aba Clock Status (confirmar apenas 1 Preferred Master ativo) e substituir o switch caso seja um modelo não-gerenciável com Green Ethernet (EEE).';
      technicalDiagnosis =
        'Perda de sincronismo PTPv1/v2 provocada por Energy Efficient Ethernet (IEEE 802.3az) ou saturação de tráfego Multicast sem IGMP Snooping configurado.';
      verificationMetric =
        'Latência de rede estável abaixo de 1.0 ms e gráfico de pacotes atrasados (Late Packets) zerado no Dante Controller.';
    } else if (
      lower.includes('grave') ||
      lower.includes('sub') ||
      lower.includes('fase') ||
      lower.includes('cancelamento') ||
      lower.includes('fraco')
    ) {
      immediateAction =
        'Mutar um dos lados (R) ou metade dos subwoofers por 5 segundos: se o grave aumentar ao desligar metade, há inversão de polaridade (180°) entre caixas ou cabos Speakon.';
      technicalDiagnosis =
        'Oposição de polaridade no pino 1+/1- de uma das caixas ou desalinhamento temporal no ponto de crossover acústico (80 Hz – 100 Hz) entre o PA principal e a via de Sub.';
      verificationMetric =
        'Teste de pulso com bateria 9V movendo todos os cones para fora simultaneamente e soma de +5 dB a +6 dB no crossover.';
    }

    const newEntry: SavedConsultation = {
      id: `c-${Date.now()}`,
      timestamp: 'Agora mesmo · Diagnóstico Gerado',
      environment: envType,
      equipment: equipType,
      symptom: symptomInput.trim(),
      measurement: measurementInput.trim() || 'Não informada pelo operador',
      immediateAction,
      technicalDiagnosis,
      verificationMetric,
    };

    setConsultations((prev) => [newEntry, ...prev]);
    setSymptomInput('');
    setMeasurementInput('');
  };

  return (
    <section className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <p className="text-xs font-mono text-amber-400 mb-1">
            Resolução de Crises de Palco e Manutenção Eletrônica Pro Audio
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight">
            Consultoria Rápida SOS Palco e Bancada de Conserto
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl w-fit">
          <button
            type="button"
            onClick={() => setActiveTab('sos-consult')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[40px] flex items-center gap-2 ${
              activeTab === 'sos-consult'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" />
            SOS Consultoria Rápida
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bench-repair')}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap min-h-[40px] flex items-center gap-2 ${
              activeTab === 'bench-repair'
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4 shrink-0" />
            Bancada de Conserto
          </button>
        </div>
      </div>

      {/* TAB 1: SOS RAPID CONSULTATION & STAGE DECISION TREES */}
      {activeTab === 'sos-consult' && (
        <div className="space-y-8">
          {/* Top Part: Interactive Rapid Consultation Engine */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column (5 Cols) */}
            <form
              onSubmit={handleGenerateConsultation}
              className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
            >
              <div className="border-b border-slate-800 pb-3">
                <div className="text-xs font-mono text-amber-400">
                  Atendimento Técnico Automatizado · Resposta Imediata
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mt-0.5">
                  Consultoria Rápida para Dúvidas Urgentes
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Descreva o sintoma que está ocorrendo no palco ou bancada para receber o protocolo de isolamento e solução
                </p>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1.5">
                  1. Ambiente da Ocorrência
                </label>
                <select
                  value={envType}
                  onChange={(e) => setEnvType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Show Ao Vivo (Emergência de Palco)">
                    Show Ao Vivo (Emergência de Palco)
                  </option>
                  <option value="Passagem de Som / Alinhamento de PA">
                    Passagem de Som / Alinhamento de PA
                  </option>
                  <option value="Sistema de Monitor / In-Ear (IEM)">
                    Sistema de Monitor / In-Ear (IEM)
                  </option>
                  <option value="Bancada de Manutenção / Eletrônica">
                    Bancada de Manutenção / Eletrônica
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1.5">
                  2. Equipamento ou Subsistema Principal
                </label>
                <select
                  value={equipType}
                  onChange={(e) => setEquipType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Amplificador / Caixas Acústicas">
                    Amplificador / Caixas Acústicas / Subwoofers
                  </option>
                  <option value="Console Digital / Stagebox / Rede Dante">
                    Console Digital / Stagebox / Rede Dante
                  </option>
                  <option value="Microfones / RF / Sistemas Sem Fio">
                    Microfones / RF / Sistemas Sem Fio
                  </option>
                  <option value="Rede Elétrica / Aterramento / Ruído">
                    Rede Elétrica / Aterramento / Ruído 60Hz
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1.5">
                  3. Descreva o Sintoma Urgente
                </label>
                <textarea
                  rows={3}
                  value={symptomInput}
                  onChange={(e) => setSymptomInput(e.target.value)}
                  placeholder="Ex: Amplificador de sub entrou em Protect no meio da música / Zumbido de 60Hz forte ao plugar o teclado..."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1.5">
                  4. Leitura de Multímetro / RTA (Opcional)
                </label>
                <input
                  type="text"
                  value={measurementInput}
                  onChange={(e) => setMeasurementInput(e.target.value)}
                  placeholder="Ex: Neutro-Terra = 6.5V / Cabo Speakon = 1.2 Ohms / Pico em 2.5 kHz"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Send className="w-4 h-4 shrink-0" />
                Gerar Parecer Técnico e Ação de Contenção
              </button>
            </form>

            {/* Right 7 Cols: Generated Diagnostic Reports */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-100">
                  Pareceres Técnicos de Consultoria Rápida
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {consultations.length} diagnóstico(s) registrado(s)
                </span>
              </div>

              <div className="space-y-4">
                {consultations.map((c) => (
                  <div
                    key={c.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
                  >
                    <div className="border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                        <span className="font-mono text-amber-400 font-semibold">
                          {c.timestamp}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{c.environment}</span>
                        <span aria-hidden="true">·</span>
                        <span>{c.equipment}</span>
                      </div>
                      <h4 className="text-base font-semibold text-slate-100">
                        Sintoma: “{c.symptom}”
                      </h4>
                      <div className="text-xs font-mono text-slate-400 mt-1">
                        Medição informada: {c.measurement}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-1">
                      <div className="text-xs font-mono text-amber-300 font-semibold">
                        ▲ AÇÃO DE CONTENÇÃO IMEDIATA (EM MENOS DE 60 SEGUNDOS):
                      </div>
                      <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                        {c.immediateAction}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="font-mono text-slate-400 font-semibold">
                          Causa Raiz Provável:
                        </div>
                        <p className="text-slate-300 leading-relaxed">{c.technicalDiagnosis}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                        <div className="font-mono text-emerald-400 font-semibold">
                          ● Padrão de Verificação:
                        </div>
                        <p className="text-slate-300 leading-relaxed">{c.verificationMetric}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Part: Pre-Built Live Stage Emergency Decision Trees */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-100">
                Protocolos Padronizados de Emergência no Palco (Passo a Passo)
              </h3>
              <p className="text-xs text-slate-400">
                Selecione uma ocorrência crítica abaixo para abrir a árvore de decisão técnica
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {EMERGENCY_PROTOCOLS.map((proto) => (
                <button
                  key={proto.id}
                  type="button"
                  onClick={() => setSelectedProtocol(proto)}
                  className={`text-left p-4 rounded-xl border transition-colors ${
                    selectedProtocol.id === proto.id
                      ? 'bg-slate-900 border-amber-500/70'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] font-mono text-amber-400 mb-1">
                    {proto.urgency}
                  </div>
                  <div className="text-sm font-semibold text-slate-100 leading-snug">
                    {proto.title}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Protocol Details */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="border-b border-slate-800 pb-4">
                <div className="text-xs font-mono text-amber-400 mb-1">
                  Prioridade: {selectedProtocol.urgency}
                </div>
                <h4 className="text-xl font-bold text-slate-50">{selectedProtocol.title}</h4>
                <p className="text-sm text-slate-300 mt-1">
                  <span className="font-semibold text-slate-100">Quadro Clínico: </span>
                  {selectedProtocol.symptom}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/25 border border-rose-500/40 space-y-1">
                <div className="text-xs font-mono text-rose-300 font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  MANOBRA DE SALVAMENTO IMEDIATO (BYPASS):
                </div>
                <p className="text-xs sm:text-sm text-slate-100 leading-relaxed">
                  {selectedProtocol.immediateBypass}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedProtocol.diagnosticSteps.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5"
                  >
                    <div className="text-xs font-mono text-amber-400 font-semibold">
                      Etapa 0{step.stepNumber} de Diagnóstico
                    </div>
                    <p className="text-sm font-semibold text-slate-100">{step.action}</p>
                    <div className="text-xs text-slate-300 font-mono">
                      Leitura esperada: {step.expectedMeasurement}
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
                      <div className="text-emerald-300">
                        <span className="font-mono font-semibold">● SE CONFIRMADO: </span>
                        {step.ifPass}
                      </div>
                      <div className="text-amber-300">
                        <span className="font-mono font-semibold">▲ SE PERSISTIR: </span>
                        {step.ifFail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ELECTRONICS WORKBENCH & EQUIPMENT REPAIR */}
      {activeTab === 'bench-repair' && (
        <div className="space-y-6">
          {/* Top Workbench Overview Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/3]">
              {!imgError ? (
                <img
                  src={ASSETS.repairBench}
                  alt="Bancada de conserto de equipamentos de áudio profissional com osciloscópio e multímetro"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs font-mono text-slate-400">
                  Bancada de Manutenção Eletrônica Pro Audio
                </div>
              )}
            </div>
            <div className="lg:col-span-7 space-y-3">
              <div className="text-xs font-mono text-amber-400">
                Engenharia de Manutenção e Reparo Eletrônico
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-50">
                Protocolos de Bancada, Pontos de Teste e Reconagem
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Guias técnicos com valores nominais de tensão DC, resistência ôhmica de bobinas, análise de ripple em fontes chaveadas (SMPS) e procedimentos seguros com Lâmpada Série para conserto de amplificadores, caixas e mesas digitais.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2 font-mono tabular-nums text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Offset DC Máximo</div>
                  <div className="text-amber-400 font-semibold text-sm">±25 mV DC</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Re Falante 8 Ω</div>
                  <div className="text-emerald-400 font-semibold text-sm">5.6 a 6.6 Ω</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Neutro-Terra AC</div>
                  <div className="text-sky-400 font-semibold text-sm">&lt; 2.0 VAC</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Repair Guides */}
          <div className="space-y-6">
            {BENCH_REPAIR_GUIDES.map((guide, idx) => (
              <div
                key={guide.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5"
              >
                <div className="border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="font-mono text-amber-400 font-semibold">
                      Protocolo de Bancada 0{idx + 1}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{guide.equipmentType}</span>
                    <span aria-hidden="true">·</span>
                    <span>Complexidade {guide.difficulty}</span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-100">{guide.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1">
                    <span className="font-semibold text-slate-100">Falha Típica: </span>
                    {guide.commonFault}
                  </p>
                </div>

                {/* Test Points Table */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-amber-400" />
                    Tabela de Aferição com Multímetro True-RMS / Osciloscópio:
                  </div>
                  <div className="w-full">
                    <table className="w-full text-left border-collapse text-xs font-mono tabular-nums">
                      <thead>
                        <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                          <th className="py-2.5 px-3">Ponto de Medição na Placa / Componente</th>
                          <th className="py-2.5 px-3">Leitura Nominal Esperada</th>
                          <th className="py-2.5 px-3">Indicação de Componente em Falha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {guide.testPoints.map((tp) => (
                          <tr key={tp.point} className="hover:bg-slate-800/30">
                            <td className="py-3 px-3 text-slate-200 font-sans font-medium">
                              {tp.point}
                            </td>
                            <td className="py-3 px-3 text-emerald-400">{tp.nominalValue}</td>
                            <td className="py-3 px-3 text-rose-400">{tp.faultIndication}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Step by Step Repair Procedure */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-slate-400">
                    Roteiro Técnico de Reparo e Validação:
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {guide.procedure.map((stepText, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3 text-xs sm:text-sm text-slate-200"
                      >
                        <span className="font-mono text-amber-400 font-semibold shrink-0">
                          0{sIdx + 1}.
                        </span>
                        <span className="leading-relaxed">{stepText}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* High Voltage / ESD Warning */}
                <div className="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Norma de Segurança de Bancada: </span>
                    {guide.safetyWarning}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
