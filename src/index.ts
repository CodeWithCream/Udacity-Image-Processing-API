import express from 'express';
import routes from './routes';

const app = express();
const port=3001;

app.use('/api', routes);

app.listen(port, ()=> {
    console.log(`server started at http://localhost:${port}`);
});