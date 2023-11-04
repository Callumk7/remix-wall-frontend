import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "./session.server";
import invariant from "tiny-invariant";
import { db } from "db";
import { and, eq } from "drizzle-orm";
import { users } from "db/schema";
import { UserData } from "./types";

export const authenticator = new Authenticator<UserData>(sessionStorage);

authenticator.use(
	new FormStrategy(async ({ form }) => {
		const email = form.get("email");
		const password = form.get("password");
		console.log(`we got here with username: ${email}`);

		// WARN: these invariants didn't throw, for some reason, I should probably test these out to make sure that I
		// full understand how they are supposed to work...

		invariant(typeof email === "string", "email must be a string");
		invariant(email.length > 0, "email must not be empty");

		invariant(typeof password === "string", "password must be a string");
		invariant(password.length > 0, "password must not be empty");

		const user = await login(email, password);
		return user;
	}),
	"user-pass",
);

// WARN: This function currently has nothing to do with any actual password.. so its just for testing
const login = async (email: string, password: string) => {
	console.log(`${email} and ${password}`);
	const foundUser = await db.query.users.findFirst({
		where: eq(users.email, email),
	});

	console.log("no we are here");
	console.log(`found user ${foundUser?.email}`);

	invariant(foundUser, "No user found");
	console.log(foundUser.email);
	return foundUser;
};
