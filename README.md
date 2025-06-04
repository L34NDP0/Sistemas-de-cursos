# Sistema de Gerenciamento de Cursos

Sistema completo para gerenciamento de cursos, alunos e matrículas, composto por uma API REST (Backend) e uma interface web (Frontend).

## Funcionalidades

### Backend (API REST)
- CRUD completo de Cursos
- CRUD completo de Alunos
- Gerenciamento de Matrículas
- Filtros por categoria de curso
- Ordenação por duração
- Validações de dados
- Relacionamentos entre entidades

### Frontend
- Realização de novas matrículas
- Cancelamento de matrículas
- Pesquisa por aluno ou curso
- Paginação dos resultados
- Interface responsiva e intuitiva

## Tecnologias Utilizadas

### Backend
- NodeJs
- TypeScript


## Pré-requisitos
# Course Management API

A Node.js/TypeScript backend for course management system.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create .env file with required environment variables (see .env.example)

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

For development:
```bash
npm run dev
```

## API Endpoints

### Cursos (Courses)
- GET /cursos - List all courses
- POST /cursos - Create course(s)
- GET /cursos/:id - Get course by ID
- PUT /cursos/:id - Update course
- DELETE /cursos/:id - Delete course
- GET /categorias - List categories
- GET /cursos/categoria/:categoria - Filter courses by category
- GET /cursos/ordenar/:ordem - Sort courses by duration
- GET /cursos/filtrar - Filter and sort courses

### Alunos (Students)
- GET /alunos - List all students
- POST /alunos - Create student(s)
- GET /alunos/:id - Get student by ID
- PUT /alunos/:id - Update student
- DELETE /alunos/:id - Delete student
- GET /alunos/:id/cursos - List courses of a student

### Matrículas (Enrollments)
- GET /matriculas - List all enrollments
- POST /matriculas - Create enrollment(s)
- DELETE /matriculas/:id - Delete enrollment

### Frontend
- Node.js (versão 14 ou superior)
- NPM ou Yarn
- API Backend em execução

## Instalação e Configuração

### Frontend
- Vue.js 3
- Bootstrap 5
- Fetch API
- Vue Router
- Environment variables


- Entre no diretório do frontend:
- cd front_cursos
- Instale as dependências:
- npm install
- Configure as variáveis de ambiente: Crie um arquivo .env com:
VUE_APP_API_URL=http://localhost:5000

- Inicie o servidor de desenvolvimento:
- npm run serve
- O frontend estará disponível em http://localhost:8080



## Interface Web
Acesse http://localhost:8080 para utilizar o sistema através da interface web. O sistema possui as seguintes seções:

/ - Página inicial com listagem de cursos
/alunos - Gerenciamento de alunos
/matriculas - Gerenciamento de matrículas
- Build para Produção
- Frontend
- npm run build
- Os arquivos serão gerados no diretório dist/.

## Autor
Leandro_Barros - github.com/L34NDP0