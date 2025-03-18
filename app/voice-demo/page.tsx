"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mic, MicOff, Phone, PhoneOff, UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { menuItems } from "@/lib/constants";
import { assistantMessages } from "@/lib/constants";
import { simulatedResponses } from "@/lib/constants";

export default function VoiceDemoPage() {
  const [callStatus, setCallStatus] = useState<
    "idle" | "connecting" | "active" | "completed"
  >("idle");
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [orderDetails, setOrderDetails] = useState<{
    items: {
      name: string;
      quantity: number;
      price: number;
      special?: string;
    }[];
    customerName: string;
    phoneNumber: string;
    address: string;
    deliveryTime: string;
    total: number;
  } | null>(null);
  const [confirmationStep, setConfirmationStep] = useState(0);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [invalidItems, setInvalidItems] = useState<string[]>([]);
  const [paymentStep, setPaymentStep] = useState<
    "idle" | "processing" | "completed"
  >("idle");

  const recognitionRef = useRef<any>(null);
  const conversationRef = useRef<string[]>([]);

  // Function to extract menu items from text
  const extractMenuItems = (text: string) => {
    const words = text.toLowerCase().split(" ");
    const foundItems = new Map();
    const notFoundItems: string[] = [];

    const quantityWords: { [key: string]: number } = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      a: 1,
      an: 1,
    };

    let currentQuantity = 1;
    let itemBuffer = "";

    const findMatchingItem = (text: string) => {
      // First try exact match
      if (menuItems[text]) {
        return menuItems[text];
      }

      // Then try aliases and partial matches
      for (const [key, item] of Object.entries(menuItems)) {
        if (
          item.aliases.includes(text) ||
          key.includes(text) ||
          text.includes(key) ||
          item.aliases.some((alias) => text.includes(alias))
        ) {
          return item;
        }
      }
      return null;
    };

    words.forEach((word) => {
      // Check if the word is a number or quantity word
      if (!isNaN(Number(word))) {
        currentQuantity = Number(word);
        return;
      }
      if (quantityWords[word]) {
        currentQuantity = quantityWords[word];
        return;
      }

      // Build potential menu item name
      itemBuffer = itemBuffer ? `${itemBuffer} ${word}` : word;

      // Try to find matching item
      const matchedItem = findMatchingItem(itemBuffer);
      if (matchedItem) {
        if (foundItems.has(matchedItem.name)) {
          const existing = foundItems.get(matchedItem.name);
          foundItems.set(matchedItem.name, {
            ...existing,
            quantity: existing.quantity + currentQuantity,
          });
        } else {
          foundItems.set(matchedItem.name, {
            name: matchedItem.name,
            quantity: currentQuantity,
            price: matchedItem.price,
          });
        }
        itemBuffer = "";
        currentQuantity = 1;
        return;
      }

      // Check if we should clear the buffer and add to not found items
      if (itemBuffer.split(" ").length >= 2) {
        const potentialMatches = Object.keys(menuItems).filter(
          (item) => item.includes(itemBuffer) || itemBuffer.includes(item)
        );
        if (potentialMatches.length === 0) {
          notFoundItems.push(itemBuffer);
          itemBuffer = word;
        }
      }
    });

    setInvalidItems(notFoundItems);
    return Array.from(foundItems.values());
  };

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // @ts-ignore - webkitSpeechRecognition is not in the types
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setTranscript((prev) => prev + "\n\nCustomer: " + finalTranscript);
          conversationRef.current.push(finalTranscript);
          processTranscript(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const processTranscript = (text: string) => {
    if (
      text.toLowerCase().includes("order") ||
      text.toLowerCase().includes("burger") ||
      text.toLowerCase().includes("pasta") ||
      text.toLowerCase().includes("would like")
    ) {
      // Clear previous order when starting a new one
      if (
        text.toLowerCase().includes("would like") ||
        text.toLowerCase().includes("i want") ||
        text.toLowerCase().includes("order")
      ) {
        setOrderDetails(null);
      }

      const items = extractMenuItems(text);

      if (items.length > 0) {
        const total = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        setOrderDetails({
          items,
          customerName: "",
          phoneNumber: "",
          address: "",
          deliveryTime: "",
          total,
        });

        setTimeout(() => {
          let response = "I've found the following items in your order:\n";
          items.forEach((item) => {
            response += `${item.quantity}x ${
              item.name
            } at $${item.price.toFixed(2)} each\n`;
          });

          response += "\nWould you like to add anything else to your order?";

          setTranscript((prev) => prev + "\n\nAssistant: " + response);
          conversationRef.current.push(response);
        }, 1000);
      } else {
        setTimeout(() => {
          const response =
            "I apologize, but I couldn't identify those items in our menu. Could you please try again? You can say something like 'I would like one pasta and one burger'.";
          setTranscript((prev) => prev + "\n\nAssistant: " + response);
          conversationRef.current.push(response);
        }, 1000);
      }
      return;
    }

    // Add this condition right after the order processing section
    if (
      orderDetails &&
      !orderDetails.customerName &&
      (text.toLowerCase().includes("no") ||
        text.toLowerCase().includes("that's everything") ||
        text.toLowerCase().includes("thats everything") ||
        text.toLowerCase().includes("that's all") ||
        text.toLowerCase().includes("thats all"))
    ) {
      setTimeout(() => {
        const nextMessage = "Great! Can I get your name for the order?";
        setTranscript((prev) => prev + "\n\nAssistant: " + nextMessage);
        conversationRef.current.push(nextMessage);
      }, 1000);
      return;
    }

    // Extract customer name
    if (
      orderDetails &&
      !orderDetails.customerName &&
      text.length > 0 &&
      !text.toLowerCase().includes("no") &&
      !text.toLowerCase().includes("that's") &&
      !text.toLowerCase().includes("thats")
    ) {
      const nameMatch = text.match(/my name is (\w+)/i) || text.match(/(\w+)/i);
      if (nameMatch && nameMatch[1]) {
        setOrderDetails({
          ...orderDetails,
          customerName: nameMatch[1],
        });

        setTimeout(() => {
          const nextMessage = "Thank you. Could I have your phone number?";
          setTranscript((prev) => prev + "\n\nAssistant: " + nextMessage);
          conversationRef.current.push(nextMessage);
        }, 1000);
      }
      return;
    }

    // Extract phone number
    if (
      orderDetails &&
      orderDetails.customerName &&
      !orderDetails.phoneNumber &&
      text.length > 0
    ) {
      const phoneMatch = text.match(
        /(\d{3}[-.\s]??\d{3}[-.\s]??\d{4}|$$\d{3}$$\s*\d{3}[-.\s]??\d{4}|\d{10})/g
      );
      if (phoneMatch) {
        setOrderDetails({
          ...orderDetails,
          phoneNumber: phoneMatch[0],
        });

        setTimeout(() => {
          const nextMessage = assistantMessages[5];
          setTranscript((prev) => prev + "\n\nAssistant: " + nextMessage);
          conversationRef.current.push(nextMessage);
        }, 1000);
      }
      return;
    }

    // Handle delivery/pickup choice and address
    if (
      orderDetails &&
      orderDetails.customerName &&
      orderDetails.phoneNumber &&
      !orderDetails.address
    ) {
      if (text.toLowerCase().includes("delivery")) {
        setTimeout(() => {
          const nextMessage = assistantMessages[6];
          setTranscript((prev) => prev + "\n\nAssistant: " + nextMessage);
          conversationRef.current.push(nextMessage);
        }, 1000);
      } else if (text.length > 10 && !text.toLowerCase().includes("pickup")) {
        setOrderDetails({
          ...orderDetails,
          address: text,
        });

        setTimeout(() => {
          const nextMessage = assistantMessages[7];
          setTranscript((prev) => prev + "\n\nAssistant: " + nextMessage);
          conversationRef.current.push(nextMessage);
        }, 1000);
      }
      return;
    }

    // Handle delivery time
    if (
      orderDetails &&
      orderDetails.customerName &&
      orderDetails.phoneNumber &&
      orderDetails.address &&
      !orderDetails.deliveryTime &&
      text.length > 0
    ) {
      setOrderDetails({
        ...orderDetails,
        deliveryTime: text,
      });

      // Move to confirmation
      setTimeout(() => {
        setConfirmationStep(1);
        const nextMessage = assistantMessages[8];
        setTranscript((prev) => prev + "\n\nAssistant: " + nextMessage);
        conversationRef.current.push(nextMessage);

        // List the items and total
        const itemsList = orderDetails.items
          .map(
            (item) =>
              `${item.quantity}x ${item.name} at $${item.price.toFixed(2)} each`
          )
          .join("\n");
        setTranscript((prev) => prev + "\n" + itemsList);
        setTranscript(
          (prev) => prev + `\n\nTotal: $${orderDetails.total.toFixed(2)}`
        );

        // Add confirmation question
        setTimeout(() => {
          setTranscript(
            (prev) =>
              prev +
              "\n\nIs this order correct? Please say yes to confirm or no to start over."
          );
          setConfirmationStep(2);
        }, 2000);
      }, 1000);
      return;
    }

    // Handle confirmation
    if (confirmationStep === 2) {
      if (text.toLowerCase().includes("yes")) {
        setOrderConfirmed(true);
        setTranscript(
          (prev) =>
            prev +
            "\n\nAssistant: Great! Your order total is $" +
            orderDetails!.total.toFixed(2) +
            ". " +
            "Would you like to proceed with payment? You can say 'yes' to pay now or 'no' to pay at delivery."
        );
        setConfirmationStep(3);
      } else if (text.toLowerCase().includes("no")) {
        // Reset order and start over
        setOrderDetails(null);
        setConfirmationStep(0);
        setTranscript(
          (prev) =>
            prev +
            "\n\nAssistant: I apologize for any mistakes. Let's start over. What would you like to order?"
        );
      }
      return;
    }

    // Handle payment choice
    if (confirmationStep === 3) {
      if (text.toLowerCase().includes("yes")) {
        setPaymentStep("processing");
        setTranscript(
          (prev) =>
            prev +
            "\n\nAssistant: I'll transfer you to our secure payment system now. You can complete your payment there."
        );
        // End the call after confirmation
        setTimeout(() => {
          endCall();
        }, 3000);
      } else if (text.toLowerCase().includes("no")) {
        setTranscript(
          (prev) =>
            prev +
            "\n\nAssistant: No problem! You can pay at delivery. Your order has been confirmed and will be prepared. " +
            "You can track your order status on our website. Have a great day!"
        );
        // End the call after confirmation
        setTimeout(() => {
          endCall();
        }, 3000);
      }
    }
  };

  const startCall = () => {
    setCallStatus("connecting");
    setTimeout(() => {
      setCallStatus("active");
      startRecording();
      setTranscript(assistantMessages[0]);
      conversationRef.current.push(assistantMessages[0]);
    }, 1500);
  };

  const endCall = () => {
    stopRecording();
    setCallStatus("completed");
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setRecording(true);
    } else {
      simulateConversation();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecording(false);
    }
  };

  const simulateConversation = () => {
    let messageIndex = 0;

    const simulationInterval = setInterval(() => {
      if (messageIndex < simulatedResponses.length) {
        const response = simulatedResponses[messageIndex];
        setTranscript((prev) => prev + "\n\nCustomer: " + response);
        conversationRef.current.push(response);
        processTranscript(response);
        messageIndex++;
      } else {
        clearInterval(simulationInterval);
      }
    }, 3000);

    return () => clearInterval(simulationInterval);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Voice Assistant Demo
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Experience how our AI-powered voice assistant takes your order
                  over the phone.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-12">
              <Tabs defaultValue="demo" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="demo">Voice Demo</TabsTrigger>
                  <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
                </TabsList>
                <TabsContent value="demo" className="pt-6">
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>Phone Order Simulation</CardTitle>
                      <CardDescription>
                        This demo simulates how our voice assistant handles
                        phone orders.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-center gap-4">
                        {callStatus === "idle" && (
                          <Button onClick={startCall} className="gap-2">
                            <Phone className="h-5 w-5" />
                            Start Call Demo
                          </Button>
                        )}
                        {callStatus === "connecting" && (
                          <Button disabled className="gap-2">
                            <Phone className="h-5 w-5 animate-pulse" />
                            Connecting...
                          </Button>
                        )}
                        {callStatus === "active" && (
                          <>
                            <Button
                              onClick={endCall}
                              variant="destructive"
                              className="gap-2"
                            >
                              <PhoneOff className="h-5 w-5" />
                              End Call
                            </Button>
                            {recording ? (
                              <Button
                                onClick={stopRecording}
                                variant="outline"
                                className="gap-2"
                              >
                                <MicOff className="h-5 w-5" />
                                Stop Microphone
                              </Button>
                            ) : (
                              <Button
                                onClick={startRecording}
                                variant="outline"
                                className="gap-2"
                              >
                                <Mic className="h-5 w-5" />
                                Start Microphone
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <Label htmlFor="conversation">Conversation</Label>
                        <div className="relative">
                          <Textarea
                            id="conversation"
                            value={transcript}
                            readOnly
                            className="min-h-[300px] font-mono text-sm"
                          />
                          {recording && (
                            <div className="absolute bottom-3 right-3">
                              <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                            </div>
                          )}
                        </div>
                      </div>
                      {orderConfirmed && orderDetails && (
                        <div className="rounded-lg border bg-muted p-4">
                          <h3 className="text-lg font-semibold">
                            Order Confirmed!
                          </h3>
                          <div className="mt-4 space-y-2">
                            <div className="space-y-1">
                              <h4 className="font-medium">Order Details:</h4>
                              {orderDetails.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between"
                                >
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span>
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                              <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                  <span>Total:</span>
                                  <span>${orderDetails.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-medium">
                                Delivery Information:
                              </h4>
                              <p>{orderDetails.customerName}</p>
                              <p>{orderDetails.address}</p>
                              <p>{orderDetails.phoneNumber}</p>
                              <p>Requested Time: {orderDetails.deliveryTime}</p>
                            </div>
                            <div className="space-y-2 pt-4">
                              <h4 className="font-medium">Payment</h4>
                              {paymentStep === "idle" && (
                                <div className="flex gap-2">
                                  <Link
                                    href={`/online-order?orderId=${orderDetails.customerName}&total=${orderDetails.total}&step=payment`}
                                    className="flex-1"
                                  >
                                    <Button className="w-full">Pay Now</Button>
                                  </Link>
                                  <Link
                                    href="/order-tracking"
                                    className="flex-1"
                                  >
                                    <Button
                                      variant="outline"
                                      className="w-full"
                                    >
                                      Pay at Delivery
                                    </Button>
                                  </Link>
                                </div>
                              )}
                              {paymentStep === "processing" && (
                                <div className="text-center py-2">
                                  <p>Redirecting to payment...</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex flex-col items-start gap-2">
                      <p className="text-sm text-muted-foreground">
                        Note: This is a simulation. In a real implementation,
                        this would connect to a telephony system.
                      </p>
                      {!orderDetails && callStatus === "active" && (
                        <p className="text-sm">
                          Try saying: "I'd like to order two signature pasta and
                          one gourmet burger"
                        </p>
                      )}
                    </CardFooter>
                  </Card>
                </TabsContent>
                <TabsContent value="how-it-works" className="pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>How Our Voice Assistant Works</CardTitle>
                      <CardDescription>
                        Learn about the technology behind our automated
                        order-taking system.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                          1. Menu Recognition
                        </h3>
                        <p className="text-muted-foreground">
                          The system recognizes menu items from your speech and
                          validates them against our current menu.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                          2. Order Processing
                        </h3>
                        <p className="text-muted-foreground">
                          Once menu items are confirmed, the system collects
                          delivery information and calculates the total.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                          3. Confirmation
                        </h3>
                        <p className="text-muted-foreground">
                          The system confirms your order details and provides an
                          order number for tracking.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
