"use client";

import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface DashboardKpiCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
}

export default function DashboardKpiCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  iconColorClass = "text-primary",
  iconBgClass = "bg-primary/10",
}: DashboardKpiCardProps) {
  return (
    <Card className="p-6 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-zinc-500 mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-zinc-900">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${iconBgClass}`}>
          <Icon className={`size-5 ${iconColorClass}`} />
        </div>
      </div>
      {trend !== undefined && change !== undefined && (
        <div className="mt-4 flex items-center">
          <span
            className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
              trend === "up"
                ? "text-green-700 bg-green-50"
                : trend === "down"
                  ? "text-red-700 bg-red-50"
                  : "text-zinc-700 bg-zinc-50"
            }`}
          >
            {trend === "up" && <ArrowUpRight className="size-3 mr-1" />}
            {trend === "down" && <ArrowDownRight className="size-3 mr-1" />}
            {trend === "neutral" && <Minus className="size-3 mr-1" />}
            {Math.abs(change)}%
          </span>
          <span className="text-xs text-zinc-400 ml-2">vs mes anterior</span>
        </div>
      )}
    </Card>
  );
}
