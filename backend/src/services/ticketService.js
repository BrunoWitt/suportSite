const ticketRepository = require('../repositories/ticketRepository');

class TicketService {

    async openTicket(title, description, prioridade, userId) {
        if (!title || !description || !prioridade) {
            throw new Error("Título, descrição e prioridade são obrigatórios.");
        }

        const statusInicial = 'ABERTO';
        const agenteInicial = null;

        try {
            const novoTicket = await ticketRepository.createTicket(
                title, 
                description, 
                statusInicial, 
                prioridade, 
                userId, 
                agenteInicial
            );

            await ticketRepository.addParticipant(novoTicket.id, userId, 'CRIADOR');

            return novoTicket;

        } catch (error) {
            console.error("Erro no TicketService ao abrir ticket:", error);
            throw new Error("Não foi possível abrir o chamado no momento.");
        }
    }


    async listTicketsByClient(clientId) {
        try {
            return await ticketRepository.getTicketsByClientId(clientId);
        } catch (error) {
            console.error("Erro no TicketService ao listar tickets por cliente:", error);
            throw new Error("Não foi possível listar os chamados do cliente no momento.");
        }
    }


    async listTicketsByAgente(agenteId) {
        try {
            return await ticketRepository.getTicketsByAgenteId(agenteId);
        } catch (error) {
            console.error("Erro no TicketService ao listar tickets por agente:", error);
            throw new Error("Não foi possível listar os chamados do agente no momento.");
        }
    }


    async listTicketsByStatus(status) {
        try {
            return await ticketRepository.getTicketsByStatus(status);
        } catch (error) {
            console.error("Erro no TicketService ao listar tickets por status:", error);
            throw new Error("Não foi possível listar os chamados por status no momento.");
        }
    }


    async getTicketById(ticketId) {
        try {
            const ticket = await ticketRepository.getTicketById(ticketId);
            if (!ticket) {
                throw new Error("Chamado não encontrado.");
            }
            return ticket;
        } catch (error) {
            console.error("Erro no TicketService ao buscar ticket por ID:", error);
            throw new Error("Não foi possível buscar o chamado no momento.");
        }
    }


    async updateTicketStatus(ticketId, newStatus) {
        const validStatuses = ['ABERTO', 'EM ANDAMENTO', 'FECHADO'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error("Status inválido. Os status válidos são: ABERTO, EM ANDAMENTO, FECHADO.");
        }
        try {
            const updatedTicket = await ticketRepository.updateTicketStatus(ticketId, newStatus);
            if (!updatedTicket) {
                throw new Error("Chamado não encontrado para atualização.");
            }
            return updatedTicket;
        } catch (error) {
            console.error("Erro no TicketService ao atualizar status do ticket:", error);
            throw new Error("Não foi possível atualizar o status do chamado no momento.");
        }
    }
}

module.exports = new TicketService();