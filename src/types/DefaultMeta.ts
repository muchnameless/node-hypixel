import { type RateLimitData } from './RateLimitData.js';

/**
 * Possible meta options returned on the meta variable.
 */
export interface DefaultMeta {
	/**
	 * If you included a cache get/set method in the options, this value will be set to true if that cache was hit.
	 */
	cached?: boolean;
	/**
	 * Data from CloudFlare's headers in regards to caching - particularly relevant for resources endpoints.
	 */
	cloudflareCache?: {
		/**
		 * Cloudflare cache age.
		 */
		age?: number;
		/**
		 * Cloudflare max cache age.
		 */
		maxAge?: number;
		/**
		 * Cloudflare cache status.
		 */
		status: 'BYPASS' | 'DYNAMIC' | 'EXPIRED' | 'HIT' | 'MISS';
	};
	/**
	 * If this request required an API key it returned rate limit information in the headers, which is included here.
	 */
	ratelimit?: RateLimitData;
}
