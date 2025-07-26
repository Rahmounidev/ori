import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession()

  if (!session.isLoggedIn || !session.userId) {
    return res.status(401).json({ message: 'Non authentifié' })
  }

  if (req.method === 'GET') {
    try {
      const dishes = await prisma.dish.findMany({
        where: { userId: session.userId },
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' }
      })

      res.status(200).json({ dishes })
    } catch (error) {
      console.error('Erreur lors de la récupération des plats:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else if (req.method === 'POST') {
    try {
      const {
        name,
        description,
        price,
        image,
        categoryId,
        preparationTime,
        ingredients,
        allergens,
        calories,
        isVegetarian,
        isVegan,
        isGlutenFree
      } = req.body

      const dish = await prisma.dish.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          image,
          categoryId,
          userId: session.userId,
          preparationTime: preparationTime ? parseInt(preparationTime) : null,
          ingredients,
          allergens,
          calories: calories ? parseInt(calories) : null,
          isVegetarian: Boolean(isVegetarian),
          isVegan: Boolean(isVegan),
          isGlutenFree: Boolean(isGlutenFree),
        },
        include: {
          category: true,
        }
      })

      res.status(201).json({ dish })
    } catch (error) {
      console.error('Erreur lors de la création du plat:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}