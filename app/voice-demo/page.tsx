"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Phone,
  Info,
  Check,
  User,
  MapPin,
  Calendar,
  Shield,
  Activity,
  Mic,
  PhoneOff,
  MicOff,
  Loader2,
  ChevronRight,
  AlertCircle,
  ListOrdered,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Define types for our order data
type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  special?: string;
};

type OrderDetails = {
  items: OrderItem[];
  customerName: string;
  phoneNumber: string;
  address: string;
  deliveryTime: string;
  total: number;
  deliveryType: "delivery" | "pickup";
};

type OrderStatus = "pending" | "confirmed" | "completed" | "cancelled";

type Order = {
  _id: string;
  items: OrderItem[];
  customerName: string;
  phoneNumber: string;
  address: string;
  deliveryTime: string;
  total: number;
  deliveryType: "delivery" | "pickup";
  status: OrderStatus;
  createdAt: string;
};

export default function VoiceDemoPage() {
  // State for call management
  const [callStatus, setCallStatus] = useState<
    "idle" | "connecting" | "active" | "completed"
  >("idle");
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [confirmationStep, setConfirmationStep] = useState(0);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [invalidItems, setInvalidItems] = useState<string[]>([]);
  const [paymentStep, setPaymentStep] = useState<
    "idle" | "processing" | "completed"
  >("idle");
  const [isProcessing, setIsProcessing] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("demo");

  const recognitionRef = useRef<any>(null);
  const conversationRef = useRef<string[]>([]);
  const speechTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      if (!Array.isArray(data.orders)) throw new Error("Unexpected data");
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Call backend API to process voice input
  const callBackendAPI = async (text: string) => {
    try {
      setIsProcessing(true);
      setBackendError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/voice-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript: text,
            currentOrder: orderDetails,
            confirmationStep,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Backend processing failed");
      }

      const data = await response.json();

      if (data.response) {
        setTranscript((prev) => prev + "\n\nAssistant: " + data.response);
        speak(data.response);
        conversationRef.current.push(data.response);
      }

      if (data.orderDetails) {
        setOrderDetails(data.orderDetails);
      }

      if (data.confirmationStep !== undefined) {
        setConfirmationStep(data.confirmationStep);
      }

      if (data.orderConfirmed !== undefined) {
        setOrderConfirmed(data.orderConfirmed);
        if (data.orderConfirmed) {
          fetchOrders(); // Refresh orders when new order is confirmed
        }
      }

      if (data.invalidItems) {
        setInvalidItems(data.invalidItems);
      }

      setIsProcessing(false);
      return data;
    } catch (error) {
      console.error("Error calling backend:", error);
      setBackendError(
        "Sorry, we're experiencing technical difficulties. Please try again."
      );
      setIsProcessing(false);
      return null;
    }
  };

  // Text-to-speech function
  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;

      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }

      speechTimeoutRef.current = setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 300);
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

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
          const customerText = "Customer: " + finalTranscript;
          setTranscript((prev) => prev + "\n\n" + customerText);
          conversationRef.current.push(finalTranscript);
          callBackendAPI(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === "no-speech") {
          const noSpeechMessage =
            "I didn't catch that. Could you please repeat?";
          setTranscript((prev) => prev + "\n\nAssistant: " + noSpeechMessage);
          speak(noSpeechMessage);
        }
      };

      recognitionRef.current.onend = () => {
        if (recording) {
          recognitionRef.current.start();
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
    };
  }, [recording]);

  // Call management functions
  const startCall = () => {
    setCallStatus("connecting");
    setTimeout(() => {
      setCallStatus("active");
      const greeting =
        "Hello! Thank you for calling. How can I help you with your order today?";
      setTranscript("Assistant: " + greeting);
      speak(greeting);
      startRecording();
      conversationRef.current.push(greeting);
    }, 1500);
  };

  const endCall = () => {
    stopRecording();
    setCallStatus("completed");
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current);
    }
    window.speechSynthesis.cancel();
  };

  const startRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setRecording(true);
      } catch (error) {
        console.error("Error starting recognition:", error);
        setTimeout(() => {
          startRecording();
        }, 500);
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecording(false);
    }
  };

  // Fetch orders when component mounts and when tab changes to orders
  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  // Render status icon
  const renderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="flex-1">
        <section className="w-full pt-[150px] pb-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Voice Order Assistant
                  </span>
                </h1>
                <p className="max-w-[700px] text-lg text-gray-600 md:text-xl">
                  Experience our AI-powered voice assistant that takes your
                  orders naturally, just like a real phone call.
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-5xl py-12">
              <Tabs
                defaultValue="demo"
                className="w-full"
                onValueChange={(value) => setActiveTab(value)}
              >
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1.5 rounded-xl">
                  <TabsTrigger
                    value="demo"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Live Demo
                  </TabsTrigger>
                  <TabsTrigger
                    value="how-it-works"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    How It Works
                  </TabsTrigger>
                  <TabsTrigger
                    value="orders"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg py-2"
                  >
                    <ListOrdered className="mr-2 h-4 w-4" />
                    My Orders
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="demo" className="pt-6">
                  <Card className="w-full border-0 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white text-2xl">
                            Phone Order Simulation
                          </CardTitle>
                          <CardDescription className="text-blue-100">
                            Interact with our voice assistant to place an order
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="flex flex-col items-center justify-center gap-4">
                        {callStatus === "idle" && (
                          <Button
                            onClick={startCall}
                            className="gap-2 px-8 py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all transform hover:scale-105"
                          >
                            <Phone className="h-6 w-6" />
                            <span className="text-lg">Start Call Demo</span>
                          </Button>
                        )}
                        {callStatus === "connecting" && (
                          <Button
                            disabled
                            className="gap-2 px-8 py-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-75"
                          >
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span className="text-lg">Connecting...</span>
                          </Button>
                        )}
                        {callStatus === "active" && (
                          <div className="flex flex-col items-center w-full">
                            <div className="flex gap-4 mb-6">
                              <Button
                                onClick={endCall}
                                variant="destructive"
                                className="gap-2 px-6 py-4 rounded-xl shadow-md"
                              >
                                <PhoneOff className="h-5 w-5" />
                                End Call
                              </Button>
                              {recording ? (
                                <Button
                                  onClick={stopRecording}
                                  variant="outline"
                                  className="gap-2 px-6 py-4 rounded-xl border-red-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <MicOff className="h-5 w-5" />
                                  Stop Microphone
                                </Button>
                              ) : (
                                <Button
                                  onClick={startRecording}
                                  variant="outline"
                                  className="gap-2 px-6 py-4 rounded-xl border-blue-300 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Mic className="h-5 w-5" />
                                  Start Microphone
                                </Button>
                              )}
                            </div>

                            <div className="relative w-full">
                              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur opacity-25"></div>
                              <div className="relative bg-white rounded-lg p-1 shadow-lg">
                                {backendError && (
                                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-2">
                                    <div className="flex items-center">
                                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                      <p className="text-sm text-red-700">
                                        {backendError}
                                      </p>
                                    </div>
                                  </div>
                                )}
                                <Textarea
                                  id="conversation"
                                  value={transcript}
                                  readOnly
                                  className="min-h-[300px] font-mono text-sm border-0 focus-visible:ring-0"
                                />
                                {recording && (
                                  <div className="absolute bottom-4 right-4 flex items-center">
                                    <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse mr-2"></div>
                                    <span className="text-xs text-gray-500">
                                      Recording
                                    </span>
                                  </div>
                                )}
                                {isProcessing && (
                                  <div className="absolute bottom-4 left-4 flex items-center">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-2" />
                                    <span className="text-xs text-gray-500">
                                      Processing...
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {orderConfirmed && orderDetails && (
                        <div className="rounded-xl border bg-white p-6 shadow-sm">
                          <div className="flex items-center mb-4">
                            <div className="bg-green-100 p-2 rounded-full mr-3">
                              <Check className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              Order Confirmed!
                            </h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <h4 className="font-medium text-gray-700 border-b pb-2">
                                Order Details
                              </h4>
                              <div className="space-y-3">
                                {orderDetails.items.map((item, index) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center py-1"
                                  >
                                    <div className="flex items-center">
                                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-3">
                                        {item.quantity}x
                                      </span>
                                      <span className="font-medium text-gray-800">
                                        {item.name}
                                      </span>
                                    </div>
                                    <span className="font-medium text-gray-900">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t pt-3 mt-3">
                                <div className="flex justify-between font-bold text-lg">
                                  <span>Total:</span>
                                  <span>${orderDetails.total.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <h4 className="font-medium text-gray-700 border-b pb-2">
                                {orderDetails.deliveryType === "delivery"
                                  ? "Delivery Information"
                                  : "Pickup Information"}
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-start">
                                  <User className="text-gray-500 mt-0.5 mr-2 h-4 w-4" />
                                  <span className="text-gray-800">
                                    {orderDetails.customerName}
                                  </span>
                                </div>
                                <div className="flex items-start">
                                  <Phone className="text-gray-500 mt-0.5 mr-2 h-4 w-4" />
                                  <span className="text-gray-800">
                                    {orderDetails.phoneNumber}
                                  </span>
                                </div>
                                <div className="flex items-start">
                                  <MapPin className="text-gray-500 mt-0.5 mr-2 h-4 w-4" />
                                  <span className="text-gray-800">
                                    {orderDetails.address}
                                  </span>
                                </div>
                                <div className="flex items-start">
                                  <Calendar className="text-gray-500 mt-0.5 mr-2 h-4 w-4" />
                                  <span className="text-gray-800">
                                    {orderDetails.deliveryType === "delivery"
                                      ? `Delivery Time: ${orderDetails.deliveryTime}`
                                      : `Pickup Time: ${orderDetails.deliveryTime}`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="mt-6 pt-6 border-t">
                            <h4 className="font-medium text-gray-700 mb-4">
                              Payment Options
                            </h4>
                            {paymentStep === "idle" && (
                              <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                  href={`/online-order?orderId=${orderDetails.customerName}&total=${orderDetails.total}&step=payment`}
                                  className="flex-1"
                                >
                                  <Button className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md">
                                    Pay Now Securely
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link href="/order-tracking" className="flex-1">
                                  <Button
                                    variant="outline"
                                    className="w-full py-6 border-gray-300 hover:bg-gray-50"
                                  >
                                    Pay at{" "}
                                    {orderDetails.deliveryType === "delivery"
                                      ? "Delivery"
                                      : "Pickup"}
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                  </Button>
                                </Link>
                              </div>
                            )}
                            {paymentStep === "processing" && (
                              <div className="text-center py-4 bg-blue-50 rounded-lg">
                                <div className="inline-flex items-center">
                                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" />
                                  <span className="text-blue-600 font-medium">
                                    Redirecting to secure payment...
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-6 border-t">
                      <div className="w-full">
                        <p className="text-sm text-gray-500 mb-3">
                          Note: This is a simulation. In a real implementation,
                          this would connect to a telephony system.
                        </p>
                        {!orderDetails && callStatus === "active" && (
                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div className="flex items-start">
                              <Info className="text-blue-500 mt-0.5 mr-2 h-4 w-4 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-gray-700 mb-1">
                                  Try saying:
                                </p>
                                <p className="text-sm text-gray-600">
                                  "I'd like to order two signature pasta and one
                                  gourmet burger"
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="how-it-works" className="pt-6">
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                      <CardTitle className="text-white text-2xl">
                        How Our Voice Assistant Works
                      </CardTitle>
                      <CardDescription className="text-blue-100">
                        The technology behind our automated order-taking system
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Mic className="text-blue-600 h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Speech Recognition
                          </h3>
                          <p className="text-gray-600">
                            Our system converts your spoken words into text with
                            high accuracy, even in noisy environments.
                          </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                          <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Shield className="text-indigo-600 h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Menu Understanding
                          </h3>
                          <p className="text-gray-600">
                            The AI understands menu items, quantities, and
                            special requests, validating them against our
                            current offerings.
                          </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                            <Activity className="text-purple-600 h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Natural Conversation
                          </h3>
                          <p className="text-gray-600">
                            The assistant engages in natural dialogue, asking
                            follow-up questions just like a human would.
                          </p>
                        </div>
                      </div>
                      <div className="mt-8 pt-8 border-t">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">
                          Benefits of Our Voice Ordering System
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-start">
                            <div className="bg-green-100 p-2 rounded-full mr-4 flex-shrink-0">
                              <Shield className="text-green-600 h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                Faster Order Processing
                              </h4>
                              <p className="text-gray-600">
                                Reduce wait times by 40% compared to traditional
                                phone orders.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-blue-100 p-2 rounded-full mr-4 flex-shrink-0">
                              <Activity className="text-blue-600 h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                24/7 Availability
                              </h4>
                              <p className="text-gray-600">
                                Take orders anytime, even outside business
                                hours.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-purple-100 p-2 rounded-full mr-4 flex-shrink-0">
                              <Shield className="text-purple-600 h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                Reduced Errors
                              </h4>
                              <p className="text-gray-600">
                                Eliminate miscommunication with accurate order
                                capture.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start">
                            <div className="bg-orange-100 p-2 rounded-full mr-4 flex-shrink-0">
                              <Mic className="text-orange-600 h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">
                                Multilingual Support
                              </h4>
                              <p className="text-gray-600">
                                Coming soon: Order in multiple languages with
                                the same accuracy.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders" className="pt-6">
                  <Card className="border-0 shadow-lg overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                      <CardTitle className="text-white text-2xl">
                        Your Orders
                      </CardTitle>
                      <CardDescription className="text-blue-100">
                        View and manage your past and current orders
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      {orders.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500">No orders found</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {orders.map((order) => (
                            <div
                              key={order._id}
                              className="border rounded-lg p-4 bg-white shadow-sm"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    Order #{order._id.substring(0, 8)}
                                  </h3>
                                  <p className="text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleString()}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  {renderStatusIcon(order.status)}
                                  <span className="ml-2 text-sm font-medium">
                                    {order.status.charAt(0).toUpperCase() +
                                      order.status.slice(1)}
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Items
                                  </h4>
                                  <ul className="space-y-1">
                                    {order.items.map((item, index) => (
                                      <li
                                        key={index}
                                        className="flex justify-between"
                                      >
                                        <span>
                                          {item.quantity}x {item.name}
                                        </span>
                                        <span>
                                          $
                                          {(item.price * item.quantity).toFixed(
                                            2
                                          )}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="border-t mt-2 pt-2 font-medium">
                                    <div className="flex justify-between">
                                      <span>Total:</span>
                                      <span>${order.total.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    {order.deliveryType === "delivery"
                                      ? "Delivery"
                                      : "Pickup"}{" "}
                                    Details
                                  </h4>
                                  <div className="space-y-1">
                                    <div className="flex items-start">
                                      <User className="text-gray-500 mt-0.5 mr-2 h-4 w-4" />
                                      <span>{order.customerName}</span>
                                    </div>
                                    <div className="flex items-start">
                                      <Phone className="text-gray-500 mt-0.5 mr-2 h-4 w-4" />
                                      <span>{order.phoneNumber}</span>
                                    </div>
                                    {order.deliveryType === "delivery" && (
                                      <div className="flex items-start">
                                        <MapPin className="text-gray-500 mt-0.5 mr-2 h-4 w-4" />
                                        <span>{order.address}</span>
                                      </div>
                                    )}
                                    <div className="flex items-start">
                                      <Clock className="text-gray-500 mt-0.5 mr-2 h-4 w-4" />
                                      <span>
                                        {order.deliveryType === "delivery"
                                          ? `Delivery Time: ${order.deliveryTime}`
                                          : `Pickup Time: ${order.deliveryTime}`}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
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
