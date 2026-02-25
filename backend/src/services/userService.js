const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRepository = require('../repositories/userRepositories');

const JWT_SECRET = process.env.JWT_SECRET

class UserService {
    async login(email, senha){

        try{
            const user = await userRepository.findByEmail(email);
            if (!user) {
                console.log("Usuário não encontrado no banco para o email:", email);
                throw new Error("Usuário não existe");
            }

            const validPassword = await bcrypt.compare(senha, user.senha_hash);
            if (!validPassword) {
                throw new Error("Senha incorreta"); // Mudei a mensagem temporariamente para sabermos onde falha
            }

            const token = jwt.sign(
                {id: user.id, role: user.role},
                JWT_SECRET,
                { expiresIn: '1d'}
            );

            return {
                token, 
                user: { id: user.id, nome: user.nome, role: user.role }
            };
            
        } catch (error) {
            console.error(error); 
            throw new Error(error.message); 
        }
    }
}

module.exports = new UserService();