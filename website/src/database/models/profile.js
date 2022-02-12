module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define(
        'Profile',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            userId: {
                type: DataTypes.UUID,
            },
            isParent: {
                type: DataTypes.BOOLEAN,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            avatar: {
                type: DataTypes.STRING,
            },
            gradeId: {
                type: DataTypes.INTEGER,
            },
        },
        {
            timestamps: false,
        }
    );

    Profile.associate = (models) => {
        Profile.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId',
        });
        Profile.belongsTo(models.Grade, {
            as: 'grade',
            foreignKey: 'gradeId',
        });
        Profile.hasMany(models.PageComment, {
            as: 'pageComments',
            foreignKey: 'profileId',
        });
    };

    return Profile;
};
