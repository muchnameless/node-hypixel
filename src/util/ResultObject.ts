import type { DefaultMeta } from '../types/DefaultMeta';
import type { Components } from '../types/api';

/**
 * Generic intersection type for result objects to include metadata as a non-enumerable property.
 * @example
 * ```typescript
 * const result = await client.watchdogstats();
 * console.log(result);
 * // {watchdog_lastMinute: 1, staff_rollingDaily: 2609, watchdog_total: 5591714, watchdog_rollingDaily: 4213, …}
 * console.log(result.meta)
 * // {success: true}
 * ```
 */
export type ResultObject<T extends Components.Schemas.ApiSuccess, K extends keyof T> = (T[K] extends
	| string
	| number
	| boolean
	? Omit<T, K>
	: T[K]) & {
	meta: (T[K] extends string | number | boolean ? Pick<T, K> : Omit<T, K>) & DefaultMeta;
};

/** @hidden */
export function getResultObject<T extends Components.Schemas.ApiSuccess, K extends keyof T>(
	response: T & DefaultMeta,
	key: K,
): ResultObject<T, K> {
	if (!(key in response)) {
		throw new TypeError(`"${key as string}" was not in the response`);
	}

	const { [key]: obj = {}, ...meta } = response;

	Object.defineProperty(obj, 'meta', {
		enumerable: false,
		value: meta,
	});

	return obj as ResultObject<T, K>;
}
