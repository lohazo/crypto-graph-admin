import { createClient } from "@urql/core";

const client = createClient({
  url: 'http://localhost:3000/graphql',
  fetchOptions: () => {
    const token = 'getToken()';
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
});
