const express = require("express");
const fileUpload = require("express-fileupload")
const router = express.Router();
const session = require('express-session');
const mail = require('../../config/index.js').nodemailer;
const controller = require('./controller.js')
const port = process.env.PORT || 3000;
const host = "localhost"
// Extended: https://swagger.io/specification/#infoObject
router.use(session({
    secret: 'web token secret',
    resave: false,
    saveUninitialized: false,
    sameSite: true,
    unset: 'destroy'
}));
router.use(fileUpload({
    createParentPath: true,
}));
router.use(express.json())
router.get('/questions', (req, res) => {
    controller.getQuestions(res, req)
});



router.get('/exams', (req, res) => {
    controller.getExams(res, req)

});



router.get('/userexam', (req, res) => {
    controller.userExam(res, req)
});

router.post('/submitanswers', (req, res) => {
    controller.submitAnswers(res, req)
});
router.get('/userallexams', (req, res) => {
    controller.userAllExams(res, req)
});


router.post('/exam', (req, res) => {
    controller.createExam(res, req)
});

router.post('/addexamattempt', (req, res) => {
    controller.addAttempt(res, req, mail.transporter, mail.mailOptions);
});

router.put('/questionphoto', (req, res) => {

    controller.questonImage(res, req)
});

router.post('/setscore', (req, res) => {
    controller.setScore(req, res)
});

router.post('/updateanswers', (req, res) => {
    controller.updateAnswers(res, req)
});


router.post('/startexam', (req, res) => {
    controller.startExam(res, req);
});
module.exports = router