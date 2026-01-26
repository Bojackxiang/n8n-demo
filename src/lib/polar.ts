import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: "sandbox", // if using the sand box environment you must have this
});

export const polarPlugin = polar({
  client: polarClient,
  createCustomerOnSignUp: true,
  use: [
    checkout({
      products: [
        {
          productId: "f29df7a4-ff6d-4c59-8e4a-56c8d685613a",
          slug: "Nodebase-Pro", //
        },
      ],
      successUrl: process.env.POLAR_SUCCESS_URL,
      authenticatedUsersOnly: true,
    }),
    portal({
      returnUrl: process.env.POLAR_SUCCESS_URL || "http://localhost:3000",
    }),
  ],
});
