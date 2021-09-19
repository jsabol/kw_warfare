import KW_WarfareUnitSheet, {setKWWarfareUnitDefaults} from './KW_WarfareUnitSheet.js';
import extendActor, {cleanDetailTraitsOnUpdate, dropActor, dropTrait} from './KW_WarfareUnitActor.js';
import {migrate} from "./warfare-migration.js";

Hooks.once('init', () => {
	registerTemplate('kw-trait', 'modules/kw-warfare/templates/trait.hbs');
	registerTemplate('kw-stat', 'modules/kw-warfare/templates/stat.hbs');
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
		dropTrait.call(actor, itemInfo);
	} else if (itemInfo.type === 'Actor') {
		dropActor.call(actor, itemInfo, sheet);
		return false;
	}

});

Hooks.on('preUpdateActor', (actor, updatedFlags) => {
	if (!updatedFlags || !actor.sheet) {
		return;
	}

	const settingAsKWUnit = updatedFlags.flags?.core?.sheetClass === 'dnd5e.KW_WarfareUnitSheet';

	const isMigration = actor.sheet.constructor.name === 'WarfareUnitSheet'
		&& settingAsKWUnit
		&& !actor.data.flags['kw-warfare'] && actor.data.flags.warfare;

	if (settingAsKWUnit) {
		setKWWarfareUnitDefaults(actor);
	}

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
	if (updatedFlags.flags && updatedFlags.flags['kw-warfare']?.unit) {
		cleanDetailTraitsOnUpdate(updatedFlags.flags['kw-warfare'].unit, actor);
	}
});


Handlebars.registerHelper('kw-number-format', function (n, options) {
	if (n == null) {
		return '';
	}

	const places = options.hash.decimals || 0;
	const sign = !!options.hash.sign;
	n = parseFloat(n).toFixed(places);
	return sign && n >= 0 ? '+' + n : n;
});

const CHAT_PORTRAIT_ICON_MAP = [
	{name:"KW_WARFARE.Power", icon: "systems/dnd5e/icons/skills/yellow_08.jpg"},
	{name:"KW_WARFARE.Attack", icon: "systems/dnd5e/icons/skills/red_31.jpg"},
	{name:"KW_WARFARE.Morale", icon: "systems/dnd5e/icons/skills/yellow_17.jpg"},
	{name:"KW_WARFARE.Command", icon: "systems/dnd5e/icons/skills/ice_16.jpg"}
];

//Optional support for the Chat-Portrait module
Hooks.on('ChatPortraitReplaceData', (chatPortraitCustomData, chatMessage) => {
	if (chatMessage) {
		const speaker = ChatMessage.getSpeakerActor(chatMessage.data.speaker);
		if ('KW_WarfareUnitSheet' === speaker?.sheet?.constructor.name) {
			chatPortraitCustomData.customImageReplacerData = CHAT_PORTRAIT_ICON_MAP;
		}
	}
	return chatPortraitCustomData;
});

/**
 * Modified from foundry.js to accept a partial name.
 * Get a template from the server by fetch request and caching the retrieved result
 * @param {string} templateName           A name for the template
 * @param {string} path           The web-accessible HTML template URL
 * @returns {Promise<Function>}	  A Promise which resolves to the compiled Handlebars template
 */
async function registerTemplate(templateName, path) {
	if (!_templateCache.hasOwnProperty(templateName)) {
		await new Promise((resolve, reject) => {
			game.socket.emit('template', path, resp => {
				if (resp.error) return reject(new Error(resp.error));
				const compiled = Handlebars.compile(resp.html);
				Handlebars.registerPartial(templateName, compiled);
				_templateCache[templateName] = compiled;
				console.log(`K&W Warfare | Retrieved and compiled template with name ${templateName}:${path}`);
				resolve(compiled);
			});
		});
	}
	return _templateCache[templateName];
};
