"use client"

import { useState } from "react"
import { Search, MapPin, Star, Clock, TrendingUp, Zap, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import Footer from "@/components/footer"
import ModernHeader from "@/components/header/modern-header"
import RestaurantMap from "@/components/map/restaurant-map"
import WhatsAppNotification from "@/components/notifications/whatsapp-notification"

// Mock data pour les restaurants populaires au Maroc
const featuredRestaurants = [
  {
    id: 1,
    name: "Pizza Casa",
    cuisine: "Italien",
    rating: 4.5,
    reviewCount: 234,
    deliveryTime: "25-35 min",
    image: "/placeholder.svg?height=200&width=300",
    description: "Pizzas authentiques et pâtes fraîches",
    distance: 1.2,
    lat: 33.5731,
    lng: -7.5898,
    isOpen: true,
    badge: "Populaire",
    promotion: "Livraison gratuite dès 250 DH",
  },
  {
    id: 2,
    name: "Sushi Casablanca",
    cuisine: "Japonais",
    rating: 4.8,
    reviewCount: 312,
    deliveryTime: "30-40 min",
    image: "/placeholder.svg?height=200&width=300",
    description: "Sushi frais et cuisine japonaise",
    distance: 0.8,
    lat: 33.5892,
    lng: -7.6031,
    isOpen: true,
    badge: "Top noté",
    promotion: "20% sur la première commande",
  },
  {
    id: 3,
    name: "Burger Maarif",
    cuisine: "Américain",
    rating: 4.2,
    reviewCount: 189,
    deliveryTime: "20-30 min",
    image: "/placeholder.svg?height=200&width=300",
    description: "Burgers gourmets et frites maison",
    distance: 2.1,
    lat: 33.565,
    lng: -7.6109,
    isOpen: true,
    badge: "Livraison rapide",
    promotion: null,
  },
]

const cuisineCategories = [
  { name: "Marocain", icon: "🥘", count: 58, color: "bg-red-100 text-red-700" },
  { name: "Italien", icon: "🍕", count: 45, color: "bg-green-100 text-green-700" },
  { name: "Japonais", icon: "🍣", count: 32, color: "bg-pink-100 text-pink-700" },
  { name: "Français", icon: "🥖", count: 28, color: "bg-blue-100 text-blue-700" },
  { name: "Libanais", icon: "🥙", count: 35, color: "bg-yellow-100 text-yellow-700" },
  { name: "Indien", icon: "🍛", count: 19, color: "bg-orange-100 text-orange-700" },
  { name: "Healthy", icon: "🥗", count: 27, color: "bg-emerald-100 text-emerald-700" },
  { name: "Desserts", icon: "🍰", count: 15, color: "bg-purple-100 text-purple-700" },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [showMap, setShowMap] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Logique de recherche
  }

  const handleRestaurantSelect = (restaurant: any) => {
    setSelectedRestaurant(restaurant)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <ModernHeader cartItemsCount={0} userLocation="Casablanca, Maroc" onSearch={handleSearch} />

      {/* Notifications WhatsApp */}
      <WhatsAppNotification
        orderId="CMD-2024-001"
        status="confirmed"
        restaurantName="Pizza Casa"
        estimatedTime="25-35 min"
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Savourez l'instant avec{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Droovo</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Découvrez les meilleurs restaurants près de chez vous au Maroc et commandez en quelques clics. Livraison
              rapide, saveurs authentiques.
            </p>

            {/* Hero Search */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6" />
                <Input
                  type="text"
                  placeholder="Rechercher restaurants, plats, cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl shadow-lg focus:border-purple-500 focus:ring-purple-500"
                />
                <Button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl"
                  onClick={() => handleSearch(searchQuery)}
                >
                  Rechercher
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button
                variant="outline"
                className="rounded-full border-2 hover:bg-purple-50 hover:border-purple-300"
                onClick={() => setShowMap(!showMap)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Voir sur la carte
              </Button>
              <Button variant="outline" className="rounded-full border-2 hover:bg-pink-50 hover:border-pink-300">
                <TrendingUp className="h-4 w-4 mr-2" />
                Tendances
              </Button>
              <Button variant="outline" className="rounded-full border-2 hover:bg-orange-50 hover:border-orange-300">
                <Zap className="h-4 w-4 mr-2" />
                Livraison rapide
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {showMap && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <RestaurantMap
              restaurants={featuredRestaurants}
              onRestaurantSelect={handleRestaurantSelect}
              userLocation={{ lat: 33.5731, lng: -7.5898 }}
            />
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explorez par cuisine</h2>
            <p className="text-gray-600">Découvrez une variété de saveurs du Maroc et du monde entier</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {cuisineCategories.map((category) => (
              <Link key={category.name} href={`/restaurants?cuisine=${category.name}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-purple-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <Badge variant="secondary" className={category.color}>
                      {category.count} restaurants
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Restaurants populaires</h2>
            <p className="text-gray-600">Les favoris de nos clients à Casablanca</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRestaurants.map((restaurant) => (
              <Link key={restaurant.id} href={`/restaurant/${restaurant.id}`}>
                <Card className="hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden border-0 shadow-lg">
                  <div className="relative">
                    <Image
                      src={restaurant.image || "/placeholder.svg"}
                      alt={restaurant.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                        <Award className="h-3 w-3 mr-1" />
                        {restaurant.badge}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant={restaurant.isOpen ? "default" : "secondary"}
                        className="bg-white/90 text-gray-900"
                      >
                        {restaurant.isOpen ? "Ouvert" : "Fermé"}
                      </Badge>
                    </div>
                    {restaurant.promotion && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge variant="destructive" className="w-full justify-center bg-red-500">
                          🎉 {restaurant.promotion}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{restaurant.name}</CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{restaurant.rating}</span>
                        <span className="text-sm text-gray-500">({restaurant.reviewCount})</span>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600">{restaurant.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{restaurant.deliveryTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{restaurant.distance} km</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-purple-600 border-purple-200">
                        {restaurant.cuisine}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/restaurants">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl px-8"
              >
                Voir tous les restaurants
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pourquoi choisir Droovo ?</h2>
            <p className="text-gray-600">Une expérience de commande unique et moderne au Maroc</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Livraison ultra-rapide</h3>
                <p className="text-gray-600">Recevez vos plats en 30 minutes maximum grâce à notre réseau optimisé</p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Géolocalisation précise</h3>
                <p className="text-gray-600">
                  Trouvez les restaurants les plus proches avec notre système de carte intégré
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Qualité garantie</h3>
                <p className="text-gray-600">Restaurants sélectionnés et notés par notre communauté de gourmets</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
