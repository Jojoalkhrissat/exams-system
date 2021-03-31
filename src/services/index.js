const conn = require("../models/connect.js").conn;
const genericHelper = require("../utils/generic-helper.js")
const userHelper = require("../utils/user-helper.js")
const examHelper = require("../utils/exam-helper.js")
const mail = require('../config/index.js').nodemailer;
const models = require('../models/index.js')
const {Sequelize}=require('sequelize')

async function loginUser(email,password,callback) {
    await models.Users.findOne({where:{email:email.toLowerCase()}}).then(function (result,err ) {
callback(genericHelper.checkParameters([email, password]) || userHelper.checkLoginCreds(password, result.password) ? result : null)
})
}

async function getQuestions(examId,callback) {
    await models.Questions.findAll({where:{examid:examId}}).then(function (result, err) {
        callback(err?null:result) 
     })
}

async function getExams(callback) {
    await models.Exams.findAll().then(function (result, err) {
        callback(err ? null : result)
    })
}

async function getAllUserExam(userId,callback) {
await conn.query('select E.id as examid,E.title as examTitle,Q.title as questionTitle,Q.id,Q.question,A.answer,A.score,Att.starttime,TIMESTAMPDIFF(SECOND,CURRENT_TIMESTAMP(),TIMESTAMPADD(SECOND,E.duration,att.starttime)) as time_remaining from exams E JOIN attempts Att on Att.examid=E.id left join questions Q on E.id=Q.examid left join answers A on Att.userid=A.userid where Att.userid=?', {
        replacements: [userId]
    }).then(function (results, err) {
        callback(results)
            
})
}

async function getUserExam(userId, examId, callback) {
  await conn.query('select E.id as examid,E.title as examTitle,Q.title as questionTitle,Q.id,Q.question,A.answer,A.score,Att.starttime,TIMESTAMPDIFF(SECOND,CURRENT_TIMESTAMP(),TIMESTAMPADD(SECOND,E.duration,att.starttime)) as time_remaining from exams E JOIN attempts Att on Att.examid=E.id left join questions Q on E.id=Q.examid left join answers A on Att.userid=A.userid where Att.userid=? and E.id=?', {
            replacements: [userId, examId]
        }).then(function (results, err) {
            callback(results)
        })
}

async function checkExamTime(userId, examId,callback) {
  await conn.query('SELECT E.title,E.description,A.userid,A.examid,A.attemptdate,A.status,TIMESTAMPDIFF(SECOND,CURRENT_TIMESTAMP(),TIMESTAMPADD(SECOND,E.duration,starttime)) as time_remaining FROM attempts A join exams E on E.id=A.examid where A.userid=? and A.examid=?', {
            replacements: [userId,examId]
        }).then(function (results, err) {
                err || results[0].time_remaining <= 0 || results[0].status == 'FINISHED' ?
                models.Attempts.update({
                    status: "FINISHED"
                }, {
                    where: {
                        examid:examId,
                        userid:userId
                    }
                }).then(function (result, err) {
                        callback(null)
                    }): callback(results)
                })
}

async function sendAnswers(answers,userId,callback) {
answers.forEach(element => {
    element.userid = userId;
});
await models.Answers.bulkCreate(answers, {
    updateOnDuplicate: ["questionid", "userid"]
}).then(function (result, err) {
    err || result.affectedRows == 0 ? callback(null) : callback(result)
})
                 
}

async function checkOtp(token, otp) {
   return token !== otp || !token
}

async function changePass(hashedPassword,sessionId,callback) {
    await models.Users.update({
        password: hashedPassword
    },{where:{id:sessionId}}).then(function (result, err) {
callback();
        })
}

async function getUserDetails(userId, email,callback) {
    !email?
   await models.Users.findByPk(userId)
    .then(function (result) {
             callback(result)
         }): await models.Users.findOne({where:{email:email.toLowerCase()}})
             .then(function (result) {
                 callback(result)
             })
}

async function startExam(examId, userId,callback) {
   await models.Attempts.update({
           starttime: Sequelize.literal('CURRENT_TIMESTAMP()'),
           status: "IN PROGRESS"
       }, {
           where: {
               examid: examId,
               userid: userId,
               status: "NOT STARTED"
           }
       }).then(
            function (result) {
                callback(result)
            })
}

async function insertUserInfo(firstname, lastname, hashedPassword,email,phonenumber,callback) {
    await models.Users.create({
        firstname: firstname,
        lastname: lastname,
        email: email.toLowerCase(),
        password: hashedPassword,
        phonenumber: phonenumber
    }).then(function (result) {
            callback(result)
        })
}

async function insertExam(id, title, description,duration,questions,callback) {
await models.Exams.create({
id:id, 
title:title, 
description:description, 
duration:duration,
questions: questions
    },{
    include:[models.Questions]}).then(function (result, err) {
                result.affectedRows == 0 ?
                callback(null):
                callback(result)
        })

}

async function getUserById(userId, callback) {
   await models.Users.findByPk(userId).then(function (userResult, err) {
                userResult.length == 0 || !userId ?
                callback(null):
                callback(userResult)
        })
}

async function insertAttempt(userId, examId, callback) {
   await models.Attempts.create({
        userid: userId,
        examid: examId
    }
    ).then(function (result, err) {
                result.affectedRows == 0 ?
                    callback(null):
                callback(result)
                })
}

async function updatePhtoto(name, id, callback) {
   await models.Questions.update({photo:name},{where:{id}}).then(function (result) {
                result.affectedRows == 0 ?
                callback(null):
                    callback(result)
        })
}

async function addScore(score, userId, questionId, callback) {
   await models.Answers.update({score:score},{where:{userid:userId,questionid:questionId}}).then(function (result, err) {
                result.affectedRows == 0 ?
                callback(null):
                callback(result)
            })
}


module.exports={
loginUser,
getQuestions,
getAllUserExam,
getUserExam,
checkExamTime,
sendAnswers,
checkOtp,
changePass,
getExams,
getUserDetails,
startExam,
insertUserInfo,
insertExam,
getUserById,
insertAttempt,
updatePhtoto,
addScore
}