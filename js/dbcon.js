//Importa a classe de conexão do mongo;
var mongoClient = require("mongodb").MongoClient;

//Faz a busca de um registro no banco de dados;
var ObjectId = require("mongodb").ObjectId;

//Conecta com o bando de dados mongo;
mongoClient.connect("mongodb://localhost/fatecAgenda",
    {
    useUnifiedTopology: true,
    useNewUrlParser: true,  
    })

    .then(conn => global.conn = conn.db("fatecAgenda"))
    .then(function aviso(){
        console.log('Conectado com sucesso')
    })
    .catch(err => console.log(err))

function findPIN(pin, callback) {
    global.conn.collection("fatecAgenda").find( { 'PIN': pin} ).toArray(callback);
}

//Insere um novo registro dentro do banco de dados;
function insertusuario(usuario, callback){
    global.conn.collection("fatecAgenda").insertOne(usuario, callback);
}

//Insere um novo registro dentro do banco de dados;
function insertcompromissos(compromissos, callback){
    global.conn.collection("compromissos").insertOne(compromissos, callback);
}
function insertbloco_de_notas(bloco_de_notas, callback){
    global.conn.collection("bloco_de_notas").insertOne(bloco_de_notas, callback);
}
function insertcontatos(contatos, callback){
    global.conn.collection("contatos").insertOne(contatos, callback);
}

// Modulos de consulta (POR PIN)
function readBloco_de_notas(PIN,callback) {
    // console.log("Found the following records");
    
    global.conn.collection("bloco_de_notas").find({'userPIN':PIN}).toArray(function(err, docs) {
        if(err) { return console.log(err); }
        callback(docs);
      });

    // console.log("Foi realizado uma pesquisa em todos os registros de bloco de notas relacionados ao PIN: "+ PIN);
}
function readcompromissos(PIN,callback) {
    global.conn.collection("compromissos").find({'userPIN':PIN}).toArray(function(err, docs) {
        if(err) { return console.log(err); }
        callback(docs);
      });

    // console.log("Foi realizado uma pesquisa em todos os registros de compromissos relacionados ao PIN: "+ PIN);
}
function readcontatos(PIN,callback) {
    global.conn.collection("contatos").find({'userPIN':PIN}).toArray(function(err, docs) {
        if(err) { return console.log(err); }
        callback(docs);
      });

    // console.log("Foi realizado uma pesquisa em todos os registros de contato relacionados ao PIN: "+ PIN);
}

// Remover registro por ID
function deletBloco_de_notas(id,callback) {
    global.conn.collection("bloco_de_notas").deleteOne({_id: new ObjectId(id)},callback);
}
function deletcompromissos(id,callback) {
    global.conn.collection("compromissos").deleteOne({_id: new ObjectId(id)},callback);
}
function deletcontatos(id,callback) {
    global.conn.collection("contatos").deleteOne({_id: new ObjectId(id)},callback);
}

//Edita um registro pot ID;
function updateBloco_de_notas(id, Bloco_de_notas, callback) {
    global.conn.collection("bloco_de_notas").updateOne({ _id: new ObjectId(id) }, { $set: Bloco_de_notas }, callback)
}
function updatecompromissos(id, compromissos, callback) {
    global.conn.collection("compromissos").updateOne({ _id: new ObjectId(id) }, { $set: compromissos }, callback)
}
function updatecontatos(id, contatos, callback) {
    global.conn.collection("contatos").updateOne({ _id: new ObjectId(id) }, { $set: contatos }, callback)
}

// Busca por ID
function findbloco_de_notas(id,callback){
    global.conn.collection("bloco_de_notas").find(new ObjectId(id)).toArray(callback);
}
function findcompromissos(id,callback){
    global.conn.collection("compromissos").find(new ObjectId(id)).toArray(callback);
}
function findcontatos(id,callback){
    global.conn.collection("contatos").find(new ObjectId(id)).toArray(callback);
}
module.exports = {findPIN, 
    insertusuario, insertbloco_de_notas, insertcompromissos, insertcontatos, 
    readBloco_de_notas, readcompromissos, readcontatos,
    deletBloco_de_notas, deletcompromissos, deletcontatos,
    updateBloco_de_notas, updatecompromissos, updatecontatos,
    findbloco_de_notas, findcompromissos, findcontatos}