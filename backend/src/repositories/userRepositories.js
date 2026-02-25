const db = require('../config/db');

const User = require('../models/userModel');

class UserRepository {
    async createUser(nome, email, senha_hash, role = 'CLIENTE'){
        /*
            Função responsável por criar um novo usuário no DB
        */
        const query = 'INSERT INTO users (nome, email, senha_hash, role) VALUES ($1, $2, $3, $4) RETURNING *';
        const values = [nome, email, senha_hash, role];
        
        try {
            const result = await db.query(query, values);
            const row = result.rows[0];
            
            return new User(row.id, row.nome, row.email, row.senha_hash, row.role);

        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }


    async findByEmail(email) {
        //Função responsável por buscar um usuário pelo email no momento de entrar no site 
        const queryText = `SELECT * FROM users WHERE email = $1`;
        
        try {
            const result = await db.query(queryText, [email]);
            const row = result.rows[0];

            if (!row) return null; 

            return new User(row.id, row.nome, row.email, row.senha_hash, row.role);

        } catch (error) {
            console.error("Erro ao buscar utilizador por email:", error);
            throw error;
        }
    }


    async findById(id) {
        //Função responsável por buscar um usuário pelo id no momento de entrar no site 
        const queryText = `SELECT * FROM users WHERE id = $1`;
        try {
            const result = await db.query(queryText, [id]);
            const row = result.rows[0];
            if (!row) return null;

            return new User(row.id, row.nome, row.email, row.senha_hash, row.role);
        } catch (error) {
            console.error("Erro ao buscar utilizador por ID:", error);
            throw error;
        }
    }


    async getAllUsers() {
        //Função responsável por buscar todos os usuários para o admin
        const queryText = `SELECT * FROM users`;
        try {
            const result = await db.query(queryText);
            return result.rows.map(row => new User(row.id, row.nome, row.email, row.senha_hash, row.role));
        } catch (error) {
            console.error("Erro ao buscar todos os utilizadores:", error);
            throw error;
        }
    }


    async deleteUser(id) {
        //Função responsável por deletar um usuário para o admin
        const queryText = `DELETE FROM users WHERE id = $1`;
        try {
            await db.query(queryText, [id]);
        } catch (error) {
            console.error("Erro ao deletar utilizador:", error);
            throw error;
        }
    }
}

module.exports = new UserRepository();
