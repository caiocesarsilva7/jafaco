Aplicação de Autenticação JWT com Spring Boot e React
Este repositório contém uma aplicação de exemplo que implementa autenticação usando JWT (JSON Web Tokens) com um backend Spring Boot e um frontend React.
Visão Geral
A aplicação consiste em:

Backend: API REST desenvolvida com Spring Boot e Spring Security
Frontend: Interface de usuário desenvolvida com React e integrada com o sistema de autenticação

Funcionalidades

Registro e login de usuários
Autenticação baseada em JWT
Proteção de rotas no frontend
Interceptação automática de requisições para inclusão do token
Perfil de usuário com informações básicas

Pré-requisitos
Para executar este projeto, você precisa ter instalado:

Java 17 ou superior
Maven 3.6 ou superior
Node.js 16 ou superior
npm 7 ou superior

Configuração do Backend

Clone o repositório:
bashgit clone https://github.com/caiocesarsilva7
cd https://github.com/caiocesarsilva7

Compile e execute o backend:
bashcd backend
mvn clean install
mvn spring-boot:run
O servidor estará rodando em http://localhost:8080

Configuração do Frontend

Instale as dependências:
bashcd frontend
npm install

Caso encontre erros relacionados a criptografia (Node.js 17+), configure a variável de ambiente:
bash# Para Windows (PowerShell)
$env:NODE_OPTIONS="--openssl-legacy-provider"

# Para Windows (CMD)
set NODE_OPTIONS=--openssl-legacy-provider

# Para Linux/Mac
export NODE_OPTIONS=--openssl-legacy-provider
Ou modifique o arquivo package.json:
json"scripts": {
  "start": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts start",
  "build": "set NODE_OPTIONS=--openssl-legacy-provider && react-scripts build"
}

Execute o frontend:
bashnpm start
O aplicativo estará rodando em http://localhost:3000
