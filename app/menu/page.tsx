import Link from "next/link";
import { UtensilsCrossed, Star, Clock, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menuCategories } from "@/lib/constants";

export default function MenuPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-[130px] bg-gradient-to-r from-indigo-900 to-indigo-700 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                <UtensilsCrossed className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Seasonal Menu</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl">
                Culinary <span className="text-yellow-300">Delights</span>
              </h1>
              <p className="max-w-[700px] text-indigo-100 text-lg md:text-xl">
                Explore our delicious offerings, prepared with fresh ingredients
                and culinary expertise.
              </p>
            </div>
          </div>
        </section>

        {/* Menu Navigation */}
        <section className="w-full py-12 md:py-16 -mt-8">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-5xl bg-white rounded-xl shadow-lg p-1">
              <Tabs defaultValue="starters" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-14">
                  {menuCategories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all"
                    >
                      <span className="truncate">{category.name}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Menu Items */}
                <div className="p-6">
                  {menuCategories.map((category) => (
                    <TabsContent
                      key={category.id}
                      value={category.id}
                      className="space-y-8"
                    >
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-gray-900">
                          {category.name}
                        </h2>
                        <p className="text-gray-500">{category.description}</p>
                      </div>

                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {category.items.map((item) => (
                          <Card
                            key={item.id}
                            className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 group"
                          >
                            <div className="relative overflow-hidden">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="aspect-video object-cover w-full group-hover:scale-105 transition-transform duration-500"
                                width={400}
                                height={225}
                              />
                              {item.isPopular && (
                                <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </div>
                              )}
                              {item.isVegan && (
                                <div className="absolute top-3 right-3 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold flex items-center">
                                  <Leaf className="h-3 w-3 mr-1" />
                                  Vegan
                                </div>
                              )}
                            </div>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">
                                  {item.name}
                                </CardTitle>
                                <span className="font-bold text-indigo-700">
                                  {item.price}
                                </span>
                              </div>
                              <CardDescription className="text-gray-600">
                                {item.description}
                              </CardDescription>
                              {item.prepTime && (
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {item.prepTime} min prep
                                </div>
                              )}
                            </CardHeader>
                            <CardFooter className="flex justify-end">
                              <Link href={`/order?item=${item.id}`}>
                                <Button
                                  size="sm"
                                  className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
                                >
                                  Add to Order
                                </Button>
                              </Link>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Special Offers Banner */}
        <section className="w-full bg-yellow-50 border-t border-b border-yellow-200 py-8">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-gray-900">
                  Happy Hour Special
                </h3>
                <p className="text-gray-600">
                  4-6PM Weekdays: 20% off all appetizers and drinks
                </p>
              </div>
              <Button
                variant="outline"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              >
                View Happy Hour Menu
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
