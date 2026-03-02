const db = require('../config/db');
const Message = require('../models/messageModel');

class MessageRepository {
    async createMessage(sender_id, ticket_id, content) {
        const query = `
            INSERT INTO messages (sender_id, ticket_id, content) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `;
        const values = [sender_id, ticket_id, content];

        try {
            const result = await db.query(query, values);
            const row = result.rows[0];
            return new Message(row.id, row.sender_id, row.ticket_id, row.content, row.is_read, row.created_at);
        } catch (error) {
            console.error('Erro ao salvar mensagem:', error);
            throw error;
        }
    }

    async getMessagesByTicketId(ticket_id) {
        const query = 'SELECT * FROM messages WHERE ticket_id = $1 ORDER BY created_at ASC';
        try {
            const result = await db.query(query, [ticket_id]);
            return result.rows.map(row => 
                new Message(row.id, row.sender_id, row.ticket_id, row.content, row.is_read, row.created_at)
            );
        } catch (error) {
            console.error('Erro ao buscar mensagens do ticket:', error);
            throw error;
        }
    }

    async markAsRead(ticket_id, user_id) {
        const query = 'UPDATE messages SET is_read = true WHERE ticket_id = $1 AND sender_id != $2';
        try {
            await db.query(query, [ticket_id, user_id]);
            return true;
        } catch (error) {
            console.error('Erro ao marcar mensagens como lidas:', error);
            throw error;
        }
    }
}

module.exports = new MessageRepository();