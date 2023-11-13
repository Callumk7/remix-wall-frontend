import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/forms";
import { Link, useFetcher } from "@remix-run/react";
import { PostWithAuthorAndComments } from "db/schema";
import DOMPurify from 'isomorphic-dompurify';
import { marked } from "marked";
import { useState } from "react";

interface TextPostProps {
  post: PostWithAuthorAndComments;
}

export function TextPost({ post }: TextPostProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const fetcher = useFetcher();
  const date = new Date(String(post.createdAt)).toDateString();

  const htmlContent = DOMPurify.sanitize(marked(post.body!));
  return (
    <div
      className={`group relative flex flex-col gap-y-2 rounded-md border p-3 ${
        post.isPrivate ? "bg-ruby4" : ""
      }`}
    >
      <p className="text-sm font-light text-mauve8">{date}</p>
      <Link
        to={`/wall/${post.authorId}`}
        className="font-bold text-ruby9 underline"
      >
        {post.author.profiles.userName}
      </Link>
      <div
        className="prose prose-sm min-w-full"
        dangerouslySetInnerHTML={{
          __html: htmlContent,
        }}
      ></div>
      {isCommenting ? (
        <fetcher.Form
          className="flex flex-col gap-y-1"
          method="post"
          action={`/post/${post.id}`}
        >
          <TextArea label="comment" name="body" />
          <Button type="submit">Send</Button>
        </fetcher.Form>
      ) : (
        <Button
          className="opacity-0 transition-opacity ease-in group-hover:opacity-100"
          onPress={() => setIsCommenting(!isCommenting)}
        >
          Comment
        </Button>
      )}
      {post.comments.length > 0 && (
        <div>
          {post.comments.map((comment) => (
            <div key={comment.id}>{comment.body}</div>
          ))}
        </div>
      )}
    </div>
  );
}
