import { type Components } from '../types/api.js';

/**
 * Interface describing the accumulated information of all members on a profile.
 *
 * @hidden
 */
interface ProfileCollectionValues {
	collectionQuantities: {
		[collectionName: string]: number;
	};
	unlockedCollTiers: Set<string>;
}

/**
 * Interface that describes a collection category, e.g. "Farming"
 */
export interface SkyBlockProfileCollectionGroup {
	/**
	 * The children of this collection group.
	 */
	children: SkyBlockProfileCollection[];
	/**
	 * The ID of the group, e.g. "FARMING"
	 */
	id: string;
	/**
	 * Collection children that the profile has reached the maximum tier of.
	 */
	maxedChildCollections: number;
	/**
	 * The name of the group, e.g. "Farming"
	 */
	name: string;
	/**
	 * A number representing the percentage progress the profile is through this group, e.g. "100" or "83.33333333333334"
	 *
	 * @example
	 * ```typescript
	 * const progress = collections[0].progress;
	 * console.log(progress);
	 * // output:
	 * 83.33333333333334
	 *
	 * const percent = Math.round(progress * 100) / 100;
	 * console.log(percent);
	 * // output:
	 * 83.33
	 * ```
	 */
	progress: number;
	/**
	 * How many collections are in this collection group.
	 */
	totalCollections: number;
}

/**
 * Interface describing an individual collection.
 */
export interface SkyBlockProfileCollection {
	/**
	 * The amount of resources in this collection the profile has collected toward tiers.
	 *
	 * **Note:**
	 * If the profile is a coop and all players do not have their collection API enabled, this will only account for the amounts collected by members with their collection API enabled.
	 */
	amount: number;
	/**
	 * The ID of this collection, e.g. "LOG:2"
	 */
	id: string;
	/**
	 * The maximum tier of this collection.
	 */
	maxTier: number;
	/**
	 * The name of this collection, e.g. "Birch Wood"
	 */
	name: string;
	/**
	 * The next tier the profile can reach. If the profile has reached the max tier, this value is omitted.
	 */
	nextTier?: number;
	/**
	 * The amount required to reach the next collection tier. If the profile has reached the max tier, this value is omitted.
	 */
	nextTierAmountRequired?: number;
	/**
	 * The progress the profile is toward maxing this collection.
	 */
	progress: number;
	/**
	 * The tier the profile has reached.
	 */
	tier: number;
}

export type SkyBlockProfileCollections = SkyBlockProfileCollectionGroup[];

/**
 * This helper takes a profile and scans all of it's member's to get the most accurate collection information possible. Returns false is none of the members of the profile had their collections API enabled.
 *
 * @param profile The SkyBlock profile object you want to check.
 * @param collections The collections resource object.
 * @category Helper
 */
export function getSkyBlockProfileMemberCollections(
	profile: Pick<NonNullable<Components.Schemas.SkyBlockProfile>, 'members'>,
	collections: Components.Schemas.SkyBlockResourcesParentCollections,
): SkyBlockProfileCollections | false {
	const profileCollectionValues = Object.values(profile.members).reduce<ProfileCollectionValues>(
		(acc, member) => {
			if (member.player_data?.unlocked_coll_tiers) {
				for (const uTier of member.player_data.unlocked_coll_tiers) {
					acc.unlockedCollTiers.add(uTier);
				}
			}

			if (member.collection) {
				for (const [key, quantity] of Object.entries(member.collection)) {
					if (!acc.collectionQuantities[key]) acc.collectionQuantities[key] = 0;
					acc.collectionQuantities[key] += quantity ?? 0;
				}
			}

			return acc;
		},
		{
			unlockedCollTiers: new Set(),
			collectionQuantities: {},
		},
	);
	if (profileCollectionValues.unlockedCollTiers.size === 0) {
		return false;
	}

	return Object.entries(collections).reduce<SkyBlockProfileCollections>((acc, [collectionGroupId, collectionGroup]) => {
		const group: SkyBlockProfileCollectionGroup = {
			id: collectionGroupId,
			name: collectionGroup.name,
			progress: 0,
			maxedChildCollections: 0,
			totalCollections: 0,
			children: [],
		};
		for (const [collectionId, collection] of Object.entries(collectionGroup.items)) {
			group.totalCollections += 1;
			const child: SkyBlockProfileCollection = {
				id: collectionId,
				name: collection.name,
				tier: collection.tiers.reduce((tier, tierInfo) => {
					if (
						profileCollectionValues.unlockedCollTiers.has(`${collectionId}_${tierInfo.tier}`) ||
						(profileCollectionValues.collectionQuantities[collectionId] ?? 0) > (tierInfo.amountRequired ?? 0)
					) {
						// eslint-disable-next-line no-param-reassign
						tier = tierInfo.tier as number;
					}

					return tier;
				}, 0),
				nextTier: 0,
				maxTier: collection.maxTiers,
				amount: profileCollectionValues.collectionQuantities[collectionId] ?? 0,
				nextTierAmountRequired: 0,
				progress: 0,
			};
			if (child.tier === child.maxTier) {
				delete child.nextTier;
				delete child.nextTierAmountRequired;
				group.maxedChildCollections += 1;
				child.progress = 100;
			} else {
				child.nextTier = child.tier + 1;
				child.nextTierAmountRequired =
					/* istanbul ignore next */
					collection.tiers.find((tInfo) => tInfo.tier === child.nextTier)?.amountRequired ?? 0;
				child.progress =
					((profileCollectionValues.collectionQuantities[collectionId] || 0) / child.nextTierAmountRequired) * 100;
			}

			group.children.push(child);
		}

		group.progress = (group.maxedChildCollections / group.totalCollections) * 100;
		acc.push(group);
		return acc;
	}, []);
}
