import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

class Curso extends Model {
    public id!: number;
    public name!: string;
    public descricao!: string;
    public duracao!: number;
    public categoria!: string;
    public data_criacao!: Date;
    public data_atualizacao!: Date;
}

Curso.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        duracao: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        categoria: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        data_criacao: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        data_atualizacao: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'Curso',
        timestamps: true,
        createdAt: 'data_criacao',
        updatedAt: 'data_atualizacao',
    }
);

export default Curso;