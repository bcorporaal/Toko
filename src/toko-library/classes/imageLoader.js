import { ContextManager } from '../core/context.js';

/**
 * ImageLoader class for preloading images and SVG files with automatic type detection
 * Integrates with p5.js preload system to ensure assets are loaded before setup() runs.
 * Supports both SVG and raster image formats (PNG, JPG, JPEG).
 *
 * @example
 * // Create loader with items array
 * const loader = new toko.ImageLoader([
 *   { id: 1, url: 'image.png' },
 *   { id: 2, url: 'graphic.svg' },
 *   { id: 3, url: 'photo.jpg', type: toko.ImageLoader.IMAGE }
 * ]);
 *
 * // Preload all assets in preload() function
 * function preload() {
 *   loader.preloadAll(() => {
 *     console.log('All images loaded');
 *   });
 * }
 *
 * // Access loaded images in setup() or draw()
 * function setup() {
 *   const img = loader.get(1);
 *   image(img, 0, 0);
 * }
 */
export class ImageLoader {
  // Static type constants
  static SVG = 'svg';
  static IMAGE = 'image';

  /**
   * Create a new ImageLoader instance
   * @param {Array<Object>} items - Array of items to load, each with id, url, and optional type
   * @param {string|number} items[].id - Unique identifier for the asset
   * @param {string} items[].url - URL or path to the image file
   * @param {string} [items[].type] - Optional type override ('svg' or 'image'), defaults to auto-detection from file extension
   * @example
   * // Basic usage with auto-detection
   * const loader = new toko.ImageLoader([
   *   { id: 1, url: 'assets/image.png' },
   *   { id: 2, url: 'assets/logo.svg' }
   * ]);
   *
   * // With explicit type override
   * const loader = new toko.ImageLoader([
   *   { id: 1, url: 'image.png', type: toko.ImageLoader.IMAGE },
   *   { id: 2, url: 'graphic.svg', type: toko.ImageLoader.SVG }
   * ]);
   */
  constructor (items) {
    if (!Array.isArray(items)) {
      console.warn('Toko: ImageLoader expects an array of items. Defaulting to empty array.');
      items = [];
    }
    this.items = items;
    this.images = new Map();
    this.loadedCount = 0;
    this.totalCount = items.length;
    this.isDone = false;

    // Expose type constants as instance properties for convenience
    this.SVG = ImageLoader.SVG;
    this.IMAGE = ImageLoader.IMAGE;
  }

  /**
   * Preload all images and SVGs in the items array
   * Integrates with p5.js preload system when called from preload() function.
   * Works correctly whether called from preload() or setup().
   * Returns a Promise that resolves when all assets are loaded, allowing async/await usage.
   * @param {Function} [onComplete] - Optional callback function called when all assets are loaded
   * @returns {Promise} Promise that resolves when all assets are loaded
   * @example
   * // In preload() function
   * function preload() {
   *   loader.preloadAll(() => {
   *     console.log('All assets loaded');
   *   });
   * }
   *
   * // In setup() function with async/await (p5 v2)
   * async function setup() {
   *   await loader.preloadAll();
   *   // Assets are now loaded
   * }
   *
   * // In setup() function with callback
   * function setup() {
   *   loader.preloadAll(() => {
   *     console.log('All assets loaded');
   *   });
   * }
   */
  preloadAll (onComplete) {
    // Return a Promise that resolves when all assets are loaded
    return new Promise(resolve => {
      const completionHandler = () => {
        if (onComplete) onComplete();
        resolve();
      };

      if (this.totalCount === 0) {
        this.isDone = true;
        completionHandler();
        return;
      }

      this.items.forEach(item => {
        this._loadItem(item, completionHandler);
      });
    });
  }

  _determineLoadType (item) {
    // Check for explicit type override
    if (item.type === ImageLoader.SVG) {
      return ImageLoader.SVG;
    }
    if (item.type === ImageLoader.IMAGE) {
      return ImageLoader.IMAGE;
    }

    // Determine type from file extension
    // Remove query parameters and hash fragments before extracting extension
    const url = item.url || '';
    const urlWithoutParams = url.split('?')[0].split('#')[0];
    const extension = urlWithoutParams.split('.').pop()?.toLowerCase() || '';

    if (extension === 'svg') {
      return ImageLoader.SVG;
    }
    if (['png', 'jpg', 'jpeg'].includes(extension)) {
      return ImageLoader.IMAGE;
    }

    // Default to image for unknown extensions
    return ImageLoader.IMAGE;
  }

  _loadItem (item, onComplete) {
    // Create a closure to capture the correct item
    const currentItem = item;
    const loadType = this._determineLoadType(currentItem);
    const p5Context = ContextManager.getCurrentContext();

    // Increment preload counter if available (manual tracking - Option 2)
    // This works regardless of where preloadAll() is called
    // When called from preload(), automatic tracking (Option 1) also occurs
    if (p5Context && typeof p5Context._incrementPreload === 'function') {
      p5Context._incrementPreload();
    }

    if (loadType === ImageLoader.SVG) {
      loadSVG(
        currentItem.url,
        svg => {
          this.images.set(String(currentItem.id), svg);
          // Decrement preload counter on success
          if (p5Context && typeof p5Context._decrementPreload === 'function') {
            p5Context._decrementPreload();
          }
          this.loadedCount++;
          if (this.loadedCount === this.totalCount) {
            this.isDone = true;
            if (onComplete) onComplete();
          }
        },
        event => {
          // Decrement preload counter on error (critical - must always be called)
          if (p5Context && typeof p5Context._decrementPreload === 'function') {
            p5Context._decrementPreload();
          }
          console.log('SVG load failure', event);
        },
      );
    } else {
      loadImage(
        currentItem.url,
        img => {
          this.images.set(String(currentItem.id), img);
          // Decrement preload counter on success
          if (p5Context && typeof p5Context._decrementPreload === 'function') {
            p5Context._decrementPreload();
          }
          this.loadedCount++;
          if (this.loadedCount === this.totalCount) {
            this.isDone = true;
            if (onComplete) onComplete();
          }
        },
        event => {
          // Decrement preload counter on error (critical - must always be called)
          if (p5Context && typeof p5Context._decrementPreload === 'function') {
            p5Context._decrementPreload();
          }
          console.log('Image load failure', event);
        },
      );
    }
  }

  /**
   * Get a loaded image or SVG by its id
   * @param {string|number} id - The id of the asset to retrieve
   * @returns {p5.Image|p5.SVGElement|null} The loaded image or SVG element, or null if not found or not yet loaded
   * @example
   * // Get a loaded image
   * const img = loader.get(1);
   * if (img) {
   *   image(img, 0, 0);
   * }
   *
   * // Check if asset is loaded
   * const svg = loader.get(2);
   * if (svg) {
   *   // Use the SVG element
   * }
   */
  get (id) {
    return this.images.get(String(id)) || null;
  }
}
