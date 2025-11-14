package com.enuelll1.biblioteca_spring.exception;

/**
 * Exceção base para o sistema de biblioteca
 */
public class BibliotecaException extends RuntimeException {

    public BibliotecaException(String message) {
        super(message);
    }

    public BibliotecaException(String message, Throwable cause) {
        super(message, cause);
    }
}
