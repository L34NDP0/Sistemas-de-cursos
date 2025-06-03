import { Router, Request, Response } from 'express';
import { body, param, query } from 'express-validator';
import Curso from '../models/Curso';
import { validateRequest } from '../middleware/validator';

const router = Router();

// Listar todos os cursos
router.get('/', async (req: Request, res: Response) => {
    try {
        const cursos = await Curso.findAll();
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar cursos' });
    }
});

// Criar curso
router.post('/',
    [
        body('name').isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres'),
        body('duracao').isInt({ min: 1 }).withMessage('Duração deve ser um número positivo'),
        body('categoria').notEmpty().withMessage('Categoria é obrigatória'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        try {
            const curso = await Curso.create(req.body);
            res.status(201).json(curso);
        } catch (error) {
            res.status(400).json({ error: 'Erro ao criar curso' });
        }
    }
);

// Obter curso por ID
router.get('/:id', async (req, res) => {
    try {
        const curso = await Curso.findByPk(req.params.id);
        if (!curso) {
            return res.status(404).json({ error: 'Curso não encontrado' });
        }
        res.json(curso);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar curso' });
    }
});

// Atualizar curso
router.put('/:id', async (req, res) => {
    try {
        const curso = await Curso.findByPk(req.params.id);
        if (!curso) {
            return res.status(404).json({ error: 'Curso não encontrado' });
        }
        await curso.update(req.body);
        res.json(curso);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar curso' });
    }
});

// Deletar curso
router.delete('/:id', async (req, res) => {
    try {
        const curso = await Curso.findByPk(req.params.id);
        if (!curso) {
            return res.status(404).json({ error: 'Curso não encontrado' });
        }
        await curso.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar curso' });
    }
});

// Listar categorias
router.get('/categorias/list', (req, res) => {
    const categorias = ['Programação', 'Design', 'Marketing', 'Negócios', 'Data Science'];
    res.json(categorias);
});

// Filtrar por categoria
router.get('/categoria/:categoria', async (req, res) => {
    try {
        const cursos = await Curso.findAll({
            where: { categoria: req.params.categoria }
        });
        res.json(cursos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao filtrar cursos' });
    }
});

export default router;