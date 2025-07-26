import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession()
  const { id } = req.query

  if (!session.isLoggedIn || !session.userId) {
    return res.status(401).json({ message: 'Non authentifié' })
  }

  if (req.method === 'GET') {
    try {
      const dish = await prisma.dish.findFirst({
        where: {
          id: id as string,
          userId: session.userId
        },
        include: {
          category: true,
        }
      })

      if (!dish) {
        return res.status(404).json({ message: 'Plat non trouvé' })
      }

      res.status(200).json({ dish })
    } catch (error) {
      console.error('Erreur lors de la récupération du plat:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else if (req.method === 'PUT') {
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
        isGlutenFree,
        isAvailable
      } = req.body

      const dish = await prisma.dish.updateMany({
        where: {
          id: id as string,
          userId: session.userId
        },
        data: {
          name,
          description,
          price: parseFloat(price),
          image,
          categoryId,
          preparationTime: preparationTime ? parseInt(preparationTime) : null,
          ingredients,
          allergens,
          calories: calories ? parseInt(calories) : null,
          isVegetarian: Boolean(isVegetarian),
          isVegan: Boolean(isVegan),
          isGlutenFree: Boolean(isGlutenFree),
          isAvailable: Boolean(isAvailable),
        }
      })

      if (dish.count === 0) {
        return res.status(404).json({ message: 'Plat non trouvé' })
      }

      const updatedDish = await prisma.dish.findUnique({
        where: { id: id as string },
        include: { category: true }
      })

      res.status(200).json({ dish: updatedDish })
    } catch (error) {
      console.error('Erreur lors de la mise à jour du plat:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const dish = await prisma.dish.deleteMany({
        where: {
          id: id as string,
          userId: session.userId
        }
      })

      if (dish.count === 0) {
        return res.status(404).json({ message: 'Plat non trouvé' })
      }

      res.status(200).json({ message: 'Plat supprimé avec succès' })
    } catch (error) {
      console.error('Erreur lors de la suppression du plat:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}