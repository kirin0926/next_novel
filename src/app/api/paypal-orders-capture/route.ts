import { NextResponse, NextRequest } from 'next/server';
import {
    ApiError,
    CheckoutPaymentIntent,
    Client,
    Environment,
    LogLevel,
    OrdersController,
  } from "@paypal/paypal-server-sdk";

  const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
        oAuthClientSecret: process.env.PAYPAL_SECRET_KEY || '',
    },
    timeout: 0,
    environment: Environment.Sandbox,
    logging: {
        logLevel: LogLevel.Info,
        logRequest: {
        logBody: true,
        },
        logResponse: {
        logHeaders: true,
        },
    },
});
const ordersController = new OrdersController(client);


export async function POST(request: Request) {
    const data = await request.json();
    const collect = {
        id: data.orderID,// 订单ID
        prefer: "return=minimal",// 返回最小化
    };
    try {
        const response = await ordersController.captureOrder(collect);
        return NextResponse.json(response.result);
    } catch (error) {
        return NextResponse.json({error: 'orderID is required'});
    }
}