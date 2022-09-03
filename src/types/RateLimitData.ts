/**
 * @hidden
 */
export interface RateLimitData {
	/**
	 * How many requests per minute your API key can make.
	 */
	limit: number;
	/**
	 * Remaining API calls until the limit resets.
	 */
	remaining: number;
	/**
	 * Time, in seconds, until remaining resets to limit.
	 */
	reset: number;
}
