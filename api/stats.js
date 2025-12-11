import { kv } from '@vercel/kv';

export default async function handler(req, res) {
    // Enable CORS for all origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    try {
        // Get current date for "today" counter
        const today = new Date().toISOString().split('T')[0]; // Format: "2024-12-12"
        
        // Keys for Redis storage
        const totalKey = 'total_visitors';
        const todayKey = `visitors_${today}`;
        
        // Increment total visitors (persists forever)
        const totalVisitors = await kv.incr(totalKey);
        
        // Increment today's visitors (resets daily)
        const todayVisitors = await kv.incr(todayKey);
        
        // Set expiry on today's counter (expires in 24 hours)
        await kv.expire(todayKey, 86400);
        
        // Optional: Track unique visitors (simple version)
        // In production, you'd want to use IP or session tracking
        
        // Return stats
        res.status(200).json({
            success: true,
            totalVisitors: totalVisitors || 1,
            todayVisitors: todayVisitors || 1,
            date: today,
            lastUpdated: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Stats API Error:', error);
        
        // Fallback to default values if KV is not configured yet
        // This allows the site to work even before KV is set up
        res.status(200).json({
            success: false,
            totalVisitors: 1247,
            todayVisitors: 89,
            date: new Date().toISOString().split('T')[0],
            lastUpdated: new Date().toISOString(),
            error: 'KV not configured - using fallback values'
        });
    }
}
