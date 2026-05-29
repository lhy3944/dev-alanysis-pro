/**
 * 파일 확장자 → monaco language id 매핑.
 * 분석 대상 7개 언어(Java, C/C++, Objective-C/C++, Swift, webOS(JS/TS), Python, JS/TS, Dart) 커버.
 * 매핑되지 않은 확장자는 "plaintext".
 */

const EXT_TO_LANG: Record<string, string> = {
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hpp: "cpp",
  hh: "cpp",
  hxx: "cpp",
  m: "objective-c",
  mm: "objective-c",
  ts: "typescript",
  tsx: "typescript",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  py: "python",
  pyi: "python",
  swift: "swift",
  java: "java",
  dart: "dart",
  json: "json",
  md: "markdown",
};

export function detectLanguage(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXT_TO_LANG[ext] ?? "plaintext";
}
