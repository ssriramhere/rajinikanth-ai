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
        const today = new Date().toISOString().split('T')[0];
        const totalKey = 'total_visitors';
        const todayKey = `visitors_${today}`;
        
        const totalVisitors = await redis.incr(totalKey);
        const todayVisitors = await redis.incr(todayKey);
        await redis.expire(todayKey, 86400);
        
        return res.status(200).json({
            success: true,
            totalVisitors,
            todayVisitors,
            date: today,
            lastUpdated: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Redis Error:', error);
        return res.status(200).json({
            success: false,
            totalVisitors: 1247,
            todayVisitors: 89,
            date: new Date().toISOString().split('T')[0],
            error: error.message
        });
    }
}
