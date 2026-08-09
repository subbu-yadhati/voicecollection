const { GoogleGenerativeAI } = require('@google/generative-ai');

const THEMES = [
  'modern technology and AI tools in daily life and engineering',
  'academic research, coding, and web development experiences',
  'speech processing, audio recordings, and multilingual dataset collection',
  'daily college life, group discussions, and technology learning',
  'smartphones, internet connectivity, cloud storage, and mobile applications'
];

const DIVERSE_PASSAGES = [
  `Artificial Intelligence domain lo Machine Learning focus ekkuva ga undi. Computer algorithms access vast amounts of training data, identify complex patterns, and make highly accurate predictions without explicit manual programming. Research labs & academic institutions everyday scalable solutions execute chestunnaru. Speech Recognition & Natural Language Processing systems multilingual inputs accept cheyagalavu. Code-switching models evaluate cheyataniki naturally spoken data chala crucial. Participants real-world conversations record chesthe research accuracy improve avutundi.`,

  `Today's technology trends fast ga change avutunnayi. Software developers modern web frameworks and cloud infrastructure use chesi innovative products build chestunnaru. Everyday communication lo mana daily life and professional interactions lo English and Telugu words smoothly mix avutayi. Online learning platforms student education experience ki digital tools integrate chestunnayi. Academic researchers speech synthesis and voice collection benchmarks test cheyataniki real-world speech samples collect chestunnaru.`,

  `Deepfake Audio Detection research lo multilingual speech processing ki high demand undi. Acoustic features like MFCCs, Spectrograms, and Pitch cadence clear ga capture cheydaniki high quality voice recordings require autayi. Participants Telugu and English natural flow lo conversation speak chesthunapudu phonetic boundaries clear ga map chestamu. This dataset directly helps build robust synthetic voice classifiers.`,

  `Data privacy & encryption standards online platforms lo standards safeguard cheydaniki encryption mechanisms build chestunnaru. User voice samples complete anonymization tho store chestamu. Academic researchers open-source language models refine cheyataniki cross-lingual acoustic datasets collect chestunnaru. Contributing your voice empowers reliable speech recognition for Indian regional languages.`
];

let currentPassageIndex = 0;

const generatePassageText = async () => {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log(apiKey)

  if (apiKey && apiKey !== 'your_gemini_api_key_here') {
    const candidateModels = [
      'gemini-flash-latest',
      'gemini-2.0-flash',
      'gemini-3.6-flash',
      'gemini-flash-lite-latest'
    ];

    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const prompt = `Generate a natural Telugu-English code-switching speech passage for a participant to read aloud for approximately 5 minutes.

Requirements:
- Generate around 600–700 words.
- The passage should naturally mix Telugu and English.
- Write Telugu using English/Roman letters, not Telugu script.
- Make it sound like normal everyday conversation, not like an essay or AI-generated text.
- Use simple and familiar language.
- Include natural switching between Telugu and English throughout the passage.
- Cover everyday topics such as college, education, technology, family, friends, travel, social media, career, and daily life.
- Keep the speech as one continuous passage for a single speaker.
- Use different sentence lengths and natural conversational phrasing.
- Avoid difficult words, technical jargon, numbers, URLs, emojis, bullet points, headings, and special symbols.
- Do not include questions and answers or dialogue between multiple people.
- Do not explain the passage or add any introduction.
- Output only the passage that the participant should read.

The final passage should be approximately 5 minutes long when spoken naturally at a normal conversational pace.`;

    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result?.response?.text();

        if (text && text.trim().length > 30) {
          console.log(`[Gemini AI] Successfully generated dynamic code-switching passage using ${modelName}`);
          return text.trim();
        }
      } catch (err) {
        console.warn(`[Gemini AI Warning] Model ${modelName} returned: ${err.message}`);
      }
    }
  }

  // Fallback to rotating diverse curated passages if AI quota or key is inactive
  const selectedPassage = DIVERSE_PASSAGES[currentPassageIndex];
  currentPassageIndex = (currentPassageIndex + 1) % DIVERSE_PASSAGES.length;
  console.log(`[Backend API] Serving curated research passage #${currentPassageIndex}`);
  return selectedPassage;
};

module.exports = {
  generatePassageText
};
