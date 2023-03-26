const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger_output.json'; // 輸出的文件名稱
const endpointsFiles = ['./app.js']; // 要指向的 API，通常使用 Express 直接指向到 app.js 就可以
const doc = {
    info: {
      title: 'My API',
      description: 'Description',
    },
    host: 'localhost:3000',
    basePath: '/',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
  }

swaggerAutogen(outputFile, endpointsFiles,doc); // swaggerAutogen 的方法