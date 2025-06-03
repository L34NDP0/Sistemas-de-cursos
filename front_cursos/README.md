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
- Flask 2.0.1
- SQLAlchemy 1.4.23
- Flask-SQLAlchemy 2.5.1
- Flask-CORS 5.0.0
- SQLite (Banco de dados)
- Python-dotenv 1.0.1
- Email-validator 1.1.3

### Frontend
- Vue.js 3
- Bootstrap 5
- Fetch API
- Vue Router
- Environment variables

## Pré-requisitos

### Backend
- Python 3.x
- pip (gerenciador de pacotes Python)

### Frontend
- Node.js (versão 14 ou superior)
- NPM ou Yarn
- API Backend em execução

## Instalação e Configuração

### Backend (API)

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
```

2. Entre no diretório do backend:
```bash
cd backend_API
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente:
Crie um arquivo .env com:
BASE_URL=http://localhost:5000



5. Inicie o servidor:
```bash
python app.py
```

- A API estará disponível em http://localhost:5000

### Frontend
- Entre no diretório do frontend:
- cd front_cursos
- Instale as dependências:
- npm install
- Configure as variáveis de ambiente: Crie um arquivo .env com:
VUE_APP_API_URL=http://localhost:5000

- Inicie o servidor de desenvolvimento:
- npm run serve
- O frontend estará disponível em http://localhost:8080

### Uso API Endpoints
# Cursos
GET /cursos - Lista todos os cursos
POST /cursos - Cria novo(s) curso(s)
GET /cursos/{id} - Obtém um curso específico
PUT /cursos/{id} - Atualiza um curso
DELETE /cursos/{id} - Remove um curso
GET /cursos/categoria/{categoria} - Filtra cursos por categoria
GET /cursos/ordenar/{ordem} - Lista cursos ordenados por duração

# Alunos
GET /alunos - Lista todos os alunos
POST /alunos - Cria novo(s) aluno(s)
GET /alunos/{id} - Obtém um aluno específico
PUT /alunos/{id} - Atualiza um aluno
DELETE /alunos/{id} - Remove um aluno

# Matrículas
GET /matriculas - Lista todas as matrículas
POST /matriculas - Cria nova(s) matrícula(s)
DELETE /matriculas/{id} - Cancela uma matrícula
GET /cursos/{curso_id}/alunos - Lista alunos matriculados em um curso
GET /alunos/{aluno_id}/cursos - Lista cursos de um aluno

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