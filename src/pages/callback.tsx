import { useRouter } from "next/router";
import React, { useEffect } from "react";
import cookie from "cookie";
// import querystring from 'querystring';

function Callback() {
  const router = useRouter();

  useEffect(() => {
    // const jwt = router.asPath?.split("#")?.[1]?.split("=")?.[2];
    // const jwt: any = querystring.decode(router.asPath?.split("#")?.[1], '&', '=');
    // console.log("🚀 ~> file: callback.tsx ~> line 10 ~> useEffect ~> jwt", router.asPath?.split("#")?.[1], output)
    // console.log("🚀 ~> file: callback.tsx ~> line 22 ~> useEffect ~> jwt", jwt);
    // const url = new URL(window.location.href);

    const searchParams3 = new URLSearchParams(router.asPath?.split("#")?.[1]);
    const jwt = searchParams3.get("id_token");
    console.log(searchParams3.get("id_token"));
    if (jwt) {
      localStorage.setItem("token", jwt);
      window.document.cookie = cookie.serialize("token", jwt, {
        maxAge: 24 * 60 * 60,
        path: "/",
      });
      router.replace("/");
    } else {
      // router.replace("/login");
    }
  }, []);

  return <div>Logginginn</div>;
}

export default Callback;
