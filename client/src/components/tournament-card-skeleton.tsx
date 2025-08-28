import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function TournamentCardSkeleton() {
  return (
    <Card className="overflow-hidden h-[420px]">
      {/* Tournament Banner Skeleton */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-800">
        <Skeleton className="w-full h-full" />
        {/* Status Badge Skeleton */}
        <div className="absolute top-4 left-4">
          <Skeleton className="w-16 h-6" />
        </div>
        {/* Prize Pool Badge Skeleton */}
        <div className="absolute top-4 right-4">
          <Skeleton className="w-20 h-6" />
        </div>
        {/* Tournament Name Overlay Skeleton */}
        <div className="absolute bottom-4 left-4 right-4">
          <Skeleton className="w-3/4 h-6 mb-2" />
          <Skeleton className="w-1/2 h-4" />
        </div>
      </div>

      {/* Tournament Details Skeleton */}
      <CardContent className="p-4 space-y-4 h-[252px]">
        {/* Game Mode and Type Row Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-12 h-6" />
          </div>
          <Skeleton className="w-16 h-6" />
        </div>

        {/* Details Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3 flex-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-gray-200 dark:border-gray-700 p-3 space-y-2">
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-6" />
            </div>
          ))}
        </div>

        {/* Join Button Skeleton */}
        <Skeleton className="w-full h-12" />
      </CardContent>
    </Card>
  );
}