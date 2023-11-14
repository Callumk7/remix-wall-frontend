import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/forms";
import { authenticator } from "@/features/auth/auth.server";
import { ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    throw new Error("Email or Password field is missing");
  }

  // create the new user entry, although we will also want to make
  // the profile stuff as well. I wonder if this has to happen at
  // the same time, or if we can prompt people later.

  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/sign-in",
  });
};

export default function SignUpPage() {
  return (
    <Container className="mt-10">
      <form className="mx-auto flex w-4/5 flex-col gap-y-2" method="POST">
        <h1 className="mb-4 text-5xl font-extrabold">
          Create a new account at{" "}
          <span className="underline decoration-ruby9 decoration-4">
            The Wall
          </span>
        </h1>
        <Input name="email" type="text" label="Email" />
        <Input name="password" type="password" label="Password" />
        <Button type="submit">Create Account</Button>
      </form>
    </Container>
  );
}
