# 🐾 Clínica Veterinária - Sistema de Gestão

Um sistema web completo para gestão de clínicas, veterinários e atendimentos, desenvolvido com **Next.js** no front-end e **Spring Boot (Java)** no back-end.

---

## 🚀 Tecnologias Utilizadas

### **Front-end**
- **Framework:** [Next.js] (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Deploy:** Vercel

### **Back-end**
- **Framework:** [Spring Boot]
- **Linguagem:** Java 21+
- **ORM / Banco:** Spring Data JPA / Hibernate (MySQL / Aiven)
- **Deploy:** Render

---

## 🛠️ Arquitetura do Projeto

```text
clinica-veterinaria/
├── frontend/             # Aplicação Next.js (Interface do Usuário)
│   ├── src/
│   │   ├── app/          # Páginas e rotas da aplicação
│   │   └── services/     # Consumo da API REST
│   └── package.json
│
└── backend/              # API REST em Spring Boot
    ├── src/
    │   └── main/java/com/example/clinica/
    │       ├── controller/   # Endpoints da API
    │       ├── model/        # Entidades JPA
    │       ├── repository/   # Interfaces Spring Data JPA
    │       └── service/      # Regras de negócio
    └── pom.xml

```

## 📋 Variáveis de Ambiente
O projeto precisa de arquivos de configuração de ambiente para se conectar aos serviços externos (banco de dados e APIs).

```bash
1. Back-end (backend/src/main/resources/application.properties)
   
Crie ou configure as propriedades de conexão no seu back-end (exemplo usando MySQL/H2):

### Porta do Servidor
server.port=${PORT:8080}

### Configuração do Banco de Dados (Exemplo MySQL / Aiven)
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

### Configuração do JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

2. Na pasta backend/, crie um arquivo .env contendo as suas variáveis de conexão (exemplo com Aiven):
PORT=3001
DATABASE_URL=mysql://avnadmin:sua_senha@seu-host-aiven:porta/clinica_db?ssl-mode=REQUIRED

3. Front-end (frontend/.env.local)
Na pasta frontend/, crie um arquivo .env.local com a URL do seu back-end:

Exemplo:
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

## ⚙️ Como Executar o Projeto

```bash
1. Configurar e rodar o Back-end
# Entre na pasta do backend
cd backend

# Execute a API em modo de desenvolvimento
npm run dev

2. Configurar e rodar o Front-end

# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
