import axios from 'axios';

export interface AssistantMessage {
  session_id: string;
  response_message: string;
  sender: 'AI';
}

export const sendChatMessage = async (
  userMessage: string,
  sessionId?: string | null,
): Promise<AssistantMessage> => {
  try {
    const response = await axios.post<AssistantMessage>('/assistant/chat/', {
      user_message: userMessage,
      session_id: sessionId,
      input_type: 'chat',
      output_type: 'chat',
      tweaks: {},
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 503) {
        throw new Error('Service unavailable. Please try again later.');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid session. Starting new conversation.');
      }
    }
    throw new Error('An error occurred while processing your message.');
  }
};
