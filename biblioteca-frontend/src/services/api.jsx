const API_URL = '/api'

// ========================================
// LIVROS
// ========================================
export const livrosAPI = {
  listarTodos: async () => {
    const response = await fetch(`${API_URL}/livros`)
    return response.json()
  },

  buscarPorId: async id => {
    const response = await fetch(`${API_URL}/livros/${id}`)
    return response.json()
  },

  listarDisponiveis: async () => {
    const response = await fetch(`${API_URL}/livros/disponiveis`)
    return response.json()
  },

  criar: async livro => {
    const response = await fetch(`${API_URL}/livros`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro),
    })
    return response.json()
  },

  atualizar: async (id, livro) => {
    const response = await fetch(`${API_URL}/livros/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro),
    })
    return response.json()
  },

  deletar: async id => {
    await fetch(`${API_URL}/livros/${id}`, {
      method: 'DELETE',
    })
  },
}

// ========================================
// AUTORES
// ========================================
export const autoresAPI = {
  listarTodos: async () => {
    const response = await fetch(`${API_URL}/autores`)
    return response.json()
  },

  criar: async (autor) => {
    const response = await fetch(`${API_URL}/autores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        autorLivro: autor.autorLivro,
        autorNacionalidade: autor.autorNacionalidade
      }),
    })
    return response.json()
  },

  deletar: async id => {
    await fetch(`${API_URL}/autores/${id}`, {
      method: 'DELETE',
    })
  },
}

// ========================================
// CATEGORIAS
// ========================================
export const categoriasAPI = {
  listarTodos: async () => {
    const response = await fetch(`${API_URL}/categorias`)
    return response.json()
  },

  criar: async (categoria) => {
    const response = await fetch(`${API_URL}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeCategoria: categoria.nomeCategoria
      }),
    })
    return response.json()
  },

  deletar: async id => {
    await fetch(`${API_URL}/categorias/${id}`, {
      method: 'DELETE',
    })
  },
}

// ========================================
// GÊNEROS
// ========================================
export const generosAPI = {
  listarTodos: async () => {
    const response = await fetch(`${API_URL}/generos`)
    return response.json()
  },

  criar: async (genero) => {
    const response = await fetch(`${API_URL}/generos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeGenero: genero.nomeGenero
      }),
    })
    return response.json()
  },
}

// ========================================
// USUÁRIOS
// ========================================
export const usuariosAPI = {
  listarTodos: async () => {
    const response = await fetch(`${API_URL}/usuarios`)
    return response.json()
  },

  criar: async (usuario) => {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone
      }),
    })
    return response.json()
  },
}

// ========================================
// EMPRÉSTIMOS
// ========================================
export const emprestimosAPI = {
  criar: async (emprestimo) => {
    const response = await fetch(`${API_URL}/emprestimos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        livroId: emprestimo.livroId,
        usuarioId: emprestimo.usuarioId
      }),
    })
    return response.json()
  },

  devolver: async id => {
    const response = await fetch(`${API_URL}/emprestimos/${id}/devolver`, {
      method: 'POST',
    })
    return response.json()
  },

  listarAtivos: async () => {
    const response = await fetch(`${API_URL}/emprestimos/ativos`)
    return response.json()
  },

  listarAtrasados: async () => {
    const response = await fetch(`${API_URL}/emprestimos/atrasados`)
    return response.json()
  },
}
