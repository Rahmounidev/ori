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
      const orders = await prisma.order.findMany({
        where: { userId: session.userId },
        include: {
          customer: true,
          orderItems: {
            include: {
              dish: true,
            }
          },
          payment: true,
        },
        orderBy: { createdAt: 'desc' }
      })

      res.status(200).json({ orders })
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else if (req.method === 'POST') {
    try {
      const {
        customerEmail,
        customerName,
        customerPhone,
        customerAddress,
        items,
        deliveryAddress,
        deliveryFee,
        tax,
        discount,
        notes,
        paymentMethod
      } = req.body

      // Créer ou trouver le client
      let customer = await prisma.customer.findUnique({
        where: { email: customerEmail }
      })

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            email: customerEmail,
            name: customerName,
            phone: customerPhone,
            address: customerAddress,
            userId: session.userId,
          }
        })
      }

      // Calculer le montant total
      let totalAmount = 0
      for (const item of items) {
        const dish = await prisma.dish.findUnique({
          where: { id: item.dishId }
        })
        if (dish) {
          totalAmount += dish.price * item.quantity
        }
      }

      // Ajouter les frais
      if (deliveryFee) totalAmount += parseFloat(deliveryFee)
      if (tax) totalAmount += parseFloat(tax)
      if (discount) totalAmount -= parseFloat(discount)

      // Générer un numéro de commande unique
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      // Créer la commande
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          userId: session.userId,
          totalAmount,
          deliveryFee: deliveryFee ? parseFloat(deliveryFee) : null,
          tax: tax ? parseFloat(tax) : null,
          discount: discount ? parseFloat(discount) : null,
          deliveryAddress,
          notes,
          paymentMethod: paymentMethod as any,
          orderItems: {
            create: items.map((item: any) => ({
              dishId: item.dishId,
              quantity: item.quantity,
              price: item.price,
              notes: item.notes,
            }))
          }
        },
        include: {
          customer: true,
          orderItems: {
            include: {
              dish: true,
            }
          }
        }
      })

      res.status(201).json({ order })
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error)
      res.status(500).json({ message: 'Erreur interne du serveur' })
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}