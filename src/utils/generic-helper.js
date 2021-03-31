function checkParameters(array,req) {
 
    let found= array.some(element => element == undefined);
    return found 
}
function addToBody(object,req) {
    Object.assign(req.body,req.query)
     Object.assign(req.body,object)
}

function sendEmail(transporter, to, subject, text, mailOptions,callback) {
mailOptions.to = to;
mailOptions.subject = subject;
mailOptions.text = text;
let info = transporter.sendMail(mailOptions)
callback();
}

function createDate() {
    var today = new Date();
    var strDate = 'Y-m-d'
        .replace('Y', today.getFullYear())
        .replace('m', today.getMonth() + 1)
        .replace('d', today.getDate());
        return strDate
}



module.exports={
    checkParameters,
    addToBody,
    sendEmail,
    createDate
}