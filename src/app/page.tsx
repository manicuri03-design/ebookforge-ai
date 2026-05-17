"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStartTrial = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/register");
    }, 800);
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      
      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#0B0F19] to-[#121827]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-primary/20 blur-[150px] -z-10 rounded-full"></div>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Pronto para dominar o mercado de Ebooks?</h2>
          <p className="text-xl text-gray-300 mb-10">Junte-se a milhares de infoprodutores que estão escalando suas vendas com o EbookForge AI.</p>
          <button 
            onClick={handleStartTrial}
            disabled={isLoading}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-white text-gray-900 font-bold text-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            {isLoading ? (
              <>
                <svg className="w-5 h-5 animate-spin text-primary relative z-10" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="relative z-10 text-primary">Carregando...</span>
              </>
            ) : (
              <span className="relative z-10">Criar meu primeiro Ebook Grátis</span>
            )}
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
