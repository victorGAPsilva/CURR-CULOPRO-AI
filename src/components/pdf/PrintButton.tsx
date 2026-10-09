"use client";

import { Button } from "@/components/ui/button";
import { IconPrinter } from "@/components/ui/icons";

export function PrintButton() {
  return (
    <Button variant="outline" onClick={() => window.print()}>
      <IconPrinter className="h-4 w-4" />
      Imprimir
    </Button>
  );
}
