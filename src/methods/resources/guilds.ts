import { type RequestOptions } from '../../Client.js';
import { type Paths } from '../../types/api.js';
import { Method } from '../../util/Method.js';

export class GuildsResources extends Method {
	/**
	 * Retrieve a list of achievements a Hypixel guild can accomplish.
	 *
	 * @example
	 * ```typescript
	 * const achievements = await client.resources.guilds.achievements();
	 * ```
	 * @category API
	 */
	public async achievements(options?: RequestOptions): Promise<Paths.ResourcesGuildsAchievements.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesGuildsAchievements.Get.Responses.$200>(
			'resources/guilds/achievements',
			options,
		);
	}

	/**
	 * Retrieve a list of permissions that a Hypixel guild master can use.
	 *
	 * @example
	 * ```typescript
	 * const permissions = await client.resources.guilds.permissions();
	 * ```
	 * @category API
	 */
	public async permissions(options?: RequestOptions): Promise<Paths.ResourcesGuildsPermissions.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesGuildsPermissions.Get.Responses.$200>(
			'resources/guilds/permissions',
			options,
		);
	}
}
