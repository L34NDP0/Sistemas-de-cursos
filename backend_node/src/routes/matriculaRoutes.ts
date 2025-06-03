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
            include: [Aluno, Curso]
        });
        res.json(matriculas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar matrículas' });
    }
});

// Criar matrícula(s)
router.post('/',
    [
        body('*.curso_id').isInt().withMessage('ID do curso inválido'),
        body('*.aluno_id').isInt().withMessage('ID do aluno inválido'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const data = req.body;

            if ('matriculas' in data) {
                // Processar múltiplas matrículas
                const matriculasCriadas = [];
                for (const matriculaData of data.matriculas) {
                    // Verificar se a matrícula já existe
                    const matriculaExistente = await Matricula.findOne({
                        where: {
                            curso_id: matriculaData.curso_id,
                            aluno_id: matriculaData.aluno_id
                        }
                    });

                    if (matriculaExistente) {
                        return res.status(400).json({
                            error: `Matrícula já existe para o aluno ${matriculaData.aluno_id} no curso ${matriculaData.curso_id}`
                        });
                    }

                    const matricula = await Matricula.create(matriculaData);
                    matriculasCriadas.push(matricula);
                }
                res.status(201).json(matriculasCriadas);
            } else {
                // Processar uma única matrícula
                const matriculaExistente = await Matricula.findOne({
                    where: {
                        curso_id: data.curso_id,
                        aluno_id: data.aluno_id
                    }
                });

                if (matriculaExistente) {
                    return res.status(400).json({
                        error: `Matrícula já existe para o aluno ${data.aluno_id} no curso ${data.curso_id}`
                    });
                }

                const matricula = await Matricula.create(data);
                res.status(201).json(matricula);
            }
        } catch (error) {
            res.status(400).json({ error: 'Erro ao criar matrícula' });
        }
    }
);

// Deletar matrícula
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const matricula = await Matricula.findByPk(req.params.id);
        if (!matricula) {
            return res.status(404).json({ error: 'Matrícula não encontrada' });
        }
        await matricula.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar matrícula' });
    }
});

export default router;