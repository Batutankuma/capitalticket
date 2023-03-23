const { sign } = require("jsonwebtoken");
const { compareSync, hashSync, genSaltSync } = require("bcryptjs");
const { validate } = require('email-validator');
const { PrismaClient } = require('@prisma/client');

let model = new PrismaClient();

class Authentification {
    /**
     * C'est une methode qui permet à l'utilisateur de se connecter dans l'application
     * @param {string} email 
     * @param {string} password 
     * @returns {string} Json Web Token
     */
    async localSignIn(email, password) {
        try {
            //verification si l'adresse email est valide
            if (!validate(email)) throw new Error("Votre Adresse Email est invalide !");

            const userExist = await model.user.findFirst({ where: { email: email } });
            //si l'utilisateur n'existe pas il renvoi ce message
            if (!userExist) throw new Error("Désolé Email ou Mot de Passe est incorrect!");
            const isValidePwd = compareSync(password, userExist.password);
            if (!isValidePwd) throw new Error("Désolé votre mot de pass ou password est incorrect!");
            let result = { key: sign({ userExist }, process.env.SECRET_KEY, { expiresIn: "24h" }),id_user: userExist.id};
            return result;
        } catch (error) {
            throw error;
        }
    }

    /**
     * C'est une methode qui permet à l'utilisateur de s'inscrirer dans l'application
     * @param {()} body 
     * @returns {string} de Json Web Token
     */
    async localSignUp(body) {
        try {
            let salt = genSaltSync(10);
            const pwd = hashSync(body.password, salt);
            //verification si l'adresse email est valide
            if (!validate(body.email)) throw new Error("Votre Adresse Email est invalide !");

            const emailExiste = await model.user.findFirst({ where: { email: body.email } });
            if (emailExiste) throw new Error("cette adresse email existe deja !");
            if (!pwd) throw err;
            //et password 
            const datas = { ...body, password: pwd };
            const user = await model.user.create({ data: datas });
            let result = { key: sign({ user }, process.env.SECRET_KEY, { expiresIn: "24h" }),id_user: user.id };
            return result;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}

module.exports = Authentification;