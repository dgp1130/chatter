import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as rooms from './api/rooms';
import { simpleResponder } from './utils/simple_responder';

const app = express();

// Parse request body as JSON.
app.use(bodyParser.json());

// Bind Rooms API route handlers.
app.post('/api/rooms/create', simpleResponder(rooms.create));
app.get('/api/rooms/list', simpleResponder(rooms.list));

// Begin listening for requests.
const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
