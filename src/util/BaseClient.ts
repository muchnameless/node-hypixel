import type { RequestOptions } from '..';
import type { Components } from '../types/api';

export abstract class BaseClient {
	public abstract call<T extends Components.Schemas.ApiSuccess>(
		path: string,
		options: RequestOptions | undefined,
		parameters?: Record<string, string>,
	): Promise<T & { cached?: boolean }>;
}
