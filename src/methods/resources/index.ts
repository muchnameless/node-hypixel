import { Method } from '../../util/Method';
import { getResultObject } from '../../util/ResultObject';
import { GuildsResources } from './guilds';
import { SkyBlockResources } from './skyblock';
import type { ResultObject } from '../../util/ResultObject';
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
	public async achievements(
		options?: RequestOptions,
	): Promise<ResultObject<Paths.ResourcesAchievements.Get.Responses.$200, ['achievements']>> {
		return getResultObject(
			await this.client.call<Paths.ResourcesAchievements.Get.Responses.$200>('resources/achievements', options),
			['achievements'],
		);
	}

	/**
	 * Returns all the challenges for each gamemode on the Hypixel network.
	 * @example
	 * ```typescript
	 * const challenges = await client.resources.challenges();
	 * ```
	 * @category API
	 */
	public async challenges(
		options?: RequestOptions,
	): Promise<ResultObject<Paths.ResourcesChallenges.Get.Responses.$200, ['challenges']>> {
		return getResultObject(
			await this.client.call<Paths.ResourcesChallenges.Get.Responses.$200>('resources/challenges', options),
			['challenges'],
		);
	}

	/**
	 * Returns all the quests for each gamemode on the Hypixel network.
	 * @example
	 * ```typescript
	 * const quests = await client.resources.quests();
	 * ```
	 * @category API
	 */
	public async quests(
		options?: RequestOptions,
	): Promise<ResultObject<Paths.ResourcesQuests.Get.Responses.$200, ['quests']>> {
		return getResultObject(
			await this.client.call<Paths.ResourcesQuests.Get.Responses.$200>('resources/quests', options),
			['quests'],
		);
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
