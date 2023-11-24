import { Button, Link } from "@/components/ui/button";
import { FormModal } from "@/components/ui/modal";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";

export const meta: MetaFunction = () => {
  return [
    { title: "The Wall" },
    { name: "description", content: "Journalling for the social generation" },
  ];
};

export const loader = async () => {
  const data = await db.query.users.findMany();
  return json({ data });
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto mt-10 w-4/5 text-center">
      <FormModal trigger={<Button>Form Modal</Button>}>
        <CreatePostForm action="asdas" />
      </FormModal>
      <h1 className="text-5xl font-bold">Lets get Started</h1>
      {data.map((user) => (
        <Link variant={"link"} to={`/journal/${user.id}`} key={user.id}>
          a user id: {user.id}
        </Link>
      ))}
      <span className="text-mint9">
        This page should become the home feed at some point
      </span>
    </div>
  );
}
