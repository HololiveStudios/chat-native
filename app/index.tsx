import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { User } from 'lucide-react-native';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '@/services/storageService';
import { theme } from '@/constants/theme';
import { User as UserType } from '@/types';

export default function LoginScreen() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkExistingUser();
  }, []);

  const checkExistingUser = async () => {
    try {
      const existingUser = await storageService.getUser();
      if (existingUser) {
        router.replace('/pairing');
      }
    } catch (error) {
      console.error('Error checking existing user:', error);
    }
  };

  const handleLogin = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, insira seu nome de usuário');
      return;
    }

    setIsLoading(true);
    try {
      const user: UserType = {
        id: uuidv4(),
        name: name.trim(),
      };

      await storageService.saveUser(user);
      router.replace('/pairing');
    } catch (error) {
      console.error('Error saving user:', error);
      Alert.alert('Erro', 'Falha ao salvar usuário. Tente novamente.');
    } finally {
      setIsLoading(false);
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
            <User size={48} color={theme.colors.primary} />
          </View>
          <Text style={styles.title}>Chat P2P</Text>
          <Text style={styles.subtitle}>
            Bem-vindo ao chat peer-to-peer seguro
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome de usuário</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Digite seu nome..."
            placeholderTextColor={theme.colors.textSecondary}
            maxLength={50}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!isLoading}
          />
          
          <TouchableOpacity
            style={[
              styles.button,
              (!name.trim() || isLoading) && styles.buttonDisabled
            ]}
            onPress={handleLogin}
            disabled={!name.trim() || isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Seu ID único será gerado automaticamente
          </Text>
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
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: theme.spacing.xl,
  },
  label: {
    ...theme.typography.body,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
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
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    opacity: 0.5,
  },
  buttonText: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.caption,
    textAlign: 'center',
    lineHeight: 18,
  },
});