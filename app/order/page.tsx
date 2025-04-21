"use client";

import { CardFooter } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  UtensilsCrossed,
  Smartphone,
  Clock,
  CheckCircle,
  Truck,
  CheckCircle2,
  CircleDashed,
  CircleDot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orderSteps } from "@/lib/constants";

export default function OrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);

  const trackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setIsTracking(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="w-full py-[130px] bg-gradient-to-r from-indigo-700 to-indigo-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <UtensilsCrossed className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Order & Track</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              <span className="text-yellow-300">Order</span> &{" "}
              <span className="text-yellow-300">Track</span> Your Meal
            </h1>
            <p className="max-w-[700px] text-indigo-100 text-lg md:text-xl">
              Place your order and track its progress in real-time for a
              seamless experience.
            </p>
          </div>
        </div>
      </section>

      {/* Order Methods Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2">
            {/* Online Order Card */}
            <Card className="border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Order Online</CardTitle>
                    <CardDescription>
                      Place your order directly through our website
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Browse our full menu with photos
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Customize your order exactly how you want it
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Secure payment options
                    </span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/online-order" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500">
                    Start Online Order
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Phone Order Card */}
            <Card className="border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Order by Phone</CardTitle>
                    <CardDescription>
                      Call us and our voice assistant will take your order
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Available 24/7</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">No waiting on hold</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Accurate order taking</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Link href="tel:+15551234567" className="w-full">
                  <Button className="w-full gap-2">
                    <Phone className="h-5 w-5" />
                    Call Now: (555) 123-4567
                  </Button>
                </Link>
                <Link href="/voice-demo" className="w-full">
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  >
                    Try Voice Demo
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          {/* Order Tracking Section */}
          <div className="mx-auto max-w-3xl py-12">
            {!isTracking ? (
              <Card className="border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700">
                      <Truck className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        Track Your Order
                      </CardTitle>
                      <CardDescription>
                        Check the status of your current order
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={trackOrder} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="order-number" className="text-gray-700">
                        Order Number
                      </Label>
                      <Input
                        id="order-number"
                        placeholder="e.g., ORD-12345"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        required
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500"
                    >
                      Track Order
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-gray-500">
                    Don't have your order number?{" "}
                    <Link
                      href="/contact"
                      className="text-indigo-600 hover:underline"
                    >
                      Contact our customer support
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            ) : (
              <Card className="border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-2xl">
                        Order #ORD-12345
                      </CardTitle>
                      <CardDescription>
                        Placed today at 12:30 PM
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 mt-2 md:mt-0">
                      <Clock className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium">
                        Estimated Delivery: 1:15 PM
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="rounded-lg bg-indigo-50 p-4 border border-indigo-100">
                    <p className="text-center text-indigo-800 font-medium">
                      Your order will be delivered in approximately 25 minutes.
                    </p>
                  </div>

                  {/* Order Progress */}
                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-gray-800">
                      Order Status
                    </h3>
                    {orderSteps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full">
                            {index < currentStep ? (
                              <CheckCircle2 className="h-8 w-8 text-green-500" />
                            ) : index === currentStep ? (
                              <CircleDot className="h-8 w-8 text-indigo-600 animate-pulse" />
                            ) : (
                              <CircleDashed className="h-8 w-8 text-gray-300" />
                            )}
                          </div>
                          {index < orderSteps.length - 1 && (
                            <div
                              className={`h-full w-0.5 ${
                                index < currentStep
                                  ? "bg-green-500"
                                  : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                        <div
                          className={`space-y-1 pb-6 ${
                            index >= currentStep ? "opacity-70" : ""
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">
                              {step.title}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {step.time}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">
                      Order Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700">
                          1x Signature Pasta
                        </span>
                        <span className="font-medium">$18.99</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700">1x Gourmet Burger</span>
                        <span className="font-medium">$16.99</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-700">1x Tiramisu</span>
                        <span className="font-medium">$8.99</span>
                      </div>
                      <div className="flex justify-between pt-2 font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-indigo-700">$44.97</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setIsTracking(false)}
                    className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  >
                    Track Another Order
                  </Button>
                  <Link href="/">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Return to Home
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-gradient-to-r from-indigo-800 to-indigo-700 text-white">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Need Help With Your Order?
            </h2>
            <p className="mt-4 text-xl text-indigo-100">
              Our customer service team is available to assist you.
            </p>
            <div className="mt-8 flex flex-col gap-4 min-[400px]:flex-row justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-white text-md text-indigo-800 hover:bg-gray-100 hover:font-semibold transition-all duration-300"
                >
                  Contact Support
                </Button>
              </Link>
              <Link href="#">
                <Button
                  size="lg"
                  className="bg-white text-md text-indigo-800 hover:bg-gray-100 hover:font-semibold transition-all duration-300"
                >
                  View FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
