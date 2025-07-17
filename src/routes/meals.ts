import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import z from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex('meals')
        .where('user_id', request.user?.id)
        .select('*')

      return reply.status(200).send(meals)
    },
  )

  app.get(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = getMealParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where('id', mealId)
        .where('user_id', request.user?.id)
        .first()

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found' })
      }
      return reply.status(200).send(meal)
    },
  )

  app.get(
    '/metrics',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const totalMeals = await knex('meals')
        .where('user_id', request.user?.id)
        .select('*')

      const totalDietMeals = await knex('meals')
        .where({ user_id: request.user?.id, is_diet: true })
        .count('id', { as: 'count' })
        .first()

      const totalNotDietMeals = await knex('meals')
        .where({ user_id: request.user?.id, is_diet: false })
        .count('id', { as: 'count' })
        .first()

      const { bestDiet: bestSequence } = totalMeals.reduce(
        (acc, meal) => {
          if (meal.is_diet) {
            acc.count += 1
          } else {
            acc.count = 0
          }

          if (acc.count > acc.bestDiet) {
            acc.bestDiet = acc.count
          }
          return acc
        },
        { count: 0, bestDiet: 0 },
      )

      return reply.status(200).send({
        totalMeals: totalMeals.length,
        totalDietMeals: totalDietMeals?.count || 0,
        totalNotDietMeals: totalNotDietMeals?.count || 0,
        bestSequence,
      })
    },
  )

  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        title: z.string(),
        description: z.string().optional(),
        isDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { title, description, isDiet, date } = createMealBodySchema.parse(
        request.body,
      )

      await knex('meals').insert({
        id: randomUUID(),
        user_id: request.user?.id,
        title,
        description,
        is_diet: isDiet,
        date: date.getTime(),
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const updateMealParamsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const updateMealBodySchema = z.object({
        title: z.string(),
        description: z.string().optional(),
        isDiet: z.boolean(),
        date: z.coerce.date(),
      })

      const { mealId } = updateMealParamsSchema.parse(request.params)

      const { title, description, isDiet, date } = updateMealBodySchema.parse(
        request.body,
      )

      const meal = await knex('meals')
        .where({ id: mealId, user_id: request.user?.id })
        .first()

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found' })
      }

      await knex('meals').where('id', mealId).update({
        title,
        description,
        is_diet: isDiet,
        date: date.getTime(),
      })

      return reply.status(204).send()
    },
  )

  app.delete(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const deleteMealParamsSchema = z.object({
        mealId: z.string().uuid(),
      })

      const { mealId } = deleteMealParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where({ id: mealId, user_id: request.user?.id })
        .first()

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found' })
      }

      await knex('meals').where('id', mealId).delete()

      return reply.status(204).send()
    },
  )
}
