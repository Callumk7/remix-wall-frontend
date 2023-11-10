import { auth } from "@/features/auth/helper";
import { uuidv4 } from "@/features/auth/uuidGenerator";
import { getDayOfYear } from "@/features/posts/util";
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

	const entryDateISOString = formData.get("entryDate")?.toString();
	const entryDate = new Date(entryDateISOString!);

	let isPrivate = false;
	if (priv) {
		isPrivate = true;
	}

	const createdAt = new Date();
	if (addDay) {
		createdAt.setDate(createdAt.getDate() + 1);
		entryDate.setDate(entryDate.getDate() + 1);
	}

	console.log(createdAt.getFullYear());

	// Create an entry in the database, will need to be validated at some point
	// I should create somewhere to put common queries
	const newPost = await db.insert(posts).values({
		id: `post_${uuidv4()}`,
		body: body!,
		authorId: userId,
		isPrivate: isPrivate,
		createdAt: createdAt,
		entryDate: entryDate,
		day: getDayOfYear(entryDate),
		month: entryDate.getMonth(),
		year: entryDate.getFullYear(),
	});

	console.log(JSON.stringify(newPost));

	return newPost;
};
