export type MessageLevel = "primary" | "secondary" | "tertiary" | "warning" | "danger";

export type Message = {
  level: MessageLevel;
  title: string;
  details?: string[];
  icon?: string;
};