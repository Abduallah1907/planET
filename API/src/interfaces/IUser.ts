export interface IUser {

    username: string,
    email: string,
    password: string,
    salt: string,
    role: string,
    phone_number: string,
    name: string,
    createdAt: Date,
    updatedAt: Date
    
}

export interface IUserInputDTO {
    username: string,
    email: string,
    password: string
}