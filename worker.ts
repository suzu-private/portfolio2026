console.log("worker executed");

export interface Env {
  BASIC_AUTH_USER: string;
  BASIC_AUTH_PASSWORD: string;
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const auth = request.headers.get("Authorization");

    if (!auth?.startsWith("Basic ")) {
      return unauthorized();
    }

    const encoded = auth.substring(6);
    const decoded = atob(encoded);

    const [user, password] = decoded.split(":");

    if (
      user !== env.BASIC_AUTH_USER ||
      password !== env.BASIC_AUTH_PASSWORD
    ) {
      return unauthorized();
    }

    return env.ASSETS.fetch(request);
  },
};

function unauthorized() {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Portfolio"',
    },
  });
}