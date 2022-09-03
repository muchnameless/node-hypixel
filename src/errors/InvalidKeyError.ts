export class InvalidKeyError extends Error {
	public constructor(message: string) {
		super(message);
		Object.setPrototypeOf(this, InvalidKeyError.prototype);
	}
}
