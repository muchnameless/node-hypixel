import { Method } from '../util/Method';
import { getResultObject } from '../util/ResultObject';
import type { RequestOptions } from '../Client';
import type { Components, Paths } from '../types/api';
import type { ResultObject } from '../util/ResultObject';

export class Status extends Method {
	/**
	 * Returns online status information for given player, including game, mode and map when available.
	 * @example
	 * ```typescript
	 * const response = await client.status.uuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(response);
	 * ```
	 * @category API
	 */
	public async uuid(
		uuid: Components.Parameters.PlayerUuid.Uuid,
		options?: RequestOptions,
	): Promise<ResultObject<Paths.Status.Get.Responses.$200, ['session']>> {
		return getResultObject(
			await this.client.call<Paths.Status.Get.Responses.$200>('status', options, {
				uuid,
			}),
			['session'],
		) as never;
	}
}
