export interface IUser {
    user_id: string,
    name: string,
    username: string,
    email: string,
    password: string,
    salt: string,
    role: string,
    phone_number: string,
    first_time_login: boolean,
    status: string,
    createdAt: Date,
    updatedAt: Date
}

export interface IUserInputDTO {
    name: string,
    username: string,
    email: string,
    password: string,
    role: string
}