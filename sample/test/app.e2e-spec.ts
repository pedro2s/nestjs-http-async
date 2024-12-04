import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/todos (GET)', () => {
    return request(app.getHttpServer()).get('/todos/1').expect(200).expect({
      userId: 1,
      id: 1,
      title: 'delectus aut autem',
      completed: false,
    });
  });

  it('/todos (POST)', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({
        userId: 1,
        title: 'delectus aut autem',
        completed: false,
      })
      .expect(201)
      .expect({
        userId: 1,
        id: 201,
        title: 'delectus aut autem',
        completed: false,
      });
  });
});
