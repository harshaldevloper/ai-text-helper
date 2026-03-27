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
    const { code, action } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const validActions = ['explain', 'refactor', 'document', 'debug'];
    const selectedAction = action && validActions.includes(action) ? action : 'explain';

    // Analyze the code
    const lines = code.split('\n').length;
    const chars = code.length;
    
    // Detect language (simple heuristic)
    let language = 'unknown';
    if (code.includes('function') || code.includes('const') || code.includes('=>')) language = 'JavaScript';
    else if (code.includes('def ') || code.includes('import ') || code.includes('print(')) language = 'Python';
    else if (code.includes('public class') || code.includes('public static')) language = 'Java';
    else if (code.includes('fn ') || code.includes('let ') || code.includes('impl ')) language = 'Rust';
    else if (code.includes('#include') || code.includes('int main')) language = 'C++';
    else if (code.includes('<div') || code.includes('<html') || code.includes('class=')) language = 'HTML/CSS';

    // Generate response based on action
    let response = {};

    if (selectedAction === 'explain') {
      response = {
        action: 'Explanation',
        summary: `This ${language} code appears to be ${lines} lines long.`,
        breakdown: [
          'Look for function/method definitions',
          'Identify input parameters and return values',
          'Trace the main logic flow',
          'Note any external dependencies',
          'Check for error handling'
        ],
        keyPoints: [
          'Identify the main purpose of the code',
          'Note any complex algorithms or patterns',
          'Check for potential performance issues',
          'Look for security considerations'
        ]
      };
    } else if (selectedAction === 'refactor') {
      response = {
        action: 'Refactoring Suggestions',
        suggestions: [
          'Extract repeated code into functions',
          'Use more descriptive variable names',
          'Add error handling where missing',
          'Consider using modern language features',
          'Improve code organization and structure'
        ],
        priorities: [
          { priority: 'High', item: 'Fix any bugs or security issues' },
          { priority: 'Medium', item: 'Improve readability and maintainability' },
          { priority: 'Low', item: 'Optimize performance if needed' }
        ]
      };
    } else if (selectedAction === 'document') {
      response = {
        action: 'Documentation Template',
        template: `/**
 * Function Description
 * 
 * @param {type} paramName - Description of parameter
 * @returns {type} Description of return value
 * 
 * @example
 * // Example usage
 * functionName(arg1, arg2)
 */`,
        sections: [
          'Function/Class name and purpose',
          'Parameters with types and descriptions',
          'Return value description',
          'Usage examples',
          'Edge cases and error handling',
          'Dependencies and requirements'
        ]
      };
    } else if (selectedAction === 'debug') {
      response = {
        action: 'Debug Checklist',
        commonIssues: [
          'Check for undefined/null values',
          'Verify variable scopes',
          'Look for off-by-one errors in loops',
          'Check async/await usage',
          'Verify API responses and data types'
        ],
        debuggingSteps: [
          'Add console.log statements to trace execution',
          'Use browser DevTools or debugger',
          'Check network requests and responses',
          'Validate input data',
          'Test edge cases'
        ]
      };
    }

    res.status(200).json({
      success: true,
      data: {
        code,
        language,
        analysis: {
          lines,
          characters: chars,
          estimatedComplexity: lines > 50 ? 'High' : lines > 20 ? 'Medium' : 'Low'
        },
        action: selectedAction,
        ...response,
        tips: [
          'Write tests for critical functions',
          'Use version control (Git)',
          'Follow style guides (ESLint, Prettier)',
          'Document as you code, not after',
          'Review code regularly'
        ]
      }
    });
  } catch (error) {
    console.error('Code assistant error:', error);
    res.status(500).json({ error: 'Code analysis failed', message: error.message });
  }
}
