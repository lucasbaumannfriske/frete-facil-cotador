
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
        <Card className="border-t-4 border-t-primary shadow-md">
          <CardContent className="p-6">
            <TransportadorasGestao />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
