const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = {

    swaggerDefinition: {
        info: {
            version: "3.0.1",
            title: "item API",
            description: "item API Information",
            contact: {
                name: "Amazing Developer"
            },
            servers: ["SERVER URL"]
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: "bearer"
                }
            },
        },

        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                scheme: 'bearer',
                in: 'header',
            }
        }
    },

    // ['.routes/*.js']
    apis: ["index.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
const swaggerLive=swaggerUi.setup(swaggerDocs)



module.exports={
    swaggerDocs,
    swaggerLive,
    swaggerUi
}