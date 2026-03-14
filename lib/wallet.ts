"use client";

import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import type { StacksNetwork } from "@stacks/network";
import { APP_NAME, APP_ICON } from "@/constants";

const appConfig = new AppConfig(["store_write", "publish_data"]);

const userSession = new UserSession({ appConfig });

export function getUserSession() {
  return userSession;
}

export function isUserSignedIn() {
  return userSession.isUserSignedIn();
}

export function isSignInPending() {
  return userSession.isSignInPending();
}

export function getUserData() {
  if (!isUserSignedIn()) return null;
  return userSession.loadUserData();
}

export function connectWallet(network: StacksNetwork) {
  return new Promise<void>((resolve, reject) => {
    showConnect({
      userSession,
      network,
      appDetails: {
        name: APP_NAME,
        icon: APP_ICON,
      },
      onFinish: () => {
        resolve();
      },
      onCancel: () => {
        reject(new Error("User cancelled wallet connection"));
      },
    });
  });
}

export function disconnectWallet(redirectTo: string = "/") {
  userSession.signUserOut(redirectTo);
}

