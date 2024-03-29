require('dotenv').config();

const express = require('express');
const app = express();
const port = 8080;

const userRoutes = require('./routes/userRoute');
const chipherRoutes = require('./routes/chipherRoute');
const productRoutes = require('./routes/productRoute');

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);
app.use('/api/chipher', chipherRoutes);

app.listen(port, ()=> {
    console.log(`app listening at http://localhost:${port}`);
})