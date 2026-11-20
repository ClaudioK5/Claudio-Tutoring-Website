import "server-only";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let client: S3Client | null = null;

export function isR2Configured() {
  return Boolean(
    process.env.R2_ACCESS_KEY_ID?.trim() &&
      process.env.R2_SECRET_ACCESS_KEY?.trim() &&
      process.env.R2_BUCKET?.trim() &&
      process.env.R2_ENDPOINT?.trim(),
  );
}

function getR2Client() {
  if (!isR2Configured()) {
    throw new Error("R2 non configurato.");
  }
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: process.env.R2_ENDPOINT!.trim(),
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!.trim(),
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!.trim(),
      },
    });
  }
  return client;
}

/** URL firmato a tempo per scaricare un oggetto privato dal bucket eserciziari. */
export async function createR2DownloadUrl(objectKey: string, fileName?: string) {
  const bucket = process.env.R2_BUCKET!.trim();
  const ttl = Number(process.env.R2_DOWNLOAD_TTL_SECONDS ?? "3600");
  const expiresIn = Number.isFinite(ttl) && ttl > 60 ? Math.min(ttl, 86_400) : 3600;

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ResponseContentDisposition: `attachment; filename="${(fileName ?? objectKey).replace(/"/g, "")}"`,
    ResponseContentType: "application/pdf",
  });

  return getSignedUrl(getR2Client(), command, { expiresIn });
}
