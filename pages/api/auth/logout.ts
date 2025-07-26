import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from '@/lib/session'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const session = await getSession()
    session.destroy()

    res.status(200).json({ message: 'Déconnexion réussie' })
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    res.status(500).json({ message: 'Erreur interne du serveur' })
  }
}