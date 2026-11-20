import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate, MediaStream } from 'react-native-webrtc';
import { ConnectionStatus, Message } from '@/types';

export class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private connectionStatus: ConnectionStatus = 'disconnected';
  private onMessageReceived: ((message: Message) => void) | null = null;
  private onStatusChange: ((status: ConnectionStatus) => void) | null = null;

  private readonly configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  constructor() {
    this.setupPeerConnection();
  }

  private setupPeerConnection(): void {
    try {
      this.peerConnection = new RTCPeerConnection(this.configuration);
      
      this.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // Em uma implementação real, você enviaria isso via signaling server
          console.log('ICE Candidate:', event.candidate);
        }
      };

      this.peerConnection.ondatachannel = (event) => {
        const channel = event.channel;
        this.setupDataChannel(channel);
      };

      this.peerConnection.onconnectionstatechange = () => {
        const state = this.peerConnection?.connectionState;
        switch (state) {
          case 'connecting':
            this.updateStatus('connecting');
            break;
          case 'connected':
            this.updateStatus('connected');
            break;
          case 'disconnected':
          case 'failed':
            this.updateStatus('error');
            break;
          default:
            this.updateStatus('disconnected');
        }
      };

    } catch (error) {
      console.error('Error setting up peer connection:', error);
      this.updateStatus('error');
    }
  }

  private setupDataChannel(channel: RTCDataChannel): void {
    this.dataChannel = channel;

    channel.onopen = () => {
      console.log('Data channel opened');
      this.updateStatus('connected');
    };

    channel.onclose = () => {
      console.log('Data channel closed');
      this.updateStatus('disconnected');
    };

    channel.onmessage = (event) => {
      try {
        const message: Message = JSON.parse(event.data);
        this.onMessageReceived?.(message);
      } catch (error) {
        console.error('Error parsing received message:', error);
      }
    };

    channel.onerror = (error) => {
      console.error('Data channel error:', error);
      this.updateStatus('error');
    };
  }

  async createOffer(): Promise<RTCSessionDescription | null> {
    try {
      if (!this.peerConnection) return null;

      this.dataChannel = this.peerConnection.createDataChannel('messages', {
        ordered: true,
      });
      this.setupDataChannel(this.dataChannel);

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error('Error creating offer:', error);
      this.updateStatus('error');
      return null;
    }
  }

  async createAnswer(offer: RTCSessionDescription): Promise<RTCSessionDescription | null> {
    try {
      if (!this.peerConnection) return null;

      await this.peerConnection.setRemoteDescription(offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error('Error creating answer:', error);
      this.updateStatus('error');
      return null;
    }
  }

  async setRemoteAnswer(answer: RTCSessionDescription): Promise<void> {
    try {
      if (!this.peerConnection) return;
      await this.peerConnection.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error setting remote answer:', error);
      this.updateStatus('error');
    }
  }

  async addIceCandidate(candidate: RTCIceCandidate): Promise<void> {
    try {
      if (!this.peerConnection) return;
      await this.peerConnection.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  sendMessage(message: Message): boolean {
    try {
      if (this.dataChannel && this.dataChannel.readyState === 'open') {
        this.dataChannel.send(JSON.stringify(message));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  disconnect(): void {
    try {
      this.dataChannel?.close();
      this.peerConnection?.close();
      this.updateStatus('disconnected');
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }

  private updateStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.onStatusChange?.(status);
  }

  getStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  setOnMessageReceived(callback: (message: Message) => void): void {
    this.onMessageReceived = callback;
  }

  setOnStatusChange(callback: (status: ConnectionStatus) => void): void {
    this.onStatusChange = callback;
  }

  // Simulação de signaling server para desenvolvimento
  // Em produção, isso seria implementado com um servidor real
  async simulateConnection(targetUserId: string): Promise<boolean> {
    try {
      this.updateStatus('connecting');
      
      // Simula delay de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simula sucesso baseado no ID (para demonstração)
      if (targetUserId.length >= 6) {
        this.updateStatus('connected');
        return true;
      } else {
        this.updateStatus('error');
        return false;
      }
    } catch (error) {
      console.error('Error in simulated connection:', error);
      this.updateStatus('error');
      return false;
    }
  }
}

export const webrtcService = new WebRTCService();