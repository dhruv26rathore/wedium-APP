const express = require('express');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require("cors") // import cors
const dotenv = require('dotenv');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config({ path: '.env.local' });
console.log('porttttt ================> ', process.env.PORT)
const PORT = process.env.PORT || 8080

const connectDB = require('./src/dao/database');

//mongodb connection 
connectDB();
const app = express();

// Swagger SetUp
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "wedium App",
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:3030'
            }
        ]
    },
    apis: ['./src/routes/*.js']
}
const swaggerSpec = swaggerJSDoc(options)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => res.json({message : 'Hellooooo'}))
// app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({
    limit: '10gb',
    extended: true,
    parameterLimit: 50000,
}));

app.use(cookieParser());
app.use(cors()) // add cors headers

app.use((req, res, next) => {
    req.path.startsWith('/api/v2/services/')
    next();
});

app.use(morgan('tiny'));
app.use(express.json({  extended: true }));
app.use(express.urlencoded({  extended: true }));

app.get('/', (req, res) => {
    res.render('index')
});

require('./src/routes/apis')(app);

app.get('*', (req, res) => res.status(404).json({ error: 'API not found.' }));

app.listen(PORT, () => { console.log(`Server is running on http://localhost:${PORT}`) });   // PORT listening to..
