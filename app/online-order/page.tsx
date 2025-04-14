"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingCart,
  UtensilsCrossed,
  Clock,
  CheckCircle,
  CreditCard,
  MapPin,
  User,
  Mail,
  Home,
  Phone,
  Truck,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { menuCategories } from "@/lib/constants";

export default function OnlineOrderPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const total = searchParams.get("total");
  const initialStep = searchParams.get("step");

  useEffect(() => {
    if (initialStep === "payment") {
      setStep("payment");
    }
  }, [initialStep]);

  const [cart, setCart] = useState<
    { id: string; name: string; price: number; quantity: number }[]
  >([]);
  const [step, setStep] = useState<
    "menu" | "details" | "payment" | "confirmation"
  >("menu");

  const addToCart = (item: { id: string; name: string; price: number }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        );
      } else {
        return prevCart.filter((cartItem) => cartItem.id !== itemId);
      }
    });
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const proceedToDetails = () => {
    if (cart.length > 0) {
      setStep("details");
      window.scrollTo(0, 0);
    }
  };

  const proceedToPayment = () => {
    setStep("payment");
    window.scrollTo(0, 0);
  };

  const completeOrder = () => {
    setStep("confirmation");
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="w-full py-[130px] bg-gradient-to-r from-indigo-700 to-indigo-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
              <UtensilsCrossed className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Online Ordering</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Order <span className="text-yellow-300">Delicious</span> Food
            </h1>
            <p className="max-w-[700px] text-indigo-100 text-lg md:text-xl">
              Browse our menu, customize your order, and enjoy our delicious
              food at home.
            </p>
          </div>
        </div>
      </section>

      {/* Order Process */}
      <section className="w-full py-12">
        <div className="container px-4 md:px-6">
          {/* Progress Steps */}
          <div className="mx-auto max-w-3xl mb-12">
            <div className="flex justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0">
                <div
                  className={`h-full bg-indigo-600 transition-all duration-500 ${
                    step === "menu"
                      ? "w-0"
                      : step === "details"
                      ? "w-1/3"
                      : step === "payment"
                      ? "w-2/3"
                      : "w-full"
                  }`}
                ></div>
              </div>
              {["menu", "details", "payment", "confirmation"].map((s, i) => (
                <div key={s} className="flex flex-col items-center z-10">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      step === s
                        ? "bg-indigo-600 text-white"
                        : step === "confirmation" ||
                          (step === "payment" && i < 3) ||
                          (step === "details" && i < 2) ||
                          (step === "menu" && i < 1)
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      step === s ? "text-indigo-600" : "text-gray-600"
                    }`}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {step === "menu" && (
            <div className="mx-auto grid max-w-6xl gap-8 py-12 md:grid-cols-3">
              <div className="md:col-span-2">
                <Tabs defaultValue="starters" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                    {menuCategories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {menuCategories.map((category) => (
                    <TabsContent
                      key={category.id}
                      value={category.id}
                      className="pt-6"
                    >
                      <div className="grid gap-6">
                        {category.items.map((item) => (
                          <Card
                            key={item.id}
                            className="overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                          >
                            <div className="md:flex">
                              <div className="md:w-1/3">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                  width={300}
                                  height={150}
                                />
                              </div>
                              <div className="p-6 md:w-2/3">
                                <CardTitle>{item.name}</CardTitle>
                                <CardDescription className="mt-2">
                                  {item.description}
                                </CardDescription>
                                <div className="mt-4 flex items-center justify-between">
                                  <span className="font-bold text-indigo-700">
                                    ${Number(item.price).toFixed(2)}
                                  </span>
                                  <Button
                                    onClick={() =>
                                      addToCart({
                                        ...item,
                                        price: Number(item.price),
                                      })
                                    }
                                    size="sm"
                                    className="bg-indigo-600 hover:bg-indigo-700"
                                  >
                                    Add to Order
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
              <div>
                <Card className="sticky top-24 border border-gray-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-indigo-600" />
                      <span>Your Order</span>
                    </CardTitle>
                    <CardDescription>
                      {cart.length === 0
                        ? "Your order is empty"
                        : `${cart.length} item(s) in your order`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                          <ShoppingCart className="h-8 w-8 text-indigo-600" />
                        </div>
                        <p className="text-gray-500">
                          Add items from the menu to start your order
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-gray-500">
                                ${item.price.toFixed(2)} each
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                                onClick={() => addToCart(item)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex items-center justify-between font-bold text-lg">
                          <span>Total:</span>
                          <span className="text-indigo-700">
                            ${getTotalPrice()}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500"
                      disabled={cart.length === 0}
                      onClick={proceedToDetails}
                    >
                      Proceed to Checkout
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="mx-auto max-w-3xl py-12">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Order Details</CardTitle>
                      <CardDescription>
                        Please provide your contact and delivery information
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <User className="h-4 w-4" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        placeholder="(555) 123-4567"
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      className="focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700">
                      <Home className="h-4 w-4" />
                      Order Type
                    </Label>
                    <RadioGroup
                      defaultValue="delivery"
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem
                          value="delivery"
                          id="delivery"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="delivery"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:text-gray-900 peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50"
                        >
                          <Truck className="h-6 w-6 mb-2" />
                          Delivery
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="pickup"
                          id="pickup"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="pickup"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:text-gray-900 peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50"
                        >
                          <MapPin className="h-6 w-6 mb-2" />
                          Pickup
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="flex items-center gap-2 text-gray-700"
                    >
                      <MapPin className="h-4 w-4" />
                      Delivery Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="123 Main St"
                      className="focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-gray-700">
                        City
                      </Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-gray-700">
                        State
                      </Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip" className="text-gray-700">
                        ZIP Code
                      </Label>
                      <Input
                        id="zip"
                        placeholder="10001"
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructions" className="text-gray-700">
                      Special Instructions
                    </Label>
                    <Textarea
                      id="instructions"
                      placeholder="Any special requests or delivery instructions"
                      className="focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep("menu")}
                    className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  >
                    Back to Menu
                  </Button>
                  <Button
                    onClick={proceedToPayment}
                    className="bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500"
                  >
                    Continue to Payment
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {step === "payment" && (
            <div className="mx-auto max-w-3xl py-12">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        Payment Information
                      </CardTitle>
                      <CardDescription>
                        {orderId
                          ? `Complete payment for order: ${orderId}`
                          : "Please provide your payment details"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="card-number" className="text-gray-700">
                      Card Number
                    </Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      className="focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-gray-700">
                        Expiration Date
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-gray-700">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip-code" className="text-gray-700">
                        Billing ZIP Code
                      </Label>
                      <Input
                        id="zip-code"
                        placeholder="10001"
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name-on-card" className="text-gray-700">
                      Name on Card
                    </Label>
                    <Input
                      id="name-on-card"
                      placeholder="John Doe"
                      className="focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Order Summary</h3>
                    <div className="space-y-2">
                      {cart.length > 0 ? (
                        cart.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span className="text-gray-700">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex justify-between font-bold">
                          <span>Order Total:</span>
                          <span>${total || getTotalPrice()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setStep("details")}
                    className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                  >
                    Back to Details
                  </Button>
                  <Button
                    onClick={completeOrder}
                    className="bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500"
                  >
                    Place Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {step === "confirmation" && (
            <div className="mx-auto max-w-3xl py-12">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
                    <CardDescription>Thank you for your order</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-indigo-50 p-6 text-center border border-indigo-100">
                    <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                      Order #12345
                    </h3>
                    <p className="text-indigo-700">
                      Your order has been received and is being prepared. You
                      will receive a confirmation email shortly.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Order Details</h3>
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-gray-700">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-indigo-700">
                        ${getTotalPrice()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-indigo-600" />
                      Estimated Delivery Time
                    </h3>
                    <p className="text-gray-700">30-45 minutes</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Link href="/">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Return to Home
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
