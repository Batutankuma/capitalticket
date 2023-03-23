const NotificationEmail = require('../bin/config');

async function sendMailer(emailClient, title, message) {
    try {
        let email = new NotificationEmail(process.env.PORT_MAIL, process.env.HOST_MAIL, process.env.USER_MAIL, process.env.PASSWORD_MAIL);
        email.sendEmail(emailClient, title, message)
    } catch (error) {
        throw error;
    }
}

module.exports = sendMailer;