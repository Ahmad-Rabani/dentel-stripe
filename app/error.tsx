"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-brass">Something went wrong</p>
      <h1 className="mt-4 font-serif text-4xl">This page could not be loaded.</h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-muted">
        Please try again. If the problem continues, come back in a moment or contact the studio.
      </p>
      <Button className="mt-8" onClick={() => retry()}>
        Try again
      </Button>
    </Container>
  );
}
