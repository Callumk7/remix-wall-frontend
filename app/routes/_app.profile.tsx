import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input, TextArea } from "@/components/ui/forms";
import { auth } from "@/features/auth/helper";
import { getFormValues } from "@/util/forms";
import { ActionFunctionArgs, LoaderFunctionArgs, json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { db } from "db";
import { profiles, users } from "db/schema";
import { eq } from "drizzle-orm";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await auth(request);

  // We need to retrieve all the data for this user.
  const userData = await db.query.profiles.findFirst({
    where: eq(profiles.userId, session.id),
    with: {
      user: true,
    },
  });

  return json({ session, userData });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await auth(request);

  const keys = [
    "userName",
    "password",
    "imageUrl",
    "email",
    "firstName",
    "lastName",
    "bio",
  ];
  const formValues = await getFormValues(keys, request);

  const updatedUser = await db
    .update(users)
    .set({
      email: formValues.email,
      password: formValues.password,
    })
    .where(eq(users.id, session.id))
    .returning({ userId: users.id });

  const updatedProfile = await db
    .update(profiles)
    .set({
      userName: formValues.userName,
      profilePictureUrl: formValues.imageUrl,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      bio: formValues.bio,
    })
    .where(eq(profiles.userId, session.id))
    .returning({ profileUrl: profiles.profilePictureUrl });

  console.log(updatedUser);
  console.log(updatedProfile);

  return json({ updatedUser, updatedProfile });
};

export default function ProfilePage() {
  const { userData } = useLoaderData<typeof loader>();
  return (
    <Container className="mt-10">
      <h1 className="mb-8 text-4xl font-extrabold">Profile.</h1>
      <Form method="PATCH" className="flex flex-col gap-y-4">
        <Input
          type="text"
          defaultValue={userData!.userName}
          label="Username"
          name="userName"
        />
        <Input
          type="password"
          defaultValue={userData!.user!.password}
          label="Password"
          name="password"
        />
        <Input
          type="text"
          defaultValue={userData!.profilePictureUrl!}
          label="Image URL"
          name="imageUrl"
        />
        <Input
          type="text"
          defaultValue={userData!.user!.email}
          label="Email"
          name="email"
        />
        <div className="flex w-full justify-stretch gap-x-2">
          <Input
            className="w-full"
            type="text"
            defaultValue={userData!.firstName}
            label="First Name"
            name="firstName"
          />
          <Input
            className="w-full"
            type="text"
            defaultValue={userData!.lastName}
            label="Last Name"
            name="lastName"
          />
        </div>
        <TextArea label="Bio" defaultValue={userData!.bio!} name="bio" />
        <Button type="submit">Update</Button>
      </Form>
    </Container>
  );
}
