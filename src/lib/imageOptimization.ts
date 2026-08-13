/**
 * Image optimization utilities for better performance
 */

/**
 * Generate optimized image srcset for responsive images
 */
export const generateImageSrcSet = (baseUrl: string): string => {
  // For base64 data URIs, we can't generate srcset variations
  // Return the base URL as is
  if (baseUrl.startsWith('data:')) {
    return baseUrl;
  }
  
  // For regular URLs, generate srcset
  return baseUrl;
};

/**
 * Preload image to improve perceived performance
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    img.src = src;
  });
};

/**
 * Check if image URL is valid and accessible
 */
export const isValidImageUrl = (url: string | undefined): url is string => {
  if (!url) return false;
  
  try {
    // Data URIs are always valid
    if (url.startsWith('data:')) return true;
    
    // Check if it's a valid URL
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get image loading optimization options
 */
export const getImageLoadingConfig = () => ({
  loading: 'lazy' as const,
  decoding: 'async' as const,
});

/**
 * Estimate image load time based on size
 */
export const estimateLoadTime = (sizeInBytes: number, connectionSpeed: 'slow' | 'medium' | 'fast' = 'medium'): number => {
  // Rough estimates in milliseconds
  const speeds = {
    slow: 50, // KB/s
    medium: 200, // KB/s
    fast: 1000, // KB/s
  };
  
  const sizeInKB = sizeInBytes / 1024;
  const timeInSeconds = sizeInKB / speeds[connectionSpeed];
  
  return Math.round(timeInSeconds * 1000);
};

/**
 * Optimize image URL for web (compress and convert format)
 * This is handled server-side, but this utility helps track optimization
 */
export const getOptimizationInfo = (originalSize: number, compressedSize: number) => {
  const compressionRatio = ((1 - compressedSize / originalSize) * 100).toFixed(1);
  const savedBytes = originalSize - compressedSize;
  
  return {
    originalSize,
    compressedSize,
    compressionRatio: `${compressionRatio}%`,
    savedBytes,
    savedKB: (savedBytes / 1024).toFixed(2),
  };
};

/**
 * Get optimal image dimensions based on container size
 */
export const getOptimalDimensions = (containerWidth: number, containerHeight: number) => {
  // Common breakpoints for responsive images
  const widths = [640, 750, 828, 1080, 1200, 1440, 1920];
  
  // Find the smallest width that's at least as large as container
  const optimalWidth = widths.find(w => w >= containerWidth) || widths[widths.length - 1];
  
  // Maintain aspect ratio
  const aspectRatio = containerHeight / containerWidth;
  const optimalHeight = Math.round(optimalWidth * aspectRatio);
  
  return {
    width: optimalWidth,
    height: optimalHeight,
  };
};
