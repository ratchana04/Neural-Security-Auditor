import { ChevronRight, FileCode, Folder } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const FILES = [
  { name: "app", type: "folder", expanded: true },
  { name: "api", type: "folder", expanded: true, indent: 1 },
  { name: "auth", type: "folder", expanded: true, indent: 2 },
  { name: "route.ts", type: "file", indent: 3, active: true },
  { name: "users", type: "folder", indent: 2 },
  { name: "components", type: "folder" },
  { name: "lib", type: "folder" },
  { name: "utils", type: "folder" },
]

export function FileExplorer() {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-card-foreground">Repository</h3>
        <p className="text-xs text-muted-foreground mt-1">my-secure-app</p>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-0.5">
          {FILES.map((file, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 rounded px-2 py-1.5 text-xs cursor-pointer transition-colors ${
                file.active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
              style={{ paddingLeft: `${(file.indent || 0) * 12 + 8}px` }}
            >
              {file.type === "folder" && (
                <ChevronRight className={`h-3 w-3 transition-transform ${file.expanded ? "rotate-90" : ""}`} />
              )}
              {file.type === "folder" ? (
                <Folder className="h-3 w-3 shrink-0" />
              ) : (
                <FileCode className="h-3 w-3 shrink-0 ml-3" />
              )}
              <span className="truncate">{file.name}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
