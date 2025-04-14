export const menuCategories = [
  {
    id: "starters",
    name: "Starters",
    description:
      "Begin your meal with our delightful starters, perfect for sharing or enjoying solo.",
    items: [
      {
        id: "1",
        name: "Bruschetta",
        description:
          "Toasted bread topped with tomatoes, garlic, and fresh basil",
        price: "8.99",
        image: "/bruschetta.jpg?height=150&width=300&text=Bruschetta",
        isVegan: true,
        isPopular: true,
        prepTime: "10-15 minutes",
      },
      {
        id: "2",
        name: "Calamari",
        description: "Crispy fried calamari served with marinara sauce",
        price: "12.99",
        image: "/calamari.jpg?height=150&width=300&text=Calamari",
        isVegan: false,
        isPopular: true,
        prepTime: "15-20 minutes",
      },
      {
        id: "3",
        name: "Spinach Artichoke Dip",
        description:
          "Creamy spinach and artichoke dip served with tortilla chips",
        price: "10.99",
        image: "/SpinachArtichokeDip.png?height=150&width=300&text=Spinach+Dip",
        isVegan: false,
        isPopular: false,
        prepTime: "10-15 minutes",
      },
    ],
  },
  {
    id: "mains",
    name: "Main Courses",
    description:
      "Savor our main courses, crafted with the finest ingredients and flavors.",
    items: [
      {
        id: "4",
        name: "Signature Pasta",
        description: "Handmade pasta with our special sauce and fresh herbs",
        price: "18.99",
        image: "/pasta.jpg?height=150&width=300&text=Signature+Pasta",
        isVegan: false,
        isPopular: true,
        prepTime: "20-25 minutes",
      },
      {
        id: "5",
        name: "Grilled Salmon",
        description:
          "Fresh salmon fillet grilled to perfection with seasonal vegetables",
        price: "24.99",
        image: "/salmon3.jpg?height=150&width=300&text=Grilled+Salmon",
        isVegan: false,
        isPopular: false,
        prepTime: "25-30 minutes",
      },
      {
        id: "6",
        name: "Gourmet Burger",
        description:
          "Premium beef patty with artisanal cheese and house-made sauce",
        price: "16.99",
        image: "/burger.jpg?height=150&width=300&text=Gourmet+Burger",
        isVegan: false,
        isPopular: true,
        prepTime: "15-20 minutes",
      },
      {
        id: "7",
        name: "Chicken Parmesan",
        description:
          "Breaded chicken breast topped with marinara sauce and melted mozzarella",
        price: "19.99",
        image:
          "/ChickenParmesan.jpg?height=150&width=300&text=Chicken+Parmesan",
        isVegan: false,
        isPopular: false,
        prepTime: "20-25 minutes",
      },
    ],
  },
  {
    id: "desserts",
    name: "Desserts",
    description: "Indulge in our sweet treats to end your meal on a high note.",
    items: [
      {
        id: "8",
        name: "Tiramisu",
        description:
          "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
        price: "8.99",
        image: "/Tiramisu.png?height=150&width=300&text=Tiramisu",
        isVegan: false,
        isPopular: true,
        prepTime: "10-15 minutes",
      },
      {
        id: "9",
        name: "Chocolate Lava Cake",
        description:
          "Warm chocolate cake with a molten center, served with vanilla ice cream",
        price: "9.99",
        image:
          "/ChocolateLavaCake.png?height=150&width=300&text=Chocolate+Lava+Cake",
        isVegan: false,
        isPopular: false,
        prepTime: "15-20 minutes",
      },
      {
        id: "10",
        name: "New York Cheesecake",
        description:
          "Creamy cheesecake with a graham cracker crust, topped with berry compote",
        price: "7.99",
        image: "/newyorkcheesecake.png?height=150&width=300&text=Cheesecake",
        isVegan: false,
        isPopular: false,
        prepTime: "10-15 minutes",
      },
    ],
  },
  {
    id: "drinks",
    name: "Drinks",
    description:
      "Quench your thirst with our selection of refreshing beverages.",
    items: [
      {
        id: "11",
        name: "Refreshing Soft Drink",
        description:
          "Deliciously crafted soft drinks made with high-quality ingredients for a burst of flavor in every sip!",
        price: "12.99",
        image: "/SoftDrink.jpg?height=150&width=300&text=Craft+Cocktails",
        isVegan: true,
        isPopular: false,
        prepTime: "5-10 minutes",
      },
      {
        id: "12",
        name: "Energy Booster",
        description:
          "A curated selection of invigorating energy drinks to fuel your day with maximum energy and focus!",
        price: "From $9.99",
        image: "/energydrink.jpg?height=150&width=300&text=Wine",
        isVegan: true,
        isPopular: false,
        prepTime: "5-10 minutes",
      },
      {
        id: "13",
        name: "Specialty Coffee",
        description:
          "Espresso, cappuccino, latte, and other coffee specialties",
        price: "From $4.99",
        image: "/coffee.jpg?height=150&width=300&text=Coffee",
        isVegan: false,
        isPopular: false,
        prepTime: "5-10 minutes",
      },
    ],
  },
];

export const orderSteps = [
  {
    title: "Order Received",
    description: "Your order has been received and is being processed.",
    time: "12:30 PM",
    completed: true,
  },
  {
    title: "Preparing",
    description: "Our chefs are preparing your delicious meal.",
    time: "12:35 PM",
    completed: true,
  },
  {
    title: "Ready for Pickup/Delivery",
    description: "Your order is ready and waiting for pickup or delivery.",
    time: "12:50 PM",
    completed: false,
  },
  {
    title: "On the Way",
    description: "Your order is on the way to your location.",
    time: "1:00 PM",
    completed: false,
  },
  {
    title: "Delivered",
    description: "Your order has been delivered. Enjoy your meal!",
    time: "1:15 PM",
    completed: false,
  },
];

export const menuItems = {
  "signature pasta": {
    name: "Signature Pasta",
    price: 18.99,
    category: "mains",
    aliases: ["pasta"],
  },
  "gourmet burger": {
    name: "Gourmet Burger",
    price: 16.99,
    category: "mains",
    aliases: ["burger", "government burger"],
  },
  "grilled salmon": {
    name: "Grilled Salmon",
    price: 24.99,
    category: "mains",
    aliases: ["salmon"],
  },
  bruschetta: {
    name: "Bruschetta",
    price: 8.99,
    category: "starters",
    aliases: [],
  },
  calamari: {
    name: "Calamari",
    price: 12.99,
    category: "starters",
    aliases: [],
  },
  "spinach artichoke dip": {
    name: "Spinach Artichoke Dip",
    price: 10.99,
    category: "starters",
    aliases: ["spinach dip", "artichoke dip"],
  },
  tiramisu: {
    name: "Tiramisu",
    price: 8.99,
    category: "desserts",
    aliases: [],
  },
  "chocolate lava cake": {
    name: "Chocolate Lava Cake",
    price: 9.99,
    category: "desserts",
    aliases: ["lava cake"],
  },
};

export const assistantMessages = [
  "Thank you for calling OrderEase. This is our automated ordering system. How can I help you today?",
  "I'd be happy to take your order. What would you like to order from our menu?",
  "Great choice! Would you like to add any special instructions or modifications to your order?",
  "Got it. Can I get your name for the order?",
  "Thank you. Could I have your phone number?",
  "And is this for delivery or pickup?",
  "For delivery, I'll need your address.",
  "When would you like your order to be delivered?",
  "Let me confirm your order. You've ordered:",
];

export const simulatedResponses = [
  "I'd like to order some food",
  "I'll have two signature pasta and one gourmet burger",
  "No special instructions",
  "My name is John",
  "My phone number is 555-123-4567",
  "This is for delivery",
  "123 Main Street, Apt 4B",
  "As soon as possible",
  "Yes",
];
