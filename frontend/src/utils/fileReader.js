export const readImageFile = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error("No file provided"));
   
      if (!file.type.startsWith("image/")) {
        return reject(new Error("Avatar must be an image file"));
      }
   
      if (file.size > 2 * 1024 * 1024) {
        return reject(new Error("Avatar size must be smaller than 2MB"));
      }
   
      const reader = new FileReader();
   
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = () => reject(new Error("Failed to read the file. Please try again."));
   
      reader.readAsDataURL(file);
    });
};
