import api from './apiClient';

/**
 * Sends a chat message history to the backend AI endpoint.
 * @param {Array} messages - Array of message objects { role: 'user' | 'bot', content: 'string' }
 * @returns {Promise<string>} The AI's reply text
 */
export const sendChatMessages = async (messages) => {
    try {
        const mappedMessages = messages.map(msg => ({
            role: msg.from === 'bot' ? 'assistant' : msg.from,
            content: msg.text
        }));
        const response = await api.post('/chat', { messages: mappedMessages });
        return response.data.reply;
    } catch (error) {
        console.error('Error sending chat messages:', error);
        throw error;
    }
};
