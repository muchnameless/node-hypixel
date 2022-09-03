import { type RequestOptions } from '../Client.js';
import { type Components, type Paths } from '../types/api.js';
import { Method } from '../util/Method.js';

export class Status extends Method {
	/**
	 * Returns online status information for given player, including game, mode and map when available.
	 *
	 * @example
	 * ```typescript
	 * const response = await client.status.uuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(response);
	 * ```
	 * @category API
	 */
	public async uuid(
		uuid: Components.Parameters.PlayerUuid.Uuid,
		options?: RequestOptions,
	): Promise<Paths.Status.Get.Responses.$200> {
		return this.client.call<Paths.Status.Get.Responses.$200>('status', options, {
			uuid,
		}) as never;
	}
}
