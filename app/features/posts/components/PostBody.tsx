import { clsx } from "clsx";
import DOMPurify from "isomorphic-dompurify";
import { marked } from "marked";

interface PostBodyProps {
  body: string;
  className?: string;
}

export function PostBody({ body, className }: PostBodyProps) {
  const htmlContent = DOMPurify.sanitize(marked(body));
  return (
    <div
      className={clsx(className, "prose prose-sm min-w-full")}
      dangerouslySetInnerHTML={{
        __html: htmlContent,
      }}
    ></div>
  );
}
