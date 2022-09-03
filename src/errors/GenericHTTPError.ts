import { type URL } from 'node:url';

export class GenericHTTPError extends Error {
	public readonly url: URL;

	/**
	 * The status code of the response
	 */
	public readonly code: number;

	public constructor(url: URL, code: number, message: string) {
		super(message);

		this.url = url;
		this.code = code;

		Object.setPrototypeOf(this, GenericHTTPError.prototype);
	}

	public override toString() {
		return `${this.name} ${this.code}: ${this.message}`;
	}
}
