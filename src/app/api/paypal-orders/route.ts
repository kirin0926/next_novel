import { NextResponse } from 'next/server';
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
    const {id,quantity,price} = await request.json();
    const collect = {
        body: {// 请求体
          intent: CheckoutPaymentIntent.Capture,// 意图
          purchaseUnits: [
            {
              amount: {
                currencyCode: "USD",// 货币代码
                value: JSON.stringify(price),// 金额
              },
            },
          ],
        },
        prefer: "return=minimal",// 返回最小化
      };
      try {
        const response = await ordersController.createOrder(collect);
        return NextResponse.json(response.result);
      } catch (error) {
        return NextResponse.json(error);
      }
};
