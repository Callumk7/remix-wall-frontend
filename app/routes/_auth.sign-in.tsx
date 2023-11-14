import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/forms";
import { authenticator } from "@/features/auth/auth.server";
import { ActionFunctionArgs } from "@remix-run/node";

export const action = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/",
    failureRedirect: "/sign-in",
  });
};

export default function SignInPage() {
  return (
    <Container className="mt-10">
      <form className="w-4/5 mx-auto flex flex-col gap-y-2" method="POST">
        <Input name="email" type="text" label="Email" />
        <Input name="password" type="password" label="Password"/>
        <Button type="submit">Sign In</Button>
      </form>
    </Container>
  );
}
