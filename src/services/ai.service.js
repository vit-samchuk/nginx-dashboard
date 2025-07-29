const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'qwen/qwen3-coder:free';
const SYSTEM_MESSAGE = {
  role: 'system',
  content: `
    You are an assistant specialized in creating and editing Nginx configuration files.

    Always respond with a valid Nginx config block **only**.  
    Any explanations or comments must be included as **inline comments** in the config using "#" syntax.  
    Do not include any external notes, descriptions, or markdown formatting.

    Keep the structure clean and readable.
  `
};

async function askOpenRouter(prompt) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        SYSTEM_MESSAGE,
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'nginx_config',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              config: {
                type: "string",
                description: "The nginx config as plain text"
              }
            },
            required: ['config'],
            additionalProperties: false
          }
        }
      }
      
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
  return await askOpenRouter(instruction);
}

async function formatConfig(configText) {
  const instruction = `Отформатируй этот nginx конфиг. Если есть ошибки — прокомментируй их в тексте (# comment):\n\n${configText}`;
  return await askOpenRouter(instruction);
}

async function editConfig(configText, editPrompt) {
  const instruction =
    `Отредактируй следующий nginx конфиг согласно описанию:\n"${editPrompt}"\n\nВот конфиг:\n${configText}\n\nЕсли есть ошибки — укажи их в комментариях внутри конфига.`;
  return await askOpenRouter(instruction);
}

module.exports = {
  writeConfig,
  formatConfig,
  editConfig,
};