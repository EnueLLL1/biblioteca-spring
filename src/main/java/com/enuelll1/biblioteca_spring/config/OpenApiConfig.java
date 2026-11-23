package com.enuelll1.biblioteca_spring.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI bibliotecaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Biblioteca Spring API")
                        .description("API REST para gerenciamento de livros, autores, categorias, gêneros, usuários e empréstimos.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Emanuel")
                                .email("emanuel.gomes.bispo18@gmail.com")));
    }
}
