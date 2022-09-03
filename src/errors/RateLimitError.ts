export class RateLimitError extends Error {
	/**
	 * Ignore this for code coverage as reproducing a real rate limit error is difficult.
	 */
	public constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, RateLimitError.prototype);
	}
}
