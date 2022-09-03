/**
 * This portion of code was ported from the [hypixel-php](https://github.com/Plancke/hypixel-php) library.
 *
 * Copyright (c) 2021 Zikeji
 * Copyright (c) 2017 Aäron Plancke
 *
 * For the original full copyright and license information, please view the LICENSE-HYPIXEL-PHP.md that was distributed with this source code.
 */

import { type Components } from '../types/api.js';
import { getSkyWarsPrestigeForLevel, SkyWarsPrestiges, type SkyWarsPrestige } from './SkyWarsPrestige.js';

/**
 * @internal
 */
const skyWarsLevelConstants = {
	expPerLevel: 10_000,
	easyLevelExp: [0, 20, 50, 80, 100, 250, 500, 1_000, 1_500, 2_500, 4_000, 5_000],
};

/**
 * Interface describing the results from the {@link getSkyWarsLevelInfo} function.
 */
export interface SkyWarsLevelInfo {
	currentExp: number;
	expToLevel: number;
	expToNextLevel: number;
	level: number;
	preciseLevel: number;
	remainingExpToNextLevel: number;
}

/**
 * This interface is returned by {@link getSkyWarsLevelInfo} if you passed true as the second parameter.
 */
export interface SkyWarsLevelInfoAndPrestige extends SkyWarsLevelInfo {
	expToNextPrestige?: number;
	expToPrestige: number;
	nextPrestige?: SkyWarsPrestige;
	prestige: SkyWarsPrestige;
	progressToNextPrestige?: number;
	remainingExpToNextPrestige?: number;
}

/**
 * Returns the total amount of exp it takes to get to a certain level.
 *
 * @param level The level of the player.
 */
export function totalExpToSkyWarsLevel(level: number): number {
	let acc = 0;
	const easyLevelCount = Math.min(level, skyWarsLevelConstants.easyLevelExp.length);
	for (let index = 0; index < easyLevelCount; index += 1) {
		acc += skyWarsLevelConstants.easyLevelExp[index];
	}

	return level <= skyWarsLevelConstants.easyLevelExp.length
		? acc
		: acc + (level - skyWarsLevelConstants.easyLevelExp.length) * skyWarsLevelConstants.expPerLevel;
}

/**
 * Get SkyWars level information from a {@link Components.Schemas.Player} object or raw experience value.
 *
 * @param data A {@link Components.Schemas.Player} object or the raw experience value.
 * @param includePrestige Whether or not to return the {@link SkyWarsPrestige} object.
 * @category Helper
 */
export function getSkyWarsLevelInfo(
	data: Components.Schemas.Player | number,
	includePrestige?: false,
): SkyWarsLevelInfo;
export function getSkyWarsLevelInfo(
	data: Components.Schemas.Player | number,
	includePrestige: true,
): SkyWarsLevelInfoAndPrestige;
export function getSkyWarsLevelInfo(
	data: Components.Schemas.Player | number,
	includePrestige?: boolean,
): SkyWarsLevelInfo | SkyWarsLevelInfoAndPrestige {
	const currentExp = typeof data === 'number' ? data : (data.stats.SkyWars?.skywars_experience as number);
	if (typeof currentExp !== 'number' || Number.isNaN(currentExp)) {
		throw new TypeError('Data supplied does not contain player SkyWars experience.');
	}

	let expAcc = 0;
	let level = -1;
	for (let index = 0; index < skyWarsLevelConstants.easyLevelExp.length; index += 1) {
		const expPerLevel = skyWarsLevelConstants.easyLevelExp[index];
		expAcc += expPerLevel;
		if (currentExp < expAcc) {
			level = index;
			expAcc -= expPerLevel;
			break;
		}
	}

	if (level === -1) {
		level =
			skyWarsLevelConstants.easyLevelExp.length + Math.floor((currentExp - expAcc) / skyWarsLevelConstants.expPerLevel);
		expAcc += (level - skyWarsLevelConstants.easyLevelExp.length) * skyWarsLevelConstants.expPerLevel;
	}

	const expToLevel = expAcc;
	const nextLevelExp =
		expToLevel +
		(level < skyWarsLevelConstants.easyLevelExp.length
			? skyWarsLevelConstants.easyLevelExp[level]
			: skyWarsLevelConstants.expPerLevel);
	const expToNextLevel = nextLevelExp - expToLevel;
	const expInCurrentLevel = currentExp - expToLevel;
	const remainingExpToNextLevel = nextLevelExp - currentExp;
	const nextLevelProgress = expInCurrentLevel / expToNextLevel;
	const preciseLevel = level + nextLevelProgress;
	const info = {
		level,
		preciseLevel,
		currentExp,
		expToLevel,
		expToNextLevel,
		remainingExpToNextLevel,
	} as never as SkyWarsLevelInfoAndPrestige;
	if (includePrestige !== true) {
		return info;
	}

	info.prestige = getSkyWarsPrestigeForLevel(level);
	info.expToPrestige = totalExpToSkyWarsLevel(info.prestige.minimumLevel);
	const prestigeIndex = SkyWarsPrestiges.indexOf(info.prestige);
	if (prestigeIndex + 1 === SkyWarsPrestiges.length) {
		return info;
	}

	info.nextPrestige = SkyWarsPrestiges[prestigeIndex + 1];
	info.expToNextPrestige = totalExpToSkyWarsLevel(info.nextPrestige.minimumLevel);
	info.remainingExpToNextPrestige = info.expToNextPrestige - info.currentExp;
	info.progressToNextPrestige = info.currentExp / info.expToNextPrestige;
	return info;
}
