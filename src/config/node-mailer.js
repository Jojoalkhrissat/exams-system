const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'YOUR EMAIL SMTP HERE',
    auth: {
        user: 'YOUR EMAIL HERE',
        pass: 'YOUR EMAIL PASSWORD HERE'
    }
});


const mailOptions = {
    from: 'YOUR EMAIL HERE',

};


module.exports={
    transporter,
    mailOptions
}