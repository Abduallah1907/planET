export interface IUser {
    _id: string,
    username: string,
    email: string,
    password: string,
    salt: string
}

export interface IUserInputDTO {
    username: string,
    email: string,
    password: string
}