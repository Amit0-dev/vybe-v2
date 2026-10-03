import { apiClient } from "@/lib/api-client";
import type { LibraryTrack } from "@/features/queue/types/queue.types";

export interface CreateCustomTrackUploadUrlInput {
  title: string;
  artist: string;
}

export interface CreateCustomTrackUploadUrlResponse {
  uploadId: string;
  uploadUrl: string;
  storageKey: string;
}

export function createCustomTrackUploadUrl(input: CreateCustomTrackUploadUrlInput) {
  return apiClient<CreateCustomTrackUploadUrlResponse>("/api/tracks/custom/upload-url", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function uploadCustomTrackFile(uploadUrl: string, file: File) {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "audio/mpeg",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("The audio file could not be uploaded.");
  }
}

export function getAdminCustomTracks(search?: string, page = 1, limit = 20) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  return apiClient<LibraryTrack>(`/api/tracks/custom?${params.toString()}`);
}