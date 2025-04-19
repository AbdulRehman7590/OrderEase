import { NextRequest, NextResponse } from "next/server";

// Define interfaces for type safety
interface MenuItem {
  name: string;
  price: number;
  aliases: string[];
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetails {
  items: OrderItem[];
  customerName: string;
  phoneNumber: string;
  address: string;
  deliveryTime: string;
  deliveryType: "delivery" | "pickup";
  total: number;
  phoneRetryCount: number;
  confirmedPhone?: boolean; // Added flag to track if phone was confirmed
}

// Define the expected shape of the request body
interface VoiceOrderRequestBody {
  transcript: string;
  currentOrder?: OrderDetails | null;
  confirmationStep?: number;
  conversation: string[];
}

// Response type for the API
interface VoiceOrderResponse {
  success: boolean;
  response?: string;
  orderDetails?: OrderDetails | null;
  confirmationStep?: number;
  orderConfirmed?: boolean;
  invalidItems?: string[];
  error?: string;
}

const menuItems: Record<string, MenuItem> = {
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

const assistantMessages = [
  "Hello! Thank you for calling OrderEase. How can I help you with your order today?",
  "What would you like to order?",
  "Would you like anything else with your order?",
  "May I have your name for the order?",
  "Thank you! Could I have your phone number? (Please provide a 10-digit number, e.g., 1234567890)",
  "Would you like delivery or pickup?",
  "Please provide your delivery address.",
  "When would you like your order delivered or picked up? (e.g., 6:00 PM)",
  "Here's your order summary:",
  "Is this order correct? Please say 'yes' to confirm or 'no' to make changes.",
];

// List of phrases to exclude from invalid items
const excludedPhrases = [
  "i want", "want to", "want to order", "order", "would like", "i'd like",
  "to order", "please", "one", "two", "three", "four", "five", "a", "an",
  "i would like", "i would like to", "i would like to add", "add a", "to add",
  "add", "had",
];

// Extract menu items from a transcript
const extractMenuItems = (text: string): { items: OrderItem[]; invalidItems: string[] } => {
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, "");
  const words = normalizedText.split(/\s+/);
  const foundItems = new Map<string, OrderItem>();
  const notFoundItems: string[] = [];

  const quantityWords: Record<string, number> = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    a: 1, an: 1, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5,
  };

  let currentQuantity = 1;
  let itemBuffer = "";

  const findMatchingItem = (text: string): MenuItem | null => {
    const exactMatch = Object.entries(menuItems).find(
      ([key]) => key.toLowerCase() === text
    );
    if (exactMatch) return menuItems[exactMatch[0]];

    for (const item of Object.values(menuItems)) {
      if (
        item.aliases.includes(text) ||
        item.name.toLowerCase() === text
      ) {
        return item;
      }
      const textWords = text.split(" ");
      for (const word of textWords) {
        if (
          item.aliases.includes(word) ||
          item.name.toLowerCase() === word
        ) {
          return item;
        }
      }
    }
    return null;
  };

  const addItemToFound = (item: MenuItem, quantity: number) => {
    if (foundItems.has(item.name)) {
      const existing = foundItems.get(item.name)!;
      foundItems.set(item.name, {
        ...existing,
        quantity: existing.quantity + quantity,
      });
    } else {
      foundItems.set(item.name, {
        name: item.name,
        quantity,
        price: item.price,
      });
    }
  };

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (quantityWords[word]) {
      currentQuantity = quantityWords[word];
      if (itemBuffer && !excludedPhrases.includes(itemBuffer.trim())) {
        notFoundItems.push(itemBuffer.trim());
      }
      itemBuffer = "";
      continue;
    }

    if (["and", "with", "plus"].includes(word)) {
      if (itemBuffer) {
        const matchedItem = findMatchingItem(itemBuffer);
        if (matchedItem) {
          addItemToFound(matchedItem, currentQuantity);
        } else if (itemBuffer.split(" ").length > 1) {
          const bufferText = itemBuffer.trim();
          if (!excludedPhrases.includes(bufferText)) {
            notFoundItems.push(bufferText);
          }
        }
        itemBuffer = "";
        currentQuantity = 1;
      }
      continue;
    }

    itemBuffer = itemBuffer ? `${itemBuffer} ${word}` : word;

    const matchedItem = findMatchingItem(itemBuffer);
    if (matchedItem) {
      addItemToFound(matchedItem, currentQuantity);
      itemBuffer = "";
      currentQuantity = 1;
    } else if (itemBuffer.split(" ").length >= 3) {
      const bufferText = itemBuffer.trim();
      if (!excludedPhrases.includes(bufferText)) {
        notFoundItems.push(bufferText);
      }
      itemBuffer = "";
      currentQuantity = 1;
    }
  }

  if (itemBuffer) {
    const matchedItem = findMatchingItem(itemBuffer);
    if (matchedItem) {
      addItemToFound(matchedItem, currentQuantity);
    } else {
      const bufferText = itemBuffer.trim();
      if (!excludedPhrases.includes(bufferText)) {
        notFoundItems.push(bufferText);
      }
    }
  }

  return {
    items: Array.from(foundItems.values()),
    invalidItems: notFoundItems.filter((item) => item.trim().length > 0),
  };
};

// Validate phone number format with more flexibility
const validatePhoneNumber = (text: string): string | null => {
  const cleaned = text.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return cleaned;
  }
  if (cleaned.length === 11 && (cleaned.startsWith("0") || cleaned.startsWith("1"))) {
    return cleaned.substring(1);
  }
  if (cleaned.length === 9) {
    return `0${cleaned}`;
  }
  return null;
};

// Format phone number for display
const formatPhoneNumber = (phone: string): string => {
  if (phone.length === 10) {
    return `${phone.substring(0, 3)}-${phone.substring(3, 6)}-${phone.substring(6)}`;
  }
  return phone;
};

// Extract customer name from transcript
const extractName = (text: string): string => {
  const cleaned = text
    .replace(/^(my name is|i am|this is|name is|it's|its)/i, "")
    .trim();
  const namePart = cleaned.split(/[,\s\.]/)[0];
  return namePart.charAt(0).toUpperCase() + namePart.slice(1).toLowerCase();
};

// Show the menu as a string
const showMenu = (): string => {
  let menuResponse = "Here is our menu:\n";
  Object.values(menuItems).forEach((item) => {
    menuResponse += `${item.name} - $${item.price.toFixed(2)}\n`;
  });
  menuResponse += "\nWhat would you like to order today?";
  return menuResponse;
};

// Remove an item from the order
const removeItemFromOrder = (text: string, orderDetails: OrderDetails): { updatedOrder: OrderDetails; removedItem: string | null } => {
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, "");
  let removedItem: string | null = null;

  const itemToRemove = Object.values(menuItems).find((item) =>
    item.aliases.some(
      (alias) =>
        normalizedText.includes(alias.toLowerCase()) ||
        normalizedText.includes(item.name.toLowerCase())
    )
  );

  if (itemToRemove) {
    const updatedItems = orderDetails.items.filter((item) => item.name !== itemToRemove.name);
    const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    removedItem = itemToRemove.name;
    return {
      updatedOrder: { ...orderDetails, items: updatedItems, total },
      removedItem,
    };
  }

  return { updatedOrder: orderDetails, removedItem };
};

// Format the order summary
const formatOrderSummary = (orderDetails: OrderDetails): string => {
  let summary = "Your current order:\n";
  orderDetails.items.forEach((item) => {
    summary += `${item.quantity}x ${item.name} at $${item.price.toFixed(2)} each\n`;
  });
  summary += `\nTotal: $${orderDetails.total.toFixed(2)}`;
  return summary;
};

// Main API POST handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transcript, currentOrder, confirmationStep, conversation } = body as VoiceOrderRequestBody;

    if (!transcript || typeof transcript !== "string") {
      return NextResponse.json({
        success: false,
        error: "Invalid request: 'transcript' is required and must be a string",
      }, { status: 400 });
    }

    if (!Array.isArray(conversation)) {
      return NextResponse.json({
        success: false,
        error: "Invalid request: 'conversation' must be an array",
      }, { status: 400 });
    }

    const normalizedText = transcript.toLowerCase();
    let response = "";
    let orderDetails = currentOrder || null;
    let newConfirmationStep = confirmationStep || 0;
    let orderConfirmed = false;
    let invalidItems: string[] = [];

    // Initialize order details if not present
    if (!orderDetails) {
      orderDetails = {
        items: [],
        customerName: "",
        phoneNumber: "",
        address: "",
        deliveryTime: "",
        deliveryType: "delivery",
        total: 0,
        phoneRetryCount: 0,
        confirmedPhone: false,
      };
    } else {
      // Ensure phoneRetryCount is initialized
      orderDetails.phoneRetryCount = orderDetails.phoneRetryCount || 0;
      orderDetails.confirmedPhone = orderDetails.confirmedPhone || false;
    }

    if (normalizedText.includes("show me the menu") || normalizedText.includes("what's on the menu")) {
      response = showMenu();
    } 
    else if (normalizedText.includes("cancel") || normalizedText.includes("remove")) {
      if (!orderDetails.items.length) {
        response = "You don't have any items in your order to cancel. Would you like to order something?";
      } else {
        const { updatedOrder, removedItem } = removeItemFromOrder(transcript, orderDetails);
        orderDetails = updatedOrder;

        if (removedItem) {
          response = `I've removed ${removedItem} from your order.\n`;
          if (orderDetails.items.length > 0) {
            response += formatOrderSummary(orderDetails) + "\n";
            response += "Would you like to add or remove anything else?";
          } else {
            response += "Your order is now empty. Would you like to order something?";
            orderDetails = null;
            newConfirmationStep = 0;
          }
        } else {
          response = "I couldn't identify the item to cancel. Please specify the item, e.g., 'cancel my burger'.";
        }
      }
    } 
    else if (normalizedText.includes("hello") || normalizedText.includes("hi")) {
      response = assistantMessages[0];
    } 
    else if (
      normalizedText.includes("not find any order") ||
      normalizedText.includes("no order found") ||
      normalizedText.includes("can't find order")
    ) {
      response = "I apologize, but I couldn't find any order in your request. Could you please tell me what you'd like to order?";
    } 
    else if (
      normalizedText.includes("order") ||
      normalizedText.includes("want") ||
      normalizedText.includes("like") ||
      normalizedText.includes("get") ||
      normalizedText.includes("have") ||
      normalizedText.includes("add") ||
      Object.keys(menuItems).some((item) => normalizedText.includes(item.toLowerCase()))
    ) {
      // Extract items from the transcript
      const { items, invalidItems: notFoundItems } = extractMenuItems(transcript);
      invalidItems = notFoundItems;

      if (items.length > 0) {
        // Create a new order if none exists
        if (!orderDetails) {
          orderDetails = {
            items: [],
            customerName: "",
            phoneNumber: "",
            address: "",
            deliveryTime: "",
            deliveryType: "delivery",
            total: 0,
            phoneRetryCount: 0,
            confirmedPhone: false,
          };
        }

        // Merge new items with existing items
        const existingItemsMap = new Map(orderDetails.items.map((item) => [item.name, item]));
        items.forEach((newItem) => {
          if (existingItemsMap.has(newItem.name)) {
            const existingItem = existingItemsMap.get(newItem.name)!;
            existingItem.quantity += newItem.quantity;
          } else {
            existingItemsMap.set(newItem.name, { ...newItem });
          }
        });

        // Update order details
        orderDetails.items = Array.from(existingItemsMap.values());
        orderDetails.total = orderDetails.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        response = "I've added the following items to your order:\n";
        items.forEach((item) => {
          response += `${item.quantity}x ${item.name} at $${item.price.toFixed(2)} each\n`;
        });

        if (invalidItems.length > 0) {
          response += `\nNote: I couldn't recognize these items: ${invalidItems.join(", ")}. `;
          response += "Please try rephrasing or ask about our menu options.\n";
        }

        response += `\n${formatOrderSummary(orderDetails)}\n`;
        response += "Would you like to add or remove anything else?";
      } else {
        response = "I apologize, but I couldn't identify those items in our menu. Could you please try again?";
      }
    } 
    else if (
      orderDetails.items.length > 0 &&
      !orderDetails.customerName &&
      (normalizedText.includes("no") ||
        normalizedText.includes("that's everything") ||
        normalizedText.includes("thats everything") ||
        normalizedText.includes("that's all") ||
        normalizedText.includes("thats all") ||
        normalizedText.includes("nothing else"))
    ) {
      response = assistantMessages[3];
    } 
    else if (
      orderDetails.items.length > 0 &&
      !orderDetails.customerName &&
      transcript.length > 2 &&
      !normalizedText.includes("no") &&
      !normalizedText.includes("that's") &&
      !normalizedText.includes("thats")
    ) {
      const name = extractName(transcript);
      if (name && name.length > 1) {
        orderDetails.customerName = name;
        response = `Thank you, ${name}. Could I have your phone number? (Please provide a 10-digit number, e.g., 1234567890)`;
      } else {
        response = "I didn't catch your name. Could you please repeat it?";
      }
    } 
    else if (orderDetails.customerName && (!orderDetails.confirmedPhone || !orderDetails.phoneNumber)) {
      const phoneNumber = validatePhoneNumber(transcript);
      
      if (phoneNumber) {
        orderDetails.phoneNumber = phoneNumber;
        orderDetails.confirmedPhone = true; // Mark phone as confirmed
        orderDetails.phoneRetryCount = 0;
        response = assistantMessages[5] + ` (Your phone number is ${formatPhoneNumber(phoneNumber)})`;
      } else {
        orderDetails.phoneRetryCount += 1;
        if (orderDetails.phoneRetryCount >= 3) {
          orderDetails.phoneNumber = "Not provided";
          orderDetails.confirmedPhone = true; // Mark as confirmed to move on
          orderDetails.phoneRetryCount = 0;
          response = "I couldn't validate your phone number after a few attempts. We'll proceed without it for now. Would you like delivery or pickup?";
        } else {
          response = "I didn't get a valid phone number. Could you please repeat it? (Please provide a 10-digit number, e.g., 1234567890)";
        }
      }
    } 
    else if (
      orderDetails.customerName &&
      orderDetails.confirmedPhone &&
      !orderDetails.address &&
      !normalizedText.includes("pick up") &&
      !normalizedText.includes("delivery")
    ) {
      response = assistantMessages[5] + 
        (orderDetails.phoneNumber !== "Not provided" ? 
          ` (Your phone number is ${formatPhoneNumber(orderDetails.phoneNumber)})` : 
          "");
    } 
    else if (
      orderDetails.customerName &&
      orderDetails.confirmedPhone &&
      !orderDetails.address
    ) {
      if (normalizedText.includes("delivery")) {
        orderDetails.deliveryType = "delivery";
        response = assistantMessages[6];
      } else if (normalizedText.includes("pickup") || normalizedText.includes("pick up")) {
        orderDetails.deliveryType = "pickup";
        orderDetails.address = "In-store pickup";
        response = assistantMessages[7];
      } else if (transcript.length > 10) {
        orderDetails.address = transcript;
        response = assistantMessages[7];
      }
    } 
    else if (
      orderDetails.customerName &&
      orderDetails.confirmedPhone &&
      (orderDetails.address || orderDetails.deliveryType === "pickup") &&
      !orderDetails.deliveryTime
    ) {
      const timeMatch = transcript.match(/(\d{1,2}(:\d{2})?\s?(am|pm)?)/i);
      const timeText = timeMatch ? timeMatch[0] : transcript;
      orderDetails.deliveryTime = timeText;

      newConfirmationStep = 2;
      response = assistantMessages[8] + "\n";
      response += formatOrderSummary(orderDetails) + "\n";
      response += `\nCustomer: ${orderDetails.customerName}\n`;
      if (orderDetails.phoneNumber !== "Not provided") {
        response += `Phone: ${formatPhoneNumber(orderDetails.phoneNumber)}\n`;
      }
      response += `Delivery Type: ${orderDetails.deliveryType === "delivery" ? "Delivery to " + orderDetails.address : "Pickup"}\n`;
      response += `Scheduled Time: ${orderDetails.deliveryTime}\n`;
      response += assistantMessages[9];
    } 
    else if (newConfirmationStep === 2) {
      if (normalizedText.includes("yes")) {
        orderConfirmed = true;
        response =
          `Great! Your order total is $${orderDetails.total.toFixed(2)}. Would you like to pay now or at ` +
          (orderDetails.deliveryType === "delivery" ? "delivery" : "pickup") +
          "? Please say 'pay now' or 'pay later'.";
        newConfirmationStep = 3;
      } else if (normalizedText.includes("no")) {
        orderDetails = null;
        newConfirmationStep = 0;
        response = "I apologize for any mistakes. Let's start over. What would you like to order?";
      } else {
        response = "Please say 'yes' to confirm your order or 'no' to start over.";
      }
    } 
    else if (newConfirmationStep === 3) {
      if (normalizedText.includes("now") || normalizedText.includes("pay now")) {
        response = "I'll transfer you to our secure payment system now. You can complete your payment there.";
      } else if (normalizedText.includes("later") || normalizedText.includes("pay later")) {
        response =
          "No problem! You can pay at " +
          (orderDetails.deliveryType === "delivery" ? "delivery" : "pickup") +
          ". Your order has been confirmed and will be ready at " +
          orderDetails.deliveryTime +
          ". You can track your order status on our website. Have a great day!";
      } else {
        response =
          "Please say 'pay now' to complete payment or 'pay later' to pay at " +
          (orderDetails.deliveryType === "delivery" ? "delivery" : "pickup");
      }
    } 
    else {
      response = "I didn't understand that. Could you please repeat or rephrase?";
    }

    return NextResponse.json({
      success: true,
      response,
      orderDetails,
      confirmationStep: newConfirmationStep,
      orderConfirmed,
      invalidItems,
    }, { status: 200 });
  } catch (error) {
    console.error("Voice order error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
      response: "Sorry, I encountered an error processing your request. Please try again.",
    }, { status: 500 });
  }
}