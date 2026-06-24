export const getFullImageUrl = (path: string) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    if (path.startsWith("/")) return `https://savannahdrinks.co.uk${path}`;
    return `https://savannahdrinks.co.uk/${path}`;
};
