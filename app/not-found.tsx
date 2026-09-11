import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <p className="text-xs uppercase tracking-[0.22em] text-brass">404</p>
      <h1 className="mt-4 font-serif text-4xl sm:text-5xl">This page is not in the catalog.</h1>
      <p className="mt-4 max-w-md text-sm leading-6 text-muted">
        The address may be mistyped, or the content may have been unpublished.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Back home</ButtonLink>
        <ButtonLink href="/products" variant="secondary">
          Browse products
        </ButtonLink>
      </div>
    </Container>
  );
}
