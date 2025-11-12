const API_URL = 'http://localhost:3000/api'

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

  criar: async (nome, nacionalidade) => {
    const response = await fetch(
      `${API_URL}/autores?nome=${nome}&nacionalidade=${nacionalidade}`,
      { method: 'POST' }
    )
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

  criar: async nome => {
    const response = await fetch(`${API_URL}/categorias?nome=${nome}`, {
      method: 'POST',
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

  criar: async nome => {
    const response = await fetch(`${API_URL}/generos?nome=${nome}`, {
      method: 'POST',
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

  criar: async (nome, email, telefone) => {
    const response = await fetch(
      `${API_URL}/usuarios?nome=${nome}&email=${email}&telefone=${
        telefone || ''
      }`,
      { method: 'POST' }
    )
    return response.json()
  },
}

// ========================================
// EMPRÉSTIMOS
// ========================================
export const emprestimosAPI = {
  criar: async (livroId, usuarioId) => {
    const response = await fetch(
      `${API_URL}/emprestimos?livroId=${livroId}&usuarioId=${usuarioId}`,
      { method: 'POST' }
    )
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
