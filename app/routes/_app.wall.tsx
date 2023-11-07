import { Button } from "@/components/ui/button";
import { Input, TextArea } from "@/components/ui/forms";
import { Switch } from "@/components/ui/switch";
import { ToggleButton } from "@/components/ui/toggle-button";
import { auth } from "@/features/auth/helper";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { TextPost } from "@/features/posts/components/TextPost";
import { getDayOfYear } from "@/features/posts/util";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { posts } from "db/schema";
import { desc } from "drizzle-orm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allPosts = await db.query.posts.findMany({
    with: {
      author: true,
    },
    orderBy: [desc(posts.createdAt)],
  });

  return json({ session, allPosts });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await auth(request);
  const formData = await request.formData();
  const body = formData.get("body")?.toString();
  const priv = formData.get("private")?.toString();
  const addDay = formData.get("addDay")?.toString();

  let isPrivate = false;
  if (priv) {
    isPrivate = true;
  }

  const createdAt = new Date();
  if (addDay) {
    createdAt.setDate(createdAt.getDate() + 1);
  }

  const dayOfYear = getDayOfYear(createdAt);

  console.log(createdAt.getFullYear());

  // Create an entry in the database, will need to be validated at some point
  // I should create somewhere to put common queries
  const newPost = await db.insert(posts).values({
    hasBody: true,
    body: body,
    hasImage: false,
    authorId: session.id,
    isPrivate: isPrivate,
    createdAt: createdAt,
    day: dayOfYear,
    month: createdAt.getMonth(),
    year: createdAt.getFullYear(),
  });

  console.log(JSON.stringify(newPost));

  return json(
    { newPost },
    { status: 200, statusText: "Successfully created a new post" },
  );
};

export default function WallPage() {
  const { session, allPosts } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto mt-10 w-4/5">
      <h1 className="text-[76px] font-extrabold">
        <span className="underline decoration-ruby9">Feed</span>.
      </h1>
      <CreatePostForm />
      <div className="flex flex-col gap-3">
        {allPosts.map((post) => (
          <TextPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
