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
 * Describes the results of the {@link getGuildLevel} output object.
 */
export interface GuildLevel {
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
const EXP_NEEDED = [
	100_000, 150_000, 250_000, 500_000, 750_000, 1_000_000, 1_250_000, 1_500_000, 2_000_000, 2_500_000, 2_500_000,
	2_500_000, 2_500_000, 2_500_000, 3_000_000,
];

/**
 * Calculates the guild level and returns a {@link GuildLevel} interface.
 *
 * @param data The guild object or the raw EXP number.
 * @category Helper
 */
export function getGuildLevel(data: Components.Schemas.Guild | number): GuildLevel {
	let currentExp = 0;
	if (typeof data === 'number') {
		currentExp = data;
	} else {
		currentExp = data.exp ?? 0;
	}

	if (currentExp < 0) currentExp = 0;
	let remainingExp = currentExp;

	let level = 0;
	let needed = 0;
	let expToLevel = 0;
	const expNeededClone = [...EXP_NEEDED];
	const maxExpNeeded = expNeededClone[expNeededClone.length - 1];
	while (remainingExp >= 0) {
		needed = expNeededClone.shift() ?? maxExpNeeded;
		expToLevel += needed;
		remainingExp -= needed;
		if (remainingExp > 0) {
			level += 1;
		}
	}

	const nextLevelExp = expToLevel;
	expToLevel -= needed;
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
