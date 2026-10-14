import { NextRequest } from "next/server";
import { POST as handleContactSubmit } from "@/app/api/submissions/contact/route";

export async function POST(request: NextRequest) {
  return handleContactSubmit(request);
}
