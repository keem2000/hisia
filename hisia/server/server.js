const express = require('express');
const { google } = require('googleapis');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/login', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
    res.sendFile(__dirname + '/public/login.html');
});

app.get('/styles.css', (req, res) => {

    res.sendFile(__dirname + '/public/styles.css');
});

app.get('/main.js', (req, res) => {

    res.sendFile(__dirname + '/public/main.js');
});
app.post("/analyze", async (req, res) => {
    const content = req.body.content;

    DISCOVERY_URL =
        'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';


    await google.discoverAPI(DISCOVERY_URL)
        .then(async (client) => {
            const analyzeRequest = {
                comment: {
                    text: content,
                },
                requestedAttributes: {
                    TOXICITY: {},
                },
            };

            await client.comments.analyze(
                {
                    key: process.env.API_KEY,
                    resource: analyzeRequest,
                },
                (err, response) => {
                    if (err) throw err;

                    const data = response.data.attributeScores.TOXICITY.summaryScore.value;
                    res.json({
                        score: data
                    });
                    return;
                });
        })
        .catch(err => {
            throw err;
        });



});

module.exports = app;