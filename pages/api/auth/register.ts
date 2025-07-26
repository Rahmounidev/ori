import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { getSession } from '@/lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password, name, phone, restaurantName, cuisine, role = 'RESTAURANT' } = req.body

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email existe déjà' })
    }

    // Hasher le mot de passe
    const hashedPassword = await hashPassword(password)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        restaurantName,
        cuisine,
        role: role as any,
      }
    })

    // Créer la session
    const session = await getSession()
    session.userId = user.id
    session.email = user.email
    session.name = user.name
    session.role = user.role
    session.isLoggedIn = true
    await session.save()

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        restaurantName: user.restaurantName
      }
    })
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    res.status(500).json({ message: 'Erreur interne du serveur' })
  }
}