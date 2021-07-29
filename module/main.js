import KW_WarfareUnitSheet, {KW_ANCESTRY, KW_EQUIPMENT, KW_EXPERIENCE, KW_TYPE} from './sheet.js';
import extendActor from './unit.js';

Hooks.on('init', () => {
	loadTemplates(['modules/kw_warfare/templates/trait.hbs']);
	Actors.registerSheet('dnd5e', KW_WarfareUnitSheet, {
		types: ['npc'],
		makeDefault: false,
		label: 'KW_WARFARE.Sheet'
	});
	extendActor();
});

Hooks.on("dropActorSheetData", (actor, sheet, itemInfo) => {
	if(KW_WarfareUnitSheet.name !== sheet.constructor.name) {
		return;
	}
	//overwrite existing experience/ancestry/equipment/type if already exist
	//delete old trait. clear out text value.

	const item = game.items.get(itemInfo.id);
	if(!item) { return; }

	const requirements = item.data.data.requirements;
	if(!requirements) { return; }
	if(requirements === KW_ANCESTRY) {
		cleanDetails(actor, 'ancestry', KW_ANCESTRY);
	} else if(requirements === KW_EQUIPMENT) {
		cleanDetails(actor, 'equipment', KW_EQUIPMENT);
	} else if (requirements === KW_EXPERIENCE) {
		cleanDetails(actor, 'experience', KW_EXPERIENCE);
	} else if (requirements === KW_TYPE) {
		cleanDetails(actor, 'type', KW_TYPE);
	}
});

Hooks.on('updateActor', (actor, updatedFlags) => {
	if(!updatedFlags.flags || !updatedFlags.flags.kw_warfare || !updatedFlags.flags.kw_warfare.details) {
		return;
	}

	//if manually entering an experience/ancestry/equipment/type
	//delete old trait if exists

	const updatedDetails = updatedFlags.flags.kw_warfare.details;
	if(Object.keys(updatedDetails).length !== 1) {
		return;
	}
	const updatedKey = Object.keys(updatedDetails)[0];
	if(updatedKey === 'ancestry') {
		cleanDetails(actor, 'ancestry', KW_ANCESTRY, false);
	} else if(updatedKey === 'equipment') {
		cleanDetails(actor, 'equipment', KW_EQUIPMENT, false);
	} else if (updatedKey === 'experience') {
		cleanDetails(actor, 'experience', KW_EXPERIENCE, false);
	} else if (updatedKey === 'type') {
		cleanDetails(actor, 'type', KW_TYPE, false);
	}
});


function cleanDetails(actor, detailName, detailType, cleanFlag = true) {
	if(cleanFlag) {
		actor.setFlag('kw_warfare', 'details.' + detailName, '');
	}
	const existingTrait = actor.items.find((i) => { return i.data.data.requirements === detailType; })
	if(existingTrait) {
		actor.items.delete(existingTrait.id)
	}
}

Handlebars.registerHelper('number-format', function (n, options) {
	if (n == null) {
		return '';
	}

	const places = options.hash.decimals || 0;
	const sign = !!options.hash.sign;
	n = parseFloat(n).toFixed(places);
	return sign && n >= 0 ? '+' + n : n;
});

Handlebars.registerHelper('or', function (...args) {
	args.pop();
	return args.reduce((acc, x) => acc || !!x);
});

function setTheme (theme) {
	const head = document.getElementsByTagName('head')[0];
	if (theme === 'dark') {
		const link = document.createElement('link');
		link.type = 'text/css';
		link.rel = 'stylesheet';
		link.href = 'modules/kw_warfare/styles/dark.css';
		link.id = 'kw-warfare-dark-sheet';
		head.appendChild(link);
	} else {
		const sheet = document.getElementById('kw-warfare-dark-sheet');
		if (sheet) {
			sheet.remove();
		}
	}
}

document.addEventListener('click', evt => {
	const target = evt.target;
	const parent = evt.target.parentElement;

	if (!target.classList.contains('kw-warfare-config-rm-item')
		&& !parent?.classList.contains('kw-warfare-config-rm-item'))
	{
		$('.kw-warfare-config-rm-item.kw-warfare-alert').removeClass('kw-warfare-alert');
	}
});
