const nodemailer = require("nodemailer");

const sendMail = async (options) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Abu bakkar Codex 👻" <maddison53@ethereal.email>', // sender address
            to: options.email, // list of receivers
            // replyTo: "noreply@noreply.com",
            subject: options.subject, // Subject line
            text: options.text, // plain text body
            // html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }

    main().catch(console.error);
}

module.exports = {
    sendMail
}