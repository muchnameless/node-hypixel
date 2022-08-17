import { Method } from '../util/Method';
import type { RequestOptions } from '../Client';
import type { Components, Paths } from '../types/api';

export class Friends extends Method {
	/**
	 * Returns friendships for given player.
	 * @example
	 * ```typescript
	 * const friends = await client.friends.uuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(friends);
	 * ```
	 * @category API
	 */
	public uuid(
		uuid: Components.Parameters.PlayerUuid.Uuid,
		options?: RequestOptions,
	): Promise<Paths.Friends.Get.Responses.$200> {
		return this.client.call<Paths.Friends.Get.Responses.$200>('friends', options, {
			uuid,
		}) as never;
	}
}
