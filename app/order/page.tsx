import Link from "next/link";
import { Phone, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function OrderPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Order Now
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Choose your preferred ordering method and enjoy our delicious
                  food.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Online</CardTitle>
                  <CardDescription>
                    Place your order directly through our website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Browse our menu, customize your order, and pay securely
                    online. Your food will be prepared fresh and ready for
                    pickup or delivery.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/online-order" className="w-full">
                    <Button className="w-full">Start Online Order</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Order by Phone</CardTitle>
                  <CardDescription>
                    Call us and our voice assistant will take your order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Call our restaurant and our smart voice assistant will take
                    your order automatically. It's fast, accurate, and available
                    24/7.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/voice-demo" className="w-full">
                    <Button className="w-full gap-2">
                      <Phone className="h-5 w-5" />
                      Try Voice Ordering Demo
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            <div className="mx-auto max-w-5xl">
              <Card>
                <CardHeader>
                  <CardTitle>Track Your Order</CardTitle>
                  <CardDescription>
                    Check the status of your current order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Enter your order number below to track the status of your
                    order in real-time.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/order-tracking" className="w-full">
                    <Button variant="outline" className="w-full">
                      Track Order
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
