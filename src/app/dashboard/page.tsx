"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";

const PDFPreviewOverlay = dynamic(
  () => import("@/components/PDFPreviewOverlay").then((mod) => mod.PDFPreviewOverlay),
  { ssr: false }
);

interface Ebook {
  id: string;
  title: string;
  topic: string;
  category: string;
  tone: string;
  date: string;
  status: "Pronto" | "Rascunho" | "Gerando...";
  pages: number;
  coverGradient: string;
  content: string;
  visualStyle: string;
}

import { UpgradeModal } from "@/components/UpgradeModal";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout, incrementAssists, syncEbooksUsedCount } = useAuth();

  // Sidebar states
  const [activeTab, setActiveTab] = useState<"my-ebooks" | "templates" | "billing" | "settings">("my-ebooks");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Route Protection Effect
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Ebooks state initialized with beautiful defaults, then loaded from Local Storage
  const [ebooks, setEbooks] = useState<Ebook[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ebookforge_saved_ebooks");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Erro ao carregar ebooks salvos:", e);
        }
      }
    }
    return [
      {
        id: "1",
        title: "Como Vender Mentoria High-Ticket",
        topic: "Marketing Digital",
        category: "marketing digital",
        tone: "Persuasivo",
        date: "16/05/2026",
        status: "Pronto",
        pages: 22,
        coverGradient: "from-purple-600 to-indigo-700",
        visualStyle: "Moderno",
        content: "# Como Vender Mentoria High-Ticket\n\n*Como construir posicionamento premium e fechar contratos de R$ 5.000 a R$ 50.000*\n\n---\n\n## Introdução\n\nO mercado de mentorias de alto valor está crescendo exponencialmente. Descubra neste ebook as estratégias ocultas por trás de vendas altamente lucrativas.\n\n---\n\n## Sumário\n\n1. Capítulo 1: O Posicionamento Premium\n2. Capítulo 2: A Oferta Irrecusável\n\n---\n\n## Capítulo 1: O Posicionamento Premium\n\nPara cobrar mais de R$ 5.000 por uma mentoria, você precisa deixar de ser um generalista e se tornar um especialista indispensável. O seu posicionamento determina o seu preço.\n\n---\n\n## Capítulo 2: A Oferta Irrecusável\n\nCrie uma entrega focada em resultados práticos, oferecendo suporte exclusivo e processos claros de aceleração.\n\n---\n\n## Conclusão\n\nO posicionamento premium é construído através de entrega impecável e autoridade percebida. Comece a aplicar hoje mesmo.\n\n---\n\n### 🎯 Próximo Passo: Mentoria Acelerada\n\nDeseja acelerar seus resultados? Participe da nossa próxima sessão de mentoria individual estratégica."
      },
      {
        id: "2",
        title: "Guia Prático de Finanças à Luz da Bíblia",
        topic: "Finanças Pessoais",
        category: "cristão",
        tone: "Instrutivo",
        date: "12/05/2026",
        status: "Pronto",
        pages: 18,
        coverGradient: "from-amber-500 to-orange-600",
        visualStyle: "Editorial",
        content: "# Guia Prático de Finanças à Luz da Bíblia\n\n*Como administrar seus recursos sob a ótica dos ensinamentos eternos*\n\n---\n\n## Introdução\n\nA verdadeira prosperidade financeira une sabedoria espiritual e disciplina prática. Explore o que as escrituras ensinam sobre administração.\n\n---\n\n## Sumário\n\n1. Capítulo 1: Mordomia e Fidelidade\n2. Capítulo 2: Eliminação de Dívidas\n\n---\n\n## Capítulo 1: Mordomia e Fidelidade\n\nTudo o que temos pertence ao Criador. Nós somos apenas administradores temporários dos recursos que nos foram confiados.\n\n---\n\n## Capítulo 2: Eliminação de Dívidas\n\nA dívida é descrita como uma forma de servidão. Descubra planos práticos de contenção e amortização rápida de débitos.\n\n---\n\n## Conclusão\n\nA mordomia cristã exige fidelidade nos pequenos detalhes cotidianos. Cultive um coração generoso.\n\n---\n\n### 🎯 Próximo Passo: Comunidade Fé & Finanças\n\nParticipe da nossa mentoria mensal de princípios bíblicos aplicados aos negócios."
      }
    ];
  });

  // Persistent State Sync Helper
  const updateEbooksState = (newEbooks: Ebook[] | ((prev: Ebook[]) => Ebook[])) => {
    setEbooks((prev) => {
      const resolved = typeof newEbooks === "function" ? newEbooks(prev) : newEbooks;
      localStorage.setItem("ebookforge_saved_ebooks", JSON.stringify(resolved));
      return resolved;
    });
  };

  // View state: 'list' or 'editor'
  const [viewMode, setViewMode] = useState<"list" | "editor">("list");
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);

  // Modal creation states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2>(1);
  const [userPrompt, setUserPrompt] = useState("");
  const [nicheProfile, setNicheProfile] = useState<{ nicho: string; tom: string; coverGradient: string; visualStyle: string } | null>(null);

  // AI Generation Simulation & Loading State
  const [genProgress, setGenProgress] = useState(0);
  const [genStatusText, setGenStatusText] = useState("Inicializando modelo de linguagem...");
  const [errorText, setErrorText] = useState("");

  // Editor Auto-save State
  const [isSaving, setIsSaving] = useState(false);
  const [editorText, setEditorText] = useState("");

  // Plan state
  const isPremium = user?.plan === "premium_monthly" || user?.plan === "premium_yearly";
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"ebooks" | "assists" | "templates" | "pdf" | "custom">("custom");

  // Sync ebooks_used metric with backend
  useEffect(() => {
    if (user && ebooks.length !== user.ebooks_used) {
      syncEbooksUsedCount(ebooks.length);
    }
  }, [ebooks.length, user, syncEbooksUsedCount]);

  // PDF Preview State
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false);

  // AI Assistant Inline Sidebar States
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiAction, setAiAction] = useState<"improve" | "expand" | "grammar" | "tone" | "custom">("improve");
  const [aiSelectedTone, setAiSelectedTone] = useState("Persuasivo");
  const [aiInstruction, setAiInstruction] = useState("");
  const [aiTextSegment, setAiTextSegment] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState("");
  const [aiErrorMessage, setAiErrorMessage] = useState("");

  // Editor Auto-save Simulator
  useEffect(() => {
    if (viewMode === "editor" && editingEbook && editorText !== editingEbook.content) {
      const timer = setTimeout(() => {
        updateEbooksState((prev) =>
          prev.map((eb) => (eb.id === editingEbook.id ? { ...eb, content: editorText } : eb))
        );
        setIsSaving(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [editorText, viewMode, editingEbook]);

  // Early render skeleton while loading auth state or redirecting
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-black text-white text-xl shadow-[0_0_20px_rgba(139,92,246,0.6)] animate-pulse">
            E
          </div>
          <div className="space-y-1.5">
            <h3 className="text-sm font-bold tracking-wider uppercase text-white">EbookForge AI</h3>
            <p className="text-xs text-gray-400 font-medium animate-pulse">Autenticando sessão segura...</p>
          </div>
          <svg className="animate-spin h-5 w-5 text-amber-500 mt-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  // Handle actions
  const handleOpenCreateModal = () => {
    if (!isPremium && ebooks.length >= 3) {
      setUpgradeReason("ebooks");
      setIsUpgradeModalOpen(true);
      return;
    }
    setUserPrompt("");
    setNicheProfile(null);
    setWizardStep(1);
    setErrorText("");
    setGenProgress(0);
    setIsCreateModalOpen(true);
  };


  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPrompt.trim()) {
      alert("Descreva o tema do seu ebook.");
      return;
    }

    setWizardStep(2);
    setGenProgress(5);
    setGenStatusText("Detectando nicho e analisando seu tema...");
    setErrorText("");

    const progressSteps = [
      "🔍 Detectando nicho e audiência-alvo...",
      "🧠 Selecionando tom de voz ideal automaticamente...",
      "📋 Estruturando sumário com 7 capítulos...",
      "✍️ Redigindo introdução persuasiva...",
      "📖 Desenvolvendo capítulos com conteúdo aprofundado...",
      "🎯 Criando conclusão e CTA de alta conversão...",
      "🎨 Gerando capa premium automaticamente...",
      "✅ Finalizando e salvando seu ebook...",
    ];
    let stepIndex = 0;

    const progressInterval = setInterval(() => {
      setGenProgress((prev) => {
        if (prev >= 92) { clearInterval(progressInterval); return 92; }
        if (stepIndex < progressSteps.length) {
          setGenStatusText(progressSteps[stepIndex]);
          stepIndex++;
        }
        return prev + Math.floor(Math.random() * 7) + 3;
      });
    }, 600);

    try {
      const response = await fetch("/api/auto-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt })
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Falha na geração do ebook.");
      }

      const data = await response.json();
      const generated = data.ebook;
      const profile = data.nicheProfile;
      setNicheProfile(profile);

      let markdownContent = `# ${generated.title}\n\n*${generated.subtitle}*\n\n---\n\n## Introdução\n\n${generated.introduction}\n\n---\n\n## Sumário\n\n`;
      generated.chapters.forEach((ch: { title: string; content: string }, idx: number) => {
        markdownContent += `${idx + 1}. ${ch.title}\n`;
      });
      markdownContent += `\n---\n\n`;
      generated.chapters.forEach((ch: { title: string; content: string }) => {
        markdownContent += `## ${ch.title}\n\n${ch.content}\n\n---\n\n`;
      });
      markdownContent += `## Conclusão\n\n${generated.conclusion}\n\n---\n\n${generated.cta}`;

      const newEbookItem: Ebook = {
        id: Math.random().toString(),
        title: generated.title,
        topic: userPrompt,
        category: profile?.nicho || "Geral",
        tone: profile?.tom || "Persuasivo",
        date: new Date().toLocaleDateString("pt-BR"),
        status: "Pronto",
        pages: 7 * 6 + 4,
        coverGradient: profile?.coverGradient || "from-purple-600 to-indigo-700",
        visualStyle: profile?.visualStyle || "Premium Moderno",
        content: markdownContent
      };

      setGenProgress(100);
      setGenStatusText("✅ Pronto! Abrindo seu ebook premium...");

      setTimeout(() => {
        updateEbooksState((prev) => [newEbookItem, ...prev]);
        setIsCreateModalOpen(false);
        setWizardStep(1);
        setUserPrompt("");
        setNicheProfile(null);
        setEditingEbook(newEbookItem);
        setEditorText(newEbookItem.content);
        setViewMode("editor");
      }, 800);

    } catch (err: unknown) {
      clearInterval(progressInterval);
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Erro de conexão com o servidor de IA.";
      setErrorText(errMsg);
      setWizardStep(1);
      setGenProgress(0);
    }
  };


  // IA Assistant content action trigger
  const handleTriggerAiAssistant = async () => {
    if (!isPremium && (user?.assists_used || 0) >= 5) {
      setUpgradeReason("assists");
      setIsUpgradeModalOpen(true);
      return;
    }

    if (!aiTextSegment) {
      setAiErrorMessage("Por favor, cole um trecho de texto no painel para a IA processar.");
      return;
    }

    setIsAiLoading(true);
    setAiSuccessMessage("");
    setAiErrorMessage("");

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: aiTextSegment,
          action: aiAction,
          instruction: aiInstruction,
          tone: aiSelectedTone
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Erro no processamento do assistente.");
      }

      const data = await response.json();
      setAiTextSegment(data.text);
      setAiSuccessMessage("Texto processado com sucesso!");
      await incrementAssists();
    } catch (err: unknown) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Erro no processamento.";
      setAiErrorMessage(errMsg);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleEditEbook = (ebook: Ebook) => {
    setEditingEbook(ebook);
    setEditorText(ebook.content);
    setIsAiAssistantOpen(false);
    setAiTextSegment("");
    setViewMode("editor");
  };

  const handleDeleteEbook = (id: string) => {
    if (confirm("Tem certeza que deseja excluir permanentemente este Ebook?")) {
      updateEbooksState(ebooks.filter((eb) => eb.id !== id));
      if (editingEbook?.id === id) {
        setViewMode("list");
      }
    }
  };

  const handleDownloadPDF = (ebook: Ebook) => {
    // Simulating download trigger by exporting .txt / .md format
    const element = document.createElement("a");
    const file = new Blob([ebook.content], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `${ebook.title.toLowerCase().replace(/\s+/g, "-")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };




  // Full Screen Protection Loading State
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <svg className="w-10 h-10 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-400 text-sm font-semibold tracking-wider animate-pulse">Carregando painel seguro...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050810] text-white flex flex-col md:flex-row font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 w-64 border-r border-white/10 bg-[#0B0F19] flex flex-col z-50 transition-transform duration-300 md:relative md:translate-x-0 ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-[0_0_12px_rgba(139,92,246,0.5)]">
              E
            </div>
            <span className="font-bold tracking-tight text-lg">EbookForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-extrabold text-sm">AI</span></span>
          </Link>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMobileSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* User Quick Info */}
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-sm uppercase">
            {(user?.user_metadata?.name || user?.email || "US").slice(0, 2)}
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-sm font-semibold truncate" title={user?.email || ""}>
              {user?.user_metadata?.name || user?.email?.split("@")[0] || "Usuário"}
            </h4>
            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${isPremium ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-gray-500/20 text-gray-400 border border-gray-500/20"}`}>
              {isPremium ? "Plano PRO" : "Plano Grátis"}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="p-4 flex-1 space-y-1">
          <button 
            onClick={() => { setActiveTab("my-ebooks"); setViewMode("list"); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-left ${activeTab === "my-ebooks" && viewMode === "list" ? "bg-gradient-to-r from-primary/20 to-secondary/10 text-white border border-white/10" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            Meus Ebooks
          </button>
          <button 
            onClick={() => { setActiveTab("templates"); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-left ${activeTab === "templates" ? "bg-gradient-to-r from-primary/20 to-secondary/10 text-white border border-white/10" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Templates de Capas
          </button>
          <button 
            onClick={() => { setActiveTab("billing"); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-left ${activeTab === "billing" ? "bg-gradient-to-r from-primary/20 to-secondary/10 text-white border border-white/10" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            Faturamento & Planos
          </button>
          <button 
            onClick={() => { setActiveTab("settings"); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm text-left ${activeTab === "settings" ? "bg-gradient-to-r from-primary/20 to-secondary/10 text-white border border-white/10" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Configurações
          </button>
        </div>

        {/* Upgrade Banner in Free Plan */}
        {!isPremium && (
          <div className="mx-4 my-2 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 space-y-4">
            
            {/* Limit metrics */}
            <div className="space-y-2.5">
              <div className="space-y-1 text-left">
                <div className="flex justify-between text-[9px] text-gray-400 font-bold tracking-wider">
                  <span>EBOOKS CRIADOS</span>
                  <span>{ebooks.length} / 3</span>
                </div>
                <div className="w-full bg-[#050810] h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${Math.min(100, (ebooks.length / 3) * 100)}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <div className="flex justify-between text-[9px] text-gray-400 font-bold tracking-wider">
                  <span>CO-PILOTO IA</span>
                  <span>{user?.assists_used || 0} / 5</span>
                </div>
                <div className="w-full bg-[#050810] h-1 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-secondary" 
                    style={{ width: `${Math.min(100, ((user?.assists_used || 0) / 5) * 100)}%` }} 
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-white/5" />

            <div className="text-center">
              <h4 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Upgrade para Ilimitado</h4>
              <p className="text-[10px] text-gray-400 mt-1 mb-3">Libere templates e downloads em PDF HD.</p>
              <button 
                onClick={() => router.push("/pricing")}
                className="w-full py-2 bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] transition-all rounded-lg text-xs font-semibold cursor-pointer text-white"
              >
                Virar Premium PRO
              </button>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={async () => {
              await logout();
              router.push("/login");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors font-medium text-sm cursor-pointer text-left"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sair da Plataforma
          </button>
        </div>
      </aside>

      {/* Main Panel Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-6 sm:px-8 border-b border-white/10 bg-[#0B0F19]/50 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsMobileSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-lg font-semibold capitalize hidden sm:block">
              {viewMode === "editor" 
                ? `Editando: ${editingEbook?.title}` 
                : activeTab === "my-ebooks" 
                  ? `Olá, ${user?.user_metadata?.name?.split(" ")[0] || "Criador"}!` 
                  : activeTab}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {viewMode === "editor" && (
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full bg-emerald-500 ${isSaving ? "animate-ping" : ""}`}></span>
                {isSaving ? "Salvando..." : "Salvo na nuvem automaticamente"}
              </span>
            )}
            <div className="h-6 w-px bg-white/10"></div>
            <button 
              onClick={handleOpenCreateModal}
              className="px-4 py-2 bg-gradient-to-r from-primary to-secondary rounded-lg text-sm font-semibold hover:scale-105 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Novo Ebook
            </button>
          </div>
        </header>

        {/* Dashboard Pages Context */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 animate-fade-in-up">
          
          {/* EDITOR VIEW (Notion Style Document Editor + Collapsible IA Assistant) */}
          {viewMode === "editor" && editingEbook && (
            <div className="max-w-7xl mx-auto bg-[#121827] border border-white/10 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
              
              {/* Toolbar header */}
              <div className="bg-white/5 px-6 py-4 flex justify-between items-center border-b border-white/10 flex-wrap gap-3">
                <button 
                  onClick={() => setViewMode("list")}
                  className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Voltar ao Painel
                </button>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsAiAssistantOpen(!isAiAssistantOpen)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${isAiAssistantOpen ? "bg-primary text-white border-primary" : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"}`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Assistente de IA
                  </button>
                  <button 
                    onClick={() => handleDownloadPDF(editingEbook)}
                    className="px-4 py-2 border border-white/10 rounded-lg text-xs hover:bg-white/5 transition-all flex items-center gap-1.5 text-gray-300 hover:text-white"
                  >
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Exportar (.MD / .TXT)
                  </button>
                  <button 
                    onClick={() => setIsPdfPreviewOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg text-xs font-bold hover:scale-105 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all flex items-center gap-1.5 text-black cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Exportar PDF Premium
                  </button>
                </div>
              </div>

              {/* Cover Header Graphic */}
              <div className={`h-36 bg-gradient-to-br ${editingEbook.coverGradient} relative flex items-end p-6 overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <span className="relative z-10 text-xs uppercase tracking-wider font-bold text-white/80 bg-black/50 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                  Estilo: {editingEbook.visualStyle} / Categoria: {editingEbook.category}
                </span>
              </div>

              {/* Notion-style Workspace Panels */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-full">
                
                {/* 1. Left Sidebar: Chapters Index */}
                <div className="w-full md:w-60 border-b md:border-b-0 md:border-r border-white/10 p-4 space-y-2 bg-[#0B0F19]/40 overflow-y-auto hidden sm:block">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Seções do Livro</h4>
                  <div className="space-y-1">
                    <button className="w-full text-left text-xs bg-white/5 border border-white/5 px-3 py-2 rounded-lg font-medium text-white flex items-center justify-between">
                      <span>Capa e Títulos</span>
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold uppercase">OK</span>
                    </button>
                    <button className="w-full text-left text-xs text-gray-400 hover:bg-white/5 hover:text-white px-3 py-2 rounded-lg font-medium transition-colors">
                      <span>Introdução do Autor</span>
                    </button>
                    <button className="w-full text-left text-xs text-gray-400 hover:bg-white/5 hover:text-white px-3 py-2 rounded-lg font-medium flex items-center justify-between transition-colors">
                      <span>Capítulos do Conteúdo</span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                    </button>
                    <button className="w-full text-left text-xs text-gray-400 hover:bg-white/5 hover:text-white px-3 py-2 rounded-lg font-medium transition-colors">
                      <span>Conclusão e Oferta CTA</span>
                    </button>
                  </div>
                </div>

                {/* 2. Center: Markdown rich text editor workspace */}
                <div className="flex-1 p-6 overflow-y-auto bg-[#121827] flex flex-col">
                  <textarea
                    value={editorText}
                    onChange={(e) => {
                      setEditorText(e.target.value);
                      setIsSaving(true);
                    }}
                    className="w-full flex-1 bg-transparent text-white font-mono text-sm leading-relaxed border-0 focus:outline-none resize-none focus:ring-0 placeholder-gray-600"
                    placeholder="Escreva algo brilhante aqui em Markdown..."
                  />
                </div>

                {/* 3. Right: IA Assistant Panel */}
                {isAiAssistantOpen && (
                  <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 p-5 bg-[#0B0F19]/90 flex flex-col justify-between overflow-y-auto h-full animate-fade-in-right z-20">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary uppercase tracking-wider flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          Assistente de IA
                        </h4>
                        <button onClick={() => setIsAiAssistantOpen(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[11px] text-gray-400 leading-relaxed">
                          Copie um parágrafo do editor para o campo abaixo, selecione a ação desejada e clique em transformar para a IA polir instantaneamente!
                        </p>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Texto para Otimizar</label>
                          <textarea
                            value={aiTextSegment}
                            onChange={(e) => setAiTextSegment(e.target.value)}
                            rows={5}
                            className="w-full bg-[#050810] border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-primary resize-none"
                            placeholder="Cole o parágrafo ou trecho aqui..."
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ação Editorial</label>
                          <select
                            value={aiAction}
                            onChange={(e) => setAiAction(e.target.value as "improve" | "expand" | "grammar" | "tone" | "custom")}
                            className="w-full bg-[#050810] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-primary"
                          >
                            <option value="improve">✨ Aprimorar e Polir Texto</option>
                            <option value="expand">✍️ Expandir com Novos Parágrafos</option>
                            <option value="grammar">✓ Corrigir Gramática e Estilo</option>
                            <option value="tone">📢 Alterar Tom de Voz</option>
                            <option value="custom">🛠️ Instrução Personalizada</option>
                          </select>
                        </div>

                        {aiAction === "tone" && (
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Selecionar Tom</label>
                            <select
                              value={aiSelectedTone}
                              onChange={(e) => setAiSelectedTone(e.target.value)}
                              className="w-full bg-[#050810] border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none"
                            >
                              <option value="Persuasivo">Persuasivo para Vendas</option>
                              <option value="Profissional">Corporativo / Profissional</option>
                              <option value="Devocional">Devocional / Inspirador</option>
                              <option value="Técnico">Técnico / Analítico</option>
                            </select>
                          </div>
                        )}

                        {aiAction === "custom" && (
                          <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Instrução para a IA</label>
                            <input
                              type="text"
                              value={aiInstruction}
                              onChange={(e) => setAiInstruction(e.target.value)}
                              className="w-full bg-[#050810] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none"
                              placeholder="Ex: Reescreva de forma poética e inspiradora"
                            />
                          </div>
                        )}

                        {aiSuccessMessage && (
                          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] p-2.5 rounded-lg flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
                            <span>{aiSuccessMessage}</span>
                          </div>
                        )}

                        {aiErrorMessage && (
                          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] p-2.5 rounded-lg flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>
                            <span>{aiErrorMessage}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <button
                        onClick={handleTriggerAiAssistant}
                        disabled={isAiLoading}
                        className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg text-xs hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isAiLoading ? (
                          <>
                            <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>Transformando...</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            <span>Aplicar IA no Trecho</span>
                          </>
                        )}
                      </button>
                      
                      <p className="text-[9px] text-gray-500 text-center">
                        Para salvar a melhoria, copie o resultado revisado acima e cole de volta no seu editor de texto.
                      </p>
                    </div>

                  </div>
                )}

              </div>
            </div>
          )}

          {/* MAIN EBOOKS LIST */}
          {viewMode === "list" && activeTab === "my-ebooks" && (
            <div className="max-w-6xl mx-auto">
              
              {/* Top Grid Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#121827] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{ebooks.length}</h3>
                    <p className="text-xs text-gray-400">Total de Ebooks</p>
                  </div>
                </div>

                <div className="bg-[#121827] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{isPremium ? "Ilimitado" : `${Math.max(0, 3 - ebooks.length)}`}</h3>
                    <p className="text-xs text-gray-400">Créditos de Criação</p>
                  </div>
                </div>

                <div className="bg-[#121827] border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{isPremium ? "PRO" : "Gratuito"}</h3>
                    <p className="text-xs text-gray-400">Plano Atual</p>
                  </div>
                </div>
              </div>

              {/* Main List Table Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Histórico de Criação</h3>
                <span className="text-xs text-gray-400">Mostrando {ebooks.length} resultados</span>
              </div>

              {/* Responsive Cards/Grid of Ebooks */}
              {ebooks.length === 0 ? (
                <div className="bg-[#121827]/50 border border-white/5 border-dashed rounded-2xl p-16 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Seu histórico está vazio</h3>
                  <p className="text-gray-400 max-w-sm mx-auto mb-8">Nenhum ebook criado. Clique em &quot;Novo Ebook&quot; no canto superior direito para dar vida ao seu primeiro produto com Inteligência Artificial.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ebooks.map((eb) => (
                    <div 
                      key={eb.id} 
                      className="group bg-[#121827] border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] flex flex-col h-[380px]"
                    >
                      {/* Ebook Cover Mockup */}
                      <div className={`h-40 bg-gradient-to-br ${eb.coverGradient} p-6 relative flex flex-col justify-between overflow-hidden`}>
                        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="self-end text-[9px] font-bold bg-black/50 backdrop-blur-md border border-white/10 rounded-full px-2 py-1 text-white/90 uppercase">
                          {eb.visualStyle} • {eb.pages} pág
                        </span>
                        
                        <div className="relative z-10">
                          <h4 className="text-sm font-bold text-white line-clamp-2 drop-shadow-md">{eb.title}</h4>
                          <span className="text-[10px] text-white/80 block mt-1 drop-shadow capitalize">{eb.category}</span>
                        </div>
                      </div>

                      {/* Ebook Details Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between bg-[#121827]/70">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Tom de Voz:</span>
                            <span className="font-semibold text-gray-200">{eb.tone}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Criado em:</span>
                            <span className="text-gray-300">{eb.date}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400">Tema base:</span>
                            <span className="text-gray-300 truncate max-w-[140px]" title={eb.topic}>{eb.topic}</span>
                          </div>
                        </div>

                        {/* Actions Row */}
                        <div className="flex gap-2 pt-4 border-t border-white/5">
                          <button 
                            onClick={() => handleEditEbook(eb)}
                            className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-primary/20 hover:text-white border border-white/10 hover:border-primary/30 transition-all text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDownloadPDF(eb)}
                            className="py-2 px-3 rounded-lg bg-white/5 hover:bg-secondary/20 hover:text-white border border-white/10 hover:border-secondary/30 transition-all text-xs font-semibold flex items-center justify-center cursor-pointer"
                            title="Baixar Markdown / TXT"
                          >
                            <svg className="w-4 h-4 text-gray-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteEbook(eb.id)}
                            className="py-2 px-3 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all text-xs font-semibold flex items-center justify-center cursor-pointer"
                            title="Excluir Ebook"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TEMPLATES TAB */}
          {activeTab === "templates" && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h3 className="text-2xl font-bold">Templates de Capas</h3>
                <p className="text-gray-400 mt-1">Selecione designs prontos recomendados para atrair cliques em suas páginas de vendas.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-[#121827] border border-white/10 rounded-2xl overflow-hidden relative group">
                  <div className="h-48 bg-gradient-to-br from-purple-600 to-indigo-700 p-6 flex flex-col justify-end">
                    <span className="text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded-full self-start mb-2 border border-white/10">PREMIUM</span>
                    <h4 className="text-lg font-bold">Estilo Editorial Moderno</h4>
                  </div>
                  <div className="p-4">
                    <button className="w-full py-2 border border-white/10 rounded-lg text-xs font-semibold hover:bg-white/5 transition-all">Usar Template</button>
                  </div>
                </div>

                <div className="bg-[#121827] border border-white/10 rounded-2xl overflow-hidden relative group">
                  <div className="h-48 bg-gradient-to-br from-amber-500 to-orange-600 p-6 flex flex-col justify-end">
                    <span className="text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded-full self-start mb-2 border border-white/10">PREMIUM</span>
                    <h4 className="text-lg font-bold">Espiritual Fé & Finanças</h4>
                  </div>
                  <div className="p-4">
                    <button className="w-full py-2 border border-white/10 rounded-lg text-xs font-semibold hover:bg-white/5 transition-all">Usar Template</button>
                  </div>
                </div>

                <div className="bg-[#121827] border border-white/10 rounded-2xl overflow-hidden relative group">
                  <div className="h-48 bg-gradient-to-br from-emerald-500 to-teal-600 p-6 flex flex-col justify-end">
                    <span className="text-[10px] font-bold bg-black/40 px-2 py-0.5 rounded-full self-start mb-2 border border-white/10">GRATUITO</span>
                    <h4 className="text-lg font-bold">B2B Tecnologia & Negócios</h4>
                  </div>
                  <div className="p-4">
                    <button className="w-full py-2 border border-white/10 rounded-lg text-xs font-semibold hover:bg-white/5 transition-all">Usar Template</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === "billing" && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h3 className="text-2xl font-bold">Faturamento & Assinaturas</h3>
                <p className="text-gray-400 mt-1">Gerencie os pagamentos e assine planos corporativos premium.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Free plan info */}
                <div className="bg-[#121827] border border-white/10 p-8 rounded-2xl flex flex-col justify-between h-[300px]">
                  <div>
                    <h4 className="text-lg font-bold text-gray-300">Plano Gratuito</h4>
                    <p className="text-xs text-gray-400 mt-2">Plano de testes com direito a criação de até 3 ebooks e recursos básicos.</p>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-3xl font-extrabold">R$ 0</span>
                    <span className="text-xs text-gray-400">/mês</span>
                    {!isPremium && <span className="block text-xs text-emerald-400 mt-2 font-medium">✓ Seu plano atual</span>}
                  </div>
                </div>

                {/* PRO plan info */}
                <div className="bg-[#121827] border border-primary/50 p-8 rounded-2xl flex flex-col justify-between h-[300px] relative shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                  <div className="absolute top-4 right-4 bg-primary/20 text-primary border border-primary/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Melhor Escolha</div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Plano Ilimitado PRO</h4>
                    <p className="text-xs text-gray-400 mt-2">Geração infinita de ebooks com Inteligência Artificial, downloads ilimitados, todas as capas profissionais e suporte prioritário.</p>
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">R$ 97</span>
                    <span className="text-xs text-gray-400">/mês</span>
                    {isPremium ? (
                      <span className="block text-xs text-emerald-400 mt-2 font-medium">✓ Assinatura ativa</span>
                    ) : (
                      <button 
                        onClick={() => router.push("/pricing")}
                        className="w-full py-2.5 bg-gradient-to-r from-primary to-secondary hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all rounded-lg text-xs font-semibold mt-4 cursor-pointer"
                      >
                        Assinar Agora
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="max-w-3xl mx-auto bg-[#121827] border border-white/10 p-8 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Configurações Gerais</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">E-mail de Notificações</label>
                  <input type="text" className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary" defaultValue={user?.email || "seuemail@teste.com"} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Chave de API OpenAI (Opcional)</label>
                  <input type="password" className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary" placeholder="••••••••••••••••••••••••" />
                </div>
                <button 
                  onClick={() => alert("Configurações salvas com sucesso!")}
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary rounded-lg text-xs font-bold hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* AI WIZARD CREATION MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-lg bg-[#121827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            {/* Step 1: Single Prompt */}
            {wizardStep === 1 && (
              <form onSubmit={handleStartGeneration} className="p-6 sm:p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                      <span className="text-xs font-bold text-primary uppercase tracking-widest">IA Automática</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Criar Ebook com IA</h3>
                    <p className="text-sm text-gray-400 mt-1">A IA detecta o nicho, tom, título e escreve tudo sozinha.</p>
                  </div>
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer mt-1">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {errorText && (
                  <div className="bg-red-500/10 border border-red-500/40 text-red-400 text-xs p-3 rounded-xl flex items-center gap-2">
                    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>
                    <span>{errorText}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sobre o que será seu ebook?</label>
                  <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    rows={3}
                    className="w-full bg-[#050810] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition-colors resize-none placeholder-gray-600"
                    placeholder="Ex: como sair das dívidas com fé em Deus, técnicas para emagrecer sem sofrimento, devocional cristão para jovens..."
                    required
                  />
                </div>

                {/* Example Chips */}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">💡 Clique num exemplo para começar:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Devocional cristão para jovens",
                      "Como ganhar dinheiro online",
                      "Ansiedade e paz interior",
                      "Emagrecimento sem sofrimento",
                      "Marketing digital para iniciantes",
                      "Alta performance e disciplina",
                    ].map((ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => setUserPrompt(ex)}
                        className="text-[11px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:bg-primary/20 hover:border-primary/40 hover:text-white transition-all cursor-pointer"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-detect preview */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/5 border border-primary/20 rounded-xl p-4 space-y-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">🤖 O que a IA fará automaticamente:</p>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-gray-300">
                    {["✅ Detectar nicho e audiência", "✅ Criar título de impacto", "✅ Escolher tom de voz ideal", "✅ Escrever 7 capítulos completos", "✅ Introdução persuasiva", "✅ Conclusão + CTA de vendas"].map(item => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-3 border border-white/10 hover:bg-white/5 rounded-xl text-sm font-semibold transition-colors cursor-pointer text-gray-300">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-[2] py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer text-white">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    Gerar Ebook Completo com IA
                  </button>
                </div>
              </form>
            )}

            {/* Step 2: Generation Progress */}
            {wizardStep === 2 && (
              <div className="p-10 text-center flex flex-col items-center justify-center gap-6">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(139,92,246,0.3)] animate-pulse relative">
                  <svg className="w-10 h-10 text-primary animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-1">IA Criando seu Ebook...</h3>
                  <span className="text-sm text-primary font-semibold">{genProgress}%</span>
                </div>

                <div className="w-full bg-[#050810] h-3 rounded-full border border-white/5 overflow-hidden max-w-sm">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out" style={{ width: `${genProgress}%` }} />
                </div>

                <p className="text-sm text-gray-400 font-mono min-h-[24px]">{genStatusText}</p>

                {nicheProfile && (
                  <div className="flex items-center gap-3 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
                    Nicho: {nicheProfile.nicho} · Tom: {nicheProfile.tom}
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      )}



            
      {editingEbook && (
        <PDFPreviewOverlay
          isOpen={isPdfPreviewOpen}
          onClose={() => setIsPdfPreviewOpen(false)}
          ebook={{
            title: editingEbook.title,
            topic: editingEbook.topic,
            category: editingEbook.category,
            tone: editingEbook.tone,
            content: editorText,
          }}
        />
      )}

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        reason={upgradeReason}
      />
    </div>
  );
}
