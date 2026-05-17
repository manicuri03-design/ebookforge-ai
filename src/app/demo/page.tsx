"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Demo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence animation for the demo
    const timer1 = setTimeout(() => setStep(1), 1500);
    const timer2 = setTimeout(() => setStep(2), 4000);
    const timer3 = setTimeout(() => setStep(3), 7000);
    const timer4 = setTimeout(() => setStep(4), 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#050810] text-white flex flex-col relative overflow-hidden font-sans">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      
      {/* Navbar Minimal */}
      <nav className="h-16 border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 z-50">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            E
          </div>
          <span className="font-bold tracking-tight text-lg">EbookForge <span className="text-gray-400 font-normal">Demo</span></span>
        </Link>
        <Link href="/register" className="text-sm font-medium bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          Criar o Meu Agora
        </Link>
      </nav>

      {/* Main Demo Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 animate-fade-in-up">
        <div className="w-full max-w-5xl bg-[#121827]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[700px]">
          
          {/* Editor Header */}
          <div className="h-14 border-b border-white/10 bg-white/5 flex items-center px-4 gap-4">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="text-sm font-medium text-gray-300">app.ebookforge.ai/editor</div>
          </div>

          {/* Editor Body */}
          <div className="flex-1 flex">
            {/* Sidebar Flow */}
            <div className="w-64 border-r border-white/10 bg-[#0B0F19]/50 p-4 hidden md:flex flex-col gap-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Progresso da IA</h3>
              
              <div className="space-y-4 relative">
                <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-white/10"></div>
                
                <div className={`flex gap-3 relative z-10 transition-all duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step > 0 ? 'bg-primary text-white' : 'bg-primary/20 text-primary border border-primary/50'}`}>
                    {step > 0 ? '✓' : '1'}
                  </div>
                  <div className="text-sm pt-0.5">Prompt</div>
                </div>

                <div className={`flex gap-3 relative z-10 transition-all duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step > 1 ? 'bg-primary text-white' : step === 1 ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-white/10 text-gray-500'}`}>
                    {step > 1 ? '✓' : '2'}
                  </div>
                  <div className="text-sm pt-0.5">Pesquisa</div>
                </div>

                <div className={`flex gap-3 relative z-10 transition-all duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step > 2 ? 'bg-primary text-white' : step === 2 ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-white/10 text-gray-500'}`}>
                    {step > 2 ? '✓' : '3'}
                  </div>
                  <div className="text-sm pt-0.5">Escrita</div>
                </div>

                <div className={`flex gap-3 relative z-10 transition-all duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step > 3 ? 'bg-primary text-white' : step === 3 ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-white/10 text-gray-500'}`}>
                    {step > 3 ? '✓' : '4'}
                  </div>
                  <div className="text-sm pt-0.5">Design</div>
                </div>
              </div>
            </div>

            {/* Main Interactive Area */}
            <div className="flex-1 p-8 relative overflow-hidden flex flex-col justify-center items-center">
              {step === 0 && (
                <div className="w-full max-w-xl animate-fade-in-up">
                  <div className="bg-primary/20 border border-primary/30 p-4 rounded-2xl rounded-br-sm text-white text-lg ml-auto w-3/4 mb-6 shadow-lg">
                    Crie um ebook premium sobre &ldquo;Inteligência Artificial para Negócios&rdquo;. Formato Notion.
                  </div>
                  <div className="flex gap-3 items-center text-gray-400">
                    <svg className="w-5 h-5 animate-spin text-primary" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>IA analisando o prompt...</span>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="w-full max-w-xl animate-fade-in-up">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl w-full">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-secondary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      Pesquisando referências...
                    </h2>
                    <div className="space-y-3 opacity-70">
                      <div className="h-2 w-full bg-white/10 rounded overflow-hidden">
                        <div className="h-full bg-secondary w-1/3 animate-[pulse_1s_ease-in-out_infinite]"></div>
                      </div>
                      <p className="text-sm font-mono text-gray-400">Extraindo dados de 14.502 fontes verificadas</p>
                      <p className="text-sm font-mono text-gray-400">Analisando tendências de mercado SaaS B2B</p>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="w-full max-w-2xl animate-fade-in-up">
                   <div className="bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl w-full">
                    <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                      Escrevendo Capítulos...
                    </h2>
                    <div className="space-y-4">
                      <div className="h-4 w-3/4 bg-white/20 rounded animate-pulse"></div>
                      <div className="h-4 w-full bg-white/10 rounded animate-pulse" style={{ animationDelay: '100ms' }}></div>
                      <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" style={{ animationDelay: '200ms' }}></div>
                      <div className="h-4 w-full bg-white/10 rounded animate-pulse" style={{ animationDelay: '300ms' }}></div>
                      <div className="h-4 w-4/6 bg-white/10 rounded animate-pulse" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {step >= 3 && (
                <div className="w-full max-w-3xl animate-fade-in-up h-full flex flex-col">
                  <div className="flex-1 bg-white text-gray-900 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] flex flex-col relative group">
                    <div className="h-48 bg-gradient-to-br from-indigo-900 to-slate-800 relative">
                      <div className="absolute -bottom-10 left-8 w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center font-bold text-3xl text-primary border-4 border-white">
                        AI
                      </div>
                    </div>
                    <div className="px-8 pt-16 pb-8 flex-1">
                      <h1 className="text-4xl font-extrabold mb-4 font-serif">A Nova Era da IA nos Negócios</h1>
                      <p className="text-xl text-gray-500 mb-8 font-serif">Como escalar a sua empresa utilizando modelos generativos em 2026.</p>
                      
                      <div className="space-y-4 font-serif text-gray-700 leading-relaxed">
                        <p>A revolução da inteligência artificial não é mais uma promessa distante, mas uma realidade operando nos bastidores das empresas mais lucrativas do mundo. Este guia definitivo revela as estratégias ocultas...</p>
                      </div>
                    </div>
                    {step === 4 && (
                       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-fade-in">
                          <div className="bg-white p-6 rounded-2xl shadow-2xl text-center transform scale-110">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Ebook Finalizado!</h3>
                            <p className="text-gray-500 mb-6">Tempo de criação: 12 segundos.</p>
                            <Link href="/register" className="block w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-1">
                              Quero fazer o meu agora
                            </Link>
                          </div>
                       </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
