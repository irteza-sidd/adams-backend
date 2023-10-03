function generateUniqueFilename(originalFilename) {
    const fileExtension = originalFilename.split('.').pop();
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 10);
    const uniqueFilename = `${timestamp}-${randomString}.${fileExtension}`;
    return uniqueFilename;
}
export default generateUniqueFilename