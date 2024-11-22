export function response(success: boolean, message: string, data: any = null) {
    if (success) {
        return {
            success: success,
            message: message,
            body: data
        }
    }
    return {
        success: success,
        message: message,
        error: data
    }
}