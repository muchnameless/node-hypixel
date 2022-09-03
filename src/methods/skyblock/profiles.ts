import { type RequestOptions } from '../../Client.js';
import { type Components, type Paths } from '../../types/api.js';
import { Method } from '../../util/Method.js';

export class SkyBlockProfiles extends Method {
	/**
	 * Returns an array SkyBlock profile's data, such as stats, objectives etc. The data returned can differ depending on the players in-game API settings. The request takes a player UUID.
	 *
	 * @example
	 * ```typescript
	 * const profiles = await client.skyblock.profiles.uuid("20934ef9488c465180a78f861586b4cf");
	 * ```
	 * @category API
	 */
	public async uuid(
		uuid: Components.Parameters.PlayerUuidRequired.Uuid,
		options?: RequestOptions,
	): Promise<Paths.SkyblockProfiles.Get.Responses.$200> {
		return this.client.call<Paths.SkyblockProfiles.Get.Responses.$200>('skyblock/profiles', options, { uuid });
	}
}
