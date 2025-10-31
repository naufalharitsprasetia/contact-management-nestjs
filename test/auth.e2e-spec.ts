/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('Authentication Test with JWT', () => {
  let app: INestApplication;
  let testService: TestService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    testService = app.get(TestService);
    // pastikan database bersih sebelum semua test
    await testService.deleteUser();
    // create user once for login test and protected tests
    await testService.createUser();
  });

  afterAll(async () => {
    // bersihkan dan tutup app
    await testService.deleteUser();
    await app.close();
  });

  it('1) POST /api/users - register a new user', async () => {
    // supaya tidak duplikat user, gunakan email/username unik
    const res = await request(app.getHttpServer())
      .post('/api/users')
      .send({
        username: 'test-register',
        password: 'test',
        name: 'Test Register',
      })
      .expect(200);

    expect(res.body.data.username).toBe('test-register');
    expect(res.body.data.name).toBe('Test Register');

    await testService.deleteUserByUsername('test-register');
  });

  it('2) POST /api/users/login - should login and return JWT token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/users/login')
      .send({
        username: 'test',
        password: 'test',
      })
      .expect(200);

    expect(res.body.data.username).toBe('test');
    expect(res.body.data.name).toBe('test');
    expect(res.body.data).toHaveProperty('token');

    token = res.body.data.token;
    expect(typeof token).toBe('string');
  });

  it('3) GET /api/users/current - should get current user using JWT token', async () => {
    if (!token) {
      throw new Error('Token not set from login test');
    }

    const res = await request(app.getHttpServer())
      .get('/api/users/current')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.data.username).toBe('test');
    expect(res.body.data.name).toBe('test');
  });
});
