import Link from "next/link";
import { ChevronRight, Phone, UtensilsCrossed } from "lucide-react";

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
      <main className="flex-1">
        <section className="w-full py-8 bg-gradient-to-b from-muted/50 to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Delicious Food, Smart Ordering
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Experience our innovative voice assistant that takes your
                  phone orders automatically, ensuring accuracy and convenience.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/menu">
                    <Button size="lg">View Our Menu</Button>
                  </Link>
                  <Link href="/order">
                    <Button size="lg" variant="outline">
                      Place an Order
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/main.jpg?height=550&width=450"
                  alt="Restaurant dish"
                  className="rounded-lg object-cover aspect-[4/5] overflow-hidden"
                  width={450}
                  height={550}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Smart Ordering
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Meet Our Voice Assistant
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered voice assistant handles phone orders
                  automatically, making the ordering process faster and more
                  accurate.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Automated Order Taking
                      </h3>
                      <p className="text-muted-foreground">
                        Our voice assistant answers calls and takes orders
                        without human intervention.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Accurate Order Processing
                      </h3>
                      <p className="text-muted-foreground">
                        The system extracts order details and confirms with
                        customers for accuracy.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Seamless Integration
                      </h3>
                      <p className="text-muted-foreground">
                        Orders are automatically entered into our system and
                        sent to the kitchen.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <Card className="w-full max-w-md">
                  <CardHeader>
                    <CardTitle>Try Our Voice Assistant Demo</CardTitle>
                    <CardDescription>
                      See how our voice assistant takes orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center py-6">
                    <Link href="/voice-demo">
                      <Button size="lg" className="gap-2">
                        <Phone className="h-5 w-5" />
                        Start Voice Demo
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Our Popular Dishes
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore our most loved dishes, prepared with fresh ingredients
                  and culinary expertise.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Signature Pasta",
                  description:
                    "Handmade pasta with our special sauce and fresh herbs.",
                  price: "$18.99",
                  image: "/pasta.jpg",
                },
                {
                  title: "Grilled Salmon",
                  description:
                    "Fresh salmon fillet grilled to perfection with seasonal vegetables.",
                  price: "$24.99",
                  image: "/salmon3.jpg",
                },
                {
                  title: "Gourmet Burger",
                  description:
                    "Premium beef patty with artisanal cheese and house-made sauce.",
                  price: "$16.99",
                  image: "/burger.jpg",
                },
              ].map((dish, index) => (
                <Card key={index} className="overflow-hidden">
                  <img
                    src={`${dish.image}?height=200&width=400&text=Dish+${
                      index + 1
                    }`}
                    alt={dish.title}
                    className="aspect-video object-cover w-full"
                    width={400}
                    height={200}
                  />
                  <CardHeader>
                    <CardTitle>{dish.title}</CardTitle>
                    <CardDescription>{dish.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <span className="font-bold">{dish.price}</span>
                    <Link href="/menu">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Link href="/menu">
                <Button variant="outline" size="lg" className="gap-2">
                  View Full Menu
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
