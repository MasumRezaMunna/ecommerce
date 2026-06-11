export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white dark:bg-neutral-950 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-primary-900" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin" />
        </div>
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Loading…</span>
      </div>
    </div>
  );
}
