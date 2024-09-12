import { CircularProgress } from "@nextui-org/react";

export default function Loading() {
  return (
    <CircularProgress
      className="mx-auto"
      classNames={{
        svg: "w-36 h-36",
      }}
      aria-label="Loading page..."
    />
  );
}
