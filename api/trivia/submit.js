import { kv } from '@vercel/kv';
import { 
    QUESTION_KEY, 
    ANSWER_KEY, 
    getTodayDate,
    getTodayQuestionId,
    getOrCreateUser,
    updateUserStreak,
    LEADERBOARD_CURRENT
} from '../../lib/kv.js';

/**
 * POST /api/trivia/submit
 * Validates user's answer server-side and updates streak
 * 
 * Body:
 * - userId: Browser fingerprint
 * - questionId: Question ID being answered
 * - selectedAnswer: Answer index (0-3)
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { userId, questionId, selectedAnswer } = req.body;
    
    // Validate required fields
    if (!userId || questionId === undefined || selectedAnswer === undefined) {
        return res.status(400).json({ 
            error: 'Missing required fields',
            required: ['userId', 'questionId', 'selectedAnswer']
        });
    }
    
    try {
        const today = getTodayDate();
        const todayQuestionId = getTodayQuestionId();
        
        // Validate question ID matches today's question
        if (questionId !== todayQuestionId) {
            return res.status(400).json({ 
                error: 'Invalid question ID',
                message: 'Question ID does not match today\'s question'
            });
        }
        
        // Ensure user exists
        await getOrCreateUser(userId);
        
        // Check if already answered today
        const answerKey = ANSWER_KEY(userId, today);
        const existingAnswer = await kv.get(answerKey);
        
        if (existingAnswer) {
            return res.status(400).json({ 
                error: 'Already answered today',
                message: 'You can only answer once per day. Come back tomorrow!',
                result: existingAnswer
            });
        }
        
        // Get question with correct answer from KV
        const question = await kv.get(QUESTION_KEY(questionId));
        
        if (!question) {
            return res.status(404).json({ 
                error: 'Question not found',
                message: 'Invalid question ID'
            });
        }
        
        // Validate answer (server-side only!)
        const isCorrect = selectedAnswer === question.correctAnswer;
        
        // Update user's streak (handles 30-day streak logic)
        const streak = await updateUserStreak(userId, isCorrect);
        
        // Get user's rank on leaderboard
        const rank = await kv.zrank(LEADERBOARD_CURRENT, userId);
        const totalPlayers = await kv.zcard(LEADERBOARD_CURRENT);
        
        // Store user's answer
        const answerData = {
            questionId,
            selectedAnswer,
            isCorrect,
            answeredAt: new Date().toISOString(),
            streak: {
                current: streak.currentStreak,
                longest: streak.longestStreak,
                totalCorrect: streak.totalCorrect,
                totalAnswered: streak.totalAnswered
            }
        };
        
        await kv.set(answerKey, answerData);
        
        // Track engagement stats (for your existing engagement-stats endpoint)
        try {
            const statsKey = 'engagement:trivia_completed';
            await kv.incr(statsKey);
            
            if (isCorrect) {
                const correctKey = 'engagement:trivia_correct';
                await kv.incr(correctKey);
            }
        } catch (e) {
            // Non-critical, don't fail the request
            console.log('Stats tracking failed:', e);
        }
        
        // Calculate accuracy
        const accuracy = streak.totalAnswered > 0 
            ? Math.round((streak.totalCorrect / streak.totalAnswered) * 100) 
            : 0;
        
        // Return result with fun fact
        res.status(200).json({
            correct: isCorrect,
            correctAnswer: question.correctAnswer,
            funFact: question.funFact,
            streak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            totalCorrect: streak.totalCorrect,
            totalAnswered: streak.totalAnswered,
            accuracy,
            rank: rank !== null ? totalPlayers - rank : totalPlayers + 1, // Convert to 1-based ranking
            totalPlayers,
            streakStatus: streak.currentStreak > (streak.currentStreak - (isCorrect ? 1 : 0)) 
                ? 'increased' 
                : 'reset'
        });
        
    } catch (error) {
        console.error('Error submitting answer:', error);
        res.status(500).json({ 
            error: 'Server error',
            message: error.message 
        });
    }
}
