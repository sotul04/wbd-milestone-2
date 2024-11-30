export function isNotEmail(value: string): boolean {
    const nonEmailRegex = /^[^\s@]+$/;
    return nonEmailRegex.test(value);
}