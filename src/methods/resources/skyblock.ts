import { Method } from '../../util/Method';
import { getResultObject } from '../../util/ResultObject';
import type { RequestOptions } from '../../Client';
import type { Paths } from '../../types/api';
import type { ResultObject } from '../../util/ResultObject';

export class SkyBlockResources extends Method {
	/**
	 * Returns the list of ingame collections.
	 * @return An object of [[Collection | Collection interface]] objects.
	 * @category API
	 */
	public async collections(
		options?: RequestOptions,
	): Promise<ResultObject<Paths.ResourcesSkyblockCollections.Get.Responses.$200, ['collections']>> {
		return getResultObject(
			await this.client.call<Paths.ResourcesSkyblockCollections.Get.Responses.$200>(
				'resources/skyblock/collections',
				options,
			),
			['collections'],
		);
	}

	/**
	 * Returns the current skills from the SkyBlock gamemode.
	 * @category API
	 */
	public async skills(
		options?: RequestOptions,
	): Promise<ResultObject<Paths.ResourcesSkyblockSkills.Get.Responses.$200, ['collections']>> {
		return getResultObject(
			await this.client.call<Paths.ResourcesSkyblockSkills.Get.Responses.$200>('resources/skyblock/skills', options),
			['collections'],
		);
	}
}
