iData

O iData é uma plataforma web para gerenciamento seguro de dados clínicos pessoais, como exames médicos e prontuários, além do controle de contatos de segurança (protetores) e compartilhamento dessas informações com profissionais de saúde autorizados.

O projeto é dividido em duas pastas principais:

backend: API RESTful desenvolvida em Java 17 utilizando Spring Boot, MongoDB e MapStruct.

frontend: Aplicação desenvolvida em Angular 19, proporcionando uma interface intuitiva, responsiva e de fácil usabilidade.



🚀 Funcionalidades Já Implementadas

Cadastro e gerenciamento de usuários (usuário final, contato de segurança e profissional de saúde)

Funcionalidades em Desenvolvimento

Login com autenticação e autenticação em dois fatores (2FA)

Armazenamento de prontuários e exames médicos

Compartilhamento de exames e prontuários com profissionais de saúde

Relacionamento de contatos de segurança (protetores e protegidos)

Visualização de históricos clínicos e registros médicos

Relembrar e aceitar termos e condições conforme exigências da LGPD

🛠 Tecnologias Utilizadas

Backend

Java 17

Spring Boot 3.2.4

MongoDB

MapStruct

Lombok

Maven

Frontend

Angular 19.2.0

TypeScript

Bootstrap

RxJS

📑 Regras de Negócio (Principais)

Não é permitido o cadastro de dois usuários com o mesmo e-mail ou CPF, salvo profissionais de saúde que podem ter múltiplos registros com base no seu CRM ou registro profissional.

Usuários finais poderão manter e editar seus exames e prontuários; contatos de segurança e profissionais da saúde poderão apenas visualizar.

Um usuário final poderá ter até três contatos de segurança.

Todo profissional de saúde precisará ter seu registro profissional validado.

Extensões permitidas para exames: PDF e JPEG.

Todo compartilhamento de dados será realizado mediante ciência e aceite do usuário.

🔐 Segurança (a implementar)

Autenticação em dois fatores (2FA)

Senha criptografada

Proteção via HTTPS

Respeito à LGPD

Logs de acesso para profissionais de saúde

🏗️ Arquitetura

Arquitetura em camadas (MVC e DAO)

Separação de responsabilidade entre apresentação, negócios e dados

Banco de dados não-relacional: MongoDB

Frontend desenvolvido em Angular, compatível com Google Chrome

📋 Como Executar o Projeto

1️⃣ Clonar o repositório

git clone https://github.com/vicabats/iData.git
cd iData

2️⃣ Configurar e executar o backend

cd backend
mvn clean install
mongod # caso use MongoDB local
mvn spring-boot:run

A API estará disponível em http://localhost:8080

3️⃣ Executar o frontend

cd frontend
npm install
ng serve

A interface estará disponível em http://localhost:4200

✅ Testes

Backend: Testes unitários utilizando o framework de testes do Spring.

Frontend: Testes unitários com Karma.

👥 Equipe de Desenvolvimento

Juliana Haddad 

Pedro Henrique Moreira

Vitória Gomes Batistoti de Abreu

