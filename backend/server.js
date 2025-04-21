require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const ORIGIN = process.env.LOCALORIGIN || "http://localhost:3000";


// Middleware to generate short order ID
const generateShortOrderId = require('./utils/generateShortOrderId');


// Middleware
app.use(
  cors({
    origin: ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    // credentials: true,
  })
);
app.use(bodyParser.json());


// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});


// Define Order schema and model
const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      special: String,
    },
  ],
  customerName: String,
  phoneNumber: String,
  address: String,
  deliveryTime: String,
  total: Number,
  deliveryType: {
    type: String,
    enum: ["delivery", "pickup"],
    default: "delivery",
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  shortOrderId: {
    type: String,
    unique: true,
    required: true,
  },
});
const Order = mongoose.model("Order", orderSchema);


// Menu items data
const menuItems = {
  "signature pasta": {
    name: "Signature Pasta",
    price: 14.99,
    aliases: ["pasta", "spaghetti", "fettuccine"],
  },
  "gourmet burger": {
    name: "Gourmet Burger",
    price: 12.99,
    aliases: ["burger", "cheeseburger", "hamburger"],
  },
  "caesar salad": {
    name: "Caesar Salad",
    price: 9.99,
    aliases: ["salad", "caesar"],
  },
  "margherita pizza": {
    name: "Margherita Pizza",
    price: 16.99,
    aliases: ["pizza", "margherita"],
  },
  "chocolate cake": {
    name: "Chocolate Cake",
    price: 7.99,
    aliases: ["cake", "chocolate dessert"],
  },
};

// Assistant messages
const assistantMessages = [
  "Hello! Thank you for calling. How can I help you with your order today?",
  "What would you like to order?",
  "Would you like anything else with your order?",
  "May I have your name for the order?",
  "Thank you! Could I have your phone number?",
  "Would you like delivery or pickup?",
  "Please provide your delivery address.",
  "When would you like your order delivered?",
  "Here's your order summary:",
  "Is this order correct? Please say 'yes' to confirm or 'no' to make changes.",
];


// Helper functions
const extractMenuItems = (text) => {
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, "");
  const words = normalizedText.split(/\s+/);
  const foundItems = new Map();
  const notFoundItems = [];

  const quantityWords = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    a: 1,
    an: 1,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
  };

  let currentQuantity = 1;
  let itemBuffer = "";

  const findMatchingItem = (text) => {
    const exactMatch = Object.entries(menuItems).find(
      ([key]) => key.toLowerCase() === text
    );
    if (exactMatch) return menuItems[exactMatch[0]];

    for (const [key, item] of Object.entries(menuItems)) {
      if (
        item.aliases.some(
          (alias) =>
            alias.toLowerCase() === text ||
            text.includes(alias.toLowerCase()) ||
            alias.toLowerCase().includes(text)
        ) ||
        key.toLowerCase().includes(text) ||
        text.includes(key.toLowerCase())
      ) {
        return item;
      }
    }
    return null;
  };

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (quantityWords[word]) {
      currentQuantity = quantityWords[word];
      continue;
    }

    if (word === "and" || word === "with" || word === "plus") {
      if (itemBuffer) {
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
        } else if (itemBuffer.split(" ").length > 1) {
          notFoundItems.push(itemBuffer);
          itemBuffer = "";
        }
      }
      continue;
    }

    itemBuffer = itemBuffer ? `${itemBuffer} ${word}` : word;

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
      continue;
    }

    if (itemBuffer.split(" ").length >= 3) {
      notFoundItems.push(itemBuffer);
      itemBuffer = "";
      currentQuantity = 1;
    }
  }

  if (itemBuffer) {
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
    } else {
      notFoundItems.push(itemBuffer);
    }
  }

  return {
    items: Array.from(foundItems.values()),
    invalidItems: notFoundItems.filter((item) => item.trim().length > 0),
  };
};

const validatePhoneNumber = (text) => {
  const cleaned = text.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 3)}-${cleaned.substring(
      3,
      6
    )}-${cleaned.substring(6)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `${cleaned.substring(1, 4)}-${cleaned.substring(
      4,
      7
    )}-${cleaned.substring(7)}`;
  }
  return null;
};

const extractName = (text) => {
  const cleaned = text
    .replace(/^(my name is|i am|this is|name is|it's|its)/i, "")
    .trim();
  const namePart = cleaned.split(/[,\s\.]/)[0];
  return namePart.charAt(0).toUpperCase() + namePart.slice(1);
};


// API Endpoints
app.post("/api/voice-order", async (req, res) => {
  try {
    const { transcript, currentOrder, confirmationStep } = req.body;
    const normalizedText = transcript.toLowerCase();
    let response = "";
    let orderDetails = currentOrder || null;
    let newConfirmationStep = confirmationStep || 0;
    let orderConfirmed = false;
    let invalidItems = [];

    // Process the transcript based on conversation state
    if (normalizedText.includes("hello") || normalizedText.includes("hi")) {
      response = assistantMessages[0];
    } else if (
      normalizedText.includes("not find any order") ||
      normalizedText.includes("no order found") ||
      normalizedText.includes("can't find order")
    ) {
      response =
        "I apologize, but I couldn't find any order in your request. Could you please tell me what you'd like to order?";
    } else if (
      normalizedText.includes("order") ||
      normalizedText.includes("want") ||
      normalizedText.includes("like") ||
      normalizedText.includes("get") ||
      normalizedText.includes("have") ||
      Object.keys(menuItems).some((item) =>
        normalizedText.includes(item.toLowerCase())
      )
    ) {
      // Handle order items
      if (
        normalizedText.includes("i want") ||
        normalizedText.includes("would like") ||
        normalizedText.includes("i'd like") ||
        normalizedText.includes("order")
      ) {
        orderDetails = null;
        newConfirmationStep = 0;
      }

      const { items, invalidItems: notFoundItems } =
        extractMenuItems(transcript);
      invalidItems = notFoundItems;

      if (items.length > 0) {
        const total = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        orderDetails = {
          items,
          customerName: orderDetails?.customerName || "",
          phoneNumber: orderDetails?.phoneNumber || "",
          address: orderDetails?.address || "",
          deliveryTime: orderDetails?.deliveryTime || "",
          deliveryType: orderDetails?.deliveryType || "delivery",
          total,
        };

        response = "I've found the following items in your order:\n";
        items.forEach((item) => {
          response += `${item.quantity}x ${item.name} at $${item.price.toFixed(
            2
          )} each\n`;
        });

        if (invalidItems.length > 0) {
          response += `\nNote: I couldn't recognize these items: ${invalidItems.join(
            ", "
          )}. `;
          response += "Please try rephrasing or ask about our menu options.\n";
        }

        response += "\nWould you like to add anything else to your order?";
      } else {
        response =
          "I apologize, but I couldn't identify those items in our menu. Could you please try again?";
      }
    } else if (
      orderDetails &&
      !orderDetails.customerName &&
      (normalizedText.includes("no") ||
        normalizedText.includes("that's everything") ||
        normalizedText.includes("thats everything") ||
        normalizedText.includes("that's all") ||
        normalizedText.includes("thats all") ||
        normalizedText.includes("nothing else"))
    ) {
      response = "Great! May I have your name for the order?";
    } else if (
      orderDetails &&
      !orderDetails.customerName &&
      transcript.length > 2 &&
      !normalizedText.includes("no") &&
      !normalizedText.includes("that's") &&
      !normalizedText.includes("thats")
    ) {
      // Handle name collection
      const name = extractName(transcript);
      if (name) {
        orderDetails.customerName = name;
        response = "Thank you, " + name + ". Could I have your phone number?";
      } else {
        response = "I didn't catch your name. Could you please repeat it?";
      }
    } else if (
      orderDetails &&
      orderDetails.customerName &&
      !orderDetails.phoneNumber
    ) {
      // Handle phone number collection
      const phoneNumber = validatePhoneNumber(transcript);
      if (phoneNumber) {
        orderDetails.phoneNumber = phoneNumber;
        response = assistantMessages[5]; // "Would you like delivery or pickup?"
      } else {
        response =
          "I didn't get a valid phone number. Could you please repeat it? Example: 555-123-4567";
      }
    } else if (
      orderDetails &&
      orderDetails.customerName &&
      orderDetails.phoneNumber &&
      !orderDetails.address
    ) {
      // Handle delivery/pickup selection
      if (normalizedText.includes("delivery")) {
        orderDetails.deliveryType = "delivery";
        response = assistantMessages[6]; // "What's the delivery address?"
      } else if (normalizedText.includes("pickup")) {
        orderDetails.deliveryType = "pickup";
        orderDetails.address = "In-store pickup";
        response = "Great! When would you like to pick up your order?";
      } else if (transcript.length > 10) {
        orderDetails.address = transcript;
        response = assistantMessages[7]; // "When would you like your order delivered?"
      } else {
        response = "Would you like delivery or pickup?";
      }
    } else if (
      orderDetails &&
      orderDetails.customerName &&
      orderDetails.phoneNumber &&
      (orderDetails.address || orderDetails.deliveryType === "pickup") &&
      !orderDetails.deliveryTime
    ) {
      // Handle delivery time collection
      const timeMatch = transcript.match(/(\d{1,2}(:\d{2})?\s?(am|pm)?)/i);
      const timeText = timeMatch ? timeMatch[0] : transcript;
      orderDetails.deliveryTime = timeText;

      newConfirmationStep = 2;
      response = assistantMessages[8] + "\n\n"; // "Here's your order summary:"

      orderDetails.items.forEach((item) => {
        response += `${item.quantity}x ${item.name} - $${(
          item.price * item.quantity
        ).toFixed(2)}\n`;
      });

      response += `\nTotal: $${orderDetails.total.toFixed(2)}\n\n`;
      response += assistantMessages[9]; // "Is this order correct?"
    } else if (newConfirmationStep === 2) {
      // Handle order confirmation
      if (normalizedText.includes("yes")) {
        orderConfirmed = true;
        response =
          "Great! Your order total is $" +
          orderDetails.total.toFixed(2) +
          ". Would you like to pay now or at " +
          (orderDetails.deliveryType === "delivery" ? "delivery" : "pickup") +
          "? Please say 'pay now' or 'pay later'.";
        newConfirmationStep = 3;

        // Save the order to database
        const generateShortOrderId = require('./utils/generateShortOrderId');

        try {
          let shortOrderId;
          let isUnique = false;
        
          // Try generating a unique short ID
          while (!isUnique) {
            shortOrderId = generateShortOrderId();
            const existingOrder = await Order.findOne({ shortOrderId });
            if (!existingOrder) isUnique = true;
          }
        
          const newOrder = new Order({
            ...orderDetails,
            status: "confirmed",
            shortOrderId, // Include the custom short ID
          });
        
          await newOrder.save();
        
          response += `\n\nYour order ID is ${shortOrderId}. Please keep it for your reference.`;
        
        } catch (err) {
          console.error("Error saving order:", err);
        }              
      } else if (normalizedText.includes("no")) {
        orderDetails = null;
        newConfirmationStep = 0;
        response =
          "I apologize for any mistakes. Let's start over. What would you like to order?";
      } else {
        response =
          "Please say 'yes' to confirm your order or 'no' to start over.";
      }
    } else if (newConfirmationStep === 3) {
      // Handle payment selection
      if (
        normalizedText.includes("now") ||
        normalizedText.includes("pay now")
      ) {
        response =
          "I'll transfer you to our secure payment system now. You can complete your payment there.";
      } else if (
        normalizedText.includes("later") ||
        normalizedText.includes("pay later")
      ) {
        response =
          "No problem! You can pay at " +
          (orderDetails.deliveryType === "delivery" ? "delivery" : "pickup") +
          ". Your order (ID: " +
          orderDetails.shortOrderId +
          ") has been confirmed and will be ready at " +
          orderDetails.deliveryTime +
          ". You can track your order status on our website. Have a great day!";
      } else {
        response =
          "Please say 'pay now' to complete payment or 'pay later' to pay at " +
          (orderDetails.deliveryType === "delivery" ? "delivery" : "pickup");
      }
    } else {
      // Fallback response
      response =
        "I didn't understand that. Could you please repeat or rephrase?";
    }

    res.json({
      success: true,
      response,
      orderDetails,
      confirmationStep: newConfirmationStep,
      orderConfirmed,
      invalidItems,
    });
  } catch (error) {
    console.error("Error processing voice order:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      response:
        "Sorry, I encountered an error processing your request. Please try again.",
    });
  }
});


// Additional API endpoints for order management
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: "Failed to fetch orders" });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ success: false, error: "Failed to fetch order" });
  }
});

app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to update order status" });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
