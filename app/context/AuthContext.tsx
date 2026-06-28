"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { isUserSignedIn } from "@/lib/wallet";

interface AuthContextType {
  isLoggedIn: boolean;
  walletAddress: string | null;
  token: string | null;
  refreshAuth: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const refreshAuth = useCallback(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("ooja_token");
    const storedAddress = localStorage.getItem("ooja_wallet_address");
    const walletConnected = isUserSignedIn();

    setToken(storedToken);
    setWalletAddress(storedAddress);
    setIsLoggedIn(walletConnected || !!storedToken);
  }, []);

  const logout = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("ooja_token");
    localStorage.removeItem("ooja_wallet_address");
    setToken(null);
    setWalletAddress(null);
    setIsLoggedIn(false);
  }, []);

  useEffect(() => {
    refreshAuth();

    const handleStorage = () => refreshAuth();
    window.addEventListener("storage", handleStorage);

    const interval = setInterval(refreshAuth, 5000);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, walletAddress, token, refreshAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
