const moment = require('moment');
/**
 * C'est une fonction qui permet de change la date qui ete en string pour type date
 * @param {string} ex: 2022-12-12 
 * @returns {Date} la fonction retourn une data
 */
module.exports.formatDate = (date) => {
    let formatDate = new Date(moment(date).format("YYYY-MM-DD"));
    return formatDate;
};