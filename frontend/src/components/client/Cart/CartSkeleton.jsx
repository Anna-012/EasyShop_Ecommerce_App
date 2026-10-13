const CartSkeleton = () => {
  return (
    <main className="min-h-screen bg-[#FAF9FF] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_340px]">
          {/* Cart items skeleton */}
          <section className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-purple-100 bg-white px-5 py-4">
              <div className="shimmer-bg h-5 w-28 rounded-md" />
              <div className="shimmer-bg h-6 w-16 rounded-full" />
            </div>

            {Array.from({ length: 2 }).map((_, index) => (
              <article
                key={index}
                className="flex flex-col gap-4 rounded-2xl border border-purple-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="shimmer-bg h-24 w-24 shrink-0 rounded-xl sm:h-28 sm:w-28" />

                  <div className="flex-1 space-y-3">
                    <div className="shimmer-bg h-4 w-40 max-w-full rounded-md" />
                    <div className="shimmer-bg h-3 w-24 rounded-md" />
                    <div className="shimmer-bg h-5 w-20 rounded-md" />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="shimmer-bg h-10 w-28 rounded-lg" />
                  <div className="shimmer-bg h-9 w-16 rounded-lg" />
                </div>
              </article>
            ))}
          </section>

          {/* Order summary skeleton */}
          <aside className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
            <div className="shimmer-bg h-6 w-36 rounded-md" />

            <div className="mt-6 space-y-5">
              <div className="flex justify-between gap-4">
                <div className="shimmer-bg h-4 w-20 rounded-md" />
                <div className="shimmer-bg h-4 w-16 rounded-md" />
              </div>

              <div className="flex justify-between gap-4">
                <div className="shimmer-bg h-4 w-16 rounded-md" />
                <div className="shimmer-bg h-4 w-28 rounded-md" />
              </div>

              <div className="border-t border-purple-100 pt-4">
                <div className="flex justify-between gap-4">
                  <div className="shimmer-bg h-5 w-20 rounded-md" />
                  <div className="shimmer-bg h-6 w-24 rounded-md" />
                </div>
              </div>

              <div className="shimmer-bg h-12 w-full rounded-xl" />
              <div className="shimmer-bg mx-auto h-4 w-32 rounded-md" />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CartSkeleton;
