export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
