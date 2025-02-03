import { DivorceFormData } from './types';
import { generateDivorcePrompt } from './utils';

export async function generateDivorceDocument(data: DivorceFormData): Promise<string> {
  try {
    const prompt = generateDivorcePrompt(data);
    console.log('Generated Prompt:', prompt);

    const response = await fetch('https://divoce-flow.onrender.com/process/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ user_input: prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(result.error);
    }

    if (!result.document) {
      throw new Error('No document was generated');
    }

    return result.document;
  } catch (error) {
    console.error('Error generating document:', error);
    if (error instanceof Error) {
      throw new Error(`Nepavyko sukurti dokumento${error.message}`);
    }
    throw new Error('Nepavyko sukurti dokumento');
  }
}