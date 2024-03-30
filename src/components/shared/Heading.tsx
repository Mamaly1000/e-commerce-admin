"use client";
import { cn } from "@/lib/utils";
import React, { FC } from "react";

interface HeadingProps {
  title?: string;
  description?: string;
  className?: string;
  navigate?: {
    home?: boolean;
    filter?: boolean;
    sort?: boolean;
    refresh?: boolean;
  };
}

const Heading: FC<HeadingProps> = ({ description, title, className }) => {
  return (
    <section
      className={cn(
        "w-full h-[200px] flex flex-col items-start justify-start gap-2",
        className
      )}
    >
      {!!title && (
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      )}
      {!!description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </section>
  );
};

export default Heading;
