import Spinner from "./Spinner";

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050913]">
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-xl font-bold text-white shadow-lg shadow-purple-500/20">
            M
          </div>
          <span className="text-xl font-semibold text-white">MindEase</span>
        </div>
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-slate-400">Loading your wellness space...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;