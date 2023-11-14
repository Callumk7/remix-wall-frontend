import { auth } from "@/features/auth/helper";
import { CreatePostForm } from "@/features/posts/components/CreatePostForm";
import { TextPost } from "@/features/posts/components/TextPost";
import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "db";
import {
    PostAndCommentsWithAuthorsAndRecipient,
  PostWithAuthor,
  PostWithAuthorAndComments,
  PostWithAuthorCommentsRecipient,
  posts,
} from "db/schema";
import { desc } from "drizzle-orm";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

// NOTE: This page should be the similar to old school facebook, where each user has their own 'wall', where other people can post messages and images, etc.
// These posts should also appear in the main feed, as anyone can comment on them.

// Lets think about this..
// Some posts have a recipient, and some do not. We can check for this after we do a fetch, which is not a problem.
// The component itself should be as DRY as possible. How we render the text for example, the profile component, these are all reusable.
// The parent textpost component though should be unique, and feed with the correct data on this level.

// TODO: This, and other, loaders can be other functions and imported, and exported as loader from here.
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  const allPosts = (await db.query.posts.findMany({
    with: {
      comments: {
        with: {
          author: {
            with: {
              profile: true
            }
          }
        }
      },
      author: {
        with: {
          profile: true,
        },
      },
      wall: {
        with: {
          profile: true,
        },
      },
    },
    orderBy: [desc(posts.createdAt)],
  })) as PostAndCommentsWithAuthorsAndRecipient[];

  return typedjson({ session, allPosts });
};

export default function WallPage() {
  const { allPosts } = useTypedLoaderData<typeof loader>();
  return (
    <div className="mx-auto mt-10 w-1/2">
      <CreatePostForm date={new Date()} action="/posts" />
      <div className="flex flex-col gap-3">
        {allPosts.map((post) => (
          <TextPost
            key={post.id}
            post={post}
            author={post.author}
            comments={post.comments}
            recipient={post.wall}
          />
        ))}
      </div>
    </div>
  );
}
