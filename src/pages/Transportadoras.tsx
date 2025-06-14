
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import TransportadorasGestao from "@/components/TransportadorasGestao";
import { TruckIcon } from "lucide-react";

export default function TransportadorasPage() {
  return (
    <div>
      <Navigation />
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <TruckIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-center">Transportadoras</h1>
        </div>
        <Card className="rounded-2xl border-0 bg-blue-50 shadow-md shadow-blue-100 mb-4">
          <CardContent className="p-8 flex flex-col gap-4">
            <TransportadorasGestao />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
