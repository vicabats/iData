package com.fatecipiranga.api.response;

public record UsuarioResponseDTO(String id, String fullName, String cpf, String birthdate, String email, String password, String phone, String registrationDate, EnderecoResponseDTO endereco) {

    public Object getEmail() {
        throw new UnsupportedOperationException("Unimplemented method 'getEmail'");
    }
}
