import { auth } from "@/features/auth/helper";
import { getDayOfYear } from "@/features/posts/util";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { posts } from "db/schema";

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await auth(request);
	const formData = await request.formData();
	const body = formData.get("body")?.toString();
	const priv = formData.get("private")?.toString();
	const addDay = formData.get("addDay")?.toString();

	let isPrivate = false;
	if (priv) {
		isPrivate = true;
	}

	const createdAt = new Date();
	if (addDay) {
		createdAt.setDate(createdAt.getDate() + 1);
	}

	const dayOfYear = getDayOfYear(createdAt);

	console.log(createdAt.getFullYear());

	// Create an entry in the database, will need to be validated at some point
	// I should create somewhere to put common queries
	const newPost = await db.insert(posts).values({
		hasBody: true,
		body: body,
		hasImage: false,
		authorId: session.id,
		isPrivate: isPrivate,
		createdAt: createdAt,
		day: dayOfYear,
		month: createdAt.getMonth(),
		year: createdAt.getFullYear(),
	});

	console.log(JSON.stringify(newPost));

	return json(
		{ newPost },
		{ status: 200, statusText: "Successfully created a new post" },
	);
};
