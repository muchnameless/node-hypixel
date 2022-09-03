import { type RequestOptions } from '../../Client.js';
import { type Paths } from '../../types/api.js';
import { Method } from '../../util/Method.js';
import { SkyBlockAuction } from './auction.js';
import { SkyBlockAuctions } from './auctions.js';
import { SkyBlockProfiles } from './profiles.js';

export class SkyBlock extends Method {
	/**
	 * Returns SkyBlock auctions by either player, profile or auction uuid. Only "active" auctions are returned, these are auctions that are still open or that have not had all bids/items claimed.
	 *
	 * @example
	 * ```typescript
	 * let auctions = await client.skyblock.auction.player("347ef6c1daac45ed9d1fa02818cf0fb6");
	 * auctions = await client.skyblock.auction.profile("347ef6c1daac45ed9d1fa02818cf0fb6");
	 * auctions = await client.skyblock.auction.uuid("409a1e0f261a49849493278d6cd9305a");
	 * ```
	 * @category API
	 */
	public auction = new SkyBlockAuction(this.client);

	/**
	 * Returns SkyBlock auctions that are currently active in the in-game Auction House.
	 *
	 * @example
	 * ```typescript
	 * const { auctions } = await client.skyblock.auctions.page(0);
	 * ```
	 * @category API
	 */
	public auctions = new SkyBlockAuctions(this.client);

	/**
	 * Returns SkyBlock auctions which ended in the last 60 seconds (More precisely, whatever time is defined in the "Cache-Control" header of the response).
	 *
	 * @example
	 * ```typescript
	 * const { auctions } = await client.skyblock.auctionsEnded();
	 * ```
	 * @category API
	 */
	public async auctionsEnded(options?: RequestOptions): Promise<Paths.SkyblockAuctionsEnded.Get.Responses.$200> {
		return this.client.call<Paths.SkyblockAuctionsEnded.Get.Responses.$200>('skyblock/auctions_ended', options);
	}

	/**
	 * Returns the list of [products](https://github.com/HypixelDev/PublicAPI/blob/master/Documentation/methods/skyblock/bazaar.md#product-description) along with their sell summary, buy summary and quick status.
	 *
	 * @example
	 * ```typescript
	 * const products = await client.skyblock.bazaar();
	 * ```
	 * @category API
	 */
	public async bazaar(options?: RequestOptions): Promise<Paths.SkyblockBazaar.Get.Responses.$200> {
		return this.client.call<Paths.SkyblockBazaar.Get.Responses.$200>('skyblock/bazaar', options);
	}

	/**
	 * Returns SkyBlock news, including a title, description and a thread.
	 *
	 * @example
	 * ```typescript
	 * const news = await client.skyblock.news();
	 * ```
	 * @category API
	 */
	public async news(options?: RequestOptions): Promise<Paths.SkyblockNews.Get.Responses.$200> {
		return this.client.call<Paths.SkyblockNews.Get.Responses.$200>('skyblock/news', options);
	}

	/**
	 * Returns a SkyBlock profile's data, such as stats, objectives etc. The data returned can differ depending on the players in-game API settings.
	 *
	 * @example
	 * ```typescript
	 * const news = await client.skyblock.profile("20934ef9488c465180a78f861586b4cf");
	 * ```
	 * @category API
	 */
	public async profile(
		profile: Paths.SkyblockProfile.Get.Parameters.Profile,
		options?: RequestOptions,
	): Promise<Paths.SkyblockProfile.Get.Responses.$200> {
		return this.client.call<Paths.SkyblockProfile.Get.Responses.$200>('skyblock/profile', options, { profile });
	}

	/**
	 * Returns an array SkyBlock profile's data, such as stats, objectives etc. The data returned can differ depending on the players in-game API settings. The request takes a player UUID.
	 *
	 * @example
	 * ```typescript
	 * const profiles = await client.skyblock.profiles.uuid("20934ef9488c465180a78f861586b4cf");
	 * ```
	 * @category API
	 */
	public profiles = new SkyBlockProfiles(this.client);
}
