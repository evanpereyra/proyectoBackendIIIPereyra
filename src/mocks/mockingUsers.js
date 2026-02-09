import mongoose from 'mongoose';
import { createHash } from '../utils/index.js';

const FIRST_NAMES = ['Juan', 'María', 'Carlos', 'Ana', 'Pedro', 'Laura', 'Diego', 'Sofía', 'Luis', 'Valentina', 'Miguel', 'Isabella', 'José', 'Camila', 'Antonio', 'Lucía'];
const LAST_NAMES = ['García', 'Rodríguez', 'Martínez', 'López', 'González', 'Hernández', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Reyes', 'Morales'];

const ROLES = ['user', 'admin'];

let cachedEncryptedPassword = null;
const getEncryptedPassword = async () => {
    if (!cachedEncryptedPassword) {
        cachedEncryptedPassword = await createHash('coder123');
    }
    return cachedEncryptedPassword;
};

export const generateMockingUsers = async (quantity) => {
    const encryptedPassword = await getEncryptedPassword();
    const users = [];
    const usedEmails = new Set();

    for (let i = 0; i < quantity; i++) {
        const first_name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const last_name = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        let email = `${first_name.toLowerCase()}.${last_name.toLowerCase()}${i}@mock.com`;
        while (usedEmails.has(email)) {
            email = `${first_name.toLowerCase()}.${last_name.toLowerCase()}${i}_${Date.now()}@mock.com`;
        }
        usedEmails.add(email);

        const role = ROLES[Math.floor(Math.random() * ROLES.length)];

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
        const first_name = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const last_name = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        let email = `mockuser${i}_${Date.now()}_${Math.random().toString(36).slice(2)}@mock.com`;
        while (usedEmails.has(email)) {
            email = `mockuser${i}_${Date.now()}_${Math.random().toString(36).slice(2)}@mock.com`;
        }
        usedEmails.add(email);

        const role = ROLES[Math.floor(Math.random() * ROLES.length)];

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
