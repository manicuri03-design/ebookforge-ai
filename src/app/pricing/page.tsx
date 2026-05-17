"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Pricing() {
  const { user, upgradePlan } = useAuth();
  const router = useRouter();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const [selectedGateway, setSelectedGateway] = useState<"stripe" | "kiwify" | "mercadopago" | null>(null);
  const [activePlanSelection, setActivePlanSelection] = useState<"monthly" | "yearly" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsClient(true);
    }, 0);
  }, []);

  if (!isClient) return null;

  const handleSelectPlan = (period: "monthly" | "yearly") => {
    if (!user) {
      router.push("/register");
      return;
    }
    setActivePlanSelection(period);
    setSelectedGateway("kiwify"); // Default to Kiwify
  };

  const handleConfirmCheckout = () => {
    if (!activePlanSelection) return;
    setIsProcessing(true);

    setTimeout(async () => {
      try {
        const planToUpgrade = activePlanSelection === "yearly" ? "premium_yearly" : "premium_monthly";
        await upgradePlan(planToUpgrade);
        setIsProcessing(false);
        setActivePlanSelection(null);
        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        setIsProcessing(false);
      }
    }, 2000);
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#050810] text-white">
      <Navbar />

      {/* Pricing Hero */}
      <section className="py-24 relative overflow-hidden text-center">
        {/* Glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-primary/10 blur-[130px] rounded-full -z-10" />

        <div className="max-w-4xl mx-auto px-4">
          <span className="px-4 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-xs font-bold uppercase tracking-wider inline-block mb-4 animate-pulse">
            ✨ Planos & Precificação SaaS
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
            Acelere sua Criação de Ebooks
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Seja um criador profissional de ebooks. Escolha o plano perfeito para o tamanho do seu negócio e comece a vender infoprodutos luxuosos.
          </p>

          {/* Toggle Period */}
          <div className="inline-flex items-center gap-3 p-1.5 bg-[#0D1222] border border-white/5 rounded-2xl">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${billingPeriod === "monthly" ? "bg-white/5 text-white" : "text-gray-400 hover:text-white"}`}
            >
              Faturamento Mensal
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${billingPeriod === "yearly" ? "bg-gradient-to-r from-primary to-secondary text-white" : "text-gray-400 hover:text-white"}`}
            >
              Faturamento Anual
              <span className="bg-rose-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full animate-bounce">
                -45% OFF
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Subscription Cards Grid */}
      <section className="pb-24 max-w-6xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* 1. FREE PLAN */}
          <div className="bg-[#0B0F19] border border-white/5 rounded-3xl p-8 flex flex-col justify-between hover:border-white/10 transition-all hover:translate-y-[-4px]">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-300">Plano Gratuito</h3>
                  <p className="text-xs text-gray-400 mt-1">Para experimentação básica</p>
                </div>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-400 uppercase">Gratis</span>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-black text-white">R$ 0</span>
                <span className="text-xs text-gray-400 font-medium"> / sempre</span>
              </div>

              <div className="w-full h-px bg-white/5 mb-8" />

              <ul className="space-y-4 mb-10 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Até 3 Ebooks Gerados por IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Até 5 Usos do Assistente de IA</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Apenas Template Visual Moderno</span>
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <span className="text-gray-600 font-bold">✗</span>
                  <span>Sem Downloads PDF HD A4</span>
                </li>
                <li className="flex items-center gap-2 opacity-50">
                  <span className="text-gray-600 font-bold">✗</span>
                  <span>Sem Capas Premium Luxo</span>
                </li>
              </ul>
            </div>

            <Link
              href={user ? "/dashboard" : "/register"}
              className="w-full py-3.5 px-6 rounded-xl border border-white/10 hover:bg-white/5 text-center font-bold text-xs text-white transition-all"
            >
              Começar Agora
            </Link>
          </div>

          {/* 2. PRO MONTHLY (MAIS VENDIDO) */}
          <div className="bg-[#0D1222] border-2 border-primary rounded-3xl p-8 flex flex-col justify-between relative shadow-[0_0_35px_rgba(139,92,246,0.15)] hover:translate-y-[-4px] transition-all">
            <span className="absolute top-0 right-10 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              🔥 Mais Popular
            </span>
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Pro Mensal</h3>
                  <p className="text-xs text-gray-400 mt-1">Acesso Pro flexível e recorrente</p>
                </div>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-black text-white">R$ 47</span>
                <span className="text-xs text-gray-400 font-medium"> / mês</span>
              </div>

              <div className="w-full h-px bg-white/5 mb-8" />

              <ul className="space-y-4 mb-10 text-xs text-gray-200">
                <li className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span className="font-semibold text-white">Criação Ilimitada de Ebooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Assistente IA Inline Ilimitado</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Todos os 4 Templates de Luxo</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span className="font-semibold text-white">Exportação Comercial PDF HD A4</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Capa Editorial de Luxo Automática</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span>Fila Prioritária de Geração IA</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan("monthly")}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-center font-bold text-xs text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.25)] cursor-pointer"
            >
              Fazer Upgrade Pro
            </button>
          </div>

          {/* 3. PRO ANUAL (MELHOR ECONOMIA) */}
          <div className="bg-[#0B0F19] border border-amber-500/20 rounded-3xl p-8 flex flex-col justify-between hover:border-amber-500/30 transition-all hover:translate-y-[-4px] relative shadow-[0_0_25px_rgba(245,158,11,0.05)]">
            <span className="absolute top-0 right-10 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
              💎 Melhor Valor
            </span>
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-amber-500">Pro Anual</h3>
                  <p className="text-xs text-gray-400 mt-1">45% de economia garantida</p>
                </div>
              </div>

              <div className="mb-8">
                {billingPeriod === "yearly" ? (
                  <>
                    <span className="text-4xl font-black text-white">R$ 297</span>
                    <span className="text-xs text-gray-400 font-medium"> / ano</span>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-1">Equivale a apenas R$ 24,75 / mês</p>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-black text-white">R$ 24,75</span>
                    <span className="text-xs text-gray-400 font-medium"> / mês</span>
                    <p className="text-[10px] text-gray-400 mt-1">Faturado R$ 297 anualmente</p>
                  </>
                )}
              </div>

              <div className="w-full h-px bg-white/5 mb-8" />

              <ul className="space-y-4 mb-10 text-xs text-gray-200">
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span className="font-semibold text-white">Criação Ilimitada de Ebooks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Assistente IA Inline Ilimitado</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Todos os 4 Templates de Luxo</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span className="font-semibold text-white">Exportação Comercial PDF HD A4</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span className="text-emerald-400 font-bold">Economia Real de 45%</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-500 font-bold">✓</span>
                  <span>Suporte VIP Prioritário WhatsApp</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleSelectPlan("yearly")}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-center font-bold text-xs text-black transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer"
            >
              Garantir Plano Anual
            </button>
          </div>

        </div>
      </section>

      {/* Pricing Comparison Matrix */}
      <section className="py-16 bg-[#080C14] border-y border-white/5 w-full">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-10 text-center">Comparação Detalhada de Recursos</h2>
          
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#0B0F19]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-gray-300 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-4 sm:p-5">Funcionalidade</th>
                  <th className="p-4 sm:p-5">Gratuito</th>
                  <th className="p-4 sm:p-5">Pro Mensal</th>
                  <th className="p-4 sm:p-5">Pro Anual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Volume de Ebooks por Mês</td>
                  <td className="p-4 sm:p-5 text-gray-400">Até 3</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold">Ilimitado</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold">Ilimitado</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Tamanho dos Ebooks</td>
                  <td className="p-4 sm:p-5 text-gray-400">Até 3 Capítulos</td>
                  <td className="p-4 sm:p-5 text-emerald-400">Até 12 Capítulos</td>
                  <td className="p-4 sm:p-5 text-emerald-400">Até 12 Capítulos</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Assistente Inline IA</td>
                  <td className="p-4 sm:p-5 text-gray-400">5 Usos</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold">Ilimitado</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold">Ilimitado</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Modelos de Layout PDF</td>
                  <td className="p-4 sm:p-5 text-gray-400">1 (Moderno)</td>
                  <td className="p-4 sm:p-5">Todos os 4</td>
                  <td className="p-4 sm:p-5">Todos os 4</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Exportação PDF A4 HD</td>
                  <td className="p-4 sm:p-5 text-gray-500">✗</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold">✓</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold">✓</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Garantia Reembolso</td>
                  <td className="p-4 sm:p-5 text-gray-400">Sem Custo</td>
                  <td className="p-4 sm:p-5">7 Dias</td>
                  <td className="p-4 sm:p-5">7 Dias</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold">Suporte WhatsApp</td>
                  <td className="p-4 sm:p-5 text-gray-500">✗</td>
                  <td className="p-4 sm:p-5 text-gray-400">E-mail básico</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-bold">VIP WhatsApp 24/7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Billing FAQ */}
      <section className="py-24 max-w-4xl mx-auto px-4 w-full">
        <h2 className="text-3xl font-bold mb-12 text-center">Perguntas Frequentes Sobre Faturamento</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-gray-400">
          <div>
            <h4 className="text-sm font-bold text-white mb-2">Como funciona a garantia de 7 dias?</h4>
            <p className="leading-relaxed">
              Caso você assine e sinta que a ferramenta não é para você, basta solicitar o reembolso na plataforma de pagamento que devolvemos 100% do seu dinheiro, sem burocracias.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-2">Posso fazer upload dos PDFs na Kiwify?</h4>
            <p className="leading-relaxed">
              Sim! Nossos PDFs de luxo são totalmente compatíveis e seguem todas as diretrizes da Kiwify, Hotmart, Eduzz e Monetizze. Eles estão prontos para ser empacotados como infoprodutos premium.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-2">Posso cancelar minha assinatura mensal quando quiser?</h4>
            <p className="leading-relaxed">
              Com certeza! A assinatura não possui contratos de fidelidade. Você pode cancelar a renovação automática a qualquer momento com apenas um clique dentro das configurações de faturamento do seu painel.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-2">Quais gateways de pagamento são simulados?</h4>
            <p className="leading-relaxed">
              Nossa infraestrutura está 100% pronta para integrações com Stripe Checkout, Kiwify SDK e APIs do Mercado Pago. Na simulação de dev, você pode escolher qualquer gateway e testar o fluxo instantaneamente!
            </p>
          </div>
        </div>
      </section>

      {/* CHECKOUT OVERLAY MODAL */}
      {activePlanSelection && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="bg-[#0B0F19] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0D1222]/80">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                💳 Gateway de Checkout SaaS
              </span>
              <button 
                disabled={isProcessing}
                onClick={() => setActivePlanSelection(null)}
                className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-white mb-1">Selecione o Checkout de Integração</h3>
                <p className="text-xs text-gray-400">
                  Faturamento: Plano <span className="capitalize font-bold text-amber-500">{activePlanSelection === "yearly" ? "Pro Anual" : "Pro Mensal"}</span> ({activePlanSelection === "yearly" ? "R$ 297/ano" : "R$ 47/mês"})
                </p>
              </div>

              {/* Gateway Toggles */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  disabled={isProcessing}
                  onClick={() => setSelectedGateway("kiwify")}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${selectedGateway === "kiwify" ? "bg-[#1E1B4B]/30 border-purple-500 text-purple-300" : "bg-[#121827] border-white/5 text-gray-400 hover:border-white/10"}`}
                >
                  <span className="text-xs font-extrabold block uppercase tracking-widest">Kiwify</span>
                  <span className="text-[8px] opacity-75">Proposta Real</span>
                </button>
                <button
                  disabled={isProcessing}
                  onClick={() => setSelectedGateway("stripe")}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${selectedGateway === "stripe" ? "bg-[#0A1F30]/30 border-blue-500 text-blue-300" : "bg-[#121827] border-white/5 text-gray-400 hover:border-white/10"}`}
                >
                  <span className="text-xs font-extrabold block uppercase tracking-widest">Stripe</span>
                  <span className="text-[8px] opacity-75">Checkout API</span>
                </button>
                <button
                  disabled={isProcessing}
                  onClick={() => setSelectedGateway("mercadopago")}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${selectedGateway === "mercadopago" ? "bg-[#0B3A2C]/30 border-emerald-500 text-emerald-300" : "bg-[#121827] border-white/5 text-gray-400 hover:border-white/10"}`}
                >
                  <span className="text-xs font-extrabold block uppercase tracking-widest">M. Pago</span>
                  <span className="text-[8px] opacity-75">SDK Integrado</span>
                </button>
              </div>

              {/* Checkout Status Box */}
              <div className="bg-[#121827] p-5 rounded-2xl border border-white/5 text-center">
                {isProcessing ? (
                  <div className="py-6 flex flex-col items-center justify-center gap-3">
                    <svg className="animate-spin h-7 w-7 text-amber-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <div>
                      <span className="text-xs font-bold text-white block">Autorizando transação no sandbox...</span>
                      <span className="text-[10px] text-gray-400">Verificando tokens e creditando privilégios Pro...</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <span className="text-xs text-gray-300">
                      Clique abaixo para simular o recebimento do Webhook e ativar sua assinatura Pro automaticamente no banco de dados.
                    </span>
                  </div>
                )}
              </div>

              {/* Checkout CTA */}
              {!isProcessing && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setActivePlanSelection(null)}
                    className="flex-1 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 font-semibold text-xs text-white transition-all cursor-pointer text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmCheckout}
                    className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 font-bold text-xs text-black transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] cursor-pointer text-center"
                  >
                    Simular Assinatura Completa
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
