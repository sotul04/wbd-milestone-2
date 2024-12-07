export function textCropper(text?: string, length: number = 50) {
    return text && (text.length < length ? text : text.substring(0, length-3) + '...');
}