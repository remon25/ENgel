import { Suspense } from "react";
import CategoryPageClient from "./CategoryPageClient";
import Spinner from "@/app/_components/layout/Spinner";

export default function CategoryPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CategoryPageClient />
    </Suspense>
  );
}