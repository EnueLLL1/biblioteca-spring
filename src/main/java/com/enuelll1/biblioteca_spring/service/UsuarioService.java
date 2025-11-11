package com.enuelll1.biblioteca_spring.service;

import com.enuelll1.biblioteca_spring.dto.UsuarioDTO;
import com.enuelll1.biblioteca_spring.model.ModelUsuario;
import com.enuelll1.biblioteca_spring.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // ========================================
    // CONVERTER ENTITY → DTO
    // ========================================
    public UsuarioDTO converterParaDTO(ModelUsuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getTelefone());
    }

    // ========================================
    // CRIAR USUARIO
    // ========================================
    public UsuarioDTO criar(String nome, String email, String telefone) {
        // 1. Validar se email já existe
        if (usuarioRepository.existsByEmail(email)) {
            throw new RuntimeException("Email já cadastrado!");
        }

        // 2. Criar entidade
        ModelUsuario usuario = new ModelUsuario();
        usuario.setNome(nome);
        usuario.setEmail(email);
        usuario.setTelefone(telefone);

        // 3. Salvar
        ModelUsuario salvo = usuarioRepository.save(usuario);

        // 4. Retornar DTO
        return converterParaDTO(salvo);
    }

    // ========================================
    // LISTAR TODOS OS USUARIOS
    // ========================================
    public List<UsuarioDTO> listar() {
        return usuarioRepository.findAll().stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // BUSCAR POR ID
    // ========================================
    public UsuarioDTO buscarPorId(Long id) {
        Optional<ModelUsuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado!");
        }
        return converterParaDTO(usuarioOpt.get());
    }

    // ========================================
    // BUSCAR POR NOME
    // ========================================
    public List<UsuarioDTO> buscarPorNome(String nome) {
        return usuarioRepository.findByNomeContaining(nome).stream()
                .map(this::converterParaDTO)
                .collect(Collectors.toList());
    }

    // ========================================
    // BUSCAR POR EMAIL
    // ========================================
    public UsuarioDTO buscarPorEmail(String email) {
        ModelUsuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new RuntimeException("Usuário não encontrado!");
        }
        return converterParaDTO(usuario);
    }

    // ========================================
    // DELETAR USUARIO
    // ========================================
    public void deletar(Long id) {
        // 1. Verificar se usuario existe
        Optional<ModelUsuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado!");
        }

        // 2. Verificar se usuario tem empréstimos associados
        ModelUsuario usuario = usuarioOpt.get();
        if (!usuario.getEmprestimos().isEmpty()) {
            throw new RuntimeException("Não é possível deletar usuário com empréstimos associados!");
        }

        // 3. Deletar
        usuarioRepository.deleteById(id);
    }
}
