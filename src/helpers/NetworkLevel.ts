/**
 * This portion of code was ported from the [hypixel-php](https://github.com/Plancke/hypixel-php) library.
 *
 * Copyright (c) 2020 Zikeji
 * Copyright (c) 2017 Aäron Plancke
 *
 * For the original full copyright and license information, please view the LICENSE-HYPIXEL-PHP.md that was distributed with this source code.
 */

import { type Components } from '../types/api.js';

/**
 * Describes the results from a {@link getNetworkLevel} function call.
 */
export interface NetworkLevel {
	currentExp: number;
	expToLevel: number;
	expToNextLevel: number;
	level: number;
	preciseLevel: number;
	remainingExpToNextLevel: number;
}

/**
 * @internal
 */
enum NETWORK_LEVEL_CONSTANTS {
	START = 10_000,
	GROWTH = 2_500,
	// eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
	RPQP = (() => -(START - 0.5 * GROWTH) / GROWTH)(),
	// eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
	IPQP = (() => RPQP * RPQP)(),
}

/**
 * Calculates the total EXP required for a specific network level.
 *
 * @param level Level you're getting the EXP required for. Can be a float or an integer.
 * @category Helper
 */
export function getExpFromNetworkLevel(level: number): number {
	const flooredLevel = Math.floor(level);
	const expToFlooredLevel =
		(NETWORK_LEVEL_CONSTANTS.GROWTH * 0.5 * (flooredLevel - 2) + NETWORK_LEVEL_CONSTANTS.START) * (flooredLevel - 1);
	if (flooredLevel === level) {
		return expToFlooredLevel;
	}

	return (getExpFromNetworkLevel(flooredLevel + 1) - expToFlooredLevel) * (level % 1) + expToFlooredLevel;
}

/**
 * Calculates the network level and returns a {@link NetworkLevel} interface.
 *
 * @param data The player object or the raw EXP number.
 * @category Helper
 */
export function getNetworkLevel(data: Components.Schemas.Player | number): NetworkLevel {
	let currentExp = 0;
	if (typeof data === 'number') {
		currentExp = data;
	} else {
		currentExp = data.networkExp ?? 0;
	}

	if (currentExp < 0) currentExp = 0;

	const level = Math.floor(
		1 +
			NETWORK_LEVEL_CONSTANTS.RPQP +
			Math.sqrt(NETWORK_LEVEL_CONSTANTS.IPQP + (2 / NETWORK_LEVEL_CONSTANTS.GROWTH) * currentExp),
	);
	const expToLevel = getExpFromNetworkLevel(level);
	const nextLevelExp = getExpFromNetworkLevel(level + 1);
	const expToNextLevel = nextLevelExp - expToLevel;
	const expInCurrentLevel = currentExp - expToLevel;
	const remainingExpToNextLevel = nextLevelExp - currentExp;
	const nextLevelProgress = expInCurrentLevel / expToNextLevel;
	const preciseLevel = level + nextLevelProgress;

	return {
		level,
		preciseLevel,
		currentExp,
		expToLevel,
		expToNextLevel,
		remainingExpToNextLevel,
	};
}
