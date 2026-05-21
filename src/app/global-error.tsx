"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">오류가 발생했습니다</h1>
          <p className="mt-4 text-lg text-gray-500">
            예기치 않은 오류가 발생했습니다.
          </p>
          <button
            onClick={reset}
            className="mt-8 rounded-lg bg-teal-500 px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            다시 시도
          </button>
        </div>
      </body>
    </html>
  );
}
