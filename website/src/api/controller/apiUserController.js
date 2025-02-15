const { User, Profile, Teacher } = require('../../database/models');
const Users = require('../../services/Users');

function flattenObject(ob) {
    const toReturn = {};

    for (let i in ob) {
        if (!ob.hasOwnProperty(i)) continue;

        if (typeof ob[i] == 'object' && ob[i] !== null) {
            const flatObject = flattenObject(ob[i]);
            for (let x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) continue;

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = ob[i];
        }
    }
    return toReturn;
}

module.exports = {
    allUsers: async (req, res) => {
        const users = await User.findAll({
            raw: true,
            nest: true,
            include: [{ association: 'profiles' }],
        });
        const mappedUsers = users.map((user) => {
            return {
                id: user.id,
                name: user.profiles.name,
                email: user.email,
                isParent: user.profiles.isParent,
                avatar: user.profiles.avatar,
                detail: `/api/users/${user.profiles.id}`,
            };
        });
        const jsonUsers = {
            count: users.length,
            users: mappedUsers,
        };

        res.json(jsonUsers);
    },
    count: async (req, res) => {
        const count = await User.count();
        res.json({
            status: 200,
            title: 'usuarios',
            count,
        });
    },
    flattenedList: async (req, res) => {
        const usersRaw = await User.findAll({
            raw: true,
            nest: true,
            include: [
                {
                    model: Profile,
                    as: 'profiles',
                    include: [{ association: 'grade' }],
                },
            ],
        });
        // const flattenedUsers = users.map((user) => flattenObject(user));
        const users = usersRaw.map((user) => {
            return {
                id: user.id,
                Nombre: user.profiles.name,
                'Correo Electrónico': user.email,
                Rol: user.profiles.isParent == 1 ? 'Padre' : 'Hijo',
                Grado: user.profiles.grade.id,
                Registro: user.createdAt,
            };
        });

        // flattenedUsers.forEach((user) => delete user.pass);
        res.json({
            meta: {
                status: 200,
                total: users.length,
                url: '/api/users/flattened',
            },
            data: users,
        });
    },
    selProfile: async (req, res) => {
        const id = req.params.id;
        const profile = await Users.findOneProfile(id);
        res.json(profile);
    },
    currUser: async (req, res) => {
        const users = await Users.findCurrentProfiles(req);
        res.json(users);
    },
    findByEmail: async (req, res) => {
        const user = await Users.findByEmail(req.query.email);
        res.json(user);
    },
};
