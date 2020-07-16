//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var Userusuario = new Schema ({
    PIN: String,
});

var usuario = mongoose.model('Userusuario', Userusuario);  

var Userbloco_de_notas = new Schema ({
    userPIN: String,
    compromissosPIN: String,
    titulo: String,
    tag: String,
    conteudo: String,
    destaque: Boolean,
});

var bloco_de_notas = mongoose.model('Userbloco_de_notas', Userbloco_de_notas);  

var Usercompromissos = new Schema ({
    userPIN: String,
    nome: String,
    endereco: String,
    data_hora_init: Date,
    data_end: Date,
    observacao: String,
    categoria: String,
    destaque: Boolean,
    Convidados: String
});

var compromissos = mongoose.model('Usercompromissos', Usercompromissos);  

var Usercontatos = new Schema ({
    userPIN: String,
    nome: String,
    sobrenome: String,
    empresa: String,
    celular: String,
    telefone: String,
    email: String,
    endereco: String,
    observacao: String,
    categoria: String,
    destaque: Boolean
});

var contatos = mongoose.model('Usercontatos', Usercontatos);  

module.exports = {bloco_de_notas, compromissos, usuario, contatos}