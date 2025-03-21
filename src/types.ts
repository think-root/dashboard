export interface Repository {
  id: string;
  posted: boolean;
  url: string;
  text: string;
}

export interface RepositoriesResponse {
  status: string;
  message: string;
  data: {
    all: number;
    posted: number;
    unposted: number;
    items: Repository[];
  };
}

export interface GenerateResponse {
  status: string;
  added: string[];
  dont_added: string[];
}

export interface UpdatePostedResponse {
  status: string;
  message: string;
}