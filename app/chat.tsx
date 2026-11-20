import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Phone } from 'lucide-react-native';
import { MessageBubble } from '@/components/MessageBubble';
import { ChatInput } from '@/components/ChatInput';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { useChat } from '@/hooks/useChat';
import { storageService } from '@/services/storageService';
import { theme } from '@/constants/theme';
import { User, Message } from '@/types';

export default function ChatScreen() {
  const { targetUserId, targetUserName } = useLocalSearchParams<{
    targetUserId: string;
    targetUserName: string;
  }>();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  const {
    messages,
    connectionStatus,
    isLoading,
    sendMessage,
    connectToUser,
  } = useChat(
    currentUser?.id || '',
    targetUserId || '',
    targetUserName || ''
  );

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser && targetUserId) {
      connectToUser();
    }
  }, [currentUser, targetUserId, connectToUser]);

  useEffect(() => {
    // Auto scroll para a última mensagem
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadCurrentUser = async () => {
    try {
      const user = await storageService.getUser();
      if (!user) {
        router.replace('/');
        return;
      }
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading current user:', error);
      router.replace('/');
    }
  };

  const handleSendMessage = async (text: string) => {
    if (connectionStatus !== 'connected') {
      Alert.alert('Erro', 'Não conectado. Estabeleça uma conexão primeiro.');
      return;
    }
    await sendMessage(text);
  };

  const handleBack = () => {
    router.back();
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item}
      isOwn={item.senderId === currentUser?.id}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando chat...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {targetUserName || `Usuário ${targetUserId?.slice(-4)}`}
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            ID: {targetUserId?.slice(-8)}...
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.callButton}
          onPress={() => Alert.alert('Info', 'Chamadas não implementadas nesta versão')}
        >
          <Phone size={20} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <ConnectionStatus 
        status={connectionStatus} 
        userName={targetUserName}
      />

      <View style={styles.chatContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Nenhuma mensagem ainda.{'\n'}Envie a primeira mensagem!
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={connectionStatus !== 'connected'}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    ...theme.typography.subheading,
    fontWeight: '600',
  },
  headerSubtitle: {
    ...theme.typography.caption,
    marginTop: 2,
  },
  callButton: {
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  chatContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  emptyStateText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  messagesList: {
    paddingVertical: theme.spacing.md,
  },
});