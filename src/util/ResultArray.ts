import type { DefaultMeta } from '../types/DefaultMeta';
import type { Components } from '../types/api';

/**
 * Generic intersection type for result arrays to include metadata as a non-enumerable property.
 * @example
 * ```typescript
 * const result = await client.skyblock.news();
 * console.log(result);
 * // (7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]
 * console.log(result.meta)
 * // {success: true}
 * ```
 */
export type ResultArray<T extends Components.Schemas.ApiSuccess, K extends keyof T> = T[K] & {
	meta: Omit<T, K> & DefaultMeta;
};

/** @hidden */
export function getResultArray<T extends Components.Schemas.ApiSuccess, K extends keyof T>(
	response: T & DefaultMeta,
	key: K,
): ResultArray<T, K> {
	if (!(key in response)) {
		throw new TypeError(`Key "${key as string}" was not in the response.`);
	}
	const items = response[key] ?? [];
	const { ratelimit, cached, cloudflareCache } = response;
	if (!Array.isArray(items)) {
		throw new TypeError(`Key "${key as string}" is not an array.`);
	}
	delete response[key];
	const arr = [...items] as never as ResultArray<T, K>;
	const meta: Omit<T, K> & DefaultMeta = {
		...response,
	};
	if (cached) {
		meta.cached = true;
	}
	if (cloudflareCache) {
		meta.cloudflareCache = cloudflareCache;
	}
	if (ratelimit) {
		if (!cached && (!meta.cloudflareCache || meta.cloudflareCache.status !== 'HIT')) {
			meta.ratelimit = ratelimit;
		}
	}
	Object.defineProperty(arr, 'meta', {
		enumerable: false,
		value: meta,
	});
	return arr;
}
