import ActorSheet5e from '../../../systems/dnd5e/module/actor/sheets/base.js';
import {KW_ANCESTRY, KW_EQUIPMENT, KW_EXPERIENCE, KW_TYPE} from "./KW_WarfareUnitActor.js";

export const DEFAULT_UNIT_DATA = {
	type: null,
	ancestry: null,
	equipment: null,
	experience: null,
	commander: null,
	tier: null,
	damage: null,
	numberOfAttacks: null,
	stats: {
		attack: {
			value: null,
			bonus: 0,
			advantage: 0,
			disadvantage: 0
		},
		defense: {
			value: null,
			bonus: 0
		},
		morale: {
			value: null,
			bonus: 0
		},
		power: {
			value: null,
			bonus: 0,
			advantage: 0,
			disadvantage: 0
		},
		toughness: {
			value: null,
			bonus: 0
		}
	},
	special: {
		diminishable: 1
	}
};

export default class KW_WarfareUnitSheet extends ActorSheet5e {

	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ['kw-warfare', 'kw-warfare-unit'],
			scrollY: ['form'],
			width: 615,
			height: 470
		});
	}

	get template() {
		return 'modules/kw-warfare/templates/unit-card.hbs';
	}

	activateListeners(html) {
		super.activateListeners(html);

		html.click(this._onWindowClick.bind(this));
		if (this.isEditable) {
			html.find('.kw-warfare-unit-config').click(this._onConfigClicked.bind(this));
			html.find('.kw-warfare-config-add-item').click(this._onAddItem.bind(this));
			html.find('.kw-warfare-config-rm-item').click(this._onRemoveItem.bind(this));
			html.find('.kw-warfare-config-edit-item').click(this._onEditItem.bind(this));
			html.find('.kw-warfare-unit-casualties-pip').click(this._onCasualtyClicked.bind(this));
			html.find('[data-kw-roll]').click(this._onRollAttribute.bind(this));
		}

		html.find('.kw-warfare-trait-name').click(this._onTraitNameClicked.bind(this));
		html.find('.kw-warfare-trait-info-button').click(this._onShowTraitInfo.bind(this));
	}

	getData() {
		const data = super.getData();
		data.unit = duplicate(this.actor.getFlag('kw-warfare', 'unit') || DEFAULT_UNIT_DATA);

		data.unit.traits = [];

		for (const item of data.items) {
			const requirements = item.data.requirements;
			if (requirements) {
				if (requirements === KW_ANCESTRY) {
					data.unit.ancestry = item.name;
					data.unit.ancestry_icon = item.img;
					continue;
				} else if (requirements === KW_EXPERIENCE) {
					data.unit.experience = item.name;
					continue;
				} else if (requirements === KW_EQUIPMENT) {
					data.unit.equipment = item.name;
					continue;
				} else if (requirements === KW_TYPE) {
					data.unit.type = item.name;
					data.unit.type_icon = item.img;
					continue;
				}
			}
			data.unit.traits.push({
				id: item._id,
				name: item.name,
				activation: item.data?.activation?.type || 'none',
				description: {
					expanded: this._traitIsExpanded(item),
					enriched: TextEditor.enrichHTML(item.data?.description?.value, {
						secrets: data.owner,
						documents: true,
						links: true,
						rolls: true,
						rollData: this.actor.getRollData()
					})
				}
			});
		}

		data.unit.type_icon = this._getDefaultImg(data.unit.type_icon);
		data.unit.ancestry_icon = this._getDefaultImg(data.unit.ancestry_icon);

		const hp = data.data.attributes.hp;

		data.unit.casualties = this._formatCasualties(hp);

		if (data.unit.special.diminishable === "0") {
			data.unit.diminished = false;
		} else {
			data.unit.diminished = (hp.max / 2) >= (hp.value + hp.temp);
		}

		data.sheet = mergeObject({
			isGM: game.users.current.isGM,
		}, this.actor.getFlag('kw-warfare', 'sheet'));
		data.midiQolEnabled = game.modules.get("midi-qol")?.active;

		return data;
	}

	_traitIsExpanded(trait) {
		return !!trait.flags['kw-warfare']?.kw_trait_expanded?.[game.user.id] ||
			!!game.user.getFlag('kw-warfare', `kw_trait_expanded.${trait._id}`);
	}

	_getDefaultImg(img) {
		if (!img || img === 'icons/svg/item-bag.svg') {
			return '/modules/kw-warfare/blank.png';
		}
		return img;
	}

	_formatCasualties(hp) {
		let display = '';
		for (let i = 1; i <= hp.max; i++) {
			const classes = ['kw-warfare-unit-casualties-pip'];
			if (i <= hp.value) {
				classes.push('kw-warfare-unit-casualties-pip-full');
			} else {
				classes.push('kw-warfare-unit-casualties-pip-empty');
			}

			display += `<div class="${classes.join(' ')}" data-n="${i}"><span></span></div>`;
		}
		for (let j = 1; j <= hp.temp; j++) {
			const classes = [
				'kw-warfare-unit-casualties-pip',
				'kw-warfare-unit-casualties-pip-full',
				'kw-warfare-unit-casualties-pip-temp'
			];
			display += `<div class="${classes.join(' ')}" data-n="${hp.max + j}"><span></span></div>`;
		}

		return display;
	}

	_onAddItem(evt) {
		const dataset = evt.currentTarget.dataset;
		const data = {
			activation: {
				cost: dataset.cost ? Number(dataset.cost) : null,
				type: dataset.type || ""
			}
		};

		this.actor.createEmbeddedDocuments('Item', [{
			type: 'feat',
			name: game.i18n.localize('KW_WARFARE.NewTrait'),
			data: data
		}], {renderSheet: true});
	}

	_onEditItem(evt) {
		const item = this.actor.items.get(evt.currentTarget.closest('.kw-warfare-unit-trait').dataset.itemId);
		item.sheet.render(true);
	}

	_onRemoveItem(evt) {
		const target = evt.currentTarget;
		if (!target.classList.contains('kw-warfare-alert')) {
			target.classList.add('kw-warfare-alert');
			return;
		}

		const parent = target.closest('.kw-warfare-unit-trait');

		let itemId = parent.dataset.itemId;

		if (itemId && this.actor.items.get(itemId)) {
			this.actor.deleteEmbeddedDocuments('Item', [itemId]);
		}
	}

	async _onTraitNameClicked(evt) {
		const item = this.actor.items.get(evt.currentTarget.closest('.kw-warfare-unit-trait').dataset.itemId);
		if (item.testUserPermission(game.user, 3)) {
			const isExpanded = !!item.getFlag('kw-warfare', `kw_trait_expanded.${game.user.id}`);
			item.setFlag('kw-warfare', `kw_trait_expanded.${game.user.id}`, !isExpanded);
		} else if (item.testUserPermission(game.user, 2)) {
			const isExpanded = !!game.user.getFlag('kw-warfare', `kw_trait_expanded.${item.id}`);
			await game.user.setFlag('kw-warfare', `kw_trait_expanded.${item.id}`, !isExpanded);
			this.render();
		}
	}

	_onCasualtyClicked(evt) {
		const hp = this.actor.data.data.attributes.hp;

		if (evt.currentTarget.classList.contains('kw-warfare-unit-casualties-pip-temp')) {
			this._decrementTempHp(hp.temp);
			return;
		}

		const n = Number(evt.currentTarget.dataset.n);
		let hpValue = hp.value;

		if (n > hpValue) {
			hpValue++;
		} else if (hp.temp > 0) {
			this._decrementTempHp(hp.temp);
			return;
		} else {
			hpValue--;
		}

		this.actor.update({"data.attributes.hp.value": hpValue});
	}

	_decrementTempHp(currentValue) {
		let tempValue = currentValue;
		tempValue--;

		this.actor.update({"data.attributes.hp.temp": tempValue});
	}

	_onChangeInputDelta() {
		//
	}

	_onConfigClicked() {
		const currentStatus = !!this.actor.getFlag('kw-warfare', 'sheet.config');
		this.actor.setFlag('kw-warfare', 'sheet.config', !currentStatus);
	}

	_onRollAttribute(evt) {
		this.actor.rollKWUnitAttribute(evt.currentTarget.dataset['kwRoll'], {event: evt});
	}

	_onShowTraitInfo(evt) {
		if (!game.modules.get("midi-qol")?.active) {
			return;
		}
		const trait = this.actor.items.get(evt.currentTarget.closest('.kw-warfare-unit-trait').dataset.itemId);
		window.MidiQOL.showItemInfo.bind(trait)();
	}

	_onWindowClick(evt) {
		const rmItem = evt.target.closest('.kw-warfare-config-rm-item');

		if (!rmItem) {
			$('.kw-warfare-config-rm-item.kw-warfare-alert').removeClass('kw-warfare-alert');
		}
	}

	_prepareItems() {
		//
	}

}

export function setKWWarfareUnitDefaults(actor) {
	const existingWarfareUnitValues = actor.getFlag('kw-warfare', 'unit') || {};
	const mergedWarfareUnitValues = mergeObject(existingWarfareUnitValues, DEFAULT_UNIT_DATA);

	actor.setFlag('kw-warfare', 'unit', mergedWarfareUnitValues);
}
