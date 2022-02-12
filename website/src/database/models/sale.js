module.exports = (sequelize, DataTypes) => {
    const Sale = sequelize.define(
        'Sale',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            bought: {
                type: DataTypes.BOOLEAN,
            },
            createdAt: {
                type: DataTypes.DATE,
            },
            updatedAt: {
                type: DataTypes.DATE,
            },
        },
        {
            timestamps: true,
        }
    );

    Sale.associate = (models) => {
        Sale.hasMany(models.ClassSale, {
            as: 'classesSales',
            foreignKey: 'classId',
        });
        Sale.belongsTo(models.User, {
            as: 'users',
            foreignKey: 'userId',
        });
    };

    return Sale;
};
