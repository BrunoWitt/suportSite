const express = require('express');
const router = express.Router();
const messageService = require('../services/messageService');
const authMiddleware = require('../middleware/authMiddleware');

// Enviar uma mensagem em um ticket
router.post('/:ticketId', authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        const { ticketId } = req.params;
        
        const mensagem = await messageService.sendMessage(req.user.id, ticketId, content);

        req.io.to(`ticket_${ticketId}`).emit('newMessage', mensagem);

        return res.status(201).json(mensagem);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Listar todas as mensagens de um ticket (Histórico)
router.get('/:ticketId', authMiddleware, async (req, res) => {
    try {
        const { ticketId } = req.params;
        const historico = await messageService.getChatHistory(ticketId, req.user.id);
        return res.status(200).json(historico);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router;