import { Method } from '../util/Method';
import { getResultObject } from '../util/ResultObject';
import type { RequestOptions } from '../Client';
import type { Components, Paths } from '../types/api';
import type { ResultObject } from '../util/ResultObject';

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
	public async uuid(
		uuid: Components.Parameters.PlayerUuid.Uuid,
		options?: RequestOptions,
	): Promise<ResultObject<Paths.Player.Get.Responses.$200, 'player'>> {
		return getResultObject(
			await this.client.call<Paths.Player.Get.Responses.$200>('player', options, {
				uuid,
			}),
			'player',
		) as never;
	}
}
