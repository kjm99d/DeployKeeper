require('dotenv').config();

const express = require('express');
const app = express();
const port = 8080;

const userRoutes = require('./routes/userRoute');
const chipherRoutes = require('./routes/chipherRoute');

app.use(express.json());


app.use('/api/user', userRoutes);
app.use('/api/chipher', chipherRoutes);

app.get('/', (req, res) => {
    res.send("Hello, World!");
});



app.listen(port, ()=> {
    console.log(`Example app listening at http://localhost:${port}`);
})