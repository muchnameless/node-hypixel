import { Method } from '../../util/Method';
import type { RequestOptions } from '../../Client';
import type { Paths } from '../../types/api';

export class SkyBlockAuctions extends Method {
	/**
	 * Returns SkyBlock auctions that are currently active in the in-game Auction House.
	 * @example
	 * ```typescript
	 * const { auctions } = await client.skyblock.auctions.page(0);
	 * ```
	 * @category API
	 */
	public page(
		page: Paths.SkyblockAuctions.Get.Parameters.Page = 0,
		options?: RequestOptions,
	): Promise<Paths.SkyblockAuctions.Get.Responses.$200> {
		return this.client.call<Paths.SkyblockAuctions.Get.Responses.$200>('skyblock/auctions', options, {
			page: page.toString(10),
		});
	}
}
