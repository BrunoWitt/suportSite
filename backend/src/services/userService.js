const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET

class UserService {
    async login(req, res){
        const {email, senha} =  req.body;

        try{
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.status(400).json({error: "Credenciais errados"});
            }

            const validPassword = await bcrypt.compare(senha, user.senha_hash);
            if (!validPassword) {
                return res.status(400).json({error: "Credenciais invalidas"});
            }

            const token = jwt.sign(
                {id: user.id, role: user.role},
                JWT_SECRET,
                { expiresIn: '1d'}
            );

            res.json({token, user: {id: user.id, nome: user.nome, role: user.role}});
            
        } catch (error){
            console.error(error);
            res.status(500).json({error: "Erro no login"});
        }
    }
}

module.exports = new UserService();