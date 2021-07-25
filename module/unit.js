import Actor5e from '../../../systems/dnd5e/module/actor/entity.js';
import {d20Roll} from '../../../systems/dnd5e/module/dice.js';

const attributeLabels = {
	attack: 'KW_WARFARE.Attack',
	power: 'KW_WARFARE.Power',
	morale: 'KW_WARFARE.Morale'
};

export default function extendActor () {
	Actor5e.prototype.prepareDerivedData = (function () {
		const original = Actor5e.prototype.prepareDerivedData;
		return function () {
			original.apply(this, arguments);
			const stats = this.getFlag('kw_warfare', 'stats');
			if (!stats) {
				return;
			}

			if (!stats.casualties) {
				stats.casualties = {taken: 0, max: 0};
			}

			if (typeof stats.size === 'string' && stats.size !== '') {
				const die = Number(stats.size.split('d')[1]);
				if (!isNaN(die)) {
					stats.casualties.max = die;
				}
			}

			stats.casualties.remaining = stats.casualties.max - stats.casualties.taken;
			if (stats.casualties.remaining < 0) {
				stats.casualties.remaining = 0;
			}

			stats.casualties.diminished = stats.casualties.remaining <= stats.casualties.max / 2;
		}
	})();

	Actor5e.prototype.rollUnitAttribute = function (attr, options = {}) {
		const stats = this.getFlag('kw_warfare', 'stats');
		if (!stats) {
			return;
		}

		const parts = ['@mod'];
		const data = {mod: stats[attr]};
		const rollData = mergeObject(options, {
			parts: parts,
			data: data,
			title: game.i18n.localize(attributeLabels[attr]),
			messageData: {
				speaker: ChatMessage.getSpeaker({actor: this})
			}
		});

		return d20Roll(rollData);
	};
};
