import { EventEmitter } from 'node:events';
import { clearTimeout, setTimeout } from 'node:timers';
import { setTimeout as sleep } from 'node:timers/promises';
import { URL } from 'node:url';
import { AsyncQueue } from '@sapphire/async-queue';
import { fetch, type Headers } from 'undici';
import { GenericHTTPError } from './errors/GenericHTTPError.js';
import { InvalidKeyError } from './errors/InvalidKeyError.js';
import { RateLimitError } from './errors/RateLimitError.js';
import { FindGuild } from './methods/findGuild.js';
import { Friends } from './methods/friends.js';
import { Guild } from './methods/guild.js';
import { Player } from './methods/player.js';
import { RecentGames } from './methods/recentGames.js';
import { Resources } from './methods/resources/index.js';
import { SkyBlock } from './methods/skyblock/index.js';
import { Status } from './methods/status.js';
import { type Components, type Paths } from './types/api.js';
import { consumeBody } from './util/Fetch.js';

/**
 * @internal
 */
const CACHE_CONTROL_REGEX = /(?<=s-maxage=)\d+/;

/**
 * @internal
 */
export interface ActionableCall<T extends Components.Schemas.ApiSuccess> {
	auth: boolean;
	execute(): Promise<T>;
	retries: number;
	signal: AbortSignal;
}

/**
 * @hidden
 */
export interface RateLimitData {
	/**
	 * How many requests per minute your API key can make.
	 */
	limit: number;
	/**
	 * Remaining API calls until the limit resets.
	 */
	remaining: number;
	/**
	 * Time, in seconds, until remaining resets to limit.
	 */
	reset: number;
}

/**
 * Possible meta options returned on the meta variable.
 */
export interface DefaultMeta {
	/**
	 * If you included a cache get/set method in the options, this value will be set to true if that cache was hit.
	 */
	cached?: boolean;
	/**
	 * Data from CloudFlare's headers in regards to caching - particularly relevant for resources endpoints.
	 */
	cloudflareCache?: {
		/**
		 * Cloudflare cache age.
		 */
		age?: number;
		/**
		 * Cloudflare max cache age.
		 */
		maxAge?: number;
		/**
		 * Cloudflare cache status.
		 */
		status: 'BYPASS' | 'DYNAMIC' | 'EXPIRED' | 'HIT' | 'MISS';
	};
	/**
	 * If this request required an API key it returned rate limit information in the headers, which is included here.
	 */
	ratelimit?: RateLimitData;
}

export interface RequestOptions {
	/**
	 * whether to cache the response
	 *
	 * @default true
	 */
	cache?: boolean;
	/**
	 * whether to skip the cache check
	 *
	 * @default false
	 */
	force?: boolean;
	/**
	 * signal used to abort the (queued) request
	 */
	signal?: AbortSignal;
}

/**
 * @hidden
 */
export interface Parameters {
	[parameter: string]: string;
}

/**
 * If you want built in caching, implementing these methods (or utilitizing an library that includes these methods) is a must. Refer to the [cache](https://node-hypixel.zikeji.com/guide/cache) guide.
 */
export interface BasicCache {
	get<T extends Components.Schemas.ApiSuccess>(key: string): Promise<(DefaultMeta & T) | null | undefined>;
	set<T extends Components.Schemas.ApiSuccess>(key: string, value: DefaultMeta & T): Promise<unknown>;
}

export interface ClientOptions {
	/**
	 * Functions you want to use for caching results. Optional.
	 */
	cache?: BasicCache;
	/**
	 * Additional waiting time for rate limits
	 *
	 * @default 0
	 */
	rateLimitResetOffset?: number;
	/**
	 * Amount of times to retry a failed request.
	 *
	 * @default 3
	 */
	retries?: number;
	/**
	 * The time, in milliseconds, you want to wait before giving up on the method call.
	 *
	 * **NOTE:** This option is ignored when being [used in Deno](https://github.com/denoland/deno/issues/7019).
	 *
	 * @default 10000
	 */
	timeout?: number;
	/**
	 * User agent the client uses when making calls to Hypixel's API
	 *
	 * @default @zikeji/hypixel
	 */
	userAgent?: string;
}

export interface Client {
	/**
	 * Remove your function listening to the "limited" event.
	 *
	 * @category Events
	 */
	off(event: 'limited', listener: () => void): this;

	/**
	 * Remove your function listening to the "reset" event.
	 *
	 * @category Events
	 */
	// eslint-disable-next-line @typescript-eslint/unified-signatures
	off(event: 'reset', listener: () => void): this;

	/**
	 * Listen to the "limited" event which emits when the client starts limiting your calls due to hitting the rate limit.
	 *
	 * @category Events
	 */
	on(event: 'limited', listener: (limit: number, reset: Date) => void): this;

	/**
	 * Listen to the "reset" event which emits when the API rate limit resets.
	 *
	 * @category Events
	 */
	on(event: 'reset', listener: () => void): this;

	/**
	 * Listen once to the "limited" event which emits when the client starts limiting your calls due to hitting the rate limit.
	 *
	 * @category Events
	 */
	once(event: 'limited', listener: (limit: number, reset: Date) => void): this;

	/**
	 * Listen once to the "reset" event which emits when the API rate limit resets.
	 *
	 * @category Events
	 */
	once(event: 'reset', listener: () => void): this;
}

export class Client extends EventEmitter {
	/**
	 * @internal
	 */
	private static readonly endpoint = new URL(`https://api.hypixel.net`);

	/**
	 * @internal
	 */
	private readonly apiKey: string;

	/**
	 * @internal
	 */
	private readonly retries: number;

	/**
	 * @internal
	 */
	private readonly timeout: number;

	/**
	 * @internal
	 */
	private readonly userAgent: string;

	/**
	 * @internal
	 */
	private readonly cache?: ClientOptions['cache'];

	/**
	 * @internal
	 */
	private readonly rateLimitResetOffset: number;

	public readonly queue = new AsyncQueue();

	public readonly rateLimit: RateLimitData = {
		remaining: -1,
		reset: -1,
		limit: -1,
	};

	/**
	 * Create a new instance of the API client.
	 *
	 * @param key Your Hypixel API key.
	 * @param options Any options and customizations being applied.
	 */
	public constructor(key: string, options?: ClientOptions) {
		super({ captureRejections: true });

		if (!key || typeof key !== 'string') {
			throw new InvalidKeyError('Invalid API key');
		}

		this.apiKey = key;
		this.retries = options?.retries ?? 3;
		this.timeout = options?.timeout ?? 10_000;
		this.userAgent = options?.userAgent ?? '@zikeji/hypixel';
		this.cache = options?.cache;
		this.rateLimitResetOffset = options?.rateLimitResetOffset ?? 0;
	}

	/**
	 * Returns list of boosters.
	 *
	 * @example
	 * ```typescript
	 * const boosters = await client.boosters();
	 * console.log(boosters);
	 * ```
	 * @category API
	 */
	public async boosters(options?: RequestOptions): Promise<Paths.Boosters.Get.Responses.$200> {
		return this.call<Paths.Boosters.Get.Responses.$200>('boosters', options);
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
	public findGuild = new FindGuild(this);

	/**
	 * Returns friendships for given player.
	 *
	 * @example
	 * ```typescript
	 * const friends = await client.friends.uuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(friends);
	 * ```
	 * @category API
	 */
	public friends = new Friends(this);

	/**
	 * Returns the current player count along with the player count of each public game + mode on the server.
	 *
	 * @example
	 * ```typescript
	 * const response = await client.gameCounts();
	 * console.log(response);
	 * ```
	 * @category API
	 */
	public async gameCounts(options?: RequestOptions): Promise<Paths.GameCounts.Get.Responses.$200> {
		return this.call<Paths.GameCounts.Get.Responses.$200>('gameCounts', options);
	}

	/**
	 * Returns the guild by the requested ID if found.
	 *
	 * @example
	 * ```typescript
	 * const guild = await client.guild.id("553490650cf26f12ae5bac8f");
	 * ```
	 * @category API
	 */
	public guild = new Guild(this);

	/**
	 * Returns information regarding given key.
	 *
	 * @example
	 * ```typescript
	 * const key = await client.key();
	 * console.log(key);
	 * ```
	 * @category API
	 */
	public async key(options?: RequestOptions): Promise<Paths.Key.Get.Responses.$200> {
		return this.call<Paths.Key.Get.Responses.$200>('key', options);
	}

	/**
	 * Returns a list of the official leaderboards and their current standings for games on the network.
	 *
	 * @example
	 * ```typescript
	 * const leaderboards = await client.leaderboards();
	 * console.log(leaderboards);
	 * ```
	 * @category API
	 */
	public async leaderboards(options?: RequestOptions): Promise<Paths.Leaderboards.Get.Responses.$200> {
		return this.call<Paths.Leaderboards.Get.Responses.$200>('leaderboards', options);
	}

	/**
	 * Returns a player's data, such as game stats.
	 *
	 * @example
	 * ```typescript
	 * const player = await client.player.uuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(player);
	 * ```
	 * @category API
	 */
	public player = new Player(this);

	/**
	 * Returns current player count.
	 *
	 * @example
	 * ```typescript
	 * const response = await client.playerCounts();
	 * console.log(response);
	 * ```
	 * @category API
	 */
	public async playerCount(options?: RequestOptions): Promise<Paths.PlayerCount.Get.Responses.$200> {
		return this.call<Paths.PlayerCount.Get.Responses.$200>('playerCount', options);
	}

	/**
	 * Returns recent games of a player. A maximum of 100 games are returned and recent games are only stored for up to 3 days at this time.
	 *
	 * @example
	 * ```typescript
	 * const response = await client.recentGames.uuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(response);
	 * ```
	 * @category API
	 */
	public recentGames = new RecentGames(this);

	/**
	 * Relatively static Hypixel resources that don't change often at all.
	 *
	 * @category API
	 */
	public resources = new Resources(this);

	/**
	 * All SkyBlock related endpoints.
	 *
	 * @category API
	 */
	public skyblock = new SkyBlock(this);

	/**
	 * Returns online status information for given player, including game, mode and map when available.
	 *
	 * @example
	 * ```typescript
	 * const response = await client.status.uuid("20934ef9488c465180a78f861586b4cf");
	 * console.log(response);
	 * ```
	 * @category API
	 */
	public status = new Status(this);

	/**
	 * Returns some statistics about Watchdog & bans.
	 *
	 * @example
	 * ```typescript
	 * const response = await client.watchdogstats();
	 * console.log(response);
	 * // {
	 * //   watchdog_lastMinute: 1,
	 * //   staff_rollingDaily: 3014,
	 * //   watchdog_total: 5589923,
	 * //   watchdog_rollingDaily: 4662,
	 * //   staff_total: 1874174
	 * // }
	 * ```
	 * @category API
	 */
	public async watchdogstats(options?: RequestOptions): Promise<Paths.Watchdogstats.Get.Responses.$200> {
		return this.call<Paths.Watchdogstats.Get.Responses.$200>('watchdogstats', options);
	}

	/**
	 * The raw query method used by this library. You may use this if you need to use an undocumented method with this library.
	 *
	 * @category Custom
	 * @param path The path on the method you want to query.
	 * @param parameters Any search parameters you want to use.
	 * @typeParam T As all of Hypixel's API methods return a basic `{ success: boolean; cause?: string; }`, this type parameter (if using Typescript) extends an interface including those.
	 * @example
	 * Getting the ID of a guild using the [findGuild](https://github.com/HypixelDev/PublicAPI/blob/master/Documentation/methods/findGuild.md) method.
	 * ```javascript
	 * const response = await client.call("findGuild", { byName: "Mini Squid" });
	 * console.log(response);
	 * // { success: true, guild: '553490650cf26f12ae5bac8f' }
	 * ```
	 */
	public async call<T extends Components.Schemas.ApiSuccess>(
		path: string,
		options?: RequestOptions,
		parameters?: Parameters,
	): Promise<T & { cached?: boolean }> {
		if (!this.cache || options?.force) {
			return this.executeActionableCall(this.createActionableCall(path, options, parameters));
		}

		const key = `${path.replaceAll('/', ':')}${
			parameters ? `:${Object.values(parameters).map((value) => value.toLowerCase().replaceAll('-', ''))}` : ''
		}`;
		const cachedResponse: (T & { cached?: boolean }) | null | undefined = await this.cache.get<T>(key);
		if (cachedResponse) {
			cachedResponse.cached = true;
			return cachedResponse;
		}

		const response: T = await this.executeActionableCall(this.createActionableCall(path, options, parameters));
		if (options?.cache !== false) await this.cache.set(key, response);
		return response;
	}

	/**
	 * @internal
	 */
	private async executeActionableCall<T extends Components.Schemas.ApiSuccess>(call: ActionableCall<T>): Promise<T> {
		if (call.auth) {
			await this.queue.wait({ signal: call.signal });
			if (this.rateLimit.remaining === 0) {
				const timeout = this.rateLimit.reset - Date.now() + this.rateLimitResetOffset;
				this.emit('limited', this.rateLimit.limit, new Date(this.rateLimit.reset + this.rateLimitResetOffset));
				await sleep(timeout);
				this.emit('reset');
			}
		}

		let response: DefaultMeta & T;
		try {
			response = await call.execute();
		} catch (error) {
			if (error instanceof InvalidKeyError || error instanceof GenericHTTPError || call.retries === this.retries) {
				throw error;
			}

			call.retries += 1;
			return await this.executeActionableCall<T>(call);
		} finally {
			if (call.auth) this.queue.shift();
		}

		if (typeof response === 'object' && call.auth) {
			response.ratelimit = { ...this.rateLimit };
		}

		return response;
	}

	/**
	 * @internal
	 */
	private createActionableCall<T extends Components.Schemas.ApiSuccess>(
		path: string,
		options?: RequestOptions,
		parameters?: Parameters,
	): ActionableCall<T> {
		let auth = true;

		// No API key or rate limiting is needed on resources, skyblock/auctions, or skyblock/bazaar
		if (
			path.startsWith('resources') ||
			path === 'skyblock/auctions' ||
			path === 'skyblock/auctions_ended' ||
			path === 'skyblock/bazaar'
		) {
			auth = false;
		}

		return {
			execute: async () => this.callMethod(path, auth, parameters, options?.signal),
			retries: 0,
			auth,
		} as ActionableCall<T>;
	}

	/**
	 * @internal
	 */
	private async callMethod<
		T extends Components.Schemas.ApiSuccess & {
			cause?: string;
		} & { cloudflareCache?: DefaultMeta['cloudflareCache'] },
	>(path: string, auth: boolean, parameters?: Parameters, signal?: AbortSignal): Promise<T> {
		const url = new URL(path, Client.endpoint);

		if (parameters) {
			for (const [key, value] of Object.entries(parameters)) {
				url.searchParams.set(key, value);
			}
		}

		// @ts-expect-error AbortSignal
		signal?.throwIfAborted();

		// internal AbortSignal (to have a timeout without having to abort the external signal)
		const controller = new AbortController();
		const listener = () => controller.abort();
		const timeout = setTimeout(listener, this.timeout);

		// external AbortSignal
		// @ts-expect-error AbortSignal
		signal?.addEventListener('abort', listener);

		try {
			const res = await fetch(url, {
				method: 'GET',
				headers: {
					'API-Key': auth ? this.apiKey : undefined!,
					'User-Agent': this.userAgent,
					Accept: 'application/json',
				},
			});

			if (auth) this.getRateLimitHeaders(res.headers);

			switch (res.status) {
				case 200:
					break;

				case 429:
					void consumeBody(res);
					throw new RateLimitError(`Hit key throttle`);

				case 403:
					void consumeBody(res);
					throw new InvalidKeyError('Invalid API Key');

				default:
					void consumeBody(res);
					throw new GenericHTTPError(url, res.status, res.statusText);
			}

			const parsed = (await res.json()) as T;
			const status = res.headers.get('cf-cache-status');

			if (status) {
				const age = Number.parseInt(res.headers.get('age')!, 10);
				const maxAge = CACHE_CONTROL_REGEX.exec(res.headers.get('cache-control')!);
				parsed.cloudflareCache = {
					status: status as never,
					...(typeof age === 'number' && !Number.isNaN(age) && { age }),
					...(status === 'HIT' && (typeof age !== 'number' || Number.isNaN(age)) && { age: 0 }),
					...(maxAge?.length &&
						Number.parseInt(maxAge[0], 10) > 0 && {
							maxAge: Number.parseInt(maxAge[0], 10),
						}),
				};
			}

			return parsed;
		} finally {
			clearTimeout(timeout);
			// @ts-expect-error AbortSignal
			signal?.removeEventListener('abort', listener);
		}
	}

	/**
	 * @internal
	 */
	private getRateLimitHeaders(headers: Headers): void {
		for (const key of Object.keys(this.rateLimit)) {
			const value = headers.get(`ratelimit-${key}`);

			if (value) {
				this.rateLimit[key as keyof Client['rateLimit']] =
					key === 'reset'
						? Number.parseInt(value, 10) * 1_000 + (Date.parse(headers.get('date')!) || Date.now())
						: Number.parseInt(value, 10);
			}
		}
	}
}

export default Client;
