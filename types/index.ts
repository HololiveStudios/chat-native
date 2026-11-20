export interface User {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: number;
  senderId: string;
  delivered: boolean;
}

export interface ChatSession {
  userId: string;
  userName: string;
  messages: Message[];
  lastActivity: number;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface WebRTCConnection {
  peerConnection: RTCPeerConnection | null;
  dataChannel: RTCDataChannel | null;
  status: ConnectionStatus;
}