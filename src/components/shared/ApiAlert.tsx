"use client";
import React from "react";
import { Badge, BadgeProps } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Copy, Server } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};
const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};
const ApiAlert: React.FC<ApiAlertProps> = ({
  title,
  description,
  variant = "public",
}) => {
  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description);
    toast.success("API Route copied to the clipboard");
  };
  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle>
        {title}
        <Badge variant={variantMap[variant]}> {textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between min-w-full max-w-full gap-2">
        <code className="relative rounded bg-muted px-[.3rem] py-[.2rem] font-mono text-sm font-semibold max-w-[80%] overflow-hidden">
          {description}
        </code>
        <Button
          variant={"outline"}
          size="icon"
          onClick={() => onCopy(description)}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ApiAlert;
