import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="markdown-content">
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-4xl md:text-5xl font-serif text-brand-contrast font-bold mt-12 mb-6"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-3xl md:text-4xl font-serif text-brand-contrast font-bold mt-10 mb-4"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-2xl md:text-3xl font-serif text-brand-contrast font-bold mt-8 mb-4"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              className="text-brand-contrast text-lg leading-relaxed mb-6"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-brand-secondary font-medium underline hover:text-brand-primary transition-colors"
              {...props}
            />
          ),
          img: ({ node, ...props }) => (
            <img
              className="rounded-[2rem] shadow-soft my-10 w-full h-auto object-cover max-h-[600px]"
              alt={props.alt || ""}
              {...props}
            />
          ),
          strong: ({ node, ...props }) => (
            <strong className="text-brand-contrast font-bold" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc pl-6 text-brand-contrast text-lg mb-6 space-y-2 marker:text-brand-secondary"
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal pl-6 text-brand-contrast text-lg mb-6 space-y-2 marker:text-brand-secondary"
              {...props}
            />
          ),
          li: ({ node, ...props }) => <li className="pl-2" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-brand-secondary pl-6 py-1 italic text-brand-contrast/80 my-8 text-xl"
              {...props}
            />
          ),
          code: ({ node, ...props }: any) => {
            const isInline = !props.className?.includes("language-");
            return isInline ? (
              <code
                className="text-brand-secondary bg-brand-primary/5 px-1.5 py-0.5 rounded-full text-sm font-mono"
                {...props}
              />
            ) : (
              <div className="bg-brand-primary/5 p-6 rounded-[2rem] overflow-x-auto text-sm my-8 border-0 shadow-soft">
                <code
                  className="text-brand-contrast font-mono block min-w-full"
                  {...props}
                />
              </div>
            );
          },
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}
