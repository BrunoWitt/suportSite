const messageRepository = require('../repositories/messageRepository');
const ticketRepository = require('../repositories/ticketRepository');

class MessageService {
    async sendMessage(sender_id, ticket_id, content) {
        if (!content || content.trim() === '') {
            throw new Error("O conteúdo da mensagem não pode estar vazio.");
        }

        try {
            // Verifica se o ticket existe antes de enviar mensagem
            const ticket = await ticketRepository.getTicketById(ticket_id);
            if (!ticket) {
                throw new Error("Ticket não encontrado.");
            }

            // Impede mensagens em tickets fechados
            if (ticket.status === 'FECHADO') {
                throw new Error("Não é possível enviar mensagens em um ticket encerrado.");
            }

            return await messageRepository.createMessage(sender_id, ticket_id, content);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getChatHistory(ticket_id, user_id) {
        try {
            const messages = await messageRepository.getMessagesByTicketId(ticket_id);
            // Marcar mensagens como lidas ao abrir o chat
            await messageRepository.markAsRead(ticket_id, user_id);
            return messages;
        } catch (error) {
            throw new Error("Erro ao carregar histórico de mensagens.");
        }
    }
}

module.exports = new MessageService();