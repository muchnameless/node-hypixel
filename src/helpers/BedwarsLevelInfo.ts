/**
 * This portion of code was ported from the [hypixel-php](https://github.com/Plancke/hypixel-php) library.
 *
 * Copyright (c) 2020 Zikeji
 * Copyright (c) 2017 Aäron Plancke
 *
 * For the original full copyright and license information, please view the LICENSE-HYPIXEL-PHP.md that was distributed with this source code.
 */

import { type Components } from '../types/api.js';
import { MinecraftColorAsHex, MinecraftFormatting } from './MinecraftFormatting.js';

/**
 * @internal
 */
const enum BedwarsLevelConstants {
	EL = 4,
	// eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
	XPP = 96 * 5_000 + 7_000,
	LPP = 100,
	HP = 10,
}

/**
 * Describes the results of the {@link getBedwarsLevelInfo} helper.
 */
export interface BedwarsLevelInfo {
	level: number;
	levelInCurrentPrestige: number;
	prestige: number;
	prestigeColor: string;
	prestigeColorHex: string;
	prestigeName: string;
}

/**
 * Calculates the BedWars prestige and level of a player and returns a {@link BedwarsLevelInfo} interface.
 *
 * @category Helper
 */
export function getBedwarsLevelInfo(data: Components.Schemas.Player | number): BedwarsLevelInfo {
	const currentExp =
		typeof data === 'number' ? data : data.stats.Bedwars?.Experience ?? data.stats.Bedwars?.Experience_new;
	if (typeof currentExp !== 'number' || Number.isNaN(currentExp)) {
		throw new TypeError('Data supplied does not contain player Bedwars experience.');
	}

	const prestiges = Math.floor(currentExp / BedwarsLevelConstants.XPP);
	let level = prestiges * BedwarsLevelConstants.LPP;
	let expWithoutPrestiges = currentExp - prestiges * BedwarsLevelConstants.XPP;
	for (let index = 1; index <= BedwarsLevelConstants.EL; index += 1) {
		let elExp = 500;
		const rL = index % BedwarsLevelConstants.LPP;

		for (let ii = 0; ii < rL; ii += 1) {
			elExp += ii * 500;
		}

		if (expWithoutPrestiges < elExp) {
			break;
		}

		level += 1;
		expWithoutPrestiges -= elExp;
	}

	level += Math.floor(expWithoutPrestiges / 5_000);
	let prestige = Math.floor(level / BedwarsLevelConstants.LPP);
	if (prestige > BedwarsLevelConstants.HP) {
		prestige = BedwarsLevelConstants.HP;
	}

	let prestigeName = 'None';
	let prestigeColor = MinecraftFormatting.GRAY;
	switch (prestige) {
		case 1:
			prestigeName = 'Iron';
			prestigeColor = MinecraftFormatting.WHITE;
			break;
		case 2:
			prestigeName = 'Gold';
			prestigeColor = MinecraftFormatting.GOLD;
			break;
		case 3:
			prestigeName = 'Diamond';
			prestigeColor = MinecraftFormatting.AQUA;
			break;
		case 4:
			prestigeName = 'Emerald';
			prestigeColor = MinecraftFormatting.DARK_GREEN;
			break;
		case 5:
			prestigeName = 'Sapphire';
			prestigeColor = MinecraftFormatting.DARK_AQUA;
			break;
		case 6:
			prestigeName = 'Ruby';
			prestigeColor = MinecraftFormatting.DARK_RED;
			break;
		case 7:
			prestigeName = 'Crystal';
			prestigeColor = MinecraftFormatting.LIGHT_PURPLE;
			break;
		case 8:
			prestigeName = 'Opal';
			prestigeColor = MinecraftFormatting.BLUE;
			break;
		case 9:
			prestigeName = 'Amethyst';
			prestigeColor = MinecraftFormatting.DARK_PURPLE;
			break;
		case 10:
			prestigeName = 'Rainbow';
			prestigeColor = MinecraftFormatting.WHITE;
			break;
		default:
		// noop
	}

	const levelInCurrentPrestige = level - prestige * BedwarsLevelConstants.LPP;
	return {
		level,
		prestige,
		prestigeName,
		prestigeColor,
		prestigeColorHex: MinecraftColorAsHex[prestigeColor],
		levelInCurrentPrestige,
	};
}
