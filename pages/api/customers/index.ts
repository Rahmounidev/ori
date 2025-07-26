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
      const customers = await prisma.customer.findMany({
        where: { userId: session.userId },
        include: {
          orders: {
            select: {
              id: true,
              totalAmount: true,
              createdAt: true,
              status: true,
            }
          },
          _count: {
            select: {
              orders: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      res.status(200).json({ customers })
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else if (req.method === 'POST') {
    try {
      const { email, name, phone, address, city } = req.body

      // Vérifier si le client existe déjà
      const existingCustomer = await prisma.customer.findUnique({
        where: { email }
      })

      if (existingCustomer) {
        return res.status(400).json({ message: 'Un client avec cet email existe déjà' })
      }

      const customer = await prisma.customer.create({
        data: {
          email,
          name,
          phone,
          address,
          city,
          userId: session.userId,
        }
      })

      res.status(201).json({ customer })
    } catch (error) {
      console.error('Erreur lors de la création du client:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}