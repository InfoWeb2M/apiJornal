import axios from "axios";

export async function sendEmail(
    title: string,
    content = "nova notícia publicada, corra para ver no nosso site <3",
    newstype: string,
) {
    try {
        const response = await axios.post("http://localhost:1992/webhook/news", {
            title,
            content,
            newstype,
        });
        console.log(response.data);
    } catch (error: any) {
        if (error.response) {
            console.log("Erro da API:", error.response.status);
            console.log(error.response.data);
        } else {
            console.log("Erro geral:", error.message);
        }
    }
}
