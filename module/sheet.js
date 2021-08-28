import ActorSheet5e from '../../../systems/dnd5e/module/actor/sheets/base.js';

export const KW_ANCESTRY = 'Ancestry';
export const KW_EXPERIENCE = 'Experience';
export const KW_EQUIPMENT = 'Equipment';
export const KW_TYPE = 'Type';

export default class KW_WarfareUnitSheet extends ActorSheet5e {

	static get defaultOptions () {
		return mergeObject(super.defaultOptions, {
			classes: ['kw-warfare', 'kw-warfare-unit'],
			scrollY: ['form'],
			width: 615,
			height: 440
		});
	}

	get template () {
		return 'modules/kw-warfare/templates/unit-card.html';
	}

	activateListeners (html) {
		super.activateListeners(html);
		if (!this.isEditable) {
			return;
		}

		html.find('.kw-warfare-unit-config').click(this._onConfigClicked.bind(this));
		html.find('.kw-warfare-config-add-item').click(this._onAddItem.bind(this));
		html.find('.kw-warfare-config-rm-item').click(this._onRemoveItem.bind(this));
		html.find('.kw-warfare-trait-name').click(this._onTraitNameClicked.bind(this));
		html.find('.kw-warfare-config-edit-item').click(this._onEditItem.bind(this));
		html.find('.kw-warfare-unit-casualties-pip').click(this._onCasualtyClicked.bind(this));
		html.find('.kw-warfare-trait-info-button').click(this._onShowTraitInfo.bind(this));
		html.find('[data-kw-roll]').click(this._onRollAttribute.bind(this));
	}

	getData () {
		const data = super.getData();
		data.kw_warfare = duplicate(this.actor.data.flags['kw-warfare'] || { sheet: { config: false } });
		data.kw_warfare.details = data.kw_warfare.details || {};
		data.kw_warfare.stats = data.kw_warfare.stats || {};
		data.kw_warfare.bonus = data.kw_warfare.bonus || {};
		data.kw_warfare.advantage = data.kw_warfare.advantage || {};
		data.kw_warfare.special = data.kw_warfare.special || {};
		data.kw_traits = [];

		for (const item of data.items) {
			const requirements = item.data.requirements;
			if(requirements) {
				if(requirements === KW_ANCESTRY) {
					data.kw_warfare.details.ancestry = item.name;
					data.kw_warfare.kw_ancestry_icon = item.img;
					continue;
				} else if (requirements === KW_EXPERIENCE) {
					data.kw_warfare.details.experience = item.name;
					continue;
				} else if (requirements === KW_EQUIPMENT) {
					data.kw_warfare.details.equipment = item.name;
					continue;
				} else if (requirements === KW_TYPE) {
					data.kw_warfare.details.type = item.name;
					data.kw_warfare.kw_type_icon = item.img;
					continue;
				}
			}
			data.kw_traits.push({
				id: item._id,
				name: item.name,
				description: {
					expanded: item.flags['kw-warfare'].kw_trait_expanded,
					enriched: TextEditor.enrichHTML(item.data.description.value, {
						secrets: data.owner,
						entities: true,
						links: true,
						rolls: true,
						rollData: this.actor.getRollData()
					})
				}
			});
		}

		data.kw_warfare.kw_type_icon = this._getDefaultImg(data.kw_warfare.kw_type_icon);
		data.kw_warfare.kw_ancestry_icon = this._getDefaultImg(data.kw_warfare.kw_ancestry_icon);

		const hp = data.data.attributes.hp;

		data.kw_warfare.kw_casualties = this._formatCasualties(hp);

		if(data.kw_warfare.special.diminishable !== "0") {
			data.kw_warfare.diminished = (hp.max / 2) >= (hp.value + hp.temp);
		} else {
			data.kw_warfare.diminished = false;
		}

		data.midiQolEnabled = game.modules.get("midi-qol")?.active;

		return data;
	}

	_getDefaultImg(img) {
		if(!img || img === 'icons/svg/item-bag.svg') {
			return '/modules/kw-warfare/blank.png';
		}
		return img;
	}

	_formatCasualties (hp) {
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
		for(let j = 1; j <= hp.temp; j++) {
			const classes = [
				'kw-warfare-unit-casualties-pip',
				'kw-warfare-unit-casualties-pip-full',
				'kw-warfare-unit-casualties-pip-temp'
			];
			display += `<div class="${classes.join(' ')}" data-n="${hp.max+j}"><span></span></div>`;
		}

		return display;
	}

	_onAddItem (evt) {
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

	_onEditItem (evt) {
		const item = this.actor.items.get(evt.currentTarget.parentElement.parentElement.dataset.itemId);
		item.sheet.render(true);
	}

	_onRemoveItem (evt) {
		const target = evt.currentTarget;
		if (!target.classList.contains('kw-warfare-alert')) {
			target.classList.add('kw-warfare-alert');
			return;
		}

		const parent = target.parentElement;

		let itemId = parent.dataset.itemId || parent.parentElement.dataset.itemId;

		if(itemId && this.actor.items.get(itemId)) {
			this.actor.deleteEmbeddedDocuments('Item', [itemId]);
		}
	}

	_onTraitNameClicked (evt) {
		const item = this.actor.items.get(evt.currentTarget.parentElement.dataset.itemId);
		const isExpanded = !!item.getFlag('kw-warfare', 'kw_trait_expanded');
		item.setFlag('kw-warfare', 'kw_trait_expanded', !isExpanded);
	}

	_onCasualtyClicked (evt) {
		const hp = this.actor.data.data.attributes.hp;

		if(evt.currentTarget.classList.contains('kw-warfare-unit-casualties-pip-temp')) {
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

	_onChangeInputDelta () {
		// Disable this entirely as this behaviour is counter-intuitive for
		// this sheet.
	}

	_onConfigClicked () {
		const currentStatus = !!this.actor.getFlag('kw-warfare', 'sheet.config');
		this.actor.setFlag('kw-warfare', 'sheet.config', !currentStatus);
	}

	_onRollAttribute (evt) {
		this.actor.rollKWUnitAttribute(evt.currentTarget.dataset['kwRoll'], {event: evt});
	}

	_onShowTraitInfo(evt) {
		if(!game.modules.get("midi-qol")?.active) {
			return;
		}
		const trait = this.actor.items.get(evt.currentTarget.closest('.kw-warfare-unit-trait').dataset.itemId);
		window.MidiQOL.showItemInfo.bind(trait)();
	}

	_prepareItems () {

	}
}
