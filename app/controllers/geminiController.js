const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


exports.chatbotController = async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `You are EbukAI, a chatbot developed by Chimebuka, who is a software engineer and cybersecurity analyst. ${text}`;
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
