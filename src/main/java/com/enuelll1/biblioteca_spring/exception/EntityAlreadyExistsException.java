package com.enuelll1.biblioteca_spring.exception;

/**
 * Exceção lançada quando uma entidade já existe e não pode ser criada
 */
public class EntityAlreadyExistsException extends BibliotecaException {

    public EntityAlreadyExistsException(String message) {
        super(message);
    }

    public EntityAlreadyExistsException(String message, Throwable cause) {
        super(message, cause);
    }

    public EntityAlreadyExistsException(String entityName, String fieldName, String value) {
        super(String.format("%s com %s '%s' já cadastrado!", entityName, fieldName, value));
    }
}
