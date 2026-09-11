import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "main" | "header" | "footer";
  /** Narrower content column for focused product views */
  size?: "default" | "narrow" | "wide";
}

const sizeClass = {
  default: "max-w-6xl",
  narrow: "max-w-2xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  children,
  className,
  as: Tag = "div",
  size = "default",
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeClass[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
