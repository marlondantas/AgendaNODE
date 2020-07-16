// Importa a função principal do express
const express = require('express');
var app = express();

// Importa a biblioteca de sessions
var session = require('express-session')

//Importa as bibliotecas de construção
const path = require('path');

//Importar biblioteca de tempo. 
var moment = require('moment-timezone');

// require
var bodyParser = require("body-parser");
const { on } = require('process');

const classes = require('./js/classes.js');

// Biblioteca para reload altomatico do servidor
var reload = require('reload');

// Fim das importações

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));

app.set('view engine', 'ejs');
app.set('views', './web');

// Redirecionamento SEM dados <
app.get("/", (req, res) => {
    // Menu principal do site
    res.sendFile(__dirname + '/web/index.html');
})
app.get("/blocoNotas", (req, res) => {

 
    if(!req.session.PIN){
        return res.redirect("/");
    }

    bloco_de_notas = {}

    // Ler dados sobre bloco de notas:
    db.readBloco_de_notas(req.session.PIN, (result)=>{
        bloco_de_notas = result;
    });
    // FIM

    setTimeout(() => {
        // console.log(bloco_de_notas);
        res.render(__dirname + '/web/main-scr/notas.ejs',{notas: bloco_de_notas});

    }, 100);
    // res.sendFile(__dirname+"/web/main-scr/notas.html")

})
app.get("/newbloco_de_notas",(req, res) =>{

    if(!req.session.PIN){
        return res.redirect("/");
    }

    res.sendFile(__dirname+"/web/cadastros/adicionar-notas.html");

});

function formatarValor(entrada) {
    var dia=  parseInt(moment(entrada).format('DD'))+1;
    var mes=  moment(entrada).format('MM');
    var ano=  moment(entrada).format('YYYY');
    return dia.toString()+"/"+mes.toString()+"/"+ano.toString();
}

function formatarData(entrada){
    return moment(entrada).format("YYYY-MM-DD");
}

app.locals.formatarValor = formatarValor;
app.locals.formatarData = formatarData;

app.get("/compromisso", (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    // var notas = undefined; 

    compromissos = {}

    // Ler dados sobre bloco de notas:
    db.readcompromissos(req.session.PIN, (result)=>{
        compromissos = result;
    });
    // FIM

    setTimeout(() => {
        // console.log(notas);
        res.render(__dirname + '/web/main-scr/eventos.ejs',{eventos: compromissos, formatarValor: formatarValor});

    }, 100);
})
app.get("/newcompromisso", (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    res.sendFile(__dirname+"/web/cadastros/adicionar-eventos.html");

})
app.get("/contato", (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    contatos = {}

    // Ler dados sobre bloco de notas:
    db.readcontatos(req.session.PIN, (result)=>{
        contatos = result;
    });
    // FIM

    setTimeout(() => {
        // console.log(compromissos);
        res.render(__dirname + '/web/main-scr/contatos.ejs',{contatos: contatos});
    }, 100);

})
app.get("/newcontato", (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    res.sendFile(__dirname+"/web/cadastros/adicionar-contatos.html");

})
app.get('/sobre', (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    res.sendFile(__dirname+'/web/main-scr/sobre.html');
});
app.get("/usuario", (req, res) => {
    // Menu principal do site
    res.sendFile(__dirname + '/web/cadastros/criar-pin.html');

})
// >

// importar banco de dados
global.db = require('./js/dbcon.js');

app.get('/main', (req, res,next) => {
    
    if(!req.session.PIN){
        return res.redirect("/");
    }

    informations = {}

    // Ler dados sobre bloco de notas:
    // db.readBloco_de_notas(req.session.PIN, (result)=>{
    //     informations['bloco_de_notas'] = result;
    // });
    // FIM

    // Ler dados sobre compromisso:
    // db.readcompromissos(req.session.PIN, (result)=>{
    //     informations['compromisso'] = result;
    // });
    // FIM

    // Ler dados sobre contatos:
    // db.readcontatos(req.session.PIN, (result)=>{
    //     informations['contatos'] = result;
    // });
    // FIM

    setTimeout(() => {
        // console.log(informations);
        res.render(__dirname + '/web/main.ejs',{infos: informations});
    }, 100);
});

// Importar classes:
global.classes = require('./js/classes.js');

//POST (consultar)
app.post('/conusuario',function(req, res, next) {
    
    var item = {
        PIN: req.body.pin,
    };

    // console.log(item);

    db.findPIN(item['PIN'],(e, docs) => {
        if(e) { return console.log(e); }
        
        if (docs != ""){
            // Definindo usuário da session:
            req.session.PIN = docs[0].PIN;

            res.redirect('/main?');
        }else{
            res.redirect('/?ERRO_no_PIN');
        }

    })

});

// POTS (NEW)
app.post('/newusuario', (req, res, next) => {
    var item = {
        PIN: req.body.pin, 
    }
    
    // console.log("PIN" + req.body.pin)

    // Verificar se já existe...

    var data = new classes.usuario(item);

    db.insertusuario(data,(err, result) => {
        if(err) { return console.log(err); }
        
        // console.log("PIN inserido: " + item['PIN']);
        req.session.PIN = item['PIN'];

        res.redirect('/main?NovoUser');
    });
});
app.post('/newbloco_de_notas', function(req, res, next) {  

    var destaqueoo = undefined;

    if(Boolean(req.body.destaque)){
        destaqueoo = true;
    }

    //Pegar o pin do user e registrar no item

    var item = {
      userPIN:  req.session.PIN,
      titulo:   req.body.titulo,
      tag:      req.body.tag,
      conteudo: req.body.conteudo,
      destaque: destaqueoo,
    };  

    // console.log("Foi feito uma add no usuário: " + req.session.PIN)

    var data = new classes.bloco_de_notas(item);
    
    db.insertbloco_de_notas(data, (err, result) => {
        if(err) { return console.log(err); }
        res.redirect('/newbloco_de_notas');
    })

}); 
app.post('/newcompromissos', (req, res,next) => {
     
    var destaqueoo = undefined;

    if(Boolean(req.body.destaque)){
        destaqueoo = true;
    }

    // time_i = moment.tz(req.body.data_hora_init,'America/Sao_Paulo');
    // time_f = moment.tz(req.body.data_end,'America/Sao_Paulo');

    var item = { 
        userPIN: req.session.PIN,
        nome: req.body.nome,  
        endereco: req.body.endereco,
        data_hora_init: req.body.data_hora_init,
        data_end:       req.body.data_end,
        observacao: req.body.observacao,
        categoria: req.body.categoria,
        destaque: destaqueoo,
        Convidados: req.body.Convidados
    };  

    var data = new classes.compromissos(item);

    db.insertcompromissos(data,(err, result) =>{
        if (err) {return console.log("ERRO: " + err)}
        res.redirect("/compromisso?compromissos=sucess")
    })

});
app.post('/newcontato', (req, res,next) => {
     
    var destaqueoo = undefined;

    if(Boolean(req.body.destaque)){
        destaqueoo = true;
    }

    var item = { 
        userPIN:        req.session.PIN,
        nome:           req.body.nome,
        sobrenome:      req.body.sobrenome,
        empresa:        req.body.empresa,
        celular:        req.body.celular,
        telefone:       req.body.telefone,
        email:          req.body.email,
        endereco:       req.body.endereco,
        observacao:     req.body.observacao,
        categoria:      req.body.categoria,
        destaque: destaqueoo
    };  

    var data = new classes.contatos(item);

    db.insertcontatos(data,(err, result) =>{
        if (err) {return console.log("ERRO: " + err)}
        res.redirect("/contato?contatos=sucess")
    })

});

// POST (Remover)
app.get('/removebloco_de_notas/:id', (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    var UUID = req.params.id;

    db.deletBloco_de_notas(UUID,(err,result) =>{
        if (err) {console.log("Esse erro:"+err)}
        // console.log("Esse é o "+result)
        res.redirect('/blocoNotas?delet=success');
    })

});
app.get('/removecompromissos/:id', (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    var UUID = req.params.id;

    db.deletcompromissos(UUID,(err,result) =>{
        if (err) {console.log("Esse erro:"+err)}
        // console.log(result);

        res.redirect('/compromisso?delet=success');
    })
    
});
app.get('/removecontatos/:id', (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    var UUID = req.params.id;

    db.deletcontatos(UUID,(err,result) =>{
        if (err) {console.log("Esse erro:"+err);}
        res.redirect('/contato?delet=success');
    })
    
});

// POST (Editar)
app.post('/editbloco_de_notas/:id', (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    var UUID = req.params.id;

    var destaqueoo = undefined;
    if(Boolean(req.body.destaque)){
        destaqueoo = true;
    }

    var item = {
        titulo:   req.body.titulo,
        tag:      req.body.tag,
        conteudo: req.body.conteudo,
        destaque: destaqueoo,
    }; 

    db.updateBloco_de_notas(UUID,item,(err,result) =>{
        if (err) {console.log("Esse erro:"+err)}

        // console.log("Esse é o "+result);
        res.redirect('/blocoNotas?edit=success');

    })

});
app.post('/editcompromissos/:id', (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    var UUID = req.params.id;

    var destaqueoo = undefined;
    if(Boolean(req.body.destaque)){
        destaqueoo = true;
    }

    var item = { 
        userPIN: req.session.PIN,
        nome: req.body.nome,  
        endereco: req.body.endereco,
        data_hora_init: req.body.data_hora_init,
        data_end: req.body.data_end,
        observacao: req.body.observacao,
        categoria: req.body.categoria,
        destaque: destaqueoo,
        Convidados: req.body.Convidados
    };  

    db.updatecompromissos(UUID,item,(err,result) =>{
        if (err) {console.log("Esse erro:"+err)}

        // console.log("Esse é o "+result);
        res.redirect('/compromisso?edit=success');

    })

});
app.post('/editcontatos/:id', (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    var UUID = req.params.id;

    var destaqueoo = undefined;
    if(Boolean(req.body.destaque)){
        destaqueoo = true;
    }


    var item = { 
        userPIN:        req.session.PIN,
        nome:           req.body.nome,
        sobrenome:      req.body.sobrenome,
        empresa:        req.body.empresa,
        celular:        req.body.celular,
        telefone:       req.body.telefone,
        email:          req.body.email,
        endereco:       req.body.endereco,
        observacao:     req.body.observacao,
        categoria:      req.body.categoria,
        destaque: destaqueoo
    }; 

    db.updatecontatos(UUID,item,(err,result) =>{
        if (err) {console.log("Esse erro:"+err)}

        // console.log("Esse é o "+result);
        res.redirect('/main?edit=success');

    })

});

// Editar GET
app.get('/editbloco_de_notas/:id', (req, res, next) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    var ID = req.params.id;

    global.db.findbloco_de_notas(ID,(e,docs)=>{
        if (e) {return console.log(e);}
        // console.log("Tentando localizar esse ID:"+ID+"\nEsse foi o resultado:"+docs[0])
        if( docs != []){
        res.render(__dirname + '/web/cadastros/blocoNotas.ejs',{form: docs[0], action:"/editbloco_de_notas/"+ docs[0]._id})
        } else{
            res.redirect("/blocoNotas?erroPIN=ERROR")
        }
    });

});
app.get('/editcompromissos/:id', (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    var ID = req.params.id;

    global.db.findcompromissos(ID,(e,docs)=>{
        if (e) {return console.log(e);}
        // console.log("Tentando localizar esse compromissors ID:"+ID+"\nEsse foi o resultado:"+docs[0])
        if(docs != []){
            res.render(__dirname + '/web/cadastros/compromisso.ejs',{title:"Compromisso - Editar", form: docs[0], action:"/editcompromissos/"+ docs[0]._id})
        }else{
            res.redirect('/compromisso?ErroPIN=ERRO');
        }
    });
});
app.get('/editcontatos/:id', (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }
    
    var ID = req.params.id;

    global.db.findcontatos(ID,(e,docs)=>{
        if (e) {return console.log(e);}
        // console.log("Tentando localizar esse contato ID:"+ID+"\nEsse foi o resultado:"+docs[0])
        if(docs != []){
            res.render(__dirname + '/web/cadastros/contato.ejs',{form: docs[0], action:"/editcontatos/"+ docs[0]._id})
        } else{
            res.redirect('/contato');
        }
    });    
});

// Fazer o logoff
app.use('/sair_loggof', (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
});

app.get("/compromisso", (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    // var notas = undefined; 

    compromissos = {}

    // Ler dados sobre bloco de notas:
    db.readcompromissos(req.session.PIN, (result)=>{
        compromissos = result;
    });
    // FIM

    setTimeout(() => {
        // console.log(notas);
        res.render(__dirname + '/web/main-scr/eventos.ejs',{eventos: compromissos, formatarValor: formatarValor});

    }, 100);
})

// Relatorios
app.get('/relatorio', (req, res) => {

    if(!req.session.PIN){
        return res.redirect("/");
    }

    // var notas = undefined; 

    compromissos = {}

    // Ler dados sobre bloco de notas:
    db.readcompromissos(req.session.PIN, (result)=>{
        compromissos = result;
    });
    // FIM

    setTimeout(() => {
        // console.log(notas);
        res.render(__dirname + '/web/main-scr/relatorio1.ejs',{eventos: compromissos, formatarValor: formatarValor});

    }, 100);
});
app.get('/relatorio2', (req, res) => {
    if(!req.session.PIN){
        return res.redirect("/");
    }

    contatos = {}

    // Ler dados sobre bloco de notas:
    db.readcontatos(req.session.PIN, (result)=>{
        contatos = result;
    });
    // FIM

    setTimeout(() => {
        // console.log(compromissos);
        res.render(__dirname + '/web/main-scr/relatorio2.ejs',{contatos: contatos});
    }, 100);
});

app.get('/relatorio3', (req, res) => {
 
    if(!req.session.PIN){
        return res.redirect("/");
    }

    bloco_de_notas = {}

    // Ler dados sobre bloco de notas:
    db.readBloco_de_notas(req.session.PIN, (result)=>{
        bloco_de_notas = result;
    });
    // FIM

    setTimeout(() => {
        // console.log(bloco_de_notas);
        res.render(__dirname + '/web/main-scr/relatorio3.ejs',{notas: bloco_de_notas});

    }, 100);
    // res.sendFile(__dirname+"/web/main-scr/notas.html")
});

app.get("/relatoriodeerros", (req, res) => {
    // Menu principal do site
    res.sendFile(__dirname + '/web/main-scr/TESTE.html');
})

// Porta de conexão.
const port = 3000;

// Open the gate:
app.listen(port, () => {
    console.log("The magic port is " + port + "");
    console.log("http://localhost:3000/");
});


 