"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartTrial = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate an elegant loading process before transition
    setTimeout(() => {
      router.push("/register");
    }, 800);
  };

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-sm font-medium text-gray-300">A nova era da criação de conteúdo</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Crie Ebooks Profissionais em <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Segundos com IA
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Transforme suas ideias em produtos digitais de alta conversão. A Inteligência Artificial do EbookForge pesquisa, escreve e formata seu Ebook automaticamente. Estilo Notion e Canva, sem esforço.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={handleStartTrial}
            disabled={isLoading}
            className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-semibold text-lg hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all duration-300 transform hover:-translate-y-1 w-full sm:w-auto text-center flex items-center justify-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-white relative z-10" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="relative z-10">Preparando ambiente...</span>
              </>
            ) : (
              <span className="relative z-10">Começar Teste Grátis</span>
            )}
          </button>
          <Link href="/demo" className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-lg transition-all w-full sm:w-auto flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Ver Demonstração
          </Link>
        </div>

        {/* Abstract App Mockup / Demo */}
        <div className="mt-20 relative mx-auto max-w-5xl animate-float">
          <div className="rounded-2xl border border-white/10 bg-[#121827]/80 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="h-12 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto bg-black/20 text-gray-400 text-xs px-24 py-1 rounded-md border border-white/5 font-mono">
                app.ebookforge.ai
              </div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left h-[400px] md:h-[500px]">
              {/* Sidebar */}
              <div className="col-span-1 border-r border-white/10 pr-6 hidden md:flex flex-col gap-4">
                <div className="h-4 w-24 bg-white/10 rounded"></div>
                <div className="h-3 w-full bg-white/5 rounded mt-4"></div>
                <div className="h-3 w-5/6 bg-white/5 rounded"></div>
                <div className="h-3 w-4/6 bg-white/5 rounded"></div>
                
                <div className="mt-8 h-4 w-32 bg-white/10 rounded"></div>
                <div className="h-10 w-full border border-primary/30 bg-primary/10 rounded-lg flex items-center px-4 mt-2">
                  <div className="h-3 w-20 bg-primary/50 rounded"></div>
                </div>
                <div className="h-10 w-full border border-white/5 bg-white/5 rounded-lg flex items-center px-4">
                  <div className="h-3 w-24 bg-white/20 rounded"></div>
                </div>
              </div>
              {/* Main Content Area */}
              <div className="col-span-1 md:col-span-2 flex flex-col gap-6 pt-4">
                <div className="flex justify-between items-center">
                  <div className="h-6 w-48 bg-white/20 rounded"></div>
                  <div className="h-8 w-24 bg-gradient-to-r from-primary to-secondary rounded-md"></div>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="h-5 w-3/4 bg-white/10 rounded mb-6"></div>
                  <div className="space-y-3">
                    <div className="h-3 w-full bg-white/5 rounded"></div>
                    <div className="h-3 w-full bg-white/5 rounded"></div>
                    <div className="h-3 w-5/6 bg-white/5 rounded"></div>
                    <div className="h-3 w-4/6 bg-white/5 rounded"></div>
                  </div>
                  
                  <div className="mt-8 flex gap-3">
                    <div className="h-32 w-1/3 bg-white/5 rounded-lg border border-white/10 relative overflow-hidden">
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-primary"></div>
                    </div>
                    <div className="h-32 w-1/3 bg-white/5 rounded-lg border border-white/10"></div>
                    <div className="h-32 w-1/3 bg-white/5 rounded-lg border border-white/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
