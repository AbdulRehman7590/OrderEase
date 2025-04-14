import { CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Mail, MapPin, Phone, Clock, MessageSquare, User } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <main className="flex-1 mx-auto w-full max-w-7xl">
        <section className="w-full pt-[130px]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                  Get in Touch
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent">
                  Contact Us
                </h1>
                <p className="max-w-[700px] text-gray-600 md:text-xl">
                  We'd love to hear from you. Reach out with any questions or
                  feedback.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2">
              <div>
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-indigo-800">
                      Send Us a Message
                    </CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you soon.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700">
                        <User className="inline h-4 w-4 mr-2" />
                        Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">
                        <Mail className="inline h-4 w-4 mr-2" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-700">
                        <MessageSquare className="inline h-4 w-4 mr-2" />
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        placeholder="What is this regarding?"
                        className="focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700">
                        Your Message
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Your message"
                        className="min-h-[150px] focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-gradient-to-r from-indigo-800 to-indigo-600 hover:from-indigo-700 hover:to-indigo-500 transition-all duration-300">
                      Send Message
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-indigo-800">
                      Contact Information
                    </CardTitle>
                    <CardDescription>
                      Here's how you can reach us directly.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-indigo-100 text-indigo-800">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Phone</h3>
                        <p className="text-gray-600">(555) 123-4567</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Available daily from 10:00 AM to 10:00 PM
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-indigo-100 text-indigo-800">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Email</h3>
                        <p className="text-gray-600">info@savorybites.com</p>
                        <p className="text-sm text-gray-500 mt-1">
                          We typically respond within 24 hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-full bg-indigo-100 text-indigo-800">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">Location</h3>
                        <p className="text-gray-600">123 Main Street</p>
                        <p className="text-gray-600">New York, NY 10001</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-indigo-800">
                      Hours of Operation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-full bg-indigo-100 text-indigo-800">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-700">
                            Monday - Thursday
                          </span>
                          <span className="text-gray-600">
                            11:00 AM - 9:00 PM
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                          <span className="text-gray-700">
                            Friday - Saturday
                          </span>
                          <span className="text-gray-600">
                            11:00 AM - 10:00 PM
                          </span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span className="text-gray-700">Sunday</span>
                          <span className="text-gray-600">
                            12:00 PM - 8:00 PM
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="relative h-[300px] w-full bg-indigo-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-800/20 to-transparent"></div>
                    <MapPin className="h-12 w-12 text-indigo-600" />
                    <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-sm">
                      <p className="font-medium text-indigo-800">
                        Our Location
                      </p>
                      <p className="text-sm text-gray-600">
                        123 Main Street, NY
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
