import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ConnectionStatus as Status } from '@/types';
import { theme } from '@/constants/theme';

interface ConnectionStatusProps {
  status: Status;
  userName?: string;
}

export function ConnectionStatus({ status, userName }: ConnectionStatusProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'connecting':
        return {
          text: 'Conectando...',
          color: theme.colors.warning,
          backgroundColor: `${theme.colors.warning}20`,
        };
      case 'connected':
        return {
          text: `Conectado com ${userName || 'usuário'}`,
          color: theme.colors.success,
          backgroundColor: `${theme.colors.success}20`,
        };
      case 'error':
        return {
          text: 'Erro na conexão',
          color: theme.colors.error,
          backgroundColor: `${theme.colors.error}20`,
        };
      default:
        return {
          text: 'Desconectado',
          color: theme.colors.textSecondary,
          backgroundColor: `${theme.colors.textSecondary}20`,
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={[
      styles.container,
      { backgroundColor: statusInfo.backgroundColor }
    ]}>
      <View style={[
        styles.indicator,
        { backgroundColor: statusInfo.color }
      ]} />
      <Text style={[
        styles.text,
        { color: statusInfo.color }
      ]}>
        {statusInfo.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  text: {
    ...theme.typography.caption,
    fontWeight: '500',
  },
});