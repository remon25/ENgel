import mongoose from "mongoose";
import { Order } from "@/app/models/Order";
import validator from "validator";
import sanitizeHtml from "sanitize-html";
import { DeliveryPrice } from "@/app/models/DeliverPrices";
import { ProductItem } from "@/app/models/productItem";
import paypal from "@paypal/checkout-server-sdk";

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const clientSecret = process.env.NEXT_PAYPAL_CLIENT_SECRET;

const environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { cartProducts, address, subtotal, deliveryPrice, orderType } =
      await req.json();

    // Step 1: Validate and sanitize address fields
    if (!address.name || !address.email || !address.phone || !address.streetAdress) {
      return new Response("Missing required address fields", { status: 400 });
    }
    if (!validator.isEmail(address.email)) {
      return new Response("Invalid email format", { status: 400 });
    }

    const sanitizedAddress = {
      ...address,
      name: sanitizeHtml(address.name),
      email: sanitizeHtml(address.email),
      phone: sanitizeHtml(address.phone),
      streetAdress: sanitizeHtml(address.streetAdress),
    };

    // Step 2: Validate order type
    if (!["delivery"].includes(orderType)) {
      return new Response("Invalid order type", { status: 400 });
    }

    let cityDeliveryInfo;
    if (orderType === "delivery") {
      const germanyRegex = /germany/i;
      const containsGermany = germanyRegex.test(address.streetAdress);
      cityDeliveryInfo = await DeliveryPrice.findOne({
        name: containsGermany ? "germany" : "other",
      }).lean();

      if (cityDeliveryInfo.isFreeDelivery && deliveryPrice > 0) {
        console.error("Delivery should be free for this city:", deliveryPrice);
        return new Response("Delivery is free for this city", { status: 400 });
      }

      if (!cityDeliveryInfo.isFreeDelivery && deliveryPrice === 0) {
        console.error(
          "Delivery price required for non-free delivery city:",
          deliveryPrice
        );
        return new Response("Delivery is not free for this city", {
          status: 400,
        });
      }
    }
    let finalTotalPrice;
    let computedDeliveryPrice;
    if (orderType === "delivery") {
      finalTotalPrice = subtotal + deliveryPrice;
      computedDeliveryPrice = deliveryPrice;
    } else {
      finalTotalPrice = subtotal;
      computedDeliveryPrice = 0;
    }

    const menuItems = await ProductItem.find({
      _id: { $in: cartProducts.map((item) => item._id) },
    }).lean();


    let calculatedSubtotal = 0;
    const sanitizedCartProducts = [];

    for (const product of cartProducts) {
      const menuItem = menuItems.find(
        (item) => item._id.toString() === product._id
      );

      if (!menuItem) {
        console.error("Product not found in database:", product._id);
        return new Response(
          `Product with _id ${product._id} does not exist in the database`,
          { status: 400 }
        );
      }

      if (menuItem.price !== parseFloat(product.price)) {
        console.error("Price mismatch for product:", product);
        return new Response(`Price mismatch for product ${product.name}`, {
          status: 400,
        });
      }

      let productTotal = menuItem.price * (product.quantity || 1);

      if (product.size) {
        const selectedSize = menuItem.sizes.find(
          (size) =>
            size._id.toString() === product.size._id &&
            size.price === product.size.price
        );

        if (!selectedSize) {
          console.error(
            "Invalid size for product:",
            product.size,
            product.name
          );
          return new Response(
            `Invalid size '${product.size.name}' for product ${product.name}`,
            { status: 400 }
          );
        }

        productTotal += selectedSize.price * (product.quantity || 1);
      }

      // if (product.extras && product.extras.length > 0) {
      //   for (const extra of product.extras) {
      //     const selectedExtra = menuItem.extraIngredientPrice.find(
      //       (menuExtra) =>
      //         menuExtra._id.toString() === extra._id &&
      //         menuExtra.price === extra.price
      //     );

      //     if (!selectedExtra) {
      //       console.error("Invalid extra for product:", extra, product.name);
      //       return new Response(
      //         `Invalid extra '${extra.name}' for product ${product.name}`,
      //         { status: 400 }
      //       );
      //     }

      //     productTotal += selectedExtra.price;
      //   }
      // }

      calculatedSubtotal += productTotal;

      sanitizedCartProducts.push({
        _id: product._id,
        bannerImage: sanitizeHtml(product.bannerImage),
        name: sanitizeHtml(product.name),
        description: sanitizeHtml(product.description),
        category: product.category,
        price: parseFloat(product.price),
        quantity: parseFloat(product.quantity),
        sizes: product.sizes,
        extraIngredientPrice: product.extraIngredientPrice,
        size: product.size,
        extras: product.extras,
      });
    }

    if (calculatedSubtotal !== subtotal) {
      console.error(
        "Subtotal mismatch. Calculated:",
        calculatedSubtotal,
        "Provided:",
        subtotal
      );
      return new Response(
        `Subtotal mismatch. Calculated: ${calculatedSubtotal}, Provided: ${subtotal}`,
        { status: 400 }
      );
    }

    finalTotalPrice =
      orderType === "delivery" ? subtotal + computedDeliveryPrice : subtotal;

    // Step 5: Create the PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "EUR",
            value: finalTotalPrice.toFixed(2),
          },
        },
      ],
    });

    const paypalResponse = await client.execute(request);

    // Step 6: Create the order in the database
    const orderDoc = await Order.create({
      name: sanitizedAddress.name,
      email: sanitizedAddress.email,
      phone: sanitizedAddress.phone,
      streetAdress: sanitizedAddress.streetAdress,
      cartProducts: sanitizedCartProducts,
      subtotal,
      deliveryPrice: computedDeliveryPrice,
      finalTotalPrice,
      paymentMethod: "paypal",
      orderType,
      paypalOrderId: paypalResponse.result.id,
      paid: false,
    });

    // Return PayPal order ID and order details
    return Response.json({
      orderId: orderDoc._id,
      paypalOrderId: paypalResponse.result.id,
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
