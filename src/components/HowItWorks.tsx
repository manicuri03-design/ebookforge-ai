export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Digite o seu tema",
      description: "Diga para a IA qual é o assunto do seu Ebook e qual o seu público-alvo. Exemplo: 'Um guia de finanças para iniciantes'.",
    },
    {
      step: "02",
      title: "IA gera o conteúdo",
      description: "Nossos modelos avançados pesquisam, estruturam os capítulos e escrevem um conteúdo original e altamente persuasivo.",
    },
    {
      step: "03",
      title: "Design automático",
      description: "O conteúdo é diagramado automaticamente em templates premium, com tipografia moderna e imagens geradas por IA.",
    },
    {
      step: "04",
      title: "Pronto para vender",
      description: "Exporte seu Ebook finalizado em PDF. Em menos de 5 minutos você tem um infoproduto de alta qualidade pronto para o mercado.",
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#121827] relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Como a mágica <br className="hidden md:block"/> acontece?
            </h2>
            <p className="text-gray-400 text-lg mb-10">
              Transformamos um processo que levava semanas em algo que leva apenas alguns minutos. É tão simples quanto conversar.
            </p>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-bold border border-primary/30">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:w-1/2 w-full">
            <div className="relative rounded-2xl bg-gradient-to-br from-white/5 to-white/10 p-1 border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 blur-xl -z-10 rounded-2xl"></div>
              <div className="bg-[#0B0F19] rounded-xl overflow-hidden border border-white/5 h-[500px] flex flex-col">
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary"></div>
                  <div>
                    <div className="text-sm font-medium text-white">EbookForge Assistant</div>
                    <div className="text-xs text-primary">Digitando...</div>
                  </div>
                </div>
                <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden">
                  <div className="self-end bg-primary/20 border border-primary/30 text-white p-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                    Crie um ebook sobre &ldquo;Como sair das dívidas com princípios bíblicos&rdquo;, focado em um público cristão.
                  </div>
                  <div className="self-start bg-white/5 border border-white/10 text-gray-300 p-4 rounded-2xl rounded-tl-sm max-w-[90%] shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="font-medium text-white">Gerando estrutura do Ebook...</span>
                    </div>
                    <div className="space-y-2 text-sm opacity-70">
                      <p>✓ Pesquisando referências bíblicas (Provérbios, Eclesiastes)</p>
                      <p>✓ Criando índice com 7 capítulos</p>
                      <p>✓ Desenvolvendo exercícios práticos</p>
                    </div>
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
