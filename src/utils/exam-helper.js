function groupExam(results) {
    grouped = results.reduce(function (r, a) {
        r[a.examTitle + ', ' + a.examid] = r[a.examTitle + ', ' + a.examid] || [];
        r[a.examTitle + ', ' + a.examid].push(a);
        return r;
    }, Object.create(null));
    return grouped;
}

function prepareQuestions(questions, id, callback) {
    questions=!questions ? questions = {} : questions
     questionInsert = 'INSERT INTO questions (examid,description,question) VALUES ';
     prepared = [];
     i = 0;
    Object.entries(questions).forEach((obj) => {
        questionInsert = questionInsert + '(?,?,?),';
        prepared[i] = id;
        i++;
        prepared[i] = obj[1].description;
        i++;
        prepared[i] = obj[1].question;
        i++;
    });
    //this loop is to make the query and prepare statement
    questionInsert = questionInsert.replace(/,\s*$/, "");
    callback(questionInsert, prepared)
}



module.exports = {
    groupExam,
    prepareQuestions
}