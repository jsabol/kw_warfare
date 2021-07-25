import ActorSheet5e from '../../../systems/dnd5e/module/actor/sheets/base.js';

export default class KW_WarfareUnitSheet extends ActorSheet5e {
	static get defaultOptions () {
		return mergeObject(super.defaultOptions, {
			classes: ['kw-warfare', 'kw-warfare-unit'],
			scrollY: ['form'],
			width: 340,
			height: 415
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
		html.find('.kw-warfare-config-edit-item').click(this._onEditItem.bind(this));
		html.find('.kw-warfare-unit-casualties-pip').click(this._onCasualtyClicked.bind(this));
		html.find('[data-roll]').click(this._onRollAttribute.bind(this));
	}

	getData () {
		const data = super.getData();
		data.kw_warfare = duplicate(this.actor.data.flags.kw_warfare || {});
		data.kw_traits = [];

		for (const item of data.items) {
			data.kw_traits.push(item);

			item.data.description.enriched = TextEditor.enrichHTML(item.data.description.value, {
				secrets: data.owner,
				entities: true,
				links: true,
				rolls: true,
				rollData: this.actor.getRollData()
			});
		}

		if (data.kw_warfare.stats?.casualties?.max) {
			this._formatCasualties(data.kw_warfare.stats.casualties);
		}

		return data;
	}

	_formatCasualties (casualties) {
		let display = '';
		for (let i = 1; i <= casualties.max; i++) {
			const classes = ['kw-warfare-unit-casualties-pip'];
			if (i <= casualties.remaining) {
				classes.push('kw-warfare-unit-casualties-pip-full');
			} else {
				classes.push('kw-warfare-unit-casualties-pip-empty');
			}

			display += `<div class="${classes.join(' ')}" data-n="${i}"><span></span></div>`;
		}

		casualties.display = display;
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

	_onCasualtyClicked (evt) {
		const casualties = this.actor.getFlag('kw_warfare', 'stats.casualties');
		const n = Number(evt.currentTarget.dataset.n);
		let taken = casualties.taken;

		if (n > casualties.remaining) {
			taken--;
		} else {
			taken++;
		}

		if (taken > -1 && taken <= casualties.max) {
			this.actor.setFlag('kw_warfare', 'stats.casualties.taken', taken);
		}
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
