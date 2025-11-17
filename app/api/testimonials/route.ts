import { NextResponse } from "next/server";
import testimonialsData from "../../mocks/testimonials.json";

export async function GET() {
  return NextResponse.json(testimonialsData);
}
