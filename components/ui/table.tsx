"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn(
          "w-full border-separate border-spacing-0 border-spacing-y-0.5 caption-bottom text-xs",
          className
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn(
        "mb-1 py-2.5 px-4 bg-white text-[0.75rem] md:text-[0.875rem] font-semibold",
        "[&>tr>th:first-child]:rounded-tl-ml [&>tr>th:first-child]:border [&>tr>th:first-child]:border-r-0 [&>tr>th:first-child]:pl-4",
        "[&>tr>th:last-child]:rounded-tr-ml [&>tr>th:last-child]:border [&>tr>th:last-child]:border-l-0 [&>tr>th:last-child]:pr-4",
        "[&>tr>th]:relative [&>tr>th]:after:absolute [&>tr>th]:after:bottom-0 [&>tr>th]:after:left-0 [&>tr>th]:after:w-full [&>tr>th]:after:h-1 [&>tr>th]:after:bg-primary-bg [&>tr>th]:after:content-['']",
        className
      )}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "rounded-b-ml bg-white font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "transition-colors hover:bg-white/50 bg-white has-aria-expanded:bg-white data-[state=selected]:bg-white/50",
        "[&>td]:border-b [&>td]:border-neutrals-100 [&>td:first-child]:pl-4 [&>td]:py-4",
        "text-[0.875rem] md:text-[1rem]",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 border-neutrals-100 bg-white text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

function TableWrapper({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "overflow-hidden border-b border-b-grays-borders rounded-b-ml",
        className
      )}
      {...props}
    ></div>
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableWrapper,
};
