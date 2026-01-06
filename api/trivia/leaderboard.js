import { kv } from '@vercel/kv';
import { 
    LEADERBOARD_CURRENT, 
    LEADERBOARD_LONGEST,
    STREAK_KEY
} from '../../lib/kv.js';

/**
 * GET /api/trivia/leaderboard
 * Returns top players by current or longest streak
 * 
 * Query params:
 * - type: 'current' (default) or 'longest'
 * - limit: Number of results (default 100, max 100)
 */

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { type = 'current', limit = 100 } = req.query;
    
    // Validate inputs
    const parsedLimit = Math.min(parseInt(limit) || 100, 100);
    const leaderboardType = type === 'longest' ? 'longest' : 'current';
    
    try {
        // Select appropriate leaderboard (Redis sorted set)
        const leaderboardKey = leaderboardType === 'longest' 
            ? LEADERBOARD_LONGEST 
            : LEADERBOARD_CURRENT;
        
        // Get top players (sorted in descending order by score)
        const topUserIds = await kv.zrange(leaderboardKey, 0, parsedLimit - 1, {
            rev: true,      // Reverse order (highest scores first)
            withScores: true // Include scores
        });
        
        // topUserIds is array like: [userId1, score1, userId2, score2, ...]
        const leaderboard = [];
        
        for (let i = 0; i < topUserIds.length; i += 2) {
            const userId = topUserIds[i];
            const score = topUserIds[i + 1];
            
            // Get full streak data for this user
            const streak = await kv.get(STREAK_KEY(userId));
            
            if (streak && streak.totalAnswered > 0) {
                // Calculate accuracy
                const accuracy = Math.round((streak.totalCorrect / streak.totalAnswered) * 100);
                
                leaderboard.push({
                    rank: Math.floor(i / 2) + 1,
                    userId: anonymizeUserId(userId), // Privacy: show only partial ID
                    currentStreak: streak.currentStreak,
                    longestStreak: streak.longestStreak,
                    totalCorrect: streak.totalCorrect,
                    totalAnswered: streak.totalAnswered,
                    accuracy,
                    score // The score used for ranking
                });
            }
        }
        
        // Get total player count
        const totalPlayers = await kv.zcard(leaderboardKey);
        
        res.status(200).json({
            type: leaderboardType,
            leaderboard,
            totalPlayers,
            showing: leaderboard.length,
            updatedAt: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ 
            error: 'Server error',
            message: error.message 
        });
    }
}

/**
 * Anonymize user ID for privacy
 * Shows first 8 characters + ***
 */
function anonymizeUserId(userId) {
    if (!userId || userId.length < 8) {
        return '********';
    }
    return userId.slice(0, 8) + '***';
}
