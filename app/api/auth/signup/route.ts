import { createUser } from "@/lib/server/auth";
import { fail, ok, readJson, requireString, optionalString } from "@/lib/server/http";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await readJson(request)) as Record<string, unknown>;
    const email = requireString(body.email, "email");
    const password = requireString(body.password, "password", { min: 6, max: 128 });
    const name = optionalString(body.name, "name", { max: 100 });

    const user = await createUser({ email, password, name });

    return ok({
      message: "Account created successfully",
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error) {
    return fail(error);
  }
}
