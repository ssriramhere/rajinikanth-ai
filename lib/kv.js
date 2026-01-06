import { kv } from '@vercel/kv';

/**
 * Vercel KV Schema for Rajinikanth.ai Trivia
 * 
 * questions:{id}          → Question object (never sent to client with answer)
 * questions:all           → Array of all question IDs
 * user:{userId}           → User metadata
 * answer:{userId}:{date}  → User's answer for a specific date
 * streak:{userId}         → User's streak data
 * leaderboard:current     → Sorted set of current streaks
 * leaderboard:longest     → Sorted set of longest streaks
 * trivia:question_for_date:{date} → Question ID selected for specific date
 * trivia:recent_questions → List of recently used question IDs (last 30)
 */

// Question Keys
export const QUESTION_KEY = (id) => `questions:${id}`;
export const ALL_QUESTIONS_KEY = 'questions:all';
export const QUESTION_FOR_DATE_KEY = (date) => `trivia:question_for_date:${date}`;
export const RECENT_QUESTIONS_KEY = 'trivia:recent_questions';

// User Keys
export const USER_KEY = (userId) => `user:${userId}`;
export const ANSWER_KEY = (userId, date) => `answer:${userId}:${date}`;
export const STREAK_KEY = (userId) => `streak:${userId}`;

// Leaderboard Keys
export const LEADERBOARD_CURRENT = 'leaderboard:current';
export const LEADERBOARD_LONGEST = 'leaderboard:longest';

// Configuration
const MAX_RECENT_QUESTIONS = 30; // Don't repeat questions from last 30 days

// Helper: Get today's date string (YYYY-MM-DD)
export function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Helper: Get today's question ID with smart randomization
export async function getTodayQuestionId() {
    const today = getTodayDate();
    
    // Check if we already selected a question for today
    // (ensures all users get the same question on the same day)
    const cachedQuestionId = await kv.get(QUESTION_FOR_DATE_KEY(today));
    if (cachedQuestionId) {
        return cachedQuestionId;
    }
    
    // Get all available question IDs
    const allQuestionIds = await kv.get(ALL_QUESTIONS_KEY) || [];
    
    if (allQuestionIds.length === 0) {
        console.error('No questions found! Run seed endpoint first.');
        return 1; // Fallback
    }
    
    // Get list of recently used questions (last 30 days)
    const recentQuestions = await kv.lrange(RECENT_QUESTIONS_KEY, 0, MAX_RECENT_QUESTIONS - 1) || [];
    
    // Filter out recently used questions
    let availableQuestions = allQuestionIds.filter(id => !recentQuestions.includes(id));
    
    // If all questions were used recently, reset the recent list
    if (availableQuestions.length === 0) {
        console.log('All questions used recently, resetting pool...');
        availableQuestions = allQuestionIds;
        await kv.del(RECENT_QUESTIONS_KEY);
    }
    
    // Pick a random question from available pool
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestionId = availableQuestions[randomIndex];
    
    // Cache this question for today (expires after 24 hours)
    await kv.set(QUESTION_FOR_DATE_KEY(today), selectedQuestionId, {
        ex: 86400 // Expire after 24 hours
    });
    
    // Add to recent questions list (prevent it from appearing again soon)
    await kv.lpush(RECENT_QUESTIONS_KEY, selectedQuestionId);
    
    // Keep only last 30 questions in the recent list
    await kv.ltrim(RECENT_QUESTIONS_KEY, 0, MAX_RECENT_QUESTIONS - 1);
    
    console.log(`Selected question ${selectedQuestionId} for ${today}`);
    
    return selectedQuestionId;
}

// Helper: Get or create user
export async function getOrCreateUser(userId) {
    const userKey = USER_KEY(userId);
    let user = await kv.get(userKey);
    
    if (!user) {
        user = {
            userId,
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString()
        };
        await kv.set(userKey, user);
    } else {
        // Update last active
        user.lastActive = new Date().toISOString();
        await kv.set(userKey, user);
    }
    
    return user;
}

// Helper: Get user's streak data
export async function getUserStreak(userId) {
    const streakKey = STREAK_KEY(userId);
    let streak = await kv.get(streakKey);
    
    if (!streak) {
        streak = {
            currentStreak: 0,
            longestStreak: 0,
            totalCorrect: 0,
            totalAnswered: 0,
            lastAnswerDate: null
        };
    }
    
    return streak;
}

// Helper: Update user streak (handles 30-day streak logic)
export async function updateUserStreak(userId, isCorrect) {
    const streakKey = STREAK_KEY(userId);
    const today = getTodayDate();
    let streak = await getUserStreak(userId);
    
    const lastDate = streak.lastAnswerDate;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Check if streak continues
    if (lastDate === yesterday) {
        // Continuing streak from yesterday
        streak.currentStreak = isCorrect ? streak.currentStreak + 1 : 0;
    } else if (lastDate !== today) {
        // Either first time or broken streak (missed a day)
        streak.currentStreak = isCorrect ? 1 : 0;
    }
    
    // Update stats
    streak.longestStreak = Math.max(streak.currentStreak, streak.longestStreak);
    streak.totalCorrect += isCorrect ? 1 : 0;
    streak.totalAnswered += 1;
    streak.lastAnswerDate = today;
    
    // Save to KV
    await kv.set(streakKey, streak);
    
    // Update leaderboards (Redis sorted sets)
    await kv.zadd(LEADERBOARD_CURRENT, { score: streak.currentStreak, member: userId });
    await kv.zadd(LEADERBOARD_LONGEST, { score: streak.longestStreak, member: userId });
    
    return streak;
}

export default kv;
