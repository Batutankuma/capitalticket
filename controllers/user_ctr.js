const Authentification = require('../middlewares/authentification');
const { PrismaClient } = require('@prisma/client');
const { localSignIn, localSignUp } = new Authentification();
const model = new PrismaClient();

class Controller {

    async signUp({ body }, res) {
        try {
            let result = localSignUp(body);
            return res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

    async signIn({ body }, res) {
        try {
            let result = localSignIn(body.email, body.password);
            return res.status(200).json(result);
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

    async findById({ params }, res) {
        try {
            let result = await model.user.findFirst({ where: { id: params.id } });
            return res.status(201).json({ data: result });
        } catch (error) {
            res.status(401).json(error.message);
        }
    }

    async updateById({ params, body }, res) {
        try {
            await model.user.update({ where: { id: params.id }, data: body });
            res.status(201).json({ message: "la modification est effectuée avec succes" });
        } catch (error) {
            console.log(error);
            res.status(401).json(error.message);
        }
    }

    async deleteById({ params }, res) {
        try {
            await model.user.delete({ where: { id: params.id } });
            return res.status(201).json({ message: "la suppresion est effectuée avec succes" });
        } catch (error) {
            res.status(401).json(error.message);
        }
    }
}

module.exports = Controller;