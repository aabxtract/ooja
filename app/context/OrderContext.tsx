"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type OutcomeType = "Above" | "Below";

export interface SelectedOrder {
  marketId: string;
  question: string;
  outcome: OutcomeType;
  odds: number;
}

interface OrderContextType {
  selectedOrder: SelectedOrder | null;
  wagerAmount: string;
  selectOutcome: (order: SelectedOrder) => void;
  clearSlip: () => void;
  setWagerAmount: (amount: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [selectedOrder, setSelectedOrder] = useState<SelectedOrder | null>(null);
  const [wagerAmount, setWagerAmount] = useState<string>("");

  const selectOutcome = (order: SelectedOrder) => {
    setSelectedOrder(order);
  };

  const clearSlip = () => {
    setSelectedOrder(null);
    setWagerAmount("");
  };

  return (
    <OrderContext.Provider
      value={{
        selectedOrder,
        wagerAmount,
        selectOutcome,
        clearSlip,
        setWagerAmount,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
