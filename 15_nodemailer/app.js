const nodemailer = require('nodemailer');

async function sendEmail() {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jayparmar9879@gmail.com',
            pass: 'efmk zsdf ghok anyd'
        }
    });
    const mailOptions = {
        from: 'jayparmar9879@gmail.com',
        to: 'becharajaimin@gmail.com',
        subject: 'Test Email',
        text: 'This is a test email sent using Node.js and Nodemailer.',
        html : '<h1>This is a test email sent using Node.js and Nodemailer.</h1>'
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
}

sendEmail();
