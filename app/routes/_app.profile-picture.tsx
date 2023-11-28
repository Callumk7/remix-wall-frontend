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
import { useState } from "react";
import { FileTrigger } from "react-aria-components";

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
      <h1 className="mb-8 text-4xl font-extrabold">
        Upload a Profile Picture.
      </h1>
      <Form method="PATCH" className="flex flex-col gap-y-4">
        <Input
          type="text"
          defaultValue={userData!.userName}
          label="Username"
          name="userName"
        />
        <Input
          type="text"
          defaultValue={userData!.profilePictureUrl!}
          label="Image URL"
          name="imageUrl"
        />
        <Button type="submit">Update</Button>
      </Form>
      <Form action="/upload" method="POST" encType="multipart/form-data">
        <input type="file" name="upload" />
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
}

function FilePicker() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageUpload = (e: FileList | null) => {
    if (e) {
      const files = Array.from(e);
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target) {
          setSelectedImage(e.target.result as string);
        }
      };

      reader.readAsDataURL(files[0]);
    }
  };
  return (
    <>
      <div>{selectedImage && <img src={selectedImage} alt="Selected" />}</div>
      <div>
        <FileTrigger onSelect={handleImageUpload}>
          <Button>Select File</Button>
        </FileTrigger>
      </div>
    </>
  );
}
