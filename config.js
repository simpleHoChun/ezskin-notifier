require('dotenv').config();

const config = {
    base_url: 'https://www.ezskin.com.tw',
    auth_mail: {
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASS
    },
    auth_ezskin: {
        user: process.env.EZSKIN_USER,
        password: process.env.EZSKIN_PASS
    },
    receiver: process.env.RECEIVER.split(',')
};

module.exports = config;
