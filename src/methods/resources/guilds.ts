import { Method } from '../../util/Method';
import type { Paths } from '../../types/api';
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
	public achievements(options?: RequestOptions): Promise<Paths.ResourcesGuildsAchievements.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesGuildsAchievements.Get.Responses.$200>(
			'resources/guilds/achievements',
			options,
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
	public permissions(options?: RequestOptions): Promise<Paths.ResourcesGuildsPermissions.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesGuildsPermissions.Get.Responses.$200>(
			'resources/guilds/permissions',
			options,
		);
	}
}
