export interface Tag {
  id: string;
  name: string;
  createdAt?: string;
}

export interface TagResponse {
  data: Tag[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
