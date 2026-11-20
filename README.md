# Chat P2P - React Native Expo

Aplicativo de chat peer-to-peer desenvolvido com React Native e Expo, utilizando WebRTC para comunicação direta entre dispositivos.

## 🚀 Características

- **Comunicação P2P**: Conexão direta entre dispositivos usando WebRTC
- **Tema Escuro**: Interface inspirada no WhatsApp com excelente contraste
- **Armazenamento Local**: Histórico de conversas persistente
- **Interface Responsiva**: Otimizada para dispositivos móveis
- **Navegação Intuitiva**: Stack navigation fluida

## 📱 Funcionalidades

### Tela de Login
- Campo para nome de usuário
- Geração automática de UUID único
- Validação de entrada

### Tela de Pareamento
- Exibição e compartilhamento do ID único
- Campo para inserir ID do destinatário
- Botões de compartilhamento e cópia

### Tela de Chat
- Mensagens em tempo real
- Indicadores de status de entrega
- Timestamps formatados
- Scroll automático

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework principal
- **Expo SDK**: Plataforma de desenvolvimento
- **React Navigation**: Navegação entre telas
- **WebRTC**: Comunicação peer-to-peer
- **AsyncStorage**: Armazenamento local
- **TypeScript**: Tipagem estática

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- Expo CLI
- Dispositivo Android ou emulador

### Passos de Instalação

1. **Clone o repositório** (ou baixe os arquivos)

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Execute no dispositivo**:
   - Instale o Expo Go no seu dispositivo Android
   - Escaneie o QR code exibido no terminal
   - Ou execute `expo run:android` para emulador

## 🏗️ Build para Produção

### EAS Build (Recomendado)

1. **Instale o EAS CLI**:
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Configure o projeto**:
   ```bash
   eas build:configure
   ```

3. **Faça o build do APK**:
   ```bash
   eas build --platform android --profile preview
   ```

### Build Local

```bash
npm run build:web  # Para web
expo build:android # Para Android (legacy)
```

## 📁 Estrutura do Projeto

```
├── app/
│   ├── _layout.tsx         # Layout raiz com Stack Navigator
│   ├── index.tsx           # Tela de login
│   ├── pairing.tsx         # Tela de pareamento
│   └── chat.tsx            # Tela de chat
├── components/
│   ├── MessageBubble.tsx   # Componente de bolha de mensagem
│   ├── ChatInput.tsx       # Input de mensagem
│   ├── ConnectionStatus.tsx # Indicador de status
│   ├── LoadingIndicator.tsx # Indicador de carregamento
│   └── ErrorMessage.tsx    # Componente de erro
├── hooks/
│   ├── useFrameworkReady.ts # Hook do framework
│   └── useChat.ts          # Hook principal do chat
├── services/
│   ├── storageService.ts   # Serviço de armazenamento
│   └── webrtcService.ts    # Serviço WebRTC
├── types/
│   └── index.ts            # Definições de tipos
├── constants/
│   └── theme.ts            # Tema e cores
└── utils/
    └── dateUtils.ts        # Utilitários de data/hora
```

## 🎨 Design System

### Cores Principais
- **Background**: #121B22 (fundo principal)
- **Surface**: #1F2937 (superfícies elevadas)
- **Message Sent**: #005C4B (mensagens enviadas)
- **Message Received**: #202C33 (mensagens recebidas)
- **Primary**: #00A884 (cor primária)

### Tipografia
- **Heading**: 24px, peso 700
- **Subheading**: 18px, peso 600
- **Body**: 16px, peso 400
- **Caption**: 12px, peso 400

## 🔧 Configuração

### WebRTC
O serviço WebRTC está configurado com servidores STUN públicos. Para produção, considere:
- Implementar um servidor de sinalização real
- Adicionar servidores TURN para NAT traversal
- Implementar autenticação e segurança

### AsyncStorage
O armazenamento local persiste:
- Perfil do usuário
- Sessões de chat
- Histórico de mensagens

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro ao conectar**: Verifique se ambos os dispositivos estão na mesma rede
2. **Mensagens não chegam**: Confirme se a conexão WebRTC foi estabelecida
3. **App não inicia**: Limpe o cache do Expo e reinstale dependências

### Logs de Debug

```bash
# Para ver logs detalhados
expo start --dev-client --clear
```

## 📈 Próximos Passos

- [ ] Implementar servidor de sinalização real
- [ ] Adicionar chamadas de voz/vídeo
- [ ] Implementar grupos de chat
- [ ] Adicionar criptografia end-to-end
- [ ] Notificações push
- [ ] Compartilhamento de arquivos

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, abra uma issue ou envie um pull request.

---

**Nota**: Este é um projeto de demonstração. Para uso em produção, implemente um servidor de sinalização adequado e considere aspectos de segurança e escalabilidade.