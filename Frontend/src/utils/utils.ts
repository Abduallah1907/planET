export class Utils {
    // Function to check if a value is null or undefined
    static isNullOrUndefined(value: any): boolean {
        return value === null || value === undefined;
    }

    // Function to capitalize the first letter of a string
    static capitalizeFirstLetter(str: string): string {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Function to generate a random integer between min and max (inclusive)
    static getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to format a date to 'YYYY-MM-DD' format
    static formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    // Function to deep clone an object
    static deepClone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj));
    }
}