const request = require('request'),
    log4js = require('log4js'),
    cheerio = require('cheerio'),
    fs = require('fs'),
    nodemailer = require('nodemailer'),
    config = require('./config'),
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.auth_mail.user,
            pass: config.auth_mail.password
        }
    }),
    mailOptions = {
        from: config.auth_mail.user,
        to: config.receiver,
        subject: '輕鬆美膚門診餘額通知',
        html:
            '<a href="' + config.base_url + '/regist/regist_1.aspx">請上車</a>'
    };

const login = function() {
    return new Promise(function(resolve, reject) {
        request.post(
            {
                url: config.base_url + '/member/member_login.aspx',
                form: {
                    __VIEWSTATE:
                        '/wEPDwULLTE5NDc0MDM3NzUPZBYCZg9kFgICAw9kFgYCAQ9kFgoCDg8WAh4Lb25tb3VzZW92ZXIFPE1NX3N3YXBJbWFnZSgnSW1hZ2U0JywnJywnLi4vaW1hZ2VzL2hlYWRfbWVudTAxX292ZXIuanBnJywxKWQCDw8WAh8ABTxNTV9zd2FwSW1hZ2UoJ0ltYWdlNScsJycsJy4uL2ltYWdlcy9oZWFkX21lbnUwMl9vdmVyLmpwZycsMSlkAhAPFgIfAAU8TU1fc3dhcEltYWdlKCdJbWFnZTYnLCcnLCcuLi9pbWFnZXMvaGVhZF9tZW51MDNfb3Zlci5qcGcnLDEpZAIRDxYCHwAFPE1NX3N3YXBJbWFnZSgnSW1hZ2U3JywnJywnLi4vaW1hZ2VzL2hlYWRfbWVudTA0X292ZXIuanBnJywxKWQCEg8WAh8ABTxNTV9zd2FwSW1hZ2UoJ0ltYWdlOCcsJycsJy4uL2ltYWdlcy9oZWFkX21lbnUwNV9vdmVyLmpwZycsMSlkAgMPZBYCAgIPD2QWAh4Hb25jbGljawUPcmV0dXJuICBDaGVjaygpZAIFD2QWAmYPDxYCHgRUZXh0BRIgJmd0OyDmnIPlk6HnmbvlhaVkZGR1utQGUtKTzFStwJqJ9jVpOALBNw==',
                    __VIEWSTATEGENERATOR: '5795B9CA',
                    __EVENTVALIDATION:
                        '/wEWDgL2+7/FAgLEhZOqCALfzZi/DALAzZi/DALBzZi/DALCzZi/DAKG2fTbDQLpx4PXCQL90KKTCAKO9e+RAQK87PLABgKtrdWjCQLM/Mm6DALx9YjZBOyaoB6c4Cd203iWGqpj9429Ivwi',
                    ctl00$Topsearch1$txtKeyword: '請輸入關鍵字',
                    ctl00$Topsearch1$ddlType: 0,
                    ctl00$ContentPlaceHolder1$txtUserID:
                        config.auth_ezskin.user,
                    ctl00$ContentPlaceHolder1$txtPassword:
                        config.auth_ezskin.password,
                    ctl00$ContentPlaceHolder1$btnLogin: '登入',
                    ctl00$ContentPlaceHolder1$Paper1$txtEmail: '請輸入E-mail'
                }
            },
            function(error, response, body) {
                // 被轉址 /member/memberindex.aspx
                if (error || response.statusCode !== 302) {
                    return reject(error);
                }
                resolve('');
            }
        );
    });
};

const parse = function() {
    return new Promise(function(resolve, reject) {
        request(config.base_url + '/regist/regist_1.aspx', function(
            error,
            response,
            body
        ) {
            if (error || response.statusCode !== 200) {
                return reject(error);
            }

            const $ = cheerio.load(body),
                results = [],
                table_tr = $('#ctl00_ContentPlaceHolder1_dbOutpatient tr');

            for (let i = 1; i < table_tr.length; i++) {
                const table_td = table_tr.eq(i).find('td'),
                    date = table_td
                        .eq(0)
                        .text()
                        .replace(/(?:\\[rnt]|[\r\n\t])\s+/g, ''),
                    morning = table_td
                        .eq(1)
                        .text()
                        .replace(/(?:\\[rnt]|[\r\n\t])\s+/g, ''),
                    afternoon = table_td
                        .eq(2)
                        .text()
                        .replace(/(?:\\[rnt]|[\r\n\t])\s+/g, ''),
                    night = table_td
                        .eq(3)
                        .text()
                        .replace(/(?:\\[rnt]|[\r\n\t])\s+/g, '');

                results.push(
                    Object.assign({
                        date,
                        morning,
                        afternoon,
                        night
                    })
                );
            }

            fs.writeFileSync('results.json', JSON.stringify(results));

            const hasFreeTimes = results.filter(function(result) {
                if (
                    result.morning.search('餘額') > -1 ||
                    result.afternoon.search('餘額') > -1 ||
                    result.night.search('餘額') > -1
                ) {
                    return result;
                }
            });

            if (hasFreeTimes.length <= 0) {
                return resolve(results);
            }

            return transporter
                .sendMail(mailOptions)
                .then(function(info) {
                    return resolve(results);
                })
                .catch(function(error) {
                    return reject('Unable to send email: ' + error);
                });
        });
    });
};

const start = function() {
        Promise.all([login(), parse()])
            .then(values => {
                console.log(values);
            })
            .catch(error => {
                logger.error(error);
            });
    },
    logger = log4js.getLogger('ezskin');

log4js.configure({
    appenders: { ezskin: { type: 'file', filename: 'ezskin-notifier.log' } },
    categories: { default: { appenders: ['ezskin'], level: 'error' } }
});

start();
// 每30秒檢查一次
setInterval(start, 30 * 1000);
