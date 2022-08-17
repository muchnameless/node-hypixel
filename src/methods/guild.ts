import { Method } from '../util/Method';
import { getResultObject } from '../util/ResultObject';
import type { RequestOptions } from '../Client';
import type { Paths } from '../types/api';
import type { ResultObject } from '../util/ResultObject';

export class Guild extends Method {
	/**
	 * Returns the guild by the requested ID if found.
	 * @example
	 * ```typescript
	 * const guild = await client.guild.id("553490650cf26f12ae5bac8f");
	 * ```
	 * @category API
	 */
	public async id(
		id: Paths.Guild.Get.Parameters.Id,
		options?: RequestOptions,
	): Promise<ResultObject<Paths.Guild.Get.Responses.$200, 'guild'>> {
		return getResultObject(
			await this.client.call<Paths.Guild.Get.Responses.$200>('guild', options, {
				id,
			}),
			'guild',
		) as never;
	}

	/**
	 * Returns the guild by the requested player's UUID if found.
	 * @example
	 * ```typescript
	 * const guild = await client.guild.player("20934ef9488c465180a78f861586b4cf");
	 * ```
	 * @category API
	 */
	public async player(
		player: Paths.Guild.Get.Parameters.Player,
		options?: RequestOptions,
	): Promise<ResultObject<Paths.Guild.Get.Responses.$200, 'guild'>> {
		return getResultObject(
			await this.client.call<Paths.Guild.Get.Responses.$200>('guild', options, {
				player,
			}),
			'guild',
		) as never;
	}

	/**
	 * Returns the guild by the requested guild name if found.
	 * @example
	 * ```typescript
	 * const guild = await client.guild.name("Mini Squid");
	 * ```
	 * @category API
	 */
	public async name(
		name: Paths.Guild.Get.Parameters.Name,
		options?: RequestOptions,
	): Promise<ResultObject<Paths.Guild.Get.Responses.$200, 'guild'>> {
		return getResultObject(
			await this.client.call<Paths.Guild.Get.Responses.$200>('guild', options, {
				name,
			}),
			'guild',
		) as never;
	}
}
