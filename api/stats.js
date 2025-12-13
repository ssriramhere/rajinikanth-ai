import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Get the origin from the request
    const origin = req.headers.origin;
    
    // Only allow your own domain (more secure than '*')
    if (origin === 'https://rajinikanth.ai' || 
        origin === 'http://localhost:3000') { // for local development
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        // Default to your main domain
        res.setHeader('Access-Control-Allow-Origin', 'https://rajinikanth.ai');
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        const today = new Date().toISOString().split('T')[0];
        const totalKey = 'total_visitors';
        const todayKey = `visitors_${today}`;
        
        // Increment counters
        const totalVisitors = await kv.incr(totalKey);
        const todayVisitors = await kv.incr(todayKey);
        
        // Set expiry on today's counter
        await kv.expire(todayKey, 86400);
        
        return res.status(200).json({
            success: true,
            totalVisitors,
            todayVisitors,
            date: today,
            lastUpdated: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('KV Error:', error);
        return res.status(200).json({
            success: false,
            totalVisitors: 1247,
            todayVisitors: 89,
            date: new Date().toISOString().split('T')[0],
            error: error.message
        });
    }
}
