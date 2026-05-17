"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: "ebooks" | "assists" | "templates" | "pdf" | "custom";
  customMessage?: string;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  reason = "custom",
  customMessage,
}) => {
  const { upgradePlan } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<"kiwify" | "stripe" | "mercadopago">("kiwify");
  const [step, setStep] = useState<"info" | "checkout" | "success">("info");

  if (!isOpen) return null;

  const getReasonDetails = () => {
    switch (reason) {
      case "ebooks":
        return {
          title: "Limite de Ebooks Atingido!",
          desc: "Você atingiu o limite de 3 ebooks no Plano Gratuito. Infoprodutores Pro faturam alto vendendo múltiplos títulos!",
        };
      case "assists":
        return {
          title: "Aprimoramentos de IA Esgotados!",
          desc: "Você atingiu o limite de 5 interações com o Assistente de IA. Libere inteligência ilimitada para escrever capítulos profundos!",
        };
      case "templates":
        return {
          title: "Template Premium Bloqueado!",
          desc: "Estilos como Editorial Clássico, Dark Premium e Clean Minimalista são de uso exclusivo para infoprodutos Pro.",
        };
      case "pdf":
        return {
          title: "Exportação Comercial PDF Bloqueada!",
          desc: "Downloads de PDFs profissionais de alta definição formatados e com paginação automática são recursos Pro.",
        };
      case "custom":
      default:
        return {
          title: "Faça Upgrade para o Pro!",
          desc: customMessage || "Desbloqueie todo o poder da inteligência artificial aplicada à geração de ebooks lucrativos.",
        };
    }
  };

  const { title, desc } = getReasonDetails();

  const handleUpgrade = async (planType: "premium_monthly" | "premium_yearly") => {
    setIsProcessing(true);
    // Simulate real gateway processing delay
    setTimeout(async () => {
      try {
        await upgradePlan(planType);
        setStep("success");
      } catch (err) {
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div className="bg-[#0B0F19] border border-amber-500/20 rounded-3xl w-full max-w-xl overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.15)] relative">
        
        {/* Decorative Golden Blur Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-gradient-to-b from-amber-500/10 to-transparent blur-2xl -z-10 rounded-full" />

        {/* Header toolbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0D1222]/80">
          <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1.5">
            <svg className="w-4 h-4 text-amber-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            Desbloqueie o Pro
          </span>
          {step !== "success" && (
            <button 
              disabled={isProcessing}
              onClick={onClose}
              className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* STEP 1: Main Info Panel */}
        {step === "info" && (
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Warning Message Card */}
            <div className="bg-[#121827] border border-amber-500/10 p-5 rounded-2xl flex gap-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center shrink-0 border border-amber-500/20">
                <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-white mb-1">{title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{desc}</p>
              </div>
            </div>

            {/* Benefits Matrix */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Vantagens Exclusivas da Conta Premium:</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-200">
                  <span className="text-amber-500">✓</span>
                  <span>Ebooks Ilimitados (Pro)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-200">
                  <span className="text-amber-500">✓</span>
                  <span>Assistente IA Sem Limites</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-200">
                  <span className="text-amber-500">✓</span>
                  <span>Exportações PDF HD A4</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-200">
                  <span className="text-amber-500">✓</span>
                  <span>Todos os 4 Templates de Luxo</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-200 col-span-1 sm:col-span-2">
                  <span className="text-amber-500">✓</span>
                  <span>Prioridade Máxima em Processamentos de IA</span>
                </div>
              </div>
            </div>

            {/* Plan CTAs */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <button 
                onClick={() => setStep("checkout")}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-bold text-sm text-black flex items-center justify-between transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.35)] cursor-pointer"
              >
                <span>Quero Acesso Pro Mensal</span>
                <span className="text-xs font-black">R$ 47 / mês ➔</span>
              </button>

              <button 
                onClick={() => setStep("checkout")}
                className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-gray-100 font-bold text-sm text-gray-900 flex items-center justify-between transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute top-0 right-10 bg-rose-500 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-bl shadow-md">
                  Economize 45%
                </div>
                <span>Quero Acesso Pro Anual</span>
                <span className="text-xs font-black">R$ 297 / ano ➔</span>
              </button>
            </div>

            <p className="text-[10px] text-gray-400 text-center leading-normal">
              Garantia de 7 dias incondicional. Cancele com um clique quando quiser.
            </p>

          </div>
        )}

        {/* STEP 2: Checkout Simulation Center */}
        {step === "checkout" && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-2">Selecione a Forma de Pagamento</h3>
              <p className="text-xs text-gray-400">Prepare-se para vender ebooks de alto valor. Escolha a sua integração de checkout:</p>
            </div>

            {/* Gateway Toggle */}
            <div className="grid grid-cols-3 gap-3">
              
              {/* Kiwify */}
              <button
                disabled={isProcessing}
                onClick={() => setSelectedGateway("kiwify")}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${selectedGateway === "kiwify" ? "bg-[#1E1B4B]/30 border-purple-500 text-purple-300" : "bg-[#121827] border-white/5 text-gray-400 hover:border-white/10"}`}
              >
                <span className="text-xs font-extrabold block uppercase tracking-widest">Kiwify</span>
                <span className="text-[8px] opacity-75">Simular checkout</span>
              </button>

              {/* Stripe */}
              <button
                disabled={isProcessing}
                onClick={() => setSelectedGateway("stripe")}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${selectedGateway === "stripe" ? "bg-[#0A1F30]/30 border-blue-500 text-blue-300" : "bg-[#121827] border-white/5 text-gray-400 hover:border-white/10"}`}
              >
                <span className="text-xs font-extrabold block uppercase tracking-widest">Stripe</span>
                <span className="text-[8px] opacity-75">Simular checkout</span>
              </button>

              {/* Mercado Pago */}
              <button
                disabled={isProcessing}
                onClick={() => setSelectedGateway("mercadopago")}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${selectedGateway === "mercadopago" ? "bg-[#0B3A2C]/30 border-emerald-500 text-emerald-300" : "bg-[#121827] border-white/5 text-gray-400 hover:border-white/10"}`}
              >
                <span className="text-xs font-extrabold block uppercase tracking-widest">M. Pago</span>
                <span className="text-[8px] opacity-75">Simular checkout</span>
              </button>

            </div>

            {/* Gateway Visualizer Box */}
            <div className="bg-[#121827] p-5 rounded-2xl border border-white/5 text-center space-y-4">
              {isProcessing ? (
                <div className="py-6 space-y-3 flex flex-col items-center justify-center">
                  <svg className="animate-spin h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <div>
                    <span className="text-xs font-bold text-white block">Conectando ao gateway de pagamento...</span>
                    <span className="text-[10px] text-gray-400">Processando autorização segura com {selectedGateway === "kiwify" ? "Kiwify API" : selectedGateway === "stripe" ? "Stripe Checkout" : "Mercado Pago Web"}</span>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-3">
                  <span className="text-xs text-gray-300 block">
                    Você será redirecionado para a simulação de pagamento seguro via <span className="capitalize font-bold text-white">{selectedGateway}</span>.
                  </span>
                  <div className="flex justify-center gap-6 text-[10px] text-gray-400">
                    <span>🔐 SSL Criptografado</span>
                    <span>🛡️ Transação Segura</span>
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Action Trigger */}
            {!isProcessing && (
              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setStep("info")}
                  className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-xs text-white transition-all cursor-pointer text-center"
                >
                  Voltar
                </button>
                <button
                  onClick={() => handleUpgrade("premium_yearly")}
                  className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-bold text-xs text-black transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer text-center"
                >
                  Confirmar Pagamento Simulado
                </button>
              </div>
            )}

          </div>
        )}

        {/* STEP 3: Success Panel */}
        {step === "success" && (
          <div className="p-10 text-center flex flex-col items-center justify-center gap-6 animate-fade-in-up">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-emerald-500/20">
              <svg className="w-8 h-8 text-emerald-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Parabéns! Você agora é PRO!</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                Seu plano foi atualizado com sucesso instantâneo. Todas as limitações de geração, IA e PDF A4 foram removidas da sua conta!
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-bold text-xs hover:scale-105 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all cursor-pointer text-white"
            >
              Começar a Criar sem Limites!
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
