const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        const dadosLogin = await userService.login(email, senha);
        
        return res.status(200).json(dadosLogin);

    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

module.exports = router; 