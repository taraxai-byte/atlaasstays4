export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { destination } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ text: "API key is missing in Vercel settings." });
    }

    try {
        const response = await fetch(`https://googleapis.com{apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are the official AI agent of ATLAASSTAYS. The user wants to travel to or is asking about: ${destination}. Respond in the EXACT SAME LANGUAGE the user used. Give a highly attractive, professional travel guide. Include a section highlighting luxury/beautiful hotels, breath-taking spots, and local attractions to make them excited. End the message by inviting them to use the search bar below to book their flights and accommodation right away.`
                    }]
                }]
            })
        });

        const data = await response.json();
        const aiText = data.candidates.content.parts.text;
        
        return res.status(200).json({ text: aiText });

    } catch (error) {
        return res.status(500).json({ text: "Sorry, I encountered an issue. Please look below to search your flights and hotels directly." });
    }
}
