import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const categories = await prisma.category.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      })

      res.status(200).json({ categories })
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else if (req.method === 'POST') {
    const session = await getSession()

    if (!session.isLoggedIn || !session.userId) {
      return res.status(401).json({ message: 'Non authentifié' })
    }

    try {
      const { name, description, image } = req.body

      const category = await prisma.category.create({
        data: {
          name,
          description,
          image,
        }
      })

      res.status(201).json({ category })
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}