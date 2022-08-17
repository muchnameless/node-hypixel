import { Method } from '../util/Method';
import type { RequestOptions } from '../Client';
import type { Components, Paths } from '../types/api';

export class RecentGames extends Method {
	/**
	 * Returns recent games of a player. A maximum of 100 games are returned and recent games are only stored for up to 3 days at this time.
	 * @example
	 * ```typescript
	 * const response = await client.recentGames.uuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(response);
	 * ```
	 * @category API
	 */
	public uuid(
		uuid: Components.Parameters.PlayerUuidRequired.Uuid,
		options?: RequestOptions,
	): Promise<Paths.RecentGames.Get.Responses.$200> {
		return this.client.call<Paths.RecentGames.Get.Responses.$200>('recentGames', options, {
			uuid,
		});
	}
}
