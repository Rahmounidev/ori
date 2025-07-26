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
      const reviews = await prisma.review.findMany({
        where: { userId: session.userId },
        include: {
          customer: true,
        },
        orderBy: { createdAt: 'desc' }
      })

      res.status(200).json({ reviews })
    } catch (error) {
      console.error('Erreur lors de la récupération des avis:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else if (req.method === 'POST') {
    try {
      const { customerId, rating, comment } = req.body

      const review = await prisma.review.create({
        data: {
          customerId,
          userId: session.userId,
          rating: parseInt(rating),
          comment,
        },
        include: {
          customer: true,
        }
      })

      res.status(201).json({ review })
    } catch (error) {
      console.error('Erreur lors de la création de l\'avis:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}