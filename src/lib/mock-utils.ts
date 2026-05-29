/**
 * MOCK service 공통 유틸. 추후 fetch 클라이언트 도입 시
 * 각 service 내부에서 이 헬퍼만 fetch 호출로 교체하면 된다.
 */

export const MOCK_DELAY_MS = 500;

export function delayed<T>(
  value: T,
  delay: number = MOCK_DELAY_MS,
): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
}

export function nowISO(): string {
  return new Date().toISOString();
}
