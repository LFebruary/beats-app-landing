"use server";

import { NextResponse } from "next/server";
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filePath = url.searchParams.get("file");

  if (filePath) {
    // Proxy the audio file
    try {
      const getCommand = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: filePath,
      });
      const { Body, ContentType } = await new S3Client({
        region: "auto",
        endpoint: `https://${process.env
          .R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
      }).send(getCommand);

      if (!Body) {
        throw new Error("No body returned from S3");
      }

      const arrayBuffer = await Body.transformToByteArray();

      return new NextResponse(arrayBuffer, {
        headers: {
          "Content-Type": ContentType || "audio/mpeg",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch (error) {
      const { requestId, cfId, extendedRequestId } = error.$metadata;
      console.log({ requestId, cfId, extendedRequestId });
      console.error("Error fetching audio file:", error);
      return NextResponse.json(
        { error: "Failed to fetch audio file" },
        { status: 500 }
      );
    }
  } else {
    // List tracks
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
      });
      const listResponse = await new S3Client({
        region: "auto",
        endpoint: `https://${process.env
          .R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID!,
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
        },
      }).send(listCommand);

      if (!listResponse.Contents) {
        throw new Error("No objects found in bucket");
      }

      const tracks = listResponse.Contents.map((obj) => {
        if (!obj.Key) return null;

        return {
          name: obj,
          url: `/api/tracks?file=${encodeURIComponent(obj.Key)}`,
          hash: crypto.createHash("md5").update(obj.Key).digest("hex"),
        };
      });

      return NextResponse.json(tracks.filter(Boolean));
    } catch (error) {
      console.error("Error fetching tracks:", error);
      return NextResponse.json(
        { error: "Failed to fetch tracks" },
        { status: 500 }
      );
    }
  }
}
