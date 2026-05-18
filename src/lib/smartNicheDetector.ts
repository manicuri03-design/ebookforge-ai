// smartNicheDetector.ts
// Intelligent niche detector based on user's free-text prompt

export interface NicheProfile {
  nicho: string;
  nichoKey: string;
  tom: string;
  chapters: number;
  coverGradient: string;
  visualStyle: string;
}

const NICHE_KEYWORDS: Record<string, string[]> = {
  cristao: [
    "deus", "bíblia", "biblia", "fé", "fe", "oração", "oracao", "devocional",
    "cristão", "cristao", "cristã", "crista", "gospel", "jesus", "espírito",
    "espirito", "igreja", "missão", "missao", "pastor", "evangelho", "bênção",
    "bencao", "graça", "graca", "salmo", "palavra", "ungido", "cura", "amor de deus",
    "relacionamento com deus", "propósito", "proposito", "mordomia", "dizimo",
    "jovem cristão", "jovem crista", "mulher de deus", "homem de deus",
    "vida espiritual", "renovar a fé", "crescimento espiritual"
  ],
  ansiedade: [
    "ansiedade", "ansioso", "ansiosa", "medo", "pânico", "panico", "estresse",
    "stress", "paz", "mental", "emoções", "emocoes", "autoestima", "depressão",
    "depressao", "tristeza", "angústia", "angustia", "pensamentos negativos",
    "controle emocional", "saúde mental", "saude mental", "equilíbrio", "equilibrio",
    "autocuidado", "terapia", "bem-estar", "mindfulness", "meditação", "meditacao"
  ],
  "renda extra": [
    "dinheiro", "renda", "renda extra", "trabalho", "trabalhar", "online",
    "negócio", "negocio", "faturar", "liberdade financeira", "ganhar dinheiro",
    "freelancer", "empreender", "empreendedor", "vender", "vendas", "infoproduto",
    "ebook vender", "kiwify", "hotmart", "afiliado", "lucro", "faturamento",
    "home office", "trabalhar de casa", "renda passiva", "investir", "independência"
  ],
  "marketing digital": [
    "marketing", "digital", "clientes", "leads", "ads", "tráfego", "trafego",
    "funil", "instagram", "copywriting", "copy", "lançamento", "conversão",
    "conversao", "vender online", "estratégia", "estrategia", "marca", "branding",
    "conteúdo", "conteudo", "criador", "influencer", "audiência", "audiencia",
    "stories", "reels", "meta ads", "google ads", "facebook", "landing page",
    "email marketing", "lista", "automação", "automacao"
  ],
  emagrecimento: [
    "emagrecer", "emagrecimento", "peso", "dieta", "saúde", "saudável",
    "saudavel", "fitness", "corpo", "exercícios", "exercicios", "alimentação",
    "alimentacao", "nutrição", "nutricao", "academia", "treino", "perder peso",
    "gordura", "calorias", "metabolismo", "detox", "jejum", "hiit", "musculação",
    "musculacao", "estética", "estetica", "shapewear", "colesterol", "diabetes"
  ],
  motivacional: [
    "motivação", "motivacao", "motivar", "hábitos", "habitos", "metas", "foco",
    "alta performance", "disciplina", "sucesso", "produtividade", "mindset",
    "mentalidade", "crescimento", "pessoal", "desenvolvimento pessoal", "liderança",
    "lideranca", "vencedor", "superação", "superacao", "autoconfiança",
    "autoconfianca", "potencial", "realização", "realizacao", "sonhos", "objetivos",
    "procrastinação", "procrastinacao", "planejamento", "propósito de vida"
  ],
  relacionamentos: [
    "amor", "casamento", "relacionamento", "família", "familia", "filhos",
    "parceiros", "conflitos", "comunicação", "comunicacao", "divórcio", "divorcio",
    "namoro", "namoros", "sedução", "seducao", "atrair", "resgatar", "separação",
    "separacao", "casal", "romance", "traição", "traicao", "perdão", "perdao",
    "abuso", "relacionamento tóxico", "autoamor", "solidão", "solidao"
  ]
};

const NICHE_LABELS: Record<string, string> = {
  cristao: "Cristão / Espiritual",
  ansiedade: "Saúde Mental e Bem-Estar",
  "renda extra": "Finanças e Renda Extra",
  "marketing digital": "Marketing Digital",
  emagrecimento: "Saúde e Emagrecimento",
  motivacional: "Desenvolvimento Pessoal",
  relacionamentos: "Relacionamentos e Família"
};

const NICHE_TONES: Record<string, string> = {
  cristao: "Inspirador / Devocional",
  ansiedade: "Acolhedor / Terapêutico",
  "renda extra": "Prático / Motivacional",
  "marketing digital": "Persuasivo / Estratégico",
  emagrecimento: "Empático / Motivacional",
  motivacional: "Energético / Transformador",
  relacionamentos: "Acolhedor / Reflexivo"
};

const NICHE_GRADIENTS: Record<string, string> = {
  cristao: "from-amber-500 to-orange-600",
  ansiedade: "from-teal-500 to-cyan-600",
  "renda extra": "from-emerald-500 to-green-600",
  "marketing digital": "from-purple-600 to-indigo-700",
  emagrecimento: "from-rose-500 to-pink-600",
  motivacional: "from-blue-600 to-violet-600",
  relacionamentos: "from-red-500 to-rose-600"
};

const NICHE_VISUAL_STYLE: Record<string, string> = {
  cristao: "Editorial Dourado",
  ansiedade: "Minimalista Zen",
  "renda extra": "Dark Mode Moderno",
  "marketing digital": "Tech Premium",
  emagrecimento: "Clean Wellness",
  motivacional: "Impacto Visual",
  relacionamentos: "Romantico Elegante"
};

export function detectNiche(prompt: string): NicheProfile {
  const normalized = prompt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  let bestMatch = "";
  let bestScore = 0;

  for (const [nicheKey, keywords] of Object.entries(NICHE_KEYWORDS)) {
    const normalizedNicheKey = nicheKey.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let score = 0;
    const normalizedKeywords = keywords.map((kw) =>
      kw.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    );
    for (const kw of normalizedKeywords) {
      if (normalized.includes(kw)) {
        score += kw.length; // Longer matches are more specific = higher score
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = normalizedNicheKey;
    }
  }

  // If no match, try by partial pattern or default to motivacional
  if (!bestMatch || bestScore === 0) {
    bestMatch = "motivacional";
  }

  return {
    nicho: NICHE_LABELS[bestMatch] || "Desenvolvimento Pessoal",
    nichoKey: bestMatch,
    tom: NICHE_TONES[bestMatch] || "Persuasivo / Transformador",
    chapters: 7,
    coverGradient: NICHE_GRADIENTS[bestMatch] || "from-purple-600 to-indigo-700",
    visualStyle: NICHE_VISUAL_STYLE[bestMatch] || "Premium Moderno"
  };
}
