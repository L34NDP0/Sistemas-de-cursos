import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './models/index';
import alunoRoutes from './routes/alunoRoutes';
import cursoRoutes from './routes/cursoRoutes';
import matriculaRoutes from './routes/matriculaRoutes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/alunos', alunoRoutes);
app.use('/cursos', cursoRoutes);
app.use('/matriculas', matriculaRoutes);

// Inicialização do banco de dados
sequelize.sync()
    .then(() => {
        console.log('Banco de dados sincronizado');
    })
    .catch((error) => {
        console.error('Erro ao sincronizar banco de dados:', error);
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;