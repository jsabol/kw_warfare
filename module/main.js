import KW_WarfareUnitSheet from './sheet.js';
import extendActor from './unit.js';

Hooks.on('init', () => {
	Actors.registerSheet('dnd5e', KW_WarfareUnitSheet, {
		types: ['npc'],
		makeDefault: false,
		label: 'KW_WARFARE.Sheet'
	});
	extendActor();
});

// Hooks.on('setup', () => {
// 	CONFIG.DND5E.abilityActivationTypes.order = game.i18n.localize('KW_WARFARE.Order');
// });

Hooks.on('ready', () => {
	game.settings.register('kw_warfare', 'theme', {
		name: 'KW_WARFARE.Theme',
		scope: 'user',
		config: true,
		default: 'light',
		type: String,
		onChange: setTheme,
		choices: {
			'light': 'KW_WARFARE.Light',
			'dark': 'KW_WARFARE.Dark'
		}
	});

	setTheme(game.settings.get('kw_warfare', 'theme'));
});

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
