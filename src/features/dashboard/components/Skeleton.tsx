/*
  Skeleton loading component.

  Accessibility notes:
  - The entire skeleton is wrapped in aria-hidden="true" because it's purely
    visual chrome with no meaningful content. The parent caller should use
    aria-busy="true" and aria-label on its container to communicate the
    loading state to screen readers.
  - Individual skeleton blocks have no role or label — they are decorative.
*/

const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`skeleton ${className}`} aria-hidden="true" />
);

const Skeleton = () => {
  return (
    <div aria-hidden="true" className="animate-fade-in space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border p-5 space-y-4"
            style={{
              background: "var(--surface-1)",
              borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
            }}
          >
            <div className="flex justify-between items-start">
              <SkeletonBlock className="h-3 w-24" />
              <SkeletonBlock className="h-8 w-8 rounded-lg" />
            </div>
            <SkeletonBlock className="h-7 w-28" />
            <SkeletonBlock className="h-2.5 w-16" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--surface-1)",
          borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
        }}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{
            borderColor: "color-mix(in srgb, currentColor 6%, transparent)",
          }}
        >
          <div className="space-y-1.5">
            <SkeletonBlock className="h-3.5 w-36" />
            <SkeletonBlock className="h-2.5 w-24" />
          </div>
        </div>
        <div className="p-5">
          <SkeletonBlock className="h-60 w-full" />
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--surface-1)",
          borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
        }}
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-4 border-b"
            style={{
              borderColor: "color-mix(in srgb, currentColor 6%, transparent)",
            }}
          >
            <SkeletonBlock className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <SkeletonBlock className="h-3 w-32" />
              <SkeletonBlock className="h-2 w-20" />
            </div>
            <SkeletonBlock className="h-5 w-16 rounded-full" />
            <SkeletonBlock className="h-3 w-16 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
