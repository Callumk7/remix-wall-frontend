import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { getDayOfYear } from "@/features/posts/util";
import { CalendarDate } from "@internationalized/date";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "db";
import { posts } from "db/schema";

export const action = async ({ request }: ActionFunctionArgs) => {
	const session = await auth(request);

	switch (request.method) {
		case "POST": {
			const newPost = handlePOST(request, session.id);

			return json(
				{ newPost },
				{ status: 200, statusText: "Successfully created a new post" },
			);
		}

		default: {
			return json("Bad Request", {
				status: 401,
				statusText: `Bad Request, ${request.method} is not supported`,
			});
		}
	}
};

const handlePOST = async (request: Request, userId: string) => {
	const formData = await request.formData();
	const body = formData.get("body")?.toString();
	const priv = formData.get("private")?.toString();
	const addDay = formData.get("addDay")?.toString();

	// WARN: Currently hard-coding the date stuff to be the date the post was posted. This will be changed

	const currentTimestamp = new Date();
	const currentDate = new CalendarDate(
		currentTimestamp.getFullYear(),
		currentTimestamp.getMonth(),
		currentTimestamp.getDate(),
	);

	if (addDay) {
		currentTimestamp.setDate(currentTimestamp.getDate() + 1);
		currentDate.add({ days: 1 });
	}

	let isPrivate = false;
	if (priv) {
		isPrivate = true;
	}


	// Now we need to create the post and reference the journal page.
	const newPost = await db.insert(posts).values({
		id: `post_${uuidv4()}`,
		createdAt: currentTimestamp,
		updatedAt: currentTimestamp,
		body: body!,
		authorId: userId,
		day: currentDate.day,
		month: currentDate.month,
		year: currentDate.year,
		entryDate: currentDate.toDate("gmt"),
		isPrivate: isPrivate
	}).returning();

	console.log(newPost)

	return newPost;
};
