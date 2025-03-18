import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Our Story
                </h1>
                <p className="text-muted-foreground md:text-xl">
                  Savory Bites was founded in 2010 with a simple mission: to
                  serve delicious, high-quality food while embracing innovative
                  technology to enhance the dining experience.
                </p>
                <p className="text-muted-foreground md:text-xl">
                  What started as a small family restaurant has grown into a
                  beloved establishment known for both its culinary excellence
                  and technological innovation.
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src="/placeholder.svg?height=400&width=600&text=Restaurant+Interior"
                  alt="Restaurant interior"
                  className="rounded-lg object-cover"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Our Innovation Journey
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We&apos;ve always been at the forefront of adopting new
                  technologies to improve our service and customer experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card className="p-6">
                <CardContent className="p-0 space-y-2">
                  <h3 className="text-xl font-bold">2015</h3>
                  <p className="text-muted-foreground">
                    Launched our first online ordering system, allowing
                    customers to place orders through our website.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardContent className="p-0 space-y-2">
                  <h3 className="text-xl font-bold">2019</h3>
                  <p className="text-muted-foreground">
                    Implemented a mobile app with real-time order tracking and
                    personalized recommendations.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardContent className="p-0 space-y-2">
                  <h3 className="text-xl font-bold">2023</h3>
                  <p className="text-muted-foreground">
                    Introduced our AI-powered voice assistant for automated
                    phone orders, revolutionizing the ordering process.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Meet Our Team
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The passionate people behind Savory Bites.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Chef Maria Rodriguez",
                  role: "Executive Chef",
                  bio: "With over 15 years of culinary experience, Maria brings creativity and expertise to every dish.",
                  image:
                    "/placeholder.svg?height=300&width=300&text=Chef+Maria",
                },
                {
                  name: "Alex Chen",
                  role: "Technology Director",
                  bio: "Alex leads our tech initiatives, including the development of our innovative voice assistant.",
                  image: "/placeholder.svg?height=300&width=300&text=Alex+Chen",
                },
                {
                  name: "Sarah Johnson",
                  role: "Customer Experience Manager",
                  bio: "Sarah ensures that every customer interaction, whether in-person or digital, exceeds expectations.",
                  image:
                    "/placeholder.svg?height=300&width=300&text=Sarah+Johnson",
                },
              ].map((person, index) => (
                <Card key={index} className="overflow-hidden">
                  <img
                    src={person.image || "/placeholder.svg"}
                    alt={person.name}
                    className="aspect-square object-cover w-full"
                    width={300}
                    height={300}
                  />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold">{person.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {person.role}
                    </p>
                    <p className="mt-2">{person.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Our Mission
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  To combine culinary excellence with technological innovation,
                  creating memorable dining experiences for our customers.
                </p>
              </div>
              <div className="mx-auto flex max-w-3xl flex-col gap-2 min-[400px]:flex-row">
                <Link href="/menu">
                  <Button size="lg">Explore Our Menu</Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline">
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
