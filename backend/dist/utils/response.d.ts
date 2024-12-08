export declare function response(success: boolean, message: string, data?: any): {
    success: true;
    message: string;
    body: any;
    error?: undefined;
} | {
    success: false;
    message: string;
    error: any;
    body?: undefined;
};
