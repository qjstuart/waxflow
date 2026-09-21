import { createAuth } from "./auth.js"

const jsonHeaders = { "content-type": "application/json; charset=utf-8" }

function jsonError(message: string, status: number): Response {
  return Response.json({ message }, { status, headers: jsonHeaders })
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url)

    try {
      const auth = createAuth(request, env, ctx)

      if (url.pathname.startsWith("/api/auth/")) {
        return auth.handler(request)
      }

      if (url.pathname === "/api/account" && request.method === "GET") {
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session) {
          return jsonError("Authentication required", 401)
        }

        return Response.json({
          account: {
            id: session.user.id,
            email: session.user.email,
          },
        })
      }

      if (
        url.pathname === "/api/test/emails/latest" &&
        request.method === "GET" &&
        env.EMAIL_DELIVERY_MODE === "capture"
      ) {
        const recipient = url.searchParams.get("recipient")
        const kind = url.searchParams.get("kind")
        if (!recipient) {
          return jsonError("Recipient is required", 400)
        }

        const email = await env.DB.prepare(
          `SELECT actionUrl
             FROM test_email
            WHERE recipient = ?
              AND (? IS NULL OR kind = ?)
            ORDER BY createdAt DESC
            LIMIT 1`,
        )
          .bind(recipient, kind, kind)
          .first<{ actionUrl: string }>()

        if (!email) {
          return jsonError("No captured message", 404)
        }

        return Response.json(email)
      }

      if (url.pathname.startsWith("/api/")) {
        return jsonError("Not found", 404)
      }

      return new Response(null, { status: 404 })
    } catch (error: unknown) {
      console.error(
        JSON.stringify({
          message: "request failed",
          method: request.method,
          path: url.pathname,
          error: error instanceof Error ? error.message : String(error),
        }),
      )
      return jsonError("Something went wrong", 500)
    }
  },
} satisfies ExportedHandler<Env>
