const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const genericHelper=require("./generic-helper.js");
function checkLoginCreds(password, comparedPassword) {
    return !bcryptjs.compareSync(password, comparedPassword) ? null : 'correct'
}
function returnUserData(result,req,res,callback) {
      let id = result.id
      const token = jwt.sign({
          id
      }, 'web token secret')
       result.password=''
      result.token = 'Bearer ' + token;
      res.set('Authorization', 'Bearer ' + token);
      req.session.isAuth = true;
      req.session.SID = req.session.id;
      callback();
}
function checkUserSession(req) {
return req.session.SID != req.session.id ? true : false
}
function prepareSubmitAnswers(object,userId,callback) {
    object = !object ? {} : object
    let prepared = [];
let submitAnswers = 'INSERT INTO answers (userid,questionid,answer) VALUES ';
    Object.entries(object).forEach(([key, value]) => {

        submitAnswers = submitAnswers + '(?,?,?),';
        prepared.push(userId, key, value)

    });
    //this two loop is to make the query and prepare statement
    submitAnswers = submitAnswers.replace(/,\s*$/, "");
    callback(prepared, submitAnswers)
    
}

function prepareEditAnswers(object,userId, callback) {
    object = !object ? {} : object
   let submitAnswers = 'UPDATE answers SET answer = (case';
   let condition = ' end) WHERE questionid in (';
   let prepared = [];
   let conditionPrepared = [];
   Object.entries(object).forEach(([key, value]) => {
       submitAnswers = submitAnswers + ' when questionid =? then ?';
       prepared.push(key, value)

       conditionPrepared.push(key)
       condition = condition + '?,'

   });
   //these two loops are to make the query and prepare statement
   conditionPrepared.forEach(conditionPrep => {
       prepared.push(conditionPrep);
   })

   prepared.push(userId)
   condition = condition.replace(/,\s*$/, "");
   submitAnswers = submitAnswers + condition + ') AND userid =?';
   callback(prepared, submitAnswers)
}

function createOtp(req,result) {

req.session.otp = token;
req.session.uid = result.id;
req.session.email = req.body.email;
setTimeout(function () {
    delete req.session.otp
    delete req.session.uid
    delete req.session.email
}, 600000)
}


module.exports={
    checkLoginCreds,
    returnUserData,
    checkUserSession,
    prepareSubmitAnswers,
    prepareEditAnswers,
    createOtp
}