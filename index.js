const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')

connectToMongo();


const app = express();
const port = 5000;

app.use(cors())
app.use(express.json());
//to access req.body() we have to use some middleware it is that only

// app.get('/', (req, res) => {
//     res.send('Sarthak')
// })
//instead of using this we can create rotes to different end points and access them using (.use)

app.use('/api/auth' , require('./routes/auth.js'));
app.use('/api/notes' , require('./routes/notes.js'));



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})