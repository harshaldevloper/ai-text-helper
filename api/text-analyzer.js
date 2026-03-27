export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ message: 'OK' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Simple text analysis (can be enhanced with AI API later)
    const wordCount = text.split(/\s+/).length;
    const sentenceCount = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const charCount = text.length;
    
    // Readability score (Flesch-Kincaid simplified)
    const avgWordsPerSentence = wordCount / sentenceCount;
    const readabilityScore = Math.max(0, Math.min(100, 206.835 - (1.015 * avgWordsPerSentence) * 10));
    
    // Sentiment analysis (basic keyword-based)
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'best', 'happy', 'success', 'win', 'awesome'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'sad', 'fail', 'error', 'poor', 'wrong'];
    
    const textLower = text.toLowerCase();
    const positiveCount = positiveWords.filter(w => textLower.includes(w)).length;
    const negativeCount = negativeWords.filter(w => textLower.includes(w)).length;
    
    let sentiment = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    if (negativeCount > positiveCount) sentiment = 'negative';
    
    // Key topics (extract nouns - simplified)
    const stopWords = ['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but', 'if', 'or', 'because', 'until', 'while', 'although', 'though', 'after', 'before', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am'];
    
    const words = textLower.split(/\W+/).filter(w => w.length > 3 && !stopWords.includes(w));
    const wordFreq = {};
    words.forEach(w => wordFreq[w] = (wordFreq[w] || 0) + 1);
    const topics = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);

    res.status(200).json({
      success: true,
      data: {
        sentiment,
        sentimentScore: { positive: positiveCount, negative: negativeCount },
        readability: Math.round(readabilityScore),
        wordCount,
        sentenceCount,
        charCount,
        topics,
        insights: [
          wordCount < 100 ? 'Text is quite short' : 'Good text length',
          readabilityScore > 60 ? 'Easy to read' : 'May be complex',
          sentiment !== 'neutral' ? `Detected ${sentiment} tone` : 'Neutral tone detected'
        ]
      }
    });
  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({ error: 'Analysis failed', message: error.message });
  }
}
