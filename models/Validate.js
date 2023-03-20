function validate(value) {
    let erros = []
  
    if (!value.nome || typeof value.nome == undefined || value.nome == null) {
      erros.push({texto: "Nome inválido."})
    }
  
    if (!value.slug || typeof value.slug == undefined || value.slug == null) {
      erros.push({texto: "Slug inválido."})
    }
  
    if (value.nome.length < 2) {
      erros.push({texto: "O nome da categoria é muito pequeno."})
    }
  
    return erros
}

module.exports = {
    validate
}