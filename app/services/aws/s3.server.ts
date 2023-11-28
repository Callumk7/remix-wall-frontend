import { S3Client } from "@aws-sdk/client-s3";
import type { UploadHandler } from "@remix-run/node";
import type { PutObjectCommandInput } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { uuidv4 } from "@/features/auth/uuidGenerator";

export const s3 = new S3Client({
	credentials: {
		accessKeyId: process.env.ACCESS_KEY!,
		secretAccessKey: process.env.SECRET_ACCESS_KEY!,
	},
	region: process.env.BUCKET_REGION!,
});

const uploadStreamToS3 = async (
	data: AsyncIterable<Uint8Array>,
	key: string,
	contentType: string,
) => {
	const params: PutObjectCommandInput = {
		Bucket: process.env.BUCKET_NAME,
		Key: key,
		Body: await convertToBuffer(data),
		ContentType: contentType,
	};

	await s3.send(new PutObjectCommand(params));
	return key;
};

// The UploadHandler gives us an AsyncIterable<Uint8Array>,
// so we need to convert that to something the aws-sdk can use.
// Here, we are going to convert that to a buffer to be
// consumed by the aws-sdk.
async function convertToBuffer(a: AsyncIterable<Uint8Array>) {
	const result = [];
	for await (const chunk of a) {
		result.push(chunk);
	}
	return Buffer.concat(result);
}

export const s3UploaderHandler: UploadHandler = async ({
	data,
	contentType,
}) => {
	// instead of using the filename, we are going to use a 
	// random uuid for image names, so that we can use the image 
	// in the app
	// TODO: these urls currently have an expiry time, need to understand that
	const randomImageName = `img_${uuidv4()}`
	return await uploadStreamToS3(data, randomImageName, contentType);
};
