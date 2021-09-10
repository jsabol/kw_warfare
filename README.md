# K&W: Warfare

![K&W Unit Example](./unitexample.png)

A [FoundryVTT](https://foundryvtt.com/) module that provides a unit sheet for MCDM's warfare system as seen in [Kingdoms & Warfare](https://shop.mcdmproductions.com/products/kingdoms-and-warfare-book).

**This project is not affiliated with MCDM and is in no way endorsed by them.**

The module adds a sheet for NPC Actors that designates them as a warfare unit and allows you to input any units created with the warfare system.

To Install: Click "Install Module" in Foundry, use this url in the "Manifest URL" field: https://raw.githubusercontent.com/Mejari/kw_warfare/main/module.json

To use: Create an NPC actor and use the 'K&W Unit Sheet' sheet.

## Features:
* Drag-drop Traits, Experience, Equipment, Ancestry and Unit Type.
  * Dragging and dropping correctly marked features onto unit cards will correctly map it to the correct field (see How-to below)
  * Icons added by you for Ancestry and Unit Type features will be displayed on the unit card.
  * By adding active effects that increase stat base values (see below) to things like ancestry, experience, etc... you can effectively build units from the ground up
    * There are several versions of people's unit building formulae online that you can use to populate these values.
* Drag-drop Commander.
  * Dragging and dropping a PC or NPC actor onto unit cards will correctly map the actor as the commander of the unit
  * Players whose PCs are dropped onto the unit will set that player's permission for the unit to "Owner"
* Click on the rollable stats to trigger a roll.
* Unit HP is configured by the `Size` attribute so all normal methods to damage/heal tokens should function.
* Clickable Trait names that will expand the Trait details inside the sheet.
* Built-in Compendium with several helpful macros.
* Migration from the original Warfare module.
  * Simply change the sheet type to the new K&W Warfare NPC type and the data will be migrated to the new format
  * (NOTE: This is irreversible, and data no longer used by K&W Warfare like unit cost will be lost on migration)
* Support for the [Chat-Portrait](https://foundryvtt.com/packages/chat-portrait/) module for unit rolls.
* Output trait details using the "Info" button if [Midi-qol](https://foundryvtt.com/packages/midi-qol/) is enabled.

## Proposed Features:
* Hook up targeting to automatically roll against matching stats (attack vs target's defense, etc...)
* Automatically apply damage on hit/successful power test (add option to disable)
* Add conditions for things like Weakened to mark units with.
* Set unit movement distances. (should be modifiable by active effects)
* Add sections on sheet (tabs? just visual markers?) for actions and items.

**NOTE** Not all feature suggestions may be possible to implement in order to not infringe on MCDM's copyright.

## Known Issues:
* Scroll position of traits is reset when one is open/closed.

## How to Use

### Drag-drop Experience, Equipment, Ancestry and Unit Type

1. Create an Item of the type "Feature"
2. Set the "Requirements" field to one of: `Experience`, `Equipment`, `Ancestry` or `Type`
*(any other value or blank will be treated as a unit Trait)*
3. (optional) Set the Item's icon. This only works for the `Ancestry` and `Type` traits.
4. Drag-drop the Item onto the K&W Warfare unit.

### Active Effects
Use traits or [DAE](https://foundryvtt.com/packages/dae) to add effects to the unit.

All flags are prefixed with `flags.kw-warfare.unit`

|Available flags|key||
|---|---|---|
|Stat Value|`{stat}.value`||
| |Valid stats|`attack`, `defense`, `morale`, `power`, `toughness`|
| |Acceptable values|any number|
|Stat Bonus|`{stat}.bonus`||
| |Valid stats|`attack`, `defense`, `morale`, `power`, `toughness`|
| |Acceptable values|any number|
|Advantage|`{stat}.advantage`||
| |Valid stats|`attack`, `power`, `morale`, `command`|
| |Acceptable values|0 for false, 1 for true|
|Disadvantage|`{stat}.disadvantage`||
| |Valid stats|`attack`, `power`, `morale`, `command`|
| |Acceptable values|0 for false, 1 for true|
|Damage|`damage`||
| |Acceptable values|any number|
|Number of Attacks|`numberOfAttacks`|
| |Acceptable values|any number|
|Diminishable|`special.diminishable`|
| |Acceptable values|0 for false, 1 for true|

A unit's size can also be modified using active effects by modifying the hp/max hp of the unit.

![Active Effects Example providing +5 to Power rolls and Advantage on Attack rolls](./activeeffectexample.png)

![Active Effects Results Example showing the +5 to Power rolls and Advantage on Attack rolls](./activeeffectresultexample.png)

### 0.9 Migration

Some major refactoring between 0.8.1 and 0.9.0 requires migrating data from the old structure to the new one. You can use this macro to select what units you want to migrate:

[Migrate Existing KW-Warfare data From 0.8.1](https://gist.githubusercontent.com/Mejari/cac90f00c10ed5f583b28a3b9f880a7e/raw/7aa782553d9947429f3d1193f12bf490852d1556)

## License

This project is derived from the original [Warfare](https://bitbucket.org/Fyorl/warfare/src) module developed by Kim Mantas.

All additions and modifications to the source code are copyright 2021 Dylan Gulick and is released under the terms of the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html). A copy of this license is available in the `LICENSE` file.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
