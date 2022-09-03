import { type RequestOptions } from '../Client.js';
import { type Components, type Paths } from '../types/api.js';
import { Method } from '../util/Method.js';

export class RecentGames extends Method {
	/**
	 * Returns recent games of a player. A maximum of 100 games are returned and recent games are only stored for up to 3 days at this time.
	 *
	 * @example
	 * ```typescript
	 * const response = await client.recentGames.uuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(response);
	 * ```
	 * @category API
	 */
	public async uuid(
		uuid: Components.Parameters.PlayerUuidRequired.Uuid,
		options?: RequestOptions,
	): Promise<Paths.RecentGames.Get.Responses.$200> {
		return this.client.call<Paths.RecentGames.Get.Responses.$200>('recentGames', options, {
			uuid,
		});
	}
}
