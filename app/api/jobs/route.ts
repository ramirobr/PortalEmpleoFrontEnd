import { NextResponse } from "next/server";
import jobsData from "@/lib/mocks/jobs.json";

export async function GET() {
  return NextResponse.json(jobsData);
}
