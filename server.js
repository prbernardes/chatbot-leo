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

//End point para exibir a Página do estudo
app.get('/show-Morfeu', (request, response) => {
  response.sendFile(__dirname + '/views/morfeu.html');
});

// end point que será chamado pelo bot para retornar os botões

const createButtons = ({block_name}) => {
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
                  "messenger_extensions": true,
                  "webview_height_ratio": 'tall'
                },
                {
              "type": "show_block",
              "block_names": [block_name],
              "title": "Preencher"
                },
                {
              "type": "show_block",
              "block_names": ["Saída"],
              "title": "Cancelar"
                }
              ]
            }
        }
      }
  ]
};
};

app.get('/show-buttons', (request, response) => {
  const {block_name} = request.query;
  const displayUrl = 'https://tranquil-television.glitch.me/show-webview';
  response.json(createButtons({block_name})); 
});

// endpoint para enviar o usuário de volta para o bloco de entrada da enfermidade que estava preenchendo


app.get('/retorna-enfermidade', (request, response) => {
  const {block_name} = request.query;
  response.json(RedirecionaBloco({block_name})); 
});

// Constante para enviar o usuário para um bloco definido por variável de entrada

  const RedirecionaBloco = ({block_name}) => {
  return {
  "redirect_to_blocks": [block_name]
};
};

//fora de uso
app.get('/inscricao', (request, response) => {
  const {estudo} = request.query;
  const block_name = `Inscricao-${estudo}`
  response.json(RedirecionaBloco({block_name})); 
});

// end point chamado pelo bot para retornar o convite ao usuário para participar de estudo específico

const EncontreiEstudo = (displayUrl) => {
  return {
  "messages": [
    {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": "Você autoriza compartilhar seus dados com o centro de pesquisa?",
          "buttons": [
                {
                  "type": "web_url",
                  "url": displayUrl,
                  "title": "Informações estudo",
                  "messenger_extensions": true,
                  "webview_height_ratio": 'tall'
                },
                {
              "type": "show_block",
              "block_names": ["BuscarCentros"],
              "title": "Autorizo"
                },
                {
              "type": "show_block",
              "block_names": ["Recusa Consentimento"],
              "title": "Não,obrigado"
                }
              ]
            }
        }
      }
  ]
};
};

app.get('/encontrei-estudo', (request, response) => {
  const {estudo} = request.query;
  const displayUrl = `https://tranquil-television.glitch.me/show-${estudo}`;
  response.json(EncontreiEstudo(displayUrl)); 
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
