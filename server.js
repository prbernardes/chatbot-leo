// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/poliprivac.html');
});

//End point para exibir a Política de privacidade
app.get('/show-webview', (request, response) => {
  response.sendFile(__dirname + '/views/poliprivac.html');
});

// end point que será chamado pelo bot para retornar os botões

const createButtons = (displayUrl) => {
  return {
  "messages": [
    {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": " Se estiver de acordo, clique em PREENCHER. Se quiser saber mais informações sobre o uso dos seus dados clique em CONFIDENCIALIDADE.",
          "buttons": [
                {
                  "type": "web_url",
                  "url": "https://tranquil-television.glitch.me/show-webview",
                  "title": "Confidencialidade",
                  "messenger_extensions": true
                },
                {
              "type": "show_block",
              "block_names": ["Teste 2"],
              "title": "Show Block"
                }
              ]
            }
        }
      }
  ]
};
};

app.get('/show-buttons', (request, response) => {
  const displayUrl = 'https://tranquil-television.glitch.me/show-webview';
  response.json(createButtons(displayUrl)); 
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
