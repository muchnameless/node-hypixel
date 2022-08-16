import { clearTimeout, setTimeout } from 'node:timers';
import { request as undiciRequest } from 'undici';
import { GenericHTTPError } from '../errors/GenericHTTPError';
import { InvalidKeyError } from '../errors/InvalidKeyError';
import { RateLimitError } from '../errors/RateLimitError';
import type { Components } from '../types/api';
import type { Client, DefaultMeta } from '../Client';

/** @hidden */
interface InternalRequestOptions {
	url: string;
	timeout: number;
	signal?: AbortSignal;
	userAgent: string;
	auth: boolean;
	getRateLimitHeaders: Client['getRateLimitHeaders'];
}

/** @internal */
const CACHE_CONTROL_REGEX = /(?<=s-maxage=)\d+/;

/** @internal */
export async function request<
	T extends Components.Schemas.ApiSuccess & {
		cause?: string;
	} & { cloudflareCache?: DefaultMeta['cloudflareCache'] },
>(options: InternalRequestOptions): Promise<T> {
	// @ts-expect-error AbortSignal
	options.signal?.throwIfAborted();

	// internal AbortSignal (to have a timeout without having to abort the external signal)
	const controller = new AbortController();
	const listener = () => controller.abort();
	const timeout = setTimeout(listener, options.timeout);

	// external AbortSignal
	// @ts-expect-error AbortSignal
	options.signal?.addEventListener('abort', listener);

	try {
		const res = await undiciRequest(options.url, {
			method: 'GET',
			headers: {
				'User-Agent': options.userAgent,
				Accept: 'application/json',
			},
		});

		if (options.auth) options.getRateLimitHeaders(res.headers);

		if (res.statusCode !== 200) {
			res.body.dump();

			if (res.statusCode === 429) {
				throw new RateLimitError(`Hit key throttle.`);
			}

			if (res.statusCode === 403) {
				throw new InvalidKeyError('Invalid API Key');
			}

			throw new GenericHTTPError(
				res.statusCode,
				// @ts-expect-error undici
				res.statusMessage,
			);
		}

		const parsed = await res.body.json();

		if (res.headers['cf-cache-status']) {
			const age = parseInt(res.headers.age as string, 10);
			const maxAge = CACHE_CONTROL_REGEX.exec(res.headers['cache-control'] as string);
			parsed.cloudflareCache = {
				status: res.headers['cf-cache-status'] as never,
				...(typeof age === 'number' && !Number.isNaN(age) && { age }),
				...(res.headers['cf-cache-status'] === 'HIT' && (typeof age !== 'number' || Number.isNaN(age)) && { age: 0 }),
				...(maxAge?.length &&
					parseInt(maxAge[0], 10) > 0 && {
						maxAge: parseInt(maxAge[0], 10),
					}),
			};
		}

		return parsed;
	} finally {
		clearTimeout(timeout);
		// @ts-expect-error AbortSignal
		options.signal?.removeEventListener('abort', listener);
	}
}
