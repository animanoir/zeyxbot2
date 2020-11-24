const express = require('express'),
  bodyParser = require('body-parser'),
  fileUpload = require('express-fileupload'),
  app = express(),
  Twit = require('twit'),
  config = {
    /* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */
    twitter: {
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    }
  },
  T = new Twit(config.twitter);

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// app.use( fileUpload( {
//   limits: { fileSize: 50 * 1024 * 1024 }
// } ) );

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

const respuestas1 = ['Anoche', 'Ayer', 'Quizás', 'Cuando']
const respuestas2 = ['bailamos', 'sentimos', 'soñamos', 'dibujamos']
const respuestas3 = ['con el universo', 'con otras inteligencias', 'con el vecino', 'con la IA']

app.post('/', function (request, response) {
  console.log(request.body);
  if (request && request.body) {
    const respuesta = request.body.name;

    let tweetText = `${ respuesta } + '_' + ${respuestas1[Math.floor(Math.random() * respuestas1.length)]} + '_' + ${respuestas2[Math.floor(Math.random() * respuestas2.length)]} + '_' + ${respuestas3[Math.floor(Math.random() * respuestas3.length)]}`;

    if (request.body.emoji) {
      tweetText += ' 👋';
    } else {
      tweetText += '!';
    }

    if (respuesta) {
      T.post('statuses/update', {
        status: tweetText
      }, function (err, data, resp) {
        if (err) {
          console.log('error!', err);
          response.json({
            'status': 'error',
            'error': err
          });
        } else {
          const tweetUrl = `https://twitter.com/${ data.user.screen_name }/status/${ data.id_str }`;
          console.log('tweeted', tweetUrl);
          response.json({
            'status': 'tweet posted',
            'url': tweetUrl
          });
        }
      });
    }
  } else {
    response.status(400).end();
  }
});

const listener = app.listen(process.env.PORT, function () {
  console.log(`Your app is listening on port ${ listener.address().port }...`);
});