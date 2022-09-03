import { type RequestOptions } from '../index.js';
import { type Components } from '../types/api.js';

export abstract class BaseClient {
	public abstract call<T extends Components.Schemas.ApiSuccess>(
		path: string,
		options: RequestOptions | undefined,
		parameters?: Record<string, string>,
	): Promise<T & { cached?: boolean }>;
}
