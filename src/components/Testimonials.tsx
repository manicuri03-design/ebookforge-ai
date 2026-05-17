export default function Testimonials() {
  const testimonials = [
    {
      name: "Rafael Moraes",
      role: "Infoprodutor (Faturamento +100k/mês)",
      content: "Eu gastava quase R$ 2.000,00 entre copywriter e designer para cada PLR ou Ebook novo. Com o EbookForge, eu lanço um produto por semana com custo quase zero. A qualidade da escrita é surreal.",
      initials: "RM",
      color: "bg-blue-500"
    },
    {
      name: "Camila Santos",
      role: "Especialista em Marketing",
      content: "O design gerado pela ferramenta é absurdo. Realmente parece que foi feito no InDesign ou Figma por um profissional sênior. Meus clientes de mentoria adoraram os materiais de apoio.",
      initials: "CS",
      color: "bg-purple-500"
    },
    {
      name: "Diego Ferreira",
      role: "Criador de Conteúdo Cristão",
      content: "Usei para criar meu guia de finanças bíblicas e a IA conseguiu captar perfeitamente o tom de voz e as referências que eu precisava. Vendi mais de 500 cópias na primeira semana.",
      initials: "DF",
      color: "bg-green-500"
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-[#0B0F19] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Aprovado pelos <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">grandes players</span> do mercado
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-[#121827] border border-white/10 p-8 rounded-2xl relative">
              <div className="text-primary mb-6">
                <svg className="w-10 h-10 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-300 mb-8 italic">&ldquo;{testimonial.content}&rdquo;</p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center font-bold text-white text-lg`}>
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
