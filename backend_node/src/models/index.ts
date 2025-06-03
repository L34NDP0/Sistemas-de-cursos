import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    dialect: 'sqlite' as Dialect,
    storage: './database.sqlite',
    define: {
        timestamps: true,
        underscored: true,
    },
    logging: false
};

const sequelize = new Sequelize(config);

export default sequelize;