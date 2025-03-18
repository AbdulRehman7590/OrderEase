"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, UtensilsCrossed } from "lucide-react";

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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Online Order
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Place your order online and enjoy our delicious food at home.
                </p>
              </div>
            </div>

            {step === "menu" && (
              <div className="mx-auto grid max-w-6xl gap-8 py-12 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Tabs defaultValue="starters" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      {menuCategories.map((category) => (
                        <TabsTrigger key={category.id} value={category.id}>
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
                            <Card key={item.id} className="overflow-hidden">
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
                                    <span className="font-bold">
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
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Your Order
                      </CardTitle>
                      <CardDescription>
                        {cart.length === 0
                          ? "Your order is empty"
                          : `${cart.length} item(s) in your order`}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {cart.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          Add items from the menu to start your order
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {cart.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  ${item.price.toFixed(2)} each
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
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
                                  className="h-8 w-8"
                                  onClick={() => addToCart(item)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Separator />
                          <div className="flex items-center justify-between font-bold">
                            <span>Total:</span>
                            <span>${getTotalPrice()}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
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
                <Card>
                  <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                    <CardDescription>
                      Please provide your contact and delivery information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="(555) 123-4567" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Order Type</Label>
                      <RadioGroup defaultValue="delivery">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="delivery" id="delivery" />
                          <Label htmlFor="delivery">Delivery</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pickup" id="pickup" />
                          <Label htmlFor="pickup">Pickup</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Delivery Address</Label>
                      <Input id="address" placeholder="123 Main St" />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="New York" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input id="state" placeholder="NY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" placeholder="10001" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instructions">Special Instructions</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Any special requests or delivery instructions"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep("menu")}>
                      Back to Menu
                    </Button>
                    <Button onClick={proceedToPayment}>
                      Continue to Payment
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {step === "payment" && (
              <div className="mx-auto max-w-3xl py-12">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>
                      {orderId
                        ? `Complete payment for order: ${orderId}`
                        : "Please provide your payment details"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiration Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip-code">Billing ZIP Code</Label>
                        <Input id="zip-code" placeholder="10001" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name-on-card">Name on Card</Label>
                      <Input id="name-on-card" placeholder="John Doe" />
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="font-medium">Order Summary</h3>
                      <div className="space-y-2">
                        {cart.length > 0 ? (
                          cart.map((item) => (
                            <div key={item.id} className="flex justify-between">
                              <span>
                                {item.quantity}x {item.name}
                              </span>
                              <span>
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
                    >
                      Back to Details
                    </Button>
                    <Button onClick={completeOrder}>Place Order</Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {step === "confirmation" && (
              <div className="mx-auto max-w-3xl py-12">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Confirmed!</CardTitle>
                    <CardDescription>Thank you for your order</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="rounded-lg bg-muted p-6 text-center">
                      <h3 className="text-xl font-semibold mb-2">
                        Order #12345
                      </h3>
                      <p className="text-muted-foreground">
                        Your order has been received and is being prepared. You
                        will receive a confirmation email shortly.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium">Order Details</h3>
                      <div className="space-y-2">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>
                              {item.quantity}x {item.name}
                            </span>
                            <span>
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>${getTotalPrice()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Estimated Delivery Time</h3>
                      <p>30-45 minutes</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="/order-tracking">
                      <Button variant="outline">Track Order</Button>
                    </Link>
                    <Link href="/">
                      <Button>Return to Home</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
