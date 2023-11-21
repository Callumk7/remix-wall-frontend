import { Button } from "@/components/ui/button";
import { Input, TextArea } from "@/components/ui/forms";
import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { JournalTextPost } from "@/features/journal/components/JournalTextPost";
import { createCalendarDate } from "@/util/date-utilities";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData, useParams } from "@remix-run/react";
import { db } from "db";
import { posts } from "db/schema";
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";

const handlePOST = async (request: Request, userId: string) => {
  const keys: string[] = ["title", "body", "private", "addDay", "pageId"];
  const formData = await request.formData();
  const formValues: Record<string, string | undefined> = {};

  keys.forEach((key) => {
    formValues[key] = formData.get(key)?.toString();
  });

  // WARN: Currently hard-coding the date stuff to be the date the post was posted. This will be changed

  const currentTimestamp = new Date();
  const currentDate = createCalendarDate(currentTimestamp);

  if (formValues.addDay) {
    currentTimestamp.setDate(currentTimestamp.getDate() + 1);
    currentDate.add({ days: 1 });
  }

  let isPrivate = false;
  if (formValues.priv) {
    isPrivate = true;
  }

  // Now we need to create the post and reference the journal page.
  const newPost = await db
    .insert(posts)
    .values({
      id: `post_${uuidv4()}`,
      createdAt: currentTimestamp,
      updatedAt: currentTimestamp,
      title: formValues.title,
      body: formValues.body!,
      authorId: userId,
      day: currentDate.day,
      month: currentDate.month,
      year: currentDate.year,
      entryDate: currentDate.toDate("gmt"),
      isPrivate: isPrivate,
      pageId: formValues.pageId,
    })
    .returning();

  console.log(newPost);

  return newPost;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const pageId = params.pageId;
  invariant(pageId, "Must have a pageId");
  const pagePosts = await db.query.posts.findMany({
    where: eq(posts.pageId, pageId),
    with: {
      comments: {
        with: {
          author: {
            with: {
              profile: true,
            },
          },
        },
      },
    },
  });
  return json({ session, pagePosts });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await auth(request);
  const response = await handlePOST(request, session.id);
  return json({ response });
};

export default function PageView() {
  const { pagePosts } = useLoaderData<typeof loader>();
  const params = useParams();
  const pageId = params.pageId;
  return (
    <div>
      <div>
        {pagePosts.map((post) => (
          <JournalTextPost key={post.id} post={post} />
        ))}
      </div>
      <Form method="POST">
        <Input name="title" />
        <TextArea name="body" isRequired />
        <input type="hidden" value={pageId} name="pageId" />
        <Button type="submit">Post</Button>
      </Form>
    </div>
  );
}
