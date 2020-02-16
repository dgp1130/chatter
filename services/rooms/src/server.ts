import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as rooms from './api/rooms';
import { simpleResponder } from './utils/simple_responder';

const app = express();

// Parse request body as JSON.
app.use(bodyParser.json());

// Allow cross-origin requests to support local development.
app.options('*', cors());

// Bind Rooms API route handlers.
app.post('/api/rooms/create', cors(), simpleResponder(rooms.create));
app.get('/api/rooms/list', cors(), simpleResponder(rooms.list));

// Test endpoint to verify automated deployment.
app.get('/api/deployed', (req, res) => {
    res.end('Deployed!');
});

// Begin listening for requests.
const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
