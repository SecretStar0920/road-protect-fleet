const express = require('express');
const path = require('path');

const app = express();

app.get('/health', (req, res) => {
    return res.sendStatus(200);
});

app.use(express.static(path.join(__dirname, 'dist/frontend')));

app.use('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'dist/frontend/index.html'));
});

app.use('/*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'dist/frontend/index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
