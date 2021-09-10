import {DEFAULT_UNIT_DATA} from "./KW_WarfareUnitSheet.js";

export function migrate(updatedFlags, actor) {
	const warfareStats = actor.data.flags.warfare;
	const kwWarfareStats = DEFAULT_UNIT_DATA;

	kwWarfareStats.type = warfareStats.details.type;
	kwWarfareStats.ancestry = warfareStats.details.ancestry;
	kwWarfareStats.equipment = warfareStats.details.equipment;
	kwWarfareStats.experience = warfareStats.details.experience;
	kwWarfareStats.commander = warfareStats.details.commander;

	kwWarfareStats.stats.attack.value= warfareStats.stats.attack;
	kwWarfareStats.stats.defense.value = warfareStats.stats.defense;
	kwWarfareStats.stats.morale.value = warfareStats.stats.morale;
	kwWarfareStats.stats.power.value = warfareStats.stats.power;
	kwWarfareStats.stats.toughness.value = warfareStats.stats.toughness;

	updatedFlags.flags['kw-warfare'] = { unit: kwWarfareStats };

	if (!updatedFlags.data) {
		updatedFlags.data = {};
	}
	if (!updatedFlags.data.attributes) {
		updatedFlags.data.attributes = {};
	}
	if (warfareStats.stats.casualties) {
		updatedFlags.data.attributes.hp = {
			max: warfareStats.stats.casualties.max,
			value: warfareStats.stats.casualties.remaining
		};
	}
	updatedFlags.flags.warfare = {
		stats: null,
		details: null,
		sheet: null
	};
}
