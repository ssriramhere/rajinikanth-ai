import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (req.method === 'POST') {
            // Track an engagement event
            const { type, data } = req.body;
            
            switch(type) {
                case 'quiz_completed':
                    await redis.incr('engagement:quiz_total');
                    if (data.character) {
                        await redis.zincrby('engagement:characters', 1, data.character);
                    }
                    break;
                    
                case 'trivia_completed':
                    await redis.incr('engagement:trivia_total');
                    if (data.score !== undefined) {
                        await redis.lpush('engagement:trivia_scores', data.score);
                        await redis.ltrim('engagement:trivia_scores', 0, 99); // Keep last 100
                    }
                    break;
                    
                case 'card_downloaded':
                    await redis.incr('engagement:cards_total');
                    if (data.dialogue) {
                        await redis.zincrby('engagement:dialogues', 1, data.dialogue);
                    }
                    break;
                    
                case 'card_shared':
                    await redis.incr('engagement:cards_shared');
                    if (data.dialogue) {
                        await redis.zincrby('engagement:dialogues', 1, data.dialogue);
                    }
                    break;
            }
            
            return res.status(200).json({ success: true });
        }
        
        if (req.method === 'GET') {
            // Get all engagement statistics
            const [
                quizTotal,
                triviaTotal,
                cardsTotal,
                cardsShared,
                topCharacters,
                topDialogues
            ] = await Promise.all([
                redis.get('engagement:quiz_total'),
                redis.get('engagement:trivia_total'),
                redis.get('engagement:cards_total'),
                redis.get('engagement:cards_shared'),
                redis.zrange('engagement:characters', 0, 4, { rev: true, withScores: true }),
                redis.zrange('engagement:dialogues', 0, 4, { rev: true, withScores: true })
            ]);
            
            // Parse top characters
            const characters = [];
            for (let i = 0; i < topCharacters.length; i += 2) {
                characters.push({
                    name: topCharacters[i],
                    count: topCharacters[i + 1]
                });
            }
            
            // Parse top dialogues
            const dialogues = [];
            for (let i = 0; i < topDialogues.length; i += 2) {
                dialogues.push({
                    text: topDialogues[i],
                    count: topDialogues[i + 1]
                });
            }
            
            return res.status(200).json({
                success: true,
                stats: {
                    quizzesTaken: parseInt(quizTotal) || 0,
                    triviaPlayed: parseInt(triviaTotal) || 0,
                    cardsCreated: parseInt(cardsTotal) || 0,
                    cardsShared: parseInt(cardsShared) || 0,
                    topCharacter: characters[0] || null,
                    topCharacters: characters,
                    topDialogue: dialogues[0] || null,
                    topDialogues: dialogues
                }
            });
        }
        
    } catch (error) {
        console.error('Engagement Stats Error:', error);
        
        return res.status(200).json({
            success: false,
            stats: {
                quizzesTaken: 0,
                triviaPlayed: 0,
                cardsCreated: 0,
                cardsShared: 0,
                topCharacter: null,
                topCharacters: [],
                topDialogue: null,
                topDialogues: []
            }
        });
    }
}
