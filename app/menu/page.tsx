import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { menuCategories } from "@/lib/constants";

export default function MenuPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Our Menu
                </h1>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Explore our delicious offerings, prepared with fresh
                  ingredients and culinary expertise.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-5xl py-12">
              <Tabs defaultValue="starters" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
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
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {category.items.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="aspect-video object-cover w-full"
                            width={300}
                            height={150}
                          />
                          <CardHeader>
                            <CardTitle>{item.name}</CardTitle>
                            <CardDescription>
                              {item.description}
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="flex justify-between">
                            <span className="font-bold">{item.price}</span>
                            <Link href="/order">
                              <Button size="sm">Order Now</Button>
                            </Link>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
