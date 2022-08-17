import { Method } from '../../util/Method';
import { getResultObject } from '../../util/ResultObject';
import { getResultArray } from '../../util/ResultArray';
import type { Paths } from '../../types/api';
import type { ResultObject } from '../../util/ResultObject';
import type { ResultArray } from '../../util/ResultArray';
import type { RequestOptions } from '../../Client';

export class GuildsResources extends Method {
	/**
	 * Retrieve a list of achievements a Hypixel guild can accomplish.
	 * @example
	 * ```typescript
	 * const achievements = await client.resources.guilds.achievements();
	 * ```
	 * @category API
	 */
	public async achievements(
		options?: RequestOptions,
	): Promise<ResultObject<Paths.ResourcesGuildsAchievements.Get.Responses.$200, 'tiered'>> {
		return getResultObject(
			await this.client.call<Paths.ResourcesGuildsAchievements.Get.Responses.$200>(
				'resources/guilds/achievements',
				options,
			),
			'tiered',
		);
	}

	/**
	 * Retrieve a list of permissions that a Hypixel guild master can use.
	 * @example
	 * ```typescript
	 * const permissions = await client.resources.guilds.permissions();
	 * ```
	 * @category API
	 */
	public async permissions(
		options?: RequestOptions,
	): Promise<ResultArray<Paths.ResourcesGuildsPermissions.Get.Responses.$200, 'permissions'>> {
		return getResultArray(
			await this.client.call<Paths.ResourcesGuildsPermissions.Get.Responses.$200>(
				'resources/guilds/permissions',
				options,
			),
			'permissions',
		);
	}
}
