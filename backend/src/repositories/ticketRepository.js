const db = require('../config/db')

const Ticket = require('../models/ticketModel');
const TicketParticipants = require('../models/ticketParticipantsModel');

class TicketRepository {
    //Inserir ticket
    async createTicket(title, description, status, prioridade, client_id, agente_id) {
        const query = 'INSERT INTO tickets (title, description, status, prioridade, client_id, agente_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [title, description, status, prioridade, client_id, agente_id];

        try {
            const result = await db.query(query, values);
            const row = result.rows[0];

            return new Ticket(row.id, row.title, row.description, row.status, row.prioridade, row.client_id, row.agente_id);
        } catch (error) {
            console.error('Erro ao criar ticket:', error);
            throw error;
        }
    }


    //Atualizar ticket
    async updateTicket(id, title, description, status, prioridade, agente_id) {
        const query = 'UPDATE tickets SET title = $1, description = $2, status = $3, prioridade = $4, agente_id = $5 WHERE id = $6 RETURNING *';
        const values = [title, description, status, prioridade, agente_id, id];

        try {
            const result = await db.query(query, values);
            const row = result.rows[0];

            return new Ticket(row.id, row.title, row.description, row.status, row.prioridade, row.client_id, row.agente_id);
        } catch (error) {
            console.error('Erro ao atualizar ticket:', error);
            throw error;
        }
    }


    //Deletar ticket
    async deleteTicket(id) {
        const query = 'DELETE FROM tickets WHERE id = $1';
        try {
            await db.query(query, [id]);
            return true;
        } catch (error) {
            console.error('Erro ao deletar ticket:', error);
            throw error;
        }
    }


    //Buscar por id
    async getTicketById(id) {
        const query = 'SELECT * FROM tickets WHERE id = $1';
        try {
            const result = await db.query(query, [id]);
            if (result.rows.length === 0) {
                return null;
            }
            const row = result.rows[0];
            return new Ticket(row.id, row.title, row.description, row.status, row.prioridade, row.client_id, row.agente_id);
        } catch (error) {
            console.error('Erro ao buscar ticket por ID:', error);
            throw error;
        }
    }


    //Listar todos os tickets
    async getAllTickets() {
        const query = 'SELECT * FROM tickets';
        try {
            const result = await db.query(query);
            return result.rows.map(row => new Ticket(row.id, row.title, row.description, row.status, row.prioridade, row.client_id, row.agente_id));
        } catch (error) {
            console.error('Erro ao buscar todos os tickets:', error);
            throw error;
        }
    }


    //Listar tickets por cliente
    async getTicketsByClientId(client_id) {
        const query = 'SELECT * FROM tickets WHERE client_id = $1';
        try {
            const result = await db.query(query, [client_id]);
            return result.rows.map(row => new Ticket(row.id, row.title, row.description, row.status, row.prioridade, row.client_id, row.agente_id));
        } catch (error) {
            console.error('Erro ao buscar tickets por cliente:', error);
            throw error;
        }
    }


    //Listar tickets por agente
    async getTicketsByAgenteId(agente_id) {
        const query = 'SELECT * FROM tickets WHERE agente_id = $1';
        try {
            const result = await db.query(query, [agente_id]);
            return result.rows.map(row => new Ticket(row.id, row.title, row.description, row.status, row.prioridade, row.client_id, row.agente_id));
        } catch (error) {
            console.error('Erro ao buscar tickets por agente:', error);
            throw error;
        }
    }


    //Listar tickets por status
    async getTicketsByStatus(status) {
        const query = 'SELECT * FROM tickets WHERE status = $1';
        try {
            const result = await db.query(query, [status]);
            return result.rows.map(row => new Ticket(row.id, row.title, row.description, row.status, row.prioridade, row.client_id, row.agente_id));
        }
        catch (error) {
            console.error('Erro ao buscar tickets por status:', error);
            throw error;
        }
    }


    //Adicionar participante
    async addParticipant(ticket_id, user_id, role_in_ticket) {
        const query = 'INSERT INTO ticket_participants (ticket_id, user_id, role_in_ticket) VALUES ($1, $2, $3) RETURNING *';
        const values = [ticket_id, user_id, role_in_ticket];
        try {            
            const result = await db.query(query, values);
            const row = result.rows[0];
            return new TicketParticipants(row.ticket_id, row.user_id, row.role_in_ticket, row.joined_at);
        } catch (error) {
            console.error('Erro ao adicionar participante:', error);
            throw error;
        }
    }


    //Remover participante
    async removeParticipant(ticket_id, user_id) {
        const query = 'DELETE FROM ticket_participants WHERE ticket_id = $1 AND user_id = $2';
        try {
            await db.query(query, [ticket_id, user_id]);
            return true;
        } catch (error) {
            console.error('Erro ao remover participante:', error);
            throw error;
        }
    }


    //Listar participantes de um ticket
    async getParticipantsByTicketId(ticket_id) {
        const query = 'SELECT * FROM ticket_participants WHERE ticket_id = $1';
        try {
            const result = await db.query(query, [ticket_id]);
            return result.rows.map(row => new TicketParticipants(row.ticket_id, row.user_id, row.role_in_ticket, row.joined_at));
        } catch (error) {
            console.error('Erro ao buscar participantes por ticket:', error);
            throw error;
        }
    }
}

module.exports = new TicketRepository;  