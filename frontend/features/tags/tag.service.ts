import api from "@/utils/api/api";
import { Tag, TagResponse } from "./tag.types";
import authApi from "@/utils/api/auth-api";

export async function getTags(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<TagResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search) {
    query.set("search", params.search);
  }
  const { data } = await api.get("/tags", { params });
  if (!data) {
    throw new Error("Failed to fetch tags");
  }

  return data;
}

export async function createTag(name: string): Promise<Tag> {
  const { data: tag } = await authApi.post("/tags", { name });
  if (!tag) throw new Error("Failed to create tag");
  return tag;
}
