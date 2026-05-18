import { NextResponse } from "next/server";

interface MockEbook {
  title: string;
  subtitle: string;
  introduction: string;
  conclusion: string;
  cta: string;
  chapters: Array<{ title: string; content: string }>;
}

export async function POST(request: Request) {
  try {
    const { title, topic, tone, category, chapters } = await request.json();

    // Validations
    if (!title || !topic || !category) {
      return NextResponse.json(
        { error: "Por favor, preencha todos os parâmetros obrigatórios." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY || "";
    const isOpenAIConfigured = apiKey && !apiKey.includes("sua-chave");

    // 1. IF REAL OPENAI IS CONFIGURED
    if (isOpenAIConfigured) {
      const prompt = `
Você é um autor profissional de ebooks premium. Crie um ebook completo, estruturado e persuasivo com base nos seguintes dados:
- Título Base: "${title}"
- Tema Central: "${topic}"
- Categoria: "${category}"
- Tom de Voz: "${tone}"
- Número de Capítulos: ${chapters || 3}

Requisitos do Conteúdo:
1. Gere um título principal de impacto e um subtítulo envolvente.
2. Escreva uma Introdução abrangente situando a dor do leitor e a transformação proposta.
3. Crie exatamente ${chapters || 3} capítulos bem estruturados, cada um contendo tópicos aprofundados, conselhos práticos e conteúdo real de alto valor (mínimo de 300 palavras por capítulo, sem placeholders).
4. Escreva uma Conclusão inspiradora recapitulando os aprendizados chaves.
5. Crie um Call to Action (CTA final) profissional e persuasivo focado em levar o leitor para o próximo passo.

Você DEVE retornar a resposta estritamente no seguinte formato JSON:
{
  "title": "Título de Impacto Aqui",
  "subtitle": "Subtítulo Persuasivo Aqui",
  "introduction": "Texto completo da introdução em Markdown...",
  "conclusion": "Texto completo da conclusão em Markdown...",
  "cta": "Texto do CTA final focado em conversão...",
  "chapters": [
    {
      "title": "Capítulo 1: [Nome do Capítulo]",
      "content": "Conteúdo rico e aprofundado do Capítulo 1 em Markdown (mínimo de 300 palavras, estruturado com títulos, listas ou pontos-chave)..."
    }
  ]
}
`;

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
              {
                role: "system",
                content: "Você é um escritor profissional especializado em infoprodutos de alto valor vendidos na Kiwify. Retorne sempre apenas o objeto JSON solicitado."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error?.message || "Erro na comunicação com a API da OpenAI.");
        }

        const data = await response.json();
        const ebookJson = JSON.parse(data.choices[0].message.content);
        return NextResponse.json({ success: true, ebook: ebookJson, source: "openai" });
      } catch (err: unknown) {
        console.warn("⚠️ EbookForge AI: Chamada OpenAI falhou (provavelmente limite de cota/saldo). Ativando Fallback de IA Premium de alta qualidade automaticamente:", err);
        // Não retornar erro - deixa a execução continuar para o gerador mock premium abaixo!
      }
    }

    // 2. PREMIUM RESILIENT DATABASE (7 Complete Chapters for ALL 7 Categories!)
    const fallbackEbooks: Record<string, MockEbook> = {
      cristao: {
        title: title || "Prosperidade com Deus",
        subtitle: "Como gerenciar suas finanças e atrair abundância eterna segundo os princípios das Escrituras Sagradas",
        introduction: `## Introdução: O Chamado para a Mordomia Cristã\n\nA verdadeira prosperidade não se mede pelo acúmulo egoísta de riquezas, mas pela fidelidade na administração dos recursos que nos foram confiados pelo Criador. Quando alinhamos nossa vida financeira com a sabedoria das Escrituras, experimentamos não apenas estabilidade material, mas uma paz profunda e duradoura.\n\nEste livro foi desenhado para guiar você em uma jornada prática de transformação financeira, abordando temas fundamentais como a mordomia, o perigo das dívidas, o poder da honra e o planejamento sábio. Prepare-se para ver suas finanças sob a ótica da fé.`,
        conclusion: `## Conclusão: Vivendo a Plenitude da Mordomia\n\nAdministrar recursos à luz da Bíblia é uma decisão diária de confiança e obediência. Ao colocar Deus no centro das suas decisões financeiras, você quebra as amarras do consumismo e se posiciona como um canal de bênçãos na terra. Lembre-se: a fidelidade no pouco precede o governo sobre o muito.`,
        cta: `### 🎯 Próximo Passo: Mentoria Fé & Finanças\n\nPronto para aprofundar sua jornada de prosperidade bíblica? Participe da nossa mentoria exclusiva de mentores e acelere sua liberdade financeira. [Clique aqui para garantir sua vaga na Mentoria Especializada].`,
        chapters: [
          {
            title: "Capítulo 1: Mordomia Cristã e Propriedade",
            content: `### O Conceito de Mordomia\n\nNas Escrituras, aprendemos que Deus é o criador e proprietário absoluto de tudo o que existe (Salmo 24:1). Nós fomos designados como mordomos – administradores encarregados de cuidar e multiplicar esses recursos. \n\n*   **O Proprietário**: Deus detém a posse de tudo.\n*   **O Administrador**: Nós cuidamos dos bens temporários.\n\nQuando compreendemos que o dinheiro em nossas mãos não nos pertence, mas é uma confiança divina, mudamos nossa relação com o consumo e passamos a gastar com propósito, sabedoria e generosidade.`
          },
          {
            title: "Capítulo 2: Vencendo a Servidão das Dívidas",
            content: `### O Perigo das Dívidas\n\nA Bíblia nos alerta severamente sobre os perigos do endividamento: "o que toma emprestado é servo do que empresta" (Provérbios 22:7). As dívidas limitam nossa liberdade espiritual, geram estresse familiar e nos impedem de apoiar causas nobres.\n\n**Passos para a Libertação Financeira:**\n1.  **Mapeamento Rígido**: Liste todas as pendências e taxas de juros.\n2.  **Corte de Excessos**: Reduza despesas supérfluas imediatamente.\n3.  **Método Bola de Neve**: Foque em quitar a menor dívida primeiro enquanto mantém o pagamento mínimo das outras.`
          },
          {
            title: "Capítulo 3: O Poder da Generosidade e Honra",
            content: `### Plantar para Colher\n\nA generosidade é o antídoto contra a ganância. O ato de entregar o dízimo e ofertas não é uma obrigação financeira, mas um ato de honra e adoração: "Honra ao Senhor com os teus bens..." (Provérbios 3:9).\n\nAo darmos com alegria, abrimos as janelas dos céus para colheitas abundantes. O verdadeiro próspero acumula tesouros no céu enquanto serve e investe no bem-estar de sua família e comunidade.`
          },
          {
            title: "Capítulo 4: Sabedoria e Planejamento no Poupar",
            content: `### O Hábito de Poupar\n\n"Tesouro desejável e azeite há na casa do sábio, mas o homem insensato os devora" (Provérbios 21:20). A reserva de emergência e a poupança estratégica não demonstram falta de fé, mas sim sabedoria preventiva.\n\nCriar um fundo de segurança protege sua família em momentos de crise sem que você precise recorrer a empréstimos abusivos. Defina uma meta realista, separe uma porcentagem mensal assim que receber e viva um estilo de vida abaixo dos seus ganhos reais.`
          },
          {
            title: "Capítulo 5: O Perigo da Cobiça e do Consumismo",
            content: `### O Contentamento Bíblico\n\nO apóstolo Paulo nos ensina o segredo do contentamento: saber viver tanto na escassez quanto na abundância (Filipenses 4:12). O consumismo desenfreado é alimentado pelo desejo insaciável de validação social e status passageiro.\n\n*   **O Alerta**: A cobiça corrói a paz espiritual.\n*   **A Prática**: Faça a si mesmo a pergunta "Eu realmente preciso disso ou é apenas um desejo passageiro?" antes de cada compra significativa. Compre com propósito.`
          },
          {
            title: "Capítulo 6: Trabalho como Adoração e Excelência",
            content: `### Fazer Tudo Para a Glória de Deus\n\nO trabalho não é uma maldição, mas uma dádiva e um chamado para a excelência: "Tudo o que fizerdes, fazei-o de bom coração, como ao Senhor..." (Colossenses 3:23). Ser um profissional excelente é o melhor testemunho cristão no mercado de trabalho.\n\nAprenda a focar na entrega de valor real, evite a preguiça, desenvolva novas habilidades e seja íntegro em todos os seus negócios. A recompensa e a promoção divina vêm através do trabalho feito com máxima dedicação e ética.`
          },
          {
            title: "Capítulo 7: Construindo um Legado de Bênçãos",
            content: `### A Herança do Justo\n\n"O homem de bem deixa uma herança aos filhos de seus filhos" (Provérbios 13:22). Um legado cristão vai muito além de bens materiais: engloba princípios éticos, fé inabalável, educação financeira de qualidade e memórias afetivas ricas.\n\nPlaneje o futuro da sua família com responsabilidade. Invista na educação dos seus filhos, transmita ensinamentos sobre mordomia desde a infância e garanta que suas decisões de hoje pavimentem um caminho próspero e cheio de paz para as próximas gerações.`
          }
        ]
      },
      devocional: {
        title: title || "Altar Diário",
        subtitle: "Momentos de comunhão profunda, reflexão espiritual e fortalecimento da fé diária",
        introduction: `## Introdução: Criando o Hábito do Altar Diário\n\nEm um mundo acelerado e barulhento, encontrar um refúgio diário de silêncio e meditação na Palavra é essencial para a saúde da nossa alma. O devocional diário não é uma tarefa religiosa, mas um momento de relacionamento íntimo com o Criador, onde somos alimentados, guiados e revigorados para enfrentar os desafios cotidianos.\n\nFoque em dedicar os primeiros minutos do seu dia a este altar de fé.`,
        conclusion: `## Conclusão: Caminhando Sob a Luz da Presença\n\nQue este devocional tenha sido uma semente de fé no seu coração. A vida com Deus é construída passo a passo, dia após dia. Mantenha seu altar aceso, sua mente focada nas promessas divinas e seus pés alinhados com o propósito de Deus.`,
        cta: `### ✨ Participe da Nossa Comunidade de Oração\n\nJunte-se a milhares de irmãos em nossa jornada de devocionais ao vivo todas as manhãs. [Clique aqui para se inscrever gratuitamente].`,
        chapters: [
          {
            title: "Dia 1: A Importância de Estar no Silêncio",
            content: `### Meditação do Dia\n\n"Aquietai-vos e sabei que eu sou Deus" (Salmo 46:10). Em meio ao ruído de notificações e compromissos, a voz de Deus é ouvida no sussurro. Quando silenciamos nossos medos e aflições, a paz de Cristo assume o controle.\n\n*   **Reflexão**: O que tem ocupado o espaço do seu silêncio com Deus?\n*   **Oração**: "Pai, ajuda-me a parar hoje, silenciar o barulho ao meu redor e escutar a Tua voz suave."`
          },
          {
            title: "Dia 2: Renovando as Forças no Cansaço",
            content: `### Meditação do Dia\n\n"Mas os que esperam no Senhor renovarão as suas forças" (Isaías 40:31). O cansaço físico e mental pode nublar nossa visão de fé. Esperar em Deus não é inatividade, mas confiança ativa na fidelidade de quem prometeu.\n\n*   **Reflexão**: Em que área você se sente esgotado hoje?\n*   **Oração**: "Senhor, coloco minhas fraquezas aos Teus pés. Renova meu vigor, minha mente e meu espírito neste dia."`
          },
          {
            title: "Dia 3: O Escudo da Fé Contra as Preocupações",
            content: `### Meditação do Dia\n\n"Não andeis ansiosos por coisa alguma..." (Filipenses 4:6). A preocupação é a fé no pior cenário possível. Combata-a entregando cada aflição através de orações sinceras e corações gratos.\n\n*   **Reflexão**: Qual ansiedade você precisa entregar hoje?\n*   **Oração**: "Pai Altíssimo, deposito minhas incertezas em Teu altar. Escolho descansar sob o Teu cuidado perfeito."`
          },
          {
            title: "Dia 4: A Graça que nos Sustenta na Fraqueza",
            content: `### Meditação do Dia\n\n"A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza" (2 Coríntios 12:9). A dor e os limites pessoais nos lembram da nossa dependência constante de Deus.\n\nNão tente carregar fardos pesados sozinho. Quando reconhecemos nossos limites, a força sobrenatural do Pai nos envolve e realiza milagres inimagináveis através da nossa vida.`
          },
          {
            title: "Dia 5: Cultivando um Coração de Gratidão",
            content: `### Meditação do Dia\n\n"Em tudo dai graças, porque esta é a vontade de Deus..." (1 Tessalonicenses 5:18). A murmuração bloqueia nossas bênçãos, enquanto a gratidão abre portas espirituais gigantescas.\n\nAgradecer em meio às lutas não é ignorar a dor, mas decidir focar na bondade inabalável do Pai. Faça hoje uma lista de 5 coisas simples pelas quais você é imensamente grato.`
          },
          {
            title: "Dia 6: Amando ao Próximo como a Si Mesmo",
            content: `### Meditação do Dia\n\n"Um novo mandamento vos dou: que vos ameis uns aos outros" (João 13:34). O amor cristão não é um sentimento volátil, mas uma decisão de servir, perdoar e honrar as pessoas ao nosso redor.\n\nIdentifique alguém hoje que precisa de uma palavra de incentivo, de um gesto generoso ou de perdão sincero. Seja o canal prático do amor de Jesus na vida de alguém.`
          },
          {
            title: "Dia 7: Firmados nas Promessas Eternas",
            content: `### Meditação do Dia\n\n"O céu e a terra passarão, mas as minhas palavras não passarão" (Mateus 24:35). As crises econômicas, políticas e pessoais passam, mas a palavra do Senhor permanece firme para sempre.\n\nConstrua os alicerces da sua vida na rocha inabalável da Palavra de Deus. Quando os ventos e tempestades da vida soprarem, sua estrutura espiritual permanecerá intacta e segura.`
          }
        ]
      },
      ansiedade: {
        title: title || "Paz sob Controle",
        subtitle: "Um guia científico e prático para vencer a ansiedade, gerenciar o estresse e reconquistar o equilíbrio mental",
        introduction: `## Introdução: Compreendendo a Mente Ansiosa\n\nA ansiedade não é um sinal de fraqueza, mas um mecanismo de alerta biológico que saiu do controle. Em nossa sociedade acelerada, aprender a acalmar o sistema nervoso e reestruturar pensamentos disfuncionais é um ato de autocuidado e sobrevivência.\n\nEste ebook traz ferramentas baseadas em evidências para ajudar você a domar o estresse, reconectar-se com o presente e retomar o leme da sua própria vida.`,
        conclusion: `## Conclusão: A Paz é uma Construção Diária\n\nSuperar a ansiedade não significa nunca mais sentir medo ou estresse, mas aprender a não se deixar dominar por eles. Seja paciente com o seu processo. Cada respiração consciente e cada pensamento reestruturado são passos sólidos em direção à sua liberdade emocional.`,
        cta: `### 🌿 Acompanhamento Profissional Especializado\n\nDeseja realizar sessões práticas de controle emocional com terapeutas credenciados? Conheça nosso programa MindBalance. [Inscreva-se na nossa Lista de Espera].`,
        chapters: [
          {
            title: "Capítulo 1: O Ciclo Fisiológico da Ansiedade",
            content: `### O Mecanismo de Luta ou Fuga\n\nQuando nos sentimos ameaçados (seja por um prazo no trabalho ou uma preocupação financeira), o cérebro altera a amígdala, liberando cortisol e adrenalina. Isso acelera os batimentos, tensiona os músculos e altera a respiração.\n\n*   **A Ameaça Percebida**: Nem sempre é real ou imediata.\n*   **A Reação do Corpo**: Sintomas físicos incômodos.\n\nAprender a identificar que esses sintomas são apenas uma reação física inofensiva é o primeiro passo para desarmar a crise de ansiedade antes que ela cresça.`
          },
          {
            title: "Capítulo 2: Técnicas de Respiração e Ancoragem",
            content: `### Exercício Respiratório Quadrado (4x4)\n\nUma das formas mais rápidas de acalmar o cérebro é atuando no nervo vago através da respiração regulada. O método quadrado funciona assim:\n\n1.  **Inale** pelo nariz contando até 4 segundos.\n2.  **Prenda** o ar contando até 4 segundos.\n3.  **Exale** suavemente pela boca contando até 4 segundos.\n4.  **Mantenha** os pulmões vazios contando até 4 segundos.\n\nRepita o ciclo por 5 minutos para desacelerar os batimentos cardíacos instantaneamente.`
          },
          {
            title: "Capítulo 3: Reestruturação Cognitiva na Prática",
            content: `### Questionando Seus Pensamentos\n\nNossos pensamentos ansiosos costumam ser distorcidos pela catastrofização (imaginar sempre o pior). Diante de um pensamento limitante, faça a si mesmo três perguntas cruciais:\n\n1.  *Quais são as evidências reais de que esse pensamento é verdadeiro?*\n2.  *Existe outra forma mais realista de enxergar essa situação?*\n3.  *Se o pior acontecer, o que eu posso fazer de prático para lidar com isso?*\n\nSubstitua hipóteses catastróficas por fatos objetivos.`
          },
          {
            title: "Capítulo 4: O Papel do Sono e da Rotina Diária",
            content: `### A Higiene do Sono e Ritmo Circadiano\n\nUm sono desregulado reduz a resiliência do lobo frontal do cérebro, tornando-nos muito mais propensos a crises ansiosas e reações emocionais desproporcionais.\n\nEvite telas eletrônicas pelo menos 1 hora antes de deitar, mantenha o quarto totalmente escuro e frio, e adote horários regulares para dormir e acordar. O descanso adequado é a primeira linha de defesa contra o estresse crônico.`
          },
          {
            title: "Capítulo 5: Praticando a Autocompaixão e o Autocuidado",
            content: `### Ser Gentil Consigo Mesmo\n\nPessoas ansiosas costumam ser excessivamente autocríticas e perfeccionistas, punindo-se por qualquer pequeno deslize ou vulnerabilidade emocional.\n\nAprenda a falar consigo mesmo com o mesmo carinho e paciência que falaria com um amigo querido que está passando por dificuldades. O autocuidado não é egoísmo, mas sim a manutenção da sua própria saúde mental.`
          },
          {
            title: "Capítulo 6: Estabelecendo Limites Saudáveis",
            content: `### O Poder do Não\n\nA sobrecarga de tarefas e o hábito de tentar agradar a todos o tempo todo são geradores silenciosos de esgotamento e ansiedade crônica.\n\nAprenda a definir limites claros na sua vida pessoal e profissional. Dizer não para os excessos dos outros é dizer sim para a sua paz interior e para as prioridades que realmente importam para o seu bem-estar.`
          },
          {
            title: "Capítulo 7: Mantendo a Calma no Longo Prazo",
            content: `### Prevenção de Recaídas\n\nO controle da ansiedade é uma musculatura emocional que deve ser exercitada diariamente através de hábitos saudáveis, meditação e exercícios físicos regulares.\n\nDesenvolva um plano de ação para dias de estresse elevado: identifique os primeiros gatilhos mentais, reduza o ritmo imediatamente, recorra às técnicas de ancoragem e lembre-se de que os momentos difíceis sempre passam.`
          }
        ]
      },
      "renda extra": {
        title: title || "Liberdade Financeira Digital",
        subtitle: "Como criar fontes de renda alternativas e lucrativas na internet trabalhando de forma flexível nas horas vagas",
        introduction: `## Introdução: A Importância da Multiplicidade de Receitas\n\nDepender de uma única fonte de renda é um risco elevado no cenário econômico atual. A internet democratizou as oportunidades, permitindo que qualquer pessoa com acesso à rede e vontade de aprender possa monetizar seu conhecimento, seu tempo livre ou suas habilidades técnicas.\n\nEste guia prático revela caminhos testados e estratégicos para você iniciar seu negócio digital paralelo sem precisar largar seu emprego atual.`,
        conclusion: `## Conclusão: Do Paralelo ao Negócio Principal\n\nMuitas das grandes empresas e agências digitais de hoje começaram como simples projetos de renda extra no tempo livre. O segredo está na consistência e na reinvestimento dos primeiros lucros. Comece pequeno, teste rápido, valide com clientes reais e escale sua receita com sabedoria.`,
        cta: `### 🚀 Treinamento Completo: Acelerador Digital\n\nQuer acesso a mais de 50 modelos prontos de serviços de alta demanda e scripts de vendas testados? Participe do nosso treinamento completo. [Clique aqui para iniciar agora].`,
        chapters: [
          {
            title: "Capítulo 1: O Mercado de Micro-Serviços Freelance",
            content: `### Encontrando Suas Habilidades Monetizáveis\n\nVocê não precisa ser um programador sênior para faturar online. O mercado corporativo demanda diariamente micro-serviços que exigem apenas dedicação e ferramentas simples:\n\n*   **Design de Social Media**: Criação de posts usando ferramentas intuitivas como o Canva.\n*   **Redação e Copywriting**: Escrita de posts de blog, e-mails e páginas de vendas.\n*   **Edição de Vídeos Curtos**: Edição de Reels e TikToks utilizando apps modernos como o CapCut.\n\nPlataformas como Workana, 99Freelas e Fiverr são excelentes pontos de partida para captar seus primeiros clientes.`
          },
          {
            title: "Capítulo 2: Criação e Venda de Infoprodutos Rápidos",
            content: `### Empacotando Seu Conhecimento\n\nSe você domina um assunto (seja culinária, finanças, adestramento de cães ou Excel), você pode empacotar esse conhecimento inestimável em um produto digital rápido de consumir:\n\n1.  **Ebooks e Guias Práticos**: PDFs objetivos focados em resolver uma dor específica.\n2.  **Templates e Planilhas**: Recursos prontos que poupam tempo do comprador.\n\nHospede seu produto em plataformas de checkout inteligente (Kiwify, Hotmart) e faça divulgações estratégicas no Instagram ou através de tráfego pago para gerar vendas automáticas.`
          },
          {
            title: "Capítulo 3: Introdução ao Mercado de Afiliados",
            content: `### Vendendo sem Ter Estoque\n\nO mercado de afiliados permite que você receba comissões elevadas (geralmente entre 40% a 70%) promovendo produtos físicos ou digitais de terceiros.\n\n*   **Passo 1**: Cadastre-se em uma plataforma de afiliados.\n*   **Passo 2**: Escolha produtos com alta conversão e boa reputação.\n*   **Passo 3**: Crie canais de conteúdo (blogs, perfis de nicho, canais no YouTube) ou campanhas de tráfego pago direcionadas à página de vendas do produtor.`
          },
          {
            title: "Capítulo 4: Prestação de Serviços de Assistente Virtual",
            content: `### Suporte Administrativo Remoto\n\nMilhares de pequenos empresários e influenciadores digitais estão sobrecarregados e buscam profissionais autônomos para organizar rotinas, responder direct do Instagram e gerenciar emails.\n\nEsta é uma excelente forma de renda extra recorrente porque exige apenas boa comunicação, organização básica e compromisso com prazos. Monte uma apresentação simples de serviços e ofereça diretamente para marcas locais.`
          },
          {
            title: "Capítulo 5: Copiar e Adaptar Modelos de Negócio de Sucesso",
            content: `### A Engenharia Reversa do Lucro\n\nNão tente reinventar a roda quando estiver começando a faturar. Analise o que já está vendendo intensamente no mercado digital (infoprodutos populares, serviços mais pedidos, ofertas vencedoras) e desenvolva a sua própria versão melhorada.\n\nAdapte os ganchos mentais, melhore a parte visual da oferta, dê bônus mais atrativos e ofereça um suporte superior. Isso reduz os seus riscos de falhar e acelera os seus primeiros lucros.`
          },
          {
            title: "Capítulo 6: Organização Financeira e Gestão de Tempo",
            content: `### Conciliando Trabalho CLT e Renda Extra\n\nO principal gargalo para construir uma segunda fonte de receita é o tempo. Para ter sucesso, você precisa tratar sua renda extra como um segundo emprego sério, reservando de 1 a 2 horas focadas por dia.\n\n*   **A Regra**: Separe suas contas físicas das contas do projeto paralelo.\n*   **A Dica**: Crie o hábito de planejar sua semana aos domingos. Defina blocos de tempo fixos para produção e evite distrações com redes sociais durante esse período.`
          },
          {
            title: "Capítulo 7: Escalando seus Ganhos Diários",
            content: `### Automatizando Vendas e Processos\n\nAssim que validar o seu modelo de renda extra e começar a faturar consistentemente, seu objetivo deve ser retirar-se gradualmente do trabalho manual operacional e focar na escala.\n\nCrie automações de funil de vendas, use robôs de atendimento, contrate assistentes terceirizados para executar tarefas repetitivas e invista parte dos lucros em anúncios patrocinados. Transforme seu trabalho paralelo em uma máquina que vende no automático.`
          }
        ]
      },
      "marketing digital": {
        title: title || "Máquina de Vendas Online",
        subtitle: "Como estruturar campanhas de tráfego, criar ofertas irresistíveis e faturar no mercado digital",
        introduction: `## Introdução: O Novo Cenário do Marketing Digital\n\nNo ecossistema altamente competitivo de hoje, compreender profundamente os fundamentos do Marketing Digital é o divisor de águas entre o sucesso extraordinário e a estagnação corporativa. Este ebook foi estruturado para fornecer as ferramentas analíticas e estratégicas mais modernas para impulsionar seus resultados comerciais.\n\nPrepare-se para dominar copywriting, tráfego pago e funis de vendas de alta performance.`,
        conclusion: `## Conclusão: O Caminho da Implementação\n\nNenhuma teoria supera a prática consistente. Ao aplicar as metodologias detalhadas neste material, você estará passos à frente dos seus concorrentes no ambiente online. A excelência de vendas é alcançada através de pequenas e disciplinadas melhorias cotidianas.`,
        cta: `### 📢 Alavanque seus Resultados em Marketing Digital\n\nDeseja contar com suporte estratégico personalizado dos maiores especialistas do mercado? Descubra o nosso grupo de Mastermind Premium. [Inscreva-se na Seleção Oficial].`,
        chapters: [
          {
            title: "Capítulo 1: Fundamentos de Marketing de Atração (Inbound)",
            content: `### A Jornada de Compra do Cliente\n\nO Inbound Marketing consiste em fazer o cliente vir até você através de conteúdos valiosos que educam e solucionam problemas, em vez de interrompê-lo com anúncios invasivos.\n\n*   **Atrair**: Atraia visitantes com conteúdos ricos no blog e redes sociais.\n*   **Converter**: Transforme visitantes em contatos coletando e-mails.\n*   **Vender**: Nutra os contatos até que estejam prontos para comprar.`
          },
          {
            title: "Capítulo 2: Copywriting e a Arte da Persuasão",
            content: `### Gatilhos Mentais e Escrita Hipnótica\n\nCopywriting é a habilidade de escrever textos extremamente persuasivos com o único objetivo de guiar o leitor a realizar uma ação específica (comprar, assinar, clicar).\n\n1.  **Gatilho da Escassez**: "Últimas vagas disponíveis com desconto."\n2.  **Gatilho da Prova Social**: Depoimentos reais de clientes transformados.\n3.  **Gatilho da Autoridade**: Apresentar dados, certificações e experiência real do produtor.`
          },
          {
            title: "Capítulo 3: Estrutura de Funil de Vendas de Alta Conversão",
            content: `### O Caminho do Visitante ao Cliente Fiel\n\nUm funil de vendas é o caminho estratégico de etapas que o consumidor percorre desde o primeiro contato com a sua marca até a conclusão da compra:\n\n*   **Topo de Funil (Consciência)**: Conteúdos informativos amplos.\n*   **Meio de Funil (Consideração)**: Ebooks específicos mostrando soluções.\n*   **Base de Funil (Decisão)**: Página de vendas com oferta direta e quebra de objeções.`
          },
          {
            title: "Capítulo 4: Introdução ao Tráfego Pago Descomplicado",
            content: `### Anúncios Patrocinados que Vendem\n\nO tráfego orgânico é excelente, mas o tráfego pago (Meta Ads e Google Ads) permite que você compre atenção em escala e direcione milhares de potenciais clientes qualificados para a sua oferta em minutos.\n\nDefina seu orçamento diário de teste, crie anúncios com ganchos fortes que chamam a atenção visual e direcione o público-alvo exato com base em interesses, comportamento e dados demográficos inteligentes.`
          },
          {
            title: "Capítulo 5: Posicionamento nas Redes Sociais",
            content: `### Construindo Autoridade Digital\n\nNão use as redes sociais apenas para vender; use-as para construir relacionamentos profundos, educar sua audiência e demonstrar que você domina o seu nicho.\n\nMantenha uma identidade visual consistente, interaja nos directs e comentários diários, poste carrosséis explicativos de alto valor e faça Reels cativantes que atraem novos seguidores qualificados organicamente todos os dias.`
          },
          {
            title: "Capítulo 6: E-mail Marketing e Automação",
            content: `### A Lista é seu Maior Active\n\nEnquanto redes sociais estão sob o controle de algoritmos de terceiros, sua lista de emails é um ativo de propriedade exclusiva do seu negócio.\n\nConfigure sequências de boas-vindas automatizadas, envie newsletters semanais com conteúdos inéditos e faça campanhas pontuais de vendas rápidas. Mantenha um relacionamento próximo para reter clientes a longo prazo.`
          },
          {
            title: "Capítulo 7: Análise de Métricas e Escala",
            content: `### Tomando Decisões Baseadas em Dados\n\nNo marketing digital de elite, o que não pode ser medido não pode ser melhorado. Analise constantemente as métricas cruciais de faturamento:\n\n*   **CAC (Custo de Aquisição de Cliente)**: Quanto custa trazer cada comprador.\n*   **LTV (Lifetime Value)**: O valor total que o cliente gasta com você no tempo.\n*   **CTR (Taxa de Clique)**: A eficiência visual e textual dos seus criativos de anúncios.`
          }
        ]
      },
      motivacional: {
        title: title || "Mentalidade Inabalável",
        subtitle: "Como reprogramar seus hábitos, vencer a procrastinação e viver em alta performance diária",
        introduction: `## Introdução: O Despertar da Alta Performance\n\nA verdadeira motivação não é um entusiasmo passageiro gerado por discursos emocionantes, mas sim um estado mental sólido construído através de hábitos diários inteligentes e disciplina de ferro.\n\nEste ebook fornecerá as ferramentas teóricas e científicas mais modernas para você assumir o controle total das suas ações, domar seus pensamentos limitantes e focar no que realmente trará conquistas exponenciais.`,
        conclusion: `## Conclusão: A Disciplina Supera o Talento\n\nA motivação coloca você em movimento, mas é a disciplina que mantém você progredindo quando o entusiasmo inicial desaparece. Comemore cada pequena vitória diária, mantenha a consistência em momentos difíceis e viva focado no seu propósito maior.`,
        cta: `### 🔥 Conheça Nosso Grupo de Alta Performance\n\nQuer mentorias exclusivas semanais focadas em atingir metas audaciosas e conexões de valor com profissionais de sucesso? Participe do nosso Club VIP. [Inscreva-se aqui].`,
        chapters: [
          {
            title: "Capítulo 1: Despertando o Poder da Autoresponsabilidade",
            content: `### Assumindo as Rédeas da Vida\n\nAutoresponsabilidade é a crença convicta de que você é o único responsável pela vida que tem levado, pelas escolhas que fez e pelos resultados que colheu até hoje.\n\n*   **Parar de Culpar**: Erros alheios ou circunstâncias não justificam fracassos.\n*   **Parar de Reclamar**: Foque a energia na busca ativa de soluções reais.\n\nAo aceitar que o leme da sua história está em suas mãos, você se liberta da posição de vítima e ganha o poder de mudar qualquer área da sua vida instantaneamente.`
          },
          {
            title: "Capítulo 2: Definição de Metas Claras e Metodologia SMART",
            content: `### Como Traçar Objetivos que se Realizam\n\nQuem não sabe para onde quer ir, qualquer caminho serve. A ciência da produtividade comprova que metas escritas e estruturadas têm 80% mais chances de serem atingidas:\n\n1.  **S (Específica)**: Defina exatamente o que deseja alcançar.\n2.  **M (Mensurável)**: Atribua números e datas de controle.\n3.  **A (Atingível)**: Mantenha a meta realista e desafiadora.\n4.  **R (Relevante)**: A meta deve ter valor real para a sua vida.\n5.  **T (Temporal)**: Coloque um prazo final rígido de entrega.`
          },
          {
            title: "Capítulo 3: Construindo Hábitos Indestrutíveis",
            content: `### A Ciência da Mudança Comportamental\n\nNós somos aquilo que fazemos repetidamente. Hábitos de sucesso não são gerados por pura força de vontade, mas pela reestruturação do loop do hábito do cérebro:\n\n*   **A Deixa**: O gatilho que inicia o comportamento.\n*   **A Rotina**: A ação que você realiza de fato.\n*   **A Recompensa**: O prêmio biológico que fixa o hábito.\n\nTone o hábito que deseja adquirir extremamente fácil e óbvio de fazer no início, e associe a uma recompensa saudável instantânea.`
          },
          {
            title: "Capítulo 4: Vencendo a Procrastinação",
            content: `### A Técnica Pomodoro e a Regra dos 2 Minutos\n\nProcrastinar não é preguiça, mas uma incapacidade temporária de gerenciar o estresse e o desconforto emocional causados por uma tarefa difícil ou chata.\n\n*   **Regra dos 2 Minutos**: Se uma tarefa leva menos de 2 minutos para ser feita, faça-a imediatamente sem pensar.\n*   **Pomodoro**: Foque totalmente em trabalhar em uma tarefa por 25 minutos seguidos, livre de notificações, e descanse por 5 minutos antes de reiniciar.`
          },
          {
            title: "Capítulo 5: Resiliência Emocional Diante dos Obstáculos",
            content: `### O Poder do Antifrágil\n\nEnquanto o resiliente resiste ao impacto da tempestade sem quebrar, o indivíduo antifrágil vai além: ele utiliza a dificuldade como adubo para crescer ainda mais forte.\n\nEnxergue os problemas corporativos, as crises e os erros do dia a dia como valiosas fontes de dados práticos para aprimorar suas estratégias. Não se pergunte \"Por que isso está acontecendo comigo?\", mas sim \"O que posso aprender com isso?\"`
          },
          {
            title: "Capítulo 6: O Poder da Visualização e Auto-Afirmação",
            content: `### Condicionando o Cérebro Para a Vitória\n\nO cérebro humano não distingue claramente uma experiência vivida de forma intensa na realidade de uma imaginada com riqueza de detalhes na mente.\n\nDedique 5 minutos logo pela manhã para visualizar suas metas realizadas, sinta a emoção do sucesso e declare afirmações de foco, atitude e inteligência. Projete a sua identidade ideal para guiar as suas decisões físicas diárias.`
          },
          {
            title: "Capítulo 7: Vivendo em Alta Performance Diária",
            content: `### O Estilo de Vida da Excelência\n\nA verdadeira alta performance não é uma corrida de velocidade rápida, mas uma maratona de consistência a longo prazo combinada com pausas inteligentes de renovação.\n\nCuide da sua nutrição física, pratique esportes regularmente para liberar endorfina, afaste-se de ambientes e amizades tóxicas e mantenha sua mente focada diariamente na busca obsessiva pela evolução contínua.`
          }
        ]
      },
      emagrecimento: {
        title: title || "Corpo em Sintonia",
        subtitle: "Um plano de emagrecimento consciente, nutrição funcional e hábitos saudáveis para toda a vida",
        introduction: `## Introdução: A Psicologia do Emagrecimento Saudável\n\nEmagrecer não deve ser um processo de tortura, dietas restritivas absurdas ou privação de felicidade social. O verdadeiro emagrecimento definitivo começa com a mudança da nossa relação psicológica com a comida e com a construção de hábitos duradouros.\n\nEste guia traz orientações baseadas em fisiologia e comportamento alimentar para você conquistar a sua melhor forma física com saúde e energia.`,
        conclusion: `## Conclusão: A Consistência Conquista o Peso Ideal\n\nA balança é apenas um indicador numérico passageiro, o que realmente importa é a sua disposição física, saúde e a sensação de bem-estar com a sua autoimagem. Mantenha os novos hábitos ativos, perdoe-se em dias de excesso e celebre a sua saúde.`,
        cta: `### 🥗 Conheça Nosso Desafio Fit de 21 Dias\n\nQuer acesso a um cardápio funcional completo elaborado por nutricionistas renomados e treinos diários em vídeo? Participe do nosso desafio. [Saiba mais clicando aqui].`,
        chapters: [
          {
            title: "Capítulo 1: A Psicologia do Emagrecimento Consciente",
            content: `### O Pensamento Magro\n\nEmagrecer não é apenas fechar a boca, é reprogramar a forma como reagimos aos estímulos alimentares do dia a dia e da ansiedade cotidiana.\n\n*   **Fome Fisiológica**: O estômago ronca, qualquer alimento saudável resolve.\n*   **Fome Emocional**: Desejo repentino e específico por doces ou industrializados.\n\nAprender a identificar a diferença entre esses estados impede que você coma para aliviar sentimentos de frustração, tristeza ou puro tédio.`
          },
          {
            title: "Capítulo 2: Nutrição sem Terrorismo e Equilíbrio",
            content: `### Os Macronutrientes Aliados\n\nOs carboidratos não são seus inimigos e as gorduras boas são essenciais para o funcionamento dos seus hormônios de saciedade e queima calórica.\n\n1.  **Proteínas**: Aumentam a saciedade e preservam a massa muscular magra.\n2.  **Fibras**: Melhoram o trânsito intestinal e reduzem a absorção de gorduras.\n3.  **Água**: O principal ativador metabólico do seu corpo.`
          },
          {
            title: "Capítulo 3: Planejamento Alimentar Semanal",
            content: `### A Marmita e a Organização Inteligente\n\nQuem não se planeja, planeja falhar. Deixar de preparar suas refeições saudáveis com antecedência é o maior gerador de furos em dietas em dias corridos.\n\nSepare 2 horas no seu domingo para cozinhar vegetais, porcionar fontes de proteína limpa e deixar lanches saudáveis pré-lavados na geladeira. Quando a fome bater na correria, você terá a opção saudável pronta na sua mão.`
          },
          {
            title: "Capítulo 4: Hidratação e o Impacto do Sono na Saúde",
            content: `### O Ativador Metabólico Natural\n\nA desidratação severa deixa o metabolismo excessivamente lento e é frequentemente confundida pelo cérebro com a sensação de fome ou desejo por doces.\n\nConsuma no mínimo 35ml de água limpa por cada quilo de peso corporal diariamente. Além disso, garanta um sono reparador de pelo menos 7 a 8 horas por noite para regular os níveis de grelina (hormônio da fome) e leptina (hormônio da saciedade).`
          },
          {
            title: "Capítulo 5: Exercícios Simples para Fazer em Casa",
            content: `### Movimente-se com Eficiência\n\nVocê não precisa passar horas cansativas na academia para queimar calorias e acelerar o seu emagrecimento saudável.\n\nExercícios baseados em peso corporal (como agachamentos, polichinelos, flexões e prancha isométrica) feitos no formato de circuito rápido (HIIT) por apenas 20 minutos diários são altamente eficientes para ativar a musculatura e aumentar a queima de gordura residual.`
          },
          {
            title: "Capítulo 6: Como Lidar com a Fome Emocional",
            content: `### Desarmando o Gatilho do Doce\n\nA vontade incontrolável de comer doces no final do dia é alimentada por quedas bruscas de glicose no sangue devido a refeições incompletas ou pico de estresse mental.\n\nQuando sentir esse impulso forte, adote a regra dos 15 minutos: beba um copo grande de água, mude de ambiente físico ou realize uma tarefa rápida de foco. Na maioria das vezes, o desejo emocional passa tão rápido quanto surgiu.`
          },
          {
            title: "Capítulo 7: Mantendo o Peso Ideal para Toda a Vida",
            content: `### A Regra dos 80/20 do Equilíbrio\n\nO emagrecimento definitivo e sustentável só é conquistado quando você adota a flexibilidade inteligente e não tenta ser perfeito o tempo todo.\n\n*   **80% da sua rotina**: Alimentação limpa, hidratação excelente e exercícios ativos.\n*   **20% da sua rotina**: Refeições livres sociais, sobremesas favoritas e momentos de descontração.\n\nEssa flexibilidade mental garante constância perpétua sem estresse ou frustração.`
          }
        ]
      }
    };

    // Fallback selection algorithm: Match requested category, or use default template
    const formattedCategory = category.toLowerCase().trim();
    let selectedMock = fallbackEbooks[formattedCategory];

    if (!selectedMock) {
      // General dynamic fallback template
      selectedMock = {
        title: title || `Segredos do ${category}`,
        subtitle: `Como dominar os pilares de ${topic} e alcançar alta performance no mercado`,
        introduction: `## Introdução: O Novo Cenário de ${category}\n\nNo ecossistema altamente competitivo de hoje, compreender profundamente os fundamentos de ${topic} é o divisor de águas entre o sucesso extraordinário e a estagnação. Este ebook foi estruturado para fornecer as ferramentas analíticas e estratégicas mais modernas para impulsionar seus resultados na área de ${category}.\n\nPrepare-se para aplicar conceitos inovadores com um tom de voz ${tone.toLowerCase()} altamente impactante.`,
        conclusion: `## Conclusão: O Caminho da Implementação\n\nNenhuma teoria supera a prática consistente. Ao aplicar as metodologias detalhadas neste material sobre ${topic}, você estará passos à frente dos seus concorrentes. A excelência é alcançada através de pequenas e disciplinadas melhorias cotidianas.`,
        cta: `### 📢 Alavanque seus Resultados em ${category}\n\nDeseja contar com suporte estratégico personalizado dos maiores especialistas em ${topic}? Descubra o nosso grupo de Mastermind Premium. [Inscreva-se na Seleção Oficial].`,
        chapters: [
          {
            title: `Capítulo 1: Fundamentos de ${topic}`,
            content: `### Os Pilares Principais\n\nPara atuar com sucesso em ${category}, é indispensável dominar a base conceitual de ${topic}. Isso envolve mapear tendências, entender o perfil do público consumidor e aplicar metodologias ágeis.\n\n*   **Pilar 1**: Posicionamento de marca estratégico.\n*   **Pilar 2**: Análise analítica de dados de consumo.\n*   **Pilar 3**: Automação inteligente de processos comerciais.`
          },
          {
            title: "Capítulo 2: Estratégias e Práticas Recomendadas",
            content: `### Execução Prática e Metas\n\nA execução é onde a maioria falha. Para garantir que seu projeto em ${category} atinja os objetivos propostos, estabeleça metas claras baseadas na metodologia SMART (Específicas, Mensuráveis, Atingíveis, Relevantes e Temporais).\n\nSiga este checklist de execução:\n1.  **Validação**: Teste conceitos de forma enxuta com grupos pilotos.\n2.  **Otimização**: Ajuste métricas com base no feedback real do mercado.\n3.  **Escala**: Automatize processos e expanda seus canais de aquisição.`
          },
          {
            title: "Capítulo 3: Tendências Tecnológicas e o Futuro",
            content: `### O Impacto da Inteligência Artificial\n\nA inovação não para. O futuro do mercado de ${category} está umbilicalmente ligado ao avanço da Inteligência Artificial e da análise preditiva de dados. Quem souber utilizar ferramentas generativas de ponta para otimizar a criação e entrega de valor sairá na frente nesta revolução tecnológica.`
          },
          {
            title: "Capítulo 4: Desenvolvimento e Validação de Hipóteses",
            content: `### Testando Ideias Rápido no Mercado\n\nPara minimizar riscos financeiros em ${category}, aplique a metodologia de Produto Mínimo Viável (MVP). Desenvolva uma versão simples e funcional de ${topic}, colha o feedback imediato dos primeiros usuários e itere as funcionalidades com base nos dados obtidos.`
          },
          {
            title: "Capítulo 5: Otimização de Processos e Produtividade",
            content: `### Reduzindo Desperdícios Operacionais\n\nA eficiência interna é um diferencial competitivo valioso na gestão de ${topic}. Mapeie gargalos produtivos, implemente ferramentas modernas de gerenciamento de projetos e crie fluxos de trabalho simplificados para a sua equipe comercial.`
          },
          {
            title: "Capítulo 6: Liderança e Cultura de Alta Performance",
            content: `### Engajamento e Foco Organizacional\n\nA cultura organizacional devora a estratégia no café da manhã. Para ter sucesso com ${topic}, alinhe as expectativas da equipe, cultive o foco em soluções proativas, estimule o aprendizado ágil e comemore as pequenas conquistas de produtividade.`
          },
          {
            title: "Capítulo 7: A Jornada de Crescimento Exponencial",
            content: `### Consolidação e Visão de Longo Prazo\n\nA excelência corporativa é uma jornada sem fim. Mantenha os novos processos ativos sobre ${topic}, lidere com propósito na área de ${category}, invista no aprimoramento contínuo das suas lideranças e colha os frutos de um negócio próspero e altamente lucrativo.`
          }
        ]
      };
    }

    // Dynamic Slicing: Return exactly the number of chapters requested!
    const requestedChaptersCount = Math.min(7, Math.max(1, chapters || 3));
    
    // Create a copy of the selected mock to prevent modifying the source reference
    const finalEbook: MockEbook = {
      title: selectedMock.title,
      subtitle: selectedMock.subtitle,
      introduction: selectedMock.introduction,
      conclusion: selectedMock.conclusion,
      cta: selectedMock.cta,
      chapters: selectedMock.chapters.slice(0, requestedChaptersCount)
    };

    // Simulated weight / delay (1.5 seconds) for premium feel
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({ success: true, ebook: finalEbook, source: "mock" });
  } catch (err: unknown) {
    console.error("Erro na API de geração:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor de geração." },
      { status: 500 }
    );
  }
}
