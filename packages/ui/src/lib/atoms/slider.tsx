import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "../utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, orientation = "horizontal", value, defaultValue, ...props }, ref) => {
  // Determine which values to use for rendering thumbs (either value or defaultValue)
  const thumbValues = value || defaultValue || [];

  return (
    <SliderPrimitive.Root
      ref={ref}
      orientation={orientation}
      value={value}
      defaultValue={defaultValue}
      className={cn(
        "relative flex touch-none select-none",
        orientation === "horizontal"
          ? "w-full h-5 items-center"
          : "h-full w-5 flex-col items-center justify-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "relative overflow-hidden rounded-full bg-primary/20",
          orientation === "horizontal"
            ? "h-1.5 w-full"
            : "w-1.5 h-full"
        )}
      >
        <SliderPrimitive.Range className={cn(
          "absolute bg-primary",
          orientation === "horizontal" ? "h-full" : "w-full"
        )} />
      </SliderPrimitive.Track>
      {thumbValues.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };