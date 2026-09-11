import { PageHeroSkeleton, ProductGridSkeleton } from "@/components/ui/loading-skeleton";
import { Container } from "@/components/ui/container";

export default function Loading() {
  return (
    <Container className="py-10">
      <PageHeroSkeleton />
      <ProductGridSkeleton />
    </Container>
  );
}
