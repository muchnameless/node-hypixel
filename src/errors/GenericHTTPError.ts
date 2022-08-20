import type { URL } from 'node:url';

export class GenericHTTPError extends Error {
	public url: URL;
	/** The status code of the response */
	public code: number;

	constructor(url: URL, code: number, message: string) {
		super(message);

		this.url = url;
		this.code = code;

		Object.setPrototypeOf(this, GenericHTTPError.prototype);
	}

	override toString() {
		return `${this.name} ${this.code}: ${this.message}`;
	}
}
