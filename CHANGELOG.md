### [0.8.2](https://github.com/Mejari/kw_warfare/compare/v0.8.1...v0.8.2) (2021-09-11)

Some major refactoring between 0.8.1 and 0.8.2 requires migrating data from the old structure to the new one. You can use this macro to select what units you want to migrate:

[Migrate Existing KW-Warfare data From 0.8.1](https://gist.githubusercontent.com/Mejari/cac90f00c10ed5f583b28a3b9f880a7e/raw/7aa782553d9947429f3d1193f12bf490852d1556)

You'll also need to re-import any of the bundled macros you've previously imported.

### Bug Fixes

* **macro:** Fix macros for new data structure. ([8b17238](https://github.com/Mejari/kw_warfare/commit/8b17238bcab8813e7f91d0c95dbc95639f7611c4))
* **ui:** Try another method of triangle to not obscure the attack button ([3c4dc51](https://github.com/Mejari/kw_warfare/commit/3c4dc51ee1f11ca4b6c2cfd1c7553507dc9ba843))


### Documentation

* **examples:** Redo example images ([83e6fd7](https://github.com/Mejari/kw_warfare/commit/83e6fd7c373390d2e8d01535a786734d17a1de2f))
* **flags:** Clarify what is possible with active effects. ([47d546d](https://github.com/Mejari/kw_warfare/commit/47d546d0585232ec9cda893d20052307a398e8a9))


### Code Refactoring

* **data:** Move data around to be easier to mess with. Move data manipulation off of the sheet and main as much as possible ([bbadbba](https://github.com/Mejari/kw_warfare/commit/bbadbba896c1e4f4c1e332c6f1ddd28c10e4773e))


### [0.8.1](https://github.com/Mejari/kw_warfare/compare/v0.8.0...v0.8.1) (2021-09-01)


### Bug Fixes

* **disadvantage:** Add missing disadvantage icon to match advantage. ([eb8fda8](https://github.com/Mejari/kw_warfare/commit/eb8fda80643f0a2ac6b935a2e80505f6cd106892))
* **traits:** fix refactor. ([3de63f3](https://github.com/Mejari/kw_warfare/commit/3de63f35aaa1e0db22da1ae8489fb541df0cea20))


### Documentation

* **docs:** Add install instructions. ([2961a3e](https://github.com/Mejari/kw_warfare/commit/2961a3ebdf2ca678ce4f2a4615ba8cd816569aa4))


## [0.8.0](https://github.com/Mejari/kw_warfare/compare/v0.7.0...v0.8.0) (2021-08-27)


### Features

* **macro:** Add macro to toggle stat disadvantage ([92fcbe9](https://github.com/Mejari/kw_warfare/commit/92fcbe9cce7565cce47304c75e2d73dffb22ac54))


### Bug Fixes

* **hp:** Fix healing unit when it has temp hp ([f733e47](https://github.com/Mejari/kw_warfare/commit/f733e47c97b9cb403027c4a51b33577e8849ecb4))


## [0.7.0](https://github.com/Mejari/kw_warfare/compare/v0.6.1...v0.7.0) (2021-08-27)


### Features

* **hp:** Add support for temp hp ([f75763c](https://github.com/Mejari/kw_warfare/commit/f75763cad0468831a071be47062158e528732827))
* **macro:** Add macro to set unit temp hp ([b8af2b5](https://github.com/Mejari/kw_warfare/commit/b8af2b579190e3764b83ce7df8306bec2c464d88))
* **macro:** Add macros to toggle advantage and set bonuses for stats. ([528b9ee](https://github.com/Mejari/kw_warfare/commit/528b9ee38ce39417c25d5610072dd6239e632aaf))
* **ui:** Add visible marker when a stat has advantage. Extract stat block into a partial. ([b4105dc](https://github.com/Mejari/kw_warfare/commit/b4105dcd8bac2e151bc146bbc152a320c6a11f50))


### Bug Fixes

* **stats:** Automatically populate flag defaults when switching an actor to be a K&W unit ([4fd26a2](https://github.com/Mejari/kw_warfare/commit/4fd26a2b076bce3e0e2f4af9d96fcbbc48cf444b))


### [0.6.1](https://github.com/Mejari/kw_warfare/compare/v0.6.0...v0.6.1) (2021-08-26)


### Bug Fixes

* **ui:** long commander names hidden while editing ([0e8b720](https://github.com/Mejari/kw_warfare/commit/0e8b720ca1b89e22e00fb668b223fbbe1d021468))


## [0.6.0](https://github.com/Mejari/kw_warfare/compare/v0.5.0...v0.6.0) (2021-08-26)


### Features

* **effects:** Add active effect flag for disadvantage ([cebbdc0](https://github.com/Mejari/kw_warfare/commit/cebbdc0f83dcd0d767e7e3db7bc0bcabff221d63))
* **effects:** Add support for adding bonuses and advantage to rolls via active effects ([f0dd2df](https://github.com/Mejari/kw_warfare/commit/f0dd2dfb1a56812a3772e9333bf25475f4763a62))
* **effects:** Add support for whether or not a unit is "diminishable" through active effects ([2cd652d](https://github.com/Mejari/kw_warfare/commit/2cd652d553766d3478440025869f46bbb3803f6e))
* **ui:** Add button to output trait information to chat if midi-qol is enabled ([0dbb1b2](https://github.com/Mejari/kw_warfare/commit/0dbb1b243a1d8629a99d734f7ff0f1f900b22658))


### Bug Fixes

* **effects:** Provide more error checking ([28a7e69](https://github.com/Mejari/kw_warfare/commit/28a7e698d223471fb24b694684096132ff4afdb8))
* **macros:** Fix bundled macros. ([b6e27c4](https://github.com/Mejari/kw_warfare/commit/b6e27c4c24eb26376fe410f36b25bb8df1de9f04))
* **traits:** Fix error when deleting traits that haven't been fully configured. ([90683e8](https://github.com/Mejari/kw_warfare/commit/90683e8f793f4f6e2f7684230ed7296e7d62faf2))
* **ui:** Fix unit name overflow ([35ccd9b](https://github.com/Mejari/kw_warfare/commit/35ccd9bc7f1f21a039bddee5dda4d2701b24e616))


### Styles

* **ui:** Give trait descriptions more side margin ([426bde6](https://github.com/Mejari/kw_warfare/commit/426bde665e368083f04023f5c4ad7e664b3fa4bb))


### Documentation

* **docs:** Add example image, add How to Use ([421a068](https://github.com/Mejari/kw_warfare/commit/421a0685a251d87a3e9a0193622665a5c75472e0))
* **docs:** Fix headings ([a5e73bf](https://github.com/Mejari/kw_warfare/commit/a5e73bf2f956f76f27e2976f2f1ec68cf9e03be5))
* **effects:** Include info about using active effects on unit hp ([3f15614](https://github.com/Mejari/kw_warfare/commit/3f15614ee9cedc98f05da0b287d7076acc45736d))


## [0.5.0](https://github.com/Mejari/kw_warfare/compare/v0.4.0...v0.5.0) (2021-08-11)


### Features

* **chat:** Add support for kw-warfare unit rolls in the chat-portrait module ([92440c2](https://github.com/Mejari/kw_warfare/commit/92440c2b7d5250f5fba485c651ea01ce208cc5c1))


## [0.4.0](https://github.com/Mejari/kw_warfare/compare/v0.3.0...v0.4.0) (2021-08-09)


### Features

* **details:** Drag-drop actor to set commander. ([70e939d](https://github.com/Mejari/kw_warfare/commit/70e939da69a1ae3702b6d9ca7624b281cde28095))
* **migration:** Implement migration from Warfare unit to KW Warfare unit ([98abe80](https://github.com/Mejari/kw_warfare/commit/98abe80a658cb3fad4cfe6e0502297aa33dc62a4))
* **permissions:** Set player permission to unit when commander is dropped ([34f6e2c](https://github.com/Mejari/kw_warfare/commit/34f6e2c79e1ef638599d728d1a47a565e18aadcf))
* **token:** Change token disposition to friendly when a PC is set as the commander ([d5430db](https://github.com/Mejari/kw_warfare/commit/d5430db55f827093a99859da3d543896f2d2c8a2))


### Bug Fixes

* **compatibility:** Fix rolling dice when both Warfare and KW-Warfare modules enabled. ([20bb193](https://github.com/Mejari/kw_warfare/commit/20bb193792e3ea4306e5bfe70018aa55e202f257))


## [0.3.0](https://github.com/Mejari/kw_warfare/compare/v0.2.1...v0.3.0) (2021-07-31)


### Features

* **ui:** Re layout sheet ([cf9d4d1](https://github.com/Mejari/kw_warfare/commit/cf9d4d1a1eab997eefc39cbe9d9c1b484cbe6aa1))


### [0.2.1](https://github.com/Mejari/kw_warfare/compare/v0.2.0...v0.2.1) (2021-07-31)


### Bug Fixes

* **license:** Fixed license attribution error ([d119ada](https://github.com/Mejari/kw_warfare/commit/d119ada6a229f2ce19f8ffd565e9eccf1b931bd1))
* **migrate:** Migrate to 'kw-warfare' name to match Foundry criteria ([4d0d07f](https://github.com/Mejari/kw_warfare/commit/4d0d07f3296e94fa1266dfb4d621bf0393a9c9e5))
* **readme:** Clean up readme to be more accurate ([4f2f11d](https://github.com/Mejari/kw_warfare/commit/4f2f11d1ee47039899066c7f4906095023b75cfa))
* **ui:** use blank image as default for ancestry and type ([0c520d3](https://github.com/Mejari/kw_warfare/commit/0c520d3471075ed8590d77a34af7ab715c774718))


## [0.2.1-4f2f11d](https://github.com/Mejari/kw_warfare/compare/v0.2.1-b2ecb91...v0.2.1-4f2f11d) (2021-07-31)


### Bug Fixes

* **readme:** Clean up readme to be more accurate ([4f2f11d](https://github.com/Mejari/kw_warfare/commit/4f2f11d))




## [0.2.1-b2ecb91](https://github.com/Mejari/kw_warfare/compare/v0.2.1-284e540...v0.2.1-b2ecb91) (2021-07-31)




## [0.2.1-284e540](https://github.com/Mejari/kw_warfare/compare/v0.2.1-cc55430...v0.2.1-284e540) (2021-07-31)


### Bug Fixes

* **migrate:** Migrate to 'kw-warfare' name to match Foundry criteria ([4d0d07f](https://github.com/Mejari/kw_warfare/commit/4d0d07f))
* **ui:** use blank image as default for ancestry and type ([0c520d3](https://github.com/Mejari/kw_warfare/commit/0c520d3))




## [0.2.1-cc55430](https://github.com/Mejari/kw_warfare/compare/v0.2.0...v0.2.1-cc55430) (2021-07-30)




# [0.1.0-3713504](https://github.com/Mejari/kw_warfare/compare/v0.1.0-e3a49bc...v0.1.0-3713504) (2021-07-30)


### Bug Fixes

* **ui:** improved some ui behavior ([59edfe9](https://github.com/Mejari/kw_warfare/commit/59edfe9))




# [0.1.0-e3a49bc](https://github.com/Mejari/kw_warfare/compare/v0.1.0-be72434...v0.1.0-e3a49bc) (2021-07-30)


### Bug Fixes

* **traits:** Fix manual overwriting of unit details not sticking ([e3a49bc](https://github.com/Mejari/kw_warfare/commit/e3a49bc))




# [0.1.0-be72434](https://github.com/Mejari/kw_warfare/compare/v0.1.0-f654a22...v0.1.0-be72434) (2021-07-30)


### Features

* **macros:** Add macros to do damage to other warfare units ([be72434](https://github.com/Mejari/kw_warfare/commit/be72434))




# [0.1.0-f654a22](https://github.com/Mejari/kw_warfare/compare/v0.1.0-71d470e...v0.1.0-f654a22) (2021-07-30)


### Bug Fixes

* **traits:** Fix traits being un-expanded when updating casualties. ([f654a22](https://github.com/Mejari/kw_warfare/commit/f654a22))


# [0.1.0-f48779e](https://github.com/Mejari/kw_warfare/compare/v0.0.1-dd0afc0...v0.1.0-f48779e) (2021-07-29)


### Features

* **casualties:** color casualties differently if diminished ([f48779e](https://github.com/Mejari/kw_warfare/commit/f48779e))
