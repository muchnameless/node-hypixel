import { Method } from '../../util/Method';
import type { RequestOptions } from '../../Client';
import type { Paths } from '../../types/api';

export class SkyBlockResources extends Method {
	/**
	 * Returns the list of ingame collections.
	 * @return An object of [[Collection | Collection interface]] objects.
	 * @category API
	 */
	public collections(options?: RequestOptions): Promise<Paths.ResourcesSkyblockCollections.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesSkyblockCollections.Get.Responses.$200>(
			'resources/skyblock/collections',
			options,
		);
	}

	/**
	 * Returns the current skills from the SkyBlock gamemode.
	 * @category API
	 */
	public skills(options?: RequestOptions): Promise<Paths.ResourcesSkyblockSkills.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesSkyblockSkills.Get.Responses.$200>('resources/skyblock/skills', options);
	}

	/**
	 * Returns the current items from the SkyBlock gamemode.
	 * @category API
	 */
	public items(options?: RequestOptions): Promise<Paths.ResourcesSkyblockItems.Get.Responses.$200> {
		return this.client.call<Paths.ResourcesSkyblockItems.Get.Responses.$200>('resources/skyblock/items', options);
	}
}
