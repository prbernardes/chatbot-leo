// server.js
// where your node app starts

// init project
var express = require('express');
const bodyParser = require('body-parser');
const url = require('url');
const requestPromise = require('request-promise');
const chatfuelBroadcast = require('chatfuel-broadcast').default;

var app = express();

// Setup template engine - add pug
app.set('view engine', 'pug');

// Tell Express where our templates are
app.set('views', './views');


// Parse data from application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

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

//End point para exibir a Política de privacidade específica para estudo
app.get('/show-webview2', (request, response) => {
  response.sendFile(__dirname + '/views/poliprivacespecifico.html');
});

//End point para exibir o formulário de condições cardíacas
app.get('/cardio-form', (request, response) => {
  const {blockName, userId} = request.query;
  //response.sendFile(__dirname + '/views/CardioForm.html');
  response.render('CardioForm',{blockName, userId});
});

//End point para exibir o formulário de medicação AR
app.get('/armed-form', (request, response) => {
  const {blockName, userId} = request.query;
  //response.sendFile(__dirname + '/views/CardioForm.html');
  response.render('ArMedForm',{blockName, userId});
});

//Chamadas as páginas de estudos

//End point para exibir a Página do estudo de insônia
app.get('/show-Morfeu', (request, response) => {
  response.sendFile(__dirname + '/views/morfeu.html');
});

//End point para exibir a Página do estudo de diabetes
app.get('/show-Diabetes', (request, response) => {
  response.sendFile(__dirname + '/views/diabetes.html');
});

//End point para exibir a Página do estudo de artrite reumatoide
app.get('/show-ArtriteReumatoide', (request, response) => {
  response.sendFile(__dirname + '/views/ArtriteReumatoide.html');
});

// end point que será chamado pelo bot para retornar os botões

const CriarBotaoForm = ({texto},displayUrl) => {
  return {
  "messages": [
    {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": "Por favor, para responder clique no botão RESPONDER que está logo abaixo",
          "buttons": [
                {
                  "type": "web_url",
                  "url": displayUrl,
                  "title": texto,
                  "messenger_extensions": true,
                  "webview_height_ratio": 'tall'
                }
              ]
            }
        }
      }
  ]
};
};

// end point para criar botões
app.get('/link-form', (request, response) => {
  const {blockName, userId, texto, form} = request.query;
  const displayUrl = `https://tranquil-television.glitch.me/${form}?userId=${userId}&blockName=${blockName}`;
  response.json(CriarBotaoForm({texto},displayUrl)); 
});


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
// end point para criar botões para exibição da plítica de privacidade
app.get('/show-buttons', (request, response) => {
  const {block_name} = request.query;
  const displayUrl = 'https://tranquil-television.glitch.me/show-webview';
  response.json(createButtons({block_name})); 
});


// endpoint para enviar o usuário de volta para um bloco específico


app.get('/retoma-cadastro', (request, response) => {
  const {block_name} = request.query;
  response.json(RedirecionaBloco({block_name})); 
});

// Constante para enviar o usuário para um bloco definido por variável de entrada

  const RedirecionaBloco = ({block_name}) => {
  return {
  "redirect_to_blocks": [block_name]
};
};

//Retomar questionário
app.get('/inscricao', (request, response) => {
  const {estudo} = request.query;
  const block_name = `Inscricao-${estudo}`
  response.json(RedirecionaBloco({block_name})); 
});

/*fora de uso
app.get('/inscricao', (request, response) => {
  const {estudo} = request.query;
  const block_name = `Inscricao-${estudo}`
  response.json(RedirecionaBloco({block_name})); 
});*/

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

//Conversa entre usuários

app.get('/live-chat', (request, response) => {
  const {UserId, UserInput, OtherUser, NomeOutroUsuario} = request.query; 
  
  const botId = process.env.CHATFUEL_BOT_ID;
  const chatfuelToken = process.env.CHATFUEL_TOKEN;
  
  const blockName = 'MensagemOutroUsuario';
  
  const broadcastApiUrl = `https://api.chatfuel.com/bots/${botId}/users/${UserId}/send`;
  
  const query = Object.assign({
      chatfuel_token: chatfuelToken,
      chatfuel_block_name: blockName,
      UserInput,
      OtherUser,
      NomeOutroUsuario,
      ChatOutroUsuario: 'Ligado',
    },
    request.body
  );
  
  const chatfuelApiUrl = url.format({
    pathname: broadcastApiUrl,
    query
  });
  
  const options = {
    uri: chatfuelApiUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  requestPromise.post(options)
    .then(() => {
      response.json({});
    });
  
});

//retorna dados formulário
app.post('/broadcast-to-chatfuel', (request, response) => {
  console.log(request.body);
  const botId = process.env.CHATFUEL_BOT_ID;
  const chatfuelToken = process.env.CHATFUEL_TOKEN;
  const {userId, blockName} = request.body
 
  
  console.log(request.body);
  
  const broadcastApiUrl = `https://api.chatfuel.com/bots/${botId}/users/${userId}/send`;
  
  const query = Object.assign({
      chatfuel_token: chatfuelToken,
      chatfuel_block_name: blockName
    },
    request.body
  );
  
  const chatfuelApiUrl = url.format({
    pathname: broadcastApiUrl,
    query
  });
  
  console.log(chatfuelApiUrl);
  
  const options = {
    uri: chatfuelApiUrl,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  requestPromise.post(options)
    .then(() => {
      response.json({
      Mensagem: options
      });
    });
  
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
