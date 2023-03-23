const { PrismaClient } = require('@prisma/client');
const model = new PrismaClient();

class Controller {

    async create({ body }, res) {
        try {
            let result = await model.route.create({ data: body });
            res.status(201).json({ message: "l'enregistrement est effectuée avec succes", data: result });
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

    async findById({ params }, res) {
        try {
            let result = await model.route.findFirst({ where: { id: params.id } });
            res.status(201).json({ data: result });
        } catch (error) {
            res.status(401).json(error.message);
        }
    }

    async updateById({ params, body }, res) {
        try {
            await model.route.update({ where: { id: params.id }, data: body });
            res.status(201).json({ message: "la modification est effectuée avec succes" });
        } catch (error) {
            res.status(401).json(error.message);
        }
    }

    async deleteById({ params }, res) {
        try {
            let result = await model.route.delete({ where: { id: params.id } });
            return res.status(201).json({ message: "la suppresion est effectuée avec succes", data: result.id });
        } catch (error) {
            res.status(401).json(error.message);
        }
    }

    //liste des trajet disponible
    async listDispoTrajet(req, res) {
        try {
            let result = await model.route.findMany({ where: { status: true } });
            if (result.length == 0) throw new Error("Désolé, il y a plus de disponible pour ce billet, toutes les places sont réservé");
            return res.status(201).json({ message: "la liste de trajet disponible", data: result });
        } catch (error) {
            res.status(401).json(error.message);
        }
    }
}

module.exports = Controller;