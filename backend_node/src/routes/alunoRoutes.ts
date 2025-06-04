import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import Aluno from '../models/Aluno';
import { validateRequest } from '../middleware/validator';
import Matricula from '../models/Matricula';
import Curso from '../models/Curso';

const router = Router();

// Listar todos os alunos
router.get('/', async (req: Request, res: Response) => {
    try {
        const alunos = await Aluno.findAll();
        res.json(alunos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar alunos' });
    }
});

// Criar aluno(s)
router.post('/',
    [
        body('name').isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres'),
        body('email').isEmail().withMessage('Email inválido'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const data = req.body;

            // Verificar email duplicado
            const emailExistente = await Aluno.findOne({
                where: { email: data.email }
            });

            if (emailExistente) {
                return res.status(400).json({
                    error: 'Email já cadastrado',
                    campo: 'email',
                    mensagem: `Email ${data.email} já está em uso`
                });
            }

            const aluno = await Aluno.create(data);
            res.status(201).json(aluno);
        } catch (error) {
            console.error('Erro ao criar aluno:', error);
            res.status(400).json({
                error: 'Erro ao criar aluno',
                campo: 'geral',
                mensagem: 'Erro ao criar aluno'
            });
        }
    }
);

// Obter aluno por ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const aluno = await Aluno.findByPk(req.params.id);
        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }
        res.json(aluno);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar aluno' });
    }
});

// Atualizar aluno
router.put('/:id',
    [
        body('name').optional().isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres'),
        body('email').optional().isEmail().withMessage('Email inválido'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const aluno = await Aluno.findByPk(req.params.id);
            if (!aluno) {
                return res.status(404).json({ error: 'Aluno não encontrado' });
            }

            const data = req.body;
            if ('alunos' in data) {
                const alunoData = data.alunos[0];
                await aluno.update(alunoData);
            } else {
                await aluno.update(data);
            }

            res.json(aluno);
        } catch (error) {
            res.status(400).json({ error: 'Erro ao atualizar aluno' });
        }
    }
);

// Deletar aluno
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const aluno = await Aluno.findByPk(req.params.id);
        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }
        await aluno.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar aluno' });
    }
});

// Listar cursos do aluno
router.get('/:id/cursos', async (req: Request, res: Response) => {
    try {
        const aluno = await Aluno.findByPk(req.params.id, {
            include: [{
                model: Matricula,
                include: [Curso]
            }]
        });

        if (!aluno) {
            return res.status(404).json({ error: 'Aluno não encontrado' });
        }

        const cursos = aluno.matriculas.map((matricula: { curso: any; }) => matricula.curso);
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cursos do aluno' });
    }
});

export default router;