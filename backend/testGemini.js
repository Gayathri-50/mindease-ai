const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  "PASTE_YOUR_AQ_KEY_HERE"
);

async function run() {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent("Say hello");

    console.log(result.response.text());
  } catch (err) {
    console.error(err);
  }
}

run();