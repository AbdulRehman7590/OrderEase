import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, ChefHat, Users, Target } from "lucide-react";

const innovationTimeline = [
  {
    year: "2015",
    title: "Online Ordering",
    description:
      "Launched our first online ordering system, allowing customers to place orders through our website.",
    icon: <ChefHat className="h-8 w-8" />,
  },
  {
    year: "2019",
    title: "Mobile App",
    description:
      "Implemented a mobile app with real-time order tracking and personalized recommendations.",
    icon: <Users className="h-8 w-8" />,
  },
  {
    year: "2023",
    title: "AI Assistant",
    description:
      "Introduced our AI-powered voice assistant for automated phone orders, revolutionizing the process.",
    icon: <Target className="h-8 w-8" />,
  },
];

const team = [
  {
    name: "Abdul Rehman",
    role: "Executive Chef",
    bio: "With over 15 years of culinary experience, Abdul Rehman brings creativity and expertise to every dish.",
    image: "/placeholder.svg?height=400&width=400&text=Chef+Maria",
  },
  {
    name: "Mudasir Ahmad",
    role: "Technology Director",
    bio: "Mudasir leads our tech initiatives, including the development of our innovative voice assistant.",
    image: "/placeholder.svg?height=400&width=400&text=Alex+Chen",
  },
  {
    name: "Abdul Rahman",
    role: "Customer Experience Manager",
    bio: "Abdul ensures that every customer interaction, whether in-person or digital, exceeds expectations.",
    image: "/placeholder.svg?height=400&width=400&text=Sarah+Johnson",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-[130px] bg-gradient-to-br from-indigo-900 to-indigo-700 text-white">
          <div className="container px-4 md:px-6 w-full max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-sm font-medium">Since 2010</p>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl">
                  Our <span className="text-yellow-300">Delicious</span> Story
                </h1>
                <p className="text-lg md:text-xl text-indigo-100">
                  Order Ease was founded with a simple mission: to serve
                  delicious, high-quality food while embracing innovative
                  technology to enhance the dining experience.
                </p>
                <p className="text-lg md:text-xl text-indigo-100">
                  What started as a small family restaurant has grown into a
                  beloved establishment known for both its culinary excellence
                  and technological innovation.
                </p>
                <div className="flex gap-4 pt-4">
                  <Link href="/menu">
                    <Button
                      size="lg"
                      className="bg-yellow-400 font-semibold hover:bg-yellow-300 text-white hover:text-indigo-800 transition-all duration-300"
                    >
                      View Menu
                    </Button>
                  </Link>
                  <Link href="/reservations">
                    <Button
                      size="lg"
                      variant="outline"
                      className="hover:text-white text-indigo-800 font-semibold border-white hover:bg-white/10"
                    >
                      Book a Table
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center relative">
                <div className="absolute -inset-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"></div>
                <img
                  src="/placeholder.svg?height=500&width=700&text=Restaurant+Interior"
                  alt="Restaurant interior"
                  className="relative rounded-xl object-cover shadow-2xl border-2 border-white/20"
                  width={700}
                  height={500}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Innovation Section */}
        <section className="w-full py-12 md:py-20 lg:py-28 bg-white">
          <div className="container px-4 md:px-6 w-full max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 p-4">
                <Calendar className="h-8 w-8 text-indigo-700" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent">
                Our Innovation Journey
              </h2>
              <p className="max-w-[800px] text-gray-600 text-lg">
                We've always been at the forefront of adopting new technologies
                to improve our service and customer experience.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 lg:grid-cols-3">
              {innovationTimeline.map((item, index) => (
                <Card
                  key={index}
                  className="p-8 border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-indigo-100 text-indigo-700">
                        {item.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {item.year}
                      </h3>
                    </div>
                    <h4 className="text-xl font-semibold text-indigo-700">
                      {item.title}
                    </h4>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-20 lg:py-28 bg-gray-50">
          <div className="container px-4 md:px-6 w-full max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-indigo-100 p-4">
                <Users className="h-8 w-8 text-indigo-700" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-to-r from-indigo-800 to-indigo-600 bg-clip-text text-transparent">
                Meet Our Team
              </h2>
              <p className="max-w-[800px] text-gray-600 text-lg">
                The passionate people behind Order Ease.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              {team.map((person, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="aspect-square object-cover w-full group-hover:scale-105 transition-transform duration-500"
                      width={400}
                      height={400}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {person.name}
                    </h3>
                    <p className="text-sm font-medium text-indigo-600">
                      {person.role}
                    </p>
                    <p className="text-gray-600 mt-2">{person.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full py-12 md:py-20 lg:py-24 bg-gradient-to-br from-indigo-900 to-indigo-700 text-white">
          <div className="container px-4 md:px-6 w-full max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="inline-flex items-center justify-center rounded-full bg-white/20 p-4 backdrop-blur-sm">
                <Target className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Our Mission
              </h2>
              <p className="max-w-[800px] text-indigo-100 text-lg">
                To combine culinary excellence with technological innovation,
                creating memorable dining experiences for our customers.
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-6">
                <Link href="/menu">
                  <Button
                    size="lg"
                    className="bg-white text-md text-indigo-800 hover:bg-gray-100 hover:font-semibold transition-all duration-300"
                  >
                    Explore Our Menu
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="bg-white text-md text-indigo-800 hover:bg-gray-100 hover:font-semibold transition-all duration-300"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
