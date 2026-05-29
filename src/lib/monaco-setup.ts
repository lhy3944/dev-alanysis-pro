/**
 * monaco-editor 초기화.
 *
 * 현재 정책: @monaco-editor/react 의 기본 CDN loader 사용 (jsDelivr).
 * 사내망 / 오프라인 배포가 필요해지면 아래 SELF_HOST 옵션을 활성화하고
 * public/vs/ 에 monaco-editor 의 min/vs 디렉토리를 복사한다.
 *
 * ensureMonacoConfigured() 는 client-only 모듈에서 한 번만 호출.
 */

import { loader } from "@monaco-editor/react";

let configured = false;

export function ensureMonacoConfigured(): void {
  if (configured) return;
  configured = true;

  // TODO: 사내망 배포 시 아래 주석 해제 + public/vs/ 디렉토리 준비
  // loader.config({ paths: { vs: "/vs" } });

  // 현재는 기본 CDN 사용. preload 트리거만 호출해 사용자가 사이드 패널을
  // 처음 열 때의 첫 페인트 지연을 줄인다.
  void loader.init();
}
