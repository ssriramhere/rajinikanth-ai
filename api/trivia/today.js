import { kv } from '@vercel/kv';
import { 
    QUESTION_KEY, 
    ANSWER_KEY, 
    getTodayDate, 
    getTodayQuestionId,
    getOrCreateUser,
    getUserStreak
} from '../../lib/kv.js';

/**
 * GET /api/trivia/today
 * Returns today's trivia question WITHOUT the correct answer
 * If user already answered, returns their previous result
 * 
 * Query params:
 * - userId: Browser fingerprint from localStorage
 */

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { userId } = req.query;
    
    if (!userId) {
        return res.status(400).json({ 
            error: 'Missing userId',
            message: 'userId query parameter is required' 
        });
    }
    
    try {
        // Ensure user exists in KV
        await getOrCreateUser(userId);
        
        // Get today's question ID (rotates through 30 questions)
        const questionId = getTodayQuestionId();
        const today = getTodayDate();
        
        // Fetch question from KV
        const question = await kv.get(QUESTION_KEY(questionId));
        
        if (!question) {
            return res.status(404).json({ 
                error: 'Question not found',
                message: 'Questions may not be seeded yet. Run /api/admin/seed-questions first.'
            });
        }
        
        // Check if user already answered today
        const answerKey = ANSWER_KEY(userId, today);
        const existingAnswer = await kv.get(answerKey);
        
        if (existingAnswer) {
            // User already answered - return their previous result
            const streak = await getUserStreak(userId);
            
            return res.status(200).json({
                alreadyAnswered: true,
                question: {
                    id: question.id,
                    question: question.question,
                    options: question.options,
                    category: question.category,
                    difficulty: question.difficulty
                },
                userAnswer: existingAnswer.selectedAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect: existingAnswer.isCorrect,
                funFact: question.funFact,
                streak: {
                    current: streak.currentStreak,
                    longest: streak.longestStreak,
                    totalCorrect: streak.totalCorrect,
                    totalAnswered: streak.totalAnswered,
                    accuracy: streak.totalAnswered > 0 
                        ? Math.round((streak.totalCorrect / streak.totalAnswered) * 100) 
                        : 0
                }
            });
        }
        
        // User hasn't answered yet - return question WITHOUT correct answer
        res.status(200).json({
            alreadyAnswered: false,
            question: {
                id: question.id,
                question: question.question,
                options: question.options,
                category: question.category,
                difficulty: question.difficulty
                // ❌ correctAnswer is NOT included - prevents cheating!
            }
        });
        
    } catch (error) {
        console.error('Error fetching trivia:', error);
        res.status(500).json({ 
            error: 'Server error',
            message: error.message 
        });
    }
}
