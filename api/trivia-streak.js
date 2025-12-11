import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    const userId = req.query.userId || 'anonymous';
    const today = new Date().toISOString().split('T')[0]; // "2024-12-13"
    
    try {
        if (req.method === 'POST') {
            // =============================================
            // USER SUBMITTED AN ANSWER
            // =============================================
            
            const { correct, questionDate } = req.body;
            
            // Keys for Redis
            const userKey = `trivia:user:${userId}`;
            const answeredKey = `trivia:answered:${userId}:${today}`;
            
            // Check if already answered today
            const alreadyAnswered = await kv.get(answeredKey);
            if (alreadyAnswered) {
                return res.status(400).json({ 
                    error: 'Already answered today',
                    message: 'Come back tomorrow for the next question!' 
                });
            }
            
            // Get existing user data
            const userData = await kv.get(userKey) || {
                currentStreak: 0,
                lastPlayedDate: null,
                totalCorrect: 0,
                totalAnswered: 0,
                longestStreak: 0,
                firstPlayed: today
            };
            
            // Calculate new streak
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            let newStreak;
            let streakStatus = 'maintained';
            
            if (userData.lastPlayedDate === yesterday) {
                // Consecutive day! Streak continues
                newStreak = userData.currentStreak + 1;
                streakStatus = 'increased';
            } else if (userData.lastPlayedDate === today) {
                // Already played today (shouldn't happen due to check above)
                newStreak = userData.currentStreak;
                streakStatus = 'same';
            } else if (userData.lastPlayedDate === null) {
                // First time playing
                newStreak = 1;
                streakStatus = 'started';
            } else {
                // Missed a day - streak resets
                newStreak = 1;
                streakStatus = 'reset';
            }
            
            // Update user data
            const updatedData = {
                currentStreak: newStreak,
                lastPlayedDate: today,
                totalCorrect: userData.totalCorrect + (correct ? 1 : 0),
                totalAnswered: userData.totalAnswered + 1,
                longestStreak: Math.max(newStreak, userData.longestStreak || 0),
                firstPlayed: userData.firstPlayed || today,
                lastAnswer: {
                    date: today,
                    correct: correct,
                    questionDate: questionDate
                }
            };
            
            // Save to database
            await kv.set(userKey, updatedData);
            
            // Mark as answered today (expires in 24 hours)
            await kv.set(answeredKey, { 
                answered: true, 
                correct: correct,
                timestamp: Date.now() 
            });
            await kv.expire(answeredKey, 86400); // 24 hours
            
            // Update leaderboard (sorted by streak)
            if (newStreak >= 3) { // Only add to leaderboard if 3+ streak
                await kv.zadd('trivia:leaderboard:streak', {
                    score: newStreak,
                    member: userId
                });
                
                // Also track by accuracy
                const accuracy = Math.round((updatedData.totalCorrect / updatedData.totalAnswered) * 100);
                await kv.zadd('trivia:leaderboard:accuracy', {
                    score: accuracy,
                    member: userId
                });
            }
            
            // Calculate user's rank
            const userRank = await kv.zrevrank('trivia:leaderboard:streak', userId);
            const totalPlayers = await kv.zcard('trivia:leaderboard:streak');
            
            // Return success response
            res.json({
                success: true,
                correct: correct,
                streakStatus: streakStatus,
                streak: updatedData.currentStreak,
                longestStreak: updatedData.longestStreak,
                totalCorrect: updatedData.totalCorrect,
                totalAnswered: updatedData.totalAnswered,
                accuracy: Math.round((updatedData.totalCorrect / updatedData.totalAnswered) * 100),
                rank: userRank !== null ? userRank + 1 : null,
                totalPlayers: totalPlayers || 0
            });
            
        } else if (req.method === 'GET') {
            // =============================================
            // GET USER'S CURRENT STATS
            // =============================================
            
            const userKey = `trivia:user:${userId}`;
            const answeredKey = `trivia:answered:${userId}:${today}`;
            
            // Get user data
            const userData = await kv.get(userKey) || {
                currentStreak: 0,
                lastPlayedDate: null,
                totalCorrect: 0,
                totalAnswered: 0,
                longestStreak: 0
            };
            
            // Check if already answered today
            const answeredToday = await kv.get(answeredKey);
            
            // Validate streak (check if it's still valid)
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            let validStreak = userData.currentStreak;
            
            if (userData.lastPlayedDate !== today && userData.lastPlayedDate !== yesterday) {
                // Streak is broken (missed more than 1 day)
                validStreak = 0;
            }
            
            // Get leaderboard position
            const userRank = await kv.zrevrank('trivia:leaderboard:streak', userId);
            const totalPlayers = await kv.zcard('trivia:leaderboard:streak');
            
            res.json({
                currentStreak: validStreak,
                longestStreak: userData.longestStreak || 0,
                totalCorrect: userData.totalCorrect || 0,
                totalAnswered: userData.totalAnswered || 0,
                accuracy: userData.totalAnswered > 0 
                    ? Math.round((userData.totalCorrect / userData.totalAnswered) * 100) 
                    : 0,
                answeredToday: !!answeredToday,
                lastPlayedDate: userData.lastPlayedDate,
                rank: userRank !== null ? userRank + 1 : null,
                totalPlayers: totalPlayers || 0
            });
        }
        
    } catch (error) {
        console.error('Trivia streak API error:', error);
        
        // Return fallback response on error
        res.status(200).json({
            success: false,
            currentStreak: 0,
            longestStreak: 0,
            totalCorrect: 0,
            totalAnswered: 0,
            accuracy: 0,
            answeredToday: false,
            error: 'Unable to load stats. Please try again.'
        });
    }
}
