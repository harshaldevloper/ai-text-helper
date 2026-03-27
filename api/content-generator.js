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
    const { topic, platform, tone } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const validPlatforms = ['twitter', 'linkedin', 'instagram', 'blog'];
    const selectedPlatform = platform && validPlatforms.includes(platform) ? platform : 'twitter';
    const selectedTone = tone || 'professional';

    // Generate content based on platform
    let content = {};
    
    if (selectedPlatform === 'twitter') {
      content = {
        type: 'Twitter Thread',
        posts: [
          `🧵 Thread: ${topic}\n\nHere's what you need to know 👇`,
          `1/ Most people get ${topic} wrong. They focus on X when they should focus on Y.`,
          `2/ Here's the framework I use:\n- Step 1: Research\n- Step 2: Plan\n- Step 3: Execute\n- Step 4: Review`,
          `3/ The key insight: ${topic} isn't about working harder. It's about working smarter.`,
          `4/ Action step: Start with one small change today. Consistency > intensity.`,
          `5/ Want to learn more? Drop a comment below! 👇\n\n#${topic.replace(/\s+/g, '')} #AI #Productivity`
        ],
        hashtags: ['#AI', '#Productivity', `#${topic.replace(/\s+/g, '')}`]
      };
    } else if (selectedPlatform === 'linkedin') {
      content = {
        type: 'LinkedIn Post',
        post: `🚀 Let's talk about ${topic}.\n\nI've spent the last 3 months diving deep into this, and here's what I learned:\n\n❌ The old way: Work harder, longer hours, burn out\n✅ The new way: Leverage AI, automate repetitive tasks, focus on strategy\n\nHere's my framework:\n\n1️⃣ Identify the bottleneck\n2️⃣ Find the right AI tool\n3️⃣ Test and iterate\n4️⃣ Scale what works\n\nThe result? 10x output in the same hours.\n\nWhat's your experience with ${topic}? Share below! 👇\n\n#${topic.replace(/\s+/g, '')} #AI #Automation #Leadership`,
        hashtags: ['#AI', '#Automation', '#Leadership']
      };
    } else if (selectedPlatform === 'instagram') {
      content = {
        type: 'Instagram Caption',
        caption: `${topic} 🎯\n\nSwipe to learn the framework ➡️\n\nHere's what nobody tells you about ${topic}:\n\nIt's not about having more time.\nIt's about using the time you have smarter.\n\n💡 Save this for later!\n\n#${topic.replace(/\s+/g, '')} #AITools #Productivity #ContentCreator #DigitalMarketing`,
        hashtags: ['#AITools', '#Productivity', '#ContentCreator']
      };
    } else if (selectedPlatform === 'blog') {
      content = {
        type: 'Blog Outline',
        title: `The Complete Guide to ${topic} in 2026`,
        outline: [
          { section: 'Introduction', points: ['Hook: Surprising stat about ' + topic, 'Why this matters now', 'What readers will learn'] },
          { section: 'The Problem', points: ['Common mistakes people make', 'Why traditional approaches fail', 'The cost of inaction'] },
          { section: 'The Solution', points: ['Step-by-step framework', 'Tools and resources needed', 'Real examples'] },
          { section: 'Case Study', points: ['Before/after comparison', 'Specific results achieved', 'Lessons learned'] },
          { section: 'Action Steps', points: ['What to do today', 'What to do this week', 'Long-term strategy'] },
          { section: 'Conclusion', points: ['Key takeaways', 'Final encouragement', 'Call-to-action'] }
        ],
        estimatedWords: 2000
      };
    }

    res.status(200).json({
      success: true,
      data: {
        topic,
        platform: selectedPlatform,
        tone: selectedTone,
        ...content,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ error: 'Content generation failed', message: error.message });
  }
}
