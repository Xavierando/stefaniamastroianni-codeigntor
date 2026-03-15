import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface CommentListProps {
  postId: number | string;
}

export function CommentList({ postId }: CommentListProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        setIsLoading(true);
        const data = await apiFetch(`/comments?postId=${postId}&status=approved`);
        setComments(data || []);
      } catch (err) {
        console.error("Failed to fetch comments", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchComments();
  }, [postId]);

  if (isLoading) {
    return <div className="text-brand-primary/50 text-sm animate-pulse">Caricamento commenti...</div>;
  }

  if (comments.length === 0) {
    return (
      <div className="bg-brand-primary/5 rounded-2xl p-8 text-center text-brand-contrast/60">
        <p>Non ci sono ancora commenti. Sii il primo a condividere il tuo pensiero!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white p-6 rounded-2xl shadow-sm border border-brand-primary/10 flex gap-4">
          <div className="hidden sm:flex flex-shrink-0 w-12 h-12 rounded-full bg-brand-primary/10 items-center justify-center text-brand-primary font-serif text-lg uppercase">
            {comment.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-serif text-lg tracking-wide text-brand-primary">{comment.name}</span>
              <span className="text-xs text-brand-contrast/40">
                {new Date(comment.createdAt).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </span>
            </div>
            <p className="text-brand-contrast/80 leading-relaxed whitespace-pre-wrap">
              {comment.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
