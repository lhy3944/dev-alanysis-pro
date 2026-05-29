"use client";

import Editor from "@monaco-editor/react";
import type { editor as MonacoEditor } from "monaco-editor";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef } from "react";
import { ensureMonacoConfigured } from "@/lib/monaco-setup";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CodeViewerProps {
  code: string;
  language: string;
  className?: string;
}

const OPTIONS: MonacoEditor.IStandaloneEditorConstructionOptions = {
  readOnly: true,
  domReadOnly: true,
  lineNumbers: "on",
  minimap: { enabled: false },
  wordWrap: "on",
  fontSize: 13,
  fontFamily:
    "var(--font-mono, ui-monospace, 'JetBrains Mono', 'Cascadia Code', Consolas, monospace)",
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  renderLineHighlight: "none",
  contextmenu: false,
  scrollbar: {
    verticalScrollbarSize: 8,
    horizontalScrollbarSize: 8,
  },
  padding: { top: 12, bottom: 12 },
  guides: { indentation: false },
  overviewRulerLanes: 0,
  hideCursorInOverviewRuler: true,
  automaticLayout: true,
};

// 컴포넌트는 CodeViewer.lazy 를 통해 ssr:false 로 마운트되므로 hydration mismatch
// 우려 없이 resolvedTheme 을 바로 사용한다.

export function CodeViewer({ code, language, className }: CodeViewerProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  // 1회만 monaco loader 설정 + 언마운트 시 editor dispose.
  useEffect(() => {
    ensureMonacoConfigured();
    return () => {
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, []);

  const handleMount = useCallback(
    (editor: MonacoEditor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
    },
    [],
  );

  const theme = resolvedTheme === "dark" ? "vs-dark" : "vs";

  return (
    <div className={cn("h-full w-full", className)}>
      <Editor
        height="100%"
        language={language}
        value={code}
        theme={theme}
        options={OPTIONS}
        onMount={handleMount}
        loading={<Skeleton className="h-full w-full" />}
      />
    </div>
  );
}
