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
      // Statistiques générales
      const totalOrders = await prisma.order.count({
        where: { userId: session.userId }
      })

      const totalRevenue = await prisma.order.aggregate({
        where: {
          userId: session.userId,
          status: 'DELIVERED'
        },
        _sum: {
          totalAmount: true
        }
      })

      const totalCustomers = await prisma.customer.count({
        where: { userId: session.userId }
      })

      const totalDishes = await prisma.dish.count({
        where: { userId: session.userId }
      })

      // Commandes récentes
      const recentOrders = await prisma.order.findMany({
        where: { userId: session.userId },
        include: {
          customer: true,
          orderItems: {
            include: {
              dish: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })

      // Plats populaires
      const popularDishes = await prisma.orderItem.groupBy({
        by: ['dishId'],
        where: {
          order: {
            userId: session.userId
          }
        },
        _sum: {
          quantity: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      })

      const dishesWithDetails = await Promise.all(
        popularDishes.map(async (item) => {
          const dish = await prisma.dish.findUnique({
            where: { id: item.dishId }
          })
          return {
            ...dish,
            totalOrdered: item._sum.quantity
          }
        })
      )

      // Revenus par mois (6 derniers mois)
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

      const monthlyRevenue = await prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          userId: session.userId,
          status: 'DELIVERED',
          createdAt: {
            gte: sixMonthsAgo
          }
        },
        _sum: {
          totalAmount: true
        }
      })

      // Avis moyens
      const averageRating = await prisma.review.aggregate({
        where: { userId: session.userId },
        _avg: {
          rating: true
        }
      })

      const stats = {
        totalOrders,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        totalCustomers,
        totalDishes,
        averageRating: averageRating._avg.rating || 0,
        recentOrders,
        popularDishes: dishesWithDetails,
        monthlyRevenue
      }

      res.status(200).json({ stats })
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}