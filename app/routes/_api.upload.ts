import { auth } from "@/features/auth/helper";
import { s3UploaderHandler } from "@/services/aws/s3.server";
import type { ActionFunction } from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
	await auth(request);

	const formData = await unstable_parseMultipartFormData(
		request,
		s3UploaderHandler,
	);

	const fileName = formData.get("upload");

	return {
		filename: fileName,
	};
};
