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
		return 'modules/kw_warfare/templates/unit-card.html';
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
		html.find('[data-roll]').click(this._onRollAttribute.bind(this));
	}

	getData () {
		const data = super.getData();
		data.kw_warfare = duplicate(this.actor.data.flags.kw_warfare || {});
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
			data.kw_traits.push(item);

			item.data.description.enriched = TextEditor.enrichHTML(item.data.description.value, {
				secrets: data.owner,
				entities: true,
				links: true,
				rolls: true,
				rollData: this.actor.getRollData()
			});
		}

		data.kw_warfare.kw_type_icon = this._getDefaultTypeImg(data.kw_warfare.kw_type_icon);
		data.kw_warfare.kw_ancestry_icon = this._getDefaultAncestryImg(data.kw_warfare.kw_ancestry_icon);

		const hp = data.data.attributes.hp;

		data.kw_warfare.kw_casualties = this._formatCasualties(hp);

		data.kw_warfare.diminished = (hp.max / 2) >= hp.value;

		return data;
	}

	_getDefaultAncestryImg(img) {
		if(!img || img === 'icons/svg/item-bag.svg') {
			return 'icons/environment/people/commoner.webp';
		}
		return img;
	}

	_getDefaultTypeImg(img) {
		if(!img || img === 'icons/svg/item-bag.svg') {
			return 'icons/weapons/swords/sword-simple-white.webp';
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
		const item = this.actor.items.get(evt.currentTarget.parentElement.dataset.itemId);
		item.sheet.render(true);
	}

	_onRemoveItem (evt) {
		const target = evt.currentTarget;
		if (!target.classList.contains('kw-warfare-alert')) {
			target.classList.add('kw-warfare-alert');
			return;
		}

		this.actor.deleteEmbeddedDocuments('Item', [target.parentElement.dataset.itemId]);
	}

	_onTraitNameClicked (evt) {
		const target = evt.currentTarget;
		const nextSibling = target.nextElementSibling;
		if(nextSibling && nextSibling.className.indexOf('kw-warfare-trait-description') >=0) {
			const currentDisplay = nextSibling.style.display;
			nextSibling.style.display = currentDisplay === 'none' ? 'block' : 'none';
		}
	}

	_onCasualtyClicked (evt) {
		const n = Number(evt.currentTarget.dataset.n);

		let hp = this.actor.data.data.attributes.hp.value;

		if (n > hp) {
			hp++;
		} else {
			hp--;
		}

		this.actor.update({ "data.attributes.hp.value": hp })
	}

	_onChangeInputDelta () {
		// Disable this entirely as this behaviour is counter-intuitive for
		// this sheet.
	}

	_onConfigClicked () {
		const currentStatus = !!this.actor.getFlag('kw_warfare', 'sheet.config');
		this.actor.setFlag('kw_warfare', 'sheet.config', !currentStatus);
	}

	_onRollAttribute (evt) {
		this.actor.rollUnitAttribute(evt.currentTarget.dataset.roll, {event: evt});
	}

	_prepareItems () {

	}
}
