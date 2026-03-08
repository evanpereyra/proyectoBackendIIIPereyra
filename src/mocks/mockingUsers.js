import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import { createHash } from '../utils/index.js';

const ROLES = ['user', 'admin'];

let cachedEncryptedPassword = null;
const getEncryptedPassword = async () => {
    if (!cachedEncryptedPassword) {
        cachedEncryptedPassword = await createHash('coder123');
    }
    return cachedEncryptedPassword;
};

/**
 * Genera usuarios mock según la cantidad indicada.
 * - password: "coder123" encriptada
 * - role: "user" o "admin"
 * - pets: array vacío
 * @param {number} quantity - Cantidad de usuarios a generar
 * @returns {Promise<Array>} Array de usuarios mock
 */
export const generateMockingUsers = async (quantity) => {
    const encryptedPassword = await getEncryptedPassword();
    const users = [];
    const usedEmails = new Set();

    for (let i = 0; i < quantity; i++) {
        const first_name = faker.person.firstName();
        const last_name = faker.person.lastName();
        let email = faker.internet.email({ firstName: first_name, lastName: last_name }).toLowerCase();
        while (usedEmails.has(email)) {
            email = faker.internet.email({ firstName: first_name, lastName: last_name, provider: `mock${i}.com` }).toLowerCase();
        }
        usedEmails.add(email);

        const role = faker.helpers.arrayElement(ROLES);

        users.push({
            _id: new mongoose.Types.ObjectId(),
            first_name,
            last_name,
            email,
            password: encryptedPassword,
            role,
            pets: [],
            __v: 0
        });
    }
    return users;
};

export const generateUsersForInsertion = async (quantity) => {
    const encryptedPassword = await getEncryptedPassword();
    const users = [];
    const usedEmails = new Set();

    for (let i = 0; i < quantity; i++) {
        const first_name = faker.person.firstName();
        const last_name = faker.person.lastName();
        let email = faker.internet.email({ firstName: first_name, lastName: last_name }).toLowerCase();
        while (usedEmails.has(email)) {
            email = faker.internet.email({ firstName: first_name, lastName: last_name, provider: `mock${i}.com` }).toLowerCase();
        }
        usedEmails.add(email);

        const role = faker.helpers.arrayElement(ROLES);

        users.push({
            first_name,
            last_name,
            email,
            password: encryptedPassword,
            role,
            pets: []
        });
    }
    return users;
};
