import { generateMockingPets, generatePetsForInsertion } from '../mocks/mockingPets.js';
import { generateMockingUsers, generateUsersForInsertion } from '../mocks/mockingUsers.js';
import { usersService, petsService } from '../services/index.js';

const getMocks = async (req, res) => {
    res.send({ status: "success", payload: [] });
};

const getMockingPets = async (req, res) => {
    const quantity = parseInt(req.query.quantity) || 100;
    const pets = generateMockingPets(quantity);
    res.send({ status: "success", payload: pets });
};

const getMockingUsers = async (req, res) => {
    const quantity = Math.max(1, parseInt(req.query.quantity) || 50);
    const users = await generateMockingUsers(quantity);
    res.send({ status: "success", payload: users });
};

/** GET /mockingusers: genera 50 usuarios en formato documento Mongo (_id, __v, etc.) */
const getMockingUsers50 = async (req, res) => {
    const users = await generateMockingUsers(50);
    res.send({ status: "success", payload: users });
};

const generateData = async (req, res) => {
    try {
        const { users: usersCount = 0, pets: petsCount = 0 } = req.body;
        const numUsers = Math.max(0, parseInt(usersCount) || 0);
        const numPets = Math.max(0, parseInt(petsCount) || 0);

        const insertedUsers = [];
        const insertedPets = [];

        if (numUsers > 0) {
            const usersToInsert = await generateUsersForInsertion(numUsers);
            for (const user of usersToInsert) {
                const created = await usersService.create(user);
                insertedUsers.push(created);
            }
        }

        if (numPets > 0) {
            const petsToInsert = generatePetsForInsertion(numPets);
            for (const pet of petsToInsert) {
                const created = await petsService.create(pet);
                insertedPets.push(created);
            }
        }

        res.send({
            status: "success",
            message: `Generados ${insertedUsers.length} usuarios y ${insertedPets.length} mascotas`,
            payload: {
                users: insertedUsers.length,
                pets: insertedPets.length
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "error", error: error.message });
    }
};

export default {
    getMocks,
    getMockingPets,
    getMockingUsers,
    getMockingUsers50,
    generateData
};
