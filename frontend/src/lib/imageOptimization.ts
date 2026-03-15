export class ImageOptimizer {
  /**
   * Optimizes an image file by resizing it and converting to WebP.
   * @param file The original image file
   * @param maxWidth The maximum width of the optimized image
   * @param quality The quality of the WebP image (0 to 1)
   * @returns A Promise resolving to the optimized File object
   */
  static async optimizeImage(
    file: File,
    maxWidth: number = 1920,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve) => {
      // Return original if it's not an image
      if (!file.type.startsWith("image/")) {
        resolve(file);
        return;
      }

      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file); // Fallback to original if canvas context fails
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              const optimizedFile = new File([blob], fileName, {
                type: "image/webp",
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              resolve(file); // Fallback
            }
          },
          "image/webp",
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(file); // Fallback to original if loading fails
      };

      img.src = url;
    });
  }
}
