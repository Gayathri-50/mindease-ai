const express = require("express");
const router = express.Router();

const EMERGENCY_KEYWORDS = [
  "self harm",
  "suicide",
  "want to die",
  "kill myself",
  "hurt myself",
  "end it all",
  "take my life",
  "die by suicide",
  "can't go on",
  "cant go on",
  "ending it"
];

const RESPONSE_CATEGORIES = [
  {
    keywords: ["sad", "depressed", "lonely"],
    responses: [
      "I'm sorry you're feeling sad right now. It's okay to take a moment and be gentle with yourself.",
      "That feeling is valid, and you're not alone. Would you like to talk about what's weighing on you?",
      "Sometimes sadness comes in waves. I'm here with you while you ride it out.",
      "You are doing a strong thing by noticing how you feel. Your emotions matter.",
      "When you feel low, small supportive steps can help. What feels manageable right now?"
    ],
  },
  {
    keywords: ["stress", "anxiety", "tired"],
    responses: [
      "Stress can feel overwhelming, but you're doing something healthy by sharing it.",
      "Take a gentle breath. What is one small thing you can do right now to feel a little calmer?",
      "Anxiety often appears when we feel overextended. You deserve a safe moment of rest.",
      "It's okay to slow down and give yourself permission to pause.",
      "I'm here to help you find a quiet moment, even if it's just for a short while."
    ],
  },
  {
    keywords: ["motivation", "help", "support", "hope"],
    responses: [
      "It's a brave thing to ask for help. I'm here with compassionate support.",
      "You have strength inside you, even if it feels hard to see it right now.",
      "Motivation can return when you take a gentle next step. What would feel supportive?",
      "When help feels needed, that is exactly the right time to reach out.",
      "I'm here to help you connect with calm, clarity, and care."
    ],
  },
  {
    keywords: ["happy", "excited"],
    responses: [
      "That energy feels wonderful. What's giving you joy today?",
      "I love hearing that you feel excited. Celebrate that spark in your own way.",
      "Happiness can be a gentle reminder of the good moments you're creating.",
      "Your positivity matters. How can I support you in keeping that momentum?",
      "It's great to hear good news. Share more if you feel like it."
    ],
  },
  {
    keywords: ["depressed", "alone", "isolated", "lonely"],
    responses: [
      "Feeling alone can be heavy, but reaching out is a strong step.",
      "You are not alone in this. I'm here to listen and support you compassionately.",
      "It can help to name what you're feeling. Would you like to describe it a little more?",
      "Your experience matters, and I'm here to sit with you through it.",
      "Even small moments of care can help when depression feels hard."
    ],
  },
];

const GENERIC_RESPONSES = [
  "I'm here to support you. What would you like to explore together?",
  "Thank you for sharing. Let's take this one step at a time.",
  "I'm listening. Tell me more when you feel ready.",
  "Your wellbeing matters, and I'm here to offer calm support.",
  "It helps to name what you're feeling. I'm here with you.",
  "I care about how you're doing. Let's find a gentle next step.",
  "Whenever you're ready, I'm here to help you process what's on your mind.",
  "You deserve compassionate support. I'm here to help you feel more grounded.",
  "I'm with you and ready to help in a thoughtful, caring way.",
  "If you feel comfortable, tell me more about what's been on your mind."
];

const CRISIS_RESPONSES = [
  "I'm really sorry you're feeling this way. If you're thinking about hurting yourself, please contact your local crisis line or emergency services immediately.",
  "You matter, and your safety matters. Please reach out to someone you trust or a crisis hotline right now.",
  "If you are in danger or feel like you may act on these thoughts, please call your local emergency service or suicide prevention hotline now.",
  "I care about your wellbeing. If you can, please connect with a trusted person or crisis support immediately.",
  "These feelings are serious. Please seek immediate help from a crisis line, medical professional, or a trusted loved one."
];

const randomResponse = (list) => list[Math.floor(Math.random() * list.length)];

async function generateWellnessReply(message) {
  const normalized = String(message || "").trim().toLowerCase();

  if (!normalized) {
    return "Please share a bit more about how you're feeling so I can support you.";
  }

  const hasEmergency = EMERGENCY_KEYWORDS.some((keyword) => normalized.includes(keyword));
  if (hasEmergency) {
    return randomResponse(CRISIS_RESPONSES);
  }

  for (const category of RESPONSE_CATEGORIES) {
    const matched = category.keywords.some((keyword) => normalized.includes(keyword));
    if (matched) {
      return randomResponse(category.responses);
    }
  }

  return randomResponse(GENERIC_RESPONSES);
}

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Request must include a non-empty 'message' string.",
      });
    }

    const reply = await generateWellnessReply(message);
    return res.json({ reply });
  } catch (error) {
    console.error("chatRoutes /chat error:", error);
    return res.status(500).json({
      error: "Unable to generate a wellness response at this time. Please try again later.",
    });
  }
});

module.exports = router;

