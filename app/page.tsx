import Link from "next/link";
import {
  ChevronRight,
  Phone,
  UtensilsCrossed,
  Sparkles,
  Check,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-[130px] bg-gradient-to-br from-indigo-900 to-indigo-700 text-white">
        <div className="container px-4 md:px-6 w-full max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Introducing Voice Ordering
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                <span className="text-yellow-300">Delicious</span> Food, <br />
                <span className="text-yellow-300">Effortless</span> Ordering
              </h1>
              <p className="text-lg text-indigo-100 md:text-xl">
                Experience our innovative voice assistant that takes your phone
                orders automatically, ensuring accuracy and convenience like
                never before.
              </p>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href="/menu">
                  <Button
                    size="lg"
                    className="bg-yellow-400 font-semibold hover:bg-yellow-300 text-white hover:text-indigo-800 transition-all duration-300"
                  >
                    View Our Menu
                  </Button>
                </Link>
                <Link href="/order">
                  <Button
                    size="lg"
                    variant="outline"
                    className="hover:text-white text-indigo-800 font-semibold border-white hover:bg-white/10"
                  >
                    Place an Order
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center relative">
              <div className="absolute -inset-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"></div>
              <img
                src="/main.jpg?height=600&width=500"
                alt="Restaurant dish"
                className="relative rounded-xl object-cover aspect-[4/5] shadow-2xl border-2 border-white/20"
                width={500}
                height={600}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Voice Assistant Section */}
      <section className="w-full py-12 md:py-20 lg:py-28 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 p-4">
              <Phone className="h-8 w-8 text-indigo-700" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent">
              Meet Our Voice Assistant
            </h2>
            <p className="max-w-[800px] text-gray-600 text-lg">
              Our AI-powered voice assistant handles phone orders automatically,
              making the ordering process faster and more accurate.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <ul className="grid gap-6">
                {[
                  {
                    icon: <Check className="h-6 w-6 text-green-500" />,
                    title: "Automated Order Taking",
                    description:
                      "Our voice assistant answers calls and takes orders without human intervention.",
                  },
                  {
                    icon: <Clock className="h-6 w-6 text-blue-500" />,
                    title: "24/7 Availability",
                    description:
                      "Take orders anytime, even outside business hours.",
                  },
                  {
                    icon: <Star className="h-6 w-6 text-yellow-500" />,
                    title: "Seamless Integration",
                    description:
                      "Orders automatically enter our system and go straight to the kitchen.",
                  },
                ].map((feature, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center shadow-lg">
              <Card className="w-full max-w-md border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
                  <CardHeader className="p-0">
                    <CardTitle className="text-2xl">
                      Try Our Voice Demo
                    </CardTitle>
                    <CardDescription className="text-indigo-100">
                      Experience how our voice assistant takes orders
                    </CardDescription>
                  </CardHeader>
                </div>
                <CardContent className="p-6">
                  <Link href="/voice-demo">
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-indigo-800 to-indigo-600 hover:from-indigo-700 hover:to-indigo-500"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Start Voice Demo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="w-full py-12 md:py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 p-4">
              <UtensilsCrossed className="h-8 w-8 text-indigo-700" />
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent">
              Customer Favorites
            </h2>
            <p className="max-w-[800px] text-gray-600 text-lg">
              Explore our most loved dishes, prepared with fresh ingredients and
              culinary expertise.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Signature Pasta",
                description:
                  "Handmade pasta with our special sauce and fresh herbs.",
                price: "$18.99",
                image: "/pasta.jpg",
                isPopular: true,
              },
              {
                title: "Grilled Salmon",
                description:
                  "Fresh salmon fillet grilled to perfection with seasonal vegetables.",
                price: "$24.99",
                image: "/salmon3.jpg",
                isChefSpecial: true,
              },
              {
                title: "Gourmet Burger",
                description:
                  "Premium beef patty with artisanal cheese and house-made sauce.",
                price: "$16.99",
                image: "/burger.jpg",
                isPopular: true,
              },
            ].map((dish, index) => (
              <Card
                key={index}
                className="overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`${dish.image}?height=300&width=500&text=Dish+${
                      index + 1
                    }`}
                    alt={dish.title}
                    className="aspect-video object-cover w-full group-hover:scale-105 transition-transform duration-500"
                    width={500}
                    height={300}
                  />
                  {dish.isPopular && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </div>
                  )}
                  {dish.isChefSpecial && (
                    <div className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      Chef's Special
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{dish.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {dish.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                  <span className="font-bold text-indigo-700">
                    {dish.price}
                  </span>
                  <Link href="/menu">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                    >
                      View Details
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Link href="/menu">
              <Button
                size="lg"
                variant="outline"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 gap-2"
              >
                View Full Menu
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-gradient-to-r from-indigo-800 to-indigo-700 text-white">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to Experience Smart Ordering?
            </h2>
            <p className="mt-4 text-xl text-indigo-100">
              Download our app or call now to try our voice ordering system.
            </p>
            <div className="mt-8 flex flex-col gap-4 min-[400px]:flex-row justify-center">
              <Link href="#">
                <Button
                  size="lg"
                  className="bg-white text-md text-indigo-800 hover:bg-gray-100 hover:font-semibold transition-all duration-300"
                >
                  Download App
                </Button>
              </Link>
              <Link href="/order">
                <Button
                  size="lg"
                  className="bg-white text-md text-indigo-800 hover:bg-gray-100 hover:font-semibold transition-all duration-300"
                >
                  Order Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
