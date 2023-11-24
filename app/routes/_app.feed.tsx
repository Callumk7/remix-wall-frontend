import { Container } from "@/components/Container";
import { Card } from "@/components/ui/card";
import { auth } from "@/features/auth/helper";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "db";
import { notes } from "db/schema";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allNotes = await db.query.notes.findMany({
    with: {
      author: {
        with: {
          profile: true
        }
      }
    }
  })

  return json({ session, allNotes });
};


export default function FeedPage() {
  const {allNotes} = useLoaderData<typeof loader>();
  return (
    <Container>
      <h1 className="font-black text-6xl">Feed.</h1>
      {allNotes.map(note => (
        <Card key={note.id}>
          <h1 className="font-bold">{note.author.profile.userName}</h1>
          <p>{note.parentType}</p>
          <p className="whitespace-pre-wrap">{note.body}</p>
        </Card>
      ))}
    </Container>
  )
}
