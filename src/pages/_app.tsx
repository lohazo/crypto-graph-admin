import type { AppProps } from "next/app";
import { Provider, subscriptionExchange } from "urql";
import { maybeGetAuthToken } from "../hooks/useAuth";
import {
  createClient,
  dedupExchange,
  fetchExchange,
  errorExchange,
} from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { createClient as createWSClient } from "graphql-ws";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/router";
import { pipe, tap } from "wonka";

import "antd/dist/antd.css";
import "../styles/globals.css";
import { notification } from "antd";

const wsClient = () => {
  let token;
  if (process.browser) {
    token = maybeGetAuthToken(undefined);
  }

  return process.browser
    ? createWSClient({
        url: process.env.NEXT_PUBLIC_HASURA_WS_ENDPOINT as string,
        connectionParams: {
          headers: {
            authorization: token ? `Bearer ${token}` : "",
          },
        },
      })
    : null;
};

const client = createClient({
  url: process.env.NEXT_PUBLIC_HASURA_HTTP_ENDPOINT as string,
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          insert_wallet_one(_result, args, cache, _info) {
            cache
              .inspectFields("Query")
              .filter((q) => q.fieldName === "wallet")
              .forEach((query) =>
                cache.invalidate("Query", query.fieldName, query.arguments)
              );
          },
        },
      },
    }),
    errorExchange({
      onError(error) {
        console.error(error);
        notification.error({ message: error.message });
        if (error.message) {
          if (error.message.includes("Could not verify JWT:")) {
            notification.error({ message: error.message });
            window.location.href = "/login";
          }
        }
      },
    }),
    fetchExchange,
    subscriptionExchange({
      // forwardSubscription: (operation) => subscriptionClient.request(operation),
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient()?.subscribe(operation, sink) as any,
        }),
      }),
    }),
  ],
  fetchOptions: () => {
    let token;
    if (process.browser) {
      token = maybeGetAuthToken(undefined);
    }
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  },
});

function MyApp({ Component: Page, pageProps }: AppProps) {
  const router = useRouter();
  const onRedirectCallback = (appState: any) => {
    console.log(
      "🚀 ~> file: _app.tsx ~> line 94 ~> onRedirectCallback ~> appState",
      appState
    );
    // router.replace(appState?.returnTo || "/");
  };

  return (
    <>
      <Auth0Provider
        domain={process.env.NEXT_PUBLIC_DOMAIN as string}
        clientId={process.env.NEXT_PUBLIC_CLIENT_ID as string}
        // audience={process.env.NEXT_PUBLIC_AUDIENCE}
        // scope="read:users"
        // @ts-ignore
        redirectUri={process.env.NEXT_PUBLIC_CALLBACK_URL}
        onRedirectCallback={onRedirectCallback}
      >
        <Provider value={client}>
          <Page {...pageProps} />
        </Provider>
      </Auth0Provider>
    </>
  );
}

export default MyApp;
