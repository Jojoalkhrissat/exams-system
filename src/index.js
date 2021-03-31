const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const session = require('express-session');
const swagger = require('./config/swagger.js');
const port = process.env.PORT || 3000;
const exams = require('./api/exams/index.js');
const users = require('./api/user/index.js');
const host = 'localhost';
// Extended: https://swagger.io/specification/#infoObject
app.use('/', exams);
app.use('/', users);
app.use(session({secret: 'web token secret',
  resave: false,
  saveUninitialized: false,
  sameSite: true,
  unset: 'destroy'}));
app.use(fileUpload({
  createParentPath: true,
}));
app.use(express.json());


/**
 * @swagger
 * /register:
 *   post:
 *     name: Register
 *     summary: Create your user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             firstname:
 *               type: string
 *             lastname:
 *               type: string 
 *             phonenumber:
 *               type: string
 *         required:
 *           - email
 *           - firstname
 *           - lastname
 *     responses:
 *       200:
 *         description: registered successfully
 *       400:
 *         description: something missing
 */


/**
 * @swagger
 * /login:
 *   post:
 *     name: login
 *     summary: log in as user
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *         required:
 *           - password
 *           - email
 *     responses:
 *       200:
 *         description: login successfully
 *       400:
 *         description: something missing or username or password is wrong
 */


/**
 * @swagger
 * /exam:
 *   post:
 *     name: add exam
 *     summary: add new exam
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             questions:
 *               type: object
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             duration:
 *               type: number
 *         required:
 *           - question
 *           - email
 *     responses:
 *       200:
 *         description: exam added successfully
 *       400:
 *         description: something missing
 */

/**
 * @swagger
 * /questions:
 *   get:
 *     name: get questions
 *     summary: get all questions for a certain exam
 *     consumes:
 *       - application/json
 *     responses:
 *       200:
 *         description: questions returned successfully
 *     parameters:
 *       - name: examId
 *         in: query
 *         schema:
 *           type: string
 *         required:
 *           - examId
 */


/**
 * @swagger
 * /exams:
 *   get:
 *     name: get exams
 *     summary: get all exams
 *     consumes:
 *       - application/json
 *     responses:
 *       200:
 *         description: exams returned
 */


/**
 * @swagger
 * /userexam:
 *   get:
 *     name: get user exams
 *     summary: get all user exams
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: query
 *         schema:
 *           type: integer
 *         required:
 *           - userId
 *       - name: examId
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: exams returned
 */


/**
 * @swagger
 * /userallexams:
 *   get:
 *     name: get user exams
 *     summary: get all user exams
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: query
 *         schema:
 *           type: integer
 *         required:
 *           - userId
 *     responses:
 *       200:
 *         description: exams returned
 */


/**
 * @swagger
 * /addexamattempt:
 *   post:
 *     name: add attempt
 *     summary: add new attempt
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             examId:
 *               type: string
 *             userId:
 *               type: integer
 *         required:
 *           - userId
 *           - examId
 *     responses:
 *       200:
 *         description: exam added successfully
 *       400:
 *         description: something missing
 */


/**
 * @swagger
 * /questionphoto:
 *   put:
 *     name: add photo
 *     summary: add question photo
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: file
 *         in: formData
 *         type: file
 *       - name: id
 *         in: formData
 *         type: integer
 *     responses:
 *       200:
 *         description: photo uploaded successfully
 *       400:
 *         description: something's missing
 */


/**
 * @swagger
 * /userdetails:
 *   get:
 *     name: get user details
 *     summary: get all user details
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: query
 *         schema:
 *           type: integer
 *       - name: email
 *         in: query
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: exams returned
 */


/**
 * @swagger
 * /submitanswers:
 *   post:
 *     name: submit answers
 *     summary: submit exam answers
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             answers:
 *               type: object
 *             userId:
 *               type: integer
 *             examId:
 *               type: string
 *         required:
 *           - answers
 *           - userId
 *           - examId
 *     responses:
 *       200:
 *         description: answers submitted successfully
 *       400:
 *         description: something missing
 */


/**
 * @swagger
 * /updateanswers:
 *   post:
 *     name: update answers
 *     summary: submit new exam answers
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             answers:
 *               type: object
 *             userId:
 *               type: integer
 *             examId:
 *               type: string
 *         required:
 *           - answers
 *           - userId
 *           - examId
 *     responses:
 *       200:
 *         description: answers updated successfully
 *       400:
 *         description: something missing
 */


/**
 * @swagger
 * /startexam:
 *   post:
 *     name: submit answers
 *     summary: submit exam answers
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: integer
 *             examId:
 *               type: string
 *         required:
 *           - userId
 *           - examId
 *     responses:
 *       200:
 *         description: answers submitted successfully
 *       400:
 *         description: something missing
 */


/**
 * @swagger
 * /setscore:
 *   post:
 *     name: add attempt
 *     summary: add new attempt
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             score:
 *               type: integer
 *             userId:
 *               type: integer
 *             questionId:
 *               type: integer
 *         required:
 *           - userId
 *           - questionId
 *           - score
 *     responses:
 *       200:
 *         description: score set successfully
 *       400:
 *         description: something missing
 */


/**
 * @swagger
 * /logout:
 *   get:
 *     name: logout
 *     summary: logout of current user
 *     consumes:
 *       - application/json
 *     responses:
 *       200:
 *         description: logout successful
 */


/**
 * @swagger
 * /resetpassword:
 *   post:
 *     name: reset password
 *     summary: reset user password
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *         required:
 *           - email
 *     responses:
 *       200:
 *         description: email sent
 *       400:
 *         description: email not sent
 */


/**
 * @swagger
 * /verifytoken:
 *   post:
 *     name: verify token
 *     summary: verify reset password token
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *         required:
 *           - token
 *     responses:
 *       200:
 *         description: token verified
 *       400:
 *         description: token not verified
 */

/**
 * @swagger
 * /changepassword:
 *   post:
 *     name: verify token
 *     summary: verify reset password token
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *             password:
 *               type: string
 *             retype:
 *               type: string
 *         required:
 *           - password
 *           - retype
 *     responses:
 *       200:
 *         description: token verified
 *       400:
 *         description: token not verified
 */

app.listen(port, () => {
  console.log('server is up on port ' + port);
});

app.use('/api-docs', swagger.swaggerUi.serve, swagger.swaggerLive);
