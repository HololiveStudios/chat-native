import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types';
import { theme } from '@/constants/theme';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={[
      styles.container,
      isOwn ? styles.ownMessage : styles.otherMessage
    ]}>
      <View style={[
        styles.bubble,
        isOwn ? styles.ownBubble : styles.otherBubble
      ]}>
        <Text style={styles.messageText}>{message.text}</Text>
        <View style={styles.metaContainer}>
          <Text style={styles.timestamp}>
            {formatTime(message.timestamp)}
          </Text>
          {isOwn && (
            <Text style={[
              styles.deliveryStatus,
              message.delivered ? styles.delivered : styles.pending
            ]}>
              {message.delivered ? '✓✓' : '✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  ownMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  ownBubble: {
    backgroundColor: theme.colors.messageSent,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: theme.colors.messageReceived,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...theme.typography.body,
    marginBottom: theme.spacing.xs,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timestamp: {
    ...theme.typography.caption,
    fontSize: 11,
  },
  deliveryStatus: {
    ...theme.typography.caption,
    fontSize: 12,
    marginLeft: theme.spacing.xs,
  },
  delivered: {
    color: theme.colors.primary,
  },
  pending: {
    color: theme.colors.textSecondary,
  },
});