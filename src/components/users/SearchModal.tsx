import { useState } from "react";
import { Search, X } from "lucide-react";
import { useSearchUsers } from "@/hooks/useUsers";
import { UserListItem } from "@/components/users/UserListItem";
import { Skeleton } from "@/components/ui/Feedback";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const { data: results, isLoading, isFetching } = useSearchUsers(query);

  if (!open) return null;

  const trimmed = query.trim();

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-1/2 top-16 w-full max-w-lg -translate-x-1/2 px-4">
        <div className="flex flex-col rounded-xl border border-border bg-surface shadow-modal animate-slide-up">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people by name or username..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              onClick={onClose}
              aria-label="Close search"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-hover hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto px-4">
            {trimmed.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Start typing to find people.
              </p>
            )}

            {trimmed.length > 0 && (isLoading || isFetching) && (
              <div className="space-y-3 py-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-3 flex-1" />
                  </div>
                ))}
              </div>
            )}

            {trimmed.length > 0 && !isLoading && !isFetching && results?.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No one found for "{trimmed}".
              </p>
            )}

            {trimmed.length > 0 && !isLoading && results && results.length > 0 && (
              <div className="divide-y divide-border">
                {results.map((user) => (
                  <UserListItem key={user.id} user={user} onNavigate={onClose} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
