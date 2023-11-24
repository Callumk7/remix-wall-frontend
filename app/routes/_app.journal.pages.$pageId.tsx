import { EditableTextPost } from "@/components/posts/EditablePost";
import { Button } from "@/components/ui/button";
import { Input, TextArea } from "@/components/ui/forms";
import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { createPostFromPage } from "@/features/pages/queries/create-post-from-page";
import { createCalendarDate } from "@/util/date-utilities";
import { getFormValues } from "@/util/forms";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useFetcher, useParams } from "@remix-run/react";
import { db } from "db";
import { pages, posts } from "db/schema";
import { eq } from "drizzle-orm";
import { useEffect, useRef, useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";

// TODO: Move this somewhere better

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await auth(request);
  const pageId = params.pageId;
  invariant(pageId, "Must have a pageId");
  const pageWithPosts = await db.query.pages.findFirst({
    where: eq(pages.id, pageId),
    with: {
      posts: true,
    },
  });
  return typedjson({ session, pageWithPosts });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await auth(request);

  // WARN: This is stupid. This needs to be cleaned up
  const dupeRequest = new Request(request);

  const keys: string[] = ["_action", "pageId", "title"];
  const formValues = await getFormValues(keys, dupeRequest);
  console.log(formValues);
  if (formValues._action === "edit") {
    const updatedPage = await db
      .update(pages)
      .set({
        title: formValues.title,
      })
      .where(eq(pages.id, formValues.pageId!));
    return json({ updatedPage });
    // TODO: Make this more explicit.
  } else {
    const response = await createPostFromPage(request, session.id);
    return json({ response });
  }
};

export default function PageView() {
  const { pageWithPosts } = useTypedLoaderData<typeof loader>();
  const params = useParams();
  const pageId = params.pageId;

  if (!pageWithPosts) {
    return <div>Page Not Found</div>;
  }

  return (
    <div className="mt-5 flex flex-col gap-y-6">
      <EditablePageTitle
        pageTitle={pageWithPosts.title}
        pageId={pageWithPosts.id}
      />
      <div>
        {pageWithPosts.posts.map((post) => (
          <EditableTextPost key={post.id} post={post} />
        ))}
      </div>
      <Form className="flex flex-col gap-y-2" method="POST">
        <Input name="title" />
        <TextArea name="body" isRequired />
        <input type="hidden" value={pageId} name="pageId" />
        <Button type="submit">Post</Button>
      </Form>
    </div>
  );
}

interface EditablePageTitleProps {
  pageTitle: string;
  pageId: string;
}

function EditablePageTitle({ pageTitle, pageId }: EditablePageTitleProps) {
  const fetcher = useFetcher();
  const [isEditing, setIsEditing] = useState<boolean>();
  const [editedTitle, setEditedTitle] = useState<string>(pageTitle);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    fetcher.submit(formRef.current, {
      method: "PATCH",
    });
    setIsEditing(false);
  };

  return (
    <div className="group relative w-fit">
      {isEditing ? (
        <Form method="PATCH" ref={formRef}>
          <Input
            ref={inputRef}
            className="text-6xl font-black"
            name="title"
            value={editedTitle}
            onChange={(value) => setEditedTitle(value)}
            onBlur={handleBlur}
          />
          <input type="hidden" name="pageId" value={pageId} />
          <input type="hidden" name="_action" value="edit" />
        </Form>
      ) : (
        <>
          <h1 className="text-6xl font-black p-1">{pageTitle}</h1>
          <Button
            size={"icon"}
            className="absolute -right-12 top-2 opacity-0 transition-opacity delay-100 duration-75 ease-in group-hover:opacity-100"
            onPress={() => setIsEditing(true)}
          >
            <Pencil1Icon />
          </Button>
        </>
      )}
    </div>
  );
}
