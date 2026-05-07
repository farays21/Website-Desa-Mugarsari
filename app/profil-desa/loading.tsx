export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-[#1a7a2e] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Memuat....</p>
      </div>
    </div>
  )
}
