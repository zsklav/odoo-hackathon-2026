"use client";

import { Download } from "lucide-react";

export function ExportPdfButton({ title }: { title: string }) {
  function exportPdf() {
    const previousTitle = document.title;
    document.title = title;
    window.print();
    window.setTimeout(() => { document.title = previousTitle; }, 0);
  }

  return <button onClick={exportPdf} className="flex items-center gap-2 rounded-md bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"><Download className="h-4 w-4" />Export PDF</button>;
}
