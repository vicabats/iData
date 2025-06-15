<h1>🩺 iData</h1>

<p>
  <strong>iData</strong> é uma plataforma web que oferece o serviço de gerenciamento de documentos clínicos pessoais (como exames e laudos médicos, por exemplo) e compartilhamento dos mesmos com profissionais de saúde, priorizando sempre a segurança dos dados e seguindo os padrões da LGPD.
</p>

<hr />

<h2>📦 Estrutura do Projeto</h2>
<ul>
  <li><strong>Backend:</strong> API RESTful em Java 17 com Spring Boot, MongoDB e MapStruct</li>
  <li><strong>Frontend:</strong> Interface responsiva em Angular 19</li>
</ul>

<h2>🛠️ Funcionalidades</h2>
<ul>
  <li>Cadastro e gerenciamento de usuários: usuário paciente e usuário profissional de saúde</li>
  <li>Login com autenticação em dois fatores (2FA)</li>
  <li>Cadastro e gerenciamento de Exames (ex.: prontuários ou laudos)</li>
  <li>Compartilhamento de Exames entre usuário paciente e usuário profissional de saúde</li>
  <li>Registro de cada visualização que um profissional de saúde fizer a um exame compartilhado consigo</li>
</ul>

<h2>📋 Regras de Negócio</h2>
<ul>
  <li>Unicidade de e-mail e CPF (exceto profissionais com CRM ou registro profissional)</li>
  <li>Usuários pacientes podem criar, editar, visualizar e deletar exames/prontuários; usuários profissionais apenas visualizam</li>
  <li>Suporte a exames nos formatos PDF</li>
  <li>Compartilhamento de dados somente com consentimento explícito do usuário</li>
  <li>Exames compartilhados persistem no banco de dados, porém sua visualização por parte de profissionais de saúde expira após 24 horas</li>
  <li>Cada vez que um profissional de saúde visualiza um exame compartilhado de um usuário paciente, um log é gerado no banco de dados</li>
</ul>

<h2>🧰 Tecnologias</h2>

<h3>🔙 Backend</h3>
<ul>
  <li>Java 17</li>
  <li>Spring Boot 3.4.4</li>
  <li>MongoDB</li>
  <li>MapStruct 1.5.5.Final</li>
  <li>Lombok 1.18.32</li>
  <li>Maven</li>
</ul>

<h3>🎨 Frontend</h3>
<ul>
  <li>Angular 19.2.0</li>
  <li>TypeScript</li>
  <li>RxJS</li>
</ul>

<h2>🖥️ Infraestrutura</h2>
<ul>
  <li>Docker</li>
  <li>GitHub Actions (CI/CD)</li>
</ul>

<h2>🔐 Segurança </h2>
<ul>
  <li>Autenticação em 2FA para logar</li>
  <li>Autenticação em 2FA para deletar exame</li>
  <li>Conformidade com LGPD</li>
  <li>Logs de acesso</li>
</ul>

<h2>🏗️ Arquitetura Backend</h2>
<ul>
  <li>Padrões MVC e DAO, com MongoDB não relacional</li>
</ul>

<h2> Arquitetura Frontend</h2>
<ul>
  <li>Estrutura modular (cada feature pertence a um módulo, com seus próprios componente, serviços e páginas)</li>
  <li>Componentização e criação de tokens de design system</li>
  <li>Comunicação com backend de forma encapsulada através de classes de serviço, que fazem as requisições HTTP</li>
  <li>Gerenciamento de estado realizado por classes Singleton, que mantém o estado do usuário. O estado é exposto via Observables, o que permite que classes se inscrevam a eles e reajam a mudanças de estado de forma reativa</li>
</ul>

<h2>▶️ Como Executar</h2>

<h3>📌 Pré-requisitos</h3>
<ul>
  <li>Docker e Docker Compose</li>
  <li>Git</li>
</ul>

<h3>📥 Passos</h3>

<pre><code>
# Clonar o repositório
git clone https://github.com/vicabats/iData.git
cd iData

# Baixar imagens Docker
docker compose pull

# Iniciar os serviços
docker compose up -d
</code></pre>

<h3>🌐 Acesso</h3>
<ul>
  <li><strong>Frontend:</strong> <a href="http://localhost">http://localhost</a></li>
  <li><strong>Backend:</strong> <a href="http://localhost:8080/actuator/health">http://localhost:8080/actuator/health</a> → <code>{"status": "UP"}</code></li>
</ul>

<p><strong>ℹ️ Nota:</strong> o endpoint <code>http://localhost:8080</code> pode retornar <code>INTERNAL_SERVER_ERROR</code> caso alguns serviços ainda estejam em desenvolvimento.</p>

<h3>⏹️ Parar os serviços</h3>
<pre><code>
docker compose down
</code></pre>

<h2>💻 Desenvolvimento Local (Opcional)</h2>

<h3>Backend</h3>
<pre><code>
cd backend/idata
mvn clean install
mvn spring-boot:run
</code></pre>

<p>API disponível em <a href="http://localhost:8080">http://localhost:8080</a></p>

<h3>Frontend</h3>
<pre><code>
cd frontend
npm install
ng serve
</code></pre>

<p>Interface disponível em <a href="http://localhost:4200">http://localhost:4200</a></p>

<h2>🔗 Links</h2>
<ul>
  <li><strong>Repositório:</strong> <a href="https://github.com/vicabats/iData">https://github.com/vicabats/iData</a></li>
  <li><strong>Docker Hub:</strong>
    <ul>
      <li><a href="https://hub.docker.com/r/julianahaddad/idata-frontend">julianahaddad/idata-frontend:v4</a></li>
      <li><a href="https://hub.docker.com/r/julianahaddad/idata-backend">julianahaddad/idata-backend:v4</a></li>
    </ul>
  </li>
  <li><strong>CI/CD:</strong> <a href="https://github.com/vicabats/iData/actions">https://github.com/vicabats/iData/actions</a></li>
</ul>

<h2>🧯 Solução de Problemas</h2>

<h3>📉 Backend DOWN</h3>
<p>Verifique os logs:</p>
<pre><code>docker logs idata-1-new-backend-1</code></pre>

<p>Verifique conexão com MongoDB:</p>
<pre><code>ping mongodb</code></pre>

<h3>🛑 Portas Ocupadas</h3>
<pre><code>
netstat -aon | findstr :80
netstat -aon | findstr :8080
taskkill /PID &lt;PID&gt; /F
</code></pre>

<h3>🧹 Limpar Ambiente</h3>
<pre><code>
docker compose down
docker rm -f $(docker ps -aq)
docker image prune -f
</code></pre>

<h2>👥 Equipe</h2>
<ul>
  <li>Juliana Haddad</li>
  <li>Pedro Henrique Moreira</li>
  <li>Vitória Gomes Batistoti de Abreu</li>
</ul>
