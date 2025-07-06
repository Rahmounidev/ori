"use client"

import { useState } from "react"
import { ArrowLeft, User, MapPin, Edit, Camera, Shield, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import Footer from "@/components/footer"
import ModernHeader from "@/components/header/modern-header"
import LoyaltyBadge from "@/components/loyalty/loyalty-badge"

// Mock data pour le profil utilisateur
const userProfile = {
  id: "user-123",
  firstName: "Ahmed",
  lastName: "Benali",
  email: "ahmed.benali@email.com",
  phone: "+212 6 12 34 56 78",
  avatar: "/placeholder.svg?height=100&width=100",
  dateOfBirth: "1990-05-15",
  gender: "male",
  addresses: [
    {
      id: "addr-1",
      type: "home",
      label: "Domicile",
      address: "123 Rue Abderrahman El Ghafiki",
      city: "Casablanca",
      postalCode: "20100",
      isDefault: true,
    },
    {
      id: "addr-2",
      type: "work",
      label: "Bureau",
      address: "456 Boulevard Mohammed V",
      city: "Casablanca",
      postalCode: "20000",
      isDefault: false,
    },
  ],
  preferences: {
    notifications: {
      orderUpdates: true,
      promotions: true,
      newsletter: false,
      sms: true,
    },
    dietary: ["halal"],
    language: "fr",
    currency: "MAD",
  },
  stats: {
    totalOrders: 47,
    totalSpent: 2340.5,
    favoriteRestaurants: 8,
    loyaltyPoints: 750,
    loyaltyTotalEarned: 1250,
  },
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState(userProfile)

  const handleSave = () => {
    // Logique pour sauvegarder les modifications
    console.log("Profile updated:", profileData)
    setIsEditing(false)
  }

  const handleAddressChange = (addressId: string, field: string, value: string) => {
    setProfileData({
      ...profileData,
      addresses: profileData.addresses.map((addr) => (addr.id === addressId ? { ...addr, [field]: value } : addr)),
    })
  }

  const handlePreferenceChange = (category: string, field: string, value: any) => {
    setProfileData({
      ...profileData,
      preferences: {
        ...profileData.preferences,
        [category]: {
          ...profileData.preferences[category as keyof typeof profileData.preferences],
          [field]: value,
        },
      },
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ModernHeader cartItemsCount={0} userLocation="Casablanca, Maroc" />

      {/* Page Header */}
      <section className="bg-white border-b pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            </Link>
            <Image src="/images/droovo-logo-full.png" alt="Droovo" width={140} height={40} className="h-8 w-auto" />
          </div>

          {/* Profile Header */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={profileData.avatar || "/placeholder.svg"}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                />
                <AvatarFallback className="text-2xl">
                  {profileData.firstName.charAt(0)}
                  {profileData.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-gray-600 mb-2">{profileData.email}</p>
              <div className="flex items-center space-x-4">
                <LoyaltyBadge
                  points={profileData.stats.loyaltyPoints}
                  totalEarned={profileData.stats.loyaltyTotalEarned}
                  clickable={false}
                />
                <div className="text-sm text-gray-500">Membre depuis janvier 2023</div>
              </div>
            </div>

            <Button onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4 mr-2" />
              {isEditing ? "Annuler" : "Modifier"}
            </Button>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Informations</TabsTrigger>
            <TabsTrigger value="addresses">Adresses</TabsTrigger>
            <TabsTrigger value="preferences">Préférences</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>Gérez vos informations personnelles et de contact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date de naissance</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Genre</Label>
                    <Select
                      value={profileData.gender}
                      onValueChange={(value) => setProfileData({ ...profileData, gender: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Homme</SelectItem>
                        <SelectItem value="female">Femme</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Annuler
                    </Button>
                    <Button onClick={handleSave}>Sauvegarder</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            {profileData.addresses.map((address) => (
              <Card key={address.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      {address.label}
                    </div>
                    {address.isDefault && (
                      <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">Par défaut</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Adresse</Label>
                    <Input
                      value={address.address}
                      onChange={(e) => handleAddressChange(address.id, "address", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Ville</Label>
                      <Input
                        value={address.city}
                        onChange={(e) => handleAddressChange(address.id, "city", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Code postal</Label>
                      <Input
                        value={address.postalCode}
                        onChange={(e) => handleAddressChange(address.id, "postalCode", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" className="w-full">
              <MapPin className="h-4 w-4 mr-2" />
              Ajouter une nouvelle adresse
            </Button>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mises à jour de commande</Label>
                    <p className="text-sm text-gray-500">Recevoir des notifications sur l'état de vos commandes</p>
                  </div>
                  <Switch
                    checked={profileData.preferences.notifications.orderUpdates}
                    onCheckedChange={(checked) => handlePreferenceChange("notifications", "orderUpdates", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Promotions</Label>
                    <p className="text-sm text-gray-500">Recevoir des offres spéciales et promotions</p>
                  </div>
                  <Switch
                    checked={profileData.preferences.notifications.promotions}
                    onCheckedChange={(checked) => handlePreferenceChange("notifications", "promotions", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Newsletter</Label>
                    <p className="text-sm text-gray-500">Recevoir notre newsletter hebdomadaire</p>
                  </div>
                  <Switch
                    checked={profileData.preferences.notifications.newsletter}
                    onCheckedChange={(checked) => handlePreferenceChange("notifications", "newsletter", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS</Label>
                    <p className="text-sm text-gray-500">Recevoir des SMS pour les commandes urgentes</p>
                  </div>
                  <Switch
                    checked={profileData.preferences.notifications.sms}
                    onCheckedChange={(checked) => handlePreferenceChange("notifications", "sms", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Préférences alimentaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Régimes alimentaires</Label>
                  <div className="flex flex-wrap gap-2">
                    {["halal", "végétarien", "végan", "sans gluten", "sans lactose"].map((diet) => (
                      <Button
                        key={diet}
                        variant={profileData.preferences.dietary.includes(diet) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newDietary = profileData.preferences.dietary.includes(diet)
                            ? profileData.preferences.dietary.filter((d) => d !== diet)
                            : [...profileData.preferences.dietary, diet]
                          setProfileData({
                            ...profileData,
                            preferences: { ...profileData.preferences, dietary: newDietary },
                          })
                        }}
                      >
                        {diet.charAt(0).toUpperCase() + diet.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{profileData.stats.totalOrders}</div>
                  <p className="text-gray-600">Commandes totales</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {profileData.stats.totalSpent.toFixed(2)} DH
                  </div>
                  <p className="text-gray-600">Montant total dépensé</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{profileData.stats.favoriteRestaurants}</div>
                  <p className="text-gray-600">Restaurants favoris</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{profileData.stats.loyaltyPoints}</div>
                  <p className="text-gray-600">Points de fidélité</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Progression de fidélité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <LoyaltyBadge
                    points={profileData.stats.loyaltyPoints}
                    totalEarned={profileData.stats.loyaltyTotalEarned}
                    size="lg"
                  />
                  <p className="text-gray-600 mt-4">
                    Vous avez gagné {profileData.stats.loyaltyTotalEarned} points au total
                  </p>
                  <Link href="/loyalty">
                    <Button className="mt-4">Voir mes récompenses</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  )
}
