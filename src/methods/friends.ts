import { type RequestOptions } from '../Client.js';
import { type Components, type Paths } from '../types/api.js';
import { Method } from '../util/Method.js';

export class Friends extends Method {
	/**
	 * Returns friendships for given player.
	 *
	 * @example
	 * ```typescript
	 * const friends = await client.friends.uuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(friends);
	 * ```
	 * @category API
	 */
	public async uuid(
		uuid: Components.Parameters.PlayerUuid.Uuid,
		options?: RequestOptions,
	): Promise<Paths.Friends.Get.Responses.$200> {
		return this.client.call<Paths.Friends.Get.Responses.$200>('friends', options, {
			uuid,
		}) as never;
	}
}
