export default class Responce {
    status: number;
    success: boolean;
    data: any;
    message: string;
    constructor(success: boolean, data: any, message: string, status: number) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.status = status;
    }
}