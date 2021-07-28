import Actor5e from '../../../systems/dnd5e/module/actor/entity.js';
import {d20Roll} from '../../../systems/dnd5e/module/dice.js';

const attributeLabels = {
	"attack": "KW_WARFARE.Attack",
	"power": "KW_WARFARE.Power",
	"morale": "KW_WARFARE.Morale",
	"command": "KW_WARFARE.Command"
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

			if(stats.size === '') {
				stats.casualties.max = 4;
				stats.size = 4;
			} else if (typeof stats.size === 'number') {
				stats.casualties.max = stats.size;
			}

			stats.casualties.remaining = stats.casualties.max - stats.casualties.taken;
			if (stats.casualties.remaining < 0) {
				stats.casualties.remaining = 0;
			}

			stats.casualties.diminished = stats.casualties.remaining <= stats.casualties.max / 2;

			this.data.data.attributes.hp = {
				formula: "" + stats.size,
				min: 0,
				max: stats.size,
				value: stats.casualties.remaining,
				temp: 0,
				tempmax: 0
			}

		}
	})();

	Actor5e.prototype.rollUnitAttribute = function (attr, options = {}) {
		//TODO: include roll attribute icon in roll data
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
