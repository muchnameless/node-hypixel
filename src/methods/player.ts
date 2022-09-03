import { type RequestOptions } from '../Client.js';
import { type Components, type Paths } from '../types/api.js';
import { Method } from '../util/Method.js';

export class Player extends Method {
	/**
	 * Returns a player's data, such as game stats.
	 *
	 * @example
	 * ```typescript
	 * const player = await client.player.uuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(player);
	 * ```
	 * @category API
	 */
	public async uuid(
		uuid: Components.Parameters.PlayerUuid.Uuid,
		options?: RequestOptions,
	): Promise<Paths.Player.Get.Responses.$200> {
		return this.client.call<Paths.Player.Get.Responses.$200>('player', options, {
			uuid,
		}) as never;
	}
}
