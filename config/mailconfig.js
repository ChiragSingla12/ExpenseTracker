"use strict";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    // host: "smtp.forwardemail.net",
    // port: 465,
    // secure: true,
    service: "gmail",
    auth: {
        user: "Chiragsingla1254@gmail.com",
        pass: "kiiz vvlk apar rxnn"
    },
});
// async function main(email,id) {


//     console.log('--------------->>>>>>>>>>>>', email);
//     const info = await transporter.sendMail({
//         from: 'Chiragsingla1254@gmail.com', // sender address
//         to: email, // list of receivers
//         subject: "Hello ✔", // Subject line
//         text: "Hello world?", // plain text body
//         html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>` // html body
//     });

//     console.log("Message sent: %s", info.messageId);
// }



module.exports = {
    transporter
}
