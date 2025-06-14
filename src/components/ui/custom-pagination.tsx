// src/components/ui/custom-pagination.tsx
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

const CustomPaginationButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      size="sm"
      className={cn("h-9 w-auto px-4 py-2", className)}
      {...props}
    />
  )
);
CustomPaginationButton.displayName = "CustomPaginationButton";

const CustomPaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof CustomPaginationButton>) => (
  <CustomPaginationButton
    aria-label="На предыдущую страницу"
    className={cn("flex items-center gap-1", className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Назад</span>
  </CustomPaginationButton>
);
CustomPaginationPrevious.displayName = "CustomPaginationPrevious";

const CustomPaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof CustomPaginationButton>) => (
  <CustomPaginationButton
    aria-label="На следующую страницу"
    className={cn("flex items-center gap-1", className)}
    {...props}
  >
    <span>Вперед</span>
    <ChevronRight className="h-4 w-4" />
  </CustomPaginationButton>
);
CustomPaginationNext.displayName = "CustomPaginationNext";

export {
  CustomPaginationButton,
  CustomPaginationPrevious,
  CustomPaginationNext,
};
