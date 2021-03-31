const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const conn = require("../../models/connect.js").conn;
const generatepass = require('../../models/generate-password.js').generatepass;
const userHelper = require("../../models/user-helper.js")
const genericHelper = require("../../models/generic-helper.js")
const examHelper = require("../../models/exam-helper.js")
const services=require('../../services/index.js');
const mail = require('../../config/index.js').nodemailer;
const validator = require('validator');

function login(res, req) {
services.loginUser(req.body.email, req.body.password, function (result) {
!result ? res.status(400).send('wrong password'):
    userHelper.returnUserData(result, req, res,function(){
    res.status(200).send(JSON.stringify((result)))
    })
})
}

function userDetails(res, req) {
       services.getUserDetails(req.query.userId, req.query.email, function (result) {
            result.password=''
            return !result  ? res.status(400).send('there are no results') : res.status(200).send(result)
        })
}

function logout(req, res) {
    req.session.destroy(err => {
       err? res.send({error: 'Logout error'}):
        res.clearCookie("SID").send('logout successful');
        req.session = null
    })
}


function resetPassword(res, req, transporter, mailOptions) {
  services.getUserDetails(undefined,email, function (result) {
       !result ?
            res.status(400).send('Wrong username') :
            genericHelper.sendEmail(transporter, req.body.email, 'resetting your password', "your one time password to reset your password is: " + generatepass(6), mailOptions, function () {
                userHelper.createOtp(req, result[0])
                res.status(200).send('email sent')
            })
    })
}


function changePass(res, req, transporter, mailOptions) {
     hashedPassword = bcryptjs.hashSync(req.body.password, 8);
   services.changePass(hashedPassword, req.session.uid, function () {
      err || req.body.password != req.body.retype || req.session.success != true || !req.session.uid ?
          req.session.destroy(err => {
              res.status(400).send('wrong token or passwords don\'t match')
              req.session = null
          }) :
          req.session.destroy(err => {
              genericHelper.sendEmail(transporter, req.session.email, 'your password', "your new password is: " + req.body.password, mailOptions)
              res.clearCookie("otp").send('changed password correctly');
              req.session = null
          })
   })
}


function verifyToken(res, req) {
    services.checkOtp(req.body.token, req.session.otp)?
       res.status(400).send('wrong token'):
    req.session.success = true
     res.status(200).send('token correct')
}




function registerUser(res, transporter, req, mailOptions, host) {
    let phonenumber = !req.body.phonenumber ? null : req.body.phonenumber
    password = generatepass(10)
    let hashedPassword = bcryptjs.hashSync(password, 8);
    !validator.isEmail(req.body.email) || !req.body.lastname || !req.body.firstname ?
        res.status(400).send('something is wrong') :
        services.insertUserInfo(req.body.firstname, req.body.lastname, hashedPassword, req.body.email, phonenumber, function (result) {
            result.affectedRows == 0 ?
                res.status(400).send('user was not added for some reason, make sure the user doesn\'t exist before you add') :
                genericHelper.sendEmail(transporter, req.body.email, "registered with the exam system", "please go into " + host + "\n you were registered into the exams system\n please use your email as username and your password will be: " + password, mailOptions, function () {
                    res.status(200).send("Email sent to new user")
                })
        })

}

module.exports = {
    login,
    userDetails,
    logout,
    resetPassword,
    changePass,
    verifyToken,
    registerUser
}