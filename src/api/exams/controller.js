const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const conn = require("../../models/connect.js").conn;
const generatepass = require('../../models/generate-password.js').generatepass;
const userHelper = require("../../models/user-helper.js")
const genericHelper = require("../../models/generic-helper.js")
const examHelper = require("../../models/exam-helper.js")
const services = require('../../services/index.js');
const mail = require('../../config/index.js').nodemailer;
const {v4: uuidv4} = require('uuid');

function getQuestions(res, req) {
    services.getQuestions(req.query.examId, function (result) {
        res.status(200).send(result);
    }).catch(function (err) {
        res.status(400).send("something went wrong")
    })
}


function getExams(res, req) {
    services.getExams( function (result) {
        res.status(200).send(result);
    }).catch(function (err) {
        res.status(400).send("something went wrong")
    })
}


function userAllExams(res, req) {
    services.getAllUserExam(req.query.userId, function (results) {
        return res.status(200).send(examHelper.groupExam(results[0]))
    })
}

function userExam(res, req) {
    services.getUserExam(req.query.userId, req.query.examId, function (result) {
        return res.status(200).send(examHelper.groupExam(result))
    })
}

function submitAnswers(res, req) {
    req.body.answers = Object.values(req.body.answers)
    userHelper.checkUserSession(req) ? res.status(400).send('wrong session') :
        services.checkExamTime(req.body.userId, req.body.examId, function (results) {
            !results ? res.status(400).send('you can\'t submit those answers now') :
                services.sendAnswers(req.body.answers, req.body.userId, function (result,err) {
                 res.status(200).send(req.body)
                })
        }).catch(function (err) {
            res.status(400).send('you can\'t submit those answers now')
        });
}


function startExam(res, req) {
    services.startExam(req.body.examId, req.body.userId, function (result, err) {
        res.status(200).send("exam is started")
    }).catch(function (err) {
        res.status(400).send("the exam is already started or something went wrong")
    })
}

function updateAnswers(res, req) {
    req.body.answers = Object.values(req.body.answers)
    userHelper.checkUserSession(req) ? res.status(400).send('wrong session') :
        services.checkExamTime(req.body.userId, req.body.examId, function (results) {
            !results ? res.status(400).send('you can\'t submit those answers now') :
                services.sendAnswers(req.body.answers, req.body.userId, function (result) {
                res.status(200).send(req.body)
                })
        }).catch(function (err) {
            res.status(400).send('you can\'t submit those answers now')
        })
}




function createExam(res, req) {
    duration = req.body.duration * 60;
    req.body.id = uuidv4();
    req.body.questions = Object.values(req.body.questions);
    !req.body.questions[0].question ? res.status(400).send('the exam wasn\'t added for some reason') :
        services.insertExam(req.body.id, req.body.title, req.body.description, duration,req.body.questions, function (result) {
        res.status(200).send(req.body)
        }).catch(function (params) {
        res.status(400).send('the exam wasn\'t added for some reason')
        })
}



function addAttempt(res, req, transporter, mailOptions) {
    req.body.date = genericHelper.createDate()
    req.body.status = "NOT STARTED";
    services.getUserById(req.body.userId, function (userResult) {
        !userResult ?
            res.status(400).send('you can\'t add this attempt') :
            services.insertAttempt(req.body.userId, req.body.examId, function (examResult, err) {
                !examResult ?
                    res.status(400).send('you can\'t add the attempt') :
                    genericHelper.sendEmail(transporter, userResult.email, 'your assigned exam', "you were assigned the exam with the id: " + req.body.examId + ", exam topic: " + examResult.title, mailOptions, function () {
                        res.status(200).send(req.body)
                    })
            })
    }).catch(function (params) {
        res.status(400).send('you can\'t add this attempt')
    })
}


function questonImage(res, req) {
    ext = req.files.file.mimetype.split('/')
    req.files.file.name = req.body.id + '.' + ext[1];
    const path = __dirname + '../public/uploads/question/' + req.files.file.name
    req.files.file.name = '../public/uploads/question/' + req.files.file.name;
    req.files.file.mv(path, (err) => {
        err ?
            res.status(400).send('the photo wasn\'t added for some reason') :
            services.updatePhtoto(req.files.file.name, req.body.id, function (result) {
                    res.status(200).send(JSON.stringify({
                        status: 'success',
                        path: path
                    }))
            }).catch(function (err) {
                res.status(400).send('the photo wasn\'t added for some reason')
            })
    })
}


function setScore(req, res) {
    services.addScore(req.body.score, req.body.userId, req.body.questionId, function (result) {
            res.status(200).send(req.body)
    }).catch(function (err) {
         res.status(400).send('you can\'t submit score')
    })
}







module.exports = {
    getExams,
    userExam,
    submitAnswers,
    startExam,
    updateAnswers,
    userAllExams,
    createExam,
    getQuestions,
    questonImage,
    addAttempt,
    setScore
}