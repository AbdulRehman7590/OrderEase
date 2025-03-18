"use client";

import { CardFooter } from "@/components/ui/card";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  CircleDashed,
  CircleDot,
  Clock,
  UtensilsCrossed,
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

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);

  const trackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      setIsTracking(true);
      // In a real app, you would fetch the order status from an API
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Track Your Order
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Check the status of your order in real-time.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl py-12">
              {!isTracking ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Enter Your Order Number</CardTitle>
                    <CardDescription>
                      Please enter the order number you received in your
                      confirmation email.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={trackOrder} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="order-number">Order Number</Label>
                        <Input
                          id="order-number"
                          placeholder="e.g., 12345"
                          value={orderNumber}
                          onChange={(e) => setOrderNumber(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Track Order
                      </Button>
                    </form>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                      Don&apos;t have your order number? Contact our customer
                      support.
                    </p>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Order #12345</CardTitle>
                    <CardDescription>Placed today at 12:30 PM</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Estimated Delivery Time</h3>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>1:15 PM</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-center">
                          Your order will be delivered in approximately 25
                          minutes.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {orderSteps.map((step, index) => (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full">
                              {index < currentStep ? (
                                <CheckCircle2 className="h-8 w-8 text-primary" />
                              ) : index === currentStep ? (
                                <CircleDot className="h-8 w-8 text-primary" />
                              ) : (
                                <CircleDashed className="h-8 w-8 text-muted-foreground" />
                              )}
                            </div>
                            {index < orderSteps.length - 1 && (
                              <div
                                className={`h-full w-0.5 ${
                                  index < currentStep
                                    ? "bg-primary"
                                    : "bg-muted-foreground/30"
                                }`}
                              />
                            )}
                          </div>
                          <div className="space-y-1 pb-6">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{step.title}</h4>
                              <span className="text-xs text-muted-foreground">
                                {step.time}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Order Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>1x Signature Pasta</span>
                          <span>$18.99</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1x Gourmet Burger</span>
                          <span>$16.99</span>
                        </div>
                        <div className="flex justify-between">
                          <span>1x Tiramisu</span>
                          <span>$8.99</span>
                        </div>
                      </div>
                      <div className="flex justify-between border-t pt-2 font-bold">
                        <span>Total:</span>
                        <span>$44.97</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setIsTracking(false)}
                    >
                      Track Another Order
                    </Button>
                    <Link href="/">
                      <Button>Return to Home</Button>
                    </Link>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
