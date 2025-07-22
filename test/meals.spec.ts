import { execSync } from 'child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new meal', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@mail.com' })

    const cookies = createUserResponse.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )

    if (!cookies) {
      throw new Error('No cookies found in the response')
    }

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      title: 'Breakfast',
      description: 'Eggs and toast',
      isDiet: true,
      date: new Date(),
    })
  })

  it('should be able to list all meals from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@mail.com' })

    const cookies = createUserResponse.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )

    if (!cookies) {
      throw new Error('No cookies found in the response')
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        title: 'Breakfast',
        description: 'Eggs and toast',
        isDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server).get('/meals').set('Cookie', cookies).expect(200)
  })

  it('should be able to get a specific meal by ID', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@mail.com' })

    const cookies = createUserResponse.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
    if (!cookies) {
      throw new Error('No cookies found in the response')
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        title: 'Lunch',
        description: 'Salad and chicken',
        isDiet: false,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealsResponse.body[0].id

    const getMealResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)

    expect(getMealResponse.body).toEqual(
      expect.objectContaining({
        title: 'Lunch',
        description: 'Salad and chicken',
        is_diet: 0,
        date: expect.any(Number),
      }),
    )
  })

  it('should be able to get metrics for meals', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@mail.com' })

    const cookies = createUserResponse.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
    if (!cookies) {
      throw new Error('No cookies found in the response')
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        title: 'Breakfast',
        description: 'Eggs and toast',
        isDiet: true,
        date: new Date(),
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        title: 'Lunch',
        description: 'Salad and chicken',
        isDiet: false,
        date: new Date(),
      })
      .expect(201)

    const getMetricsResponse = await request(app.server)
      .get(`/meals/metrics`)
      .set('Cookie', cookies)
      .expect(200)

    expect(getMetricsResponse.body).toEqual(
      expect.objectContaining({
        totalMeals: 2,
        totalDietMeals: 1,
        totalNotDietMeals: 1,
        bestSequence: 1,
      }),
    )
  })

  it('should be able to update a meal from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@mail.com' })

    const cookies = createUserResponse.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
    if (!cookies) {
      throw new Error('No cookies found in the response')
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        title: 'Lunch',
        description: 'Salad and chicken',
        isDiet: false,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealsResponse.body[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        title: 'Updated Lunch',
        description: 'Updated Salad and chicken',
        isDiet: true,
        date: new Date(),
      })
      .expect(204)
  })

  it('should be able to delete a meal from a user', async () => {
    const createUserResponse = await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email: 'johndoe@mail.com' })

    const cookies = createUserResponse.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('sessionId')]),
    )
    if (!cookies) {
      throw new Error('No cookies found in the response')
    }

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        title: 'Lunch',
        description: 'Salad and chicken',
        isDiet: false,
        date: new Date(),
      })
      .expect(201)

    const mealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = mealsResponse.body[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)
  })
})
