import { expect } from 'chai';
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import adoptionsRouter from '../src/routes/adoption.router.js';
import { setServices } from '../src/services/index.js';

describe('Functional - Adoption router', function () {
  let app;

  before(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/adoptions', adoptionsRouter);
  });

  const store = {
    users: new Map(),
    pets: new Map(),
    adoptions: new Map()
  };

  const createId = () => new mongoose.Types.ObjectId().toString();

  const resetStore = () => {
    store.users.clear();
    store.pets.clear();
    store.adoptions.clear();
  };

  beforeEach(() => {
    resetStore();

    setServices({
      usersService: {
        getAll: async () => Array.from(store.users.values()),
        getUserById: async (id) => store.users.get(id) ?? null,
        update: async (id, doc) => {
          const current = store.users.get(id);
          if (!current) return null;
          const next = { ...current, ...doc };
          store.users.set(id, next);
          return next;
        }
      },
      petsService: {
        getBy: async ({ _id }) => store.pets.get(_id) ?? null,
        update: async (id, doc) => {
          const current = store.pets.get(id);
          if (!current) return null;
          const next = { ...current, ...doc };
          store.pets.set(id, next);
          return next;
        }
      },
      adoptionsService: {
        getAll: async () => Array.from(store.adoptions.values()),
        getBy: async ({ _id }) => store.adoptions.get(_id) ?? null,
        create: async (doc) => {
          const _id = createId();
          const adoption = { _id, ...doc };
          store.adoptions.set(_id, adoption);
          return adoption;
        }
      }
    });
  });

  it('GET /api/adoptions should return empty array initially', async () => {
    const res = await request(app).get('/api/adoptions');

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('payload');
    expect(res.body.payload).to.be.an('array');
    expect(res.body.payload).to.have.length(0);
  });

  it('GET /api/adoptions/:aid should return 404 for non-existing adoption', async () => {
    const nonExistingId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/adoptions/${nonExistingId}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({ status: 'error', error: 'Adoption not found' });
  });

  it('GET /api/adoptions/:aid should return adoption when it exists', async () => {
    const uid = createId();
    const pid = createId();
    const aid = createId();

    store.users.set(uid, {
      _id: uid,
      first_name: 'Test',
      last_name: 'User',
      email: 'test.user@mail.com',
      password: 'hashed',
      role: 'user',
      pets: []
    });

    store.pets.set(pid, {
      _id: pid,
      name: 'Firulais',
      specie: 'dog',
      adopted: true,
      owner: uid
    });

    store.adoptions.set(aid, { _id: aid, owner: uid, pet: pid });

    const res = await request(app).get(`/api/adoptions/${aid}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('status', 'success');
    expect(res.body).to.have.property('payload');
    expect(res.body.payload).to.have.property('_id');
  });

  it('POST /api/adoptions/:uid/:pid should return 404 when user does not exist', async () => {
    const uid = new mongoose.Types.ObjectId().toString();
    const pid = new mongoose.Types.ObjectId().toString();

    const res = await request(app).post(`/api/adoptions/${uid}/${pid}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({ status: 'error', error: 'user Not found' });
  });

  it('POST /api/adoptions/:uid/:pid should return 404 when pet does not exist', async () => {
    const uid = createId();
    store.users.set(uid, {
      _id: uid,
      first_name: 'Test',
      last_name: 'User',
      email: 'test2.user@mail.com',
      password: 'hashed',
      role: 'user',
      pets: []
    });

    const pid = new mongoose.Types.ObjectId().toString();
    const res = await request(app).post(`/api/adoptions/${uid}/${pid}`);

    expect(res.status).to.equal(404);
    expect(res.body).to.deep.equal({ status: 'error', error: 'Pet not found' });
  });

  it('POST /api/adoptions/:uid/:pid should return 400 when pet is already adopted', async () => {
    const uid = createId();
    store.users.set(uid, {
      _id: uid,
      first_name: 'Test',
      last_name: 'User',
      email: 'test3.user@mail.com',
      password: 'hashed',
      role: 'user',
      pets: []
    });

    const pid = createId();
    store.pets.set(pid, {
      _id: pid,
      name: 'Michi',
      specie: 'cat',
      adopted: true,
      owner: uid
    });

    const res = await request(app).post(`/api/adoptions/${uid}/${pid}`);

    expect(res.status).to.equal(400);
    expect(res.body).to.deep.equal({ status: 'error', error: 'Pet is already adopted' });
  });

  it('POST /api/adoptions/:uid/:pid should adopt pet, update user/pet, and create adoption', async () => {
    const uid = createId();
    store.users.set(uid, {
      _id: uid,
      first_name: 'Adopt',
      last_name: 'Me',
      email: 'adopt.me@mail.com',
      password: 'hashed',
      role: 'user',
      pets: []
    });

    const pid = createId();
    store.pets.set(pid, {
      _id: pid,
      name: 'Cody',
      specie: 'dog',
      adopted: false
    });

    const res = await request(app).post(`/api/adoptions/${uid}/${pid}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.deep.equal({ status: 'success', message: 'Pet adopted' });

    const updatedPet = store.pets.get(pid);
    expect(updatedPet.adopted).to.equal(true);
    expect(updatedPet.owner).to.equal(uid);

    const updatedUser = store.users.get(uid);
    const petIds = updatedUser.pets.map(p => (typeof p === 'string' ? p : p?._id));
    expect(petIds).to.include(pid);

    const adoptions = Array.from(store.adoptions.values());
    const adoption = adoptions.find(a => a.owner === uid && a.pet === pid);
    expect(adoption).to.exist;
  });
});

