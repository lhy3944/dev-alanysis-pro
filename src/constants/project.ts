import type { AnalysisType, ProjectLifecycleStatus } from '@/types/project';

export const LIFECYCLE_LABELS: Record<ProjectLifecycleStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  deleted: 'Deleted',
};

export const LIFECYCLE_COLORS: Record<ProjectLifecycleStatus, string> = {
  draft: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  published: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  deleted: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export const ANALYSIS_TYPE_LABELS: Record<AnalysisType, string> = {
  java: 'Java',
  c_cpp: 'C/C++',
  objective_c_cpp: 'Objective-C/C++',
  swift: 'Swift',
  webos: 'webOS',
  python: 'Python',
  javascript_typescript: 'JavaScript/TypeScript',
  dart: 'Dart',
};

export const ANALYSIS_TYPE_COLORS: Record<AnalysisType, string> = {
  java: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  c_cpp: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  objective_c_cpp: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  swift: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  webos: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  python: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300',
  javascript_typescript: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  dart: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
};
