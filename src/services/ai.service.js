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
  const fetchPromise = fetch(OPENROUTER_API_URL, {
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
  try {
    const res = await fetchPromise;
    if (!res.ok) {
      console.error('HTTP error:', res)
      const errorText = await res.text();
      throw new Error(`AI request failed: ${res.status} ${errorText}`);
    }
    const result = await res.json();
    
    return result.choices?.[0]?.message?.content || 'Empty response';
  } catch (err) {
    throw err;
    console.error('AI error:', err);
  }
}

async function writeConfig(prompt) {
  let instruction = "";
  instruction += "Write a new Nginx configuration file based on the following description.";
  instruction += `\n\n${prompt}`;
  return await askOpenRouter(instruction);
}

async function formatConfig(configText) {
  let instruction = "";
  instruction += "Format the following Nginx configuration file using 2 spaces per indentation level (no tabs).";
  instruction += "\nIf you find any mistakes or potential issues, comment them inline using '# comment:'.";
  instruction += "\nDo not change the structure or logic of the config — only format and annotate.";
  instruction += `\nHere is the config: \n\n ${configText}`;
  
  return await askOpenRouter(instruction);
}

async function editConfig(configText, editPrompt) {
  let instruction = "";
  instruction += "Edit the following Nginx configuration according to the instructions below.";
  instruction += `\n"${editPrompt}"`;
  instruction += "\n\nHere is the config:\n";
  instruction += `${configText}`;
  instruction += "\n\nIf you find any mistakes or potential issues, comment them inline using '# comment:'.";
  return await askOpenRouter(instruction);
}

module.exports = {
  writeConfig,
  formatConfig,
  editConfig,
};