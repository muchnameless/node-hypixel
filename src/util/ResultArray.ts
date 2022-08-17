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
		throw new TypeError(`"${key as string}" was not in the response`);
	}

	const { [key]: arr = [], ...meta } = response;

	if (!Array.isArray(arr)) {
		throw new TypeError(`"${key as string}" is not an array`);
	}

	Object.defineProperty(arr, 'meta', {
		enumerable: false,
		value: meta,
	});

	return arr as unknown as ResultArray<T, K>;
}
