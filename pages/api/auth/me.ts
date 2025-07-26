import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const session = await getSession()

    if (!session.isLoggedIn || !session.userId) {
      return res.status(401).json({ message: 'Non authentifié' })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        address: true,
        city: true,
        postalCode: true,
        restaurantName: true,
        description: true,
        logo: true,
        cuisine: true,
        role: true,
        isActive: true,
        hours: true,
        isOpen: true,
        deliveryRadius: true,
        minimumOrder: true,
        customMessage: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' })
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error)
    res.status(500).json({ message: 'Erreur interne du serveur' })
  }
}