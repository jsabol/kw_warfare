# Kingdoms & Warfare: Warfare

A [FoundryVTT](https://foundryvtt.com/) module that provides an implementation of MCDM's warfare system as seen in [Kingdoms & Warfare](https://shop.mcdmproductions.com/products/kingdoms-and-warfare-book). The module adds a special sheet for NPC Actors that designates them as a unit and allows you to input any units created with the warfare system.

This project is not affiliated with MCDM and is in no way endorsed by them.

To use: Create an NPC actor and use the 'K&W Unit Sheet' sheet.

Features:
* Drag-drop Traits, Experience, Equipment, Ancestry and Unit Type.
  * Create an Item of the type "Feature"
  * Set the "Requirements" field to one of: `Experience`, `Equipment`, `Ancestry` or `Type`.
  * Dragging and dropping it onto unit cards will correctly map the feature to the correct field.
* Icons for Ancestry and Unit Type features will be displayed on the unit card
* Click on the rollable stats to trigger a roll!
* Unit HP follows casualties so things like hp bars will show correct values.
* Clickable Trait names that will expand the Trait details inside the sheet.

Known Issues:
* Styling is a bit wonky.
* TODO: hook up targeting to automatically roll against matching stats (attack vs target's defense, etc...)
* TODO: Automatically apply damage on hit/successful power test (add option to disable)

## License

This project is derived from the original [Warfare](https://bitbucket.org/Fyorl/warfare/src) module developed by Kim Mantas.

All source code is copyright 2021 Dylan Gulick and is released under the terms of the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html). A copy of this license is available in the `LICENSE` file.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
