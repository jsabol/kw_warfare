import Actor5e from '../../../systems/dnd5e/module/actor/entity.js';
import {d20Roll} from '../../../systems/dnd5e/module/dice.js';

const OWNER = CONST.ENTITY_PERMISSIONS.OWNER;

export const KW_ANCESTRY = 'Ancestry';
export const KW_EXPERIENCE = 'Experience';
export const KW_EQUIPMENT = 'Equipment';
export const KW_TYPE = 'Type';

const ATTRIBUTE_TO_DISPLAY_MAP = {
	"attack": "KW_WARFARE.Attack",
	"power": "KW_WARFARE.Power",
	"morale": "KW_WARFARE.Morale",
	"command": "KW_WARFARE.Command"
};

export default function extendActor () {

	Actor5e.prototype.rollKWUnitAttribute = function (attr, options = {}) {
		const stat = this.getFlag('kw-warfare', `unit.stats.${attr}`);
		if (!stat) {
			return;
		}
		const {value, bonus, advantage, disadvantage } = stat;

		const parts = ['@mod'];
		const data = {
			mod: value,
		};

		if(bonus && bonus !== 0) {
			data.checkBonus = bonus;
			parts.push('@checkBonus');
		}

		const rollData = mergeObject(options, {
			parts: parts,
			data: data,
			title: game.i18n.localize(ATTRIBUTE_TO_DISPLAY_MAP[attr]),
			messageData: {
				speaker: ChatMessage.getSpeaker({actor: this})
			}
		});

		const adv = advantage && advantage > 0;
		const disadv = disadvantage && disadvantage > 0;

		if(adv !== disadv) {
			if(adv) {
				rollData.advantage = "1";
			} else {
				rollData.disadvantage = "1";
			}
		}

		return d20Roll(rollData);
	};
}


export function dropActor(itemInfo, kwWarfareSheet) {
	//set commander
	const droppedActor = game.actors.get(itemInfo.id);
	if (!droppedActor || droppedActor.sheet.constructor.name === 'KW_WarfareUnitSheet') {
		return;
	}

	this.setFlag('kw-warfare', 'unit.commander', droppedActor.data.name);

	//Only set permissions when dragging PCs.
	if (droppedActor.type !== 'character') {
		return;
	}

	const existingPermissions = this.data.permission;
	const updatedPermissions = {}

	//Remove other owners (not GMs, default or observers)
	Object.entries(existingPermissions)
		.map(e => {
			if (e[0] !== 'default' && !game.users.get(e[0])?.isGM && e[1] === OWNER) {
				return [e[0], CONST.ENTITY_PERMISSIONS.NONE];
			}
			return e;
		})
		.forEach(e => updatedPermissions[e[0]] = e[1]);

	//Add owner of the dropped actor as the owner of the warfare unit
	Object.entries(droppedActor.data.permission)
		.filter(e => e[0] !== 'default' && !game.users.get(e[0])?.isGM && e[1] === OWNER)
		.map(e => e[0])
		.forEach(id => {
			updatedPermissions[id] = OWNER;
		});

	this.update({permission: updatedPermissions});

	//set unit disposition to friendly if a pc is dropped
	kwWarfareSheet.token.update({disposition: 1});
}

export function dropTrait(itemInfo) {
	//overwrite existing experience/ancestry/equipment/type if already exist
	//delete old trait. clear out text value.
	const item = game.items.get(itemInfo.id);
	if (!item) {
		return;
	}

	const requirements = item.data.data.requirements;
	if (!requirements) {
		return;
	}

	if (requirements === KW_ANCESTRY) {
		this.setFlag('kw-warfare', 'unit.ancestry', item.name);
		_cleanDetails(this, 'ancestry', KW_ANCESTRY);
	} else if (requirements === KW_EQUIPMENT) {
		this.setFlag('kw-warfare', 'unit.equipment', item.name);
		_cleanDetails(this, 'equipment', KW_EQUIPMENT);
	} else if (requirements === KW_EXPERIENCE) {
		this.setFlag('kw-warfare', 'unit.experience', item.name);
		_cleanDetails(this, 'experience', KW_EXPERIENCE);
	} else if (requirements === KW_TYPE) {
		this.setFlag('kw-warfare', 'unit.type', item.name);
		_cleanDetails(this, 'type', KW_TYPE);
	}
}


export function cleanDetailTraitsOnUpdate(updatedDetails, actor) {
	if (Object.keys(updatedDetails).length !== 1) {
		return;
	}
	const updatedKey = Object.keys(updatedDetails)[0];
	const updatedValue = updatedDetails[updatedKey];
	if (updatedKey === 'ancestry') {
		_cleanDetails(actor, 'ancestry', KW_ANCESTRY, updatedValue);
	} else if (updatedKey === 'equipment') {
		_cleanDetails(actor, 'equipment', KW_EQUIPMENT, updatedValue);
	} else if (updatedKey === 'experience') {
		_cleanDetails(actor, 'experience', KW_EXPERIENCE, updatedValue);
	} else if (updatedKey === 'type') {
		_cleanDetails(actor, 'type', KW_TYPE, updatedValue);
	}
}

function _cleanDetails(actor, detailName, detailType, newValue = '0000') {
	const existingTrait = actor.items.find((i) => {
		return i.data.data.requirements === detailType && i.name !== newValue;
	})
	if (existingTrait) {
		actor.items.delete(existingTrait.id)
	}
}
