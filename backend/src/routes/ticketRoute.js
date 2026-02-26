const express = require('express');
const router = express.Router();
const ticketService = require('../services/ticketService');
const authMiddleware = require('../middleware/authMiddleware');

// Criar um novo ticket
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, prioridade } = req.body;
        
        const novoTicket = await ticketService.openTicket(title, description, prioridade, req.user.id);
        return res.status(201).json(novoTicket);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Listar tickets 
router.get('/', authMiddleware, async (req, res) => {
    try {
        let tickets;
        
        if (req.user.role === 'ADMIN') {
            const { status } = req.query;
            tickets = status 
                ? await ticketService.listTicketsByStatus(status) 
                : await ticketService.listTicketsByClient(req.user.id); 
        } else {
            
            tickets = await ticketService.listTicketsByClient(req.user.id);
        }
        return res.status(200).json(tickets);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});


router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const ticket = await ticketService.getTicketById(req.params.id);
        return res.status(200).json(ticket);
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
});

// Atualizar o status de um ticket
router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;
        const ticketAtualizado = await ticketService.updateTicketStatus(req.params.id, status);
        return res.status(200).json(ticketAtualizado);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;