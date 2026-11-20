import { useState, useEffect, useCallback } from 'react';
import { Message, ChatSession, ConnectionStatus } from '@/types';
import { webrtcService } from '@/services/webrtcService';
import { storageService } from '@/services/storageService';
import { v4 as uuidv4 } from 'uuid';

export function useChat(currentUserId: string, targetUserId: string, targetUserName: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadChatSession();
    setupWebRTC();

    return () => {
      webrtcService.disconnect();
    };
  }, [targetUserId]);

  const loadChatSession = async () => {
    try {
      const session = await storageService.getChatSession(targetUserId);
      if (session) {
        setMessages(session.messages);
      }
    } catch (error) {
      console.error('Error loading chat session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupWebRTC = () => {
    webrtcService.setOnMessageReceived(handleMessageReceived);
    webrtcService.setOnStatusChange(setConnectionStatus);
  };

  const handleMessageReceived = useCallback(async (message: Message) => {
    setMessages(prev => [...prev, message]);
    
    // Salva mensagem no armazenamento local
    try {
      await storageService.addMessageToSession(targetUserId, message);
    } catch (error) {
      console.error('Error saving received message:', error);
    }
  }, [targetUserId]);

  const sendMessage = useCallback(async (text: string) => {
    const message: Message = {
      id: uuidv4(),
      text,
      timestamp: Date.now(),
      senderId: currentUserId,
      delivered: false,
    };

    // Adiciona mensagem localmente
    setMessages(prev => [...prev, message]);

    try {
      // Tenta enviar via WebRTC
      const sent = webrtcService.sendMessage(message);
      
      if (sent) {
        message.delivered = true;
        setMessages(prev => 
          prev.map(m => m.id === message.id ? { ...m, delivered: true } : m)
        );
      }

      // Salva no armazenamento local
      await saveChatSession([...messages, message]);
      await storageService.addMessageToSession(targetUserId, message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [currentUserId, targetUserId, messages]);

  const saveChatSession = async (currentMessages: Message[]) => {
    try {
      const session: ChatSession = {
        userId: targetUserId,
        userName: targetUserName,
        messages: currentMessages,
        lastActivity: Date.now(),
      };
      await storageService.saveChatSession(session);
    } catch (error) {
      console.error('Error saving chat session:', error);
    }
  };

  const connectToUser = useCallback(async () => {
    try {
      setConnectionStatus('connecting');
      const success = await webrtcService.simulateConnection(targetUserId);
      if (!success) {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Error connecting to user:', error);
      setConnectionStatus('error');
    }
  }, [targetUserId]);

  return {
    messages,
    connectionStatus,
    isLoading,
    sendMessage,
    connectToUser,
  };
}