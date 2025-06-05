import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import Matricula from '../models/Matricula';
import Aluno from '../models/Aluno';
import Curso from '../models/Curso';
import { validateRequest } from '../middleware/validator';

const router = Router();

// Listar todas as matrículas
router.get('/', async (req: Request, res: Response) => {
    try {
        const matriculas = await Matricula.findAll({
            include: [
                {
                    model: Aluno,
                    attributes: ['name']
                },
                {
                    model: Curso,
                    attributes: ['name']
                }
            ]
        });

        const matriculasFormatadas = matriculas.map(matricula => ({
            id: matricula.id,
            aluno_id: matricula.aluno_id,
            curso_id: matricula.curso_id,
            data_matricula: matricula.data_matricula,
            aluno_nome: matricula.Aluno?.name || 'Desconhecido',
            curso_nome: matricula.Curso?.name || 'Desconhecido'
        }));

        res.json(matriculasFormatadas);
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao buscar matrículas',
            campo: 'geral',
            mensagem: 'Não foi possível carregar as matrículas'
        });
    }
});

// Criar matrícula
router.post('/', [
    body('curso_id')
        .notEmpty()
        .withMessage('Curso é obrigatório')
        .isInt()
        .withMessage('ID do curso deve ser um número válido'),
    body('aluno_id')
        .notEmpty()
        .withMessage('Aluno é obrigatório')
        .isInt()
        .withMessage('ID do aluno deve ser um número válido')
], validateRequest, async (req: Request, res: Response) => {
    try {
        const { curso_id, aluno_id } = req.body;

        // Verificar se o aluno existe
        const aluno = await Aluno.findByPk(aluno_id);
        if (!aluno) {
            return res.status(400).json({
                error: 'Aluno não encontrado',
                campo: 'aluno_id',
                mensagem: 'O aluno selecionado não existe'
            });
        }

        // Verificar se o curso existe
        const curso = await Curso.findByPk(curso_id);
        if (!curso) {
            return res.status(400).json({
                error: 'Curso não encontrado',
                campo: 'curso_id',
                mensagem: 'O curso selecionado não existe'
            });
        }

        // Verificar se a matrícula já existe
        const matriculaExistente = await Matricula.findOne({
            where: {
                curso_id,
                aluno_id
            }
        });

        if (matriculaExistente) {
            return res.status(400).json({
                error: 'Matrícula já existe',
                campo: 'geral',
                mensagem: 'Este aluno já está matriculado neste curso'
            });
        }

        // Criar a matrícula
        const matricula = await Matricula.create({
            curso_id,
            aluno_id,
            data_matricula: new Date()
        });

        // Buscar a matrícula criada com os dados do aluno e curso
        const matriculaCompleta = await Matricula.findByPk(matricula.id, {
            include: [
                {
                    model: Aluno,
                    attributes: ['name']
                },
                {
                    model: Curso,
                    attributes: ['name']
                }
            ]
        });

        // Formatar resposta
        const response = {
            id: matriculaCompleta?.id,
            curso_id: matriculaCompleta?.curso_id,
            aluno_id: matriculaCompleta?.aluno_id,
            data_matricula: matriculaCompleta?.data_matricula,
            aluno_nome: matriculaCompleta?.Aluno?.name || 'Desconhecido',
            curso_nome: matriculaCompleta?.Curso?.name || 'Desconhecido'
        };

        res.status(201).json(response);
    } catch (error) {
        console.error('Erro ao criar matrícula:', error);
        res.status(400).json({
            error: 'Erro ao criar matrícula',
            campo: 'geral',
            mensagem: 'Não foi possível criar a matrícula'
        });
    }
});

// Deletar matrícula
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const matricula = await Matricula.findByPk(req.params.id);
        if (!matricula) {
            return res.status(404).json({
                error: 'Matrícula não encontrada',
                campo: 'geral',
                mensagem: 'Matrícula não encontrada'
            });
        }

        await matricula.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            error: 'Erro ao deletar matrícula',
            campo: 'geral',
            mensagem: 'Não foi possível cancelar a matrícula'
        });
    }
});

export default router;