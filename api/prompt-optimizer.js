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
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Analyze the original prompt
    const originalLength = prompt.length;
    const wordCount = prompt.split(/\s+/).length;
    
    // Check for common issues
    const issues = [];
    const suggestions = [];
    
    if (wordCount < 10) {
      issues.push('Prompt is too vague');
      suggestions.push('Add more specific details about what you want');
    }
    
    if (!prompt.includes('context') && !prompt.includes('background')) {
      issues.push('Missing context');
      suggestions.push('Add background information or context');
    }
    
    if (!prompt.includes('format') && !prompt.includes('structure')) {
      issues.push('No format specified');
      suggestions.push('Specify the desired output format (list, essay, code, etc.)');
    }
    
    if (!prompt.includes('tone') && !prompt.includes('style')) {
      issues.push('No tone specified');
      suggestions.push('Define the tone (professional, casual, technical, etc.)');
    }
    
    // Generate optimized prompt
    const optimizedPrompt = `You are an expert assistant helping me achieve my goals.

CONTEXT:
${prompt}

TASK:
Based on the context above, provide a comprehensive, actionable response.

FORMAT:
- Use clear headings and subheadings
- Include specific examples
- Add actionable steps
- Use bullet points for readability

TONE:
Professional yet approachable

CONSTRAINTS:
- Be concise but thorough
- Focus on practical application
- Include real-world examples

Please provide your response:`;

    // Generate variations
    const variations = [
      {
        style: 'Direct',
        prompt: `Give me a clear, actionable answer about: ${prompt}\n\nBe specific. Include examples. No fluff.`
      },
      {
        style: 'Step-by-Step',
        prompt: `Break down ${prompt} into clear steps.\n\nFor each step:\n1. Explain what to do\n2. Show an example\n3. List common mistakes to avoid`
      },
      {
        style: 'Expert Analysis',
        prompt: `As an expert in this field, analyze: ${prompt}\n\nProvide:\n- Key insights\n- Data-backed recommendations\n- Advanced strategies most people miss`
      }
    ];

    // Score the original prompt (1-10)
    let score = 5; // Base score
    if (wordCount > 20) score += 1;
    if (wordCount > 50) score += 1;
    if (prompt.includes('example')) score += 1;
    if (prompt.includes('step') || prompt.includes('how')) score += 1;
    if (prompt.includes('why') || prompt.includes('explain')) score += 1;
    if (issues.length === 0) score += 2;
    score = Math.min(10, score);

    res.status(200).json({
      success: true,
      data: {
        originalPrompt: prompt,
        optimizedPrompt,
        variations,
        analysis: {
          score,
          wordCount,
          characterCount: originalLength,
          issues,
          suggestions
        },
        tips: [
          'Be specific about what you want',
          'Provide context and background',
          'Specify the format you need',
          'Include examples of what you like',
          'Define the tone and audience'
        ]
      }
    });
  } catch (error) {
    console.error('Prompt optimization error:', error);
    res.status(500).json({ error: 'Prompt optimization failed', message: error.message });
  }
}
