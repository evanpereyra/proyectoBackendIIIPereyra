import Users from "../dao/Users.dao.js";
import Pet from "../dao/Pets.dao.js";
import Adoption from "../dao/Adoption.js";

import UserRepository from "../repository/UserRepository.js";
import PetRepository from "../repository/PetRepository.js";
import AdoptionRepository from "../repository/AdoptionRepository.js";

export let usersService = new UserRepository(new Users());
export let petsService = new PetRepository(new Pet());
export let adoptionsService = new AdoptionRepository(new Adoption());

// Permite reemplazar servicios en tests (sin MongoDB).
export const setServices = (overrides = {}) => {
    if (overrides.usersService) usersService = overrides.usersService;
    if (overrides.petsService) petsService = overrides.petsService;
    if (overrides.adoptionsService) adoptionsService = overrides.adoptionsService;
};
