import mongoose from 'mongoose';

const PET_NAMES = ['Max', 'Luna', 'Rocky', 'Bella', 'Charlie', 'Daisy', 'Cooper', 'Sadie', 'Buddy', 'Molly', 'Teddy', 'Lucy', 'Bear', 'Zoey', 'Duke', 'Lola'];
const SPECIES = ['Perro', 'Gato', 'Conejo', 'Hamster', 'Pájaro', 'Tortuga', 'Pez'];

const generateRandomDate = () => {
    const start = new Date(2015, 0, 1);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const generateMockingPets = (quantity = 100) => {
    const pets = [];
    for (let i = 0; i < quantity; i++) {
        const name = PET_NAMES[Math.floor(Math.random() * PET_NAMES.length)] + (i + 1);
        const specie = SPECIES[Math.floor(Math.random() * SPECIES.length)];
        pets.push({
            _id: new mongoose.Types.ObjectId(),
            name,
            specie,
            birthDate: generateRandomDate(),
            adopted: Math.random() > 0.7,
            owner: null,
            image: null,
            __v: 0
        });
    }
    return pets;
};

export const generatePetsForInsertion = (quantity) => {
    const pets = [];
    for (let i = 0; i < quantity; i++) {
        const name = PET_NAMES[Math.floor(Math.random() * PET_NAMES.length)] + (i + 1) + '_' + Date.now();
        const specie = SPECIES[Math.floor(Math.random() * SPECIES.length)];
        pets.push({
            name,
            specie,
            birthDate: generateRandomDate(),
            adopted: false,
            owner: null,
            image: null
        });
    }
    return pets;
};
