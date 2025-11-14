/**
 * Sistema de validação frontend baseado no CriarLivroDTO do backend
 * Mantém coerência com as validações do Spring Boot e Hibernate
 */

// ========================================
// VALIDAÇÕES INDIVIDUAIS (equivalentes às annotations)
// ========================================

/**
 * Validação @NotBlank - campo não pode estar vazio após trim
 */
export const validarNotBlank = (valor, campo) => {
  if (!valor || valor.toString().trim() === '') {
    return `${campo} não pode estar em branco`
  }
  return null
}

/**
 * Validação @NotNull - campo não pode ser nulo
 */
export const validarNotNull = (valor, campo) => {
  if (valor === null || valor === undefined) {
    return `${campo} não pode ser nulo`
  }
  return null
}

/**
 * Validação @Min/@Max para números inteiros
 */
export const validarMinMax = (valor, min, max, campo) => {
  const num = parseInt(valor)
  if (isNaN(num)) {
    return `${campo} deve ser um número válido`
  }
  if (num < min) {
    return `${campo} deve ser maior que ${min}`
  }
  if (num > max) {
    return `${campo} deve ser menor que ${max}`
  }
  return null
}

// ========================================
// VALIDAÇÃO ISBN COMPLETA (equivalente ao @ISBN do Hibernate)
// ========================================

/**
 * Algoritmo de validação ISBN-13 idêntico ao Hibernate Validator @ISBN
 * Implementa o checksum mod 10 conforme ISO 2108
 */
export const validarISBN13 = isbn => {
  if (!isbn) return 'ISBN não pode estar vazio'

  // Formato básico: deve ter exatamente 13 dígitos numéricos
  const isbnLimpo = isbn.toString().replace(/\s|-/g, '')
  if (!/^\d{13}$/.test(isbnLimpo)) {
    return 'ISBN deve ter exatamente 13 dígitos numéricos'
  }

  // Algoritmo de checksum ISBN-13
  // Posições: 1 2 3 4 5 6 7 8 9 10 11 12 13
  // Pesos:    1 3 1 3 1 3 1 3 1  3  1  3
  let soma = 0
  for (let i = 0; i < 12; i++) {
    const digito = parseInt(isbnLimpo[i])
    const peso = i % 2 === 0 ? 1 : 3 // Posições pares (0,2,4...) = peso 1, ímpares (1,3,5...) = peso 3
    soma += digito * peso
  }

  // Calcula dígito verificador
  const digitoVerificacao = (10 - (soma % 10)) % 10

  // Último dígito deve corresponder ao calculado
  const ultimoDigito = parseInt(isbnLimpo[12])
  if (digitoVerificacao !== ultimoDigito) {
    return 'ISBN inválido (dígito verificador incorreto)'
  }

  return null // ISBN válido
}

// ========================================
// VALIDADOR COMPLETO CRIARLIVRODTO
// ========================================

/**
 * Classe validadora que replica exatamente o CriarLivroDTO.java
 */
export class CriarLivroDTOValidator {
  constructor() {
    this.errors = {}
  }

  /**
   * Valida todos os campos do formulário
   */
  validar(dados) {
    this.errors = {}

    // @NotBlank(message = "O título não pode estar em branco")
    this.errors.tituloLivro = validarNotBlank(dados.tituloLivro, 'Título')

    // @NotBlank(message = "A editora não pode estar em branco")
    this.errors.editoraLivro = validarNotBlank(dados.editoraLivro, 'Editora')

    // @Min(1000) @Max(2100)
    this.errors.anoPublicado = validarMinMax(
      dados.anoPublicado,
      1000,
      2100,
      'Ano'
    )

    // @NotBlank(message = "A descrição não pode estar em branco")
    this.errors.descricaoLivro = validarNotBlank(
      dados.descricaoLivro,
      'Descrição'
    )

    // @NotBlank + @ISBN - validação completa do ISBN
    const erroISBN = validarNotBlank(dados.isbnLivro, 'ISBN')
    if (erroISBN) {
      this.errors.isbnLivro = erroISBN
    } else {
      this.errors.isbnLivro = validarISBN13(dados.isbnLivro)
    }

    // @NotNull(message = "O ID do autor não pode ser nulo")
    this.errors.idAutor = validarNotNull(dados.idAutor, 'Autor')

    // Remove erros nulos (campos válidos)
    Object.keys(this.errors).forEach(key => {
      if (this.errors[key] === null) {
        delete this.errors[key]
      }
    })

    return Object.keys(this.errors).length === 0
  }

  /**
   * Retorna todas as mensagens de erro
   */
  getErrors() {
    return this.errors
  }

  /**
   * Verifica se há erros
   */
  hasErrors() {
    return Object.keys(this.errors).length > 0
  }

  /**
   * Limpa dados (trim nos textos)
   */
  static limparDados(dados) {
    return {
      ...dados,
      tituloLivro: dados.tituloLivro?.toString().trim() || '',
      editoraLivro: dados.editoraLivro?.toString().trim() || '',
      descricaoLivro: dados.descricaoLivro?.toString().trim() || '',
      isbnLivro: dados.isbnLivro?.toString().trim() || '',
      anoPublicado: parseInt(dados.anoPublicado) || 0,
      disponivel: dados.disponivel !== undefined ? dados.disponivel : true,
      idAutor: dados.idAutor ? parseInt(dados.idAutor) : null,
      idCategorias: Array.isArray(dados.idCategorias)
        ? dados.idCategorias.map(id => parseInt(id)).filter(id => !isNaN(id))
        : [],
      idGeneros: Array.isArray(dados.idGeneros)
        ? dados.idGeneros.map(id => parseInt(id)).filter(id => !isNaN(id))
        : [],
    }
  }
}
/**
 * Classe validadora que replica exatamente o ModelAutor.java
 */
export class AutorValidator {
  constructor() {
    this.errors = {}
  }

  /**
   * Valida autorLivro e autorNacionalidade (@NotBlank)
   */
  validar(dados) {
    this.errors = {}

    this.errors.autorLivro = validarNotBlank(dados.autorLivro, 'Nome do autor')
    this.errors.autorNacionalidade = validarNotBlank(dados.autorNacionalidade, 'Nacionalidade')

    // Remove erros nulos (campos válidos)
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

/**
 * Classe validadora que replica exatamente o Categoria.java
 */
export class CategoriaValidator {
  constructor() {
    this.errors = {}
  }

  /**
   * Valida nomeCategoria (@NotBlank)
   */
  validar(dados) {
    this.errors = {}

    this.errors.nomeCategoria = validarNotBlank(dados.nomeCategoria, 'Nome da categoria')

    // Remove erros nulos (campos válidos)
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

/**
 * Classe validadora que replica exatamente o Genero.java
 */
export class GeneroValidator {
  constructor() {
    this.errors = {}
  }

  /**
   * Valida nomeGenero (@NotBlank)
   */
  validar(dados) {
    this.errors = {}

    this.errors.nomeGenero = validarNotBlank(dados.nomeGenero, 'Nome do gênero')

    // Remove erros nulos (campos válidos)
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

/**
 * Validação customizada para datas - verifica se uma data é posterior à outra
 */
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

/**
 * Classe validadora que replica exatamente o ModelEmprestimos.java
 */
export class EmprestimoValidator {
  constructor() {
    this.errors = {}
  }

  /**
   * Valida idLivro, idUsuario (@NotNull), datas (@NotNull) e dataDevolucao > dataEmprestimo
   */
  validar(dados) {
    this.errors = {}

    // @NotNull validations
    this.errors.idLivro = validarNotNull(dados.idLivro, 'Livro')
    this.errors.idUsuario = validarNotNull(dados.idUsuario, 'Usuário')
    this.errors.dataEmprestimo = validarNotNull(dados.dataEmprestimo, 'Data do empréstimo')
    this.errors.dataDevolucao = validarNotNull(dados.dataDevolucao, 'Data de devolução')

    // Custom validation: dataDevolucao > dataEmprestimo
    if (dados.dataEmprestimo && dados.dataDevolucao) {
      const erroData = validarDataPosterior(
        dados.dataEmprestimo,
        dados.dataDevolucao,
        'dataDevolucao',
        'Data de devolução prevista'
      )
      if (erroData) {
        this.errors.dataDevolucao = erroData
      }
    }

    // Remove erros nulos (campos válidos)
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
    return { ...dados }
  }
}

export default CriarLivroDTOValidator
