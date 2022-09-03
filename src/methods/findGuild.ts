import { type RequestOptions } from '../Client.js';
import { type Components, type Paths } from '../types/api.js';
import { Method } from '../util/Method.js';

export class FindGuild extends Method {
	/**
	 * Returns the id of the requested guild if found.
	 *
	 * @example
	 * ```typescript
	 * const { guild } = await client.findGuild.byName("Mini Squid");
	 * console.log(boosters);
	 * // 553490650cf26f12ae5bac8f
	 * ```
	 * @category API
	 */
	public async byName(
		name: Components.Parameters.ByGuildName.ByName,
		options?: RequestOptions,
	): Promise<Paths.FindGuild.Get.Responses.$200> {
		return this.client.call<Paths.Boosters.Get.Responses.$200>('findGuild', options, {
			byName: name,
		}) as never;
	}

	/**
	 * Returns the id of the requested guild if found.
	 *
	 * @example
	 * ```typescript
	 * const { guild } = await client.findGuild.byUuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(guild);
	 * // 553490650cf26f12ae5bac8f
	 * ```
	 * @category API
	 */
	public async byUuid(
		uuid: Components.Parameters.ByUuid.ByUuid,
		options?: RequestOptions,
	): Promise<Paths.FindGuild.Get.Responses.$200> {
		return this.client.call<Paths.FindGuild.Get.Responses.$200>('findGuild', options, {
			byUuid: uuid,
		}) as never;
	}
}
