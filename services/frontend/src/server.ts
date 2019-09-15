import * as express from 'express';

const app = express();

app.use(express.static('/chatter/client/build/'));
app.use('/assets/', express.static('/chatter/client/assets/'));

const port = process.env.PORT || 80;
app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
