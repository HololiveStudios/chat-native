import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, ChatSession, Message } from '@/types';

class StorageService {
  private static readonly USER_KEY = '@user_profile';
  private static readonly CHATS_KEY = '@chat_sessions';

  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  }

  async saveChatSession(session: ChatSession): Promise<void> {
    try {
      const existingSessions = await this.getChatSessions();
      const sessionIndex = existingSessions.findIndex(s => s.userId === session.userId);
      
      if (sessionIndex >= 0) {
        existingSessions[sessionIndex] = session;
      } else {
        existingSessions.push(session);
      }
      
      await AsyncStorage.setItem(this.CHATS_KEY, JSON.stringify(existingSessions));
    } catch (error) {
      console.error('Error saving chat session:', error);
      throw error;
    }
  }

  async getChatSessions(): Promise<ChatSession[]> {
    try {
      const sessionsData = await AsyncStorage.getItem(this.CHATS_KEY);
      return sessionsData ? JSON.parse(sessionsData) : [];
    } catch (error) {
      console.error('Error getting chat sessions:', error);
      return [];
    }
  }

  async getChatSession(userId: string): Promise<ChatSession | null> {
    try {
      const sessions = await this.getChatSessions();
      return sessions.find(s => s.userId === userId) || null;
    } catch (error) {
      console.error('Error getting chat session:', error);
      return null;
    }
  }

  async addMessageToSession(userId: string, message: Message): Promise<void> {
    try {
      const session = await this.getChatSession(userId);
      if (session) {
        session.messages.push(message);
        session.lastActivity = Date.now();
        await this.saveChatSession(session);
      }
    } catch (error) {
      console.error('Error adding message to session:', error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.USER_KEY, this.CHATS_KEY]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();