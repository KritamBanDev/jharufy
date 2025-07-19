import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../src/app.js';
import User from '../src/models/User.js';
import { generateToken } from '../src/utils/auth.js';
import { connect, closeDatabase, clearDatabase } from './db.js';

describe('Authentication Flow', () => {
  let testUser;
  
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('Registration', () => {
    const validUser = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      nativeLanguage: 'english',
      learningLanguage: 'spanish'
    };

    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(validUser.email.toLowerCase());
      expect(res.body.user).not.toHaveProperty('password');
    });

    it('should not register user with existing email', async () => {
      await User.create(validUser);

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(validUser);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should validate password requirements', async () => {
      const invalidUser = { ...validUser, password: '123' };

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(invalidUser);

      expect(res.status).toBe(400);
      expect(res.body.error).toContain('password');
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      testUser = await User.create({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        nativeLanguage: 'english',
        learningLanguage: 'spanish'
      });
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user._id).toBe(testUser._id.toString());
    });

    it('should not login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });

    it('should not login with non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Password Reset', () => {
    beforeEach(async () => {
      testUser = await User.create({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        nativeLanguage: 'english',
        learningLanguage: 'spanish'
      });
    });

    it('should send password reset email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/forgot-password')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
    });

    it('should reset password with valid token', async () => {
      const token = generateToken(testUser._id);

      const res = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({
          token,
          newPassword: 'NewPassword123!'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');

      // Verify can login with new password
      const loginRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'NewPassword123!'
        });

      expect(loginRes.status).toBe(200);
    });
  });
});
