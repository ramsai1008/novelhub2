"use client";
import React, { createContext, useState } from "react";

export const SearchContext = createContext({
  searchTerm: "",
  setSearchTerm: (v: string) => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
}
