const express = require('express');
const router = express.Router();
const session = require('express-session');
const mail = require('../../config/index.js').nodemailer;
const controller = require('./controller.js')
// const {Model} = require('sequelize/types');
const port = process.env.PORT || 3000;
// Extended: https://swagger.io/specification/#infoObject
router.use(session({
    secret: 'web token secret',
    resave: false,
    saveUninitialized: false,
    sameSite: true,
    unset: 'destroy'
}));
router.use(express.json())
router.post('/login', (req, res) => {
  controller.login(res, req);
});
host='localhost';

router.get('/userdetails', (req, res) => {
  controller.userDetails(res, req);
});

router.post('/register', (req, res) => {
  controller.registerUser(res, mail.transporter, req, mail.mailOptions, host);
});


router.get('/logout', (req, res) => {
  controller.logout(req, res);
});


router.post('/resetpassword', (req, res) => {
  controller.resetPassword(res, req, mail.transporter, mail.mailOptions);
});


router.post('/verifytoken', (req, res) => {
  controller.verifyToken(res, req);
});


router.post('/changepassword', (req, res) => {
  controller.changePass(res, req, mail.transporter, mail.mailOptions);
});

module.exports=router;
