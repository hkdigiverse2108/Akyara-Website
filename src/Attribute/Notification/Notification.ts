import type { NotificationType } from "../../Types";

let listener: ((msg: string, type: NotificationType) => void) | null = null;

export const ShowNotification = (message: string, type: NotificationType = "info") => {
  listener?.(message, type);
};

export const SubscribeNotification = (fn: (msg: string, type: NotificationType) => void) => {
  listener = fn;
};
