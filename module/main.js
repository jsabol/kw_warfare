import KW_WarfareUnitSheet, {KW_ANCESTRY, KW_EQUIPMENT, KW_EXPERIENCE, KW_TYPE} from './sheet.js';
import extendActor from './unit.js';

const OWNER = CONST.ENTITY_PERMISSIONS.OWNER;

Hooks.once('init', () => {
	loadTemplates(['modules/kw-warfare/templates/trait.hbs']);
	Actors.registerSheet('dnd5e', KW_WarfareUnitSheet, {
		types: ['npc'],
		makeDefault: false,
		label: 'KW_WARFARE.Sheet'
	});
	extendActor();
});

Hooks.on("dropActorSheetData", (actor, sheet, itemInfo) => {
	if (KW_WarfareUnitSheet.name !== sheet.constructor.name) {
		return;
	}

	if (itemInfo.type === 'Item') {
		dropTrait(itemInfo, actor);
	} else if (itemInfo.type === 'Actor') {
		dropActor(itemInfo, actor, sheet);
		return false;
	}

});

function dropTrait(itemInfo, kwWarfareUnit) {
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
		kwWarfareUnit.setFlag('kw-warfare', 'details.ancestry', item.name);
		cleanDetails(kwWarfareUnit, 'ancestry', KW_ANCESTRY);
	} else if (requirements === KW_EQUIPMENT) {
		kwWarfareUnit.setFlag('kw-warfare', 'details.equipment', item.name);
		cleanDetails(kwWarfareUnit, 'equipment', KW_EQUIPMENT);
	} else if (requirements === KW_EXPERIENCE) {
		kwWarfareUnit.setFlag('kw-warfare', 'details.experience', item.name);
		cleanDetails(kwWarfareUnit, 'experience', KW_EXPERIENCE);
	} else if (requirements === KW_TYPE) {
		kwWarfareUnit.setFlag('kw-warfare', 'details.type', item.name);
		cleanDetails(kwWarfareUnit, 'type', KW_TYPE);
	}
}

function dropActor(itemInfo, kwWarfareUnit, kwWarfareSheet) {
	//set commander
	const droppedActor = game.actors.get(itemInfo.id);
	if (!droppedActor || droppedActor.sheet.constructor.name === 'KW_WarfareUnitSheet') {
		return;
	}

	kwWarfareUnit.setFlag('kw-warfare', 'details.commander', droppedActor.data.name);

	//Only set permissions when dragging PCs.
	if (droppedActor.type !== 'character') {
		return;
	}

	const existingPermissions = kwWarfareUnit.data.permission;
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

	kwWarfareUnit.update({permission: updatedPermissions});

	//set unit disposition to friendly if a pc is dropped
	kwWarfareSheet.token.update({disposition: 1});
}

Hooks.on('preUpdateActor', (actor, updatedFlags) => {
	if (!updatedFlags || !actor.sheet) {
		return;
	}

	const isMigration = actor.sheet.constructor.name === 'WarfareUnitSheet'
		&& updatedFlags.flags?.core?.sheetClass === 'dnd5e.KW_WarfareUnitSheet'
		&& !actor.data.flags['kw-warfare'] && actor.data.flags.warfare;

	if (isMigration) {
		migrate(updatedFlags, actor);
	} else if (actor.sheet.constructor.name !== 'KW_WarfareUnitSheet') {
		return;
	}

	//If updating the max-hp, reduce current hp to that max if greater than the new max
	if (updatedFlags.data?.attributes?.hp?.max) {
		const newMax = updatedFlags.data.attributes.hp.max;
		const currentHp = actor.data.data.attributes.hp.value;
		if (currentHp > newMax) {
			updatedFlags.data.attributes.hp.value = newMax;
		}
	}

	//if manually entering an experience/ancestry/equipment/type delete old trait if exists
	if (updatedFlags.flags && updatedFlags.flags['kw-warfare']?.details) {
		cleanDetailTraitsOnUpdate(updatedFlags.flags['kw-warfare'].details, actor);
	}
});

function migrate(updatedFlags, actor) {
	const warfareStats = actor.data.flags.warfare;
	const kwWarfareStats = {}

	kwWarfareStats.details = warfareStats.details;
	kwWarfareStats.stats = {
		attack: warfareStats.stats.attack,
		defense: warfareStats.stats.defense,
		morale: warfareStats.stats.morale,
		power: warfareStats.stats.power,
		toughness: warfareStats.stats.toughness
	};
	updatedFlags.flags['kw-warfare'] = kwWarfareStats;

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

function cleanDetailTraitsOnUpdate(updatedDetails, actor) {
	if (Object.keys(updatedDetails).length !== 1) {
		return;
	}
	const updatedKey = Object.keys(updatedDetails)[0];
	if (updatedKey === 'ancestry') {
		cleanDetails(actor, 'ancestry', KW_ANCESTRY);
	} else if (updatedKey === 'equipment') {
		cleanDetails(actor, 'equipment', KW_EQUIPMENT);
	} else if (updatedKey === 'experience') {
		cleanDetails(actor, 'experience', KW_EXPERIENCE);
	} else if (updatedKey === 'type') {
		cleanDetails(actor, 'type', KW_TYPE);
	}
}

function cleanDetails(actor, detailName, detailType) {
	const existingTrait = actor.items.find((i) => {
		return i.data.data.requirements === detailType;
	})
	if (existingTrait) {
		actor.items.delete(existingTrait.id)
	}
}

Handlebars.registerHelper('kw-number-format', function (n, options) {
	if (n == null) {
		return '';
	}

	const places = options.hash.decimals || 0;
	const sign = !!options.hash.sign;
	n = parseFloat(n).toFixed(places);
	return sign && n >= 0 ? '+' + n : n;
});

Handlebars.registerHelper('kw-or', function (...args) {
	args.pop();
	return args.reduce((acc, x) => acc || !!x);
});

document.addEventListener('click', evt => {
	const target = evt.target;
	const parent = evt.target.parentElement;

	if (!target.classList.contains('kw-warfare-config-rm-item')
		&& !parent?.classList.contains('kw-warfare-config-rm-item')) {
		$('.kw-warfare-config-rm-item.kw-warfare-alert').removeClass('kw-warfare-alert');
	}
});


const CHAT_PORTRAIT_ICON_MAP = {
	"KW_WARFARE.Power": "systems/dnd5e/icons/skills/yellow_08.jpg",
	"KW_WARFARE.Attack": "systems/dnd5e/icons/skills/red_31.jpg",
	"KW_WARFARE.Morale": "systems/dnd5e/icons/skills/yellow_17.jpg",
	"KW_WARFARE.Command": "systems/dnd5e/icons/skills/ice_16.jpg"
};

//Optional support for the Chat-Portrait module
Hooks.on('ChatPortraitReplaceData', (chatPortraitCustomData, chatMessage) => {
	if (chatMessage) {
		const speaker = ChatMessage.getSpeakerActor(chatMessage.data.speaker);
		if ('KW_WarfareUnitSheet' === speaker?.sheet?.constructor.name) {
			chatPortraitCustomData.customImageReplacer = CHAT_PORTRAIT_ICON_MAP;
		}
	}
	return chatPortraitCustomData;
});

Hooks.on('renderKW_WarfareUnitSheet', (sheet) => {
	let actor = sheet.actor;
	if(!actor.getFlag('kw-warfare', 'stats')) {
		actor.setFlag('kw-warfare', 'stats', {
			attack: null,
			defense: null,
			morale: null,
			power: null,
			toughness: null
		});
	}
	if(!actor.getFlag('kw-warfare', 'advantage')) {
		actor.setFlag('kw-warfare', 'advantage', {
			attack: 0,
			morale: 0,
			power: 0
		});
	}
	if(!actor.getFlag('kw-warfare', 'disadvantage')) {
		actor.setFlag('kw-warfare', 'disadvantage', {
			attack: 0,
			morale: 0,
			power: 0
		});
	}
	if(!actor.getFlag('kw-warfare', 'bonus')) {
		actor.setFlag('kw-warfare', 'bonus', {
			attack: 0,
			defense: 0,
			morale: 0,
			power: 0,
			toughness: 0
		});
	}
	if(!actor.getFlag('kw-warfare', 'special')) {
		actor.setFlag('kw-warfare', 'special', {
			diminishable: 1
		});
	}
});
