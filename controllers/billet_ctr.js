const { PrismaClient } = require('@prisma/client');
const moment = require('moment');
const sendMailer = require("./../middlewares/mail");
let { trajets, billets, utilisateurs } = new PrismaClient();




class Controller {
    async creation({ body }, res) {
        try {
            //recupération du trajet par rapport à la reservation
            let trajetModel = await trajets.findUnique({ where: { id: body.trajetsId } });
            //recuperation des toutes les informations de l'utilisateur en fonction de son id
            let userModel = await utilisateurs.findUnique({ where: { id: body.utilisateursId } });
            //si le nombre de siege à confirmer est superieur au notre siege de trajet
            if (body.siege > trajetModel.siege) throw new Error(`Désolé, nous ne pourons pas effectuer cette opération car le nombre de servation est superieur au nombre siege restant ${trajetModel.siege}`);
            //calculer le nombre de siege restant 
            let siegeRestant = Math.abs(trajetModel.siege - body.siege);
            //le nombre de siege est 0 nous changons le status de trajet en false pour cloturé la reservation
            if (siegeRestant == 0) await trajets.update({ where: { id: trajetModel.id }, data: { status: false } });
            //si non nous reduisons le nombre de siege du trajet par le nombre siege de reservation
            await trajets.update({ where: { id: trajetModel.id }, data: { siege: siegeRestant } });
            //enregistrement de la nouvelle reservation et conversion de data String vers ObjectId pour UserId et TrajetId 
            let dataSave = await billets.create({ data: body});
            //le message envoyer au client par mail
            let message = `Merci ${userModel.fullname}, votre reservation est effectuée avec success`;
            await sendMailer(userModel.email, "confirmation de reservation", message);
            res.status(201).json({ message: "l'enregistrement est effectuée avec succes", data: dataSave });
        } catch (error) {
            res.status(400).json(error.message);
        }
    }

    async findById({ params }, res) {
        try {
            let result = await billets.findUnique({ where: { id: params.id }, include: { trajet: true, utilisateur: true } });
            res.status(201).json({ data: result });
        } catch (error) {
            res.status(401).json(error.message);
        }
    }

    async list(req, res) {
        try {
            let result = await billets.findMany({ include: { trajet: true, utilisateur: true } });
            res.status(201).json({ data: result });
        } catch (error) {
            res.status(401).json(error.message);
        }
    }

    async annulationBillet({ params }, res) {
        try {
            let billetModel = await billets.findUnique({ where: { id: params.id } });
            //verification si le billet est déjà annuler
            if (billetModel.iscancel) throw new Error('Désolé le billet est déjà annulé');
            let userModel = await utilisateurs.findUnique({ where: { id: billetModel.utilisateursId } });
            //la recupation de la date du jour de systeme pour la validation de l'annulation de billet
            let dateToDay = new Date(moment(Date.now()).format("YYYY-MM-DD"));
            let trajetInfo = await trajets.findUnique({ where: { id: billetModel.trajetsId } });
            //la recuperation de la date du depart 
            let dateDepart = new Date(moment(trajetInfo.datedepart).format("YYYY-MM-DD"));
            //verification si la date du jour et egale ou superieur à la date du depart
            if (dateDepart >= dateToDay) throw new Error("Vous ne pouvez pas effectuer cette opération, car la date d'annulation est expirée!");
            await trajets.update({ where: { id: trajetInfo.id }, data: { siege: Math.abs(trajetInfo.siege - 1), status: true } });
            //nous remetons le status en true
            await billets.update({ where: { id: params.id }, data: { iscancel: true, datecancel: new Date() } });
            //le message envoyer au client par mail
            let message = `Merci ${userModel.fullname}, votre billet est annulé avec success`;
            await sendMailer(userModel.email, "confirmation d'annulation ", message);
            res.status(201).json({ message: "Vous avez annuler" })
        } catch (error) {
            res.status(401).json(error.message);
        }
    }

    async updateById({ params, body }, res) {
        try {
            let result = await billets.update({ where: { id: params.id }, data: body });
            res.status(201).json({ message: "la modification est effectuée avec succes", data: result.id });
        } catch (error) {
            res.status(401).json(error.message);
        }
    }

    async deleteById({ params }, res) {
        try {
            await billets.delete({ where: { id: params.id } });
            return res.status(201).json({ message: "la suppresion est effectuée avec succes" });
        } catch (error) {
            res.status(401).json(error.message);
        }
    }
}

module.exports = Controller;