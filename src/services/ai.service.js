//const fetch = require('node-fetch');

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;
const TOGETHER_API_URL = 'https://api.together.xyz/v1/chat/completions';
const MODEL = 'codellama/CodeLlama-13B-Instruct-hf';

async function askTogetherAI(prompt) {
  const response = await fetch(TOGETHER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI request failed: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return result.choices?.[0]?.message?.content || 'Empty response';
}

async function writeConfig(prompt) {
  const instruction = `Напиши новый nginx конфиг по следующему описанию:\n\n${prompt}`;
  return await askTogetherAI(instruction);
}

async function formatConfig(configText) {
  const instruction = `Отформатируй этот nginx конфиг. Если есть ошибки — прокомментируй их в тексте (# comment):\n\n${configText}`;
  return await askTogetherAI(instruction);
}

async function editConfig(configText, editPrompt) {
  const instruction = `Отредактируй следующий nginx конфиг согласно описанию:\n"${editPrompt}"\n\nВот конфиг:\n${configText}\n\nЕсли есть ошибки — укажи их в комментариях внутри конфига.`;
  return await askTogetherAI(instruction);
}

module.exports = {
  writeConfig,
  formatConfig,
  editConfig,
};
