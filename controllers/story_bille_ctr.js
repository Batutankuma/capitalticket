const { PrismaClient } = require('@prisma/client');
const model = new PrismaClient();

class Controller {

    /**
     * La methode permet d'enregistrer l'historique de chaque billet annuler
     * @param {String} id_billet 
     * @param {number} siege 
     * @returns {Promise}
     */
    async create(id_billet, siege) {
        try {
            let result = await model.storyTicker.create({ data: { siege: siege, billetsId: id_billet } });
            return new Promise.resolve(result);
        } catch (error) {
            return new Promise.reject(error);
        }
    }

    async findAllStory(req, res) {
        try {
            let result = await model.storyTicker.findMany();
            res.status(201).json({ data: result });
        } catch (error) {
            res.status(401).json(error.message);
        }
    }

    async findById({ params }, res) {
        try {
            let result = await model.storyTicker.findFirst({ where: { id: params.id } });
            res.status(201).json({ data: result });
        } catch (error) {
            res.status(401).json(error.message);
        }
    }

}

module.exports = Controller;