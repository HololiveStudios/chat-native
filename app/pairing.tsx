import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Link2, Copy, Users } from 'lucide-react-native';
import { storageService } from '@/services/storageService';
import { theme } from '@/constants/theme';
import { User } from '@/types';
import * as Clipboard from 'expo-clipboard';

export default function PairingScreen() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [targetUserId, setTargetUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await storageService.getUser();
      if (!user) {
        router.replace('/');
        return;
      }
      setCurrentUser(user);
    } catch (error) {
      console.error('Error loading user:', error);
      router.replace('/');
    }
  };

  const handleConnect = async () => {
    if (!targetUserId.trim()) {
      Alert.alert('Erro', 'Por favor, insira o ID do usuário');
      return;
    }

    if (targetUserId.trim() === currentUser?.id) {
      Alert.alert('Erro', 'Você não pode conectar consigo mesmo');
      return;
    }

    setIsLoading(true);
    try {
      // Simula validação do ID do usuário
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      router.push({
        pathname: '/chat',
        params: { 
          targetUserId: targetUserId.trim(),
          targetUserName: `Usuário ${targetUserId.slice(-4)}` // Nome simulado
        }
      });
    } catch (error) {
      console.error('Error connecting:', error);
      Alert.alert('Erro', 'Falha ao conectar com o usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (currentUser?.id) {
      try {
        await Clipboard.setStringAsync(currentUser.id);
        Alert.alert('Sucesso', 'ID copiado para a área de transferência');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
      }
    }
  };

  const shareId = async () => {
    if (currentUser?.id) {
      try {
        await Share.share({
          message: `Meu ID do Chat P2P: ${currentUser.id}`,
          title: 'ID do Chat P2P',
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Users size={48} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Conectar Usuários</Text>
          <Text style={styles.subtitle}>
            Compartilhe seu ID ou insira o ID de outro usuário
          </Text>
        </View>

        <View style={styles.userIdSection}>
          <Text style={styles.sectionTitle}>Seu ID único</Text>
          <View style={styles.idContainer}>
            <Text style={styles.userId} numberOfLines={1}>
              {currentUser?.id || 'Carregando...'}
            </Text>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={copyToClipboard}
            >
              <Copy size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={shareId}>
            <Text style={styles.shareButtonText}>Compartilhar ID</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.connectSection}>
          <Text style={styles.sectionTitle}>Conectar com usuário</Text>
          <TextInput
            style={styles.input}
            value={targetUserId}
            onChangeText={setTargetUserId}
            placeholder="Cole o ID do usuário aqui..."
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
          
          <TouchableOpacity
            style={[
              styles.connectButton,
              (!targetUserId.trim() || isLoading) && styles.buttonDisabled
            ]}
            onPress={handleConnect}
            disabled={!targetUserId.trim() || isLoading}
          >
            <Link2 size={20} color={theme.colors.text} />
            <Text style={styles.buttonText}>
              {isLoading ? 'Conectando...' : 'Conectar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl * 2,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.heading,
    fontSize: 28,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  userIdSection: {
    marginBottom: theme.spacing.xl * 2,
  },
  sectionTitle: {
    ...theme.typography.subheading,
    marginBottom: theme.spacing.md,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  userId: {
    flex: 1,
    ...theme.typography.body,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  iconButton: {
    padding: theme.spacing.sm,
  },
  shareButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  shareButtonText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  connectSection: {
    marginBottom: theme.spacing.xl,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  connectButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.5,
  },
  buttonText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
});