import { uuidv4 } from "@/features/auth/uuidGenerator";
import { createCalendarDate } from "@/util/date-utilities";
import { getFormValues } from "@/util/forms";
import { db } from "db";
import { posts } from "db/schema";

export const createPostFromPage = async (request: Request, userId: string) => {
  const keys: string[] = ["title", "body", "private", "addDay", "pageId"];
  const formValues = await getFormValues(keys, request);
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
