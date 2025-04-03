
import React from "react";
import { CardFooter } from "@/components/ui/card";

const SummaryFooter = () => {
  return (
    <CardFooter className="bg-zinc-900 p-4 text-sm text-zinc-500 italic border-t border-zinc-800">
      This design brief is based on your inputs and can be customized to match your specific needs.
    </CardFooter>
  );
};

export default SummaryFooter;
