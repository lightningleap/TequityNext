"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="max-auto max-w-6xl ">
      <div className="flex items-center gap-2 bg-muted px-3 py-2 w-[862px] h-[36px] ">
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
        <Input
          placeholder="Search"
          className="border-0 bg-transparent px-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0 "
          aria-label="Search files"
        />
      </div>
    </div>
  );
}
