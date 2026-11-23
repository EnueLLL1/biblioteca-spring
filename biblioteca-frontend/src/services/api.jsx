const API_URL = '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options)

  if (!response.ok) {
    let errorData = null
    try {
      errorData = await response.json()
    } catch {
      // Resposta sem corpo JSON (ex.: proxy indisponível)
    }
    const error = new Error(errorData?.message || `Erro HTTP ${response.status}`)
    error.status = response.status
    error.response = { status: response.status, data: errorData }
    throw error
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

// ========================================
// LIVROS
// ========================================
export const livrosAPI = {
  listarTodos: () => request('/livros'),

  buscarPorId: id => request(`/livros/${id}`),

  listarDisponiveis: () => request('/livros/disponiveis'),

  criar: livro =>
    request('/livros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro),
    }),

  atualizar: (id, livro) =>
    request(`/livros/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(livro),
    }),

  deletar: id =>
    request(`/livros/${id}`, {
      method: 'DELETE',
    }),
}

// ========================================
// AUTORES
// ========================================
export const autoresAPI = {
  listarTodos: () => request('/autores'),

  criar: autor =>
    request('/autores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        autorLivro: autor.autorLivro,
        autorNacionalidade: autor.autorNacionalidade,
      }),
    }),

  deletar: id =>
    request(`/autores/${id}`, {
      method: 'DELETE',
    }),
}

// ========================================
// CATEGORIAS
// ========================================
export const categoriasAPI = {
  listarTodos: () => request('/categorias'),

  criar: categoria =>
    request('/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeCategoria: categoria.nomeCategoria,
      }),
    }),

  deletar: id =>
    request(`/categorias/${id}`, {
      method: 'DELETE',
    }),
}

// ========================================
// GÊNEROS
// ========================================
export const generosAPI = {
  listarTodos: () => request('/generos'),

  criar: genero =>
    request('/generos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nomeGenero: genero.nomeGenero,
      }),
    }),

  deletar: id =>
    request(`/generos/${id}`, {
      method: 'DELETE',
    }),
}

// ========================================
// USUÁRIOS
// ========================================
export const usuariosAPI = {
  listarTodos: () => request('/usuarios'),

  criar: usuario =>
    request('/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: usuario.nome,
        email: usuario.email,
        telefone: usuario.telefone,
      }),
    }),

  deletar: id =>
    request(`/usuarios/${id}`, {
      method: 'DELETE',
    }),
}

// ========================================
// EMPRÉSTIMOS
// ========================================
export const emprestimosAPI = {
  criar: emprestimo =>
    request('/emprestimos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        livroId: emprestimo.livroId,
        usuarioId: emprestimo.usuarioId,
      }),
    }),

  devolver: id =>
    request(`/emprestimos/${id}/devolver`, {
      method: 'POST',
    }),

  listarAtivos: () => request('/emprestimos/ativos'),

  listarAtrasados: () => request('/emprestimos/atrasados'),
}
