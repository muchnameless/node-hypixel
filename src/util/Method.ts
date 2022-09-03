import { type BaseClient } from './BaseClient.js';

/**
 * @internal
 */
export abstract class Method {
	/**
	 * @internal
	 */
	protected client: BaseClient;

	/**
	 * @internal
	 */
	public constructor(client: BaseClient) {
		this.client = client;
	}
}
