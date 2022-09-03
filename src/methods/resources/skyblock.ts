import { type RequestOptions } from '../../Client.js';
import { type Paths } from '../../types/api.js';
import { Method } from '../../util/Method.js';

export class SkyBlockResources extends Method {
	/**
	 * Returns the list of ingame collections.
	 *
	 * @return An object of [[Collection | Collection interface]] objects.
	 * @category API
	 */
	public async collections(options?: RequestOptions): Promise<Paths.ResourcesSkyblockCollections.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesSkyblockCollections.Get.Responses.$200>(
			'resources/skyblock/collections',
			options,
		);
	}

	/**
	 * Returns the current skills from the SkyBlock gamemode.
	 *
	 * @category API
	 */
	public async skills(options?: RequestOptions): Promise<Paths.ResourcesSkyblockSkills.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesSkyblockSkills.Get.Responses.$200>('resources/skyblock/skills', options);
	}

	/**
	 * Returns the current items from the SkyBlock gamemode.
	 *
	 * @category API
	 */
	public async items(options?: RequestOptions): Promise<Paths.ResourcesSkyblockItems.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesSkyblockItems.Get.Responses.$200>('resources/skyblock/items', options);
	}
}
