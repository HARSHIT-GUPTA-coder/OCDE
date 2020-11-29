export interface User {
    success? : string;
    message? : string;
    errors? : any;
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    token?: string;
}
export interface SignUpForm {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password1: string;
    password2: string;
}
export interface LoginForm {
    username: string;
    password: string;
}