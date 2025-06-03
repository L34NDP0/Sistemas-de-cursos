import { Model, DataTypes } from 'sequelize';
import sequelize from './index';

class Aluno extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public data_criacao!: Date;
    public data_atualizacao!: Date;
    matriculas: any;

    static validateEmail(email: string): boolean {
        const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
        return emailRegex.test(email);
    }
}

Aluno.init(
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
        email: {
            type: DataTypes.STRING(120),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
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
        modelName: 'Aluno',
        timestamps: true,
        createdAt: 'data_criacao',
        updatedAt: 'data_atualizacao',
    }
);

export default Aluno;