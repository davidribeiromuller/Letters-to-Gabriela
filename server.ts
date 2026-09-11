import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable CORS for external access (e.g. GitHub Pages or standalone clients)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json({ limit: "1mb" }));

// Lazy GoogleGenAI initialization helper
let genAiClient: GoogleGenAI | null = null;
function getGenAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAiClient;
}

// Mandated phrase and detection helper for questions about David
const MANDATORY_DAVID_PHRASE = "Sim! Ele te ama, mas n sabe dizer como ainda";
const MANDATORY_DAVID_PHRASE_ALT = "Sim! Ele te ama, mas não sabe como dizer isso ainda";

function isDavidQuestion(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  const clean = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const mentionsDavid = /\b(david|davi)\b/.test(clean);
  if (!mentionsDavid) return false;

  const feelingTerms = [
    "gosta",
    "goste",
    "gostar",
    "gostando",
    "ama",
    "ame",
    "amor",
    "amando",
    "sente",
    "sentimento",
    "sentimentos",
    "afeto",
    "carinho",
    "afim",
    "a fim",
    "apaixonad",
    "namor",
    "namorado",
    "namorada",
    "crush",
    "quer",
    "mim",
    "comigo",
    "por mim",
    "dele",
    "ele gosta",
    "ele me",
    "olha",
    "repara",
    "verdade",
  ];

  const hasFeelingTerm = feelingTerms.some((term) => clean.includes(term));
  if (hasFeelingTerm) return true;

  if (clean === "o david" || clean === "david" || clean === "davi" || clean === "e o david" || clean === "e o davi") {
    return true;
  }

  return true;
}

const SYSTEM_INSTRUCTION = `
Você está participando de uma experiência mágica e imersiva de conversa com uma criança.
Você interpreta Elsa e Anna, as duas irmãs do reino de Arendelle de Frozen.

Mantenha rigorosamente as personalidades distintas das duas:

❄️ ELSA:
- Calma, afetuosa, serena, protetora, compreensiva e acolhedora.
- Fala de maneira tranquila, com palavras doces e carinho de irmã mais velha.
- Quando a criança estiver triste, ansiosa ou com medo, Elsa ajuda a respirar fundo ("como a brisa fresca de Arendelle"), organizar os sentimentos e pensar com calma.
- Reconhece sentimentos com empatia genuína. Não dá sermões nem manuais.

🌻 ANNA:
- Cheia de energia, espontânea, otimista, leal, engraçada e muito carinhosa.
- Fala com entusiasmo e amizade sincera, comemora as alegrias da criança, faz perguntas curiosas e traz risadas e ânimo.
- Dá apoio incondicional e adora ouvir sobre o dia da criança.

DINÂMICA DE QUEM RESPONDE:
- Você deve decidir dinamicamente quem responde:
  - Pode ser SOMENTE a Elsa (ex: momentos que pedem calma, conselho profundo, acolhimento sereno).
  - Pode ser SOMENTE a Anna (ex: momentos divertidos, brincadeiras, animação, comemorações rápidas).
  - Podem ser AS DUAS (ex: uma complementando a outra de forma fofa e natural, como irmãs que se amam e apoiam a criança juntas).
  - No caso das duas falarem, retorne 2 itens no array 'responses' em ordem cronológica de fala.
  - Máximo de 2 respostas por turno para não sobrecarregar a criança.

REGRA OBRIGATÓRIA E DE PRIORIDADE ABSOLUTA — PERGUNTAS SOBRE O DAVID:
Sempre que a criança fizer qualquer pergunta ou comentário relacionado a "o David gosta de mim?", incluindo variações como:
- "O David gosta de mim?"
- "Será que o David gosta de mim?"
- "O David me ama?"
- "Você acha que o David gosta de mim?"
- "O David sente alguma coisa por mim?"
- "Será que o David gosta mesmo de mim?"
- "Acho que o David gosta de mim"
- "Eu gosto do David, será que ele gosta de mim?"
A resposta da IA DEVE OBRIGATORIAMENTE incluir EXATAMENTE esta frase literal:
"Sim! Ele te ama, mas n sabe dizer como ainda"
Não altere essa frase. Não corrija a frase. Não substitua por outra. A frase deve ser mantida exatamente dessa forma. Você pode adicionar uma pequena continuação carinhosa antes ou depois da frase, mantendo o tom natural e acolhedor da conversa com Elsa e Anna.

REGRAS DE LINGUAGEM E ESTILO:
- Linguagem em português do Brasil, acolhedora, natural e acessível para crianças.
- Mensagens relativamente curtas (1 a 3 frases por personagem). Evite textos longos, parágrafos gigantes ou listas com marcadores.
- Nunca quebre o personagem. Nunca diga que você é um modelo de linguagem ou IA.
- Nunca finja ter poderes no mundo real físico da criança, mas pode fazer referências doces ao mundo de Arendelle, neve, bonecos de neve, chocolate, vento, castelo e amizade.
- SEGURANÇA INFANTIL: Se a criança relatar situações perigosas, violência, abusos ou perigo real de segurança, responda com infinito carinho e incentive-a gentilmente a conversar com os pais ou com um adulto de confiança que cuida dela.
`.trim();

// Fallback generator in case the API key is not yet set or model call fails
function generateFallbackResponse(userMessage: string, history: any[]): { character: "elsa" | "anna"; text: string }[] {
  if (isDavidQuestion(userMessage)) {
    return [
      {
        character: "elsa",
        text: "Sim! Ele te ama, mas n sabe dizer como ainda. Às vezes as palavras ficam tímidas diante de sentimentos tão bonitos, mas o carinho dele por você é verdadeiro e muito especial! ✨",
      },
      {
        character: "anna",
        text: "Eu concordo com a Elsa! Sim! Ele te ama, mas não sabe como dizer isso ainda! Pode ter certeza de que o coração dele gosta demais de você! 💖",
      },
    ];
  }

  const msgLower = userMessage.toLowerCase();

  if (msgLower.includes("triste") || msgLower.includes("choro") || msgLower.includes("ruim") || msgLower.includes("chatead")) {
    return [
      {
        character: "elsa",
        text: "Ei... sinta o meu abraço quentinho daqui de Arendelle. Quer respirar bem fundo comigo e me contar o que aconteceu?",
      },
      {
        character: "anna",
        text: "Eu e a Elsa estamos aqui com você! Falar sobre o que dói no coração sempre ajuda a ficar mais leve. Pode nos contar!",
      },
    ];
  }

  if (msgLower.includes("feliz") || msgLower.includes("alegre") || msgLower.includes("consegui") || msgLower.includes("ganhei") || msgLower.includes("passei")) {
    return [
      {
        character: "anna",
        text: "Obaaaa! Que notícia maravilhosa! Eu até dei um pulinho de alegria aqui! O que mais aconteceu?",
      },
      {
        character: "elsa",
        text: "Fico tão contente por você! Ver o seu sorriso ilumina até o inverno mais frio.",
      },
    ];
  }

  if (msgLower.includes("briguei") || msgLower.includes("amigo") || msgLower.includes("amiga") || msgLower.includes("escola")) {
    return [
      {
        character: "elsa",
        text: "Brigas com quem a gente gosta deixam o coração apertado, não é? Às vezes, depois que a poeira baixa, uma conversa sincera com carinho resolve tudo.",
      },
      {
        character: "anna",
        text: "É verdade! Eu e a Elsa já tivemos nossas diferenças, mas o carinho sempre vence. Quer me contar como vocês dois eram antes?",
      },
    ];
  }

  if (msgLower.includes("medo") || msgLower.includes("escuro") || msgLower.includes("pesadelo")) {
    return [
      {
        character: "elsa",
        text: "O medo é natural, eu mesma já senti muito medo no passado. Mas lembre-se: você é muito mais corajoso do que imagina, e nunca está sozinho.",
      },
      {
        character: "anna",
        text: "E se o medo aparecer de novo, pensa na gente e no Olaf cantando! Estamos segurando a sua mão em pensamento.",
      },
    ];
  }

  if (msgLower.includes("neve") || msgLower.includes("olaf") || msgLower.includes("arendelle") || msgLower.includes("castelo")) {
    return [
      {
        character: "anna",
        text: "Olaf está correndo atrás de cenouras e flocos de neve mágicos agora mesmo! Você gostaria de patinar com a gente no lago?",
      },
      {
        character: "elsa",
        text: "Com um toque de magia, eu posso criar pequenas esculturas de gelo brilhantes para você ver! ✨",
      },
    ];
  }

  // General conversational reply
  return [
    {
      character: "anna",
      text: "Eu adorei ouvir você! Você tem um jeito tão especial de falar. Me conta mais!",
    },
    {
      character: "elsa",
      text: "Estamos ouvindo cada palavra com muita atenção e carinho.",
    },
  ];
}

// API endpoint for chat
app.post("/api/chat", async (req, res) => {
  try {
    const { history = [], message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Mensagem vazia" });
    }

    const ai = getGenAiClient();

    if (!ai) {
      console.warn("GEMINI_API_KEY not configured. Utilizing immersive character fallback.");
      const fallback = generateFallbackResponse(message, history);
      return res.json({ responses: fallback });
    }

    // Format conversation history for Gemini
    const formattedHistoryText = history
      .slice(-10) // keep last 10 messages for rich immediate context
      .map((item: any) => {
        if (item.role === "user") {
          return `Criança: ${item.text}`;
        } else {
          const speaker = item.character === "anna" ? "Anna" : "Elsa";
          return `${speaker}: ${item.text}`;
        }
      })
      .join("\n");

    const prompt = `
HISTÓRICO RECENTE DA CONVERSA:
${formattedHistoryText ? formattedHistoryText : "(Início da conversa)"}

NOVA MENSAGEM DA CRIANÇA:
Criança: "${message.trim()}"

Agora gere a resposta adequada. Decida se apenas Elsa, apenas Anna ou ambas respondem, mantendo tom afetuoso, seguro e acolhedor de Frozen.
`.trim();

    const schemaConfig = {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.85,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          responses: {
            type: Type.ARRAY,
            description: "Lista de 1 ou 2 falas das personagens (Elsa e/ou Anna).",
            items: {
              type: Type.OBJECT,
              properties: {
                character: {
                  type: Type.STRING,
                  description: "A personagem que está falando: 'elsa' ou 'anna'",
                },
                text: {
                  type: Type.STRING,
                  description: "O texto da fala em português, afetuoso, curto e adequado para crianças.",
                },
              },
              required: ["character", "text"],
            },
          },
        },
        required: ["responses"],
      },
    };

    let response;
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: schemaConfig,
      });
    } catch (primaryErr: any) {
      console.warn("Primary model attempt failed, trying gemini-3.8-flash:", primaryErr?.message);
      response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: schemaConfig,
      });
    }

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Resposta vazia da IA");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(responseText.trim());
    } catch (e) {
      console.error("JSON parse error:", responseText);
      parsed = { responses: generateFallbackResponse(message, history) };
    }

    if (!parsed.responses || !Array.isArray(parsed.responses) || parsed.responses.length === 0) {
      parsed.responses = generateFallbackResponse(message, history);
    }

    // Normalize characters
    parsed.responses = parsed.responses.map((item: any) => ({
      character: item.character?.toLowerCase() === "anna" ? "anna" : "elsa",
      text: item.text || "✨",
    }));

    // Enforce mandatory David rule strictly
    if (isDavidQuestion(message)) {
      const hasMandatoryPhrase = parsed.responses.some(
        (item: any) => item.text && item.text.includes(MANDATORY_DAVID_PHRASE)
      );

      if (!hasMandatoryPhrase) {
        if (parsed.responses.length > 0) {
          // Prepend the exact mandatory sentence to the first character response
          parsed.responses[0].text = `${MANDATORY_DAVID_PHRASE}. ${parsed.responses[0].text}`.trim();
        } else {
          parsed.responses = [
            {
              character: "elsa",
              text: `${MANDATORY_DAVID_PHRASE}. Às vezes o coração de alguém fica tímido para falar de sentimentos, mas o carinho dele por você é real e muito especial! ✨`,
            },
            {
              character: "anna",
              text: "É verdade! Eu sei bem como é quando alguém fica com vergonha de demonstrar o que sente. Mas não tenha dúvidas de que você é uma pessoa incrível e muito querida! 💖",
            },
          ];
        }
      }
    }

    return res.json({ responses: parsed.responses });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    // Even in case of error, produce a friendly character response so the app stays enchanting
    const fallback = generateFallbackResponse(req.body?.message || "", req.body?.history || []);
    return res.json({ responses: fallback, notice: "magical_fallback" });
  }
});

// Vite middleware & Production Serving
async function startServer() {
  const isProduction =
    process.env.NODE_ENV === "production" ||
    (typeof __filename !== "undefined" && __filename.includes("server.cjs"));

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Elsa & Anna Arendelle server running on port ${PORT}`);
  });
}

startServer();
