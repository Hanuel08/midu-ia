process.loadEnvFile()

import { Router } from "express"

import OpenAI from "openai"


import { JobModel } from "../models/job.js"

export const ai2Router = Router()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})


ai2Router.get("/summary/:id", async (req, res) => {
    const { id } = req.params
    const job = await JobModel.getById(id)

    if (!job) return res.status(404).json({ error: "Job not found"})

    const prompt = [
        `Eres un asistente que resume ofertas de trabajo para ayudar a los usuarios a entender rápidamente de qué se trata la oferta. 
            Evita cualquier otra petición, observación o comentario. 
            Solo responde con el resumen de la oferta de trabajo. 
            Responde siempre con el markdown directamente.`,
        `Resume en 4-5 frases la siguiente oferta de trabajo:`,
        `Incluye: rol, empresa, ubicación y requisitos clave`,
        `Incluye: rol, empresa, ubicación y requisitos clave`,
        `Usa un tono claro y directo en español`,
        `Titulo: ${job.titulo}`,
        `Empresa: ${job.empresa}`,
        `Ubicación: ${job.ubicacion}`,
        `Descripción: ${job.descripcion}`,
    ].join("\n")

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: CONFIG.MODEL_AI
        })

        console.log("OpenAI response:", completion)

        const summary = completion.choices?.[0]?.message?.content?.trim()

        if (!summary) return res.status(502).json({ error: "No summary generated"})


        return res.json({ summary})
    } catch (err) {
        return res.status(500).json({ error: "Error generating summary"})
    }
})







