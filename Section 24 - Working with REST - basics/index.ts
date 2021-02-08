import express from 'express';
import { env } from 'process';

const PORT = env.PORT;
const app = express();

app.listen(PORT || 8080);
