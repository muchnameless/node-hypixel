import { Method } from '../util/Method';
import type { RequestOptions } from '../Client';
import type { Components, Paths } from '../types/api';

export class Player extends Method {
	/**
	 * Returns a player's data, such as game stats.
	 * @example
	 * ```typescript
	 * const player = await client.player.uuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(player);
	 * ```
	 * @category API
	 */
	public uuid(
		uuid: Components.Parameters.PlayerUuid.Uuid,
		options?: RequestOptions,
	): Promise<Paths.Player.Get.Responses.$200> {
		return this.client.call<Paths.Player.Get.Responses.$200>('player', options, {
			uuid,
		}) as never;
	}
}
