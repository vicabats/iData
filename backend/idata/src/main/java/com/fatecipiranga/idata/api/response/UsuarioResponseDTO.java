package com.fatecipiranga.idata.api.response;

public record UsuarioResponseDTO(String id, String name, String cpf, String email, String password, String phone, String registrationDate, EnderecoResponseDTO endereco) {

    public Object getEmail() {
        throw new UnsupportedOperationException("Unimplemented method 'getEmail'");
    }
}
