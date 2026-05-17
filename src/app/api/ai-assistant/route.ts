import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, action, instruction, tone } = await request.json();

    if (!text || !action) {
      return NextResponse.json(
        { error: "Parâmetros 'text' e 'action' são obrigatórios." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY || "";
    const isOpenAIConfigured = apiKey && !apiKey.includes("sua-chave");

    // 1. IF REAL OPENAI IS CONFIGURED
    if (isOpenAIConfigured) {
      let prompt = "";
      if (action === "improve") {
        prompt = `Melhore a escrita do seguinte texto, tornando-o mais elegante, impactante, profissional e envolvente. Mantenha a estrutura em Markdown:\n\n"${text}"`;
      } else if (action === "expand") {
        prompt = `Expanda o seguinte texto adicionando um ou dois parágrafos extremamente aprofundados, ricos em informações práticas e insights relevantes. Mantenha o formato Markdown:\n\n"${text}"`;
      } else if (action === "grammar") {
        prompt = `Corrija quaisquer erros gramaticais, ortográficos, de concordância e pontuação no seguinte texto. Retorne apenas o texto corrigido formatado em Markdown:\n\n"${text}"`;
      } else if (action === "tone") {
        prompt = `Reescreva o seguinte texto mudando o tom de voz para "${tone || "Profissional"}". O texto deve adotar as nuances adequadas (seja inspirador, persuasivo para vendas, ou técnico e analítico). Mantenha a estrutura Markdown:\n\n"${text}"`;
      } else if (action === "custom") {
        prompt = `Modifique o seguinte texto com base nesta instrução específica: "${instruction}". Mantenha o formato Markdown:\n\n"${text}"`;
      }

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "Você é um assistente editorial de IA de elite especializado em aprimorar textos de ebooks profissionais."
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
          throw new Error("Erro na comunicação com a OpenAI.");
        }

        const data = await response.json();
        const revisedText = data.choices[0].message.content.trim();
        return NextResponse.json({ success: true, text: revisedText, source: "openai" });
      } catch (err: unknown) {
        console.error("Erro no Assistente OpenAI:", err);
        const errMsg = err instanceof Error ? err.message : "Erro desconhecido.";
        return NextResponse.json(
          { error: `Erro no assistente de IA: ${errMsg}` },
          { status: 500 }
        );
      }
    }

    // 2. PREMIUM MOCK FALLBACK (If OpenAI API Key is placeholder/missing)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    let mockRevisedText = text;
    if (action === "improve") {
      mockRevisedText = `***[Melhorado por IA]***\n\n${text}\n\n*Nota: O conteúdo acima foi otimizado com técnicas avançadas de posicionamento premium, estruturado de forma a reter a atenção do leitor e convertê-lo através de gatilhos mentais altamente persuasivos.*`;
    } else if (action === "expand") {
      mockRevisedText = `${text}\n\n### Aprofundamento Estratégico com IA\n\nPara expandir este conceito a nível de excelência, é crucial compreender que a aplicação prática destas metodologias exige consistência. Análises recentes de mercado mostram que empresas de alta performance que investem na otimização contínua de processos obtêm um incremento de até 40% na retenção de clientes. \n\nAlém disso, a integração de fluxos automatizados baseados em comportamento de usuário elimina fricções tradicionais, permitindo que a entrega de valor seja escalada de forma orgânica e previsível.`;
    } else if (action === "grammar") {
      mockRevisedText = `***[Corrigido Gramaticalmente]***\n\n${text.replace(/tá/g, "está").replace(/pra/g, "para")}`;
    } else if (action === "tone") {
      mockRevisedText = `***[Tom alterado para: ${tone || "Profissional"}]***\n\n${text}\n\n*(Este trecho foi reescrito adotando diretrizes de comunicação focadas em ressonância emocional e autoridade técnica no nicho selecionado).*`;
    } else if (action === "custom") {
      mockRevisedText = `***[IA executou: ${instruction}]***\n\n${text}`;
    }

    return NextResponse.json({ success: true, text: mockRevisedText, source: "mock" });
  } catch (err: unknown) {
    console.error("Erro no servidor de IA:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor do assistente de IA." },
      { status: 500 }
    );
  }
}
