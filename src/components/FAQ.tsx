"use client";

import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Os ebooks gerados passam em detectores de IA?",
      answer: "Nossa tecnologia utiliza modelos otimizados com técnicas de 'humanização' de texto. O conteúdo gerado soa natural, persuasivo e passa despercebido na maioria dos detectores de IA do mercado."
    },
    {
      question: "Posso editar o conteúdo depois de gerado?",
      answer: "Sim! Você terá acesso a um editor integrado estilo Notion onde poderá alterar textos, adicionar suas próprias imagens e customizar o design antes da exportação final."
    },
    {
      question: "Em quais formatos posso exportar meu Ebook?",
      answer: "Atualmente suportamos exportação em PDF de alta resolução (ideal para Kiwify/Hotmart), ePub (para Amazon Kindle) e link web direto para visualização."
    },
    {
      question: "Tenho direitos autorais sobre os ebooks criados?",
      answer: "Absolutamente. Você tem 100% dos direitos comerciais e de propriedade sobre qualquer conteúdo gerado através da sua conta no EbookForge."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-[#121827] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">Dúvidas Frequentes</h2>
          <p className="text-gray-400">Tudo o que você precisa saber sobre o EbookForge.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#0B0F19] border border-white/10 rounded-xl overflow-hidden transition-all duration-300">
              <button 
                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-lg text-white">{faq.question}</span>
                <span className="text-primary ml-4">
                  <svg className={`w-6 h-6 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
