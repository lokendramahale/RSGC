import React from "react"

export function Skeleton({ className }: { className?: string }) {
  return (
	<div
	  className={`animate-pulse rounded-md bg-muted${className ? ` ${className}` : ""}`}
	  aria-busy="true"
	  aria-live="polite"
	/>
  );
}

