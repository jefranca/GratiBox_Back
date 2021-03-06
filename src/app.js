import cors from 'cors';
import express from 'express';
import signUp from './controllers/signUp.js';
import signIn from './controllers/signIn.js';
import postPlan from './controllers/postPlan.js';
import getPlan from './controllers/getPlan.js';

const app = express();
app.use(express.json());
app.use(cors());

app.post('/sign-up', signUp);
app.post('/sign-in', signIn);
app.post('/plan', postPlan);
app.get('/plan', getPlan);

export default app;
