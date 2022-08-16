import { Method } from '../../util/Method';
import { getResultArray } from '../../util/ResultArray';
import type { RequestOptions } from '../../Client';
import type { Paths } from '../../types/api';
import type { ResultArray } from '../../util/ResultArray';

export class SkyBlockAuction extends Method {
	/**
	 * Returns SkyBlock auctions by either player, profile or auction uuid. Only "active" auctions are returned, these are auctions that are still open or that have not had all bids/items claimed.
	 * @example
	 * ```typescript
	 * const auctions = await client.skyblock.auction.player("347ef6c1daac45ed9d1fa02818cf0fb6");
	 * ```
	 * @category API
	 */
	public async player(
		player: Paths.SkyblockAuction.Get.Parameters.Player,
		options?: RequestOptions,
	): Promise<ResultArray<Paths.SkyblockAuction.Get.Responses.$200, 'auctions'>> {
		return getResultArray(
			await this.client.call<Paths.SkyblockAuction.Get.Responses.$200>('skyblock/auction', options, { player }),
			'auctions',
		);
	}

	/**
	 * Returns SkyBlock auctions by either player, profile or auction uuid. Only "active" auctions are returned, these are auctions that are still open or that have not had all bids/items claimed.
	 * @example
	 * ```typescript
	 * const auctions = await client.skyblock.auction.profile("347ef6c1daac45ed9d1fa02818cf0fb6");
	 * ```
	 * @category API
	 */
	public async profile(
		profile: Paths.SkyblockAuction.Get.Parameters.Profile,
		options?: RequestOptions,
	): Promise<ResultArray<Paths.SkyblockAuction.Get.Responses.$200, 'auctions'>> {
		return getResultArray(
			await this.client.call<Paths.SkyblockAuction.Get.Responses.$200>('skyblock/auction', options, { profile }),
			'auctions',
		);
	}

	/**
	 * Returns SkyBlock auctions by either player, profile or auction uuid. Only "active" auctions are returned, these are auctions that are still open or that have not had all bids/items claimed.
	 * @example
	 * ```typescript
	 * const auctions = await client.skyblock.auction.uuid("409a1e0f261a49849493278d6cd9305a");
	 * ```
	 * @category API
	 */
	public async uuid(
		uuid: Paths.SkyblockAuction.Get.Parameters.Uuid,
		options?: RequestOptions,
	): Promise<ResultArray<Paths.SkyblockAuction.Get.Responses.$200, 'auctions'>> {
		return getResultArray(
			await this.client.call<Paths.SkyblockAuction.Get.Responses.$200>('skyblock/auction', options, { uuid }),
			'auctions',
		);
	}
}
