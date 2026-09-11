import { ProductGridSkeleton } from "@/components/ui/loading-skeleton";
import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/loading-skeleton";

export default function ProductsLoading() {
  return (
    <Container className="py-16">
      <Skeleton className="mb-3 h-3 w-24" />
      <Skeleton className="h-12 w-64" />
      <div className="mt-12">
        <ProductGridSkeleton />
      </div>
    </Container>
  );
}
