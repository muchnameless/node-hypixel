import { Method } from '../../util/Method';
import { GuildsResources } from './guilds';
import { SkyBlockResources } from './skyblock';
import type { Paths } from '../../types/api';
import type { RequestOptions } from '../../Client';

export class Resources extends Method {
	/**
	 * Returns all the achievements for each gamemode on the Hypixel network.
	 * @example
	 * ```typescript
	 * const achievements = await client.resources.achievements();
	 * ```
	 * @category API
	 */
	public achievements(options?: RequestOptions): Promise<Paths.ResourcesAchievements.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesAchievements.Get.Responses.$200>('resources/achievements', options);
	}

	/**
	 * Returns all the challenges for each gamemode on the Hypixel network.
	 * @example
	 * ```typescript
	 * const challenges = await client.resources.challenges();
	 * ```
	 * @category API
	 */
	public challenges(options?: RequestOptions): Promise<Paths.ResourcesChallenges.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesChallenges.Get.Responses.$200>('resources/challenges', options);
	}

	/**
	 * Returns all the quests for each gamemode on the Hypixel network.
	 * @example
	 * ```typescript
	 * const quests = await client.resources.quests();
	 * ```
	 * @category API
	 */
	public quests(options?: RequestOptions): Promise<Paths.ResourcesQuests.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesQuests.Get.Responses.$200>('resources/quests', options);
	}

	/**
	 * Guild related resources.
	 * @category API
	 */
	public guilds = new GuildsResources(this.client);

	/**
	 * SkyBlock related resources.
	 * @category API
	 */
	public skyblock = new SkyBlockResources(this.client);
}
