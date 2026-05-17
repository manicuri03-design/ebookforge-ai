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
      "content": "Conteúdo completo e aprofundado do Capítulo 1 em Markdown..."
    },
    ... (gerar exatamente a quantidade de capítulos solicitada)
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
                content: "Você é um gerador de ebooks especializado em retornar respostas estritamente no formato JSON estruturado."
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
        console.error("Erro na chamada OpenAI:", err);
        const errMsg = err instanceof Error ? err.message : "Tente novamente.";
        return NextResponse.json(
          { error: `Erro na geração de IA: ${errMsg}` },
          { status: 500 }
        );
      }
    }

    // 2. PREMIUM MOCK FALLBACK (If OpenAI API Key is placeholder/missing)
    // Generates fully structured, extremely high-quality, category-specific ebooks
    const fallbackEbooks: Record<string, MockEbook> = {
      cristao: {
        title: title || "Prosperidade à Luz da Palavra",
        subtitle: "Como administrar seus recursos financeiros segundo os princípios eternos das Escrituras",
        introduction: `## Introdução: O Propósito Divino para as suas Finanças\n\nA verdadeira prosperidade não se mede pelo acúmulo egoísta de riquezas, mas pela fidelidade na administração dos recursos que nos foram confiados. Quando alinhamos nossa vida financeira com a sabedoria das Escrituras, experimentamos não apenas estabilidade material, mas paz espiritual.\n\nEste livro foi desenhado para guiar você em uma jornada prática de transformação financeira, abordando temas fundamentais como a mordomia, o perigo das dívidas e o poder da generosidade. Prepare-se para ver suas finanças sob a ótica da fé.`,
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
          }
        ]
      },
      devocional: {
        title: title || "Devocionais para o Fortalecimento Diário",
        subtitle: "Minutos diários de reflexão, oração e renovação espiritual na presença do Pai",
        introduction: `## Introdução: Criando o Hábito do Altar Diário\n\nEm um mundo acelerado e barulhento, encontrar um refúgio diário de silêncio e meditação na Palavra é essencial para a saúde da nossa alma. O devocional diário não é uma tarefa religiosa, mas um momento de relacionamento íntimo com o Criador, onde somos alimentados, guiados e revigorados para enfrentar os desafios cotidianos.`,
        conclusion: `## Conclusão: Caminhando Sob a Luz da Presença\n\nQue este devocional tenha sido uma semente de fé no seu coração. A vida com Deus é construída passo a passo, dia após dia. Mantenha seu altar aceso, sua mente focada nas promessas divinas e seus pés alinhados com o propósito de Deus.`,
        cta: `### ✨ Participe da Nossa Comunidade de Oração\n\nJunte-se a milhares de irmãos em nossa jornada de devocionais ao vivo todas as manhãs. [Clique aqui para se inscrever gratuitamente].`,
        chapters: [
          {
            title: "Dia 1: A Importância de Estar no Silêncio",
            content: `### Meditação do Dia\n\n"Aquietai-vos e sabei que eu sou Deus" (Salmo 46:10). Em meio ao ruído de notificações e compromissos, a voz de Deus é ouvida no sussurro. Quando silenciamos nossos medos e aflições, a paz de Cristo assume o controle.\n\n*   **Reflexão**: O que tem ocupado o espaço do seu silêncio com Deus?\n*   **Oração**: "Pai, ajuda-me a parar hoje, silenciar o barulho ao meu redor e escutar a Tua voz suave."`
          },
          {
            title: "Dia 2: Renovando as Forças no Cansaço",
            content: `### Meditação do Dia\n\n"Mas os que esperam no Senhor renovarão as suas forças" (Isaías 40:31). O cansaço físico e mental pode nublar nossa visão de fé. Esperar em Deus não é inatividade, mas confiança active na fidelidade de quem prometeu.\n\n*   **Reflexão**: Em que área você se sente esgotado hoje?\n*   **Oração**: "Senhor, coloco minhas fraquezas aos Teus pés. Renova meu vigor, minha mente e meu espírito neste dia."`
          },
          {
            title: "Dia 3: O Escudo da Fé Contra as Preocupações",
            content: `### Meditação do Dia\n\n"Não andeis ansiosos por coisa alguma..." (Filipenses 4:6). A preocupação é a fé no pior cenário possível. Combata-a entregando cada aflição através de orações sinceras e corações gratos.\n\n*   **Reflexão**: Qual ansiedade você precisa entregar hoje?\n*   **Oração**: "Pai Altíssimo, deposito minhas incertezas em Teu altar. Escolho descansar sob o Teu cuidado perfeito."`
          }
        ]
      },
      ansiedade: {
        title: title || "Vencendo a Ansiedade com Equilíbrio",
        subtitle: "Um guia prático de psicologia cognitiva e hábitos saudáveis para resgatar sua paz mental",
        introduction: `## Introdução: Compreendendo a Mente Ansiosa\n\nA ansiedade não é um sinal de fraqueza, mas um mecanismo de alerta biológico que saiu do controle. Em nossa sociedade acelerada, aprender a acalmar o sistema nervoso e reestruturar pensamentos disfuncionais é um ato de autocuidado e sobrevivência.\n\nEste ebook traz ferramentas baseadas em evidências para ajudar você a domar o estresse, reconectar-se com o presente e retomar o leme da sua própria vida.`,
        conclusion: `## Conclusão: A Paz é uma Construção Diária\n\nSuperar a ansiedade não significa nunca mais sentir medo ou estresse, mas aprender a não se deixar dominar por eles. Seja paciente com o seu processo. Cada respiração consciente e cada pensamento reestruturado são passos sólidos em direção à sua liberdade emocional.`,
        cta: `### 🌿 Acompanhamento Profissional Especializado\n\nDeseja realizar sessões práticas de controle emocional com terapeutas credenciados? Conheça nosso programa MindBalance. [Inscreva-se na nossa Lista de Espera].`,
        chapters: [
          {
            title: "Capítulo 1: O Ciclo Fisiológico da Ansiedade",
            content: `### O Mecanismo de Luta ou Fuga\n\nQuando nos sentimos ameaçados (seja por um prazo no trabalho ou uma preocupação financeira), o cérebro ativa a amígdala, liberando cortisol e adrenalina. Isso acelera os batimentos, tensiona os músculos e altera a respiração.\n\n*   **A Ameaça Percebida**: Nem sempre é real ou imediata.\n*   **A Reação do Corpo**: Sintomas físicos incômodos.\n\nAprender a identificar que esses sintomas são apenas uma reação física inofensiva é o primeiro passo para desarmar a crise de ansiedade antes que ela cresça.`
          },
          {
            title: "Capítulo 2: Técnicas de Respiração e Ancoragem",
            content: `### Exercício Respiratório Quadrado (4x4)\n\nUma das formas mais rápidas de acalmar o cérebro é atuando no nervo vago através da respiração regulada. O método quadrado funciona assim:\n\n1.  **Inale** pelo nariz contando até 4 segundos.\n2.  **Prenda** o ar contando até 4 segundos.\n3.  **Exale** suavemente pela boca contando até 4 segundos.\n4.  **Mantenha** os pulmões vazios contando até 4 segundos.\n\nRepita o ciclo por 5 minutos para desacelerar os batimentos cardíacos instantaneamente.`
          },
          {
            title: "Capítulo 3: Reestruturação Cognitiva na Prática",
            content: `### Questionando Seus Pensamentos\n\nNossos pensamentos ansiosos costumam ser distorcidos pela catastrofização (imaginar sempre o pior). Diante de um pensamento limitante, faça a si mesmo três perguntas cruciais:\n\n1.  *Quais são as evidências reais de que esse pensamento é verdadeiro?*\n2.  *Existe outra forma mais realista de enxergar essa situação?*\n3.  *Se o pior acontecer, o que eu posso fazer de prático para lidar com isso?*\n\nSubstitua hipóteses catastróficas por fatos objetivos.`
          }
        ]
      },
      "renda extra": {
        title: title || "Segredos da Renda Extra na Era Digital",
        subtitle: "Como monetizar suas habilidades e criar novas fontes de faturamento trabalhando de casa",
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
            content: `### Empacotando Seu Conhecimento\n\nSe você domina um assunto (seja culinária, finanças, adestramento de cães ou Excel), você pode empacotar esse conhecimento em um produto digital rápido de consumir:\n\n1.  **Ebooks e Guias Práticos**: PDFs objetivos focados em resolver uma dor específica.\n2.  **Templates e Planilhas**: Recursos prontos que poupam tempo do comprador.\n\nHospede seu produto em plataformas de checkout inteligente (Kiwify, Hotmart) e faça divulgações estratégicas no Instagram ou através de tráfego pago para gerar vendas automáticas.`
          },
          {
            title: "Capítulo 3: Introdução ao Mercado de Afiliados",
            content: `### Vendendo sem Ter Estoque\n\nO mercado de afiliados permite que você receba comissões elevadas (geralmente entre 40% a 70%) promovendo produtos físicos ou digitais de terceiros.\n\n*   **Passo 1**: Cadastre-se em uma plataforma de afiliados.\n*   **Passo 2**: Escolha produtos com alta conversão e boa reputação.\n*   **Passo 3**: Crie canais de conteúdo (blogs, perfis de nicho, canais no YouTube) ou campanhas de tráfego pago direcionadas à página de vendas do produtor.`
          }
        ]
      }
    };

    // Fallback selection algorithm: Match requested category, or use 'marketing digital' / default
    const formattedCategory = category.toLowerCase().trim();
    let selectedMock = fallbackEbooks[formattedCategory];

    if (!selectedMock) {
      // General marketing / motivational fallback template
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
          }
        ]
      };
    }

    // Let's add simulated generation lag on the server side if it's mock (typically 1.5 seconds)
    // to give it a realistic processing weight, but still super fast
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return NextResponse.json({ success: true, ebook: selectedMock, source: "mock" });
  } catch (err: unknown) {
    console.error("Erro na API de geração:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor de geração." },
      { status: 500 }
    );
  }
}
