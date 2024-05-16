import { type RequestOptions } from '../../Client.js';
import { type Paths } from '../../types/api.js';
import { Method } from '../../util/Method.js';

export class Museum extends Method {
	/**
	 * Returns SkyBlock auctions by either player, profile or auction uuid. Only "active" auctions are returned, these are auctions that are still open or that have not had all bids/items claimed.
	 *
	 * @example
	 * ```typescript
	 * const auctions = await client.skyblock.museum.profile("347ef6c1daac45ed9d1fa02818cf0fb6");
	 * ```
	 * @category API
	 */
	public async profile(
		profile: Paths.SkyBlockMuseum.Get.Parameters.Profile,
		options?: RequestOptions,
	): Promise<Paths.SkyBlockMuseum.Get.Responses.$200> {
		return this.client.call<Paths.SkyBlockMuseum.Get.Responses.$200>('skyblock/museum', options, { profile });
	}
}
