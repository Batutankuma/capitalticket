const { validate } = require('email-validator');
const nodemailer = require('nodemailer');


class Email {
    /**
     * C'est un constructeur de la classe Email
     * @param {number} port 
     * @param {string} host 
     * @param {string} username 
     * @param {string} password 
     */
    constructor(port, host, username, password) {
        this.username = username;
        this.password = password;
        this.port = port;
        this.host = host;
    }

    /**
    * la methode sendMail permet d'envoyer un message de notification à l'utilisateur
    * @param {string} recev ici il faut preciser l'adresse de destinateur
    * @param {string} title c'est l'objet du message
    * @param {string} message les contenus du message que vous allez envoyer
    * @returns {number} retour 0 
    */
    sendEmail = async (recev, title, message) => {
        try {
            if (!validate(recev)) throw new Error("l'address email est invalide");
            let user = this.username;
            let pwd = this.password;

            // create transport
            let transporter = nodemailer.createTransport({
                host: this.host,
                port: this.port,
                secureConnection: false,// true for 465, false for other ports
                auth: {
                    user: user, // generated ethereal user
                    pass: pwd, // generated ethereal password
                },
            });

            // create model send email
            await transporter.sendMail({
                from: `"Your Name Application 👻" ${user}`, // sender address
                to: recev, // list of receivers
                subject: title, // Subject line
                text: message, // plain text body
                html: `<b>${message}</b>`, // html body
            });
            return true;
        } catch (error) {
            return error;
        }

    }
}

module.exports = Email;