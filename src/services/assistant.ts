import axios from 'axios';

export interface AssistantMessage {
  session_id: string;
  response: string;
  sender: 'AI';
}

// Use the configured axios instance that handles auth headers
import axiosInstance from '../api/axiosInstance';
import { UploadedFile } from '../types';

// Configure with environment variable
const apiClient = axiosInstance;

export const sendChatMessage = async (
  userMessage: string,
  sessionId?: string | null,
  options?: {
    selectedFiles?: UploadedFile[],
    searchVault?: boolean
  }
): Promise<AssistantMessage> => {
  try {
    // Log inputs for debugging
    console.log('sendChatMessage called with:', {
      message: userMessage,
      sessionId,
      options: {
        selectedFilesCount: options?.selectedFiles?.length || 0,
        searchVault: options?.searchVault
      }
    });

    const payload: any = {
      user_message: userMessage,
      input_type: 'chat',
      output_type: 'chat',
      tweaks: {}
    };

    if (sessionId) {
      payload.session_id = sessionId;
    }
    
    // Explicitly check if options exists and has the selected files
    if (options?.selectedFiles && options.selectedFiles.length > 0) {
      // Log the actual files being processed
      console.log('Processing selected files:', 
        options.selectedFiles.map(f => ({ id: f.id, name: f.name, type: f.type }))
      );
      
      // Add files to payload
      payload.selected_files = options.selectedFiles.map(file => file.id);
      payload.file_types = options.selectedFiles.map(file => 
        typeof file.type === 'string' ? file.type : 'file'
      );
      
      // Log what we're adding to payload
      console.log('Adding to payload:', {
        selected_files: payload.selected_files,
        file_types: payload.file_types
      });
    }
    
    // Explicitly set the search_vault flag
    payload.search_vault = options?.searchVault === true;
    console.log('Setting search_vault to:', payload.search_vault);

    // Final payload check
    console.log('Final payload:', payload);

    const response = await apiClient.post<AssistantMessage>(
      'http://localhost:8000/assistant/chat/', 
      payload
    );
    
    // Log the response
    console.log('API response:', response.data);

    return response.data;
  } catch (error) {
    console.error('API error:', error);
    // Error handling
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