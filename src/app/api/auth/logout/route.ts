import { endSession } from "@/lib/auth/session";
import { jsonOk } from "@/lib/utils/http";

export async function POST() {
  await endSession();
  return jsonOk({ ok: true });
}
