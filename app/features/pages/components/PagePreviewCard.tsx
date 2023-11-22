import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "@remix-run/react";
import { PageWithPostsAndNotes } from "db/schema";
import styles from "./page-preview-card.module.css";

export function PagePreviewCard({ page }: { page: PageWithPostsAndNotes }) {
  return (
    <Link to={`/journal/pages/${page.id}`}>
      <Card className="w-full h-56">
        <h2 className="text-mauve10 text-sm">{page.entryDate?.toDateString()}</h2>
        <h1 className="font-bold">{page.title}</h1>
        <div className={`${styles.textFade} max-h-20`}>
          {page.posts.map((post) => (
            <div key={post.id}>
              <p className="font-semibold text-cyan9">{post.title}</p>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
        <Button variant={"link"} className={"w-fit"}>
          New Post
        </Button>
      </Card>
    </Link>
  );
}
