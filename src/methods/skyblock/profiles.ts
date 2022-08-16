import { Method } from '../../util/Method';
import { getResultArray } from '../../util/ResultArray';
import type { RequestOptions } from '../../Client';
import type { Components, Paths } from '../../types/api';
import type { ResultArray } from '../../util/ResultArray';

export class SkyBlockProfiles extends Method {
	/**
	 * Returns an array SkyBlock profile's data, such as stats, objectives etc. The data returned can differ depending on the players in-game API settings. The request takes a player UUID.
	 * @example
	 * ```typescript
	 * const profiles = await client.skyblock.profiles.uuid("20934ef9488c465180a78f861586b4cf");
	 * ```
	 * @category API
	 */
	public async uuid(
		uuid: Components.Parameters.PlayerUuidRequired.Uuid,
		options?: RequestOptions,
	): Promise<ResultArray<Paths.SkyblockProfiles.Get.Responses.$200, 'profiles'>> {
		return getResultArray(
			await this.client.call<Paths.SkyblockProfiles.Get.Responses.$200>('skyblock/profiles', options, { uuid }),
			'profiles',
		);
	}
}
