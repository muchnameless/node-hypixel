import { type Components } from '../types/api.js';

export interface SkyBlockSkillsInfo {
	[key: string]: SkyBlockSkillInfo;
	ALCHEMY: SkyBlockSkillInfo;
	CARPENTRY: SkyBlockSkillInfo;
	COMBAT: SkyBlockSkillInfo;
	DUNGEONEERING: SkyBlockSkillInfo;
	ENCHANTING: SkyBlockSkillInfo;
	FARMING: SkyBlockSkillInfo;
	FISHING: SkyBlockSkillInfo;
	FORAGING: SkyBlockSkillInfo;
	MINING: SkyBlockSkillInfo;
	RUNECRAFTING: SkyBlockSkillInfo;
	SOCIAL: SkyBlockSkillInfo;
	TAMING: SkyBlockSkillInfo;
}

export interface SkyBlockSkillInfo {
	description: string;
	exp: number;
	expToNextLevel: number;
	level: number;
	maxLevel: number;
	name: string;
	totalExpToLevel: number;
}

/**
 * This helper takes a profile member and converts raw skill EXP to skill levels using the skills resources. Returns false is none of the profile member does not have their skills API enabled.
 *
 * @param profileMember The SkyBlock profile member object you want to check.
 * @param skills The skills resource object.
 * @category Helper
 */
export function getSkyBlockProfileMemberSkills(
	profileMember: Components.Schemas.SkyBlockProfileMember,
	skills: Components.Schemas.SkyBlockResourcesSkills,
): SkyBlockSkillsInfo | false {
	let hasApi = false;
	const result = {} as SkyBlockSkillsInfo;

	for (const [skillName, skill] of Object.entries(skills)) {
		const skillKey = `experience_skill_${skillName.toLowerCase()}` as keyof Components.Schemas.SkyBlockProfileMember;
		let exp = 0;
		if (skillKey in profileMember) {
			exp = profileMember[skillKey] as number;
			hasApi = true;
		}

		let level = 0;
		let totalExpToLevel = 0;
		let expToNextLevel = 0;

		for (const levelInfo of skill.levels) {
			if (levelInfo.totalExpRequired > exp) {
				expToNextLevel = levelInfo.totalExpRequired - exp;
				break;
			}

			level = levelInfo.level;
			totalExpToLevel = levelInfo.totalExpRequired;
		}

		result[skillName] = {
			name: skill.name,
			description: skill.description,
			level,
			exp,
			totalExpToLevel,
			expToNextLevel,
			maxLevel: skill.maxLevel,
		};
	}

	if (hasApi === false) {
		return false;
	}

	return result;
}
