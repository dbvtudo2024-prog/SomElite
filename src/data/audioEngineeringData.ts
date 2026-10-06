import heroFohImg from '../assets/images/hero_foh_console_1791262699876.jpg';
import lineArrayImg from '../assets/images/manual_line_array_rigging_1791262844560.jpg';
import repairBenchImg from '../assets/images/repair_circuit_bench_1791262858650.jpg';

export const ASSETS = {
  heroFoh: heroFohImg,
  lineArray: lineArrayImg,
  repairBench: repairBenchImg,
};

export interface ManualDocument {
  id: string;
  number: string;
  title: string;
  category: 'Sistemas & PA' | 'Consoles & Digital' | 'RF & Palco' | 'Elétrica & Acústica';
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  readTime: string;
  summary: string;
  keyFormula: string;
  sections: {
    heading: string;
    body: string;
    checklist?: string[];
  }[];
}

export interface ConnectorPinout {
  id: string;
  name: string;
  standard: string;
  application: string;
  pins: {
    pin: string;
    signal: string;
    wireColor: string;
    notes: string;
  }[];
  fieldTip: string;
}

export interface InstrumentEQProfile {
  instrument: string;
  category: 'Bateria & Percussão' | 'Cordas & Harmonia' | 'Voz & Metais';
  highPassHz: string;
  fundamentalHz: string;
  mudCutHz: string;
  presenceBoostHz: string;
  airHz: string;
  compressionRatio: string;
  attackRelease: string;
  notes: string;
}

export interface CableGaugeRow {
  awg: string;
  mm2: string;
  resistanceOhmPerKm: number;
  maxDist8OhmM: number;
  maxDist4OhmM: number;
  maxDist2OhmM: number;
  recommendedUse: string;
}

export interface CourseModule {
  id: string;
  code: string;
  title: string;
  level: 'Iniciante' | 'Intermediário' | 'Profissional';
  duration: string;
  instructor: string;
  description: string;
  lessons: {
    id: string;
    title: string;
    duration: string;
    conceptSummary: string;
    formulaOrRule: string;
    practicalExercise: string;
    keyTakeaways: string[];
  }[];
}

export interface AcousticQuizQuestion {
  id: string;
  level: 'Iniciante' | 'Intermediário' | 'Profissional';
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  formulaUsed: string;
}

export interface EmergencyTreeStep {
  stepNumber: number;
  action: string;
  expectedMeasurement: string;
  ifPass: string;
  ifFail: string;
}

export interface EmergencyProtocol {
  id: string;
  title: string;
  urgency: 'Crítica — Show Ao Vivo' | 'Alta — Passagem de Som' | 'Bancada — Manutenção';
  symptom: string;
  rootCauses: string[];
  immediateBypass: string;
  diagnosticSteps: EmergencyTreeStep[];
  toolsRequired: string[];
}

export interface BenchRepairGuide {
  id: string;
  equipmentType: string;
  title: string;
  difficulty: 'Média' | 'Alta (Bancada ESD)';
  commonFault: string;
  testPoints: {
    point: string;
    nominalValue: string;
    faultIndication: string;
  }[];
  procedure: string[];
  safetyWarning: string;
}

export interface ForumThread {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  category: 'Alinhamento & PA' | 'Consoles Digitais' | 'Conserto & Bancada' | 'RF & In-Ear' | 'Acústica Aplicada';
  createdAt: string;
  upvotes: number;
  solved: boolean;
  equipmentTags: string;
  content: string;
  replies: {
    id: string;
    author: string;
    authorRole: string;
    createdAt: string;
    content: string;
    isVerifiedSolution?: boolean;
  }[];
}

export const TECHNICAL_MANUALS: ManualDocument[] = [
  {
    id: 'man-01',
    number: '01',
    title: 'Alinhamento Temporal e de Fase entre Line Array e Subwoofers',
    category: 'Sistemas & PA',
    level: 'Avançado',
    readTime: '12 min de leitura',
    summary: 'Procedimento completo de medição com analisador de função de transferência (dual-channel FFT) para acoplamento coerente na região de crossover acústico (80 Hz – 100 Hz).',
    keyFormula: 'Δt (ms) = (Δφ / 360°) × (1000 / f_crossover)',
    sections: [
      {
        heading: 'Fundamento do Crossover Acústico vs. Elétrico',
        body: 'O ponto de crossover elétrico configurado no processador DSP (ex: Linkwitz-Riley 24 dB/oitava em 90 Hz) raramente coincide com o crossover acústico real na posição da House Mix sem ajuste prévio de ganho e delay. Só é possível alinhar fase de maneira eficiente quando ambos os sistemas (PA e Sub) entregam o mesmo nível de pressão sonora (SPL) na frequência de transição.'
      },
      {
        heading: 'Passo a Passo de Alinhamento com Microfone de Medição RTA',
        body: 'Posicione o microfone de medição no eixo de cobertura principal (aprox. 2/3 da profundidade da plateia) na altura dos ouvidos. Gere ruído rosa descorrelacionado e capture o traço de magnitude e fase do Sub isolado, seguido do PA isolado.',
        checklist: [
          'Desabilitar filtros de equalização cosmética antes de aferir a resposta nativa do sistema.',
          'Ajustar o ganho dos Subwoofers até que as curvas de magnitude se cruzem exatamente na frequência de crossover desejada.',
          'Inserir o delay de referência do analisador igual ao tempo de voo do elemento mais atrasado.',
          'Ajustar o delay eletrônico na via adiantada até que as inclinações de fase (slopes) fiquem paralelas e sobrepostas na oitava de transição.',
          'Ativar ambas as vias simultaneamente e verificar soma acústica de +5 dB a +6 dB no ponto de cruzamento.'
        ]
      }
    ]
  },
  {
    id: 'man-02',
    number: '02',
    title: 'Estrutura de Ganho (Gain Staging) e Calibração dBu vs. dBFS',
    category: 'Consoles & Digital',
    level: 'Iniciante',
    readTime: '8 min de leitura',
    summary: 'Como maximizar a relação sinal-ruído (SNR) e preservar headroom dinâmico desde a cápsula do microfone até os conversores A/D e amplificadores de potência.',
    keyFormula: '0 dBVU = +4 dBu (1.228 Vrms) ≈ -18 dBFS a -20 dBFS',
    sections: [
      {
        heading: 'Equivalência entre o Mundo Analógico e Digital',
        body: 'No domínio analógico profissional, o nível nominal de operação (+4 dBu) ainda oferece de 18 dB a 22 dB de headroom antes da saturação (clipping) dos amplificadores operacionais. Nos consoles digitais, 0 dBFS representa o limite absoluto de palavras binárias. Portanto, calibrar seus pré-amplificadores para que picos médios fiquem em -18 dBFS garante a mesma margem dinâmica de segurança.'
      },
      {
        heading: 'Protocolo Prático de Passagem de Som',
        body: 'A estrutura de ganho deve ser executada com os faders em posição nominal (0 dB / Unity Gain) e equalizadores planos, utilizando o barramento PFL/Solo calibrado.',
        checklist: [
          'Desligar Phantom Power (+48V) antes de conectar ou desconectar microfones condensadores e direct boxes ativos.',
          'Solicitar ao músico que toque na intensidade real do show (forte) e ajustar o HA Gain até que o medidor PFL oscile em torno de -18 dBFS.',
          'Aplicar o filtro passa-altas (HPF) logo após o pré-amplificador para remover energia infra-sônica desnecessária.',
          'Manter o barramento Master L/R operando com folga de no mínimo 6 dB abaixo do clip digital.'
        ]
      }
    ]
  },
  {
    id: 'man-03',
    number: '03',
    title: 'Arranjos Direcionais de Graves: Cardióide (CSA) e End-Fire',
    category: 'Sistemas & PA',
    level: 'Avançado',
    readTime: '15 min de leitura',
    summary: 'Geometria física, cálculo de espaçamento de quarto de onda e programação de DSP para cancelar sobras de graves no palco e focar energia na plateia.',
    keyFormula: 'd = c / (4 × f_central)   |   τ = d / c',
    sections: [
      {
        heading: 'Arranjo Cardióide Invertido (CSA)',
        body: 'Ideal quando não há profundidade disponível na frente do palco. Empilham-se ou alinham-se 2 ou 3 caixas onde uma delas aponta fisicamente para trás (em direção ao palco). Aplica-se na caixa traseira uma distância equivalente ao caminho acústico entre os centros dos falantes (tipicamente 0.65m a 0.85m), soma-se o delay correspondente (τ = d / c) e inverte-se a polaridade (180°). Na traseira, as ondas chegam no mesmo instante e com polaridades opostas, gerando cancelamento de até 15 dB.'
      },
      {
        heading: 'Arranjo End-Fire (Linha de Fogo Frontal)',
        body: 'Utiliza de 2 a 4 fileiras de subwoofers posicionadas uma atrás da outra, todas apontando para a plateia, espaçadas em 1/4 do comprimento de onda da frequência alvo (ex: 1.36m para 63 Hz). Cada fileira à frente recebe delay progressivo igual ao tempo de propagação desde a primeira caixa traseira.',
        checklist: [
          'Medir a distância física exata de grade a grade entre as fileiras com trena a laser.',
          'Medir a temperatura ambiente para corrigir a velocidade do som: c = 331.4 + (0.6 × T°C).',
          'Em End-Fire, NÃO se inverte a polaridade das caixas frontais; todas operam em polaridade normal com delays progressivos (0 ms, 1×τ, 2×τ, 3×τ).',
          'Em CSA (Cardióide com caixa virada), INVERTE-SE a polaridade da caixa voltada para o palco e aplica-se atenuação de -1.5 dB a -3 dB quando usando proporção 2:1.'
        ]
      }
    ]
  },
  {
    id: 'man-04',
    number: '04',
    title: 'Coordenação de RF, Antenas Direcionais e Sistemas In-Ear (IEM)',
    category: 'RF & Palco',
    level: 'Intermediário',
    readTime: '11 min de leitura',
    summary: 'Prevenção de produtos de intermodulação (IMD), posicionamento de antenas helicoidais/LPDA, atenuação de cabos coaxiais 50Ω e estrutura de ganho de RF.',
    keyFormula: 'IMD 3ª Ordem: 2·f1 - f2   e   f1 + f2 - f3',
    sections: [
      {
        heading: 'Isolamento entre Transmissores (IEM) e Receptores (Mics)',
        body: 'O maior erro em palcos de médio e grande porte é posicionar as antenas transmissoras de In-Ear coladas às antenas receptoras de microfones sem fio. Os transmissores de IEM emitem de 30 mW a 100 mW de potência contínua, saturando o front-end de RF dos receptores e elevando o piso de ruído.'
      },
      {
        heading: 'Regras de Ouro para Estabilidade de RF',
        body: 'Utilize sempre cabos coaxiais de 50 Ohms de baixa perda (RG-213, LMR-400) e evite cabos de vídeo de 75 Ohms. Nunca acione amplificadores de antena (boosters) em ganho máximo se o cabo for curto.',
        checklist: [
          'Manter distância mínima de 3 metros entre a antena transmissora (Combiner IEM) e as antenas receptoras (Distro de Microfones).',
          'Posicionar antenas acima da linha da cabeça dos músicos (2.2 m a 2.8 m) com visada direta sem obstáculos metálicos.',
          'Realizar varredura de espectro com os painéis de LED do palco LIGADOS (painéis de LED geram forte ruído de RF espúrio em UHF).',
          'Utilizar combinadores ativos para mais de 2 transmissores de In-Ear para evitar intermodulação nos estágios de saída.'
        ]
      }
    ]
  },
  {
    id: 'man-05',
    number: '05',
    title: 'Redes de Áudio sobre IP: Arquitetura Dante, AES67 e Switches Gerenciáveis',
    category: 'Consoles & Digital',
    level: 'Avançado',
    readTime: '14 min de leitura',
    summary: 'Configuração de switches Gigabit, desativação de Energy Efficient Ethernet (EEE), QoS DSCP, IGMP Snooping e topologia Redundante Primária/Secundária.',
    keyFormula: 'Largura de Banda Unicast (48kHz/24bit, 4ch) ≈ 6 Mbps por fluxo',
    sections: [
      {
        heading: 'Por que Switches Comuns com EEE Derrubam o Áudio',
        body: 'Switches domésticos ou corporativos com a função IEEE 802.3az (Green Ethernet / EEE) desligam os transceptores de cobre durante micro-intervalos de baixo tráfego. Isso destrói a sincronia do protocolo de clock PTP (Precision Time Protocol v1/v2), causando estalos digitais, perda de pacotes e mutes intermitentes.'
      },
      {
        heading: 'Checklist de Configuração de Switch para Dante',
        body: 'Ao configurar switches gerenciáveis (ex: Cisco SG350/CBS350, Netgear M4250, Luminex GigaCore) para eventos ao vivo:',
        checklist: [
          'Desativar obrigatoriamente EEE (Energy Efficient Ethernet / Green Mode) em todas as portas.',
          'Configurar QoS em modo DSCP Trust com 4 filas estritas (Prioridade Máxima CS7/EF para Clock PTP e CS6/AF41 para Áudio).',
          'Ativar IGMP Snooping v2 e definir um único IGMP Querier na VLAN quando houver fluxos Multicast.',
          'Nunca interligar uma porta da rede Primária em qualquer porta da rede Secundária (causa colapso imediato de broadcast).'
        ]
      }
    ]
  },
  {
    id: 'man-06',
    number: '06',
    title: 'Elétrica para Áudio Profissional: Aterramento, Equipotencialização e Fases',
    category: 'Elétrica & Acústica',
    level: 'Intermediário',
    readTime: '10 min de leitura',
    summary: 'Eliminação definitiva de loops de terra (hum de 60 Hz), medição de tensão Neutro-Terra e dimensionamento de Main Power trifásico para áudio.',
    keyFormula: 'I (A) = P (W) / (V × √3 × FP)   |   V_Neutro-Terra < 2.0 VAC',
    sections: [
      {
        heading: 'A Origem Física do Loop de Terra (Ground Loop)',
        body: 'O zumbido de 60 Hz (e seus harmônicos em 120 Hz e 180 Hz) surge quando dois equipamentos interligados por cabo de áudio têm seus pinos de terra elétrico conectados a pontos diferentes com diferença de potencial. Essa corrente parasita circula pela malha (pino 1) do cabo XLR.'
      },
      {
        heading: 'Procedimento de Inspeção Elétrica Antes de Ligar o Sistema',
        body: 'Nunca conecte o Main Power de áudio sem antes aferir as tensões com um multímetro True-RMS entre Fase-Neutro, Fase-Fase e Neutro-Terra.',
        checklist: [
          'Medir tensão Fase-Neutro sob carga: deve permanecer entre 115V–127V (ou 220V nominal) com variação máxima de 5%.',
          'Medir tensão entre Neutro e Terra: deve ser inferior a 2.0 VAC. Valores acima de 5 VAC indicam neutro flutuante ou mal aterrado (perigo de queima!).',
          'Alimentar o console da House Mix (FOH) a partir do MESMO quadro elétrico (Main Power) do palco para manter equipotencialidade do terra.',
          'Nunca cortar o pino de terra da tomada AC de amplificadores ou consoles; utilize transformadores isoladores de áudio (Direct Box passivo / Iso-Box) com chave Ground Lift no sinal de áudio.'
        ]
      }
    ]
  }
];

export const CONNECTOR_PINOUTS: ConnectorPinout[] = [
  {
    id: 'pin-xlr',
    name: 'XLR 3 Pinos Balanceado',
    standard: 'AES14-1992 / IEC 60268-12',
    application: 'Microfones, linhas balanceadas analógicas e áudio digital AES/EBU (110Ω)',
    pins: [
      { pin: 'Pino 1', signal: 'Malha / Shield (Terra do Chassis)', wireColor: 'Cobre trançado nu', notes: 'Conecta-se primeiro ao plugar para descarregar estática.' },
      { pin: 'Pino 2', signal: 'Positivo / Quente (+Hot / Em Fase)', wireColor: 'Vermelho ou Branco', notes: 'Pressão positiva no diafragma gera tensão positiva no Pino 2.' },
      { pin: 'Pino 3', signal: 'Negativo / Frio (-Cold / Polaridade 180°)', wireColor: 'Preto ou Azul', notes: 'Conduz o sinal espelhado para rejeição de modo comum (CMRR).' }
    ],
    fieldTip: 'Ao desbalancear um XLR para P10 TS, conecte Pino 2 na Ponta (Tip) e una Pino 1 + Pino 3 no Corpo (Sleeve), exceto em saídas acopladas por transformador flutuante.'
  },
  {
    id: 'pin-speakon-nl4',
    name: 'Speakon NL4 (4 Polos)',
    standard: 'Neutrik NL4FC / NL4MP',
    application: 'Conexão de potência entre amplificadores e caixas acústicas (Full-Range ou Bi-Amp)',
    pins: [
      { pin: '1+', signal: 'Via 1 Positivo (Full-Range ou Graves Low+)', wireColor: 'Vermelho (2.5mm² a 4mm²)', notes: 'Pino principal de potência.' },
      { pin: '1-', signal: 'Via 1 Negativo (Full-Range ou Graves Low-)', wireColor: 'Preto (2.5mm² a 4mm²)', notes: 'Retorno da Via 1.' },
      { pin: '2+', signal: 'Via 2 Positivo (Driver de Agudos High+ ou Sub Link)', wireColor: 'Amarelo ou Branco', notes: 'Usado em sistemas Bi-Amplificados.' },
      { pin: '2-', signal: 'Via 2 Negativo (Driver de Agudos High- ou Sub Link)', wireColor: 'Azul ou Verde', notes: 'Retorno da Via 2.' }
    ],
    fieldTip: 'Atenção redobrada: inverter 1+ com 2+ em sistemas bi-amplificados envia a potência de graves diretamente para o driver de titânio, queimando o reparo instantaneamente.'
  },
  {
    id: 'pin-trs',
    name: 'P10 TRS 1/4" Balanceado / Insert',
    standard: 'EIA RS-453 / IEC 60603-11',
    application: 'Saídas auxiliares balanceadas, fones de ouvido estéreo ou cabos de Insert Y',
    pins: [
      { pin: 'Tip (Ponta)', signal: 'Positivo (+Hot) / Canal Esquerdo (L) / Insert Send', wireColor: 'Vermelho', notes: 'Ponta extrema do conector.' },
      { pin: 'Ring (Anel)', signal: 'Negativo (-Cold) / Canal Direito (R) / Insert Return', wireColor: 'Branco ou Azul', notes: 'Anel intermediário isolado.' },
      { pin: 'Sleeve (Corpo)', signal: 'Malha / Terra Comum (Ground)', wireColor: 'Malha de cobre', notes: 'Corpo longo da base.' }
    ],
    fieldTip: 'Para transformar um cabo Insert em "Direct Out" de emergência em mesas analógicas, faça um jumper entre Tip e Ring no conector TRS.'
  },
  {
    id: 'pin-dante-rj45',
    name: 'RJ45 Ethernet Gigabit (Dante / AES67)',
    standard: 'TIA/EIA-568B (Cat5e / Cat6 Blindado F/UTP)',
    application: 'Redes de Áudio sobre IP (Dante, AES67, Waves SoundGrid, AVB)',
    pins: [
      { pin: 'Pinos 1 e 2', signal: 'Par 2: BI_DA+ e BI_DA-', wireColor: '1: Branco/Laranja · 2: Laranja', notes: 'Transmissão bidirecional Gigabit.' },
      { pin: 'Pinos 3 e 6', signal: 'Par 3: BI_DB+ e BI_DB-', wireColor: '3: Branco/Verde · 6: Verde', notes: 'Atenção ao salto dos pinos 4 e 5 no centro.' },
      { pin: 'Pinos 4 e 5', signal: 'Par 1: BI_DC+ e BI_DC-', wireColor: '4: Azul · 5: Branco/Azul', notes: 'Pinos centrais.' },
      { pin: 'Pinos 7 e 8', signal: 'Par 4: BI_DD+ e BI_DD-', wireColor: '7: Branco/Marrom · 8: Marrom', notes: 'Essencial para link de 1 Gbps (1000BASE-T).' }
    ],
    fieldTip: 'Em cabos Cat6 blindados (EtherCON), verifique se o terra da carcaça metálica não está fechando loop entre rack de palco e FOH quando usado para AES50/SuperMAC.'
  }
];

export const INSTRUMENT_EQ_TABLE: InstrumentEQProfile[] = [
  {
    instrument: 'Bumbo (Kick Drum)',
    category: 'Bateria & Percussão',
    highPassHz: '30 Hz (18 dB/oct)',
    fundamentalHz: '55 Hz – 68 Hz (Sub/Peso)',
    mudCutHz: '220 Hz – 350 Hz (-4 a -6 dB, Q médio)',
    presenceBoostHz: '2.5 kHz – 4.5 kHz (Ataque do batedor)',
    airHz: 'LPF em 10 kHz (limpar vazamento de pratos)',
    compressionRatio: '4:1 a 6:1',
    attackRelease: 'Ataque 25 ms · Release 80 ms',
    notes: 'Use ataque lento no compressor para deixar o transiente inicial da pele passar antes de comprimir o corpo.'
  },
  {
    instrument: 'Caixa (Snare Drum)',
    category: 'Bateria & Percussão',
    highPassHz: '80 Hz – 100 Hz',
    fundamentalHz: '160 Hz – 220 Hz (Corpo/Fatness)',
    mudCutHz: '400 Hz – 650 Hz (Som de lata/boxy)',
    presenceBoostHz: '3.2 kHz – 5 kHz (Crack/Definição)',
    airHz: '8 kHz – 10 kHz (Esteira)',
    compressionRatio: '3:1 a 4:1',
    attackRelease: 'Ataque 15–30 ms · Release 60 ms',
    notes: 'Sempre confira a polaridade (Ø) entre o microfone da pele batedeira (Top) e o da esteira (Bottom).'
  },
  {
    instrument: 'Contrabaixo Elétrico',
    category: 'Cordas & Harmonia',
    highPassHz: '38 Hz – 45 Hz',
    fundamentalHz: '70 Hz – 100 Hz (Sustentação)',
    mudCutHz: '180 Hz – 280 Hz (Embolamento com guitarras)',
    presenceBoostHz: '750 Hz – 1.2 kHz (Rosnado e articulação)',
    airHz: '2.5 kHz (Slap/Corda nova)',
    compressionRatio: '4:1 a 8:1',
    attackRelease: 'Ataque 20 ms · Release 120 ms',
    notes: 'Se o bumbo domina em 60 Hz, priorize o contrabaixo em 85–95 Hz para que ambos convivam sem mascaramento.'
  },
  {
    instrument: 'Violão de Aço (Acústico)',
    category: 'Cordas & Harmonia',
    highPassHz: '90 Hz – 120 Hz',
    fundamentalHz: '150 Hz – 200 Hz (Quentura)',
    mudCutHz: '280 Hz – 450 Hz (Ressonância do tampo)',
    presenceBoostHz: '2.8 kHz – 4 kHz (Dedilhado)',
    airHz: '10 kHz – 14 kHz (Brilho sedoso)',
    compressionRatio: '3:1',
    attackRelease: 'Ataque 15 ms · Release 100 ms',
    notes: 'Em palcos altos, use um filtro Notch cirúrgico (Q > 8) na frequência de ressonância da caixa do violão (geralmente entre 110 Hz e 185 Hz).'
  },
  {
    instrument: 'Guitarra Elétrica',
    category: 'Cordas & Harmonia',
    highPassHz: '95 Hz – 130 Hz',
    fundamentalHz: '200 Hz – 300 Hz (Corpo)',
    mudCutHz: '400 Hz – 550 Hz (Som encaixotado)',
    presenceBoostHz: '1.8 kHz – 3.5 kHz (Mordida)',
    airHz: 'LPF em 7 kHz – 8.5 kHz (Cortar chiado de drive)',
    compressionRatio: '2:1 (Opcional)',
    attackRelease: 'Ataque 30 ms · Release 100 ms',
    notes: 'Deixe uma cava sutil em 1.5 kHz – 2.5 kHz no grupo de guitarras para abrir espaço para a inteligibilidade da voz principal.'
  },
  {
    instrument: 'Voz Principal (Lead Vocal)',
    category: 'Voz & Metais',
    highPassHz: '100 Hz – 135 Hz',
    fundamentalHz: '180 Hz – 260 Hz (Plenitude)',
    mudCutHz: '320 Hz – 500 Hz (Voz anasalada/efeito proximidade)',
    presenceBoostHz: '2.5 kHz – 4.5 kHz (Inteligibilidade das consoantes)',
    airHz: '10 kHz – 12 kHz (Ar · usar De-Esser em 6.5 kHz)',
    compressionRatio: '3:1 a 5:1 (3 a 6 dB GR)',
    attackRelease: 'Ataque 10 ms · Release 50 ms',
    notes: 'Quando o cantor encosta os lábios na grade do microfone cardióide, o efeito de proximidade infla 150–250 Hz em até +8 dB; compense com EQ dinâmico.'
  }
];

export const CABLE_GAUGE_TABLE: CableGaugeRow[] = [
  { awg: '16 AWG', mm2: '1.5 mm²', resistanceOhmPerKm: 13.3, maxDist8OhmM: 14, maxDist4OhmM: 7, maxDist2OhmM: 3.5, recommendedUse: 'Monitores passivos leves ou linhas de agudos curtas' },
  { awg: '14 AWG', mm2: '2.5 mm²', resistanceOhmPerKm: 7.98, maxDist8OhmM: 24, maxDist4OhmM: 12, maxDist2OhmM: 6, recommendedUse: 'Padrão profissional para Line Arrays e Monitores de palco' },
  { awg: '12 AWG', mm2: '4.0 mm²', resistanceOhmPerKm: 4.95, maxDist8OhmM: 38, maxDist4OhmM: 19, maxDist2OhmM: 9.5, recommendedUse: 'Subwoofers de alta potência em 4 Ohms e cabos Speakon NL4/NL8' },
  { awg: '10 AWG', mm2: '6.0 mm²', resistanceOhmPerKm: 3.08, maxDist8OhmM: 60, maxDist4OhmM: 30, maxDist2OhmM: 15, recommendedUse: 'Subwoofers operando em 2 Ohms ou tiragens longas de rack ao PA' }
];

export const COURSES_DATA: CourseModule[] = [
  {
    id: 'course-01',
    code: 'TRILHA 01',
    title: 'Fundamentos da Sonoplastia, Física do Som e Fluxo de Sinal',
    level: 'Iniciante',
    duration: '4h 30m · 3 Módulos Práticos',
    instructor: 'Eng. Ricardo Vasconcelos (FOH / Smaart Certified)',
    description: 'Domine a base física indispensável: frequência, fase, decibéis, transdutores, conexões balanceadas e o caminho completo do sinal em mesas analógicas e digitais.',
    lessons: [
      {
        id: 'l-101',
        title: 'Acústica Física: Frequência, Comprimento de Onda e Fase',
        duration: '45 min',
        conceptSummary: 'O som é uma onda mecânica longitudinal de pressão. Compreender a relação inversamente proporcional entre frequência (Hz) e comprimento de onda (λ em metros) explica por que graves contornam obstáculos (difração) enquanto agudos são altamente direcionais.',
        formulaOrRule: 'λ (m) = c / f   onde   c ≈ 344 m/s (a 21°C)',
        practicalExercise: 'Calcule o comprimento de onda de 63 Hz (Subgrave) e de 4.000 Hz (Presença Vocal). Observe que 63 Hz mede 5,46 metros, enquanto 4 kHz mede apenas 8,6 centímetros.',
        keyTakeaways: [
          'Duas ondas idênticas em fase (0°) somam +6 dB de amplitude.',
          'Duas ondas de mesma amplitude defasadas em 180° cancelam-se completamente (-∞ dB).',
          'A cada aumento de 10°C na temperatura do ar, a velocidade do som aumenta em 6 m/s.'
        ]
      },
      {
        id: 'l-102',
        title: 'Microfones, Padrões Polares e Posicionamento Anti-Microfonia',
        duration: '50 min',
        conceptSummary: 'Microfones dinâmicos (bobina móvel) suportam altíssimo SPL e são ideais para fontes próximas; condensadores oferecem resposta a transientes superior. O ângulo de máxima rejeição do padrão polar determina onde o monitor de chão (spot) deve ficar.',
        formulaOrRule: 'Cardióide: Nulo em 180° · Supercardióide: Nulo em 125° e 235° · Hipercardióide: Nulo em 110°',
        practicalExercise: 'Ao usar um microfone Supercardióide (ex: Beta 58A ou Sennheiser e945), nunca coloque o monitor exatamente atrás (180°), pois há um lóbulo traseiro de captação! Posicione dois monitores em ângulo de 125°.',
        keyTakeaways: [
          'Regra 3:1 de microfonação: a distância entre duas cápsulas deve ser pelo menos 3 vezes a distância de cada cápsula até sua fonte sonora.',
          'O Efeito de Proximidade ocorre apenas em microfones direcionais (gradiente de pressão), não em omnidirecionais.'
        ]
      },
      {
        id: 'l-103',
        title: 'Fluxo de Sinal: Pré-Amplificador, Insert, Auxiliares Pré/Pós-Fader e Matriz',
        duration: '55 min',
        conceptSummary: 'Entender a ordem exata do processamento dentro do Channel Strip evita erros fatais durante o show. O envio Pré-Fader (para monitores de palco) independe do fader principal do PA, enquanto o envio Pós-Fader (para Reverbs e Delays) acompanha a mixagem.',
        formulaOrRule: 'Mic/Line → HA Gain → Ø Polaridade → HPF → Gate → EQ → Compressor → Fader → Bus L/R → Matrix',
        practicalExercise: 'Monte uma distribuição usando a Matrix do console para alimentar separadamente: PA L/R, Front-Fill, Out-Fill e Gravação Broadcast com delays independentes.',
        keyTakeaways: [
          'Alterar o HA Gain (pré-amplificador) durante o show afeta simultaneamente todas as vias de monitor dos músicos!',
          'Use o Trim Digital após a passagem de som caso precise corrigir o nível de entrada sem estragar a mix de palco.'
        ]
      }
    ]
  },
  {
    id: 'course-02',
    code: 'TRILHA 02',
    title: 'Mixagem Ao Vivo de Alta Performance: Equalização, Dinâmica e Espacialidade',
    level: 'Intermediário',
    duration: '6h 15m · 3 Módulos Práticos',
    instructor: 'Eng. Helena Moura (Touring Monitor & FOH Engineer)',
    description: 'Técnicas cirúrgicas de limpeza espectral, compressão paralela (New York), sidechain dinâmico entre bumbo e baixo, e construção de planos tridimensionais.',
    lessons: [
      {
        id: 'l-201',
        title: 'Equalização Subtrativa e Desmascaramento de Frequências',
        duration: '65 min',
        conceptSummary: 'Em ambientes reverberantes (igrejas, ginásios e casas de show), adicionar ganho no equalizador reduz o headroom e excita ressonâncias da sala. A mixagem limpa nasce retirando a "lama" (200 Hz – 450 Hz) dos instrumentos que não precisam dessa região.',
        formulaOrRule: 'Fator de Qualidade: Q = f_central / Largura de Banda (Δf em -3 dB)',
        practicalExercise: 'Aplique filtros passa-altas (HPF) em todos os canais exceto Bumbo, Baixo e Synths graves. Use Q estreito (Q > 6) para cortes cirúrgicos de ressonância e Q largo (Q < 1.5) para reforços musicais.',
        keyTakeaways: [
          'Nunca julgue o timbre de um canal em Solo por mais de 10 segundos; equaliza-se ouvindo a banda inteira.',
          'Se a voz não aparece, corte 2.5 kHz nas guitarras e teclados antes de aumentar o volume da voz.'
        ]
      },
      {
        id: 'l-202',
        title: 'Domínio de Compressores, Gates, Expansores e De-Essers',
        duration: '70 min',
        conceptSummary: 'O compressor controla a faixa dinâmica entre as notas mais fracas e os picos mais agressivos. O segredo da pegada ao vivo está no tempo de Ataque (Attack): ataques rápidos (< 5 ms) esmagam o transiente e recuam o instrumento no palco sonoro.',
        formulaOrRule: 'Redução de Ganho: GR = (Nível Entrada - Threshold) × (1 - 1/Ratio)',
        practicalExercise: 'Configure um barramento de Compressão Paralela (Crush Bus) para a bateria com Ratio 10:1, ataque rápido e release rápido, somando-o sutilmente abaixo do grupo de bateria limpa.',
        keyTakeaways: [
          'Em palcos barulhentos, substitua Gates abruptos nos tons e voz por Expansores (Ratio 1:2) para evitar cortes artificiais.',
          'Use Sidechain Filter no compressor do Master Bus em 90 Hz para que o bumbo não bombeie a mix inteira.'
        ]
      }
    ]
  },
  {
    id: 'course-03',
    code: 'TRILHA 03',
    title: 'Engenharia de Sistemas, Medição RTA/FFT e Predição de Grandes PAs',
    level: 'Profissional',
    duration: '8h 40m · 3 Módulos de Engenharia',
    instructor: 'Eng. Marcos Albuquerque (System Tech Arena & Festivais)',
    description: 'Física de Line Arrays (WST), zonas de Fresnel/Fraunhofer, leitura de Coerência e Impulso (IR) no Smaart, torres de delay e controle de ruído perimetral.',
    lessons: [
      {
        id: 'l-301',
        title: 'Teoria da Fonte de Linha (Line Array) e Ângulos Inter-Elementos (Splay)',
        duration: '80 min',
        conceptSummary: 'Enquanto uma caixa convencional (Point Source) perde 6 dB de pressão a cada dobra de distância (onda esférica), um Line Array acoplado atua como uma onda cilíndrica no campo próximo, perdendo apenas 3 dB por dobra de distância até o limite da Zona de Fresnel.',
        formulaOrRule: 'Distância de Transição (Bordas de Fresnel): d_t ≈ (L² × f) / (2 × c)   onde L = comprimento da linha (m)',
        practicalExercise: 'Observe como abrir os ângulos inferiores do Line Array (ex: 5°, 7°, 10°) reduz o acoplamento de alta frequência para o público próximo (evitando excesso de SPL na frente), enquanto fechar os ângulos superiores (0.5°, 1°) concentra energia para o fundo da arena.',
        keyTakeaways: [
          'O comprimento total da linha (altura física do cluster) dita até qual frequência grave o Line Array mantém controle direcional vertical.',
          'A absorção atmosférica do ar consome agudos severamente acima de 8 kHz após 40 metros; compense com filtros High-Shelf por zona do array.'
        ]
      },
      {
        id: 'l-302',
        title: 'Leitura de Fase, Coerência (γ²) e Resposta ao Impulso (IR)',
        duration: '85 min',
        conceptSummary: 'A curva de Coerência no analisador FFT indica o percentual de linearidade causal entre o sinal de referência da mesa e o sinal captado pelo microfone. Quedas bruscas de coerência revelam reflexões severas de paredes, cancelamento de fase (comb filtering) ou ruído ambiente.',
        formulaOrRule: 'Inclinação da Fase: τ_grupo = - (1 / 360°) × (dφ / df)',
        practicalExercise: 'Nunca tente corrigir um vale profundo de magnitude (+12 dB de EQ) se a curva de Coerência naquele ponto estiver abaixo de 50%: trata-se de um cancelamento acústico espacial (comb filter) que não aceita equalização.',
        keyTakeaways: [
          'Fase subindo da esquerda para a direita indica que o sistema medido está ADIANTADO em relação ao delay de referência.',
          'Fase descendo da esquerda para a direita indica que o sistema medido está ATRASADO.'
        ]
      }
    ]
  },
  {
    id: 'course-04',
    code: 'TRILHA 04',
    title: 'Eletrônica de Áudio, Diagnóstico de Bancada e Conserto de Equipamentos',
    level: 'Profissional',
    duration: '5h 50m · 2 Módulos de Bancada',
    instructor: 'Eng. Cláudio Fontes (Especialista em Amplificadores Classe D e Consoles)',
    description: 'Diagnóstico com multímetro True-RMS e osciloscópio, reparo de fontes chaveadas SMPS, troca de MOSFETs de saída, reconagem de falantes e manutenção de consoles.',
    lessons: [
      {
        id: 'l-401',
        title: 'Diagnóstico de Amplificadores de Potência Classe AB e Classe D',
        duration: '75 min',
        conceptSummary: 'Amplificadores modernos utilizam modulação por largura de pulso (PWM) em alta frequência (250 kHz a 400 kHz) com estágios de saída MOSFET. Um curto-circuito nos transistores de saída aciona a proteção DC para evitar que a tensão da fonte queime as bobinas dos alto-falantes.',
        formulaOrRule: 'Potência RMS: P = V_rms² / R_carga   |   V_pico = V_rms × √2',
        practicalExercise: 'Utilize uma Lâmpada Série (ou Variac com limitador de corrente) na bancada ao energizar qualquer amplificador recém-reparado antes de conectá-lo diretamente à rede AC.',
        keyTakeaways: [
          'Sempre substitua os resistores de Gate (tipicamente 4.7Ω a 22Ω) e o driver PWM (ex: IR2110 / IRS2092) quando encontrar MOSFETs em curto.',
          'Meça o Offset DC nos bornes de saída sem sinal: deve ser estritamente inferior a ±35 mV DC.'
        ]
      },
      {
        id: 'l-402',
        title: 'Teste de Transdutores, Drivers de Compressão e Crossovers Passivos',
        duration: '60 min',
        conceptSummary: 'Diferenciar entre bobina aberta, bobina raspando no gap magnético por superaquecimento e falha em capacitores de poliéster/indutores do divisor passivo.',
        formulaOrRule: 'Resistência DC (Re) ≈ 0.70 a 0.82 × Impedância Nominal (Z)',
        practicalExercise: 'Meça com multímetro na escala de Ohms um alto-falante nominal de 8Ω: a leitura correta (Re) deve ficar entre 5.4Ω e 6.6Ω. Leituras de 1.5Ω indicam espiras em curto; OL indica bobina rompida.',
        keyTakeaways: [
          'Ao trocar o reparo de um driver de titânio, limpe o gap magnético com fita adesiva dobrada para remover limalhas metálicas.',
          'Aplique um sinal senoidal de 1 kHz em baixo volume (1 Vrms) após montar o reparo para verificar ausência de distorção por descentragem.'
        ]
      }
    ]
  }
];

export const ACOUSTIC_QUIZ_QUESTIONS: AcousticQuizQuestion[] = [
  {
    id: 'q-01',
    level: 'Iniciante',
    topic: 'Física do Som & Comprimento de Onda',
    question: 'Em um evento ao ar livre com temperatura ambiente de 21°C (velocidade do som c ≈ 344 m/s), qual é o comprimento de onda (λ) exato da frequência subgrave de 86 Hz?',
    options: [
      '2,00 metros',
      '4,00 metros',
      '6,88 metros',
      '1,25 metros'
    ],
    correctIndex: 1,
    explanation: 'Pela equação fundamental da acústica λ = c / f, dividimos 344 m/s por 86 Hz, resultando em exatamente 4,00 metros.',
    formulaUsed: 'λ = 344 / 86 = 4,00 m'
  },
  {
    id: 'q-02',
    level: 'Iniciante',
    topic: 'Estrutura de Ganho & Decibéis',
    question: 'Se duas caixas acústicas idênticas, perfeitamente alinhadas em fase e tempo, reproduzem o mesmo sinal correlacionado com 100 dB SPL cada na posição da House Mix, qual será o SPL resultante com ambas ligadas?',
    options: [
      '103 dB SPL',
      '106 dB SPL',
      '110 dB SPL',
      '200 dB SPL'
    ],
    correctIndex: 1,
    explanation: 'Fontes sonoras coerentes (mesmo sinal e mesma fase, como dois subwoofers acoplados) somam pressão sonora de forma construtiva: ΔL = 20 × log10(2) = +6 dB, totalizando 106 dB SPL.',
    formulaUsed: 'L_total = 100 + 20·log10(2) = 106 dB SPL'
  },
  {
    id: 'q-03',
    level: 'Iniciante',
    topic: 'Conectores & Cabeamento',
    question: 'Segundo a norma internacional AES14 para conectores XLR de 3 pinos balanceados, qual é a função correta de cada pino?',
    options: [
      'Pino 1: Positivo (+), Pino 2: Terra (Malha), Pino 3: Negativo (-)',
      'Pino 1: Terra (Malha), Pino 2: Positivo (+Hot), Pino 3: Negativo (-Cold)',
      'Pino 1: Terra (Malha), Pino 2: Negativo (-Cold), Pino 3: Positivo (+Hot)',
      'Pino 1: Canal Esquerdo, Pino 2: Canal Direito, Pino 3: Malha'
    ],
    correctIndex: 1,
    explanation: 'O padrão mundial AES14 define "Pin 1 Shield, Pin 2 Hot (+), Pin 3 Cold (-)".',
    formulaUsed: 'AES14-1992 Standard: 1=Shield, 2=Hot(+), 3=Cold(-)'
  },
  {
    id: 'q-04',
    level: 'Intermediário',
    topic: 'Torres de Delay & Alinhamento Temporal',
    question: 'Uma torre de delay está posicionada a 34,4 metros de distância do PA Principal em um dia a 21°C (c = 344 m/s). Para alinhar acusticamente a torre com o PA e ainda aplicar +12 ms de Precedência (Efeito Haas) para manter a imagem sonora no palco, qual delay deve ser inserido no processador da torre?',
    options: [
      '88 ms',
      '100 ms',
      '112 ms',
      '68,8 ms'
    ],
    correctIndex: 2,
    explanation: 'O tempo de voo acústico de 34,4 metros é t = 34,4 / 344 = 0,100 s = 100 ms. Somando os +12 ms do Efeito Haas para que o som do PA principal chegue ligeiramente antes e preserve a localização visual no palco, aplicamos 112 ms.',
    formulaUsed: 't_total = (d / c) × 1000 + t_Haas = 100 ms + 12 ms = 112 ms'
  },
  {
    id: 'q-05',
    level: 'Intermediário',
    topic: 'Associação de Impedâncias',
    question: 'Você possui 4 subwoofers passivos de 8 Ohms cada conectados em paralelo no mesmo canal de um amplificador. Qual é a impedância final enxergada pelo amplificador?',
    options: [
      '4 Ohms',
      '2 Ohms',
      '16 Ohms',
      '32 Ohms'
    ],
    correctIndex: 1,
    explanation: 'Na associação em paralelo de N cargas iguais, a impedância resultante é Z_total = Z_individual / N = 8 Ω / 4 = 2 Ohms.',
    formulaUsed: 'Z_eq = 8 Ω / 4 caixas = 2 Ω'
  },
  {
    id: 'q-06',
    level: 'Intermediário',
    topic: 'Microfonação de Palco & Monitores',
    question: 'Um cantor utiliza um microfone dinâmico de padrão polar Supercardióide. Onde o técnico de monitor deve posicionar o(s) monitor(es) de chão (spots) para obter o máximo ganho antes do feedback (microfonia)?',
    options: [
      'Exatamente a 180° atrás do eixo do microfone',
      'A 90° nas laterais do microfone',
      'Em ângulo de 125° a 130° em relação à frente da cápsula',
      'Diretamente abaixo do pedestal a 0°'
    ],
    correctIndex: 2,
    explanation: 'Diferente do cardióide (que tem nulo em 180°), o supercardióide possui um lóbulo de sensibilidade traseiro em 180° e seus nulos de máxima rejeição ficam em 125° (e 235°).',
    formulaUsed: 'Cos(θ) Supercardioid Null = 125.3°'
  },
  {
    id: 'q-07',
    level: 'Profissional',
    topic: 'Cancelamento de Fase & Comb Filtering',
    question: 'Dois microfones captam a mesma fonte sonora com uma diferença de tempo de chegada (Δt) de 1,0 milissegundo em amplitudes iguais. Qual é a PRIMEIRA frequência onde ocorrerá um cancelamento total de fase (180°)?',
    options: [
      '1.000 Hz',
      '500 Hz',
      '250 Hz',
      '2.000 Hz'
    ],
    correctIndex: 1,
    explanation: 'O primeiro nulo de um filtro pente (comb filter) ocorre na frequência onde o atraso Δt corresponde exatamente a meio período (180°): f_nulo1 = 1 / (2 × Δt) = 1 / (2 × 0,001 s) = 500 Hz. Os próximos nulos ocorrerão nos múltiplos ímpares (1.500 Hz, 2.500 Hz...).',
    formulaUsed: 'f_null(1) = 1 / (2 × 0.001 s) = 500 Hz'
  },
  {
    id: 'q-08',
    level: 'Profissional',
    topic: 'Arranjo de Subwoofers End-Fire',
    question: 'Em um arranjo End-Fire sintonizado para máxima rejeição traseira em 68,8 Hz (com c = 344 m/s), qual deve ser o espaçamento físico de centro a centro (1/4 de comprimento de onda) e o delay aplicado na caixa frontal?',
    options: [
      'Espaçamento de 2,50 m e delay de 7,26 ms',
      'Espaçamento de 1,25 m e delay de 3,63 ms',
      'Espaçamento de 1,25 m e delay de 7,26 ms com polaridade invertida',
      'Espaçamento de 5,00 m e delay de 14,5 ms'
    ],
    correctIndex: 1,
    explanation: 'Em 68,8 Hz, o comprimento de onda é λ = 344 / 68,8 = 5,00 m. Um quarto de onda (λ/4) é 5,00 / 4 = 1,25 m. O tempo que o som leva para percorrer 1,25 m é τ = 1,25 / 344 = 0,00363 s = 3,63 ms, sem inversão de polaridade.',
    formulaUsed: 'd = λ/4 = 1,25 m   |   τ = 1,25 / 344 = 3,63 ms'
  },
  {
    id: 'q-09',
    level: 'Profissional',
    topic: 'Conserto & Diagnóstico de Bancada',
    question: 'Na bancada, você mede com multímetro a resistência DC (Re) nos pinos 1+ e 1- de uma caixa com dois alto-falantes de 8 Ohms ligados em paralelo internamente. Qual leitura DC você espera encontrar se ambos os alto-falantes estiverem perfeitos?',
    options: [
      'Exatamente 4,0 Ohms',
      'Entre 2,7 Ohms e 3,3 Ohms',
      'Entre 5,6 Ohms e 6,5 Ohms',
      'Acima de 12 Ohms'
    ],
    correctIndex: 1,
    explanation: 'A impedância nominal AC da caixa é 4 Ohms (dois de 8Ω em paralelo). Como a resistência DC (Re) da bobina estacionária é cerca de 70% a 80% da impedância nominal, espera-se ler entre 2,7 Ω e 3,3 Ω. Se ler 5,8 Ω, um dos falantes internos está com a bobina aberta!',
    formulaUsed: 'Re_paralelo ≈ 0,75 × 4 Ω = 3,0 Ω'
  },
  {
    id: 'q-10',
    level: 'Profissional',
    topic: 'Redes Dante & Sincronismo PTP',
    question: 'Durante um festival, o sistema Dante apresenta cortes intermitentes de áudio de 1 segundo a cada poucos minutos e o Dante Controller acusa perda momentânea de "Clock Lock". Qual é a causa técnica mais provável no switch Gigabit?',
    options: [
      'Cabo Cat6 com comprimento de 45 metros',
      'Função EEE (Energy Efficient Ethernet / IEEE 802.3az) habilitada nas portas do switch',
      'Taxa de amostragem configurada em 48 kHz em vez de 96 kHz',
      'Uso de endereçamento IP por DHCP automático'
    ],
    correctIndex: 1,
    explanation: 'O recurso Energy Efficient Ethernet (EEE / Green Ethernet) coloca as portas do switch em estado de baixo consumo por microssegundos, atrasando os pacotes PTP de sincronismo de clock e derrubando o áudio.',
    formulaUsed: 'IEEE 802.3az EEE = Incompatível com PTPv1/PTPv2 Sync'
  }
];

export const EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
  {
    id: 'sos-feedback',
    title: 'Microfonia Severa (Feedback) no PA ou Monitores Durante o Show',
    urgency: 'Crítica — Show Ao Vivo',
    symptom: 'Apito agudo (2.5 kHz – 8 kHz) ou ressonância grave contínua (120 Hz – 350 Hz) crescendo rapidamente no sistema.',
    rootCauses: [
      'Ganho de pré-amplificador (HA) excessivo ou compressor com Make-up Gain exagerado no microfone vocal.',
      'Cantor desceu do palco para a frente do Line Array ou apontou a cápsula para o monitor de chão.',
      'Acúmulo de múltiplos microfones abertos simultaneamente (cada dobra de microfones abertos reduz a margem de feedback em 3 dB).'
    ],
    immediateBypass: 'Recuar imediatamente -3 dB a -6 dB no Master do Bus de Monitor/PA ou no DCA de Vozes, ativar o RTA sobreposto ao GEQ/PEQ e cortar a frequência de pico com filtro estreito (Q = 8 a 12).',
    diagnosticSteps: [
      {
        stepNumber: 1,
        action: 'Observar o medidor de nível dos canais de voz para identificar qual cápsula está disparando o loop acústico.',
        expectedMeasurement: 'Um canal específico apresentará barra de sinal travada mesmo sem ninguém cantando nele.',
        ifPass: 'Aplique corte de -4 dB na frequência exata no PEQ do canal ou no GEQ da via de monitor correspondente.',
        ifFail: 'Se vários canais sobem juntos, a realimentação é global (acústica de sala no PA); atue no EQ da Matrix L/R.'
      },
      {
        stepNumber: 2,
        action: 'Desativar temporariamente o Compressor do canal de voz no envio de monitor (ou passar o envio Aux para Pré-Compressor).',
        expectedMeasurement: 'Aumento imediato de 4 dB a 6 dB de margem antes da microfonia.',
        ifPass: 'Mantenha os monitores de palco recebendo sinal Pré-EQ/Pré-Comp ou apenas Pós-EQ sem compressão.',
        ifFail: 'Verifique se a cápsula do microfone não sofreu queda física (espuma interna deslocada altera o padrão polar para omnidirecional).'
      }
    ],
    toolsRequired: ['Analisador RTA do Console', 'Fone de Ouvido de Referência (PFL)', 'Filtro Paramétrico Q > 8']
  },
  {
    id: 'sos-hum',
    title: 'Ruído de Terra (Hum 60 Hz / Buzz 120 Hz) Intenso no Sistema',
    urgency: 'Crítica — Show Ao Vivo',
    symptom: 'Zumbido grave constante acompanhado de chiado harmônico assim que um notebook, teclado, amplificador de guitarra ou painel de LED é conectado.',
    rootCauses: [
      'Loop de terra (Ground Loop) entre o aterramento elétrico do palco e um equipamento ligado em outra tomada/fase.',
      'Fonte chaveada de notebook sem isolamento galvânico ligada em entrada desbalanceada.',
      'Cabo de instrumento com malha rompida ou falta de Direct Box passivo com transformador isolador.'
    ],
    immediateBypass: 'Inserir um Direct Box Passivo (com transformador 1:1) na linha problemática e acionar a chave GROUND LIFT (desconectando o pino 1 apenas no áudio, mantendo a segurança elétrica AC).',
    diagnosticSteps: [
      {
        stepNumber: 1,
        action: 'Mutar os grupos de canais por partes (Teclados/VS, Guitarras, Bateria, Ambientes) ou checar o PFL de cada entrada.',
        expectedMeasurement: 'Identificar exatamente qual canal ou rack externo introduz o pico em 60 Hz / 120 Hz / 180 Hz no RTA.',
        ifPass: 'No canal identificado, acione o Ground Lift do Direct Box. Se for notebook de VS/Playback, desconecte a fonte AC por 5 segundos para testar se o ruído some na bateria.',
        ifFail: 'Se o ruído persiste com todos os canais da mesa mutados, o loop está entre o rack da House Mix e o rack de amplificadores.'
      },
      {
        stepNumber: 2,
        action: 'Se o ruído vem da interligação Console FOH → Processador do PA via XLR analógico, insira um Isolador de Linha 1:1 (Iso-Box) ou desconecte a malha (Pino 1) apenas no lado da entrada do processador.',
        expectedMeasurement: 'Silêncio imediato (-90 dBu de piso de ruído).',
        ifPass: 'Operação estabilizada com segurança.',
        ifFail: 'Meça com multímetro a tensão entre Neutro e Terra no Main Power; se houver tensão alta, revise o barramento de neutro.'
      }
    ],
    toolsRequired: ['Direct Box Passivo / Iso-Box 1:1', 'Multímetro True-RMS', 'Cabo XLR com Pino 1 levantado no destino (Telescopic Shield)']
  },
  {
    id: 'sos-sub-cancel',
    title: 'Subwoofers Sem Pressão Sonora na Plateia (Falta de Graves)',
    urgency: 'Alta — Passagem de Som',
    symptom: 'Os amplificadores dos subwoofers estão modulando forte (LEDs próximos de -3 dB / Clip), os cones estão excursionando muito, mas na frente do palco o grave parece oco e sem impacto.',
    rootCauses: [
      'Inversão acidental de polaridade (Pino 1+ trocado com 1- em um cabo Speakon ou botão Ø acionado em um canal do DSP).',
      'Subwoofers internos de uma mesma caixa dupla (2x18") ligados com polaridades invertidas entre si após manutenção.',
      'Cancelamento de fase destrutivo entre o PA Principal (Full-Range) e a via de Subwoofers na região de 60 Hz – 100 Hz.'
    ],
    immediateBypass: 'Mutar o lado Direito (R) dos subwoofers e ouvir apenas o lado Esquerdo (L) — ou deixar apenas 1 caixa ligada. Se o grave AUMENTAR ao desligar metade do sistema, há inversão de polaridade!',
    diagnosticSteps: [
      {
        stepNumber: 1,
        action: 'Deixar os subwoofers tocando um loop com bastante bumbo/baixo e mutar metade das caixas (ou um canal do amplificador por vez).',
        expectedMeasurement: 'Com o sistema correto, desligar metade reduz o grave em -6 dB. Se desligar metade faz o grave aparecer com força, um lado está em 180°.',
        ifPass: 'Inverta a polaridade no DSP da via invertida e inspecione o cabo Speakon NL4.',
        ifFail: 'Se os subs somam bem sozinhos mas perdem peso ao abrir o PA L/R, o problema é alinhamento temporal entre PA e Sub.'
      },
      {
        stepNumber: 2,
        action: 'Testar com bateria 9V ou testador de polaridade de pulso cada caixa individualmente na frente da tela.',
        expectedMeasurement: 'Ao tocar o polo positivo (+) da bateria 9V no pino 1+ do Speakon, TODOS os cones devem se mover para a FRENTE (para fora da caixa).',
        ifPass: 'Todas as caixas estão fisicamente coerentes.',
        ifFail: 'Abra a tampa do conector Speakon da caixa que recolheu o cone para trás e corrija os fios nos terminais Faston.'
      }
    ],
    toolsRequired: ['Testador de Fase / Bateria 9V', 'Chave Philips / Torx para conector Speakon', 'Acesso ao DSP do Sistema']
  },
  {
    id: 'sos-amp-protect',
    title: 'Amplificador de Potência Entrando em Proteção (PROTECT / FAULT / CLIP)',
    urgency: 'Crítica — Show Ao Vivo',
    symptom: 'Uma via do PA ou de Subwoofers para de tocar de repente e o painel frontal do amplificador acende o LED vermelho PROTECT, TEMP ou IMPEDANCE FAULT.',
    rootCauses: [
      'Curto-circuito no cabo Speakon (fios 1+ e 1- encostando dentro do conector ou cabo esmagado no piso).',
      'Bobina de um dos alto-falantes entrou em curto térmico, derrubando a impedância da linha abaixo de 1.5 Ohms.',
      'Obstrução dos filtros de poeira das ventoinhas ou queda severa de tensão AC (< 95V em rede 127V).'
    ],
    immediateBypass: 'Desligar o amplificador, desconectar IMEDIATAMENTE o cabo Speakon traseiro da saída em falha e religar o amplificador sem carga.',
    diagnosticSteps: [
      {
        stepNumber: 1,
        action: 'Religar o amplificador com o cabo Speakon desconectado da traseira.',
        expectedMeasurement: 'Se o amplificador armar o relé normalmente e apagar o LED Protect sem o cabo, o defeito está na linha externa (cabo ou caixa).',
        ifPass: 'Meça com multímetro na escala de Ohms entre os pinos 1+ e 1- do cabo Speakon que vai para as caixas.',
        ifFail: 'Se o amplificador continua em PROTECT mesmo sem nenhum cabo conectado na saída, houve queima de transistores de saída (tensão DC na saída). Substitua pela via reserva.'
      },
      {
        stepNumber: 2,
        action: 'Medir a resistência DC no cabo Speakon desconectado do amplificador.',
        expectedMeasurement: 'Deve medir entre 2.6 Ω (duas caixas de 4Ω ou quatro de 8Ω) e 6.5 Ω (uma caixa de 8Ω). Se medir abaixo de 1.2 Ω, há curto!',
        ifPass: 'Verifique a tensão AC da tomada sob carga e limpe a grade frontal de ventilação.',
        ifFail: 'Desconecte o cabo link entre a primeira e a segunda caixa para isolar qual alto-falante entrou em curto.'
      }
    ],
    toolsRequired: ['Multímetro Digital', 'Chave de Fenda / Alicate de Corte', 'Cabo Speakon Reserva']
  }
];

export const BENCH_REPAIR_GUIDES: BenchRepairGuide[] = [
  {
    id: 'bench-01',
    equipmentType: 'Amplificadores de Potência (Classe D / Classe AB)',
    title: 'Diagnóstico e Reparo de Estágio de Saída em Curto e Fonte SMPS',
    difficulty: 'Alta (Bancada ESD)',
    commonFault: 'Fusível de entrada aberto, relé de saída não atraca (LED Protect aceso) devido a MOSFETs/IGBTs em curto entre Dreno e Source.',
    testPoints: [
      { point: 'Barramento Simétrico HV (+V e -V)', nominalValue: '±65 VDC a ±135 VDC (conforme modelo)', faultIndication: '0 V ou assimetria entre trilhos positivo e negativo' },
      { point: 'Junção Gate-Source dos MOSFETs de Saída', nominalValue: '0.45V a 0.55V no teste de diodo (Dreno-Source)', faultIndication: '0.00V (curto direto) em todos os terminais' },
      { point: 'Tensão de Offset DC nos Bornes de Saída', nominalValue: '< ±25 mV DC sem sinal', faultIndication: '> 1.5 V DC (aciona proteção DC do relé)' },
      { point: 'Alimentação Auxiliar Vcc do Driver PWM (IRS2092 / IR2110)', nominalValue: '+12 VDC a +15 VDC estáveis', faultIndication: 'Tensão pulsando (hiccup) ou resistor de bootstrap aberto' }
    ],
    procedure: [
      'Descarregue completamente os capacitores eletrolíticos principais da fonte utilizando um resistor de fio de 470Ω / 10W antes de tocar na placa.',
      'Com o multímetro em escala de Diodo, meça entre Dreno, Source e Gate de cada par de saída. Remova todos os transistores em curto.',
      'Inspecione e meça TODOS os resistores de Gate (ex: 4.7Ω a 22Ω SMD) e diodos rápidos em paralelo; quando o MOSFET entra em curto, a alta tensão retorna pelo Gate e queima o CI Driver PWM.',
      'Substitua o CI Driver PWM e os MOSFETs por componentes originais do mesmo lote (baixa capacitância Gate-Source Qg).',
      'Energize OBRIGATORIAMENTE através de uma Lâmpada Série Incandescente/Halógena de 150W: ela deve dar um pulso rápido ao carregar os capacitores e apagar. Injete 1 kHz e confira a senóide limpa no osciloscópio.'
    ],
    safetyWarning: 'Risco de choque letal: Fontes chaveadas de amplificadores armazenam até 380 VDC no barramento primário. Nunca trabalhe sem lâmpada série e transformador isolador.'
  },
  {
    id: 'bench-02',
    equipmentType: 'Caixas Acústicas, Drivers de Titânio e Subwoofers',
    title: 'Substituição de Reparo de Driver de Compressão e Inspeção de Crossover',
    difficulty: 'Média',
    commonFault: 'Caixa acústica sem agudos, som rachando em volumes baixos ou distorção metálica por bobina raspando no entreferro (gap).',
    testPoints: [
      { point: 'Terminais do Reparo do Driver (8 Ohms nominal)', nominalValue: '5.6 Ω a 6.8 Ω DC', faultIndication: 'OL (Infinito / Bobina rompida) ou < 2.5 Ω (espiras derretidas)' },
      { point: 'Capacitores de Poliéster/Polipropileno do Crossover Passivo', nominalValue: 'Capacitância nominal ±5% e ESR < 0.2 Ω', faultIndication: 'Capacitor estufado ou aberto cortando a passagem de agudos' },
      { point: 'Protetor Térmico / Lâmpada PTC do Divisor', nominalValue: '< 0.4 Ω a frio', faultIndication: 'Aberto ou escurecido por excesso de potência/microfonia' }
    ],
    procedure: [
      'Remova os parafusos da tampa traseira do driver mantendo os ímãs de neodímio/ferrite longe de chaves metálicas soltas.',
      'Retire o reparo queimado e inspecione o interior do gap magnético. Passe uma tira de fita crepe dobrada com a cola para fora dentro de toda a fenda circular para remover limalhas e resíduos de verniz carbonizado.',
      'Verifique a polaridade nos bornes de pressão (vermelho = positivo) e encaixe o reparo novo nos pinos-guia sem tocar na cúpula de titânio com os dedos.',
      'Antes de apertar totalmente os parafusos em cruz, aplique um tom senoidal puro de 1.200 Hz a 1.5 Vrms e aperte gradualmente garantindo som cristalino sem vibração parasita.'
    ],
    safetyWarning: 'Ímãs de neodímio de drivers de grande formato possuem força magnética extrema; cuidado para não prender os dedos ou aproximar ferramentas de aço da cúpula.'
  },
  {
    id: 'bench-03',
    equipmentType: 'Consoles Digitais de Mixagem',
    title: 'Manutenção Preventiva de Faders Motorizados, Encoders e Fontes Internas',
    difficulty: 'Média',
    commonFault: 'Fader motorizado "dançando", travando ao mudar de camada (Layer), não atingindo 0 dB na calibração ou console reiniciando sozinho.',
    testPoints: [
      { point: 'Pista Resistiva do Fader Motorizado (10 kΩ Linear)', nominalValue: '10 kΩ ±10% entre extremos · variação suave no cursor', faultIndication: 'Saltos bruscos de resistência no meio do curso por acúmulo de poeira/líquido' },
      { point: 'Linha de +5.0 VDC Lógica e +12 VDC dos Motores', nominalValue: '5.00 V ±2% · Ripple < 30 mVpp no osciloscópio', faultIndication: 'Ripple > 150 mVpp causado por capacitores eletrolíticos secos na fonte secundária' }
    ],
    procedure: [
      'JAMAIS aplique limpa-contatos oleoso (tipo WD-40 ou spray com lubrificante mineral) dentro de faders motorizados: o óleo remove a película condutiva de carbono e destrói o sensor de toque capacitivo (Touch Sense).',
      'Desmonte o banco de faders, limpe as hastes metálicas guia com álcool isopropílico 99,8% e ar comprimido seco.',
      'Para faders de pista óptica ou carbono seco, utilize exclusivamente ar comprimido e, nas hastes mecânicas laterais (fora da pista elétrica), uma micro-gota de lubrificante de PTFE seco.',
      'Acesse o menu de System Diagnostics / Fader Calibration do console e execute a rotina automática de alinhamento de curso e torque motor.'
    ],
    safetyWarning: 'Utilize pulseira antiestática (ESD) conectada ao chassis do console antes de desconectar os flat-cables das placas de faders.'
  }
];

export const INITIAL_FORUM_THREADS: ForumThread[] = [
  {
    id: 'th-01',
    title: 'Alinhamento de Sub Cardióide (CSA) em palco baixo com parede de alvenaria a 1.5m atrás',
    author: 'Rodrigo Tavares',
    authorRole: 'Engenheiro de Sistemas FOH · São Paulo, SP',
    category: 'Alinhamento & PA',
    createdAt: 'Há 2 horas',
    upvotes: 34,
    solved: true,
    equipmentTags: 'L-Acoustics KS28 · Smaart v9 · LA12X',
    content: 'Pessoal, neste fim de semana vou alinhar um sistema em um ginásio onde os stacks de sub (3x18" por lado em configuração Cardióide CSA) precisam ficar a apenas 1,5m da parede frontal do palco de alvenaria rígida. Na prática de vocês, a reflexão imediata do sub invertido batendo na parede do palco degrada o cancelamento traseiro no microfone do vocalista? Vale mais a pena fazer End-Fire de 2 fileiras ou manter o CSA ajustando o delay pelo Smaart no palco?',
    replies: [
      {
        id: 'rep-101',
        author: 'Marcos Albuquerque',
        authorRole: 'System Tech & Instrutor · Belo Horizonte, MG',
        createdAt: 'Há 1 hora',
        isVerifiedSolution: true,
        content: 'Excelente questão, Rodrigo! Quando o sub traseiro invertido do CSA fica a menos de 1,2m de uma parede rígida de alvenaria do palco, a onda emitida para trás reflete de volta para a frente quase sem perda de energia, reduzindo a eficiência do cancelamento no palco e criando um comb filter em ~55 Hz na frente. A solução prática que sempre uso: afaste o bloco de subs pelo menos 1,8m da face do palco OU posicione um microfone de medição exatamente no pedestal do cantor (no palco), meça a função de transferência do sub frontal vs. sub traseiro lá em cima do palco e ajuste o delay + atenuação (-1.8 dB a -2.5 dB) do sub invertido olhando para o máximo cancelamento no microfone de palco.'
      },
      {
        id: 'rep-102',
        author: 'Felipe Nogueira',
        authorRole: 'Técnico de PA & Monitor · Curitiba, PR',
        createdAt: 'Há 42 min',
        content: 'Assino embaixo do que o Marcos falou. Semana passada peguei uma concha acústica parecida e medir direto na posição do vocalista antes de fechar a fase na House Mix salvou a passagem de som: ganhamos 12 dB de limpeza em 63 Hz no palco!'
      }
    ]
  },
  {
    id: 'th-02',
    title: 'Yamaha DM7 / CL5: Dica de ouro para roteamento de Dante Virtual Soundcard em Virtual Soundcheck',
    author: 'Camila Andrade',
    authorRole: 'Engenheira de Monitor & FOH · Rio de Janeiro, RJ',
    category: 'Consoles Digitais',
    createdAt: 'Há 5 horas',
    upvotes: 28,
    solved: true,
    equipmentTags: 'Yamaha CL5 · Rio3224-D2 · Dante DVS',
    content: 'Compartilhando um fluxo de trabalho que tem economizado muito tempo em turnê: ao gravar 64 canais via Dante Virtual Soundcard (DVS) no Reaper ou Nuendo Live para passagem de som virtual, muitos colegas mudam o patch canal por canal. Qual é o método mais seguro que vocês usam para alternar entre o Stagebox Rio e o computador sem perder a configuração de HA Analógico para os músicos no IEM?',
    replies: [
      {
        id: 'rep-201',
        author: 'Daniel K. Souza',
        authorRole: 'Especialista em Redes de Áudio · Porto Alegre, RS',
        createdAt: 'Há 3 horas',
        isVerifiedSolution: true,
        content: 'Camila, o caminho mais seguro no Dante Controller é usar os "Dante Presets" apenas para o roteamento dos fluxos de entrada do console, OU melhor ainda na linha Rivage/DM7/CL: manter os canais 1–48 no Input Patch A (Stagebox Rio) e configurar a biblioteca de User Defined Keys com "Alternative Input / GP Out" para chavear globalmente entre Input Patch A e Input Patch B (DVS) com um único botão, mantendo o AG-DG Compensation ativo!'
      }
    ]
  },
  {
    id: 'th-03',
    title: 'Bancada: Amplificador Lab Gruppen FP10000Q desarmando canal C sob carga de 2 Ohms',
    author: 'Cláudio Fontes',
    authorRole: 'Engenheiro Eletrônico de Bancada · Campinas, SP',
    category: 'Conserto & Bancada',
    createdAt: 'Ontem',
    upvotes: 41,
    solved: true,
    equipmentTags: 'Lab Gruppen FP10000Q · Classe TD · Osciloscópio',
    content: 'Peguei na bancada um FP10000Q original onde os canais A, B e D entregam potência total em carga resistiva de 2Ω, mas o canal C aciona o limitador VPL/Current Clip precocemente com metade da excursão. Os MOSFETs do regulador buck Classe TD e os transistores bipolares da ponte H estão íntegros. Alguém já pegou alteração nos resistores shunt de leitura de corrente desse canal?',
    replies: [
      {
        id: 'rep-301',
        author: 'Eduardo Martins',
        authorRole: 'Técnico de Manutenção Pro Audio · Goiânia, GO',
        createdAt: 'Há 18 horas',
        isVerifiedSolution: true,
        content: 'Cláudio, certeiro! Nos módulos Classe TD da linha FP+, existe um par de amplificadores operacionais SMD (TL072 / MC33078) que lê a queda de tensão sobre os resistores shunt de 0.01Ω da saída e envia para o circuito de proteção de sobrecorrente (VPL/I- Sense). Com a vibração térmica dos racks de sub, os resistores SMD de 1kΩ da malha diferencial abrem ou alteram valor para ~4kΩ, fazendo o circuito achar que a corrente em 2Ω já bateu no limite de pico!'
      }
    ]
  },
  {
    id: 'th-04',
    title: 'Microfonação de Coral e Bateria em Igrejas com Tempo de Reverberação (RT60) acima de 2.8 segundos',
    author: 'Lucas Mendonça',
    authorRole: 'Diretor Técnico de Áudio · Recife, PE',
    category: 'Acústica Aplicada',
    createdAt: 'Há 2 dias',
    upvotes: 52,
    solved: true,
    equipmentTags: 'Allen & Heath dLive · Shure KSM9 · Acústica de Templos',
    content: 'Estamos assumindo a sonorização de uma catedral com pé-direito de 14 metros, piso de granito e paredes paralelas sem absorção (RT60 em 500 Hz medido em 2,9 segundos). Mesmo com bateria em aquário de acrílico, a inteligibilidade da fala e do vocal principal cai muito do meio para o fundo. Quais estratégias práticas de posicionamento de caixas e processamento funcionaram melhor para vocês antes da reforma acústica?',
    replies: [
      {
        id: 'rep-401',
        author: 'Eng. Ricardo Vasconcelos',
        authorRole: 'Consultor de Acústica & Sistemas · Brasília, DF',
        createdAt: 'Há 1 dia',
        isVerifiedSolution: true,
        content: 'Lucas, em templos com RT60 > 2.5s, a regra número 1 é aumentar a relação Som Direto / Som Reverberante: 1) Em vez de tentar jogar do palco até 45 metros com um único PA em volume alto (o que só excita o teto e as paredes), utilize linhas de delay menores a cada 12 metros inclinadas para baixo (mirando nas pessoas, nunca nas paredes). 2) Na fala/pregador e voz principal, faça um HPF firme em 130 Hz e um corte largo de -4 dB em 250–400 Hz (região onde o granito e a alvenaria mais acumulam energia). 3) No aquário de acrílico da bateria, cole painéis de lã de rocha revestida na parte interna inferior e atrás do baterista, pois o acrílico puro apenas reflete o som de volta para os overheads!'
      }
    ]
  }
];
