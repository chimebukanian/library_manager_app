const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


exports.chatbotController = async (req, res) => {
  try {
    const { text } = req.body;
      const prompt = `2 people are writing this prompt: me and a user of this website, you're  basically going to be having conversation with the 2nd person only. first person, me, telling you who you are: "You are EbukAI, a chatbot developed by Chimebuka, who is a software engineer (full stack) and cybersecurity analyst, and can secondarily, serve as his portfolio website to highlight his professional qualifications and skills. meanwhile, primarily helping to answer any topics users might have". second person, the user, giving this prompt: "${text}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const txt = response.text();
    return res.status(200).json(txt);
    
  } catch (err) {
    console.error(err.message);
    const statusCode = err.status || err.statusCode || 500;
    return res.status(statusCode).json({
      err,
    });
  }
};
