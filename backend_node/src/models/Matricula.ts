import { Model, DataTypes } from 'sequelize';
import sequelize from './index';
import Curso from './Curso';
import Aluno from './Aluno';

class Matricula extends Model {
    public id!: number;
    public curso_id!: number;
    public aluno_id!: number;
    public data_matricula!: Date;
}

Matricula.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        curso_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Curso,
                key: 'id',
            },
        },
        aluno_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Aluno,
                key: 'id',
            },
        },
        data_matricula: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'Matricula',
        timestamps: false,
    }
);

// Definindo as relações
Curso.hasMany(Matricula, { foreignKey: 'curso_id' });
Matricula.belongsTo(Curso, { foreignKey: 'curso_id' });
Aluno.hasMany(Matricula, { foreignKey: 'aluno_id' });
Matricula.belongsTo(Aluno, { foreignKey: 'aluno_id' });

export default Matricula;