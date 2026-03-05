/**
 * API client for backend communication
 * Handles all HTTP requests to the FastAPI backend
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Types
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  answer: string;
  sources?: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'project' | 'skill' | 'experience';
}

export interface GraphEdge {
  source: string;
  target: string;
  relationship: string;
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// API functions
export const chatApi = {
  /**
   * Send a message to the chat endpoint
   */
  sendMessage: async (message: string): Promise<ChatResponse> => {
    const response = await apiClient.post<ChatResponse>('/chat', {
      message,
    });
    return response.data;
  },
};

export const graphApi = {
  /**
   * Fetch the knowledge graph data
   */
  getGraph: async (): Promise<GraphResponse> => {
    const response = await apiClient.get<GraphResponse>('/graph');
    return response.data;
  },
};

/**
 * Health check for backend connection
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/');
    return response.status === 200;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export default apiClient;
