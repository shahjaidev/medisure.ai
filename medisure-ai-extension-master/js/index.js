const OpenAI = require('openai-api');
const OPEN_AI_API_KEY = pk-GQH5qcK9ibSuu6Ml0T2NZUaNbml0Qz5Jr0O6ZDGJ
const openai = new OpenAI(OPEN_AI_API_KEY);
 
(async () => {
  const gptResponse = await openai.complete({
    engine: 'davinci',
    prompt: 'this is a test',
    maxTokens: 5,
    temperature: 0.9,
    topP: 1,
    n: 1,
    stream: false,
    stop: ['\n', "testing"]
  });
  
  console.log(gptResponse.data);
})();
 
(async () => {
  const gptResponse = await openai.search({
    engine: 'davinci',
    documents: ["White House", "hospital", "school"],
    query: "the president"
  });
  
  console.log(gptResponse.data);
})();