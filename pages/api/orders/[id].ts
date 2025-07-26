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
      const order = await prisma.order.findFirst({
        where: {
          id: id as string,
          userId: session.userId
        },
        include: {
          customer: true,
          orderItems: {
            include: {
              dish: true,
            }
          },
          payment: true,
        }
      })

      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' })
      }

      res.status(200).json({ order })
    } catch (error) {
      console.error('Erreur lors de la récupération de la commande:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { status, deliveryTime, notes } = req.body

      const order = await prisma.order.updateMany({
        where: {
          id: id as string,
          userId: session.userId
        },
        data: {
          status: status as any,
          deliveryTime: deliveryTime ? new Date(deliveryTime) : undefined,
          notes,
        }
      })

      if (order.count === 0) {
        return res.status(404).json({ message: 'Commande non trouvée' })
      }

      const updatedOrder = await prisma.order.findUnique({
        where: { id: id as string },
        include: {
          customer: true,
          orderItems: {
            include: {
              dish: true,
            }
          },
          payment: true,
        }
      })

      res.status(200).json({ order: updatedOrder })
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la commande:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}