import { NextResponse } from "next/server";
import testimonialsData from "@/lib/mocks/testimonials.json";

export async function GET() {
  return NextResponse.json(testimonialsData);
}
