import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "rectangular" | "circular";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  width,
  height,
  className = "",
  style,
  ...props
}) => {
  const variantClasses = {
    text: "rounded h-4 my-1",
    rectangular: "rounded-xl",
    circular: "rounded-full",
  };

  return (
    <div
      className={`animate-shimmer bg-slate-200/80 ${variantClasses[variant]} ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};
