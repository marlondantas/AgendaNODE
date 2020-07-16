function changeNotas(titulo,destaque,conteudo,tags,id) { 
    

    document.getElementById("titulo").innerHTML=titulo;

    if(destaque == 'true'){
        document.getElementById("destaque").style.display = "block";
    }else
    {
        document.getElementById("destaque").style.display = "none";
    }

    document.getElementById("conteudo").innerHTML=conteudo;

    document.getElementById("tags").innerHTML=tags;

    document.getElementById("btnExcluir").href= "/removebloco_de_notas/"+id;

    document.getElementById("btnEditar").href= "/editbloco_de_notas/"+id;

}

function changeContato(nome,sobrenome,empresa,celular,telefone,email,endereco,obersevacao,categoria,destaque,id) { 

    document.getElementById("nome").innerHTML=nome;

    document.getElementById("sobrenome").innerHTML=sobrenome;

    document.getElementById("empresa").innerHTML=empresa;

    document.getElementById("celular").innerHTML=celular;

    document.getElementById("telefone").innerHTML=telefone;

    document.getElementById("email").innerHTML=email;

    document.getElementById("endereco").innerHTML=endereco;

    // document.getElementById("obersevacao").innerHTML=obersevacao;

    document.getElementById("categoria").innerHTML=categoria;

    if(destaque == 'true'){
        document.getElementById("destaque").style.display = "block";
    }else
    {
        document.getElementById("destaque").style.display = "none";
    }

    document.getElementById("btnExcluir").href= "/removecontatos/"+id;

    document.getElementById("btnEditar").href= "/editcontatos/"+id;
}

function changeEvento(nome,endereco,data_hora_inicio,data_hora_final,observacao,categoria,destaque,convidado,id) { 

    

    document.getElementById("nome").innerHTML=nome;

    document.getElementById("endereco").innerHTML=endereco;

    document.getElementById("data_hora_inicio").innerHTML=data_hora_inicio;

    document.getElementById("data_hora_final").innerHTML=data_hora_final;

    // document.getElementById("observacao").innerHTML=observacao;

    document.getElementById("categoria").innerHTML=categoria;

    if(destaque == 'true'){
        document.getElementById("destaque").style.display = "block";
    }else
    {
        document.getElementById("destaque").style.display = "none";
    }

    document.getElementById("convidado").innerHTML=convidado;

    document.getElementById("btnExcluir").href= "/removecompromissos/"+id;

    document.getElementById("btnEditar").href= "/editcompromissos/"+id;
}