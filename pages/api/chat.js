// TEENVEST API Route — Claude + Perplexity Integration
// Claude = conversation brain | Perplexity = real-time data layer
 
// Keywords that trigger a Perplexity search for fresh data
const REALTIME_KEYWORDS = [
  // Real estate
  'נדל"ן', 'דירה', 'דירות', 'נכס', 'נכסים', 'שכירות', 'משכנתא', 'רכישת דירה',
  'מחירי דירות', 'שוק הנדל"ן', 'reits', 'REIT', 'קרקע', 'בניה', 'מחיר למשתכן',
  // Stocks
  'מניה', 'מניות', 'בורסה', 'מדד', 'S&P', 'נאסד"ק', 'תל אביב 35',
  'ETF', 'דיבידנד', 'שוק ההון', 'מסחר',
  // Crypto
  'ביטקוין', 'bitcoin', 'BTC', 'אתריום', 'ethereum', 'קריפטו', 'crypto',
  'בלוקצ\'יין', 'blockchain', 'אלטקוין',
  // Economy
  'ריבית', 'אינפלציה', 'בנק ישראל', 'שער דולר', 'שער חליפין', 'כלכלה',
  'מיתון', 'צמיחה כלכלית',
  // Savings
  'חיסכון', 'קרן השתלמות', 'פנסיה', 'ביטוח', 'קופת גמל',
  // Current events
  'היום', 'עכשיו', 'נוכחי', 'עדכני', 'אחרון', 'חדשות',
];
 
function needsRealtimeData(message) {
  const lower = message.toLowerCase();
  return REALTIME_KEYWORDS.some(kw => lower.includes(kw.toLowerCase()));
}
 
async function fetchPerplexityData(query, apiKey) {
  try {
    const israelContext = query.includes('ישראל') ? '' : ' ישראל';
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.PERPLEXITY_MODEL || 'sonar-pro',
        messages: [
          {
            role: 'system',
            content: 'אתה עוזר מחקר פיננסי. תן נתונים עדכניים, מספרים, ומקורות בעברית. התמקד בנתונים רלוונטיים לישראל ולבני נוער. תן תשובה קצרה וממוקדת עם מספרים ספציפיים.'
          },
          {
            role: 'user',
            content: query + israelContext + ' נתונים עדכניים 2026'
          }
        ],
        max_tokens: 500,
        temperature: 0.1,
      }),
    });
 
    if (!response.ok) return null;
 
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Perplexity error:', error);
    return null;
  }
}
 
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
 
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const perplexityKey = process.env.PERPLEXITY_API_KEY;
 
  if (!anthropicKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }
 
  try {
    const messages = req.body.messages || [];
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
 
    // Check if we need real-time data from Perplexity
    let realtimeContext = '';
    if (perplexityKey && needsRealtimeData(lastUserMessage)) {
      const perplexityData = await fetchPerplexityData(lastUserMessage, perplexityKey);
      
      if (perplexityData) {
        realtimeContext = `\n\n--- נתונים עדכניים ממקורות אמינים (${new Date().toLocaleDateString('he-IL')}) ---\n${perplexityData}\n--- סוף נתונים עדכניים ---\n\nהשתמש בנתונים העדכניים למעלה בתשובה שלך. ציין שהמידע עדכני ומבוסס מקורות. אם יש מספרים ספציפיים, שלב אותם בתשובה.`;
      }
    }
 
    // Inject real-time context into the first message (system prompt)
    let enrichedMessages = [...messages];
    if (realtimeContext && enrichedMessages.length > 0 && enrichedMessages[0].role === 'user') {
      enrichedMessages[0] = {
        ...enrichedMessages[0],
        content: enrichedMessages[0].content + realtimeContext,
      };
    }
 
    // Call Claude with enriched context
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',
        max_tokens: req.body.max_tokens || 1000,
        messages: enrichedMessages,
      }),
    });
 
    const data = await response.json();
 
    if (!response.ok) {
      return res.status(response.status).json(data);
    }
 
    return res.status(200).json(data);
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'Failed to connect to AI service' });
  }
}
 








