export interface LoginForm {
    username: string
    password: string
}

export interface User {
    username: string
    email?: string
}

export interface AuthResponse {
    token: string
    user: User
}

