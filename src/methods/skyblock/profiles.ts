import { Method } from '../../util/Method';
import type { RequestOptions } from '../../Client';
import type { Components, Paths } from '../../types/api';

export class SkyBlockProfiles extends Method {
	/**
	 * Returns an array SkyBlock profile's data, such as stats, objectives etc. The data returned can differ depending on the players in-game API settings. The request takes a player UUID.
	 * @example
	 * ```typescript
	 * const profiles = await client.skyblock.profiles.uuid("20934ef9488c465180a78f861586b4cf");
	 * ```
	 * @category API
	 */
	public uuid(
		uuid: Components.Parameters.PlayerUuidRequired.Uuid,
		options?: RequestOptions,
	): Promise<Paths.SkyblockProfiles.Get.Responses.$200> {
		return this.client.call<Paths.SkyblockProfiles.Get.Responses.$200>('skyblock/profiles', options, { uuid });
	}
}
