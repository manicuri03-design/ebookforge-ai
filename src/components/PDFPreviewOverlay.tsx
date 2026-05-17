"use client";

import React, { useState, useEffect } from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { PDFEbookDocument } from "./PDFEbookDocument";
import { useAuth } from "@/context/AuthContext";
import { UpgradeModal } from "./UpgradeModal";

interface PDFPreviewOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  ebook: {
    title: string;
    topic: string;
    category: string;
    tone: string;
    content: string;
  };
}

export const PDFPreviewOverlay: React.FC<PDFPreviewOverlayProps> = ({
  isOpen,
  onClose,
  ebook,
}) => {
  const { user } = useAuth();
  const isPremium = user?.plan === "premium_monthly" || user?.plan === "premium_yearly";
  const [selectedTemplate, setSelectedTemplate] = useState<"modern" | "classic" | "dark" | "clean">("modern");
  const [isClient, setIsClient] = useState(false);
  const [loadingText, setLoadingText] = useState("Inicializando gerador de PDF...");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"ebooks" | "assists" | "templates" | "pdf" | "custom">("custom");

  const handleTemplateChange = (tpl: "modern" | "classic" | "dark" | "clean") => {
    if (!isPremium && tpl !== "modern") {
      setUpgradeReason("templates");
      setIsUpgradeModalOpen(true);
      return;
    }
    setSelectedTemplate(tpl);
  };

  // Sync client-side mounting to avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsClient(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Dynamic cycling loader status messages
  useEffect(() => {
    if (!isOpen) return;

    const messages = [
      "Processando estrutura em Markdown...",
      "Aplicando estilos tipográficos...",
      "Estruturando sumário automático...",
      "Ajustando divisores de página...",
      "Compilando layout premium final..."
    ];
    let msgIdx = 0;

    const timer = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingText(messages[msgIdx]);
    }, 1500);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !isClient) return null;

  // Derive beautiful visual cover gradients based on active template to show on cover previews
  const getTemplateGradient = (tpl: string) => {
    switch (tpl) {
      case "classic":
        return "from-[#1E3A8A] to-[#0D1B3E] border-amber-500/20";
      case "dark":
        return "from-[#111827] via-[#1F2937] to-[#0A0F1D] border-amber-500/40";
      case "clean":
        return "from-white to-[#E5E7EB] border-black/10 text-black";
      case "modern":
      default:
        return "from-[#8B5CF6] via-[#6366F1] to-[#4F46E5] border-primary/20";
    }
  };

  const getTemplateBadgeStyle = (tpl: string) => {
    switch (tpl) {
      case "classic":
        return "bg-amber-500/20 text-amber-300";
      case "dark":
        return "bg-[#D97706]/20 text-[#FBBF24]";
      case "clean":
        return "bg-black/10 text-black";
      case "modern":
      default:
        return "bg-primary/20 text-primary-light";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-[#0B0F19] border border-white/10 rounded-3xl w-full max-w-6xl h-[90vh] md:h-[85vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0D1222]/80">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 10v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Exportar Ebook PDF Premium
            </h3>
            <p className="text-xs text-gray-400">Personalize o design do produto para download comercial</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-xl transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Workspace Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* LEFT PANEL: Control Center (Template Selection & Actions) */}
          <div className="w-full md:w-[350px] border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col justify-between overflow-y-auto bg-[#080C14]">
            <div className="space-y-6">
              
              {/* Info Card */}
              <div className="bg-[#121827] border border-white/5 p-4 rounded-2xl">
                <span className="text-[9px] uppercase tracking-wider font-bold text-amber-500 block mb-1">Status do Ebook</span>
                <h4 className="text-sm font-semibold text-white truncate">{ebook.title}</h4>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-400">Categoria: <span className="capitalize text-gray-200">{ebook.category}</span></span>
                  <span className="text-xs text-gray-400">Tom: <span className="text-gray-200">{ebook.tone}</span></span>
                </div>
              </div>

              {/* Template Selectors */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Escolha o Template Visual</label>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Modern SaaS */}
                  <button 
                    onClick={() => handleTemplateChange("modern")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer group ${selectedTemplate === "modern" ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(139,92,246,0.2)]" : "bg-[#121827] border-white/5 hover:border-white/10"}`}
                  >
                    <div className="w-full h-12 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-700 mb-2 flex items-center justify-center text-white/20 text-xs font-bold shadow-inner">
                      SaaS
                    </div>
                    <span className="text-xs font-bold text-white block">Moderno SaaS</span>
                    <span className="text-[10px] text-gray-400">Roxo vibrante & clean</span>
                  </button>

                  {/* Editorial Classic */}
                  <button 
                    onClick={() => handleTemplateChange("classic")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer group ${selectedTemplate === "classic" ? "bg-[#1E3A8A]/10 border-[#1E3A8A] shadow-[0_0_15px_rgba(30,58,138,0.2)]" : "bg-[#121827] border-white/5 hover:border-white/10"}`}
                  >
                    <div className="w-full h-12 rounded-lg bg-gradient-to-br from-[#1E3A8A] to-[#0D1B3E] mb-2 flex items-center justify-center text-white/20 text-xs font-bold shadow-inner">
                      Classic
                    </div>
                    <span className="text-xs font-bold text-white block">Editorial Clássico</span>
                    <span className="text-[10px] text-gray-400">Sério, serifado & nobre</span>
                  </button>

                  {/* Dark Premium */}
                  <button 
                    onClick={() => handleTemplateChange("dark")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer group ${selectedTemplate === "dark" ? "bg-amber-500/10 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : "bg-[#121827] border-white/5 hover:border-white/10"}`}
                  >
                    <div className="w-full h-12 rounded-lg bg-gradient-to-br from-gray-900 via-gray-800 to-black mb-2 flex items-center justify-center text-amber-500/20 text-xs font-bold shadow-inner border border-amber-500/10">
                      Dark
                    </div>
                    <span className="text-xs font-bold text-white block">Dark Premium</span>
                    <span className="text-[10px] text-gray-400">Cinza & Ouro luxo</span>
                  </button>

                  {/* Clean Minimalist */}
                  <button 
                    onClick={() => handleTemplateChange("clean")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer group ${selectedTemplate === "clean" ? "bg-white/5 border-white/40" : "bg-[#121827] border-white/5 hover:border-white/10"}`}
                  >
                    <div className="w-full h-12 rounded-lg bg-gradient-to-br from-white to-gray-200 mb-2 flex items-center justify-center text-black/10 text-xs font-bold shadow-inner">
                      Clean
                    </div>
                    <span className="text-xs font-bold text-white block">Minimalista Clean</span>
                    <span className="text-[10px] text-gray-400">Alto contraste P&B</span>
                  </button>

                </div>
              </div>

            </div>

            {/* Live Asynchronous Download Compiler Hub */}
            <div className="pt-6 border-t border-white/5 mt-6 space-y-4">
              {!isPremium ? (
                <button
                  onClick={() => {
                    setUpgradeReason("pdf");
                    setIsUpgradeModalOpen(true);
                  }}
                  className="w-full py-4 px-6 rounded-2xl font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] transition-all flex items-center justify-center gap-3 text-sm cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download PDF Comercial
                </button>
              ) : (
                <PDFDownloadLink
                  document={
                    <PDFEbookDocument
                      title={ebook.title}
                      subtitle={`Como dominar os pilares de ${ebook.topic} com maestria`}
                      topic={ebook.topic}
                      category={ebook.category}
                      tone={ebook.tone}
                      content={ebook.content}
                      template={selectedTemplate}
                    />
                  }
                  fileName={`${ebook.title.toLowerCase().replace(/\s+/g, "-")}.pdf`}
                >
                  {({ loading }) => (
                    <button
                      disabled={loading}
                      className={`w-full py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 text-sm cursor-pointer ${
                        loading
                          ? "bg-white/5 border border-white/10 text-gray-400"
                          : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black hover:shadow-[0_0_25px_rgba(245,158,11,0.45)]"
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span className="text-xs text-left leading-tight truncate">
                            {loadingText}
                          </span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Download PDF Comercial
                        </>
                      )}
                    </button>
                  )}
                </PDFDownloadLink>
              )}

              <p className="text-[10px] text-center text-gray-400 leading-normal">
                PDF certificado pronto para upload em plataformas de checkout como Kiwify, Hotmart e Monetizze.
              </p>
            </div>

          </div>

          {/* RIGHT PANEL: Live Visual Preview Canvas */}
          <div className="flex-1 p-6 flex flex-col justify-center items-center bg-[#090C15] overflow-y-auto">
            
            {/* Live PDF Viewer (Visible on desktop screens, hidden on mobile for extreme performance optimization) */}
            <div className="w-full h-full hidden md:flex flex-col">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                Visualização de Alta Resolução (Pré-visualização)
              </span>
              <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 bg-[#121827] shadow-inner">
                <PDFViewer
                  showToolbar={true}
                  style={{ width: "100%", height: "100%", border: "none" }}
                >
                  <PDFEbookDocument
                    title={ebook.title}
                    subtitle={`Como dominar os pilares de ${ebook.topic} com maestria`}
                    topic={ebook.topic}
                    category={ebook.category}
                    tone={ebook.tone}
                    content={ebook.content}
                    template={selectedTemplate}
                  />
                </PDFViewer>
              </div>
            </div>

            {/* Mobile Cover Art Preview (Displays as lightweight mockup on mobile devices) */}
            <div className="md:hidden w-full max-w-[280px] p-4 bg-[#121827] border border-white/10 rounded-3xl text-center space-y-4">
              <div className={`aspect-[3/4] w-full rounded-2xl bg-gradient-to-br p-6 text-left flex flex-col justify-between border ${getTemplateGradient(selectedTemplate)}`}>
                <div className="space-y-1">
                  <span className="text-[7px] uppercase tracking-widest font-bold text-white/50">{ebook.category}</span>
                  <div className={`self-start inline-block px-1.5 py-0.5 rounded text-[6px] font-bold ${getTemplateBadgeStyle(selectedTemplate)}`}>PREMIUM</div>
                </div>
                <div>
                  <div className="w-6 h-0.5 bg-white/40 mb-2"></div>
                  <h4 className="text-sm font-black text-white leading-tight mb-1">{ebook.title}</h4>
                  <p className="text-[8px] text-white/70 line-clamp-2">Como dominar os pilares de {ebook.topic} com maestria</p>
                </div>
                <div className="flex justify-between items-center border-t border-white/10 pt-2 text-[6px] text-white/40">
                  <span>EBOOKFORGE AI</span>
                  <span>PREMIUM EDITORIAL</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Layout Otimizado</span>
                <p className="text-[10px] text-gray-400 leading-relaxed mt-1">
                  O preview interativo ao vivo está disponível em computadores. Clique no botão de download acima para salvar e visualizar o seu Ebook comercial!
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        reason={upgradeReason}
      />
    </div>
  );
};
