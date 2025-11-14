package com.enuelll1.biblioteca_spring.exception;

/**
 * Exceção lançada quando uma entidade não é encontrada
 */
public class EntityNotFoundException extends BibliotecaException {

    public EntityNotFoundException(String message) {
        super(message);
    }

    public EntityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public EntityNotFoundException(String entityName, Long id) {
        super(String.format("%s com ID %d não encontrado!", entityName, id));
    }
}
