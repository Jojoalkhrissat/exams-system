const {conn}=require('./connect.js')
const UserModel = conn.import('./user-model')
const ExamModel = conn.import('./exam-model')
const QuestionModel = conn.import('./question-model')
const AttemptModel = conn.import('./attempt-model')
const AnswerModel = conn.import('./answer-model')

const models={
    Users: UserModel,
    Exams:ExamModel,
    Questions:QuestionModel,
    Attempts:AttemptModel,
    Answers:AnswerModel
}

Object.keys(models).forEach(key => {
if('associate' in models[key]){
    models[key].associate(models);
}    
});

module.exports=models