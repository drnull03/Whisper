import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY } from "$env/static/private";
import { json } from "@sveltejs/kit";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

export const POST = async ({ request }) => {
    const { context, prompt } = await request.json();

    if(!context || !prompt) {
        return json({ status: false, message: "Please provide both context and prompt" });
    }
    
    const messages = [
        {
            role: "system",
            content: `${context}`
        },
        {
            role: "user",
            content: `${prompt}`
        }
    ]

    const completion = await client.chat.completions.create({
        model: "deepseek-chat",
        messages,
        max_tokens: 8192
    });

    if(!completion) {
        return json({ status: false, message: "Error occurred, try again." });
    }

    const generatedEmail = completion.choices[0].message.content;
    const rawCompletion = completion;
    const { usage } = completion;

    return json({ status: true, data: { rawCompletion, generatedEmail, usage } });
}