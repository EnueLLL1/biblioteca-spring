/**
 * Sistema de validação frontend alinhado aos DTOs e entidades JPA do backend.
 */

export const validarNotBlank = (valor, campo) => {
  if (!valor || valor.toString().trim() === '') {
    return `${campo} não pode estar em branco`
  }
  return null
}

export const validarNotNull = (valor, campo) => {
  if (valor === null || valor === undefined || valor === '') {
    return `${campo} não pode ser nulo`
  }
  return null
}

export const validarMaxLength = (valor, max, campo) => {
  if (valor && valor.toString().trim().length > max) {
    return `${campo} deve ter no máximo ${max} caracteres`
  }
  return null
}

export const validarMinMax = (valor, min, max, campo) => {
  if (valor === null || valor === undefined || String(valor).trim() === '') {
    return `${campo} deve ser um número válido`
  }
  const str = String(valor).trim()
  if (!/^-?\d+$/.test(str)) {
    return `${campo} deve ser um número válido`
  }
  const num = parseInt(str, 10)
  if (num < min) {
    return `${campo} deve ser no mínimo ${min}`
  }
  if (num > max) {
    return `${campo} deve ser no máximo ${max}`
  }
  return null
}

export const validarISBN13 = isbn => {
  if (!isbn) return 'ISBN não pode estar vazio'

  const isbnLimpo = isbn.toString().replace(/[\s-]/g, '')
  if (!/^\d{13}$/.test(isbnLimpo)) {
    return 'ISBN-13 deve ter exatamente 13 dígitos numéricos'
  }

  let soma = 0
  for (let i = 0; i < 12; i++) {
    const digito = parseInt(isbnLimpo[i], 10)
    const peso = i % 2 === 0 ? 1 : 3
    soma += digito * peso
  }

  const digitoVerificacao = (10 - (soma % 10)) % 10
  const ultimoDigito = parseInt(isbnLimpo[12], 10)
  if (digitoVerificacao !== ultimoDigito) {
    return 'ISBN inválido (dígito verificador incorreto)'
  }

  return null
}

export const validarISBN10 = isbn => {
  if (!isbn) return 'ISBN não pode estar vazio'

  const isbnLimpo = isbn.toString().replace(/[\s-]/g, '').toUpperCase()
  if (!/^\d{9}[\dX]$/.test(isbnLimpo)) {
    return 'ISBN-10 deve ter 10 caracteres (dígitos e X opcional no final)'
  }

  let soma = 0
  for (let i = 0; i < 10; i++) {
    const char = isbnLimpo[i]
    const valor = char === 'X' ? 10 : parseInt(char, 10)
    soma += valor * (10 - i)
  }

  if (soma % 11 !== 0) {
    return 'ISBN inválido (dígito verificador incorreto)'
  }

  return null
}

export const validarISBN = isbn => {
  if (!isbn) return 'ISBN não pode estar vazio'
  const limpo = isbn.toString().replace(/[\s-]/g, '')
  if (limpo.length === 13) return validarISBN13(limpo)
  if (limpo.length === 10) return validarISBN10(limpo)
  return 'Informe um ISBN-10 ou ISBN-13 válido'
}

export class CriarLivroDTOValidator {
  constructor() {
    this.errors = {}
  }

  validar(dados) {
    this.errors = {}

    this.errors.tituloLivro =
      validarNotBlank(dados.tituloLivro, 'Título') ||
      validarMaxLength(dados.tituloLivro, 200, 'Título')

    this.errors.editoraLivro =
      validarNotBlank(dados.editoraLivro, 'Editora') ||
      validarMaxLength(dados.editoraLivro, 100, 'Editora')

    this.errors.anoPublicado = validarMinMax(dados.anoPublicado, 1000, 2100, 'Ano')

    this.errors.descricaoLivro =
      validarNotBlank(dados.descricaoLivro, 'Descrição') ||
      validarMaxLength(dados.descricaoLivro, 500, 'Descrição')

    const erroISBN = validarNotBlank(dados.isbnLivro, 'ISBN')
    if (erroISBN) {
      this.errors.isbnLivro = erroISBN
    } else {
      this.errors.isbnLivro =
        validarMaxLength(dados.isbnLivro, 20, 'ISBN') || validarISBN(dados.isbnLivro)
    }

    this.errors.idAutor = validarNotNull(dados.idAutor, 'Autor')

    Object.keys(this.errors).forEach(key => {
      if (this.errors[key] === null) {
        delete this.errors[key]
      }
    })

    return Object.keys(this.errors).length === 0
  }

  getErrors() {
    return this.errors
  }

  hasErrors() {
    return Object.keys(this.errors).length > 0
  }

  static limparDados(dados) {
    const anoStr = dados.anoPublicado?.toString().trim() ?? ''
    const anoPublicado = /^-?\d+$/.test(anoStr) ? parseInt(anoStr, 10) : ''

    return {
      ...dados,
      tituloLivro: dados.tituloLivro?.toString().trim() || '',
      editoraLivro: dados.editoraLivro?.toString().trim() || '',
      descricaoLivro: dados.descricaoLivro?.toString().trim() || '',
      isbnLivro: dados.isbnLivro?.toString().trim() || '',
      anoPublicado,
      disponivel: dados.disponivel !== undefined ? dados.disponivel : true,
      idAutor: dados.idAutor ? parseInt(dados.idAutor, 10) : null,
      idCategorias: Array.isArray(dados.idCategorias)
        ? dados.idCategorias.map(id => parseInt(id, 10)).filter(id => !isNaN(id))
        : [],
      idGeneros: Array.isArray(dados.idGeneros)
        ? dados.idGeneros.map(id => parseInt(id, 10)).filter(id => !isNaN(id))
        : [],
    }
  }
}

export class AutorValidator {
  constructor() {
    this.errors = {}
  }

  validar(dados) {
    this.errors = {}

    this.errors.autorLivro =
      validarNotBlank(dados.autorLivro, 'Nome do autor') ||
      validarMaxLength(dados.autorLivro, 100, 'Nome do autor')
    this.errors.autorNacionalidade =
      validarNotBlank(dados.autorNacionalidade, 'Nacionalidade') ||
      validarMaxLength(dados.autorNacionalidade, 100, 'Nacionalidade')

    Object.keys(this.errors).forEach(key => {
      if (this.errors[key] === null) {
        delete this.errors[key]
      }
    })

    return Object.keys(this.errors).length === 0
  }

  getErrors() {
    return this.errors
  }

  hasErrors() {
    return Object.keys(this.errors).length > 0
  }

  static limparDados(dados) {
    return {
      autorLivro: dados.autorLivro?.toString().trim() || '',
      autorNacionalidade: dados.autorNacionalidade?.toString().trim() || '',
    }
  }
}

export class CategoriaValidator {
  constructor() {
    this.errors = {}
  }

  validar(dados) {
    this.errors = {}

    this.errors.nomeCategoria =
      validarNotBlank(dados.nomeCategoria, 'Nome da categoria') ||
      validarMaxLength(dados.nomeCategoria, 100, 'Nome da categoria')

    Object.keys(this.errors).forEach(key => {
      if (this.errors[key] === null) {
        delete this.errors[key]
      }
    })

    return Object.keys(this.errors).length === 0
  }

  getErrors() {
    return this.errors
  }

  hasErrors() {
    return Object.keys(this.errors).length > 0
  }

  static limparDados(dados) {
    return {
      nomeCategoria: dados.nomeCategoria?.toString().trim() || '',
    }
  }
}

export class GeneroValidator {
  constructor() {
    this.errors = {}
  }

  validar(dados) {
    this.errors = {}

    this.errors.nomeGenero =
      validarNotBlank(dados.nomeGenero, 'Nome do gênero') ||
      validarMaxLength(dados.nomeGenero, 50, 'Nome do gênero')

    Object.keys(this.errors).forEach(key => {
      if (this.errors[key] === null) {
        delete this.errors[key]
      }
    })

    return Object.keys(this.errors).length === 0
  }

  getErrors() {
    return this.errors
  }

  hasErrors() {
    return Object.keys(this.errors).length > 0
  }

  static limparDados(dados) {
    return {
      nomeGenero: dados.nomeGenero?.toString().trim() || '',
    }
  }
}

export class UsuarioValidator {
  constructor() {
    this.errors = {}
  }

  validar(dados) {
    this.errors = {}

    this.errors.nome = validarNotBlank(dados.nome, 'Nome')

    const erroEmail = validarNotBlank(dados.email, 'E-mail')
    if (erroEmail) {
      this.errors.email = erroEmail
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
      this.errors.email = 'Informe um e-mail válido (ex.: nome@dominio.com)'
    }

    Object.keys(this.errors).forEach(key => {
      if (this.errors[key] === null) {
        delete this.errors[key]
      }
    })

    return Object.keys(this.errors).length === 0
  }

  getErrors() {
    return this.errors
  }

  hasErrors() {
    return Object.keys(this.errors).length > 0
  }

  static limparDados(dados) {
    return {
      nome: dados.nome?.toString().trim() || '',
      email: dados.email?.toString().trim() || '',
      telefone: dados.telefone?.toString().trim() || '',
    }
  }
}

export const validarDataPosterior = (dataInicial, dataPosterior, campoData, nomeCampo) => {
  if (!dataInicial || !dataPosterior) return null

  const dtInicial = new Date(dataInicial)
  const dtPosterior = new Date(dataPosterior)

  if (isNaN(dtInicial.getTime()) || isNaN(dtPosterior.getTime())) {
    return `${nomeCampo} deve ser uma data válida`
  }

  if (dtPosterior <= dtInicial) {
    return `${nomeCampo} deve ser posterior à data inicial`
  }

  return null
}

export class EmprestimoValidator {
  constructor() {
    this.errors = {}
  }

  validar(dados) {
    this.errors = {}

    this.errors.idLivro = validarNotNull(dados.idLivro, 'Livro')
    this.errors.idUsuario = validarNotNull(dados.idUsuario, 'Usuário')

    Object.keys(this.errors).forEach(key => {
      if (this.errors[key] === null) {
        delete this.errors[key]
      }
    })

    return Object.keys(this.errors).length === 0
  }

  getErrors() {
    return this.errors
  }

  hasErrors() {
    return Object.keys(this.errors).length > 0
  }

  static limparDados(dados) {
    return {
      idLivro: dados.idLivro ? parseInt(dados.idLivro, 10) : null,
      idUsuario: dados.idUsuario ? parseInt(dados.idUsuario, 10) : null,
    }
  }
}

export default CriarLivroDTOValidator
