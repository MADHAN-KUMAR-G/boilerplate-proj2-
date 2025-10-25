import request from 'supertest';
import app from '../index';

describe('User API', () => {
  let createdUserId: string;

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.name).toBe(userData.name);
      expect(response.body.data).not.toHaveProperty('password');

      createdUserId = response.body.data.id;
    });

    it('should reject invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        name: 'Test User',
        password: 'password123',
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Another User',
        password: 'password123',
      };

      const response = await request(app)
        .post('/users')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /users', () => {
    it('should list users with pagination', async () => {
      const response = await request(app)
        .get('/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('meta');
      expect(response.body.data.meta).toHaveProperty('page');
      expect(response.body.data.meta).toHaveProperty('total');
    });

    it('should filter users by email', async () => {
      const response = await request(app)
        .get('/users?email=test@example.com')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.data.length).toBeGreaterThan(0);
      expect(response.body.data.data[0].email).toBe('test@example.com');
    });
  });

  describe('GET /users/:id', () => {
    it('should get a specific user', async () => {
      const response = await request(app)
        .get(`/users/${createdUserId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(createdUserId);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .get('/users/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('USER_NOT_FOUND');
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      const updateData = {
        name: 'Updated User Name',
      };

      const response = await request(app)
        .put(`/users/${createdUserId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe('test@example.com');
    });

    it('should reject invalid email format', async () => {
      const updateData = {
        email: 'invalid-email',
      };

      const response = await request(app)
        .put(`/users/${createdUserId}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const response = await request(app)
        .delete(`/users/${createdUserId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toBe('User deleted successfully');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app)
        .delete('/users/non-existent-id')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('USER_NOT_FOUND');
    });
  });
});
