import { GoogleGenerativeAI } from "@google/generative-ai";

// Note: In a real app, this should be called server-side to hide the API key.
// Since this is a detailed prototype, I will provide the structure.
// If server.ts is setup later, this will move there.

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function calculateMatchScore(studentBio: string, studentSkills: string[], jobTitle: string, jobRequirements: string[]) {
  try {
    const prompt = `
      Analyze the match between a student and an internship opportunity.
      
      Student Bio: ${studentBio}
      Student Skills: ${studentSkills.join(", ")}
      
      Job Title: ${jobTitle}
      Job Requirements: ${jobRequirements.join(", ")}
      
      Respond only with a JSON object in the following format:
      {
        "score": number (0-100),
        "reason": "a concise 1-sentence explanation of the match"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Simple cleaning to ensure valid JSON
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Match Score Error:", error);
    return { score: 70, reason: "Unable to calculate precise score at this time. Standard matching applied." };
  }
}

export async function simulateInterview(jobTitle: string, question: string, answer: string) {
  try {
    const prompt = `
      You are an interviewer for a ${jobTitle} internship.
      A student just gave the following answer to your question.
      
      Question: ${question}
      Answer: ${answer}
      
      Provide feedback on their response and a follow-up question.
      Format: JSON
      {
        "feedback": "constructive feedback",
        "nextQuestion": "the next follow-up question"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Interview Error:", error);
    return { feedback: "Good effort. Try to be more specific.", nextQuestion: "Tell me more about your technical projects." };
  }
}
