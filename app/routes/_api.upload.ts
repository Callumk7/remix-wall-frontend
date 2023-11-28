import { auth } from "@/features/auth/helper";
import { s3, s3UploaderHandler } from "@/services/aws/s3.server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { ActionFunction } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { db } from "db";
import { profiles } from "db/schema";
import { eq } from "drizzle-orm";

export const action: ActionFunction = async ({ request }) => {
	const session = await auth(request);

	const formData = await unstable_parseMultipartFormData(
		request,
		s3UploaderHandler,
	);

	const fileName = formData.get("upload");
	const url = await getSignedUrl(
		s3,
		new GetObjectCommand({
			Bucket: process.env.BUCKET_NAME,
			Key: fileName?.toString(),
		}),
		{ expiresIn: 15 * 60 },
	);

	const updatedProfileUrl = await db.update(profiles).set({
		profilePictureUrl: url
	}).where(eq(profiles.userId, session.id))

	return {
		url: url,
		updatedProfileUrl: updatedProfileUrl
	};
};
