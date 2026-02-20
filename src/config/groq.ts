import "dotenv/config";
import Groq from "groq-sdk";

const apiKey = process.env.GROQ_KEY;
/**
 * Gera uma resenha crítica para um sumário de jornal utilizando a LPU do Groq.
 * @param texto O conteúdo original (Poema ou Crônica).
 * @param apiKey Sua chave de API do Groq Cloud.
 * @returns Apenas o texto da resenha ou string vazia em caso de erro.
 */
export async function gerarResenhaJornal(texto: string): Promise<string> {
    // Inicializa o cliente do Groq
    const groq = new Groq({
        apiKey: apiKey,
    });

    const systemPrompt = `Você é um editor literário sênior de um jornal cultural. 
    Sua tarefa é ler o texto enviado e produzir uma resenha concisa para a seção de "Destaques da Edição".
    
    Diretrizes:
    1. Identifique se a estrutura é de um poema (lírico, versificado) ou crônica (narrativa cotidiana).
    2. Escreva um resumo analítico de 2 a 3 frases.
    3. Use um tom sofisticado, porém acessível.
    4. FOCO: Não responda com "Aqui está o resumo" ou "Este texto é...". 
    5. SAÍDA: Retorne DIRETAMENTE o texto da resenha, começando imediatamente pelo conteúdo.`;

    try {
        const chatCompletion = await groq.chat.completions.create({
            // Modelos sugeridos: "llama-3.3-70b-versatile" ou "mixtral-8x7b-32768"
            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: texto,
                },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
            top_p: 1,
            stream: false,
        });

        return chatCompletion.choices[0]?.message?.content?.trim() || "";
    } catch (error) {
        console.error("Falha na integração com Groq:", error);
        return "";
    }
}
