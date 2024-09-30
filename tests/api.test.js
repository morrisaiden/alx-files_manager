const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from here
const { FileModel } = require('../models/File'); // Your Mongoose model
const { UserModel } = require('../models/User'); // Your User model

describe('API Endpoints', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Create a test user and get a token
    const user = new UserModel({ username: 'test_user', password: 'password123' });
    await user.save();
    userId = user._id;

    const response = await request(app)
      .post('/users')
      .send({ username: 'test_user', password: 'password123' });
    
    token = response.body.token; // Store the token for authentication
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
    await FileModel.deleteMany({});
  });

  test('GET /status', async () => {
    const response = await request(app).get('/status');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'OK' });
  });

  test('GET /stats', async () => {
    const response = await request(app).get('/stats');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('users');
    expect(response.body).toHaveProperty('files');
  });

  test('POST /users', async () => {
    const response = await request(app)
      .post('/users')
      .send({ username: 'new_user', password: 'new_password' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  test('GET /connect', async () => {
    const response = await request(app)
      .get('/connect')
      .set('Authorization', `Basic ${Buffer.from('test_user:password123').toString('base64')}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('GET /disconnect', async () => {
    const response = await request(app)
      .get('/disconnect')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Disconnected');
  });

  test('GET /users/me', async () => {
    const response = await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'test_user');
  });

  test('POST /files', async () => {
    const response = await request(app)
      .post('/files')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'image.png',
        type: 'image',
        data: Buffer.from('test_image_data').toString('base64'),
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  test('GET /files/:id', async () => {
    const file = await FileModel.findOne({ userId });
    const response = await request(app).get(`/files/${file._id}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', file._id.toString());
  });

  test('GET /files (pagination)', async () => {
    const response = await request(app).get('/files?page=1&limit=10');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('files');
    expect(response.body).toHaveProperty('total');
  });

  test('PUT /files/:id/publish', async () => {
    const file = await FileModel.findOne({ userId });
    const response = await request(app)
      .put(`/files/${file._id}/publish`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('isPublic', true);
  });

  test('PUT /files/:id/unpublish', async () => {
    const file = await FileModel.findOne({ userId });
    const response = await request(app)
      .put(`/files/${file._id}/unpublish`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('isPublic', false);
  });

  test('GET /files/:id/data', async () => {
    const file = await FileModel.findOne({ userId });
    const response = await request(app).get(`/files/${file._id}/data`);
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('image/png');
  });
});
