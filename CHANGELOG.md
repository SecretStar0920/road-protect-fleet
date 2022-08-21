# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.76.1](https://github.com/entrostat/road-protect-fleet/compare/v3.76.0...v3.76.1) (2021-09-21)

## [3.76.0](https://github.com/entrostat/road-protect-fleet/compare/v3.75.25...v3.76.0) (2021-09-14)


### Features

* **integration-details:** Added new columns to the issuer frontend view and list ([876097a](https://github.com/entrostat/road-protect-fleet/commit/876097ac6e862e4534da4918b22d98b3613ce925))
* **integration-details:** Extracted integration details channels into separate columns ([005530f](https://github.com/entrostat/road-protect-fleet/commit/005530f38bdbb73ce3d81e5886cd96b995aa5140))
* **integration-details:** Refactored for multi-syncs ([57e2af6](https://github.com/entrostat/road-protect-fleet/commit/57e2af64c94d668daa3132e14ccc7d9b7275a374))
* **integration-details:** Refactored payments to use new details ([9d315e3](https://github.com/entrostat/road-protect-fleet/commit/9d315e3a13688532fd1865a0e934bb3941dedc88))
* **integration-details:** Refactored redirections ([44e4d48](https://github.com/entrostat/road-protect-fleet/commit/44e4d481a1bbbdb4b52fa64822e693cd9a92eb4b))
* **integration-details:** Refactored verifications to use the verification channel ([a279be7](https://github.com/entrostat/road-protect-fleet/commit/a279be74b2f3b109656f7a859e2e98b2cb89007d))


### Bug Fixes

* **integration-details:** Adjusted redirection endpoint to not owverwrite integrationDetails channel ([c2c1719](https://github.com/entrostat/road-protect-fleet/commit/c2c1719d56178c00354e1b6acd2d1984671f65fa))
* **integration-details:** Changed loggs to error from warnings for no verification channels ([05558c9](https://github.com/entrostat/road-protect-fleet/commit/05558c9caa7187a22a3a061238e1adef6253b99d))
* **integration-details:** Ensured payments heading only visable for valid payment channels ([294b719](https://github.com/entrostat/road-protect-fleet/commit/294b719e6172799feb405c573614b91d4881d732))

### [3.75.25](https://github.com/entrostat/road-protect-fleet/compare/v3.75.24...v3.75.25) (2021-08-18)

### [3.75.24](https://github.com/entrostat/road-protect-fleet/compare/v3.75.23...v3.75.24) (2021-08-13)

### [3.75.23](https://github.com/entrostat/road-protect-fleet/compare/v3.75.22...v3.75.23) (2021-08-11)

### [3.75.22](https://github.com/entrostat/road-protect-fleet/compare/v3.75.21...v3.75.22) (2021-08-09)

### [3.75.20](https://github.com/entrostat/road-protect-fleet/compare/v3.75.19...v3.75.20) (2021-08-09)

### [3.75.19](https://github.com/entrostat/road-protect-fleet/compare/v3.75.18...v3.75.19) (2021-08-09)


### Bug Fixes

* **git-secrets:** Added salman@roadprotect.co.il to the git secrets ([6a58026](https://github.com/entrostat/road-protect-fleet/commit/6a580268da69655075bf8ef90a4837ad19a59265))

### [3.75.18](https://github.com/entrostat/road-protect-fleet/compare/v3.75.17...v3.75.18) (2021-08-09)

### [3.75.17](https://github.com/entrostat/road-protect-fleet/compare/v3.75.16...v3.75.17) (2021-08-04)


### Bug Fixes

* **dashboard:** Made date picker the same as graphing ([cd31abd](https://github.com/entrostat/road-protect-fleet/commit/cd31abd7351670e54e1998304be45575f5aeb45b))
* **date-picker:** ensured current month started at begining of month ([6903347](https://github.com/entrostat/road-protect-fleet/commit/69033472208d9aab17068f95370b20be570779a9))
* **date-picker:** Removed start date from account activation ([5d476ff](https://github.com/entrostat/road-protect-fleet/commit/5d476ff1288f6ecc20dbd10b2039309ccfe4226b))

### [3.23.18](https://github.com/entrostat/road-protect-fleet/compare/v3.23.17...v3.23.18) (2021-04-26)


### Bug Fixes

* **http-client:** Set default options on the file name ([321615c](https://github.com/entrostat/road-protect-fleet/commit/321615c63d6daf233a3e82821a4f9650f68ed3d8))

## [2.125.0](https://github.com/entrostat/road-protect-fleet/compare/v2.124.0...v2.125.0) (2021-03-08)

## [2.124.0](https://github.com/entrostat/road-protect-fleet/compare/v2.123.0...v2.124.0) (2021-03-08)

## [2.123.0](https://github.com/entrostat/road-protect-fleet/compare/v2.122.2...v2.123.0) (2021-03-07)

### 2.122.2 (2021-03-07)

### [3.75.16](https://github.com/entrostat/road-protect-fleet/compare/v3.75.15...v3.75.16) (2021-07-29)


### Bug Fixes

* **graphing:** Adjusted issuer slider to match vehicle slider logic ([74f9061](https://github.com/entrostat/road-protect-fleet/commit/74f90613f7a53b6a7b71e6b115c9a0a189ae23dc))
* **graphing:** Updated graphing query to match dashboard ownership filter ([f31221b](https://github.com/entrostat/road-protect-fleet/commit/f31221b71d58c3c6c950a1fe7552a3f77eaa72a7))

### [3.75.15](https://github.com/entrostat/road-protect-fleet/compare/v3.75.14...v3.75.15) (2021-07-28)


### Bug Fixes

* **dashboard:** Fixed police issuer check if undefined ([6fa8c27](https://github.com/entrostat/road-protect-fleet/commit/6fa8c27f8e95bb936b25746f1c649a1e99b23966))

### [3.75.14](https://github.com/entrostat/road-protect-fleet/compare/v3.75.13...v3.75.14) (2021-07-28)


### Bug Fixes

* **dashboard:** Removed extra logging and added police issuer count as 0 if not found ([c266ff8](https://github.com/entrostat/road-protect-fleet/commit/c266ff8378aa0a06d265283171f22f3c061328a2))

### [3.75.13](https://github.com/entrostat/road-protect-fleet/compare/v3.75.12...v3.75.13) (2021-07-28)


### Bug Fixes

* **dashboard:** Added logging to find name of undefined ([347d966](https://github.com/entrostat/road-protect-fleet/commit/347d966a94c9939b6ed1558871ee1319be3879b9))

### [3.75.12](https://github.com/entrostat/road-protect-fleet/compare/v3.75.11...v3.75.12) (2021-07-27)


### Bug Fixes

* **formatting:** Ran prettier across the project ([cc4003d](https://github.com/entrostat/road-protect-fleet/commit/cc4003d16508e4be0b8616474012449d639d12f8))

### [3.75.11](https://github.com/entrostat/road-protect-fleet/compare/v3.75.10...v3.75.11) (2021-07-27)


### Bug Fixes

* **crawlers:** Changed the env on the backend ([607413c](https://github.com/entrostat/road-protect-fleet/commit/607413cc9639d4bae47d97a5c66849d989785b8a))
* **crawlers:** Set the default crawler ip to use Kubernetes ([86ee40b](https://github.com/entrostat/road-protect-fleet/commit/86ee40b9ec8ada2c3d511c9d84437511bdb266c1))

### [3.75.10](https://github.com/entrostat/road-protect-fleet/compare/v3.75.9...v3.75.10) (2021-07-27)


### Bug Fixes

* **graphing:** Changing limits of vehicle slider based on account number of vehicles ([c4f0591](https://github.com/entrostat/road-protect-fleet/commit/c4f0591c225aa41e7b73e3ba0a83904ad5573aec))

### [3.75.9](https://github.com/entrostat/road-protect-fleet/compare/v3.75.8...v3.75.9) (2021-07-27)


### Bug Fixes

* **graphing:** Remove count of undefined error ([7688d63](https://github.com/entrostat/road-protect-fleet/commit/7688d6346aed20d945fb0dd670bfcac61c7e1e81))

### [3.75.8](https://github.com/entrostat/road-protect-fleet/compare/v3.75.7...v3.75.8) (2021-07-27)


### Bug Fixes

* **graphing:** Limit the number of vhicles to 45 ([809d219](https://github.com/entrostat/road-protect-fleet/commit/809d21920449c2b77168b03b794ce7c0c53ec325))
* **graphing:** Removed errors from undefined ([6b3bae3](https://github.com/entrostat/road-protect-fleet/commit/6b3bae3a02195b72b093457f49220d2bb6c6693c))

### [3.75.7](https://github.com/entrostat/road-protect-fleet/compare/v3.75.5...v3.75.7) (2021-07-26)


### Bug Fixes

* **github-actions:** updated github actions ([231a15c](https://github.com/entrostat/road-protect-fleet/commit/231a15c06fc4b6b92fc7e03247e35c40e6d8c125))

### [3.75.6](https://github.com/entrostat/road-protect-fleet/compare/v3.75.5...v3.75.6) (2021-07-26)

### [3.75.5](https://github.com/entrostat/road-protect-fleet/compare/v3.75.4...v3.75.5) (2021-07-26)


### Bug Fixes

* **translations:** Adjusted Hebrew translations ([a28ff1e](https://github.com/entrostat/road-protect-fleet/commit/a28ff1e597c5fd9fb490ed6d9a4b76e89ac7b022))

### [3.75.4](https://github.com/entrostat/road-protect-fleet/compare/v3.75.3...v3.75.4) (2021-07-23)


### Bug Fixes

* **dashboard:** Ensured graphing legends show ([6934dee](https://github.com/entrostat/road-protect-fleet/commit/6934deeada43bbdc52cbd45d178b8db4b1544c5a))
* **dashboard:** Fixed issuer navigation ([6ab794a](https://github.com/entrostat/road-protect-fleet/commit/6ab794a75c5dd9ce8db1847465a9f4af4c5c40c4))
* **translations:** Adjusted Hebrew translations ([cc89cac](https://github.com/entrostat/road-protect-fleet/commit/cc89cac91623981115d374c760ac790c5ab200b7))
* **translations:** Adjusted Hebrew translations ([9a47150](https://github.com/entrostat/road-protect-fleet/commit/9a47150417fa844fc5fb0575d3c08eaccb09da9e))

### [3.75.3](https://github.com/entrostat/road-protect-fleet/compare/v3.75.2...v3.75.3) (2021-07-23)


### Bug Fixes

* **migrations:** Archived old migrations ([a20ff04](https://github.com/entrostat/road-protect-fleet/commit/a20ff046bc5407ccc4d4a234f4c30549a05be705))

### [3.75.2](https://github.com/entrostat/road-protect-fleet/compare/v3.75.1...v3.75.2) (2021-07-23)

### [3.75.1](https://github.com/entrostat/road-protect-fleet/compare/v3.75.0...v3.75.1) (2021-07-21)


### Bug Fixes

* **dashboard:** Updated vehicle table linking ([6c1588e](https://github.com/entrostat/road-protect-fleet/commit/6c1588e1c7d061b71de63a39d7d0467833f23e98))

## [3.75.0](https://github.com/entrostat/road-protect-fleet/compare/v3.74.1...v3.75.0) (2021-07-15)


### Features

* **dashboard:** Added a contract status view" ([b02801b](https://github.com/entrostat/road-protect-fleet/commit/b02801b33d892717104ed439bad3f4fffe965e95))
* **dashboard:** Added a summery of the top 5 issuers tot he dashbaord ([2af072e](https://github.com/entrostat/road-protect-fleet/commit/2af072e68099ec3770fd27f83d4ccd30f8b1d4cd))
* **dashboard:** Added a vehicle ownership summary component ([992104b](https://github.com/entrostat/road-protect-fleet/commit/992104b1ba2ddccc22a82fba06c3c7fceefe26d9))
* **dashboard:** Added in a summary of infringement statuses ([5656233](https://github.com/entrostat/road-protect-fleet/commit/5656233515df7fa86ac7a8c256797fe77d9346aa))
* **dashboard:** Added infringement cost section ([9e8c180](https://github.com/entrostat/road-protect-fleet/commit/9e8c180673d6dc35c81afda675a258b8ca3e9a97))
* **dashboard:** Added totals component and created home reporting modules ([e548282](https://github.com/entrostat/road-protect-fleet/commit/e548282ecd229467f0fa1acdc2df291e3ff93f46))
* **dashboard:** Created a basic dashboard with a date picker ([c98572e](https://github.com/entrostat/road-protect-fleet/commit/c98572ec0d1d03f6bd722ca046c2ba6f9b75d92c))
* **dashboard:** Updated the user dashboard ([ef01fc5](https://github.com/entrostat/road-protect-fleet/commit/ef01fc59eba05c79bdf98566d48f83954b32f003))
* **graphing:** Refactored the graphing module to be one page with tabs ([537faf5](https://github.com/entrostat/road-protect-fleet/commit/537faf52ffb17bb6e88f945f24feaf003f869e1b))
* **reporting:** Added a nomination status chart ([f2c7d8f](https://github.com/entrostat/road-protect-fleet/commit/f2c7d8f4ef9768994e1f2e8b8fc3d7e652b1df0a))
* **reporting:** Added infringement pie chart to status view ([5de7f89](https://github.com/entrostat/road-protect-fleet/commit/5de7f89f67dfaa2d619b692df153576c69f90919))
* **reporting:** Adjusted into tabs instead of separate pages ([ff05a8d](https://github.com/entrostat/road-protect-fleet/commit/ff05a8dedef43ff77d7bb4c4f19380247e78d8a3))
* **reporting:** Changed infringements table to be below aggregated table and have a hide button ([0dba735](https://github.com/entrostat/road-protect-fleet/commit/0dba735745f86925814b2848319c9d5843849d24))
* **reporting:** Changed the graphing sidebar name to reporting ([bdd98fe](https://github.com/entrostat/road-protect-fleet/commit/bdd98fed475816505dc0bdc938f0c6b579f2add2))
* **reporting:** Enabled column settings for the vehicles table ([e48f0cc](https://github.com/entrostat/road-protect-fleet/commit/e48f0cc134a8488438a6ee4bc2241a272749ee07))
* **reporting:** Ensure only selected items are shown on graphs and tables ([57cc978](https://github.com/entrostat/road-protect-fleet/commit/57cc97885b4318114e057adaa86f9609e1564ac9))
* **reporting:** Ensured Police issuer will always be the first column on the issuers table ([3f5d56f](https://github.com/entrostat/road-protect-fleet/commit/3f5d56ff6a8bb400d6d7aaf3103428deea74b90a))
* **reporting:** Ensured the total row is always on top and added styling ([570394a](https://github.com/entrostat/road-protect-fleet/commit/570394a755ecbb0f32f18f13e1e8f7dac21dcc5d))
* **reporting:** Made table scroll-able and 30 per page ([165925f](https://github.com/entrostat/road-protect-fleet/commit/165925fb76289a9b9141d462f6eb1f4daa1fb923))
* **reporting:** Moved datepicker to the right hand side ([fb08b70](https://github.com/entrostat/road-protect-fleet/commit/fb08b7087a2da02be189d9e5900b24d4c75b52c6))
* **reporting:** Swapped columns and rows so that dates are the rows ([4e896cd](https://github.com/entrostat/road-protect-fleet/commit/4e896cdb7be135b7651eb1f06bb7d6512c9a9037))
* **reporting:** Updated the date picker ([1a4f1db](https://github.com/entrostat/road-protect-fleet/commit/1a4f1db0ff5cc6cc2abbd807cedb1c76fc5f3a96))


### Bug Fixes

* **dashboard:** Added a check for an empty array before find the total ([a7c1927](https://github.com/entrostat/road-protect-fleet/commit/a7c19277820933e36d34160ee3b0df1084341b5a))
* **dashboard:** Added Hebrew translations to the infringement statuses ([62a9376](https://github.com/entrostat/road-protect-fleet/commit/62a9376d554fa16cc4dfcc8f31e7ae4adaba2bc2))
* **dashboard:** Added styling to the elements and query params to the links ([585f2c0](https://github.com/entrostat/road-protect-fleet/commit/585f2c002df699854a2658f704fd75359d865717))
* **dashboard:** Adjusted the pie-charts styling ([b6a4e6d](https://github.com/entrostat/road-protect-fleet/commit/b6a4e6d006654ad25e2b8024001aadf76f4e00d1))
* **dashboard:** Updated infringement status total ([c5f85f0](https://github.com/entrostat/road-protect-fleet/commit/c5f85f051e68106df658676dd1eb090676638f4b))
* **dashboard:** Updated the home page routing ([35c0334](https://github.com/entrostat/road-protect-fleet/commit/35c03342f0a5e9291e3267b9fa69a40ce324a3b8))
* **graphing:** Default date is current year and highest value shows first in columns ([4699dc1](https://github.com/entrostat/road-protect-fleet/commit/4699dc1fce5e1736c081339ba5d737e4ab481e86))
* **reporting:** Added check for no data ([2aeb03e](https://github.com/entrostat/road-protect-fleet/commit/2aeb03eb23917acdffecfa9a67f677a597334bee))
* **reporting:** Ensured all dates correctly translate ([0c6aebe](https://github.com/entrostat/road-protect-fleet/commit/0c6aebe997c92686beb7c06f4c8f9200e650a473))
* **reporting:** Ensured statuses always show and have the correct colour ([06b2b15](https://github.com/entrostat/road-protect-fleet/commit/06b2b155982ee784a0953a44054494b42bc7f1a8))
* **reporting:** Ensured table is still scrollable ([1d60df4](https://github.com/entrostat/road-protect-fleet/commit/1d60df4233522e3bcd3735ac695efe24c7e5f356))
* **reporting:** Fix issuer bar graph click event ([e1aee42](https://github.com/entrostat/road-protect-fleet/commit/e1aee426258fe2c9e909fb5b8961e7ed6563432f))
* **reporting:** Fixed tab routing ([6ddd121](https://github.com/entrostat/road-protect-fleet/commit/6ddd121ae7f84ed1f233ce427e1c75a70e959d0e))
* **reporting:** Hide infringement table after changing tabs ([e8f2710](https://github.com/entrostat/road-protect-fleet/commit/e8f271002eee005b910caa29d48aafc353d5ff5a))
* **reporting:** Limited vehicle graphing ledgend size ([052a991](https://github.com/entrostat/road-protect-fleet/commit/052a991ffe3a85fb5d70cc91d193fd6c7a6a3bdf))
* **reporting:** Prevent infringement table showing if there are no selected paramters ([d3fbfb6](https://github.com/entrostat/road-protect-fleet/commit/d3fbfb66323e5e145b44fe2f7a2aa3986cec6b72))
* **reporting:** Prevent labels from triming ([4eb327a](https://github.com/entrostat/road-protect-fleet/commit/4eb327aeb0169dcf4fe928f558bf8e31a746181d))
* **reporting:** Prevent labels from triming ([72728ed](https://github.com/entrostat/road-protect-fleet/commit/72728edc6cd20cbfd2a928b1583cd21b799a57f0))
* **reporting:** Removed console log ([de39806](https://github.com/entrostat/road-protect-fleet/commit/de398068839931c3757f15a1a6c7a988e940ac56))
* **reporting:** Removed error with line graphs ([0a170e8](https://github.com/entrostat/road-protect-fleet/commit/0a170e8605f1c76d4d7e1f5d57b05d9e09bb3042))
* **reporting:** Removed settings from vehicles table ([a390500](https://github.com/entrostat/road-protect-fleet/commit/a390500674ded4e7f4be6436b2deefd00f1b48ec))

### [3.74.1](https://github.com/entrostat/road-protect-fleet/compare/v3.74.0...v3.74.1) (2021-07-09)


### Bug Fixes

* **crawlers:** Increased Telaviv's bulk request timeout to 10 mins ([7ef5e1c](https://github.com/entrostat/road-protect-fleet/commit/7ef5e1cd6e2a6ebb306dbcff8d2eb785ef863373))
* **request-information:** Changed from email to muni@roadprotect.co.il ([6f81c3a](https://github.com/entrostat/road-protect-fleet/commit/6f81c3a10be2f307adf4898255930e59b89ebe8a))

## [3.74.0](https://github.com/entrostat/road-protect-fleet/compare/v3.73.0...v3.74.0) (2021-07-08)


### Features

* **infringements:** Added a creation method to the infringements and linked to a user if possible  ([f4c8ede](https://github.com/entrostat/road-protect-fleet/commit/f4c8ede7dd1fd937523e2f7eb2af5d3228ae70f8))

## [3.73.0](https://github.com/entrostat/road-protect-fleet/compare/v3.72.5...v3.73.0) (2021-07-07)


### Features

* **cluster-node-changes:** Created a service that will send an email if the ATG internal IP ping fails ([71e43d9](https://github.com/entrostat/road-protect-fleet/commit/71e43d918809541aa1f5b93e7dc654e91a0c3bc2))

### [3.72.5](https://github.com/entrostat/road-protect-fleet/compare/v3.72.4...v3.72.5) (2021-07-06)


### Bug Fixes

* **payments:** Remove previous successful payment before assigning a new one ([c5f9b31](https://github.com/entrostat/road-protect-fleet/commit/c5f9b3192edf8f1080d1abbde4d7e39b05e5af89))

### [3.72.4](https://github.com/entrostat/road-protect-fleet/compare/v3.72.3...v3.72.4) (2021-07-06)


### Bug Fixes

* **payments:** Ensured only successful payments are recorded as the new successful payment ([faa24dd](https://github.com/entrostat/road-protect-fleet/commit/faa24ddbc93b54a035552f3b60f333df894f14f6))

### [3.72.3](https://github.com/entrostat/road-protect-fleet/compare/v3.72.2...v3.72.3) (2021-07-05)


### Bug Fixes

* **drivers:** Removed email unique and not-null constraints ([c87cf68](https://github.com/entrostat/road-protect-fleet/commit/c87cf687da66dd83268bf95122d766f18f4adb52))

### [3.72.2](https://github.com/entrostat/road-protect-fleet/compare/v3.72.1...v3.72.2) (2021-07-05)


### Bug Fixes

* **ocr:** Added ocr and document checks on logger ([ed1df86](https://github.com/entrostat/road-protect-fleet/commit/ed1df8628fc5297d4b763943ac5802317485e674))

### [3.72.1](https://github.com/entrostat/road-protect-fleet/compare/v3.72.0...v3.72.1) (2021-07-02)


### Bug Fixes

* **ocr:** Added view of ocr details to the frontend ([42122a3](https://github.com/entrostat/road-protect-fleet/commit/42122a320ca9c2404236fb262de582991f79c1ea))

## [3.72.0](https://github.com/entrostat/road-protect-fleet/compare/v3.71.1...v3.72.0) (2021-07-01)


### Features

* **ocr:** Added batch processing of contract ocr ([8929c86](https://github.com/entrostat/road-protect-fleet/commit/8929c86cba003c994c1aa685838c05bddb9d643b))

### [3.71.1](https://github.com/entrostat/road-protect-fleet/compare/v3.71.0...v3.71.1) (2021-07-01)


### Bug Fixes

* **ocr:** Fixed the ocr dates ([56ef38b](https://github.com/entrostat/road-protect-fleet/commit/56ef38b262088869fe46a6d0a72a0bb2f0ac921b))

## [3.71.0](https://github.com/entrostat/road-protect-fleet/compare/v3.70.4...v3.71.0) (2021-07-01)


### Features

* **contracts:** Added a view ocr results to the contracts table view and json excel uploader ([7d92e2c](https://github.com/entrostat/road-protect-fleet/commit/7d92e2cf125300e7a9d7832469ddf256f12c06c1))

### [3.70.4](https://github.com/entrostat/road-protect-fleet/compare/v3.70.3...v3.70.4) (2021-07-01)


### Bug Fixes

* **devops:** Added Kfir to secrets ([a7baa0e](https://github.com/entrostat/road-protect-fleet/commit/a7baa0ecc39a4c06038f682edc83850842e7f0ef))

### [3.70.3](https://github.com/entrostat/road-protect-fleet/compare/v3.70.2...v3.70.3) (2021-07-01)


### Bug Fixes

* **ocr:** Added timezones to the ocr dates ([2683b1f](https://github.com/entrostat/road-protect-fleet/commit/2683b1f7dbc4ac9a57e518ba739b15d30834e703))

### [3.70.2](https://github.com/entrostat/road-protect-fleet/compare/v3.70.1...v3.70.2) (2021-06-30)


### Bug Fixes

* **ocr:** Added extra logging to determine why ocr failing ([3085bf1](https://github.com/entrostat/road-protect-fleet/commit/3085bf104851c6b68d64be4a7db174531b26d034))

### [3.70.1](https://github.com/entrostat/road-protect-fleet/compare/v3.70.0...v3.70.1) (2021-06-30)


### Bug Fixes

* **ocr:** Added extra logging to determine why ocr failing ([5953922](https://github.com/entrostat/road-protect-fleet/commit/59539225e939a7af76b25ed56f16744ea0950936))

## [3.70.0](https://github.com/entrostat/road-protect-fleet/compare/v3.69.1...v3.70.0) (2021-06-30)


### Features

* **infringements:** Removed required validator from the streetNumber on the edit infringement ([08d2eaa](https://github.com/entrostat/road-protect-fleet/commit/08d2eaa8dbd823efab730c609dc4ad26d0b4e8c8))


### Bug Fixes

* **ocr:** Ensure the file is rechecked every time ([ebe6cdb](https://github.com/entrostat/road-protect-fleet/commit/ebe6cdb198ca60aea628e3c0000483795b04eb06))

### [3.69.1](https://github.com/entrostat/road-protect-fleet/compare/v3.69.0...v3.69.1) (2021-06-30)


### Bug Fixes

* **ocr:** Ensured contracts had all minimal relations before orc checks ([6e8715c](https://github.com/entrostat/road-protect-fleet/commit/6e8715c3d2a7f9ca422a9087c230c4625962dbbb))
* **tables:** On view opens in a new window rather than a modal ([84b7feb](https://github.com/entrostat/road-protect-fleet/commit/84b7feb3dd93d384812eb58c8a231943d7045157))

## [3.69.0](https://github.com/entrostat/road-protect-fleet/compare/v3.68.1...v3.69.0) (2021-06-30)


### Features

* **ocr:** Added a button to run document ocr and update the status ([e0fe773](https://github.com/entrostat/road-protect-fleet/commit/e0fe7733ce33b325239a1eabe8e22807f6ee6d29))

### [3.68.1](https://github.com/entrostat/road-protect-fleet/compare/v3.68.0...v3.68.1) (2021-06-29)


### Bug Fixes

* **ocr:** Removed ocr status from linking service ([346fccf](https://github.com/entrostat/road-protect-fleet/commit/346fccf0554b942cfdbda0412eedb57c3a1fee62))

## [3.68.0](https://github.com/entrostat/road-protect-fleet/compare/v3.67.1...v3.68.0) (2021-06-29)


### Features

* **presets:** Added notification for saving a preset ([0994688](https://github.com/entrostat/road-protect-fleet/commit/09946887239a67437c70ab7ce97a3d070c749cfe))


### Bug Fixes

* **ocr:** Removed build error from the linking service identifying a contract ([59d11c7](https://github.com/entrostat/road-protect-fleet/commit/59d11c7e0151e1e918385559890574f5184b8b4f))

### [3.67.1](https://github.com/entrostat/road-protect-fleet/compare/v3.67.0...v3.67.1) (2021-06-29)


### Bug Fixes

* **ocr:** Ensured the contracts ocr status updated for a change in document ([b8f0a8d](https://github.com/entrostat/road-protect-fleet/commit/b8f0a8db9ac3944ed91dc6e6fbd3136b09e73889))
* **tables:** Ensured a heading column is created for a delete template ([7fda5a9](https://github.com/entrostat/road-protect-fleet/commit/7fda5a9be8565b84815a5c9c64166376998e8c0d))
* **translations:** Adjusted Hebrew translations ([e46d04a](https://github.com/entrostat/road-protect-fleet/commit/e46d04a8b42e98e7e2e8eca6416e0bdfa29538f8))

## [3.67.0](https://github.com/entrostat/road-protect-fleet/compare/v3.66.0...v3.67.0) (2021-06-29)


### Features

* **tables:** Changed view from opening in a new tab to opening in a modal ([90b7061](https://github.com/entrostat/road-protect-fleet/commit/90b70618c7183850a3c020303df361bc1322cb41))


### Bug Fixes

* **ocr:** Ensured a successful ocr reached the next step ([786895f](https://github.com/entrostat/road-protect-fleet/commit/786895ff998b4677eba2c9674577d90d8a67a068))

## [3.66.0](https://github.com/entrostat/road-protect-fleet/compare/v3.65.1...v3.66.0) (2021-06-29)


### Features

* **header:** Only admins can select their country ([62af830](https://github.com/entrostat/road-protect-fleet/commit/62af830c3f396cbcb31ea45868bf1814356d475b))
* **infringements-table:** Reduced table size to prevent horizontal scrolling by default ([bbc651e](https://github.com/entrostat/road-protect-fleet/commit/bbc651eeed74897adc774e4c0bd38dc1b0e7e4a2))
* **partial-infringement:** Added a cron job to fetch partial infrignements every hour ([ad0eaec](https://github.com/entrostat/road-protect-fleet/commit/ad0eaec63085172a966175582f2ab2b961e61f5f))


### Bug Fixes

* **ocr:** Adjusted request to Salmans server ([0f944dd](https://github.com/entrostat/road-protect-fleet/commit/0f944ddfdc1ba1dd1cb9ea5a3b77c0b5f4fb7a80))
* **sidebar:** Adjusted collapsed view so scrollbar does not block icons ([c470640](https://github.com/entrostat/road-protect-fleet/commit/c4706404293524a527c48ee9b0f2e3d299a7239b))

### [3.65.1](https://github.com/entrostat/road-protect-fleet/compare/v3.65.0...v3.65.1) (2021-06-28)


### Bug Fixes

* **presets:** Ensured default presets are not applied on all navigations ([02c92e3](https://github.com/entrostat/road-protect-fleet/commit/02c92e3d9d90c5502c40fdc7aed8f6dcaabe2f51))

## [3.65.0](https://github.com/entrostat/road-protect-fleet/compare/v3.64.0...v3.65.0) (2021-06-28)


### Features

* **verifications:** Added carNumber to police verifications ([0b6733b](https://github.com/entrostat/road-protect-fleet/commit/0b6733baa8af9ec93ef8cbf66fa30a048acb2cfc))

## [3.64.0](https://github.com/entrostat/road-protect-fleet/compare/v3.63.1...v3.64.0) (2021-06-28)


### Features

* **infringement-table:** Removed nominated account from default view ([832857e](https://github.com/entrostat/road-protect-fleet/commit/832857e7d294f38fe62f3b124e9c01e9eaf3a3cf))
* **infringement-table:** Restricted the length of the reason and location ([381fa61](https://github.com/entrostat/road-protect-fleet/commit/381fa61d943f2c1b73bd8ed2e84d897d6c6260b3))
* **tables:** Made the heading sticky ([3bee59e](https://github.com/entrostat/road-protect-fleet/commit/3bee59e54344b25b982bdf8e2b99fc8c914d706d))
* **tables:** View button opens in a new window ([b43f242](https://github.com/entrostat/road-protect-fleet/commit/b43f2420c239c56cbfe3d714ec9821488ed9acdb))


### Bug Fixes

* **dashboard:** Adjusted queries to match onVehicles ([78575ad](https://github.com/entrostat/road-protect-fleet/commit/78575ad051e1c0d2693510c0275925783ba164a2))
* **infringement-note:** Fixed text wrapping ([4f9fe37](https://github.com/entrostat/road-protect-fleet/commit/4f9fe371223f0452d408637db6b32bab63aa2ef5))

### [3.63.1](https://github.com/entrostat/road-protect-fleet/compare/v3.63.0...v3.63.1) (2021-06-25)


### Bug Fixes

* **secrets:** Updated secrets ([9e86551](https://github.com/entrostat/road-protect-fleet/commit/9e86551ea065ebd881697dc90723fadb5d00569c))

## [3.63.0](https://github.com/entrostat/road-protect-fleet/compare/v3.62.0...v3.63.0) (2021-06-25)


### Features

* **infringement-table:** Changed default columns and their order ([7295550](https://github.com/entrostat/road-protect-fleet/commit/7295550e60da6b9cac7f41345571530e08cd5511))

## [3.62.0](https://github.com/entrostat/road-protect-fleet/compare/v3.61.0...v3.62.0) (2021-06-25)


### Features

* **partial-infringements:** Created a frontend page to fetch new partial infringements ([b886d26](https://github.com/entrostat/road-protect-fleet/commit/b886d2697152e43026a2ae5fc4aea91f2d07fd6c))

## [3.61.0](https://github.com/entrostat/road-protect-fleet/compare/v3.60.1...v3.61.0) (2021-06-25)


### Features

* **partial-infringements:** Created an endpoint to fetch new partial infringements and create them ([05a7d38](https://github.com/entrostat/road-protect-fleet/commit/05a7d38dd398b011c9d8bc04f8796d2d3a7b002b))
* **tables:** Added edit buttons to the table views ([86b2294](https://github.com/entrostat/road-protect-fleet/commit/86b2294bcf6ae302283635805608562dbe81875f))
* **tables:** Made the default filter view none ([98eed26](https://github.com/entrostat/road-protect-fleet/commit/98eed264f21a9a7d30963fe1354c0528fde12832))
* **tables:** Made the default number of items 20 per page ([a89014f](https://github.com/entrostat/road-protect-fleet/commit/a89014f7dcba3212cb4820a65afe21c52082d6a8))
* **vehicles-table:** Made the all button a default ([8b7f36c](https://github.com/entrostat/road-protect-fleet/commit/8b7f36cc509337ae06f02a4c287da241773a4833))


### Bug Fixes

* **account-user:** Ensured edit works for account users name and emails ([86c2aad](https://github.com/entrostat/road-protect-fleet/commit/86c2aad7ce8d6c292747badf35a889800142241e))
* **infringements:** Removed internal server error for updating an infringement ([3cecd07](https://github.com/entrostat/road-protect-fleet/commit/3cecd0772d5da84c969c8bf971489ae697af99db))
* **tables:** Hid save user presets if the filter visability is none ([6651e36](https://github.com/entrostat/road-protect-fleet/commit/6651e36eef1353ea81491bcb470543d5845336af))
* **vehicles:** Ensured the year can be updated on the vehicles table ([b8cf414](https://github.com/entrostat/road-protect-fleet/commit/b8cf41403a034161dd3dbf159586b114c800fdba))

### [3.60.1](https://github.com/entrostat/road-protect-fleet/compare/v3.60.0...v3.60.1) (2021-06-24)


### Bug Fixes

* **user-presets:** Ensured default filter values show in form ([5e40faa](https://github.com/entrostat/road-protect-fleet/commit/5e40faaf622770e6561ba8ec400571f2e7e6c8ef))

## [3.60.0](https://github.com/entrostat/road-protect-fleet/compare/v3.59.0...v3.60.0) (2021-06-24)


### Features

* **user-presets:** Added the logic for user presets ([aeedf1c](https://github.com/entrostat/road-protect-fleet/commit/aeedf1c8d398e115133077ef45f4d505f05aba72))

## [3.59.0](https://github.com/entrostat/road-protect-fleet/compare/v3.58.1...v3.59.0) (2021-06-24)


### Features

* **user-preset:** Convert system preferences to new format ([fde981a](https://github.com/entrostat/road-protect-fleet/commit/fde981af8e2865bf899e07d38e56751d198bf1df))

### [3.58.1](https://github.com/entrostat/road-protect-fleet/compare/v3.58.0...v3.58.1) (2021-06-24)


### Bug Fixes

* **vehicles-table:** Removed reset parameters between views ([abc404a](https://github.com/entrostat/road-protect-fleet/commit/abc404a4ee6fd2de261e38a7a254462cf453500b))

## [3.58.0](https://github.com/entrostat/road-protect-fleet/compare/v3.57.4...v3.58.0) (2021-06-24)


### Features

* **vehicles-table:** Added an all button to the accounts view ([e3f2b50](https://github.com/entrostat/road-protect-fleet/commit/e3f2b5048746cc57578bc9c8de10d014f44ae260))


### Bug Fixes

* **infringements-table:** Change nomination status to redirection status ([33eabab](https://github.com/entrostat/road-protect-fleet/commit/33eababd0022ccf1e0b86c000ecdc721e94bbdb7))
* **infringements-table:** Set default to all on accounts view ([6fd6810](https://github.com/entrostat/road-protect-fleet/commit/6fd68105a8c413f9a8589b35d47cf044542bfabf))
* **vehicles-table:** Forced the accounts view to have the mine parameter set ([257724f](https://github.com/entrostat/road-protect-fleet/commit/257724fb855edcc19fd0226c4964a9c5022967e0))
* **vehicles-table:** Removed the show more/less button ([46c4548](https://github.com/entrostat/road-protect-fleet/commit/46c454808d8e00f36c532603471f427994fef340))

### [3.57.4](https://github.com/entrostat/road-protect-fleet/compare/v3.57.3...v3.57.4) (2021-06-23)


### Bug Fixes

* **ocr:** Added a check for a file is a buffer and logging for failing to attach pdf ([536e022](https://github.com/entrostat/road-protect-fleet/commit/536e022822c20cec00bc9c9715cb002fa657d3f0))

### [3.57.3](https://github.com/entrostat/road-protect-fleet/compare/v3.57.2...v3.57.3) (2021-06-23)


### Bug Fixes

* **infringements-table:** Change nomination status to redirection status ([48046c7](https://github.com/entrostat/road-protect-fleet/commit/48046c780da6426ab470fe6dd87902f0399decc5))
* **infringements-table:** Set default to 30 infringements per page ([7cb30cd](https://github.com/entrostat/road-protect-fleet/commit/7cb30cd87906ebf0c9b87183fdc4c5d6300516dd))
* **translations:** Re-imported the translations because the Hebrew keys were empty ([bab5b76](https://github.com/entrostat/road-protect-fleet/commit/bab5b76ea8406055d193a6de33766f6889893775))

### [3.57.2](https://github.com/entrostat/road-protect-fleet/compare/v3.57.1...v3.57.2) (2021-06-21)


### Bug Fixes

* **font:** Ensured new default fonts are not overwritten ([8bed8a2](https://github.com/entrostat/road-protect-fleet/commit/8bed8a2e276dcdcb3d931f088f225dfa14e1346f))

### [3.57.1](https://github.com/entrostat/road-protect-fleet/compare/v3.57.0...v3.57.1) (2021-06-21)


### Bug Fixes

* **font:** Ensured new default fonts are not overwritten ([eb269f8](https://github.com/entrostat/road-protect-fleet/commit/eb269f88362385887a9c967b4db4c195f468149b))

## [3.57.0](https://github.com/entrostat/road-protect-fleet/compare/v3.56.0...v3.57.0) (2021-06-21)


### Features

* **graphing:** Added an 'other' checkbox to view all issuers ([8c77d34](https://github.com/entrostat/road-protect-fleet/commit/8c77d34ea258a44eaf31240f7643eae4b1e4bcad))
* **graphing:** Used the database value for max on the graphing by sliders ([d7d3f03](https://github.com/entrostat/road-protect-fleet/commit/d7d3f034c0b5179d3ce96ceb2ad4da8d5bb6ba0f))


### Bug Fixes

* **admin-reporting:** Adjusted styling and added a description to the export all button ([69560d1](https://github.com/entrostat/road-protect-fleet/commit/69560d163b46e021913a238af915311e7a9ee0ca))
* **graphing:** Adjusted the graphing table sorting to use the subcolumns ([3a69144](https://github.com/entrostat/road-protect-fleet/commit/3a69144aca8f7d941e37cadd7150afb8c4367e64))

## [3.56.0](https://github.com/entrostat/road-protect-fleet/compare/v3.55.1...v3.56.0) (2021-06-21)


### Features

* **graphing:** Made the vehicles graph scroll-able and the slider increment in 5s ([6d26c76](https://github.com/entrostat/road-protect-fleet/commit/6d26c76ca62362e7dc7d4bb99dbfe7f950ba612b))
* **graphing:** Removed view graph and show comparison buttons ([7079150](https://github.com/entrostat/road-protect-fleet/commit/70791509501bfc95886bed6657f3ce329b30e266))


### Bug Fixes

* **graphing:** Ensured the total column and the show comparison shows the correct data ([8661260](https://github.com/entrostat/road-protect-fleet/commit/86612603f15768fe5a76186e2d38ef193d351fe9))
* **graphing:** Made the default number of issuers 5 ([db22314](https://github.com/entrostat/road-protect-fleet/commit/db22314611c4ea2c07c0b4ea3ede010f21f48fef))

### [3.55.1](https://github.com/entrostat/road-protect-fleet/compare/v3.55.0...v3.55.1) (2021-06-21)


### Bug Fixes

* **translations:** Added English translations for the graphing ([42b5464](https://github.com/entrostat/road-protect-fleet/commit/42b54649f34c93cc9837432ccc10cdc83b955a80))

## [3.55.0](https://github.com/entrostat/road-protect-fleet/compare/v3.54.0...v3.55.0) (2021-06-21)


### Features

* **translations:** Updated the translations on the system ([136955b](https://github.com/entrostat/road-protect-fleet/commit/136955bc0a1a00387cfa38a0a490b57fc2c4e32e))

## [3.54.0](https://github.com/entrostat/road-protect-fleet/compare/v3.53.2...v3.54.0) (2021-06-18)


### Features

* **admin-reporting:** Fixed the styling of the admin reporting section ([3c73918](https://github.com/entrostat/road-protect-fleet/commit/3c73918e4b191c5a371e8ee2ced6ea4ffbb6f87a))
* **user-table:** Added an edit button to edit users from the table ([38cfdb9](https://github.com/entrostat/road-protect-fleet/commit/38cfdb96d5c1e9a7c4827fe6b909680b639f9b7a))
* **users:** Added reset login attempt, send forgot password and change user password to the edit user ([a0206fb](https://github.com/entrostat/road-protect-fleet/commit/a0206fbe34bacf2b8049f99d26f1ab2235552871))


### Bug Fixes

* **auth:** Added a password validator to ensure passwords match ([62437b5](https://github.com/entrostat/road-protect-fleet/commit/62437b5c3ff63cac4b3cc9ca46687fa9c3226854))
* **font:** Ensured new default fonts are not overwritten ([13de437](https://github.com/entrostat/road-protect-fleet/commit/13de4374e4f51f0a401c051cdcc84b0f90a96739))

### [3.53.2](https://github.com/entrostat/road-protect-fleet/compare/v3.53.1...v3.53.2) (2021-06-17)


### Bug Fixes

* **raw-infringements:** Refactored infringement notes to be created after the infringement transaction has completed ([6da3f6a](https://github.com/entrostat/road-protect-fleet/commit/6da3f6afd30311a83bb6d298843c7b22d7a7f364))

### [3.53.1](https://github.com/entrostat/road-protect-fleet/compare/v3.53.0...v3.53.1) (2021-06-17)


### Bug Fixes

* **raw-infringements:** Ensured a new infringement is saved before linking infringement notes ([dcb9538](https://github.com/entrostat/road-protect-fleet/commit/dcb95388517433fe14e87c9e4216734910065fae))

## [3.53.0](https://github.com/entrostat/road-protect-fleet/compare/v3.52.1...v3.53.0) (2021-06-15)


### Features

* **admin-reporting:** Changed date picker styling in Hebrew ([3eb82f2](https://github.com/entrostat/road-protect-fleet/commit/3eb82f2c4642c996c31d560aecc7254138ba901c))
* **graphing:** Added page size and page size optiong to graphing table ([3480291](https://github.com/entrostat/road-protect-fleet/commit/3480291c6ff2932c27e344f43a24e0a0774ac36a))
* **graphing:** Made the graphing by pages generalised ([0ab3d66](https://github.com/entrostat/road-protect-fleet/commit/0ab3d66296f03745d49f7e41ea7576085e39b1d0))

### [3.52.1](https://github.com/entrostat/road-protect-fleet/compare/v3.52.0...v3.52.1) (2021-06-14)


### Bug Fixes

* **redirection-readiness:** prevent error for no contract ([6bd46a1](https://github.com/entrostat/road-protect-fleet/commit/6bd46a16db4684663c0b4e3931b39d6a6a365a37))

## [3.52.0](https://github.com/entrostat/road-protect-fleet/compare/v3.51.5...v3.52.0) (2021-06-14)


### Features

* **font:** Updated font familes ([e8a8582](https://github.com/entrostat/road-protect-fleet/commit/e8a8582fd7ce3fbd2b454e2bb17117c1064bcd49))
* **tables:** Made alternating rows have a grey background ([12cd9ac](https://github.com/entrostat/road-protect-fleet/commit/12cd9ac73f2f0c04bb1e5f0a1748dc5a2ed8fae1))
* **translations:** Updated the hebrew translation file ([286b2c5](https://github.com/entrostat/road-protect-fleet/commit/286b2c54da3f731920725fbb1d618427a3ab36b5))


### Bug Fixes

* **crawlers:** Updated staging env files ([d33d978](https://github.com/entrostat/road-protect-fleet/commit/d33d9781fbfdd1154b2e551448dc0ccffc1b7af3))
* **crawlers:** Updated staging env files ([8eba280](https://github.com/entrostat/road-protect-fleet/commit/8eba280eac850da6ba4d0499cf7f2ef15fdfbdd7))

### [3.51.5](https://github.com/entrostat/road-protect-fleet/compare/v3.51.4...v3.51.5) (2021-06-10)


### Bug Fixes

* **redirections:** Removed logging for merging pdfs ([867fa1e](https://github.com/entrostat/road-protect-fleet/commit/867fa1ebe0d35e26b372b594473d4456a4d35224))

### [3.51.4](https://github.com/entrostat/road-protect-fleet/compare/v3.51.3...v3.51.4) (2021-06-10)


### Bug Fixes

* **redirections:** Added logging for merging pdfs ([758cf41](https://github.com/entrostat/road-protect-fleet/commit/758cf41ea537a9b12d11fde6652217f56e877a27))

### [3.51.3](https://github.com/entrostat/road-protect-fleet/compare/v3.51.2...v3.51.3) (2021-06-10)


### Bug Fixes

* **redirections:** Added logging for merging pdfs ([b59a840](https://github.com/entrostat/road-protect-fleet/commit/b59a840006b57c5c013d266cec9f914eac453e16))

### [3.51.2](https://github.com/entrostat/road-protect-fleet/compare/v3.51.1...v3.51.2) (2021-06-10)

### [3.51.1](https://github.com/entrostat/road-protect-fleet/compare/v3.51.0...v3.51.1) (2021-06-10)


### Bug Fixes

* **redirections:** Added logging for merging pdfs ([6cb062e](https://github.com/entrostat/road-protect-fleet/commit/6cb062e02fdee1d7086cefd1937dce065c003056))

## [3.51.0](https://github.com/entrostat/road-protect-fleet/compare/v3.50.12...v3.51.0) (2021-06-10)


### Features

* **document-api:** Added AllExceptionsFilter and HttpExceptionLoggerFilter  ([47d3e81](https://github.com/entrostat/road-protect-fleet/commit/47d3e8195c3c804d96c83225da21061152952556))

### [3.50.12](https://github.com/entrostat/road-protect-fleet/compare/v3.50.11...v3.50.12) (2021-06-10)


### Bug Fixes

* **redirections:** Added logging for merging pdfs ([2e8b899](https://github.com/entrostat/road-protect-fleet/commit/2e8b899b5eb15521402567d1568585f3c4b65625))

### [3.50.11](https://github.com/entrostat/road-protect-fleet/compare/v3.50.10...v3.50.11) (2021-06-10)


### Bug Fixes

* **redirections:** Added logging for merging pdfs ([d2ce996](https://github.com/entrostat/road-protect-fleet/commit/d2ce9966620ae25575fd4f0ba102062fa79375eb))

### [3.50.10](https://github.com/entrostat/road-protect-fleet/compare/v3.50.9...v3.50.10) (2021-06-09)


### Bug Fixes

* **redirections:** Added logging for merging pdfs ([7a6a961](https://github.com/entrostat/road-protect-fleet/commit/7a6a961066e05a80821d81c78d22f43f0ef81eed))

### [3.50.9](https://github.com/entrostat/road-protect-fleet/compare/v3.50.8...v3.50.9) (2021-06-09)


### Bug Fixes

* **redirections:** Added logging for merging pdfs ([2db3477](https://github.com/entrostat/road-protect-fleet/commit/2db34777705ca5f145e59e0705275d6ad1980cd8))

### [3.50.8](https://github.com/entrostat/road-protect-fleet/compare/v3.50.7...v3.50.8) (2021-06-09)


### Bug Fixes

* **redirections:** Added logging for merging pdfs ([e2474b9](https://github.com/entrostat/road-protect-fleet/commit/e2474b9778c8e61b14c852e1c4f7a7b97656bfb3))

### [3.50.7](https://github.com/entrostat/road-protect-fleet/compare/v3.50.6...v3.50.7) (2021-06-09)


### Bug Fixes

* **redirections:** Added logging for merging pdfs ([a4bdbfa](https://github.com/entrostat/road-protect-fleet/commit/a4bdbfa19212d5d3088803cafa94cff8fad8bf83))

### [3.50.6](https://github.com/entrostat/road-protect-fleet/compare/v3.50.5...v3.50.6) (2021-06-09)


### Bug Fixes

* **redirections:** Added logging for merging pdfs ([a052a21](https://github.com/entrostat/road-protect-fleet/commit/a052a213f6a2356a3d962e0aee37f885e623bab1))

### [3.50.5](https://github.com/entrostat/road-protect-fleet/compare/v3.50.4...v3.50.5) (2021-06-09)


### Bug Fixes

* **redirections:** Added logging for merging pdfs ([d537fe6](https://github.com/entrostat/road-protect-fleet/commit/d537fe6f101b3de9687dea1259072474fda0ccf0))

### [3.50.4](https://github.com/entrostat/road-protect-fleet/compare/v3.50.3...v3.50.4) (2021-06-09)


### Bug Fixes

* **redirections:** Added logging for merging pdfs ([d2f2167](https://github.com/entrostat/road-protect-fleet/commit/d2f21675b6782fd9826eb4ef03cc5f5d2cbecd24))

### [3.50.3](https://github.com/entrostat/road-protect-fleet/compare/v3.50.2...v3.50.3) (2021-06-08)


### Bug Fixes

* **graphing:** Added check for graphing by status before setting status name ([420a9f7](https://github.com/entrostat/road-protect-fleet/commit/420a9f7ced15657934bc5efcf997ee2c73072d62))

### [3.50.2](https://github.com/entrostat/road-protect-fleet/compare/v3.50.1...v3.50.2) (2021-06-08)


### Bug Fixes

* **contracts:** Added query pieces to the contracts query controller ([e371910](https://github.com/entrostat/road-protect-fleet/commit/e37191000df53288d83b9d6fca1a196e986921ad))
* **user-preferences:** Updated the user's preferences to only change the isDisplaying of a column ([d5f5220](https://github.com/entrostat/road-protect-fleet/commit/d5f522090b06c6500e9894c572538b3864763b5a))

### [3.50.1](https://github.com/entrostat/road-protect-fleet/compare/v3.50.0...v3.50.1) (2021-06-08)


### Bug Fixes

* **graphing:** Fixed the summary indicators managed vehicle calculation ([ddaf1e4](https://github.com/entrostat/road-protect-fleet/commit/ddaf1e4910dfd1ba0c17c98b3c747ef5341611fe))

## [3.50.0](https://github.com/entrostat/road-protect-fleet/compare/v3.49.0...v3.50.0) (2021-06-08)


### Features

* **graphing:** Grouped the issuers by total number rather than column number ([e784569](https://github.com/entrostat/road-protect-fleet/commit/e7845692524a328ab6f2f82fc4c3ab8446fa1cb9))

## [3.49.0](https://github.com/entrostat/road-protect-fleet/compare/v3.48.6...v3.49.0) (2021-06-08)


### Features

* **client-reporting:** Added view buttons to the summary indicators ([124b47b](https://github.com/entrostat/road-protect-fleet/commit/124b47bf430e698a8816f54a3d3b5e15807e5614))


### Bug Fixes

* **documentation:** Updated json and readme ([ee40aef](https://github.com/entrostat/road-protect-fleet/commit/ee40aef67bdb9790897cf78829639516a05b7d6b))

### [3.48.6](https://github.com/entrostat/road-protect-fleet/compare/v3.48.5...v3.48.6) (2021-06-07)


### Bug Fixes

* **infringements-table:** Removed log to try find Salman error ([a949510](https://github.com/entrostat/road-protect-fleet/commit/a94951097797465c7e1246ab44c0f56fe4964b57))

### [3.48.5](https://github.com/entrostat/road-protect-fleet/compare/v3.48.4...v3.48.5) (2021-06-07)


### Bug Fixes

* **infringements-table:** Added log to try find Salman error ([f30a1fd](https://github.com/entrostat/road-protect-fleet/commit/f30a1fda442bd306494b5de869abbbd82f8b3fc1))

### [3.48.4](https://github.com/entrostat/road-protect-fleet/compare/v3.48.3...v3.48.4) (2021-06-07)


### Bug Fixes

* **infringements-table:** Re-triggering backend update ([2adc9f9](https://github.com/entrostat/road-protect-fleet/commit/2adc9f9819190322bab30c59bbfc31967c971b50))

### [3.48.3](https://github.com/entrostat/road-protect-fleet/compare/v3.48.2...v3.48.3) (2021-06-07)


### Bug Fixes

* **infringements-table:** Removed orderby from get with minimal relations ([8c2ceae](https://github.com/entrostat/road-protect-fleet/commit/8c2ceae11fb8d8ca26860f5d7e467840c33f05f6))

### [3.48.2](https://github.com/entrostat/road-protect-fleet/compare/v3.48.1...v3.48.2) (2021-06-07)


### Bug Fixes

* **currency-display:** Added a check for NaN ([d4e7b7c](https://github.com/entrostat/road-protect-fleet/commit/d4e7b7c76f1d4069f085216483c15cabeb2b9bc8))
* **infringements-table:** Ensured infringement notes and prevent resirections showed for excel ([2c00698](https://github.com/entrostat/road-protect-fleet/commit/2c006984d09a797c0de998fbc01131cc512e1c5a))

### [3.48.1](https://github.com/entrostat/road-protect-fleet/compare/v3.48.0...v3.48.1) (2021-06-07)


### Bug Fixes

* **partial-infringements:** Added check if infringement exists before checking brn ([fe22a33](https://github.com/entrostat/road-protect-fleet/commit/fe22a339f3ba00f237bffc7d69e397a0fcc6bcc6))

## [3.48.0](https://github.com/entrostat/road-protect-fleet/compare/v3.47.0...v3.48.0) (2021-06-04)


### Features

* **client-reporting:** Separated owner and user for all graphing modules ([1a3f2f4](https://github.com/entrostat/road-protect-fleet/commit/1a3f2f46e77ccf58cb12b5284dd4043b29844fe1))
* **client-reporting:** Separated summary indicators into user/owner and fixed infringement projection queries ([3ad931b](https://github.com/entrostat/road-protect-fleet/commit/3ad931b9f2a185a09347fc0ca7f40b8ba73e7b22))


### Bug Fixes

* **client-reporting:** Added hide buttons to the infringement projection table ([69712f3](https://github.com/entrostat/road-protect-fleet/commit/69712f3a8887f0c01ef1703a00fea22883b88b3d))
* **client-reporting:** Ensured infringement projection queries and views align ([51f8f2e](https://github.com/entrostat/road-protect-fleet/commit/51f8f2e956eb26fbc0a45d8aaffc7fa9668a715f))
* **client-reporting:** Ensured reset to aggregated table on new view ([cf91425](https://github.com/entrostat/road-protect-fleet/commit/cf9142505ac0a2e54ad67dc6d2743a19bb50a92b))
* **client-reporting:** Removed errors when no valid information on infringement projections ([25e53c1](https://github.com/entrostat/road-protect-fleet/commit/25e53c107ff7f188e5932267cb746dcfabab08f1))
* **infringements-table:** Prevented infringement table from resetting when leaving vehicles table ([4b23f6a](https://github.com/entrostat/road-protect-fleet/commit/4b23f6a4b08d96819d565169479856c4dbdb0115))

## [3.47.0](https://github.com/entrostat/road-protect-fleet/compare/v3.46.0...v3.47.0) (2021-06-04)


### Features

* **raw-infringements:** Mapped latestPaymentDate to fine_pay_due_date in Metropark and Shohar ([11af95c](https://github.com/entrostat/road-protect-fleet/commit/11af95cfd7c03638efefb036b7f567d9eb5b0f12))

## [3.46.0](https://github.com/entrostat/road-protect-fleet/compare/v3.45.1...v3.46.0) (2021-06-04)


### Features

* **infringement-table:** Added batch redirections to the admin table ([19f468a](https://github.com/entrostat/road-protect-fleet/commit/19f468ad4a988c5f527a35c385a104dd40166dc5))

### [3.45.1](https://github.com/entrostat/road-protect-fleet/compare/v3.45.0...v3.45.1) (2021-06-03)


### Bug Fixes

* **dashboard:** Adjusted queries to match withBRN ([e814a9f](https://github.com/entrostat/road-protect-fleet/commit/e814a9f673e4ab2b81f6dd3470f7640265a41c80))

## [3.45.0](https://github.com/entrostat/road-protect-fleet/compare/v3.44.3...v3.45.0) (2021-06-03)


### Features

* **dashboard:** added outstanding infringement shortcuts ([339718b](https://github.com/entrostat/road-protect-fleet/commit/339718bfc6f779c035000f98337b594ff26b030e))

### [3.44.3](https://github.com/entrostat/road-protect-fleet/compare/v3.44.2...v3.44.3) (2021-06-03)


### Bug Fixes

* **infringements-table:** Adjusted vehicle user and vehicle owner queries to be different to accounts view to fix graphing ([4eb1175](https://github.com/entrostat/road-protect-fleet/commit/4eb1175f11651d8a188c667cda44c12ee6f2266e))

### [3.44.2](https://github.com/entrostat/road-protect-fleet/compare/v3.44.1...v3.44.2) (2021-06-03)


### Bug Fixes

* **infringements-table:** Removed brn for a vehicle user and vehicle owner on accounts view ([1f1a683](https://github.com/entrostat/road-protect-fleet/commit/1f1a6833fa692e5896ed9ed239b0771b0d0a4cc3))

### [3.44.1](https://github.com/entrostat/road-protect-fleet/compare/v3.44.0...v3.44.1) (2021-06-03)


### Bug Fixes

* **infringements-table:** Added brn for all view on accounts view ([c3aa5cb](https://github.com/entrostat/road-protect-fleet/commit/c3aa5cb1754e93966aa9b5d4d4c74cb866b5100e))

## [3.44.0](https://github.com/entrostat/road-protect-fleet/compare/v3.43.0...v3.44.0) (2021-06-02)


### Features

* **partial-infringements:** Added the current brn so that it dispatches to the crawlers ([91338a9](https://github.com/entrostat/road-protect-fleet/commit/91338a9f86716bf7a33a3de2b93d97faa33a066d))

## [3.43.0](https://github.com/entrostat/road-protect-fleet/compare/v3.42.6...v3.43.0) (2021-06-01)


### Features

* **client-reporting:** Added infringement details view to the popover for graphing by status and infringement projection ([bde6876](https://github.com/entrostat/road-protect-fleet/commit/bde68768e977c34aac469b9af59bfb38c5893be0))
* **client-reporting:** Compare to previous years by status and by vehicle ([ca2d9cf](https://github.com/entrostat/road-protect-fleet/commit/ca2d9cfdd5db69d4e0f177722a9336544fccee1f))
* **client-reporting:** Generalised the graphing by components to be multi-column and the same popover ([b6900ec](https://github.com/entrostat/road-protect-fleet/commit/b6900ecdb363614be023f7ff8822d24a1142029e))
* **graphing:** Made the graphing by tables multi-column ([3ef61be](https://github.com/entrostat/road-protect-fleet/commit/3ef61be69af42ed1fe99144f0db3974c3ef286b4))

### [3.42.6](https://github.com/entrostat/road-protect-fleet/compare/v3.42.5...v3.42.6) (2021-06-01)


### Bug Fixes

* **infringements-table:** Added a check for the existance and creation date of the infringement contract document ([741ebb1](https://github.com/entrostat/road-protect-fleet/commit/741ebb10df23c3a71457d7cdef274cff17387868))

### [3.42.5](https://github.com/entrostat/road-protect-fleet/compare/v3.42.4...v3.42.5) (2021-06-01)


### Bug Fixes

* **infringements-table:** Added a check for the existance and creation date of the infringement contract ([e15a59c](https://github.com/entrostat/road-protect-fleet/commit/e15a59c96c1a18117cc949c7d0ddba521c2d19b1))

### [3.42.4](https://github.com/entrostat/road-protect-fleet/compare/v3.42.3...v3.42.4) (2021-06-01)


### Bug Fixes

* **infringements-table:** Fixed the get most recent note function where there is no note ([2186a94](https://github.com/entrostat/road-protect-fleet/commit/2186a94251a25eda4394ff720bf6a783b9daf3cb))

### [3.42.3](https://github.com/entrostat/road-protect-fleet/compare/v3.42.2...v3.42.3) (2021-05-31)


### Bug Fixes

* **driver:** Added the driver as a string to crawler requests ([0e7a84f](https://github.com/entrostat/road-protect-fleet/commit/0e7a84f1747c85fbf38337030f88e27b864bb0a1))

### [3.42.2](https://github.com/entrostat/road-protect-fleet/compare/v3.42.1...v3.42.2) (2021-05-31)


### Bug Fixes

* **raw-infringements:** Added logging to determine if the infringement existis ([ae9755d](https://github.com/entrostat/road-protect-fleet/commit/ae9755d1846fa8c5259fb547918f38bbcbf98fb4))

### [3.42.1](https://github.com/entrostat/road-protect-fleet/compare/v3.42.0...v3.42.1) (2021-05-31)


### Bug Fixes

* **infringements-table:** Fixed the get most recent note reduce function ([a2bb61d](https://github.com/entrostat/road-protect-fleet/commit/a2bb61df308b574ef3038f238211d2258035f9cb))

## [3.42.0](https://github.com/entrostat/road-protect-fleet/compare/v3.41.6...v3.42.0) (2021-05-31)


### Features

* **infringement-table:** Added most recent infringement note to the infringement table ([d12031f](https://github.com/entrostat/road-protect-fleet/commit/d12031f020c15f5f1e3fda6a1706f82173e9edbc))

### [3.41.6](https://github.com/entrostat/road-protect-fleet/compare/v3.41.5...v3.41.6) (2021-05-31)


### Bug Fixes

* **redirections:** Removed endDate check for driver redirections ([869e747](https://github.com/entrostat/road-protect-fleet/commit/869e747e7c17a1ca082840724742d04f8d3c5af0))

### [3.41.5](https://github.com/entrostat/road-protect-fleet/compare/v3.41.4...v3.41.5) (2021-05-28)


### Bug Fixes

* **verifications:** Enabled crawler sync ([d359c44](https://github.com/entrostat/road-protect-fleet/commit/d359c448a86a2ecf2a861fbcda56807a872aa282))

### [3.41.4](https://github.com/entrostat/road-protect-fleet/compare/v3.41.3...v3.41.4) (2021-05-28)


### Bug Fixes

* **verifications:** Disabled verify unpaid infringements ([025c029](https://github.com/entrostat/road-protect-fleet/commit/025c029c9788a033c5228c0656083ec2cbd1b28b))

### [3.41.3](https://github.com/entrostat/road-protect-fleet/compare/v3.41.2...v3.41.3) (2021-05-28)


### Bug Fixes

* **infringements:** Removed endpoint to fix latest payments ([1aacaa9](https://github.com/entrostat/road-protect-fleet/commit/1aacaa932e33e644a4547e091be9ca7926010f46))
* **redirections:** added a check for a user email for redirection via email ([f0ea266](https://github.com/entrostat/road-protect-fleet/commit/f0ea26696e3ed494f711beaf7bf20e491b4bbf7e))

### [3.41.2](https://github.com/entrostat/road-protect-fleet/compare/v3.41.1...v3.41.2) (2021-05-27)


### Bug Fixes

* **infringements:** Adjusted fixed latest payments to only fix payments with no successful infringement ([0714871](https://github.com/entrostat/road-protect-fleet/commit/0714871dba9cef29ed1a8d6540e74e0a6a6ad42e))

### [3.41.1](https://github.com/entrostat/road-protect-fleet/compare/v3.41.0...v3.41.1) (2021-05-27)


### Bug Fixes

* **infringements:** Adjusted fixed latest payments to only fix infringement that have no payment ([3d78815](https://github.com/entrostat/road-protect-fleet/commit/3d78815b0bc20393bf65c9d93230a1e0cbb9e941))

## [3.41.0](https://github.com/entrostat/road-protect-fleet/compare/v3.40.10...v3.41.0) (2021-05-27)


### Features

* **infringements:** Linked the last successful payment to the infringement entity ([b544666](https://github.com/entrostat/road-protect-fleet/commit/b544666bb9cd8a006e876b087bc4b5d9f7bd3f79))

### [3.40.10](https://github.com/entrostat/road-protect-fleet/compare/v3.40.9...v3.40.10) (2021-05-27)


### Bug Fixes

* **infringement-view:** Added spacing to the payments views ([4db1d6e](https://github.com/entrostat/road-protect-fleet/commit/4db1d6ecb954b2248e51bddf0418eca2ff05a29f))
* **redirections:** Added a description for email redirections on the details view ([ebc9913](https://github.com/entrostat/road-protect-fleet/commit/ebc99134a470b4110fe6b2ff13e6008ddb0359b3))
* **templates:** Updated the municipal redirections email template ([35089bf](https://github.com/entrostat/road-protect-fleet/commit/35089bf9c20cce8becf2ef1c5ab1175b71b90f29))
* **translations:** Added missing English translations ([8b577dc](https://github.com/entrostat/road-protect-fleet/commit/8b577dc38794f8e63027d493915d8c2653ce4520))

### [3.40.9](https://github.com/entrostat/road-protect-fleet/compare/v3.40.8...v3.40.9) (2021-05-26)


### Bug Fixes

* **redirections:** Added a check for value null in jsonToFormData to prevent name of null error ([ef45117](https://github.com/entrostat/road-protect-fleet/commit/ef45117b57428f514648b0553789fb80b7b5fd59))

### [3.40.8](https://github.com/entrostat/road-protect-fleet/compare/v3.40.6...v3.40.8) (2021-05-26)


### Bug Fixes

* **redirections:** Adjusted logging to determine if file value is a buffer or null in jsonToFormData to prevent name of null error ([d127e9b](https://github.com/entrostat/road-protect-fleet/commit/d127e9b35391b258180e2739cd9c6bab376e2e82))
* **redirections:** Removed buffer from log in jsonToFormData to prevent name of null error ([cb99010](https://github.com/entrostat/road-protect-fleet/commit/cb990102120da6fd62f1c5296967fd77ea3a9f4b))

### [3.40.7](https://github.com/entrostat/road-protect-fleet/compare/v3.40.6...v3.40.7) (2021-05-26)


### Bug Fixes

* **redirections:** Adjusted logging to determine if file value is a buffer or null in jsonToFormData to prevent name of null error ([d127e9b](https://github.com/entrostat/road-protect-fleet/commit/d127e9b35391b258180e2739cd9c6bab376e2e82))

### [3.40.6](https://github.com/entrostat/road-protect-fleet/compare/v3.40.5...v3.40.6) (2021-05-26)


### Bug Fixes

* **redirections:** Adjusted logging to determine if file value is a buffer or null in jsonToFormData to prevent name of null error ([d571941](https://github.com/entrostat/road-protect-fleet/commit/d571941caf57dc93b4afa168b9ac7a026e1c1e0c))

### [3.40.5](https://github.com/entrostat/road-protect-fleet/compare/v3.40.4...v3.40.5) (2021-05-26)


### Bug Fixes

* **redirections:** Refactored declaration of file object in jsonToFormData to prevent name of null error ([189a4b8](https://github.com/entrostat/road-protect-fleet/commit/189a4b8a98aa954527e87da0a32a013c860cc657))

### [3.40.4](https://github.com/entrostat/road-protect-fleet/compare/v3.40.3...v3.40.4) (2021-05-26)


### Bug Fixes

* **redirections:** Refactored and added logging for creation of file on jsonToFormData to prevent name of null error ([f40df26](https://github.com/entrostat/road-protect-fleet/commit/f40df262c6f87b3f07dbbfc9e221e4eff85938df))

### [3.40.3](https://github.com/entrostat/road-protect-fleet/compare/v3.40.2...v3.40.3) (2021-05-26)


### Bug Fixes

* **redirections:** Added checks for driver and file options to prevent name of null error ([54faadc](https://github.com/entrostat/road-protect-fleet/commit/54faadc81eb2799e9de9fa6089c100b913d61b16))

### [3.40.2](https://github.com/entrostat/road-protect-fleet/compare/v3.40.1...v3.40.2) (2021-05-25)


### Bug Fixes

* **partial-infringements:** Added check if issuer is found ([f8942b5](https://github.com/entrostat/road-protect-fleet/commit/f8942b56d53f8b08278b5a7f257fb14caee36781))

### [3.40.1](https://github.com/entrostat/road-protect-fleet/compare/v3.40.0...v3.40.1) (2021-05-25)


### Bug Fixes

* **infringement-log:** Adjusted create process to check for properties and within a try catch ([2dcdba5](https://github.com/entrostat/road-protect-fleet/commit/2dcdba5b3d43a225435de2f4de93913fec74c1a2))

## [3.40.0](https://github.com/entrostat/road-protect-fleet/compare/v3.39.0...v3.40.0) (2021-05-25)


### Features

* **infringement-table:** Added total payments to the infringement view ([63cf340](https://github.com/entrostat/road-protect-fleet/commit/63cf34041c9b906e67c4f8740f1401f3e7194d6b))


### Bug Fixes

* **graphing:** Fixed the total count breakdown for the graphing by issuer component ([49edbb7](https://github.com/entrostat/road-protect-fleet/commit/49edbb743b8b6d94cd5c6f7ea6134ce1b60d25af))
* **partial-infringements:** Added extra logging for processing of partial infringements ([ff634eb](https://github.com/entrostat/road-protect-fleet/commit/ff634eb5c69690690f8613f21b2c8df3cc13b0d0))
* **user-preferences:** Allow for new columns on the table to overwrite preferences ([ac83130](https://github.com/entrostat/road-protect-fleet/commit/ac83130a73d5e0558ad389b314dd7d5b94f8d78d))

## [3.39.0](https://github.com/entrostat/road-protect-fleet/compare/v3.38.0...v3.39.0) (2021-05-25)


### Features

* **graphing:** Created a general graphing table and cell component ([9a9609e](https://github.com/entrostat/road-protect-fleet/commit/9a9609ede09806663c5e5e5f6afe76da97dcacec))


### Bug Fixes

* **contract-upload:** Prevented ocr error on lease contract update ([eaf4145](https://github.com/entrostat/road-protect-fleet/commit/eaf41455ea142c77ca2211f331c4f569cf039f67))
* **reporting:** Removed metabase reporting from the sidebar menu ([37f47b4](https://github.com/entrostat/road-protect-fleet/commit/37f47b45863a6db73d5e4d4ad9003719b06cafd4))

## [3.38.0](https://github.com/entrostat/road-protect-fleet/compare/v3.37.0...v3.38.0) (2021-05-24)


### Features

* **driver:** Added a create, view and spreadsheet uploader for the drivers module ([dbb5673](https://github.com/entrostat/road-protect-fleet/commit/dbb5673ef2048a9cbbdbbe4db6af98a5142cf356))
* **driver:** Added a view, create and spreadsheet uploader for ([fdda2a3](https://github.com/entrostat/road-protect-fleet/commit/fdda2a31c66ccfde05a8635276eb06e76a02abd2))
* **driver:** Created driver contracts spreadsheet uploader page ([f01c4a9](https://github.com/entrostat/road-protect-fleet/commit/f01c4a967275c79f60769756c4d51148360663f1))

## [3.37.0](https://github.com/entrostat/road-protect-fleet/compare/v3.36.0...v3.37.0) (2021-05-24)


### Features

* **infringement-table:** Added total payments to the infringement view ([2cd82f8](https://github.com/entrostat/road-protect-fleet/commit/2cd82f81888f08c63ad3e2df38db930cff11c82c))

## [3.36.0](https://github.com/entrostat/road-protect-fleet/compare/v3.35.2...v3.36.0) (2021-05-24)


### Features

* **sidebar:** Made the sidebar collapsible  ([c95cfe7](https://github.com/entrostat/road-protect-fleet/commit/c95cfe72ef3fb6f0ad71ba160aa8aab051c7642a))


### Bug Fixes

* **pagination:** Added a 100/page pagination filter ([fab3ff2](https://github.com/entrostat/road-protect-fleet/commit/fab3ff22475a0229961dfd8c9569cc7641263557))

### [3.35.2](https://github.com/entrostat/road-protect-fleet/compare/v3.35.1...v3.35.2) (2021-05-24)


### Bug Fixes

* **verifications:** A standard user can verify infringements" ([08d5690](https://github.com/entrostat/road-protect-fleet/commit/08d56907eafd8980489e66787caab1215f01e20e))

### [3.35.1](https://github.com/entrostat/road-protect-fleet/compare/v3.35.0...v3.35.1) (2021-05-24)


### Bug Fixes

* **contract-upload:** Fixed contract uploader to not check document ocr ([6b72010](https://github.com/entrostat/road-protect-fleet/commit/6b7201004f87e00546f23dd9476a77e502af24f8))

## [3.35.0](https://github.com/entrostat/road-protect-fleet/compare/v3.34.1...v3.35.0) (2021-05-21)


### Features

* **drivers:** Added a basic drivers module to the backed to redirect infringements to drivers ([d4ac7a9](https://github.com/entrostat/road-protect-fleet/commit/d4ac7a91d2aad298841f688f21cc49f8e6a5a769))
* **drivers:** Created a drivers contract  ([8537111](https://github.com/entrostat/road-protect-fleet/commit/8537111f81697bca3eb8c31a0c9dc6724e69e531))
* **drivers:** Created the drivers table ([08a0cb2](https://github.com/entrostat/road-protect-fleet/commit/08a0cb2a5dda6026a06c8f1043b8f3134e51ebe0))
* **drivers:** Linked driver contracts to redirections ([f71b180](https://github.com/entrostat/road-protect-fleet/commit/f71b18063fe2ce7bbb59501cadea6c1f5d645741))

### [3.34.1](https://github.com/entrostat/road-protect-fleet/compare/v3.34.0...v3.34.1) (2021-05-21)


### Bug Fixes

* **verifications:** Changed the Shohar verification request ([8190146](https://github.com/entrostat/road-protect-fleet/commit/819014664c942960ce3cc7c68bb4e4b631ee3d43))

## [3.34.0](https://github.com/entrostat/road-protect-fleet/compare/v3.33.2...v3.34.0) (2021-05-19)


### Features

* **summary-indicators:** Added a vehicle table to view for unmanaged vehicles  ([1333457](https://github.com/entrostat/road-protect-fleet/commit/1333457e3b8ca16ecb9720e1f76eebcfbc912283))


### Bug Fixes

* **infringement-projection:** Added a view vehicles for vehicles without infringements  ([4367cb1](https://github.com/entrostat/road-protect-fleet/commit/4367cb140ca0f34a99d4a9ca6ddf1b5de2b4589b))
* **summary-indicators:** Ensured correct manipulation when grouping the data by status and year  ([8ef4fd3](https://github.com/entrostat/road-protect-fleet/commit/8ef4fd35e7c1e72fde2c79ee0570980c9ab26df5))

### [3.33.2](https://github.com/entrostat/road-protect-fleet/compare/v3.33.1...v3.33.2) (2021-05-19)


### Bug Fixes

* **documentation:** disabled API requests within the documentations ([1e0e237](https://github.com/entrostat/road-protect-fleet/commit/1e0e2379757006388598bd75c58306ad4851342c))

### [3.33.1](https://github.com/entrostat/road-protect-fleet/compare/v3.33.0...v3.33.1) (2021-05-19)


### Bug Fixes

* **contracts:** Ensured contracts can be filtered on infringement view ([f4ededc](https://github.com/entrostat/road-protect-fleet/commit/f4ededc25755b49a4a5d4df4017690d9318fba0b))

## [3.33.0](https://github.com/entrostat/road-protect-fleet/compare/v3.32.1...v3.33.0) (2021-05-19)


### Features

* **infringement-view:** Added the contract ocrStatus and preventRedirections to the view ([a71f9ce](https://github.com/entrostat/road-protect-fleet/commit/a71f9ce9387901170271cb7f749164c10b243df3))
* **redirection:** Allowed admins to redirect infringements without logging in as owner ([c82097b](https://github.com/entrostat/road-protect-fleet/commit/c82097b1dde20cfd9f28329fd1935b346d6523b6))


### Bug Fixes

* **documentation:** Updated the documentation json file ([c18b863](https://github.com/entrostat/road-protect-fleet/commit/c18b86390b29fffd234f54a21af04b391e47f552))
* **infringement-view:** Relinked infringement user and owner ([ce326bd](https://github.com/entrostat/road-protect-fleet/commit/ce326bd1fea7c3a95598ccb7c9fba97cb2a9ee9a))

### [3.32.1](https://github.com/entrostat/road-protect-fleet/compare/v3.32.0...v3.32.1) (2021-05-18)


### Bug Fixes

* **contracts:** Added check for contract user, owner and vehicle to prevent internal error exception ([dd8e5d0](https://github.com/entrostat/road-protect-fleet/commit/dd8e5d07f74ceaea6395de97d7e7bcfacf5cea19))

## [3.32.0](https://github.com/entrostat/road-protect-fleet/compare/v3.31.0...v3.32.0) (2021-05-18)


### Features

* **contracts:** Added an ocr status and a prevent redirection property  ([98ab806](https://github.com/entrostat/road-protect-fleet/commit/98ab806a8e1cfa1838d9b5046df39a9d03273882))

## [3.31.0](https://github.com/entrostat/road-protect-fleet/compare/v3.30.4...v3.31.0) (2021-05-18)


### Features

* **node-and-antivirus:** Upgraded node and prevented antivirus from auto-updating ([e7a8b2d](https://github.com/entrostat/road-protect-fleet/commit/e7a8b2d06f97c70edb2bc7ab45be6ecd419a0dff))

### [3.30.4](https://github.com/entrostat/road-protect-fleet/compare/v3.30.3...v3.30.4) (2021-05-18)


### Bug Fixes

* **verifications:** Adjusted partial infringements to use issuer city code ([9565aaa](https://github.com/entrostat/road-protect-fleet/commit/9565aaa3b0a0bc0ec807179ba2cdd18e9a13bb0b))

### [3.30.3](https://github.com/entrostat/road-protect-fleet/compare/v3.30.2...v3.30.3) (2021-05-17)


### Bug Fixes

* **ingress:** Removed tls from the ingress ([433bbdf](https://github.com/entrostat/road-protect-fleet/commit/433bbdfa3fd5c561578f268984b70f2840450566))
* **partial-infringement:** Renamed issuerCode to issuerCityCode ([5ab5e8e](https://github.com/entrostat/road-protect-fleet/commit/5ab5e8e98f2ad1d6f24b844f8e78072369779bd1))

### [3.30.2](https://github.com/entrostat/road-protect-fleet/compare/v3.30.1...v3.30.2) (2021-05-17)


### Bug Fixes

* **verifications:** Adjusted atg synchronous verifications to use issuer city code ([08c2e1b](https://github.com/entrostat/road-protect-fleet/commit/08c2e1b8646ea38ac8da566d4e08511fff444862))

### [3.30.1](https://github.com/entrostat/road-protect-fleet/compare/v3.30.0...v3.30.1) (2021-05-17)


### Bug Fixes

* **queues:** Revert ATG redirection issuer code to use the issuer code ([f54aaa0](https://github.com/entrostat/road-protect-fleet/commit/f54aaa0f67f081584b1300eeb071f19438f6679b))

## [3.30.0](https://github.com/entrostat/road-protect-fleet/compare/v3.29.15...v3.30.0) (2021-05-17)


### Features

* **payments-table:** list payments made on an infringement ([b199ac7](https://github.com/entrostat/road-protect-fleet/commit/b199ac776ea248b4042a8ffe20667debcf6df976))


### Bug Fixes

* **queues:** Adjusted ATG code to use integration code instead of issuer code ([d315e5b](https://github.com/entrostat/road-protect-fleet/commit/d315e5b3fd1f178fc6d054fe46a29ae09f2791a1))

### [3.29.15](https://github.com/entrostat/road-protect-fleet/compare/v3.29.14...v3.29.15) (2021-05-17)


### Bug Fixes

* **queues:** Added check for issuer code using found issuer for partial infringements ([14544e5](https://github.com/entrostat/road-protect-fleet/commit/14544e5dc3c9983875f96f5098aedec208ab7a78))

### [3.29.14](https://github.com/entrostat/road-protect-fleet/compare/v3.29.13...v3.29.14) (2021-05-17)


### Bug Fixes

* **graphing:** Adjusted graphing by status to use the graphing table ([56ae32e](https://github.com/entrostat/road-protect-fleet/commit/56ae32e694c0335a04fcd0075b1fb7d47569133c))
* **graphing:** Made the status and total columns sticky on graphing by status ([9718d79](https://github.com/entrostat/road-protect-fleet/commit/9718d799109e17b5d2bdbb3be678e968cc75d258))
* **queues:** Removed logging of the processed variable in the errror logs ([88f2da7](https://github.com/entrostat/road-protect-fleet/commit/88f2da77ab1ebd21351b1973ef275d94cec0088e))

### [3.29.13](https://github.com/entrostat/road-protect-fleet/compare/v3.29.12...v3.29.13) (2021-05-14)


### Bug Fixes

* **queues:** Added logging and catch of an error from the promiseTimeout ([3303c54](https://github.com/entrostat/road-protect-fleet/commit/3303c54957c0484b54c3fdcc3ae3fc4b497e0b40))

### [3.29.12](https://github.com/entrostat/road-protect-fleet/compare/v3.29.11...v3.29.12) (2021-05-13)


### Bug Fixes

* **infringement-view:** select only infringementId and noticeNumber in logs ([4a9829d](https://github.com/entrostat/road-protect-fleet/commit/4a9829d18992fb66adb4b3eb9cad73c8ae28d880))
* **queue-workers:** Increased the number of concurrent requests ([2d4d2bb](https://github.com/entrostat/road-protect-fleet/commit/2d4d2bbfc71486ec021faa5b8a12a25a78e3fedd))

### [3.29.11](https://github.com/entrostat/road-protect-fleet/compare/v3.29.10...v3.29.11) (2021-05-13)


### Bug Fixes

* **documentation:** removed port binding address ([7b37282](https://github.com/entrostat/road-protect-fleet/commit/7b3728239c61b81e01efd971ce27b6f88d9053a5))
* **infringement-table:** Cleared query parameters when navigating from all views ([440710e](https://github.com/entrostat/road-protect-fleet/commit/440710ec7569af4a99261bef66c3cf7d5dad1123))

### [3.29.10](https://github.com/entrostat/road-protect-fleet/compare/v3.29.9...v3.29.10) (2021-05-13)


### Bug Fixes

* **verifications:** Added the create of an external payment into the try catch to find error ([e729a5e](https://github.com/entrostat/road-protect-fleet/commit/e729a5ef0555db2ae703d5d352ee12fbcb8f7751))

### [3.29.9](https://github.com/entrostat/road-protect-fleet/compare/v3.29.8...v3.29.9) (2021-05-13)


### Bug Fixes

* **verifications:** Added logging to create external payments to find error ([6e2ece2](https://github.com/entrostat/road-protect-fleet/commit/6e2ece2a37c0ce65648f28ec762feaf53d92b586))

### [3.29.8](https://github.com/entrostat/road-protect-fleet/compare/v3.29.7...v3.29.8) (2021-05-13)


### Bug Fixes

* **verifications:** Added logging to total payments to find error ([01bb3a3](https://github.com/entrostat/road-protect-fleet/commit/01bb3a399dca570787690181b930f3bfc42b323c))

### [3.29.7](https://github.com/entrostat/road-protect-fleet/compare/v3.29.6...v3.29.7) (2021-05-12)


### Bug Fixes

* **documentation:** Changed the bind-address port to 3123 from 3000 ([fc2d301](https://github.com/entrostat/road-protect-fleet/commit/fc2d3015afbc32d68db5ff46f7ffd02139f5fcd0))

### [3.29.6](https://github.com/entrostat/road-protect-fleet/compare/v3.29.5...v3.29.6) (2021-05-12)


### Bug Fixes

* **documentation:** Adjusted deployment yaml to include secret link ([881ee5d](https://github.com/entrostat/road-protect-fleet/commit/881ee5de0b055b32ea59510be5169c2228fb194e))

### [3.29.5](https://github.com/entrostat/road-protect-fleet/compare/v3.29.4...v3.29.5) (2021-05-12)


### Bug Fixes

* **documentation:** Adjusted env secrets ([dbc7fbe](https://github.com/entrostat/road-protect-fleet/commit/dbc7fbed048f1914787b9c8804ee38a15d0701f7))

### [3.29.4](https://github.com/entrostat/road-protect-fleet/compare/v3.29.3...v3.29.4) (2021-05-12)


### Bug Fixes

* **documentation:** Added the env file to git screts ([3fadd43](https://github.com/entrostat/road-protect-fleet/commit/3fadd43d284ec08ad78b3622ffbb2fd25ffdc4d8))

### [3.29.3](https://github.com/entrostat/road-protect-fleet/compare/v3.29.2...v3.29.3) (2021-05-12)


### Bug Fixes

* **documentation:** Adjusted deployment port and health check ([ae5ffa2](https://github.com/entrostat/road-protect-fleet/commit/ae5ffa29b21ac69843250b5e5a650f7f9a56cbe5))

### [3.29.2](https://github.com/entrostat/road-protect-fleet/compare/v3.29.1...v3.29.2) (2021-05-12)


### Bug Fixes

* **documentation:** Added a Dockerfile to the documentation folder ([d858f47](https://github.com/entrostat/road-protect-fleet/commit/d858f4763a576d8b37d8fbbbb633099a2f2014e6))

### [3.29.1](https://github.com/entrostat/road-protect-fleet/compare/v3.29.0...v3.29.1) (2021-05-12)


### Bug Fixes

* **documentation:** Amended GitHub actions for documentation deployment ([7e5bd4a](https://github.com/entrostat/road-protect-fleet/commit/7e5bd4ac3320f97dfc3cc64f120cbed1b0118d6d))

## [3.29.0](https://github.com/entrostat/road-protect-fleet/compare/v3.28.3...v3.29.0) (2021-05-12)


### Features

* **api-documentation:** Linked documentation to ngrx ([034a18b](https://github.com/entrostat/road-protect-fleet/commit/034a18bc5dde379bba1e0ca79eee7f5ab359efad))
* **documentation:** Added documentation using dapperdox ([4fc8f49](https://github.com/entrostat/road-protect-fleet/commit/4fc8f49c251bb888f4e4cc288effeb49dd3965b9))
* **documentation:** Added error codes to all of the endpoints ([9bd826e](https://github.com/entrostat/road-protect-fleet/commit/9bd826e163114a360cb0b22201d4c792a8153011))
* **documentation:** Added nodejs and python code examples to the documentation ([9c0f54a](https://github.com/entrostat/road-protect-fleet/commit/9c0f54abd439b5ebc5ee3c932a62ec345a6fbec7))
* **documentation:** Added overlays and upgraded dapperdox ([5d5a097](https://github.com/entrostat/road-protect-fleet/commit/5d5a097960254fb2dcb7333c6690396e0ac137ea))
* **documentation:** Added prod deployment ([ff12850](https://github.com/entrostat/road-protect-fleet/commit/ff128509ba411981cf62e1579f5bae718bebe91c))
* **documentation:** Linked dapperdox to the api and set up CORs communication  ([e6f93e9](https://github.com/entrostat/road-protect-fleet/commit/e6f93e9ca61a4a3aa937f85d62565f03c947a336))
* **documentation:** Linked existing swagger docs to dapper ([cf4f2db](https://github.com/entrostat/road-protect-fleet/commit/cf4f2dbc8c6657731463d945a810d06feb36b689))


### Bug Fixes

* **documentation:** Added missing details from request dtos  ([d124642](https://github.com/entrostat/road-protect-fleet/commit/d124642b0fc8476768b81895d4bbf9ac457110fb))
* **documentation:** Adjusted naming conventions for requests to be the description ([0f8962f](https://github.com/entrostat/road-protect-fleet/commit/0f8962f168448aa7435d4c48ed3b222ffefb27e3))
* **documentation:** Adjusted url to docs.localhost ([b09f03c](https://github.com/entrostat/road-protect-fleet/commit/b09f03c2448002a0ab06498698923f0e55d55ebf))
* **documentation:** Converted the swagger.json from open-api: 3.0.0 to Swagger: 2.0 ([c88c57e](https://github.com/entrostat/road-protect-fleet/commit/c88c57ef4fe07856647e12221f23aa3d38a7a295))

### [3.28.3](https://github.com/entrostat/road-protect-fleet/compare/v3.28.2...v3.28.3) (2021-05-10)

### [3.28.2](https://github.com/entrostat/road-protect-fleet/compare/v3.28.1...v3.28.2) (2021-05-10)


### Bug Fixes

* **crawlers:** Disabled scheduled ATG verifications ([7ad8503](https://github.com/entrostat/road-protect-fleet/commit/7ad8503e7e42df71da7034c3c753a304b3349d76))

### [3.28.1](https://github.com/entrostat/road-protect-fleet/compare/v3.28.0...v3.28.1) (2021-05-10)


### Bug Fixes

* **crawlers:** disable scheduled verifications  ([7f3b5a3](https://github.com/entrostat/road-protect-fleet/commit/7f3b5a3b89356eadb236a2b8c0ca4c6caa2429e6))

## [3.28.0](https://github.com/entrostat/road-protect-fleet/compare/v3.27.10...v3.28.0) (2021-05-08)


### Features

* **user-preference:** A user's frontend preferences is stored on the user profile ([9e8238c](https://github.com/entrostat/road-protect-fleet/commit/9e8238c9bfe402255acfbbe7acb8b4973dc0575d))


### Bug Fixes

* **infringement-cost-calculation:** infringement cost graphs no longer tries to display null values from calculation  ([0e56b02](https://github.com/entrostat/road-protect-fleet/commit/0e56b02d78984e98d052588cce578894a0f0a5c4))
* **infringement-report:** Send the infringement reports at 9am on Sundays ([2ea5ad0](https://github.com/entrostat/road-protect-fleet/commit/2ea5ad00c819497809bdb6c35430616ed2b92e6b))
* **reset-query-parameter:** query parameters are reset to initial state when navigating from infringement-projection view ([8ffa8a1](https://github.com/entrostat/road-protect-fleet/commit/8ffa8a11ed08317b0a6d50679033d59b4db79ba9))

### [3.27.10](https://github.com/entrostat/road-protect-fleet/compare/v3.27.9...v3.27.10) (2021-05-06)


### Bug Fixes

* **payments:** Adjusted the ATG request format ([b707caf](https://github.com/entrostat/road-protect-fleet/commit/b707caf64fde03365856d08529c950f402997730))

### [3.27.9](https://github.com/entrostat/road-protect-fleet/compare/v3.27.8...v3.27.9) (2021-05-05)

### [3.27.8](https://github.com/entrostat/road-protect-fleet/compare/v3.27.7...v3.27.8) (2021-05-05)


### Bug Fixes

* **atg-payment:** Remove circular data before encrypting it on logger ([3be2c76](https://github.com/entrostat/road-protect-fleet/commit/3be2c765d7c017ff529371f4ab7fd86ab338432f))

### [3.27.7](https://github.com/entrostat/road-protect-fleet/compare/v3.27.6...v3.27.7) (2021-05-05)


### Bug Fixes

* **atg-verification:** Removed the old verification request  ([c1fd161](https://github.com/entrostat/road-protect-fleet/commit/c1fd161dd0aba915a0d48d4c9f1ca7acdfccb594))

### [3.27.6](https://github.com/entrostat/road-protect-fleet/compare/v3.27.5...v3.27.6) (2021-05-05)


### Bug Fixes

* **atg-verification:** Refactored ATG verification to use the newer synchronous verification ([5aaa769](https://github.com/entrostat/road-protect-fleet/commit/5aaa769106ddada76b452ee8ef0091bc0a40f37a))

### [3.27.5](https://github.com/entrostat/road-protect-fleet/compare/v3.27.4...v3.27.5) (2021-05-04)


### Bug Fixes

* **atg-integration:** Expect the response from the atg integration to be text but retrieve it from the body ([2cec7ee](https://github.com/entrostat/road-protect-fleet/commit/2cec7ee17529ead141d9ca88f4f67863ed7e83cf))

### [3.27.4](https://github.com/entrostat/road-protect-fleet/compare/v3.27.3...v3.27.4) (2021-05-04)


### Bug Fixes

* **verification:** Added extra logging and checks for updating total payments ([f94b41e](https://github.com/entrostat/road-protect-fleet/commit/f94b41e5a6da544676508eff905211e9f59ecf50))

### [3.27.3](https://github.com/entrostat/road-protect-fleet/compare/v3.27.2...v3.27.3) (2021-05-04)


### Bug Fixes

* **verification:** Added an extra check for updating total payments ([12a17d7](https://github.com/entrostat/road-protect-fleet/commit/12a17d787da68132b8f4f78336f373f0ff50ba15))

### [3.27.2](https://github.com/entrostat/road-protect-fleet/compare/v3.27.1...v3.27.2) (2021-05-04)


### Bug Fixes

* **queues:** Adjusted queue worker timeouts to 2 mins ([307264e](https://github.com/entrostat/road-protect-fleet/commit/307264efeb356499b41a2c2f392f14ec0c66688d))

### [3.27.1](https://github.com/entrostat/road-protect-fleet/compare/v3.27.0...v3.27.1) (2021-05-04)


### Bug Fixes

* **payments:** Added an endpoint to rerun payment calculations for NaN values ([e92de44](https://github.com/entrostat/road-protect-fleet/commit/e92de44e8f0e62faed0c9e269651eff5ae2c8449))
* **redirection-view:** lease document can be uploaded on the redirection view ([a16446b](https://github.com/entrostat/road-protect-fleet/commit/a16446b3936a8b5ecf7fa219f2d9bd4a41962cee))

## [3.27.0](https://github.com/entrostat/road-protect-fleet/compare/v3.26.6...v3.27.0) (2021-05-04)


### Features

* **email-service:** Added a table to log all attempted emails sent using the email service and logs their success or failure ([af90467](https://github.com/entrostat/road-protect-fleet/commit/af9046757dba9915fff1b772c36efd41bf3f3a53))

### [3.26.6](https://github.com/entrostat/road-protect-fleet/compare/v3.26.5...v3.26.6) (2021-05-04)


### Bug Fixes

* **account-relations:** Fixed the html to pdf request to read the html as a body rather than a route ([905271d](https://github.com/entrostat/road-protect-fleet/commit/905271d7a651f47605d850c6fad40ac0e6196e31))
* **perform-ocr-on-dcument-for-lease-contract:** ocr is performed on lease contracts ([bef4893](https://github.com/entrostat/road-protect-fleet/commit/bef4893d4c862ddd78570949a98f0bf4c4f0b0c4))

### [3.26.5](https://github.com/entrostat/road-protect-fleet/compare/v3.26.4...v3.26.5) (2021-05-03)


### Bug Fixes

* **account-relations:** Added extra logging and adjusted cron time to 15:45 on a Monday ([b3037df](https://github.com/entrostat/road-protect-fleet/commit/b3037df22552db721dece55268c48fbe5c2c93fb))

### [3.26.4](https://github.com/entrostat/road-protect-fleet/compare/v3.26.3...v3.26.4) (2021-05-03)


### Bug Fixes

* **account-relations:** Adjused cron to run at 10am every Monday ([e3c853c](https://github.com/entrostat/road-protect-fleet/commit/e3c853c23e67770e874de3cb6c7e638fd81b7af8))

### [3.26.3](https://github.com/entrostat/road-protect-fleet/compare/v3.26.2...v3.26.3) (2021-05-03)


### Bug Fixes

* **account-relations:** Updated the account relations cron to run at 9:30am on Mondays ([0a0c900](https://github.com/entrostat/road-protect-fleet/commit/0a0c900a3a60dddf7327e103137762afac81913b))

### [3.26.2](https://github.com/entrostat/road-protect-fleet/compare/v3.26.1...v3.26.2) (2021-05-03)


### Bug Fixes

* **adjust-graphing-by-pages-date-sliders:** date sliders are adjustable and display content in RTL ([663d480](https://github.com/entrostat/road-protect-fleet/commit/663d4804a93964b153e2b8d5f3226117757e2c85))
* **atg-scheduler:** Updated the ATG scheduler to run at 3am ([a2e4370](https://github.com/entrostat/road-protect-fleet/commit/a2e4370f66adbddfbef053f9f0702f4fae16afb3))

### [3.26.1](https://github.com/entrostat/road-protect-fleet/compare/v3.26.0...v3.26.1) (2021-05-03)


### Bug Fixes

* **account-relations:** Fixed the infringement reporting cron job values ([d2720c9](https://github.com/entrostat/road-protect-fleet/commit/d2720c9a0cbd4596d92dcc1564402ec863396e2f))

## [3.26.0](https://github.com/entrostat/road-protect-fleet/compare/v3.25.0...v3.26.0) (2021-04-30)


### Features

* **crawlers:** Enabled ATG address validation for redirections ([01144b4](https://github.com/entrostat/road-protect-fleet/commit/01144b48058156139cb96032d978eff0c1a45507))

## [3.25.0](https://github.com/entrostat/road-protect-fleet/compare/v3.24.0...v3.25.0) (2021-04-30)


### Features

* **crawlers:** Disabled ATG address validation for redirections ([96b62ef](https://github.com/entrostat/road-protect-fleet/commit/96b62effada44204789c859a80b745c65ad83dbe))


### Bug Fixes

* **add-years-to-general-slider:** year range of a selected period is now visible to user  ([d50524c](https://github.com/entrostat/road-protect-fleet/commit/d50524c3c73605155ef4757ca12b746a9e7a56b9))
* **upload-poa-on-redirecetion-page:** poa can be uploaded successfully on the redirection view ([f0d1e26](https://github.com/entrostat/road-protect-fleet/commit/f0d1e261daf73ef72c8149519a742ffe3b02a0dd))

## [3.24.0](https://github.com/entrostat/road-protect-fleet/compare/v3.23.22...v3.24.0) (2021-04-28)


### Features

* **jobs:** A scheduler to cancel jobs that are waiting in queued or in-process for more than a week ([e211941](https://github.com/entrostat/road-protect-fleet/commit/e211941d394ab2c08ad20ac6742e0c29665b7d9f))
* **verifications:** Added endpoints for batch synchronous verification ([a5cf0f7](https://github.com/entrostat/road-protect-fleet/commit/a5cf0f7c6fb405d5c9d8585e7131bd6981b02f81))


### Bug Fixes

* **queues:** Added a promise timeout to the job queues of 5 minutes  ([43f138e](https://github.com/entrostat/road-protect-fleet/commit/43f138e72f4a23de550f7d15164b308bb79d8451))

### [3.23.22](https://github.com/entrostat/road-protect-fleet/compare/v3.23.21...v3.23.22) (2021-04-28)


### Bug Fixes

* **vehicles-view:** Removed an unnecessary plainToClass that produced JS errors ([da29c9c](https://github.com/entrostat/road-protect-fleet/commit/da29c9c2d801df036510e63f9e3c989061e2ef6a))

### [3.23.21](https://github.com/entrostat/road-protect-fleet/compare/v3.23.20...v3.23.21) (2021-04-26)


### Bug Fixes

* **requests:** Ignore the undefined value in the form ([4bb6029](https://github.com/entrostat/road-protect-fleet/commit/4bb602920c265d6ac32babcf2f9c35b000547fac))

### [3.23.20](https://github.com/entrostat/road-protect-fleet/compare/v3.23.19...v3.23.20) (2021-04-26)


### Bug Fixes

* **logging:** Added logging for debugging in the form converter ([2a21076](https://github.com/entrostat/road-protect-fleet/commit/2a21076f270395138d460ef4fe3a7820f25907aa))

### [3.23.19](https://github.com/entrostat/road-protect-fleet/compare/v3.23.17...v3.23.19) (2021-04-26)


### Bug Fixes

* **http-client:** Using Object.key instead of for in loop ([04969d2](https://github.com/entrostat/road-protect-fleet/commit/04969d24da648ccac6874a47a6748801454c309d))

### [3.23.18](https://github.com/entrostat/road-protect-fleet/compare/v3.23.17...v3.23.18) (2021-04-26)


### Bug Fixes

* **http-client:** Using Object.key instead of for in loop ([04969d2](https://github.com/entrostat/road-protect-fleet/commit/04969d24da648ccac6874a47a6748801454c309d))

### [3.23.17](https://github.com/entrostat/road-protect-fleet/compare/v3.23.16...v3.23.17) (2021-04-26)


### Bug Fixes

* **http-client:** Use instances to determine if a file is involved ([362425d](https://github.com/entrostat/road-protect-fleet/commit/362425d153e06fffe847ca93ae4328faa298f368))

### [3.23.16](https://github.com/entrostat/road-protect-fleet/compare/v3.23.15...v3.23.16) (2021-04-26)


### Bug Fixes

* **http-client:** Modified the file upload logic to check if there's an object first ([5df1df9](https://github.com/entrostat/road-protect-fleet/commit/5df1df9f3ac8118196724ddac8d7366bb82338c6))

### [3.23.15](https://github.com/entrostat/road-protect-fleet/compare/v3.23.14...v3.23.15) (2021-04-26)


### Bug Fixes

* **redirections:** Added debugging logs ([76a25f8](https://github.com/entrostat/road-protect-fleet/commit/76a25f881eb2a3b2748ea5b685e2c14993942662))

### [3.23.14](https://github.com/entrostat/road-protect-fleet/compare/v3.23.13...v3.23.14) (2021-04-26)


### Bug Fixes

* **redirections:** Trying to ensure that the redirection can run without failing - currently I'm seeing "Cannot read name of null" ([73f908f](https://github.com/entrostat/road-protect-fleet/commit/73f908f587b4f7f6b2874636a2d8ed4f89bd5b3a))

### [3.23.13](https://github.com/entrostat/road-protect-fleet/compare/v3.23.12...v3.23.13) (2021-04-26)


### Bug Fixes

* **redirection-validators:** Added is optional to all of the customer details ([5d08d4a](https://github.com/entrostat/road-protect-fleet/commit/5d08d4a006353e52f08a8f4703b54f7bfd1ad2d5))

### [3.23.12](https://github.com/entrostat/road-protect-fleet/compare/v3.23.11...v3.23.12) (2021-04-26)


### Bug Fixes

* **redirection-validation:** Added loggers for the failed validation of the redirection body ([d4fb454](https://github.com/entrostat/road-protect-fleet/commit/d4fb4545789f8a39856bce03e53c53e44841cab3))

### [3.23.11](https://github.com/entrostat/road-protect-fleet/compare/v3.23.10...v3.23.11) (2021-04-26)


### Bug Fixes

* **redirections:** Allow for owner street to be undefined ([de71831](https://github.com/entrostat/road-protect-fleet/commit/de71831a72b38cbf615e31cce98fb9ec186fafcb))

### [3.23.10](https://github.com/entrostat/road-protect-fleet/compare/v3.23.9...v3.23.10) (2021-04-26)


### Bug Fixes

* **telaviv:** Removed the redirectionDoc key because it's inherited ([083f442](https://github.com/entrostat/road-protect-fleet/commit/083f442f95939be42d88ef9fb2fd21d19c2b81df))

### [3.23.9](https://github.com/entrostat/road-protect-fleet/compare/v3.23.8...v3.23.9) (2021-04-26)


### Bug Fixes

* **requests:** Removed encoding and typed the document type so that plainToClass would pick it up ([8dabff7](https://github.com/entrostat/road-protect-fleet/commit/8dabff7fb5f31c1388d123fafaeb74552abca6c0))

### [3.23.8](https://github.com/entrostat/road-protect-fleet/compare/v3.23.7...v3.23.8) (2021-04-26)


### Bug Fixes

* **encoding:** Don't encode using binary ([323d5de](https://github.com/entrostat/road-protect-fleet/commit/323d5deac7f00ddfe72008ac2f74ae318da00713))

### [3.23.7](https://github.com/entrostat/road-protect-fleet/compare/v3.23.6...v3.23.7) (2021-04-26)


### Bug Fixes

* **request:** Extract the buffer using then instead of .buffer() ([9c956ce](https://github.com/entrostat/road-protect-fleet/commit/9c956ce822e87eb3441ca8d9a91c28ae2d9fc073))

### [3.23.6](https://github.com/entrostat/road-protect-fleet/compare/v3.23.5...v3.23.6) (2021-04-25)


### Bug Fixes

* **cron:** Changed the reporting to run on Mondays ([bc5411c](https://github.com/entrostat/road-protect-fleet/commit/bc5411c97e32f86a4a03a164828ed9ec98ac4341))

### [3.23.5](https://github.com/entrostat/road-protect-fleet/compare/v3.23.4...v3.23.5) (2021-04-23)


### Bug Fixes

* **crawlers:** Removed postal code from Police and Jerusalem ([f55fa56](https://github.com/entrostat/road-protect-fleet/commit/f55fa56555829e302a0c62b74e741fedcc218710))

### [3.23.4](https://github.com/entrostat/road-protect-fleet/compare/v3.23.3...v3.23.4) (2021-04-23)


### Bug Fixes

* **crawlers:** Removed redirection address requirements and removed unused body from the toolkit merge ([9114a0c](https://github.com/entrostat/road-protect-fleet/commit/9114a0c4dc7f071c961c93e935d1c27529312ba8))

### [3.23.3](https://github.com/entrostat/road-protect-fleet/compare/v3.23.2...v3.23.3) (2021-04-23)

### [3.23.2](https://github.com/entrostat/road-protect-fleet/compare/v3.23.1...v3.23.2) (2021-04-23)


### Bug Fixes

* **crawlers:** Adjusted the merging pdf to have a contentType for each file ([961de4d](https://github.com/entrostat/road-protect-fleet/commit/961de4db5ea7b4a27bd84087d2b25a1fb5cc849c))

### [3.23.1](https://github.com/entrostat/road-protect-fleet/compare/v3.23.0...v3.23.1) (2021-04-22)


### Bug Fixes

* **redirections:** Added extra logging to try determine why pdf is not generated ([7ce6048](https://github.com/entrostat/road-protect-fleet/commit/7ce6048aa4190d6c5b85cd4aae0e546560e0b134))

## [3.23.0](https://github.com/entrostat/road-protect-fleet/compare/v3.22.0...v3.23.0) (2021-04-22)


### Features

* **match-column-headings-on-upload:** spreadsheet headings are mapped to column headings ([90537e0](https://github.com/entrostat/road-protect-fleet/commit/90537e09eb32d765a0daac9a9591eb32a106b687))


### Bug Fixes

* **redirections:** Added extra logging for merge document error handling  ([1b668d3](https://github.com/entrostat/road-protect-fleet/commit/1b668d3787d4b16415122d5dcb7cbcf79bbc25ba))

## [3.22.0](https://github.com/entrostat/road-protect-fleet/compare/v3.21.2...v3.22.0) (2021-04-21)


### Features

* **infringement-projections:** Added a view vehicles to the infringement projection view ([3ec3f24](https://github.com/entrostat/road-protect-fleet/commit/3ec3f24765010c5fd4795707a0400309b047701d))


### Bug Fixes

* **crawlers:** Increase the partial infringement processing chunk size and removed address details from the redirection details ([5f68e8c](https://github.com/entrostat/road-protect-fleet/commit/5f68e8c2b206852979455f7afb9c2d348658764b))

### [3.21.2](https://github.com/entrostat/road-protect-fleet/compare/v3.21.1...v3.21.2) (2021-04-21)


### Bug Fixes

* **crawlers:** Updated the Shohar and Metropark verifications for the new request format ([ef0de76](https://github.com/entrostat/road-protect-fleet/commit/ef0de7681d1ba402e5ce84561f6cdac6dd856b86))

### [3.21.1](https://github.com/entrostat/road-protect-fleet/compare/v3.21.0...v3.21.1) (2021-04-21)


### Bug Fixes

* **add-ownership-contract:** an ownership can added on the vehicle view ([20e0b44](https://github.com/entrostat/road-protect-fleet/commit/20e0b44ff7a29c0324494b1b35aceda9af2c91b2))
* **client-reporting:** Fixed the date sliders so that they render in RTL correctly ([cf8e477](https://github.com/entrostat/road-protect-fleet/commit/cf8e477bd1f6c4eda0906a41a043ff5bfac1ce8d))
* **crawlers:** Updated the crawler verification request ([9880f61](https://github.com/entrostat/road-protect-fleet/commit/9880f6198596b5ba7290e3620dfd933f386eadb4))
* **infringement-projections:** Made the offence column sticky for English and Hebrew ([8d88ae1](https://github.com/entrostat/road-protect-fleet/commit/8d88ae1b4f8ce54a83afc44b1c877b0cb5b56f23))
* **summary-indicators:** Added clarification and styling changes to the summary indicators page ([d893063](https://github.com/entrostat/road-protect-fleet/commit/d893063ea7db68feab3541857ff9e0cb5b30f2aa))
* **update-vehicle-view-after-deleting-lease:** vehicle view updates after deletion of contract ([2f3c297](https://github.com/entrostat/road-protect-fleet/commit/2f3c297876a380becf06d7f09f10cabc47475381))

## [3.21.0](https://github.com/entrostat/road-protect-fleet/compare/v3.20.9...v3.21.0) (2021-04-19)


### Features

* **crawlers:** created a general crawler redirection service that extended by all crawlers ([71918f2](https://github.com/entrostat/road-protect-fleet/commit/71918f2eca4dd0d743e7a732cc1fd76d5344ed8c))

### [3.20.9](https://github.com/entrostat/road-protect-fleet/compare/v3.20.8...v3.20.9) (2021-04-19)


### Bug Fixes

* **crawlers:** Updated the Jerusalem response to include a JSON.parse ([5cbc65f](https://github.com/entrostat/road-protect-fleet/commit/5cbc65fc595717abc8cac2f21b905bf6f5132037))

### [3.20.8](https://github.com/entrostat/road-protect-fleet/compare/v3.20.7...v3.20.8) (2021-04-19)


### Bug Fixes

* **crawlers:** Adjusted the crawler response for new response format ([f8be6e0](https://github.com/entrostat/road-protect-fleet/commit/f8be6e0fbecae251e1e95ff0db7c8220b7f54dc4))
* **total-payment-calculations:** Adjusted total payments to prevent NaN result ([bb70987](https://github.com/entrostat/road-protect-fleet/commit/bb70987e88ca7084f3c7b558a7aeee9793afe391))

### [3.20.7](https://github.com/entrostat/road-protect-fleet/compare/v3.20.6...v3.20.7) (2021-04-19)


### Bug Fixes

* **crawlers:** Adjusted error message for redirections ([d586d06](https://github.com/entrostat/road-protect-fleet/commit/d586d0622440eb7dd4ffcf27ad210cb14904a8ad))

### [3.20.6](https://github.com/entrostat/road-protect-fleet/compare/v3.20.5...v3.20.6) (2021-04-18)


### Bug Fixes

* **redirections:** Changed the upload document type on all of the crawlers ([e055e44](https://github.com/entrostat/road-protect-fleet/commit/e055e44b88626ad11ccec101afcc26e978c6569e))

### [3.20.5](https://github.com/entrostat/road-protect-fleet/compare/v3.20.4...v3.20.5) (2021-04-18)


### Bug Fixes

* **redirections:** Fixed the Telaviv redirection file entry ([37dec11](https://github.com/entrostat/road-protect-fleet/commit/37dec112faef31a00706f227c6301f5475eb029b))

### [3.20.4](https://github.com/entrostat/road-protect-fleet/compare/v3.20.3...v3.20.4) (2021-04-18)


### Bug Fixes

* **cron:** Daylight savings puts the cron out by 1 hour ([85324fb](https://github.com/entrostat/road-protect-fleet/commit/85324fb5feae0ac346eb924426dfe93718866faa))

### [3.20.3](https://github.com/entrostat/road-protect-fleet/compare/v3.20.2...v3.20.3) (2021-04-18)


### Bug Fixes

* **cron:** Modified the string so that 0 is Sunday not 7 ([d1a4f70](https://github.com/entrostat/road-protect-fleet/commit/d1a4f706231f05be5119c05a079d0ae2b6d8b7b9))

### [3.20.2](https://github.com/entrostat/road-protect-fleet/compare/v3.20.1...v3.20.2) (2021-04-17)


### Bug Fixes

* **schedulers:** Enabled the mailers again for the reporting by account relation ([7f1bb16](https://github.com/entrostat/road-protect-fleet/commit/7f1bb16867973b93c9f3e67dfc9dc05617f906aa))

### [3.20.1](https://github.com/entrostat/road-protect-fleet/compare/v3.20.0...v3.20.1) (2021-04-16)


### Bug Fixes

* **summary-indicators:** Minor fixes to summary indicators display ([0924b5f](https://github.com/entrostat/road-protect-fleet/commit/0924b5f9fa6da3371fd3f598911227a82a62d89a))

## [3.20.0](https://github.com/entrostat/road-protect-fleet/compare/v3.19.0...v3.20.0) (2021-04-16)


### Features

* **summary-indicators:** Added graphing and yearly comparisons to the summary indicators view  ([a222fde](https://github.com/entrostat/road-protect-fleet/commit/a222fdea10b49a4ad11950f5df42bb931e0a73ca))

## [3.19.0](https://github.com/entrostat/road-protect-fleet/compare/v3.18.7...v3.19.0) (2021-04-15)


### Features

* **request-library:** Replaced request library with got ([fd7ab86](https://github.com/entrostat/road-protect-fleet/commit/fd7ab860243a2f69c8f32a579abda5159299b8b2))

### [3.18.7](https://github.com/entrostat/road-protect-fleet/compare/v3.18.6...v3.18.7) (2021-04-14)


### Bug Fixes

* **crawlers:** Adjusted Mileon redirection request so that the form is sent ([32ce448](https://github.com/entrostat/road-protect-fleet/commit/32ce448bf9ec1f256a3ad30f4d1257d69461eee0))

### [3.18.6](https://github.com/entrostat/road-protect-fleet/compare/v3.18.5...v3.18.6) (2021-04-13)


### Bug Fixes

* **mileon-crawler:** Removed form form logger to ensure request is sent ([f6359a7](https://github.com/entrostat/road-protect-fleet/commit/f6359a71578fe8a8f9fdf7cd6e078510b86a9441))
* **update-view-for-document-upload:** contract and account view update after document upload ([6532d82](https://github.com/entrostat/road-protect-fleet/commit/6532d8212c2d70a8c9258914b192db29e65ad4ea))

### [3.18.5](https://github.com/entrostat/road-protect-fleet/compare/v3.18.4...v3.18.5) (2021-04-11)


### Bug Fixes

* **invalid-status-transition:** The capitalisation is failing in the query so I'm just removing the table names ([a27335e](https://github.com/entrostat/road-protect-fleet/commit/a27335ea875a237d51bef18ef6f6ab9c4ef94fea))

### [3.18.4](https://github.com/entrostat/road-protect-fleet/compare/v3.18.3...v3.18.4) (2021-04-11)


### Bug Fixes

* **invalid-status-transitions:** Enabled the endpoint to fix the invalid status transition ([0be04fa](https://github.com/entrostat/road-protect-fleet/commit/0be04fabc5baa07aaf376b78b2bd7d842d539b7f))

### [3.18.3](https://github.com/entrostat/road-protect-fleet/compare/v3.18.2...v3.18.3) (2021-04-11)


### Bug Fixes

* **logging:** Set the log type to warning instead of standard ([39aff9b](https://github.com/entrostat/road-protect-fleet/commit/39aff9bb1f0187b53e75b9c159875bd3a32e103d))

### [3.18.2](https://github.com/entrostat/road-protect-fleet/compare/v3.18.1...v3.18.2) (2021-04-11)


### Bug Fixes

* **infringement-status:** Needed to specify the controller path for this fix endpoint ([9d21f83](https://github.com/entrostat/road-protect-fleet/commit/9d21f83eb48310a28c61daf410ef12a98925015f))

### [3.18.1](https://github.com/entrostat/road-protect-fleet/compare/v3.18.0...v3.18.1) (2021-04-11)


### Bug Fixes

* **infringement-status:** Created a service to fix the infringements where the status transitions were not allowed ([cb08c49](https://github.com/entrostat/road-protect-fleet/commit/cb08c496fefb135d7305554124e3e7a7ebbc8546))

## [3.18.0](https://github.com/entrostat/road-protect-fleet/compare/v3.17.2...v3.18.0) (2021-04-09)


### Features

* **summary-indicators:** Added redirection and unmanaged vehicles ([1a7a979](https://github.com/entrostat/road-protect-fleet/commit/1a7a9794b25a1a145385d699d985426246791410))
* **summary-indicators:** Created a basic indicators board ([7b16d5c](https://github.com/entrostat/road-protect-fleet/commit/7b16d5cf716786053ad3f6831e37af95303f7715))
* **summary-indicators:** Created a summary indicators page ([ecb6b4d](https://github.com/entrostat/road-protect-fleet/commit/ecb6b4d6a0c7709ac17305dc9f67fc08a07fd87d))


### Bug Fixes

* **document-api:** Use GOT instead of request promise ([dc927f5](https://github.com/entrostat/road-protect-fleet/commit/dc927f5e0f8450e8a25e6fabe0a7f853cff8992d))

### [3.17.2](https://github.com/entrostat/road-protect-fleet/compare/v3.17.1...v3.17.2) (2021-04-09)


### Bug Fixes

* **document-api:** Don't delete the files ([399409a](https://github.com/entrostat/road-protect-fleet/commit/399409aa87d03fed78ac4ef26af78a74c1c2f853))
* **remove-previously-nominated-to-on-infringement-view:** the previously nominated to attribute has been removed ([d1ab0b2](https://github.com/entrostat/road-protect-fleet/commit/d1ab0b28e0a86923a6f2ee5e60571694d3bca044))

### [3.17.1](https://github.com/entrostat/road-protect-fleet/compare/v3.17.0...v3.17.1) (2021-04-09)


### Bug Fixes

* **document-api:** Sleep before continuing ([e1d7ac9](https://github.com/entrostat/road-protect-fleet/commit/e1d7ac94f142c97f9d1053b6075ada163fa7d393))

## [3.17.0](https://github.com/entrostat/road-protect-fleet/compare/v3.16.4...v3.17.0) (2021-04-09)


### Features

* **infringement-projection:** Added an Infringement Projection table  ([a27dd57](https://github.com/entrostat/road-protect-fleet/commit/a27dd575a22e18d5f9e220dbcc589833ae204ca5))
* **infringement-projection:** Basic infringement projection table ([982d960](https://github.com/entrostat/road-protect-fleet/commit/982d960e9e3d95c47cf74eda6b7f12ee3513628a))
* **infringement-projections:** Added a count for the number of vehicles without contracts ([d0f53d5](https://github.com/entrostat/road-protect-fleet/commit/d0f53d5322e53785058f7b603971c3cb183035b3))
* **infringement-projections:** Added projection calculations ([c1cdadf](https://github.com/entrostat/road-protect-fleet/commit/c1cdadf3076eee04eb2e894f805b192c537227b1))
* **infringement-projections:** Linked an infringement table to the infringement projections tab ([0b591b7](https://github.com/entrostat/road-protect-fleet/commit/0b591b7e7eb41a6e6f9fe71605f994f1a4c07169))
* **infringement-projections:** Made the start date adjustable ([6a2c657](https://github.com/entrostat/road-protect-fleet/commit/6a2c6573551111889905b23ee583facd24505142))
* **view-infringements:** View infringements that build up the aggregated data by selecting the desired subset on the aggregated table or bar graph ([0e02253](https://github.com/entrostat/road-protect-fleet/commit/0e0225300ae20b17c3aed1ba718bc4810fef697a))


### Bug Fixes

* **infringement-projections:** Fixed views for accounts with no contracts and no previous data ([96c5737](https://github.com/entrostat/road-protect-fleet/commit/96c573724588174698cbe647df0d432060b6ec89))

### [3.16.4](https://github.com/entrostat/road-protect-fleet/compare/v3.16.3...v3.16.4) (2021-04-09)


### Bug Fixes

* **document-api:** Downgraded to Puppeteer version 7 ([71229d6](https://github.com/entrostat/road-protect-fleet/commit/71229d64caf554b2d0bfc5d1e5fe4cc5da17db32))
* **update-contract-view-after-deleting-document:** contract view updates after deleting a document ([925f467](https://github.com/entrostat/road-protect-fleet/commit/925f46752d99eb8e7d87b18be61bff56de296914))

### [3.16.3](https://github.com/entrostat/road-protect-fleet/compare/v3.16.2...v3.16.3) (2021-04-09)


### Bug Fixes

* **document-api:** Removed the puppeteer types ([b1c5e18](https://github.com/entrostat/road-protect-fleet/commit/b1c5e18c8a813c9b99c622a3ab4a41db8610cda3))

### [3.16.2](https://github.com/entrostat/road-protect-fleet/compare/v3.16.1...v3.16.2) (2021-04-09)


### Bug Fixes

* **document-api:** Changed the paper format ([b48fc84](https://github.com/entrostat/road-protect-fleet/commit/b48fc8481e00959f6e8b65cbe64963d0bcbcdfc2))

### [3.16.1](https://github.com/entrostat/road-protect-fleet/compare/v3.16.0...v3.16.1) (2021-04-09)


### Bug Fixes

* **document-api:** Updated the version of puppeteer ([c63a0e5](https://github.com/entrostat/road-protect-fleet/commit/c63a0e5c8f5abddec8ce66d55098f377a7e52f48))

## [3.16.0](https://github.com/entrostat/road-protect-fleet/compare/v3.15.7...v3.16.0) (2021-04-08)


### Features

* **logging:** Added additional logs to the document API ([916c66a](https://github.com/entrostat/road-protect-fleet/commit/916c66aed91af7beaeae8c21c9795270c13f93ff))

### [3.15.7](https://github.com/entrostat/road-protect-fleet/compare/v3.15.6...v3.15.7) (2021-04-08)


### Bug Fixes

* **request:** Reverted the requests back ([bec018f](https://github.com/entrostat/road-protect-fleet/commit/bec018fced319d2761c97089fa435ef5cd250843))

### [3.15.6](https://github.com/entrostat/road-protect-fleet/compare/v3.15.5...v3.15.6) (2021-04-08)


### Bug Fixes

* **pdf-api:** Removed the content type header ([4915e6b](https://github.com/entrostat/road-protect-fleet/commit/4915e6b0d22356da71fd785db349c061704b0e3d))

### [3.15.5](https://github.com/entrostat/road-protect-fleet/compare/v3.15.4...v3.15.5) (2021-04-08)


### Bug Fixes

* **build:** Force the type of the csv file attachment ([1b0c0bd](https://github.com/entrostat/road-protect-fleet/commit/1b0c0bd64e67589016d08a1c3c78954ba781abbb))

### [3.15.4](https://github.com/entrostat/road-protect-fleet/compare/v3.15.3...v3.15.4) (2021-04-08)


### Bug Fixes

* **requests:** Changed the library used to make requests for pdfs ([0a69aa5](https://github.com/entrostat/road-protect-fleet/commit/0a69aa5a30a47f5a2bad220e3764ce90cc1dc3fc))

### [3.15.3](https://github.com/entrostat/road-protect-fleet/compare/v3.15.2...v3.15.3) (2021-04-08)


### Bug Fixes

* **build:** Typo was causing build failure ([12d0ce3](https://github.com/entrostat/road-protect-fleet/commit/12d0ce3e4410b4006cd45c4e7a3c85cefcb15a2a))

### [3.15.2](https://github.com/entrostat/road-protect-fleet/compare/v3.15.1...v3.15.2) (2021-04-08)


### Bug Fixes

* **pdf-merge:** Stringify the error ([9a28ef7](https://github.com/entrostat/road-protect-fleet/commit/9a28ef7740b58ea0b562c6b0293744014b8558f6))
* **pdf-merge:** Wrap the pdf merge in a try catch to log the error we're seeing ([64a1f53](https://github.com/entrostat/road-protect-fleet/commit/64a1f5388cd50d566c74df5555b071aa6ba53db0))

### [3.15.1](https://github.com/entrostat/road-protect-fleet/compare/v3.15.0...v3.15.1) (2021-04-08)


### Bug Fixes

* **logging:** Added additional logs to the document merge ([2c8591f](https://github.com/entrostat/road-protect-fleet/commit/2c8591f7baa269feda466ab95365e39fe9c6dfd1))
* **redirection-document:** Added px to the with on the logo ([5fb9df3](https://github.com/entrostat/road-protect-fleet/commit/5fb9df3432c5fd9bc70443335a85527c1c8a8dd5))

## [3.15.0](https://github.com/entrostat/road-protect-fleet/compare/v3.14.2...v3.15.0) (2021-04-08)


### Features

* **graphing-by-vehicle:** Add table to show data aggregated by vehicle over the selected date range ([4029376](https://github.com/entrostat/road-protect-fleet/commit/4029376df547de6555e4c2ea9981f49ad6b356a6))
* **graphing-by-vehicle:** Stacked bar graph for data aggregated by vehicle ([7598586](https://github.com/entrostat/road-protect-fleet/commit/7598586dd874fad13643f6ece8e13f92cf8479ba))

### [3.14.2](https://github.com/entrostat/road-protect-fleet/compare/v3.14.1...v3.14.2) (2021-04-07)


### Bug Fixes

* **schedulers:** Wrap the schedulers in a try-catch ([d5fbd46](https://github.com/entrostat/road-protect-fleet/commit/d5fbd461112c1130b39d8b787afc575b50683a4e))

### [3.14.1](https://github.com/entrostat/road-protect-fleet/compare/v3.14.0...v3.14.1) (2021-04-07)


### Bug Fixes

* **devops:** Delete any evicted pods before running migrations ([c839209](https://github.com/entrostat/road-protect-fleet/commit/c8392097e4ea063ecb532d2f7ddd76e2a9b3909c))
* **devops:** Set the timeout minutes on all of the different workflows ([0484cea](https://github.com/entrostat/road-protect-fleet/commit/0484ceaaac04c1145ca40260ef9e494c0d79c40b))
* **devops:** The timeout minutes are on a job level ([bc34922](https://github.com/entrostat/road-protect-fleet/commit/bc349226ae41ec7506f8025c3844c8f714f7438b))
* **logging:** Added the form to the logs ([7342ed3](https://github.com/entrostat/road-protect-fleet/commit/7342ed37e9a7027aaaa4015453af68fcefaa1362))

## [3.14.0](https://github.com/entrostat/road-protect-fleet/compare/v3.13.6...v3.14.0) (2021-04-07)


### Features

* **error-code:** Endpoint to generate spreadsheet from error codes constant ([d5a4a22](https://github.com/entrostat/road-protect-fleet/commit/d5a4a2299d73bc3957aa30b9fd5e9eeed265c1da))


### Bug Fixes

* **file-upload:** Use the headers from the form ([1003f5b](https://github.com/entrostat/road-protect-fleet/commit/1003f5b54173ac5dfb105c1f8f6e1b0faddcd613))
* **make-dropdown-arrow-visible-on-infringement-view:** dropdown arrow is visible on the 'more details' button ([a5314cc](https://github.com/entrostat/road-protect-fleet/commit/a5314ccb0df8b82b4c3ff4bc213477f67b70b26a))
* **update-infringement-view-after-payment:** infringement view updates after payment is made ([0f4f280](https://github.com/entrostat/road-protect-fleet/commit/0f4f2800b7bb8a41069db241ea2beb6899eeed01))

### [3.13.6](https://github.com/entrostat/road-protect-fleet/compare/v3.13.5...v3.13.6) (2021-03-31)


### Bug Fixes

* **merge-pdf:** Reverted back to the merge pdf for now ([4ef7a94](https://github.com/entrostat/road-protect-fleet/commit/4ef7a94ae14ccba6aec5117e4f60e905edf4e0de))

### [3.13.5](https://github.com/entrostat/road-protect-fleet/compare/v3.13.4...v3.13.5) (2021-03-31)


### Bug Fixes

* **file-requests:** Removed the encoding setting ([8c7424c](https://github.com/entrostat/road-protect-fleet/commit/8c7424cbc129c04c5e43051a328584452fe3f826))

### [3.13.4](https://github.com/entrostat/road-protect-fleet/compare/v3.13.3...v3.13.4) (2021-03-31)


### Bug Fixes

* **request:** Extract the buffer from the request body ([9e9e02d](https://github.com/entrostat/road-protect-fleet/commit/9e9e02d49580f7eea1ec98da4dd041969decb9fe))

### [3.13.3](https://github.com/entrostat/road-protect-fleet/compare/v3.13.2...v3.13.3) (2021-03-31)


### Bug Fixes

* **pdf-merge:** Don't call the .buffer function ([8a3007e](https://github.com/entrostat/road-protect-fleet/commit/8a3007ee6af15f09aaf53e1eda780c05635c4656))

### [3.13.2](https://github.com/entrostat/road-protect-fleet/compare/v3.13.1...v3.13.2) (2021-03-31)


### Bug Fixes

* **pdf-merge:** Send the response type to buffer ([a1c3935](https://github.com/entrostat/road-protect-fleet/commit/a1c39357c09067b27c2ee9f1ef76c0e608e8ae15))

### [3.13.1](https://github.com/entrostat/road-protect-fleet/compare/v3.13.0...v3.13.1) (2021-03-31)

## [3.13.0](https://github.com/entrostat/road-protect-fleet/compare/v3.12.0...v3.13.0) (2021-03-31)


### Features

* **lease-contract:** bulk generate lease contracts ([37821c6](https://github.com/entrostat/road-protect-fleet/commit/37821c62a4d27948d77f33a3fdd0f4ec2d2e739d))
* **lease-contract:** Generate lease contract ([040bdb8](https://github.com/entrostat/road-protect-fleet/commit/040bdb8c9c5f7f5d18736d86399aa25185b74673))
* **lease-contract:** Generate lease contract documents ([1ea54eb](https://github.com/entrostat/road-protect-fleet/commit/1ea54eb69fee78432b38c8a6f4f890dfdaf46106))
* **sidebar:** Filter sidebar based on account role ([aa7d647](https://github.com/entrostat/road-protect-fleet/commit/aa7d647725116f4ef7bfc848a2d585e2e6d115e8))


### Bug Fixes

* **disable-next-button:** button disables when empty or no spreadsheet is uploaded ([83120d4](https://github.com/entrostat/road-protect-fleet/commit/83120d4c67d1feffb5f33eb4170a1c458c50e10d))
* **link-aacounts-when-creating-developer-user:** system accounts linked to developer user type ([cea588b](https://github.com/entrostat/road-protect-fleet/commit/cea588b87f628b930d01350ae6f28697be82c9a9))
* **mileon:** Moved from request promise to got ([854d513](https://github.com/entrostat/road-protect-fleet/commit/854d5138970be67db5fed9eae65c82c95337be9c))
* **request-information:** Updated request for information template ([d5d1a48](https://github.com/entrostat/road-protect-fleet/commit/d5d1a4831fd065fd5c0c074b0eae2e17fe45e5da))

## [3.12.0](https://github.com/entrostat/road-protect-fleet/compare/v3.11.0...v3.12.0) (2021-03-31)


### Features

* **notes:** Store infringement notes on the infringement when we sync ([591b192](https://github.com/entrostat/road-protect-fleet/commit/591b1925e92bfc63d06e8867c17a1a8883e9be16)), closes [#699](https://github.com/entrostat/road-protect-fleet/issues/699)


### Bug Fixes

* **logging:** Removed the output of nominations from the cron schedule logs ([11c6549](https://github.com/entrostat/road-protect-fleet/commit/11c654998e8d31504c4e3953d644bf0c12108257))

## [3.11.0](https://github.com/entrostat/road-protect-fleet/compare/v3.10.0...v3.11.0) (2021-03-30)


### Features

* **issuer-request:** Attach the power of attorney to the email ([c540e4d](https://github.com/entrostat/road-protect-fleet/commit/c540e4d4c5fa57623c56de34c16707a9e0d3ab97)), closes [#704](https://github.com/entrostat/road-protect-fleet/issues/704)


### Bug Fixes

* **crawlers:** Overwrite the police crawler url generator ([6c9b110](https://github.com/entrostat/road-protect-fleet/commit/6c9b110afea86f0cc38f78709f5e86166176fa02))

## [3.10.0](https://github.com/entrostat/road-protect-fleet/compare/v3.9.0...v3.10.0) (2021-03-29)


### Features

* **redirections:** Activated the Mileon redirections through the crawler ([2765cfc](https://github.com/entrostat/road-protect-fleet/commit/2765cfc71860b1e13b517cb2ad9b909a1a81429f)), closes [#683](https://github.com/entrostat/road-protect-fleet/issues/683)

## [3.9.0](https://github.com/entrostat/road-protect-fleet/compare/v3.8.0...v3.9.0) (2021-03-29)


### Features

* **schedulers:** Use the redirection identifier on schedulers to confirm whether or not something was redirected ([1c72282](https://github.com/entrostat/road-protect-fleet/commit/1c7228276164dc21674138b3d2da26298e719a62)), closes [#702](https://github.com/entrostat/road-protect-fleet/issues/702)

## [3.8.0](https://github.com/entrostat/road-protect-fleet/compare/v3.7.4...v3.8.0) (2021-03-29)


### Features

* **contracts:** Added a spreadsheet uploader for the ownership contracts ([a9f1c41](https://github.com/entrostat/road-protect-fleet/commit/a9f1c4161a89eea394e1f567b7d7136a75d077f8))


### Bug Fixes

* **migrations:** Removed the circular dependency between the nomination status and the config ([c2e3961](https://github.com/entrostat/road-protect-fleet/commit/c2e396160a56e95684ccdfb3106e3f2b8afee285))

### [3.7.4](https://github.com/entrostat/road-protect-fleet/compare/v3.7.3...v3.7.4) (2021-03-29)


### Bug Fixes

* **crawlers:** FInd by notice number instead of id if it's not there ([e76a68b](https://github.com/entrostat/road-protect-fleet/commit/e76a68bcbb2d5c23af54a21eeed1cfe0f573f531))

### [3.7.3](https://github.com/entrostat/road-protect-fleet/compare/v3.7.2...v3.7.3) (2021-03-29)


### Bug Fixes

* **crawlers:** Encode the URL for crawler requests ([5a520d4](https://github.com/entrostat/road-protect-fleet/commit/5a520d4bd1516e5457720fdf6e546788c9356b0d))

### [3.7.2](https://github.com/entrostat/road-protect-fleet/compare/v3.7.1...v3.7.2) (2021-03-29)


### Bug Fixes

* **crawlers:** Added the user brn and owner brn in the query params to the crawler request ([7f85e07](https://github.com/entrostat/road-protect-fleet/commit/7f85e0706789cf4efa684119ee2283d6ef8a3513))

### [3.7.1](https://github.com/entrostat/road-protect-fleet/compare/v3.7.0...v3.7.1) (2021-03-28)


### Bug Fixes

* **error-codes:** Moved the error codes locally to the document api ([0b3cb26](https://github.com/entrostat/road-protect-fleet/commit/0b3cb2674cb95b0f7fa9300320b1057445ca1e0b))

## [3.7.0](https://github.com/entrostat/road-protect-fleet/compare/v3.6.1...v3.7.0) (2021-03-26)


### Features

* **error-codes:** Assigned codes to error messages ([f2573d8](https://github.com/entrostat/road-protect-fleet/commit/f2573d88c300ad39d3c2adc39ba7d2e39c4b1aaf))


### Bug Fixes

* **devops:** Added the new internal urls ([d66075f](https://github.com/entrostat/road-protect-fleet/commit/d66075f37f095313e69dd68b2882697d4cbac39f))
* **devops:** Upgraded to Helm 3 and creating the internal ingress ([b6e3475](https://github.com/entrostat/road-protect-fleet/commit/b6e3475ab749acb7191a7cd19abfb49509a716c2))
* **error-codes:** Fixed build errors from typing issue ([1d03b78](https://github.com/entrostat/road-protect-fleet/commit/1d03b78f52e89a07753d6f0cb599263a9337a2f8))
* **reporting:** Disabled reporting for now ([21e56ee](https://github.com/entrostat/road-protect-fleet/commit/21e56eed2c9b50bc041c2fac4568d8ea00ded643))

### [3.6.1](https://github.com/entrostat/road-protect-fleet/compare/v3.6.0...v3.6.1) (2021-03-26)


### Bug Fixes

* **redis:** Change the env for redis because kubernetes sets REDIS_PORT ([beb77ec](https://github.com/entrostat/road-protect-fleet/commit/beb77ecc2bc6b9410ed3b9fcc88b3b9ee2680650))

## [3.6.0](https://github.com/entrostat/road-protect-fleet/compare/v3.5.0...v3.6.0) (2021-03-25)


### Features

* **distributed-websockets:** Distribute the Websockets over a Redis connection ([e0e46be](https://github.com/entrostat/road-protect-fleet/commit/e0e46bea156780aaf2d5000140ec1cfba0384c69)), closes [#693](https://github.com/entrostat/road-protect-fleet/issues/693)


### Bug Fixes

* **error-popup-layout-RTL:** fixed the UI layout of the error popup ([21a383c](https://github.com/entrostat/road-protect-fleet/commit/21a383ccbce04c27e0cd259eda20c5357bf614a4))
* **mailer:** Updated the cron for the mailer process ([e17d3ad](https://github.com/entrostat/road-protect-fleet/commit/e17d3ad6ab244faf6fede4191cf5dcfbb3573212))
* **upload-empty-spreadsheet:** added a check for empty uploaded spreadsheets ([93b63f3](https://github.com/entrostat/road-protect-fleet/commit/93b63f34a8e75e4fa3b35a49fca15f192a472b72))

## [3.5.0](https://github.com/entrostat/road-protect-fleet/compare/v3.4.0...v3.5.0) (2021-03-24)


### Features

* **graphing-input-sliders:** Add slider to input values for the number of issuers that are shown before being grouped together as well as the number of years to compare values to ([fc617c7](https://github.com/entrostat/road-protect-fleet/commit/fc617c7ca09660620d81338ea05688c3f10ddd02))
* **request-information-template:** The email template for information request emails was changed. ([9ab617f](https://github.com/entrostat/road-protect-fleet/commit/9ab617f811704df9dcb49fa926dfa2f9f4a91bb7))
* **security:** Adjusted the rate limits for actions ([5a7f36b](https://github.com/entrostat/road-protect-fleet/commit/5a7f36b1005d76ba79b25d696fe229ce12c3642d))

## [3.4.0](https://github.com/entrostat/road-protect-fleet/compare/v3.3.2...v3.4.0) (2021-03-23)


### Features

* **compare-multiple-years:** Compare multiple years in graphing by issuer table ([b566407](https://github.com/entrostat/road-protect-fleet/commit/b56640762c09b17977a822cc5c16ad2e877bf68c))
* **crawlers:** Made manual verifications synchronous ([eace6d4](https://github.com/entrostat/road-protect-fleet/commit/eace6d47921fd7e8b68aa5498e177adaf7b6db8e))
* **infringement-approval:** Keep track of who approved/unapproved an infringement for payment and the amount that was due at the time ([2329715](https://github.com/entrostat/road-protect-fleet/commit/2329715fea970758bf0c0a7952acbc49e3f95e09))
* **parital-infringement:** Created a scheduler to process infringements every 15 minutes  ([2cce5a0](https://github.com/entrostat/road-protect-fleet/commit/2cce5a0e20fbf545d08dc16365271de50a751259))
* **partial-infringement:** Added a manual create ([d66e7bf](https://github.com/entrostat/road-protect-fleet/commit/d66e7bfcc898decdc499c14a26370758145a8262))
* **partial-infringement:** Added status column  ([7949460](https://github.com/entrostat/road-protect-fleet/commit/794946089f64754a7e15d54d103af5caec7cb405))
* **partial-infringement:** Added the partial infringement table to the admin view ([a4163e0](https://github.com/entrostat/road-protect-fleet/commit/a4163e0662bb670454c78754e828813b6c39f210))
* **partial-infringement:** adjusted the partial infringement table to show queued ([081187e](https://github.com/entrostat/road-protect-fleet/commit/081187e1a7f24cc1e02c0635b4c74225750ec89a))
* **partial-infringement:** Epic of partial infringements table ([6d2e703](https://github.com/entrostat/road-protect-fleet/commit/6d2e7032495e68f8ccd9dc488ed7b4cd62dd7e4f))
* **partial-infringements:** Added a delete option for partial infringements ([054b07e](https://github.com/entrostat/road-protect-fleet/commit/054b07e13de2f82a7484535349bd6a85718b9336))
* **partial-infringements:** Added spreadsheet uploader ([de64ab7](https://github.com/entrostat/road-protect-fleet/commit/de64ab70ae04bfa8219a5c4d727bfabb96e14309))
* **partial-infringements:** linked the partial infringements to the raw infringement mapper ([7f6c08d](https://github.com/entrostat/road-protect-fleet/commit/7f6c08d341e01a2f6d9cdb41311bd4391f472b4b))
* **redirections:** added a redirection document update date filter ([aa002e5](https://github.com/entrostat/road-protect-fleet/commit/aa002e515a4a4e9dd3179a4f78827672e92b6f84))


### Bug Fixes

* **history-logs:** Optimised the history log query ([0c34100](https://github.com/entrostat/road-protect-fleet/commit/0c34100ed45a4bb65fb859379796f84409546f61))
* **staging:** Added the admin pod ([db9b881](https://github.com/entrostat/road-protect-fleet/commit/db9b881166211e98f9694d0d4a34e3cebe7b9394))
* **staging:** Update the admin deployment on staging ([4ee639f](https://github.com/entrostat/road-protect-fleet/commit/4ee639f252d7b605fcafdb3da3815a60fd427c75))
* **staging:** Update the admin pod on build ([73f5972](https://github.com/entrostat/road-protect-fleet/commit/73f5972956cc6a06b325877422b1fc8dc639d96a))
* **upgrade-frontend:** Fixed the module imports in the partial infringement epic ([92b8a6c](https://github.com/entrostat/road-protect-fleet/commit/92b8a6c5878b703bb648ea2b0c46677cc2209ab2))

### [3.3.2](https://github.com/entrostat/road-protect-fleet/compare/v3.3.1...v3.3.2) (2021-03-18)


### Bug Fixes

* **got:** Must import from core utils ([aa4b0af](https://github.com/entrostat/road-protect-fleet/commit/aa4b0af5041048cd16fffd4840ff1d5446c8e618))

### [3.3.1](https://github.com/entrostat/road-protect-fleet/compare/v3.3.0...v3.3.1) (2021-03-18)


### Bug Fixes

* **got:** Fixed the request based on this post ([d087f8a](https://github.com/entrostat/road-protect-fleet/commit/d087f8acdb9406cdeb92b51701fc6ba50ba7cc41))

## [3.3.0](https://github.com/entrostat/road-protect-fleet/compare/v3.2.1...v3.3.0) (2021-03-18)


### Features

* **graphing-tables:** Add sort on all columns for the graphing by issuer and graphing by status tables ([09e3c80](https://github.com/entrostat/road-protect-fleet/commit/09e3c80766ffff565b159c4f77b2804fda46569a))


### Bug Fixes

* **requests:** Imported got as function to see if the 127.0.0.1:443 error still exists ([1291832](https://github.com/entrostat/road-protect-fleet/commit/129183228cac590856271b9d2aa574df2c8a410b))

### [3.2.1](https://github.com/entrostat/road-protect-fleet/compare/v3.2.0...v3.2.1) (2021-03-17)


### Bug Fixes

* **stability:** Reduced initial startup time ([26f1ccd](https://github.com/entrostat/road-protect-fleet/commit/26f1ccd1dafd4bd053d6445a5f3843a69aed7eba))
* **stability:** Using got to make the network requests ([4fd92ee](https://github.com/entrostat/road-protect-fleet/commit/4fd92ee3b8aef364dc4117a63e01ed307f4d8c6f))

## [3.2.0](https://github.com/entrostat/road-protect-fleet/compare/v3.1.0...v3.2.0) (2021-03-17)


### Features

* **stability:** Assigned pod priority to avoid backend being evicted ([31ac269](https://github.com/entrostat/road-protect-fleet/commit/31ac269e8c6942bbe2efe07202588b1d50529a78)), closes [#674](https://github.com/entrostat/road-protect-fleet/issues/674)

## [3.1.0](https://github.com/entrostat/road-protect-fleet/compare/v3.0.0...v3.1.0) (2021-03-17)


### Features

* **debug:** Added blocked at to the backend to see what processes are blocking processing the most ([6273799](https://github.com/entrostat/road-protect-fleet/commit/627379977b0757e5339bd0bd18cd4e6f7ec2162c))
* **graphing-by-issuer:** Split graphing by issuer for vehicle owners and vehicle users ([1807199](https://github.com/entrostat/road-protect-fleet/commit/1807199bc23bfec9ee8b000a99204dc24900ad25))
* **graphing-by-status:** Split graphing by status into two pages for vehicle users and owners ([27330ff](https://github.com/entrostat/road-protect-fleet/commit/27330fffd432030a5109682ca9b7ec26f898fa07))


### Bug Fixes

* **debug:** Increased the allowance for blocking to reduce output ([a3467b0](https://github.com/entrostat/road-protect-fleet/commit/a3467b04ad96935268db2a287cdce814040ff665))
* **filter-visibility-close-on-click:** Pop up closes after filter visibility selection is selected ([81fe51d](https://github.com/entrostat/road-protect-fleet/commit/81fe51d7085b4b7f48e8fa84715c69b20abb5d06))

## [3.0.0](https://github.com/entrostat/road-protect-fleet/compare/v2.138.6...v3.0.0) (2021-03-16)


### ⚠ BREAKING CHANGES

* **frontend-framework:** Frontend framework upgrades with incompatible imports

### Features

* **frontend-framework:** Upgrade frontend frameworks and implement NgZorro's RTL support. Angular to v11.2.4, NgRx to v11.0.1 and NgZorro to v11.2.0 ([3dbce8d](https://github.com/entrostat/road-protect-fleet/commit/3dbce8df0a682e64d6ee74e771bcb9ff0fab4584))
* **rtl-integration:** Move rtl styling to Bidi Module rather than our own styling for Ng Zorro components ([9c7359f](https://github.com/entrostat/road-protect-fleet/commit/9c7359f24cbb28a2010718a92e4196aafd0894c3))
* **upgrade-frontend-framework:** Upgrade Angular to v11.2.4, NgRx to v11.0.1, and NgZorro to v11.2.0 ([5351029](https://github.com/entrostat/road-protect-fleet/commit/5351029429211f91f91e06e4c4a3105f63ec18cf))
* **upgrade-frontend-frameworks:** Update Angular, NgZorro and NgRx to version 10 ([c050000](https://github.com/entrostat/road-protect-fleet/commit/c050000f4e27530531c4c74f5803f85c6af9df95))

### [2.138.6](https://github.com/entrostat/road-protect-fleet/compare/v2.138.5...v2.138.6) (2021-03-16)


### Bug Fixes

* **reporting:** Delayed the infringement report to 15:15 ([6752e45](https://github.com/entrostat/road-protect-fleet/commit/6752e45617aec67402261e517686d04d0f5f2450))

### [2.138.5](https://github.com/entrostat/road-protect-fleet/compare/v2.138.4...v2.138.5) (2021-03-16)


### Bug Fixes

* **reporting:** Delaed the infringement report to 14:30 ([1211e6f](https://github.com/entrostat/road-protect-fleet/commit/1211e6fceb9dee1eefde2c9aa82c52c5090711e2))

### [2.138.4](https://github.com/entrostat/road-protect-fleet/compare/v2.138.3...v2.138.4) (2021-03-16)


### Bug Fixes

* **security:** Released the rate limits for now ([e568891](https://github.com/entrostat/road-protect-fleet/commit/e568891d7305e6e1680967112301a99dbe3b6e74))
* **security:** Updated the rate limit for file downloads ([a3bae88](https://github.com/entrostat/road-protect-fleet/commit/a3bae8861a21ddd762ffc169b3df73344ba8a1fa))

### [2.138.3](https://github.com/entrostat/road-protect-fleet/compare/v2.138.2...v2.138.3) (2021-03-16)


### Bug Fixes

* **reporting:** Delayed the infringement report to 2pm ([4d3f2c4](https://github.com/entrostat/road-protect-fleet/commit/4d3f2c46fa3537f641d6e40505564d8744ffab9a))

### [2.138.2](https://github.com/entrostat/road-protect-fleet/compare/v2.138.1...v2.138.2) (2021-03-16)


### Bug Fixes

* **reporting:** Delayed the infringement report to 1pm ([5245ec7](https://github.com/entrostat/road-protect-fleet/commit/5245ec7ab1d076c4143627705297520b3e3a5ae5))

### [2.138.1](https://github.com/entrostat/road-protect-fleet/compare/v2.138.0...v2.138.1) (2021-03-16)


### Bug Fixes

* **mailers:** Added additional CC address to the mailer process ([3c66cca](https://github.com/entrostat/road-protect-fleet/commit/3c66cca85c742e0bd152eb58d0970b897e3b6a94))
* **schedulers:** Set the crawlers to send at 12 ([e475342](https://github.com/entrostat/road-protect-fleet/commit/e475342f9c21ed52c0a323a7051f4764ea79530c))

## [2.138.0](https://github.com/entrostat/road-protect-fleet/compare/v2.137.0...v2.138.0) (2021-03-16)


### Features

* **disable-redirection-button:** redirection button is disabled when the infringement status is 'approved for payment' ([0cd30f7](https://github.com/entrostat/road-protect-fleet/commit/0cd30f7f98566761b6cd68b27ec1c4833a9adb09))


### Bug Fixes

* **advanced-table-filters:** Fix the filters that were not loading properly on refresh ([e2dadb6](https://github.com/entrostat/road-protect-fleet/commit/e2dadb65f10b5e617ce92e409e577c3e1c499b21))

## [2.137.0](https://github.com/entrostat/road-protect-fleet/compare/v2.136.0...v2.137.0) (2021-03-15)


### Features

* **redirections:** Added the ability to override redirections by changing the channel ([fedad42](https://github.com/entrostat/road-protect-fleet/commit/fedad422b3d0dc4879688363e0447918df400c77)), closes [#663](https://github.com/entrostat/road-protect-fleet/issues/663)

## [2.136.0](https://github.com/entrostat/road-protect-fleet/compare/v2.135.1...v2.136.0) (2021-03-15)


### Features

* **crawlers:** Added the owner and user details to the crawlers ([3b64d5c](https://github.com/entrostat/road-protect-fleet/commit/3b64d5cda9ea19cfdc91b95806212612b5d39520)), closes [#662](https://github.com/entrostat/road-protect-fleet/issues/662)

### [2.135.1](https://github.com/entrostat/road-protect-fleet/compare/v2.135.0...v2.135.1) (2021-03-15)


### Bug Fixes

* **migrations:** Changed migration hash ([5646b8a](https://github.com/entrostat/road-protect-fleet/commit/5646b8a388e119d30a680ebab55904c1adf3e8c5))

## [2.135.0](https://github.com/entrostat/road-protect-fleet/compare/v2.134.1...v2.135.0) (2021-03-15)


### Features

* **crawlers:** Added the Police redirection crawler ([ed28518](https://github.com/entrostat/road-protect-fleet/commit/ed28518cd4ca98a7151d0e6a1f35d95452234468))

### [2.134.1](https://github.com/entrostat/road-protect-fleet/compare/v2.134.0...v2.134.1) (2021-03-15)


### Bug Fixes

* **migrations:** Change migrations to change the hash for deploying to production ([cd09ef7](https://github.com/entrostat/road-protect-fleet/commit/cd09ef752b7596fbdff7e31fda2ad3bff4977073))

## [2.134.0](https://github.com/entrostat/road-protect-fleet/compare/v2.133.2...v2.134.0) (2021-03-15)


### Features

* **information-request:** Ability to send information requests and to keep track of if a response was received or not ([82802e1](https://github.com/entrostat/road-protect-fleet/commit/82802e1e347dd0976d84f1857d2da90cda03790c))
* **request-information:** Add email template to request information from a municipality ([0614302](https://github.com/entrostat/road-protect-fleet/commit/0614302f6f9cde666a94659ad61925a3051b0ce7))
* **request-information:** Added a scheduler to send required requests once a day ([cdc5a33](https://github.com/entrostat/road-protect-fleet/commit/cdc5a332161f5a25ad09bdb6e88391bc11df0a6a))
* **request-information:** Allow admins to request information from multiple issuers ([2202a82](https://github.com/entrostat/road-protect-fleet/commit/2202a82ba2a015fc1aa1dead8310e478892f41c7))
* **request-information:** Display log of requests for information sent ([1ab9d12](https://github.com/entrostat/road-protect-fleet/commit/1ab9d12935be475c3cc1d695988b682884bc8c8c))
* **request-information:** Manually enter if and when a response is received ([9dda3fa](https://github.com/entrostat/road-protect-fleet/commit/9dda3faf358416b0ba5ca33966687762fcb3e316))
* **request-information:** Only allow configured accounts to send information request emails and enable the manual configuration by admins through the frontend ([8b305b4](https://github.com/entrostat/road-protect-fleet/commit/8b305b455d3c81b4bc35438d50c603a1e07b6207))
* **request-information:** Store log of information requests sent ([71e96b6](https://github.com/entrostat/road-protect-fleet/commit/71e96b619d3c53a1fd9595df8b7e08d8fcdffba7))


### Bug Fixes

* **advanced-filters:** Prevent two requests for data when navigating to a page with a table ([97aa0cd](https://github.com/entrostat/road-protect-fleet/commit/97aa0cdf3f6011ca6569d93312a7ebc2001f1ad8))
* **devops:** Limit cron to 2GB ram ([903e5b7](https://github.com/entrostat/road-protect-fleet/commit/903e5b71bacdba70115f8a1f8bd50894723ddd07))
* **request-information:** Disable button to send request when current account does not have permission to send the request ([83f3766](https://github.com/entrostat/road-protect-fleet/commit/83f3766179d9fe03de54f1537a7c8445b6d44e60))
* **request-information:** Fix routing permissions and account display for requesting information ([4decf9d](https://github.com/entrostat/road-protect-fleet/commit/4decf9d094d518ebb11055a58be79888fcb91de9))

### [2.133.2](https://github.com/entrostat/road-protect-fleet/compare/v2.133.1...v2.133.2) (2021-03-15)


### Bug Fixes

* **devops:** Set memory limits on the queue workers and the cron ([70c4a95](https://github.com/entrostat/road-protect-fleet/commit/70c4a956368b6dc74b6d7b48339dfe2a4f899026))

### [2.133.1](https://github.com/entrostat/road-protect-fleet/compare/v2.133.0...v2.133.1) (2021-03-15)


### Bug Fixes

* **logging:** Added the BRN to the municipal redirection logger ([d2e5e6e](https://github.com/entrostat/road-protect-fleet/commit/d2e5e6e4af62bb87c6d8503daaa8858fab89daf0))

## [2.133.0](https://github.com/entrostat/road-protect-fleet/compare/v2.132.2...v2.133.0) (2021-03-12)


### Features

* **graphing-tables:** Sort the table by the total sum for both graphing by issuer and graphing by status ([539ad55](https://github.com/entrostat/road-protect-fleet/commit/539ad55aa91f7fceff4cedf22ee60b34194b8812))
* **integration-details-in-issuers-view:** view and edit the integration details for the user 'developer' ([6f8eda3](https://github.com/entrostat/road-protect-fleet/commit/6f8eda30884625dd454e707e96d44b76b51995aa))


### Bug Fixes

* **crawlers:** Ensured the merged document is saved to the nomination ([e8071f3](https://github.com/entrostat/road-protect-fleet/commit/e8071f36bf1bef7676cbb83a459d89509a4a5b5c))
* **edit-contract-button:** change edit contract button from a hyperlink to button on contract view ([25e3226](https://github.com/entrostat/road-protect-fleet/commit/25e322686da9b5e7876fe2182cc7a14d393ee6cd))
* **infringement-notes:** Fix bug that didn't allow the modal to close  ([9098687](https://github.com/entrostat/road-protect-fleet/commit/9098687e53a710d67f01a8370d6f2fe9a45a59e1))
* **logs:** Improved searching for account revision history ([9bb66d1](https://github.com/entrostat/road-protect-fleet/commit/9bb66d13c7244b56fd54815bd61611dfe5057107))
* **performance:** Set backend pods to 1 for now ([b11477d](https://github.com/entrostat/road-protect-fleet/commit/b11477d67f14319d80b91a68aed3842aacad5702))

### [2.132.2](https://github.com/entrostat/road-protect-fleet/compare/v2.132.1...v2.132.2) (2021-03-11)


### Bug Fixes

* **performance:** Don't break out the backend into multiple pods just yet ([dc508b0](https://github.com/entrostat/road-protect-fleet/commit/dc508b0692ca34c01afbd423c9977b0a826c8621))
* **performance:** Set the max concurrent jobs to 5 ([3a319cd](https://github.com/entrostat/road-protect-fleet/commit/3a319cd00d6ea44299dae5ecb8fb0e3058736926))

### [2.132.1](https://github.com/entrostat/road-protect-fleet/compare/v2.132.0...v2.132.1) (2021-03-11)


### Bug Fixes

* **migrations:** Modified migration to trigger it again ([5eb3785](https://github.com/entrostat/road-protect-fleet/commit/5eb378568dd583c6fa7d4b07b638c881c57d1f36))

## [2.132.0](https://github.com/entrostat/road-protect-fleet/compare/v2.131.1...v2.132.0) (2021-03-11)


### Features

* **performance:** Broke cron out from backend and queue workers ([36f5ab3](https://github.com/entrostat/road-protect-fleet/commit/36f5ab347eb004b48429665981b3e9fc969b9766)), closes [#648](https://github.com/entrostat/road-protect-fleet/issues/648)


### Bug Fixes

* **deployments:** Reduced resource requests on staging ([29b9122](https://github.com/entrostat/road-protect-fleet/commit/29b91228fdf70235b367d0157fe3e3aac3db5c62))

### [2.131.1](https://github.com/entrostat/road-protect-fleet/compare/v2.131.0...v2.131.1) (2021-03-11)
### Features
* ***logs:*** refactored the infringement, account, vehicle and user logs to show more detail, closes [#640](https://github.com/entrostat/road-protect-fleet/pull/640)

## [2.131.0](https://github.com/entrostat/road-protect-fleet/compare/v2.129.0...v2.131.0) (2021-03-11)


### Features

* **anti-virus:** Added an antivirus scanner to all of the file uploads ([95e6119](https://github.com/entrostat/road-protect-fleet/commit/95e611953d0654c63850997a249bbf4d647d2bf8)), closes [#634](https://github.com/entrostat/road-protect-fleet/issues/634)
* **ocr:** allowed creattion of a lease contract without a document ([db003cd](https://github.com/entrostat/road-protect-fleet/commit/db003cd05197a6291fd093700f83f264242edc72))

## [2.130.0](https://github.com/entrostat/road-protect-fleet/compare/v2.129.0...v2.130.0) (2021-03-11)


### Features

* **anti-virus:** Added an antivirus scanner to all of the file uploads ([95e6119](https://github.com/entrostat/road-protect-fleet/commit/95e611953d0654c63850997a249bbf4d647d2bf8)), closes [#634](https://github.com/entrostat/road-protect-fleet/issues/634)
* **ocr:** allowed creattion of a lease contract without a document ([db003cd](https://github.com/entrostat/road-protect-fleet/commit/db003cd05197a6291fd093700f83f264242edc72))

## [2.129.0](https://github.com/entrostat/road-protect-fleet/compare/v2.128.0...v2.129.0) (2021-03-10)

## [2.128.0](https://github.com/entrostat/road-protect-fleet/compare/v2.127.1...v2.128.0) (2021-03-10)


### Features

* **infringement-reporting:** Seperate feature flag for the scheduled sends of infringement reporting and the bulk sending of infringement reports ([110d3cc](https://github.com/entrostat/road-protect-fleet/commit/110d3ccce3a58a370018810eec5ae3a3e67a0ed7))


### Bug Fixes

* **cron:** Added the cron config ([6cfbf5f](https://github.com/entrostat/road-protect-fleet/commit/6cfbf5f4807233be0ece8b92bdc61cf5aff8c0fe))
* **status-changes:** Added internal statuses that can be used in spreadsheet upload ([2ba9421](https://github.com/entrostat/road-protect-fleet/commit/2ba942176c71de639ab25e489c6fda78cff63878))

### [2.127.1](https://github.com/entrostat/road-protect-fleet/compare/v2.127.0...v2.127.1) (2021-03-09)


### Bug Fixes

* **logs:** Increase the depth of the logs on prod ([9b3bf37](https://github.com/entrostat/road-protect-fleet/commit/9b3bf37bd43bea1e71f19e5661d0cfc1969b5129))
* **translations:** Incorrect button text on the system users view ([7a1e1ba](https://github.com/entrostat/road-protect-fleet/commit/7a1e1ba97a2953351f901f73a4645422200a4d01)), closes [#632](https://github.com/entrostat/road-protect-fleet/issues/632)

## [2.127.0](https://github.com/entrostat/road-protect-fleet/compare/v2.126.1...v2.127.0) (2021-03-09)


### Features

* **semantic-versioning-in-readme:** Added useful information in the readme ([82c93f1](https://github.com/entrostat/road-protect-fleet/commit/82c93f1ec073e2d1b897772fe1b25bc661360e63))


### Bug Fixes

* **approve-for-payment-logs:** Add details to logs when approving and unapproving infringements for payment ([e4f7e3e](https://github.com/entrostat/road-protect-fleet/commit/e4f7e3e24e019cce156374a2481a40cb8c7aa379))

### [2.126.1](https://github.com/entrostat/road-protect-fleet/compare/v2.126.0...v2.126.1) (2021-03-09)


### Bug Fixes

* **infringement-view:** Removed infringments where the BRN has successfully changed on infringements linked by ownership contracts ([9cda4e4](https://github.com/entrostat/road-protect-fleet/commit/9cda4e439f04ace3f2d512343710dc0e52493aa4))

## 2.123.0 (2021-03-07)


### Features

* **acount-relations:** Added all infringements with no BRN to the relations report email Merge branch 'feature/RPF-344/add-to-relation-emails' into develop ([f5f3c81](https://github.com/entrostat/road-protect-fleet/commit/f5f3c812c710a4338858bf79c390e9635548fd74))
* **address:** Made postal address optional on frontend and adjusted update of account so that postal address is nullified if no longer valid and changed the redirection request to ATG to exclude the postal box in street number when postal address is used ([3cbd526](https://github.com/entrostat/road-protect-fleet/commit/3cbd526c968f2b690b16b67c02496a6312e9f1c4)), closes [#206](https://github.com/entrostat/road-protect-fleet/issues/206)
* **address:** Searchable autocomplete and select street and city for account location ([8af7555](https://github.com/entrostat/road-protect-fleet/commit/8af75552d4ca34746b4da26a881200c20322d180))
* **admin-log:** Added raw infringement log frontend and query controller backend ([89bc979](https://github.com/entrostat/road-protect-fleet/commit/89bc97915696aaeba7eb6165bd9542b25350ddf5)), closes [#283](https://github.com/entrostat/road-protect-fleet/issues/283)
* **api:** Prevent updates to address on v1 update account endpoint which is used by Taavura ([1024376](https://github.com/entrostat/road-protect-fleet/commit/1024376ecb4c2cd99c6887af3e138a116089512e)), closes [#294](https://github.com/entrostat/road-protect-fleet/issues/294)
* **approve-for-payment:** Approve for payment button to set infringement status rather than nomination status ([934d181](https://github.com/entrostat/road-protect-fleet/commit/934d1816bc434906bd0328444e8f0ff00d0b653f))
* **approve-for-payment:** Temporary fix that allows users to transition to approved for payment from inredirection process ([2842850](https://github.com/entrostat/road-protect-fleet/commit/2842850729ba9e38683dce4f36ee6ddca99b0960))
* **approve-for-payment:** The feature set for moving the approved for payment status from nomination status to infringement status ([8854456](https://github.com/entrostat/road-protect-fleet/commit/88544560ba7402e4496dc7bbf701370df5ad9695))
* **approved-for-payment:** Migration to remove approved for payment from nomination status enum  ([9af40c0](https://github.com/entrostat/road-protect-fleet/commit/9af40c0ac2d37530a5e0487cd9c37f1b233f0e93))
* **atg-verify:** Manual infringement ATG verification ([b86bb6d](https://github.com/entrostat/road-protect-fleet/commit/b86bb6d8102c18a10bf1e072c8e75a8b2f696f97)), closes [#284](https://github.com/entrostat/road-protect-fleet/issues/284)
* **atg-verify:** Manual infringement ATG verification limited to admins with no redirection status updates ([2e6d3d3](https://github.com/entrostat/road-protect-fleet/commit/2e6d3d3837c11422c7314ed264904fdbdceea3be)), closes [#275](https://github.com/entrostat/road-protect-fleet/issues/275)
* **atg-verify:** Scheduler to check redirected infringements for verifiable providers (CRON job not currently activated) ([291a2bd](https://github.com/entrostat/road-protect-fleet/commit/291a2bda43c23060b2617d7c6a4582e6d9736bcd)), closes [#291](https://github.com/entrostat/road-protect-fleet/issues/291)
* **atg-verify:** Scheduler to check unpaid infringements for verifiable providers (CRON job not currently activated) ([aa896f0](https://github.com/entrostat/road-protect-fleet/commit/aa896f025655b08a5e38deabb60b6cb8e3364572)), closes [#290](https://github.com/entrostat/road-protect-fleet/issues/290)
* **atg-verify:** Update nomination if driver id is specified in ATG verify response ([0f531ff](https://github.com/entrostat/road-protect-fleet/commit/0f531fff9a0ecf1cc41f08215d8306830771ab69)), closes [#277](https://github.com/entrostat/road-protect-fleet/issues/277)
* **automated-tests:** added automated tests when you merge into develop or master to ensure that we're not breaking anything ([3f4f1e7](https://github.com/entrostat/road-protect-fleet/commit/3f4f1e754b384014de0c2f2d0badffe08aad63cf)), closes [#186](https://github.com/entrostat/road-protect-fleet/issues/186)
* **babel:** Added the translation file to the project so that it can be opened anywhere ([cd74720](https://github.com/entrostat/road-protect-fleet/commit/cd747201de033087f8dcaeb70e88ae1295ccccff))
* **batch-nominations:** added the ability to batch digitally nominate infringements from the frontend ([9d90e2c](https://github.com/entrostat/road-protect-fleet/commit/9d90e2cc810fdfc3c6c3779c6c2c7d16ffdb7a26)), closes [#172](https://github.com/entrostat/road-protect-fleet/issues/172)
* **client-ip:** Extract the client IP from the request headers ([78df065](https://github.com/entrostat/road-protect-fleet/commit/78df065ca42d24db6e8e141a4cde1f939f6fe7ca)), closes [#493](https://github.com/entrostat/road-protect-fleet/issues/493)
* **contracts:** Added an overwrite check to bulk upload lease contract documents ([7b57620](https://github.com/entrostat/road-protect-fleet/commit/7b5762045eca6d6fc7091c310104e23e80963651))
* **contracts:** added the ability to delete contracts on an account level through the API ([99c759f](https://github.com/entrostat/road-protect-fleet/commit/99c759f6ef32cb9d17ad64c03da0c5193559832e)), closes [#180](https://github.com/entrostat/road-protect-fleet/issues/180)
* **contracts:** Added the ability to upsert lease and ownership contracts ([32f332a](https://github.com/entrostat/road-protect-fleet/commit/32f332ab671abc8c733d2e8f39fedaa76cb27bee)), closes [#203](https://github.com/entrostat/road-protect-fleet/issues/203)
* **crawler-redirections:** Added Telaviv redirection flow via crawler ([0c20593](https://github.com/entrostat/road-protect-fleet/commit/0c205930f8ea8c6a9d6f98200b3d022e8d37e14d)), closes [#489](https://github.com/entrostat/road-protect-fleet/issues/489)
* **crawlers:** Add the notice number back into infringements from the crawlers ([9b8943e](https://github.com/entrostat/road-protect-fleet/commit/9b8943ed7aa946fa6ba4d9c4e8206cf6c2a3fe97)), closes [#472](https://github.com/entrostat/road-protect-fleet/issues/472)
* **crawlers:** Added controller endpoint to manually trigger sync with crawlers ([a5224d7](https://github.com/entrostat/road-protect-fleet/commit/a5224d7aca1ec4dff6b28b07d767b087ff537af5)), closes [#398](https://github.com/entrostat/road-protect-fleet/issues/398)
* **crawlers:** Added external codes for mileon and metropark ([c6718d8](https://github.com/entrostat/road-protect-fleet/commit/c6718d842bdc23b18d843624f09f29aef0fe0ca0)), closes [#327](https://github.com/entrostat/road-protect-fleet/issues/327)
* **crawlers:** Added queue module ([b120931](https://github.com/entrostat/road-protect-fleet/commit/b120931480746533180bb2440f17f731b5faed86)), closes [#378](https://github.com/entrostat/road-protect-fleet/issues/378)
* **crawlers:** Added shohar crawler and verifications ([a380bf2](https://github.com/entrostat/road-protect-fleet/commit/a380bf25b423adb0f2180f97aaaffc52c749908a)), closes [#448](https://github.com/entrostat/road-protect-fleet/issues/448)
* **crawlers:** Added statuses to crawler schedulers ([a59cf2e](https://github.com/entrostat/road-protect-fleet/commit/a59cf2e70709a03ae686103dc1ea7fa87e26dc52))
* **crawlers:** Dev docker compose crawler api setup with rp-fleet-crawlers submodule added ([9202a7c](https://github.com/entrostat/road-protect-fleet/commit/9202a7c10b452a665b6a1280a0963df6ddc5419a))
* **crawlers:** Error logging in crawler integrations ([3256953](https://github.com/entrostat/road-protect-fleet/commit/325695353e19af923f3547897d77186da145b39d)), closes [#372](https://github.com/entrostat/road-protect-fleet/issues/372)
* **crawlers:** Feature merge for crawlers ([25eb379](https://github.com/entrostat/road-protect-fleet/commit/25eb379568bce0df1743ad076069e7029a01ced3)), closes [#384](https://github.com/entrostat/road-protect-fleet/issues/384)
* **crawlers:** Increase Police timeout to 5 mins ([f9b0047](https://github.com/entrostat/road-protect-fleet/commit/f9b0047cc8c3a722730eef43c3d65b819eeb614e))
* **crawlers:** Jerusalem raw infringement mapper and sync single infringement through crawler ([9cdb2a9](https://github.com/entrostat/road-protect-fleet/commit/9cdb2a9359e25aed27bc0dc6b3c63b10873b5b6b))
* **crawlers:** Jerusalem scheduler and queue worker to sync infringements with crawler ([62cd8b2](https://github.com/entrostat/road-protect-fleet/commit/62cd8b273b17773396c55b6b0599907148e21132)), closes [#382](https://github.com/entrostat/road-protect-fleet/issues/382)
* **crawlers:** Jerusalem sync multiple infringements for vehicle ([6256bd4](https://github.com/entrostat/road-protect-fleet/commit/6256bd4f35b37a0114c5cf665558beb12fe8abf3)), closes [#332](https://github.com/entrostat/road-protect-fleet/issues/332)
* **crawlers:** Metropark raw infringement mapper and single infringement verification logic ([dda5644](https://github.com/entrostat/road-protect-fleet/commit/dda5644d314e0dbe111cdbd1ea90ea7d3071342e)), closes [#340](https://github.com/entrostat/road-protect-fleet/issues/340)
* **crawlers:** Mileon raw infringement mapper and single infringement verification logic ([cdf9089](https://github.com/entrostat/road-protect-fleet/commit/cdf9089bc64eb68ae1f40f8c0b994ca1c1781208)), closes [#324](https://github.com/entrostat/road-protect-fleet/issues/324)
* **crawlers:** Mileon raw infringement mapper and single infringement verification logic completed ([f5ed077](https://github.com/entrostat/road-protect-fleet/commit/f5ed0773e7de36b8c3e829ada71b6ef14291095d)), closes [#328](https://github.com/entrostat/road-protect-fleet/issues/328)
* **crawlers:** Mileon scheduler and queue worker to sync infringements with crawler ([cd22577](https://github.com/entrostat/road-protect-fleet/commit/cd2257748ef0a683bb0e2c0e4c74238ec5f8535f)), closes [#396](https://github.com/entrostat/road-protect-fleet/issues/396)
* **crawlers:** Mileon sync multiple infringements for vehicle in a particular municipality ([d2de25a](https://github.com/entrostat/road-protect-fleet/commit/d2de25a718bdf5325ece5d0c2057868bd54a11d8)), closes [#339](https://github.com/entrostat/road-protect-fleet/issues/339)
* **crawlers:** Police raw infringement mapper and single infringement verification logic ([1e0ac71](https://github.com/entrostat/road-protect-fleet/commit/1e0ac716339679c912c6da5bd3973a8d2bd47dae)), closes [#367](https://github.com/entrostat/road-protect-fleet/issues/367)
* **crawlers:** Police scheduler and queue worker to sync infringements with crawler ([39c914d](https://github.com/entrostat/road-protect-fleet/commit/39c914d07d9939cbff42fcfc9a54027f3d73ff79)), closes [#397](https://github.com/entrostat/road-protect-fleet/issues/397)
* **crawlers:** Police sync multiple infringements for vehicle ([268e917](https://github.com/entrostat/road-protect-fleet/commit/268e91702c740c3d139ee9960c171abb5ebb84e7)), closes [#374](https://github.com/entrostat/road-protect-fleet/issues/374)
* **crawlers:** Prod deployment setup of crawlers ([e1d4b3a](https://github.com/entrostat/road-protect-fleet/commit/e1d4b3adc91b372b49de5fdd0a57311d1aa8fd7c)), closes [#364](https://github.com/entrostat/road-protect-fleet/issues/364)
* **crawlers:** Puppeteer deployment fixed so that crawler deployment works ([9d83755](https://github.com/entrostat/road-protect-fleet/commit/9d83755fc7e01f5f37286085579d0399f5fb4d15)), closes [#371](https://github.com/entrostat/road-protect-fleet/issues/371)
* **crawlers:** Refactor to create testable integrations for jerusalem and telaviv crawlers ([0d2015a](https://github.com/entrostat/road-protect-fleet/commit/0d2015a369ab6d2f1fb2ddafe1a4b61b80ca5b93)), closes [#313](https://github.com/entrostat/road-protect-fleet/issues/313)
* **crawlers:** Refactor to use integration details for selecting which verification flow to use ([8b6866d](https://github.com/entrostat/road-protect-fleet/commit/8b6866d0a2f597f0a796e52bbd258680f23f662b)), closes [#325](https://github.com/entrostat/road-protect-fleet/issues/325)
* **crawlers:** Refactored automation and manual redirection processes into their own services ([79d46af](https://github.com/entrostat/road-protect-fleet/commit/79d46afc7ee98dbe2b12bec79d01004fb1bddf10)), closes [#476](https://github.com/entrostat/road-protect-fleet/issues/476)
* **crawlers:** Removed the BRN link requirement on the crawlers ([0da3d00](https://github.com/entrostat/road-protect-fleet/commit/0da3d00523285baa0562539b68bf95733b220524)), closes [#607](https://github.com/entrostat/road-protect-fleet/issues/607)
* **crawlers:** Staging deployment and service crawler api setup with workflows adjusted to work with submodules ([1516ef0](https://github.com/entrostat/road-protect-fleet/commit/1516ef09ead9fc13ae0ec6ff97b27d2c031851e7))
* **crawlers:** Telaviv paginated crawler request for batch infringements ([9a9e693](https://github.com/entrostat/road-protect-fleet/commit/9a9e69319ab77d6970c0b9130785b8ac7e58c87f)), closes [#419](https://github.com/entrostat/road-protect-fleet/issues/419)
* **crawlers:** Telaviv raw infringement mapper  ([dc44083](https://github.com/entrostat/road-protect-fleet/commit/dc440836d118908e739dba7765a67ab08bf0e201)), closes [#309](https://github.com/entrostat/road-protect-fleet/issues/309)
* **crawlers:** Telaviv scheduler and queue worker to sync infringements with crawler ([30bc76a](https://github.com/entrostat/road-protect-fleet/commit/30bc76a78d8d3b5c0f1961bdfd44176df4dae2aa)), closes [#383](https://github.com/entrostat/road-protect-fleet/issues/383)
* **crawlers:** Telaviv sync multiple infringements for account ([6e3894d](https://github.com/entrostat/road-protect-fleet/commit/6e3894d385b88e3c2832a022d288cdb7a18ce493)), closes [#336](https://github.com/entrostat/road-protect-fleet/issues/336)
* **crawlers:** Test options added for testing sync of multiple infringements from available crawlers ([e106b61](https://github.com/entrostat/road-protect-fleet/commit/e106b6160c65908655120ff5e410a041c6b1cb99)), closes [#347](https://github.com/entrostat/road-protect-fleet/issues/347)
* **crawlers:** Updated crawler functionality for Telaviv redirections ([e5f7a49](https://github.com/entrostat/road-protect-fleet/commit/e5f7a4910e3c3c4e28834676a410a63e68273ce7))
* **crawlers:** Updated crawler submodule ([8c94908](https://github.com/entrostat/road-protect-fleet/commit/8c94908a0d72f5c1d7ba294f3971773839610f01))
* **crawlers:** Updated crawler submodule ([ba42c78](https://github.com/entrostat/road-protect-fleet/commit/ba42c784ef4695ec5f4ced4aa977b3ccde1a9699))
* **crawlers:** Updated crawler submodule ([dc377a3](https://github.com/entrostat/road-protect-fleet/commit/dc377a36a0d539ed480273be5569bf0cbbad49c5))
* **crawlers:** Updated crawler submodule ([8328e5e](https://github.com/entrostat/road-protect-fleet/commit/8328e5e7621202b16ae0ce4bcdd96586e09e7f47))
* **crawlers:** Updated crawler submodule ([d86193c](https://github.com/entrostat/road-protect-fleet/commit/d86193c00f9e7e62652242f249e4e8580c468fd6))
* **crawlers:** Updated crawler submodule ([a1c19a8](https://github.com/entrostat/road-protect-fleet/commit/a1c19a8aa4b56cd157c895072e3801a7873c28d7))
* **crawlers:** Updated crawler submodule ([ac7d420](https://github.com/entrostat/road-protect-fleet/commit/ac7d4206aead8f5a0c24d2a885f654eac9fa8b2b))
* **crawlers:** Verify infringement via Jerusalem crawler logic ([5690f53](https://github.com/entrostat/road-protect-fleet/commit/5690f534fd3a49340026e19ef0fbae8adb4da1b9)), closes [#315](https://github.com/entrostat/road-protect-fleet/issues/315)
* **crawlers:** Verify infringement via Telaviv crawler logic ([3f654b0](https://github.com/entrostat/road-protect-fleet/commit/3f654b05bbe572ef9bd06468f5d0aa2d286d240d)), closes [#316](https://github.com/entrostat/road-protect-fleet/issues/316)
* **data-manipulators:** Added a decorator for standard strings on the dtos ([8cc76c8](https://github.com/entrostat/road-protect-fleet/commit/8cc76c895c3cfe94ebdaaecbf9c007e7549717a3)), closes [#380](https://github.com/entrostat/road-protect-fleet/issues/380)
* **datetime:** Refactored the datetime pattern matcher to make it more manageable ([61057e2](https://github.com/entrostat/road-protect-fleet/commit/61057e21d289d0a7fe736c3516e027af471ccf72)), closes [#426](https://github.com/entrostat/road-protect-fleet/issues/426)
* **datetime-patterns:** Added HH:MM dd/mm/yyyy and other similar patterns to the system ([c0b1d7a](https://github.com/entrostat/road-protect-fleet/commit/c0b1d7ab0848355f75c545eb294ae18898f06102)), closes [#425](https://github.com/entrostat/road-protect-fleet/issues/425)
* **default-filtering:** Filter the infringements table by Due and Outstanding statuses by default ([b56be7e](https://github.com/entrostat/road-protect-fleet/commit/b56be7ed5de8bb794c124ab22a806c4ba9fc6868))
* **deploy:** Added scripts for running migrations and deployments using entro-ci ([66feb7b](https://github.com/entrostat/road-protect-fleet/commit/66feb7bc06593e5ef85aab13570cfb15eef8bae8))
* **devops:** Added persistent volume for crawler api temp folder ([0f70b97](https://github.com/entrostat/road-protect-fleet/commit/0f70b972392ab2530735c6e3f3f8dec2f9cc130e)), closes [#491](https://github.com/entrostat/road-protect-fleet/issues/491)
* **devops:** Added the ability to build or pull the backend and frontend images ([369a006](https://github.com/entrostat/road-protect-fleet/commit/369a006d4a26199b7921e0c814aaad3a360d27b9))
* **digital-nomiations:** added the ability to process batch nominations across the whole system ([7f0cb85](https://github.com/entrostat/road-protect-fleet/commit/7f0cb8555ea212135c818637eb7a01c385be1aed)), closes [#174](https://github.com/entrostat/road-protect-fleet/issues/174)
* **digital-nomination:** modified the digital nomination service to ensure that we check all of the rules before nominating ([a64a20f](https://github.com/entrostat/road-protect-fleet/commit/a64a20f1d99e49d0be3c2b8de16fd470d83ee47b)), closes [#169](https://github.com/entrostat/road-protect-fleet/issues/169)
* **digital-nominations:** Added a cron job to digitally nominate infringements automatically ([190ecf3](https://github.com/entrostat/road-protect-fleet/commit/190ecf3cc399868ff2d9ebb7931b39b04c100ad4))
* **digital-nominations:** Added the ability to run digital nominations for a single infringement to test the logic ([120b34d](https://github.com/entrostat/road-protect-fleet/commit/120b34d8536dc2f0f275e2f6f82d293695b4bb9c)), closes [#216](https://github.com/entrostat/road-protect-fleet/issues/216)
* **digital-nominations:** enabled digital nominations on creation of a new infringement ([e4396b2](https://github.com/entrostat/road-protect-fleet/commit/e4396b2fce8c641c2b7d59b9dac2e38235893e82)), closes [#171](https://github.com/entrostat/road-protect-fleet/issues/171)
* **digital-nominations:** No longer allow digital nominations when they have been redirected ([b528563](https://github.com/entrostat/road-protect-fleet/commit/b528563723015dd74ee2eb9c2502e6eea1144b3f)), closes [#254](https://github.com/entrostat/road-protect-fleet/issues/254)
* **digital=nominations:** enabled digital nominations on creation of a new infringement ([565ffe3](https://github.com/entrostat/road-protect-fleet/commit/565ffe3b662ceb35210c5609c12614bc3b8bdb1a)), closes [#171](https://github.com/entrostat/road-protect-fleet/issues/171)
* **document-upload:** added a safe parser and exceptions to the document service to improve stability and detect runtime errors ([bce586c](https://github.com/entrostat/road-protect-fleet/commit/bce586c1b6c058925b36f3110c7c68a07d54845a)), closes [#181](https://github.com/entrostat/road-protect-fleet/issues/181)
* **edit-status:** Allow user to select any nomination status and infringement status given that it is a valid combination ([234662f](https://github.com/entrostat/road-protect-fleet/commit/234662f1271fe46c41e869da8bc464bede903f0a))
* **edit-status:** Separate infringement and nomination status edits ([c359cd1](https://github.com/entrostat/road-protect-fleet/commit/c359cd1324bc3f9cea89ce1c017c9f2d392eae37))
* **edit-status:** Submit changes to infringement and nomination status ([c28314f](https://github.com/entrostat/road-protect-fleet/commit/c28314fbb654206741b358864a2b869af9a49a6e))
* **edit-status:** User can edit infringement and nomination statuses if it is a valid transition ([a88f8c2](https://github.com/entrostat/road-protect-fleet/commit/a88f8c2045c1b48ab3f742627638f4a575dfb2bd))
* **email-redirection-template:** Adapt the email redirection template to enable the optional fleet management logo and vehicle officer approval image to the redirection template document ([a580a76](https://github.com/entrostat/road-protect-fleet/commit/a580a7625dab7cc2aa5c430a80fb1a980c58ee2b))
* **env:** Added emma back to git secrets ([8608d2a](https://github.com/entrostat/road-protect-fleet/commit/8608d2afbc99c92ad44c2d7dae72e71e746f7f17))
* **exact-filter:** Filter infringements by infringement notice number and vehicle registration with an exact match ([379fcbf](https://github.com/entrostat/road-protect-fleet/commit/379fcbf5fe61ec3ecbcb304732daf53646a1fcba))
* **external-change-date:** Added the frontend view for the external change date ([ea3b91c](https://github.com/entrostat/road-protect-fleet/commit/ea3b91cf1ea5ca9da20c3e59b91a2ce0d59fa5fe)), closes [#259](https://github.com/entrostat/road-protect-fleet/issues/259)
* **external-change-tracking:** Added the external date changed to infringements to track when an infringement changes due to an external source ([05c82d9](https://github.com/entrostat/road-protect-fleet/commit/05c82d90a60e9f3b7ee38dd8c70e5eab2f7adff5)), closes [#257](https://github.com/entrostat/road-protect-fleet/issues/257)
* **external-redirections:** Created the ability to track if a redirection was done externally or internally and fix the nominations that are currently incorrect around this ([3d1c7fb](https://github.com/entrostat/road-protect-fleet/commit/3d1c7fb53b172ba8185c18e6db7f766a3e7112ce)), closes [#445](https://github.com/entrostat/road-protect-fleet/issues/445)
* **filters:** automatically add the filter data from the query parameters if they exist for any table on the system ([d544e9e](https://github.com/entrostat/road-protect-fleet/commit/d544e9e6116059de8c2b1287cbbd0164556139fe)), closes [#167](https://github.com/entrostat/road-protect-fleet/issues/167)
* **git-secret:** Added git secret to the repository ([1f91f77](https://github.com/entrostat/road-protect-fleet/commit/1f91f77e36310ad2ba3a78588931d447b96ccbd4))
* **graphiing-by-issuer:** Aggregate infringements by issuer data ([553d043](https://github.com/entrostat/road-protect-fleet/commit/553d043d576dec93cc613f33283e6880928f862c))
* **graphing:** Auto populate graphing pages  ([5bddff0](https://github.com/entrostat/road-protect-fleet/commit/5bddff0c19f2af99f753c4550fc6f1744e38b45f))
* **graphing:** Show user when there is no aggregaed data to display ([77f35ec](https://github.com/entrostat/road-protect-fleet/commit/77f35ec6a77f6f3876ad0af193788e6828ab2c5c))
* **graphing-by-issuer:** Add table, line graph and bar chart for aggregated by issuer data. Add logic to only display the top 10 Issuers in the bar chart and line graphs ([f54906d](https://github.com/entrostat/road-protect-fleet/commit/f54906df1c9a053be9e079015b411c4f9e46acf8))
* **graphing-by-issuer:** Add tooltip for totals in graphing by issuer table ([1a097ee](https://github.com/entrostat/road-protect-fleet/commit/1a097eedf69d6b62c5c0dc51be8c0c73a14c41fe))
* **graphing-by-issuer:** Added the ability to view filtered infringements by clicking on the graph legend ([a09ee76](https://github.com/entrostat/road-protect-fleet/commit/a09ee769ae1a0383b07db8b0ed3cc2ba64f4955c))
* **graphing-by-issuer:** Duplicate the general table into the graphing by issuer table component for further customisation.  ([2e63efb](https://github.com/entrostat/road-protect-fleet/commit/2e63efbf977e1901aba3bc350246d70a9586ca11))
* **graphing-by-issuer:** Set parameters in NgRx store to filter infringements on graphing by issuer page infringements table ([7a60dcb](https://github.com/entrostat/road-protect-fleet/commit/7a60dcb308202567edfb006707cef2944162cc9b))
* **graphing-by-issuer:** Show comparison to previous year in the aggregate table ([4fbee65](https://github.com/entrostat/road-protect-fleet/commit/4fbee651f7e3383e3ee754950ce7085c00faf6bf))
* **graphing-by-issuer:** Show details of breakdown of infringements by status on clicking entries in the graphing by issuer table   ([ad22847](https://github.com/entrostat/road-protect-fleet/commit/ad228479bbfea4afa53c3628fb8c11640f7a2b28))
* **graphing-by-issuer:** View infringements table in graphing by issuer page ([c072ad4](https://github.com/entrostat/road-protect-fleet/commit/c072ad4472dcd86edc40241444afadbe2671694f))
* **graphing-by-status:** Add graphs and table for infringements by status ([e25c6bf](https://github.com/entrostat/road-protect-fleet/commit/e25c6bf08de80ba0a0f6eccf9991ca970acbd458))
* **graphing-by-status:** Added default date range buttons and translations ([1599a34](https://github.com/entrostat/road-protect-fleet/commit/1599a347bbd02b752358d8a5019965a0919daf8a))
* **graphing-by-status:** Show count of infringements on the table as well as the formatted sum of their total amounts ([f249512](https://github.com/entrostat/road-protect-fleet/commit/f24951216fb8db14cacab05c7f62c9cab567aa09))
* **info-request:** Updated the infringement view radio button filters Merge branch 'feature/RPF-374/update-infringement-buttons' into develop ([e065a8d](https://github.com/entrostat/road-protect-fleet/commit/e065a8d93d987590a774f1dd8ebf4a8ff679cdb4))
* **infringement:** Added constraint for vehicle and notice number ([f68ddd3](https://github.com/entrostat/road-protect-fleet/commit/f68ddd3e67cbaf254b422a16d5b7565e2132335b))
* **infringement:** Added total amount field to infringement entity; changed outstanding status to only represent infringements that have total amount greater than outstanding amount; set infringement status to outstanding only during scheduler and not at status mapper level ([088580d](https://github.com/entrostat/road-protect-fleet/commit/088580d7e159510a70ae3eed8ff79414618ceb9a)), closes [#212](https://github.com/entrostat/road-protect-fleet/issues/212)
* **infringement:** Allow original amount to be updated ([2ec4955](https://github.com/entrostat/road-protect-fleet/commit/2ec4955da6c7d94453689d940e4ca9561fa1b5e8))
* **infringement-display:** Show contract associated with the infringement with infringement details ([4adf233](https://github.com/entrostat/road-protect-fleet/commit/4adf23334b7892247ab925e26654d8b09922772b))
* **infringement-logs:** Moved infringement log writing to a queue to avoid transaction issues ([ee26e81](https://github.com/entrostat/road-protect-fleet/commit/ee26e817f41a26fc579f642f2a4e407fa4d4885a)), closes [#483](https://github.com/entrostat/road-protect-fleet/issues/483)
* **infringement-report:** Remove penalty amount from infringement reporting and add total original amount. Remove newline characters  ([f7a9ff2](https://github.com/entrostat/road-protect-fleet/commit/f7a9ff270c57a2a866f587db6f63991125c74c21))
* **infringement-reporting:** Add endpoint to trigger scheduled infringement reporting endpoint ([ef26b5d](https://github.com/entrostat/road-protect-fleet/commit/ef26b5d8117f30e775bc036c944740d7d623c3ae))
* **infringement-reporting:** Made changes to the formatting of the files attached to an infringement report email ([6146156](https://github.com/entrostat/road-protect-fleet/commit/6146156c56ca8dcae19df5b8687b91f5272418e6))
* **infringement-status:** Select infringement status to edit depending on selected nomination status ([6a8f9d7](https://github.com/entrostat/road-protect-fleet/commit/6a8f9d76c1eb748555d34f857e2f7210cd962fc2))
* **infringement-table:** Added BRN and vehicle owner to the infringement table Merge branch 'feature/RPF-341/add-brn-to-infringement-table' into develop ([d8d3f1e](https://github.com/entrostat/road-protect-fleet/commit/d8d3f1e1585ccdaf12b5fab010cf5d8b75ff649b))
* **infringement-table:** Change the order of columns of the infringement table as well as the items in the table ([1d99381](https://github.com/entrostat/road-protect-fleet/commit/1d993819233822777a015380ddaf4ff8036ab562))
* **infringement-table:** Refined the radio buttons for the infringement table views Merge branch 'feature/RPF-347/new-user-infringement-table-filter' into develop ([19d7f6c](https://github.com/entrostat/road-protect-fleet/commit/19d7f6c2ff846b933c37b8b8bef840f7c4a772f5))
* **infringement-table:** Show the account tag that corresponds to the infringement's brn next to it in the table ([5085e27](https://github.com/entrostat/road-protect-fleet/commit/5085e27804e339e5177db6cb0debbdee736916d0))
* **infringement-update-logic:** improved the update logic for checking validity of whether or not raw data should be considered ([1a5e324](https://github.com/entrostat/road-protect-fleet/commit/1a5e324d7208a0d0ad7007fa82c59ba6c5fb562e)), closes [#177](https://github.com/entrostat/road-protect-fleet/issues/177)
* **infringement-upsert:** Added the ability to choose multiple or no issuers during the infringement upload ([621499f](https://github.com/entrostat/road-protect-fleet/commit/621499fcfd93b1525598f37b3f0d6dd600d646cf)), closes [#341](https://github.com/entrostat/road-protect-fleet/issues/341)
* **infringement-view:** Added a new filter to the infringement view ([23ee37c](https://github.com/entrostat/road-protect-fleet/commit/23ee37c4eb17ebca67203b4ecddc4035f162e242))
* **infringement-view:** Added the account associated with the BRN to the infringement view Merge branch 'feature/RPF-348/add-account-name-to-infringement-view' into develop ([223b704](https://github.com/entrostat/road-protect-fleet/commit/223b7041875b8d002af49c6ac3a363688eab1bb2))
* **infringement-view:** Change order of fields displayed in infringement view  ([6ba12a5](https://github.com/entrostat/road-protect-fleet/commit/6ba12a58135e7865530c1a85b5d3ac6d54144cf7))
* **infringement-view:** Change order of fields displayed in infringement view and add a collapsible menu to see more details ([827e624](https://github.com/entrostat/road-protect-fleet/commit/827e6248109a9c797a55cd8308b2457b0ea0f303))
* **infringements:** Added the ability to fix infringements that had the outstanding status but an original amount of zero ([458fc7b](https://github.com/entrostat/road-protect-fleet/commit/458fc7b9c36e9e8b48628372be8d57b1de114bc1))
* **infringements-view:** Added the external redirection references Merge branch 'feature/RPF-418/add-external-redirection-reference-to-table' into develop ([71e1fd5](https://github.com/entrostat/road-protect-fleet/commit/71e1fd5b3c38888677cc3f6a347ad4ed3cfbb126))
* **integration-tests:** Added a Telaviv Integration test with a notice number filter Merge branch 'feature/RPF-404/telaviv-single-infringement-integration-test' into develop ([2d908ae](https://github.com/entrostat/road-protect-fleet/commit/2d908aebffb7b0b2502c593dfdc721a2341d9e53))
* **integration-tests:** Added Police integration test to include case number Merge branch 'feature/RPF-405/police-integration-test-by-number' into develop ([8e5e2dd](https://github.com/entrostat/road-protect-fleet/commit/8e5e2ddb1a1f8b6111891565321799815ae558e8))
* **integrations:** Added integration request log entity that's used in various integrations and added admin log panel to view these logs ([af2a982](https://github.com/entrostat/road-protect-fleet/commit/af2a982862733f586d1ead029f4aea0fc9a8d0f9)), closes [#258](https://github.com/entrostat/road-protect-fleet/issues/258)
* **integrations:** Added integration testing page for add vehicle ([561f89e](https://github.com/entrostat/road-protect-fleet/commit/561f89ed5d9bb2588a845bd37b5de289844880cb)), closes [#238](https://github.com/entrostat/road-protect-fleet/issues/238)
* **integrations:** Added integration testing page for update vehicle ([d105a23](https://github.com/entrostat/road-protect-fleet/commit/d105a23dc8f6a5ec4e05e14a2aebb25d548388b8)), closes [#241](https://github.com/entrostat/road-protect-fleet/issues/241)
* **interation-tests:** Adjusted integration tests to search for new infringements Merge branch 'feature/RPF-416/integration-tests-new-infringement' into develop ([d460485](https://github.com/entrostat/road-protect-fleet/commit/d460485279df66d9cc54bfb32384c4b6a3d6de12))
* **issuer:** Update verification provider and code on issuer ([e482b71](https://github.com/entrostat/road-protect-fleet/commit/e482b71e4d8436f694053200728ba79b0a7e4b14)), closes [#452](https://github.com/entrostat/road-protect-fleet/issues/452)
* **issuer-dropdown:** Issuer autocomplete for all issuer name filters ([ec21282](https://github.com/entrostat/road-protect-fleet/commit/ec21282507a3651456b20e0463c5a7c74c6b9d68))
* **job:** Client notification of verification queued and socket updates for job status  ([2be510b](https://github.com/entrostat/road-protect-fleet/commit/2be510b1e9cf87c4e4a50913add81386ea03ac3a)), closes [#441](https://github.com/entrostat/road-protect-fleet/issues/441)
* **latest-payment-date:** Don't display time when showing the latest payment date ([3dc0716](https://github.com/entrostat/road-protect-fleet/commit/3dc0716d32637ef6eef17ddb9dbca0b5d137e834))
* **logger:** Removed the GCP logger to see if there are issues ([69a1442](https://github.com/entrostat/road-protect-fleet/commit/69a14425a674680452aa0e943d7e9ab84f62dab8))
* **logs:** Added job log for admins ([89d0767](https://github.com/entrostat/road-protect-fleet/commit/89d07677b8ebbc7942e216b7a28c06e4b7fe2c97)), closes [#418](https://github.com/entrostat/road-protect-fleet/issues/418)
* **manual-infringements:** added the ability to create or update infringements manually ([975589a](https://github.com/entrostat/road-protect-fleet/commit/975589ac04b381bfa0d2454ff69d7f919edf70c3)), closes [#191](https://github.com/entrostat/road-protect-fleet/issues/191)
* **manual-redirections:** Added the ability to filter missing infringements by a customer so that there is not an overload of missing infringements on an issuer level. ([38758d9](https://github.com/entrostat/road-protect-fleet/commit/38758d9951b2fe964ffa9a89d72850adbf879363)), closes [#278](https://github.com/entrostat/road-protect-fleet/issues/278)
* **manual-redirections:** Added the ability to run manual redirections through the frontend and we look at missing infringements on an issuer level to determine if the redirection should be marked as complete ([b84b98a](https://github.com/entrostat/road-protect-fleet/commit/b84b98a96cfc9eed5782f1a29c7554062051149d)), closes [#240](https://github.com/entrostat/road-protect-fleet/issues/240)
* **manual-status-changes:** Add a simple manual status change option as well as the existing advanced method ([7d68a48](https://github.com/entrostat/road-protect-fleet/commit/7d68a488fc221f470683031edabd62e6a4edbbcb))
* **multiple-select:** Enable multiple selection on dropdown filters ([db4fcb3](https://github.com/entrostat/road-protect-fleet/commit/db4fcb39519779e8d2a0ec9e599eb444c06f3f98))
* **nomination:** Include specific nomination details on the created or updated nomination during infringment create or update ([816a3f0](https://github.com/entrostat/road-protect-fleet/commit/816a3f00e0c4201363472f4c8a8b795f016a05e5))
* **nomination:** Unapprove infringement nomination for payment ([932986a](https://github.com/entrostat/road-protect-fleet/commit/932986a86d82ae013946564b6215044953b3dab4)), closes [#236](https://github.com/entrostat/road-protect-fleet/issues/236)
* **nomination-status:** Additional inputs depending on selected nomination status ([d46432c](https://github.com/entrostat/road-protect-fleet/commit/d46432ca61cab9281415b91cc03b9fd5a886520d))
* **nomination-status:** Questions to guide user with nomination status selection ([224b72f](https://github.com/entrostat/road-protect-fleet/commit/224b72f743ff079887c9309621ae7754f1b96993))
* **nomination-type:** Removed the old nomination types and replaced the old types with the new ones ([d1f5130](https://github.com/entrostat/road-protect-fleet/commit/d1f51303ea242aa58220a2f6f192da06709f5b91)), closes [#306](https://github.com/entrostat/road-protect-fleet/issues/306)
* **nominations:** Added the ability to fix the infringements that are missing nominations ([74adefe](https://github.com/entrostat/road-protect-fleet/commit/74adefe089c8099234e44ccfd8dd889852af0f21))
* **nominations:** Added the ability to pull infringements with missing nominations ([ebae8a1](https://github.com/entrostat/road-protect-fleet/commit/ebae8a14ac4d8286ed9c0e3ebbdb6d1472b603cb)), closes [#344](https://github.com/entrostat/road-protect-fleet/issues/344)
* **nominations:** Added the standard nomination rules to nominations so that the paid date and status update automatically ([24906b6](https://github.com/entrostat/road-protect-fleet/commit/24906b6fabf928f95522faa9bd10c2255ec30c8f))
* **ocr:** Cleaned up ocr deployment ([c55b196](https://github.com/entrostat/road-protect-fleet/commit/c55b19665e2c53ad1acb07e970df153b217f581e)), closes [#464](https://github.com/entrostat/road-protect-fleet/issues/464)
* **ocr:** Force upload a contract that has failed OCR Merge branch 'feature/RPF-395/force-upload-contract' into develop ([a2c98bd](https://github.com/entrostat/road-protect-fleet/commit/a2c98bd7d4fda7b7d341f7e4371c05e0b4088b5d))
* **ocr:** Implemented ocr microservice ([d01f422](https://github.com/entrostat/road-protect-fleet/commit/d01f42266740be3049e65f881c510665604bb3d2)), closes [#463](https://github.com/entrostat/road-protect-fleet/issues/463)
* **ocr-updatelease:** Run new lease documents through OCR before uploading Merge branch 'feature/RPF-350/ocr-update-lease' into develop ([db50127](https://github.com/entrostat/road-protect-fleet/commit/db50127a7ac8b75464e51f9214a7369cd619fc72))
* **old-fleets:** Disabled the sync with Ahmad's system ([7298320](https://github.com/entrostat/road-protect-fleet/commit/729832085e278cb1ce11eb1c69f67103100f9791))
* **payment-reference:** Added external payment references to payments ([7c34c0d](https://github.com/entrostat/road-protect-fleet/commit/7c34c0d1f3d026da9109f9fcdb9740425b0f04e2)), closes [#390](https://github.com/entrostat/road-protect-fleet/issues/390)
* **payment-reference:** Added the ability to upload the payment reference ([c171afe](https://github.com/entrostat/road-protect-fleet/commit/c171afe2ec61b93a979e2ed28d8ca3bef2c2eaf0)), closes [#417](https://github.com/entrostat/road-protect-fleet/issues/417)
* **payment-upload:** Added the ability to upload payment dates and amounts in a spreadsheet ([c4f9226](https://github.com/entrostat/road-protect-fleet/commit/c4f922662a9529d2332f648432185f45876ed6e2)), closes [#410](https://github.com/entrostat/road-protect-fleet/issues/410)
* **payment-view:** Added the payment information to infringements ([0f93879](https://github.com/entrostat/road-protect-fleet/commit/0f938793df10579f76d214d0a734b99ce00e9770)), closes [#391](https://github.com/entrostat/road-protect-fleet/issues/391)
* **payments:** Added an external payment service that can be used to create and update existing payments ([044a8c7](https://github.com/entrostat/road-protect-fleet/commit/044a8c709ad6e778423c27bff193d100ba1446c8)), closes [#406](https://github.com/entrostat/road-protect-fleet/issues/406)
* **payments:** Added the ability to upload payment information in the spreadsheet ([a6d5c63](https://github.com/entrostat/road-protect-fleet/commit/a6d5c63058f3d61a1f65f03748af06a2e95007de)), closes [#407](https://github.com/entrostat/road-protect-fleet/issues/407)
* **payments:** Updated the Infringement-Payment relation to one-to-many Merge branch 'feature/RPF-372/one-to-many-payments' into develop ([53efe1e](https://github.com/entrostat/road-protect-fleet/commit/53efe1e8d4fb92b0cc4e57fc825ff5fb913ff953))
* **penalties:** Ensured that all original amounts are updated ([e032ed8](https://github.com/entrostat/road-protect-fleet/commit/e032ed8caad095e9a5f3e1c28bad733eb4d6c180))
* **penalty-calculations:** Updated the penalty calculations to a fixed column rather than calculated Merge branch 'feature/RPF-369/refine-penalty-amount' into develop ([d322e93](https://github.com/entrostat/road-protect-fleet/commit/d322e93afc8b3070000598c42b67274bc988e67c))
* **queue-workers:** Added the queue workers to the system ([5b94dba](https://github.com/entrostat/road-protect-fleet/commit/5b94dba11f0f2462730f4a51d60c737e6f11cafd))
* **rate-limiting:** Added rate limiting on an action level to prevent users from overusing certain actions ([054e72c](https://github.com/entrostat/road-protect-fleet/commit/054e72c3352cad1f00b31ce3bd7de12906f1baea)), closes [#520](https://github.com/entrostat/road-protect-fleet/issues/520)
* **raw-infringement:** Update original amount during infringement update and process ATG updates ([4607d4b](https://github.com/entrostat/road-protect-fleet/commit/4607d4beb92b50f65d8bc7c73a98d63712a06b51))
* **redirection-letter-send-date:** Split the nomination date and redirection letter send date into two different dates ([8d886a3](https://github.com/entrostat/road-protect-fleet/commit/8d886a3b3d6570d23b73248701ff86870a9fa555)), closes [#286](https://github.com/entrostat/road-protect-fleet/issues/286)
* **redirection-template:**  Change default signature size, show Ore's name in Hebrew and change the display of the Issuer in the redirection template ([00c7b1d](https://github.com/entrostat/road-protect-fleet/commit/00c7b1d57b14a12d8b9ef76d19fc1c879aac217e))
* **redirection-template:**  Set the logo height to be the same for all logos in the redirection template ([031f049](https://github.com/entrostat/road-protect-fleet/commit/031f049d12a07f57ec8a4c2733dea44fe9dc73e5))
* **redirection-type:** Modified the redirection type to be more descriptive and added the Upload option ([637cec6](https://github.com/entrostat/road-protect-fleet/commit/637cec6620e86638b2e4855eb14174940a60a208)), closes [#305](https://github.com/entrostat/road-protect-fleet/issues/305)
* **redirections:** Added additional filters for the redirection identifier (exact match and exists) ([33e8e40](https://github.com/entrostat/road-protect-fleet/commit/33e8e40e76587379f73b1936d3565fc4112a945d))
* **redirections:** Added the ability to make manual redirections on the system ([219e4c0](https://github.com/entrostat/road-protect-fleet/commit/219e4c01fe82534459407cb0aa298d205fe6cd2b)), closes [#213](https://github.com/entrostat/road-protect-fleet/issues/213)
* **redirections:** Added the ability to specify redirection reference ([1c319d2](https://github.com/entrostat/road-protect-fleet/commit/1c319d27f1cdce64c7392b42ce784173ef33531b)), closes [#524](https://github.com/entrostat/road-protect-fleet/issues/524)
* **redirections:** Added the frontend filter for invalid redirections ([bd13eda](https://github.com/entrostat/road-protect-fleet/commit/bd13edac8ac0e987e4c4337e20a220baec48a3c0)), closes [#369](https://github.com/entrostat/road-protect-fleet/issues/369)
* **redirections:** Allow owners to still redirect infringements even if they aren't nominated to them ([2c2785c](https://github.com/entrostat/road-protect-fleet/commit/2c2785cf83b7fb111ecffd2006eb83dadbdaa2d9)), closes [#280](https://github.com/entrostat/road-protect-fleet/issues/280)
* **redirections:** Allow the redirection of an infringement that is in the pending or acknowledged status to go to redirection complete ([28c027c](https://github.com/entrostat/road-protect-fleet/commit/28c027c16e56e52639017b5e9a096e63d222ee83)), closes [#307](https://github.com/entrostat/road-protect-fleet/issues/307)
* **redirections:** Changed the logic to look at the identifier and infringement brn only ([87d22ba](https://github.com/entrostat/road-protect-fleet/commit/87d22ba773bdaaae6d771f50c4c9adf0e948896b))
* **redirections:** Only override the raw redirection identifier when it's an internal action ([64b5514](https://github.com/entrostat/road-protect-fleet/commit/64b55145cf091509397d3e08ea979b129a2bd20d)), closes [#507](https://github.com/entrostat/road-protect-fleet/issues/507)
* **redirections:** Pull the power of attorney from the account matching the BRN on the infringement or the owner of the vehicle. Finally, if neither of those are available and the nominated account is a Municipal redirection, we try with the nominated account. ([3d951db](https://github.com/entrostat/road-protect-fleet/commit/3d951dbb64cd292da40d874e5cc4eebf9d7757af)), closes [#360](https://github.com/entrostat/road-protect-fleet/issues/360)
* **redirections:** Refactored the logic to block redirections when the identifier is specified and we are trying to redirect infringements to identifiers that do not match ([9383985](https://github.com/entrostat/road-protect-fleet/commit/9383985e89d1fab6b637814ab3df2c9d546359c5)), closes [#368](https://github.com/entrostat/road-protect-fleet/issues/368)
* **redirections:** Removed the municipal redirection service from the automatic nomination service ([6f197ea](https://github.com/entrostat/road-protect-fleet/commit/6f197ea5d8d4f7c70f48b53809cb8f6acb44b718))
* **redirections:** Set the redirection identifier and other details at the end of an update and use the logic around redirections to determine if the status should change to a redirection status ([91bb3de](https://github.com/entrostat/road-protect-fleet/commit/91bb3de4d0c872f0bb2f6d464dabc60be41d2e64)), closes [#527](https://github.com/entrostat/road-protect-fleet/issues/527)
* **reporting:** added an infringement type map to the system so that we can use that in Metabase reports ([38d11d1](https://github.com/entrostat/road-protect-fleet/commit/38d11d1c7ed62b2720a43af85ffe950fedc0f3de)), closes [#141](https://github.com/entrostat/road-protect-fleet/issues/141)
* **roles:** added the ability to add multiple roles to each account so that we can control what access each user has on the frontend ([4be8d26](https://github.com/entrostat/road-protect-fleet/commit/4be8d2608340a3d6cb05b3e11b425ab5220bb11c)), closes [#183](https://github.com/entrostat/road-protect-fleet/issues/183)
* **security:** Added the Google Recaptcha to the frontend and limit the number of login attempts ([1b71d91](https://github.com/entrostat/road-protect-fleet/commit/1b71d91096b69a94b3c648c0734d37e8ab51e90b)), closes [#475](https://github.com/entrostat/road-protect-fleet/issues/475)
* **security:** Control the ability of users to change their type or the type of others ([70a4a65](https://github.com/entrostat/road-protect-fleet/commit/70a4a659e23fa3c9d596d65d0dc6884703fe74f0)), closes [#462](https://github.com/entrostat/road-protect-fleet/issues/462)
* **spreadsheet-upload:** Parse the data on the backend for spreadsheets instead of passing it from the frontend. This allows the dates and timezones to be more consistent. ([8a2b174](https://github.com/entrostat/road-protect-fleet/commit/8a2b1747a7084d81d87c02dcd55a650080e5661e)), closes [#331](https://github.com/entrostat/road-protect-fleet/issues/331)
* **status-change-dates:** Added the last change date on the infringement and nomination statuses so that we can track when last they were updated ([b502571](https://github.com/entrostat/road-protect-fleet/commit/b502571d3ed1bcef4f1b0dfd7441cf7de849016c)), closes [#414](https://github.com/entrostat/road-protect-fleet/issues/414)
* **status-immutability:** Ensure that the statuses are immutable ([76b60d6](https://github.com/entrostat/road-protect-fleet/commit/76b60d6b49509e0f1c845b5e86382022d0453852)), closes [#487](https://github.com/entrostat/road-protect-fleet/issues/487)
* **test-emails:** Moved from Ethereal Email to Mailhog so that we don't need to rely on their service uptime ([67cfc3b](https://github.com/entrostat/road-protect-fleet/commit/67cfc3b92ce91cbf0a97c06fc84315869c642307)), closes [#454](https://github.com/entrostat/road-protect-fleet/issues/454)
* **test-infringement-reporting:** Added tests for logic used to select which infringements are reported on and made a few fixes to the infringement reporting ([24c8cd9](https://github.com/entrostat/road-protect-fleet/commit/24c8cd96e3a70fe1b81c0e09acf463975c7bb3fc))
* **tests:** Use entro-jest-flags to filter tests ([6ed2e27](https://github.com/entrostat/road-protect-fleet/commit/6ed2e272b88b609ccd1f1da95270b41c9a6c31e9))
* **timezones:** Added a new method to parse dates and add the timezone so that infringements are on the correct timezone ([bb61fa1](https://github.com/entrostat/road-protect-fleet/commit/bb61fa1411c2d1e523a63c68595be951f2d03177)), closes [#271](https://github.com/entrostat/road-protect-fleet/issues/271)
* **timezones:** added an automated timezone fixer to try to cater for different formats coming in ([243d3a6](https://github.com/entrostat/road-protect-fleet/commit/243d3a69fa3af34055959fe689b0ac2ff8910c5d)), closes [#175](https://github.com/entrostat/road-protect-fleet/issues/175)
* **timezones:** Added the ability to return null if a date is invalid and account for daylight savings ([11b62f9](https://github.com/entrostat/road-protect-fleet/commit/11b62f968e9010e78fa3c23486ace324513d2907)), closes [#274](https://github.com/entrostat/road-protect-fleet/issues/274)
* **translation:** Updated English translation for date redirected to date redirection sent be more specific ([77d1fdc](https://github.com/entrostat/road-protect-fleet/commit/77d1fdcffb3d771050a3ec36afe5454076009b62))
* **ui:** added payment details to the infringement view (hidden for now because we need to refactor payments to be a one-to-many) ([57bf0a2](https://github.com/entrostat/road-protect-fleet/commit/57bf0a25d8a119701a90b14a7db2e77f656d0ea3)), closes [#148](https://github.com/entrostat/road-protect-fleet/issues/148)
* **ui:** Added the additional date filters for infringements ([6ffc201](https://github.com/entrostat/road-protect-fleet/commit/6ffc2013b75a10cacd38c2ef0dfe87482a2a4ed6)), closes [#533](https://github.com/entrostat/road-protect-fleet/issues/533)
* **UI changes:** Spacing on view contract page, tags are removed to either look linkable or unlinkable depending on their behaviour, sidebar layout was changed ([1b72104](https://github.com/entrostat/road-protect-fleet/commit/1b7210471d4d9fd4da9193fd0fa088a796ea7301))
* **ui-changes:** Increase font size across the project, remove icons from filters, align columns of filter descriptions, remove filter placeholders except for ranges, use the same placeholders for date and number ranges, add text wrapping on fields in tables with popover to see full text, checkbox colour in Hebrew now the same as in English, move delete button to the opposite side of the row in all tables, increase default number of rows in the table from 10 to 20, move advanced filter buttons to the bottom of the table, use excel icon rather than ng-zorro icon for exporting the table, change Account Users and Users from general table component to the advanced table component, don't show time in date range filters ([41fb425](https://github.com/entrostat/road-protect-fleet/commit/41fb425088fcd1d07aab03cdf396f666eb5f2c83))
* **unit-tests:** Modified the logic to ensure that all of the unit tests run ([da71261](https://github.com/entrostat/road-protect-fleet/commit/da71261b43aa90e6ce4b78448b47c7f924f24ac9)), closes [#420](https://github.com/entrostat/road-protect-fleet/issues/420)
* **update-readme:** Updated the README to include submodule imports ([a7cf788](https://github.com/entrostat/road-protect-fleet/commit/a7cf7880abaf5e341b8bad1b3f1f648665844d7e))
* **update-status:** Visual feedback on infringement and nomination status update ([04762c8](https://github.com/entrostat/road-protect-fleet/commit/04762c8ef3cee4ace4fff09d7e10d43448ad90a5))
* **upgrade-backend:** Upgraded node to v14.15.5 ([b80bc13](https://github.com/entrostat/road-protect-fleet/commit/b80bc137fc35a4d2569a058cebdd552ad3c54881))
* **vehicle-type:** Added the vehicle type to vehicles and allow filtering on the infringement page by this type ([8bfd854](https://github.com/entrostat/road-protect-fleet/commit/8bfd854c3b416be074dfeba8bac11e96a901b35d)), closes [#492](https://github.com/entrostat/road-protect-fleet/issues/492)
* **verification:** added the ability to run verification (and batch) over infringements ([94a5b44](https://github.com/entrostat/road-protect-fleet/commit/94a5b44c0d73dbc8f11a8a8916c40c5b175367de)), closes [#145](https://github.com/entrostat/road-protect-fleet/issues/145)
* **verifications:** Individual verification job for ATG and scheduler to do batch verifications with ATG ([7694ca6](https://github.com/entrostat/road-protect-fleet/commit/7694ca61497973692c304a65b63316c7d7eb168b)), closes [#401](https://github.com/entrostat/road-protect-fleet/issues/401)
* **verifications:** Individual verification job for Metropark ([2e471b7](https://github.com/entrostat/road-protect-fleet/commit/2e471b74e957bcca45f6569d8cc8e8922448370e)), closes [#402](https://github.com/entrostat/road-protect-fleet/issues/402)
* **verifications:** Individual verification jobs for Jerusalem, Telaviv, Mileon, and Police crawler queues ([1aa0efd](https://github.com/entrostat/road-protect-fleet/commit/1aa0efdfd1f73259585d68db21ab8ee3a3f55545)), closes [#400](https://github.com/entrostat/road-protect-fleet/issues/400)
* **verifications:** Job table created and jobs recorded during queue service dispatch and processing of jobs ([83a7fec](https://github.com/entrostat/road-protect-fleet/commit/83a7fec3b64e5dfaa8c440de67dc7bbec4d4cca4)), closes [#404](https://github.com/entrostat/road-protect-fleet/issues/404)
* **verifications:** Queueing logic developed further for verifications with job logging ([efcdd2d](https://github.com/entrostat/road-protect-fleet/commit/efcdd2d4b4a68bfe263c6a78b18cf39fe80a0897)), closes [#405](https://github.com/entrostat/road-protect-fleet/issues/405)
* **verifications:** Turned on ATG cron job ([34ad154](https://github.com/entrostat/road-protect-fleet/commit/34ad154b7670ad90c2253a3dee9bf6d3d447fa6a))
* **verifications:** Turned on crawler verifications and restricting verifications to accounts with non-hidden users ([c99583d](https://github.com/entrostat/road-protect-fleet/commit/c99583db96508916923916341720cd15c6363da7)), closes [#413](https://github.com/entrostat/road-protect-fleet/issues/413)
* **verifications:** Turned on unpaid verifications scheduler ([4e0ceda](https://github.com/entrostat/road-protect-fleet/commit/4e0ceda9544ef4533134f5ba7eaafc83847d0ad8)), closes [#460](https://github.com/entrostat/road-protect-fleet/issues/460)


### Bug Fixes

* **account-name-related-to-brn:** Show the account, if there is one on the system, that corresponds to the brn from the issuer on the infringements table and in the spreadsheet download ([9ad5f45](https://github.com/entrostat/road-protect-fleet/commit/9ad5f4520f588087c82dcd68792aa4a00387cc32))
* **account-relation:** Don't try to create Account Relation when one already exists with the same forward and reverse accounts ([e54bf37](https://github.com/entrostat/road-protect-fleet/commit/e54bf37452bf906b859c9b96e894064eabe0fb72))
* **accounts:** allow for the primary contact to be changed on accounts ([1c48fde](https://github.com/entrostat/road-protect-fleet/commit/1c48fde7d32be90e14a176521a9b7a9e312f2697)), closes [#187](https://github.com/entrostat/road-protect-fleet/issues/187)
* **address-dropdown:** Address dropdown fixed so that street is not empty on viewing and city is selected first ([35d541b](https://github.com/entrostat/road-protect-fleet/commit/35d541b858b6b04ea6fe138567a8f88690f7d7a4))
* **advanced-table:** Changed how the filter parameters were stored in the selectedFilters object to match how they were being stored when added through the form (flattened) so that they are cleared properly even after refreshing the page ([b3f3b35](https://github.com/entrostat/road-protect-fleet/commit/b3f3b35d41820e977c633ae09e0376edae1c8117))
* **api-docs:** Changed the contacts on the documentation ([2f7b898](https://github.com/entrostat/road-protect-fleet/commit/2f7b89870e8f0aae3668bf411ad867f626375d43))
* **api-docs:** Updated the Swagger documentation, removed the "fix" endpoints ([a289062](https://github.com/entrostat/road-protect-fleet/commit/a2890624300616021b19f903b2b7aa8e1f54843a))
* **approve-for-payment:** Fix the migration that changes the infringement status enum to include approved for payment. This migration now drops the trigger does the migration and then recreates the trigger ([b87c367](https://github.com/entrostat/road-protect-fleet/commit/b87c36725c45839b3d813da35e0ed78b03a5a20c))
* **atg:** Changed tranId to be uuid for atg verify infringement integration ([e4bba87](https://github.com/entrostat/road-protect-fleet/commit/e4bba8733283577b7b10473f0432d84b5f059fb0))
* **atg:** Type the inputs before running validation ([9f17a71](https://github.com/entrostat/road-protect-fleet/commit/9f17a71650f6b68f108f7bbb0e2bca63668836b3))
* **atg-verify:** Added trim transform and applied to ATG dtos ([f3da53e](https://github.com/entrostat/road-protect-fleet/commit/f3da53ea5289b1e677e3f0af71d5e12b710b10a8)), closes [#297](https://github.com/entrostat/road-protect-fleet/issues/297)
* **atg-verify:** Fields for amount and penalty switch for this mapper ([145597a](https://github.com/entrostat/road-protect-fleet/commit/145597a0af4b1514bd96dc5e37d557b0412afeb7)), closes [#300](https://github.com/entrostat/road-protect-fleet/issues/300)
* **atg-verify:** Set brn on infringemenet dto during update to ensure that redirection takes place via municipal flow instead of manual ([2afcbbd](https://github.com/entrostat/road-protect-fleet/commit/2afcbbd443ce77e249c3433a1753260653f9ea2c)), closes [#301](https://github.com/entrostat/road-protect-fleet/issues/301)
* **atg-verify:** Use manual redirections to update nomination on receiving atg verify request but also update brn ([2833f9f](https://github.com/entrostat/road-protect-fleet/commit/2833f9f66b905316df4fb312b07b4b7a7af1e30e)), closes [#302](https://github.com/entrostat/road-protect-fleet/issues/302)
* **auth:** Need to use the user auth guard with the system admin guard ([afb50d4](https://github.com/entrostat/road-protect-fleet/commit/afb50d4eed480d0ea5241c108430b339026fcbb6))
* **automatic-nomination:** Added the ability to redirect a nomination to a BRN that is not on the system using the redirection identifier logic ([38fbd98](https://github.com/entrostat/road-protect-fleet/commit/38fbd982b341d0d3e6cb92a7c9f3f82f127d8205)), closes [#343](https://github.com/entrostat/road-protect-fleet/issues/343)
* **batch-actions:** Added the ability to batch approve for payments back ([877a82a](https://github.com/entrostat/road-protect-fleet/commit/877a82a737945821d236b65fd1f26997d76bde1b))
* **batch-actions-on-admin-view:** Fixed which batch actions are shown in the admin infringements page ([769e57c](https://github.com/entrostat/road-protect-fleet/commit/769e57c3fec51b27e6e87a23ea50620d35da4e84))
* **batch-redirection-modal:** improve interface of batch digital redirection modal ([cafbf58](https://github.com/entrostat/road-protect-fleet/commit/cafbf58dba4f816370a1fb7af23d1576c525a533))
* **bau:** missing accountId error on router link Merge branch 'fix/RPF-420/missing-account-id' into develop ([df630d9](https://github.com/entrostat/road-protect-fleet/commit/df630d9f46d7d06542896492e03ac2ee5c63a8e6))
* **bau:** Nomination effects undefined infringement id ([4227b30](https://github.com/entrostat/road-protect-fleet/commit/4227b30473e45654f4d5a52643d1b2b4c1c6865e))
* **build:** Added ts-ignore for now on element state model ([610281f](https://github.com/entrostat/road-protect-fleet/commit/610281f793bc5334a6520746c0cea9c281a20b88))
* **build:** Adjusted the typing expected in the ngrx action for the upsert response ([afa508f](https://github.com/entrostat/road-protect-fleet/commit/afa508f2aeeaa5cfeb0b417c8f3a9441e11264e6))
* **build:** Export the rate limit interface ([21c119a](https://github.com/entrostat/road-protect-fleet/commit/21c119a61d7ef220090f8aa53de5d007f777320e))
* **build:** Force the type of the error ([ccee020](https://github.com/entrostat/road-protect-fleet/commit/ccee020407a2718214a92817d1f1ffda084605d6))
* **build:** Import the payments module into the infringement module ([ac53b72](https://github.com/entrostat/road-protect-fleet/commit/ac53b7213933b99639b5af68239b0f4191b2fd96))
* **build:** Incorrect typing on the missing infringement response ([c1a5c24](https://github.com/entrostat/road-protect-fleet/commit/c1a5c242b977e62056e16854931340396b740c6e))
* **build:** Npm ci frontend was failing so deleted package-lock.json and reinstalled node modules ([69aa370](https://github.com/entrostat/road-protect-fleet/commit/69aa37011f48a9ed75a4e139480ffecd2ca4b5bd))
* **build:** The payment amount and date should be optional ([b542e16](https://github.com/entrostat/road-protect-fleet/commit/b542e16d2ac7a9d64539d0ca0303eab5b7a37811))
* **build:** The payment amount must be a number ([4f0d315](https://github.com/entrostat/road-protect-fleet/commit/4f0d3155f802ab2e02dc538f21d75e97f5eff91a))
* **build:** The payment date and payment amount are optional on upsert ([60a3fb2](https://github.com/entrostat/road-protect-fleet/commit/60a3fb2511d1784af03e742840ff48213db170af))
* **build:** Update the apt sources before installing pdftk ([77d418f](https://github.com/entrostat/road-protect-fleet/commit/77d418f0ddbc862594193916a3f0769cefb42545))
* **cli:** Don't build when starting docker compose each time ([aeaedc0](https://github.com/entrostat/road-protect-fleet/commit/aeaedc07dd8648f4c5e9a99228576a6ce176fbd2))
* **code:** Removed console log ([8be8234](https://github.com/entrostat/road-protect-fleet/commit/8be8234843e4e9488ad01eb315d67f6c2efa0af0))
* **coding-practices:** Removed the console log in the upsert service ([7c908dd](https://github.com/entrostat/road-protect-fleet/commit/7c908dde793f8742262ac5a7beb34f1a548a9ed6))
* **contacts:** Added the default timezones for fixing contracts ([7dad160](https://github.com/entrostat/road-protect-fleet/commit/7dad1609e42612b617881f13dbd04b7232eb4d4a))
* **contract-dates:** I need to convert the 10pms to the next day ([687e50a](https://github.com/entrostat/road-protect-fleet/commit/687e50a8451b3adb807ba859a118ce6a7e989e8b))
* **contract-dates:** Remove timezone issues from contracts ([e52d1a9](https://github.com/entrostat/road-protect-fleet/commit/e52d1a94594aa30c2aba54b3f5fe6efc24b0365e))
* **contract-dates:** Set the dates on contracts using the new fix date function ([f738845](https://github.com/entrostat/road-protect-fleet/commit/f7388459c8d1d5faefc27e73531025679e179943))
* **contract-dates:** Set the shifted date equal to the shifted date ([eabb70c](https://github.com/entrostat/road-protect-fleet/commit/eabb70c8411a6500aac9eea8a903d3a8cacedd7f))
* **contracts:** Added the logic to rectify the contract dates ([12a9b29](https://github.com/entrostat/road-protect-fleet/commit/12a9b296cad5a18e9838e2add00ad6c4cae4f6cd))
* **contracts:** allow you to specify the end date on lease contract uploads ([738ffae](https://github.com/entrostat/road-protect-fleet/commit/738ffaed12221fb1a282cb0f9f5a6b3b90ba7fff))
* **contracts:** enabled the deletion of contracts via the API ([4b959f9](https://github.com/entrostat/road-protect-fleet/commit/4b959f9e82d08fd31d75ed1613856001ac8dc934))
* **contracts:** Fixed shortedning of lease contract dates ([604c04c](https://github.com/entrostat/road-protect-fleet/commit/604c04c07cd8c74a615e22bb26753f5d20fd9b23))
* **contracts:** removed the document requirement for uploading lease and ownership contracts manually ([2571a86](https://github.com/entrostat/road-protect-fleet/commit/2571a864bf88ca1258273e6d42e6ba15088c8802)), closes [#190](https://github.com/entrostat/road-protect-fleet/issues/190)
* **contractual-nominations:** Fix the nominations that have the raw redirection identifier as the owner BRN (set it to the user if it's in redirection process) ([cc39bd1](https://github.com/entrostat/road-protect-fleet/commit/cc39bd182ce567849e590718d8ff504b08838bd3))
* **core:** allow status transition from in-process to complete for redirections ([46a873d](https://github.com/entrostat/road-protect-fleet/commit/46a873d62d4596876be7a5963d91b4749327942b)), closes [#140](https://github.com/entrostat/road-protect-fleet/issues/140)
* **country:** Added Israel as the default country when setting the location dto ([c9b60ae](https://github.com/entrostat/road-protect-fleet/commit/c9b60ae2ab508c157b102647553435a134b78c2f))
* **crawler-schedulers:** Set crawler schedulers to run at 7am utc ([e1ddd24](https://github.com/entrostat/road-protect-fleet/commit/e1ddd24cf35772f28f9c9875e5b8dd30d67c87b0))
* **crawler-schedulers:** Set crawler schedulers to run at 7am utc ([e29e5f4](https://github.com/entrostat/road-protect-fleet/commit/e29e5f47514dfd3fa55fc1fd15797c9adc5e97a1))
* **crawlers:** Action date is optional for jerusalem crawler ([5c3acd2](https://github.com/entrostat/road-protect-fleet/commit/5c3acd2fbc451cd8a5e8d5e9f183722d4e2de81e))
* **crawlers:** Add shohar to provider list ([a03e09f](https://github.com/entrostat/road-protect-fleet/commit/a03e09f6a1ce154e5f8563d09a0ccc56757e8fca)), closes [#453](https://github.com/entrostat/road-protect-fleet/issues/453)
* **crawlers:** Added additional external codes for mileon and metropark ([66bbc8b](https://github.com/entrostat/road-protect-fleet/commit/66bbc8bac1fe69fcfc7a719c607981a50708c816))
* **crawlers:** Added changes to queries for required infringement to improve query and ensure correct required infringement is selected  ([dfe8df7](https://github.com/entrostat/road-protect-fleet/commit/dfe8df7fdaadcba06da1c488b041d60276b7f351)), closes [#409](https://github.com/entrostat/road-protect-fleet/issues/409)
* **crawlers:** Added exception throw if raw infringement process fails during verification ([52a2e0a](https://github.com/entrostat/road-protect-fleet/commit/52a2e0ac46f6235a1c131ee5792c52be18ceedbe)), closes [#379](https://github.com/entrostat/road-protect-fleet/issues/379)
* **crawlers:** Added nomination dtos to existing crawlers ([42d7ad2](https://github.com/entrostat/road-protect-fleet/commit/42d7ad269d23c87c7a4b72f6d7f35be3ea31990b)), closes [#310](https://github.com/entrostat/road-protect-fleet/issues/310)
* **crawlers:** Added shared request timeout for crawlers of 3 minutes by default ([d7e25da](https://github.com/entrostat/road-protect-fleet/commit/d7e25da0a2af31bed81d43bef06d6bbfb388c83d)), closes [#387](https://github.com/entrostat/road-protect-fleet/issues/387)
* **crawlers:** Escaped case number on police crawler and added loading to integration test submit button ([55cdfa5](https://github.com/entrostat/road-protect-fleet/commit/55cdfa55545271f8681696a16fa498dbafa6d59f)), closes [#375](https://github.com/entrostat/road-protect-fleet/issues/375)
* **crawlers:** Fixed creation of an external payment  Merge branch 'fix/RPF-391/crawler-not-updating-infringement' into develop ([29e4b5a](https://github.com/entrostat/road-protect-fleet/commit/29e4b5a4b059a38817561ec0add6fd99b890e790))
* **crawlers:** For telaviv, don't validate if fine status is paid ([7cde751](https://github.com/entrostat/road-protect-fleet/commit/7cde75118e3c9b468e8d27aa4d025b4708d1ebc2))
* **crawlers:** Improved validation on crawlers so that more verification cases pass ([9c88cb1](https://github.com/entrostat/road-protect-fleet/commit/9c88cb1f85593c2d4e0437f0bfaeb0a125f6f7f7)), closes [#457](https://github.com/entrostat/road-protect-fleet/issues/457)
* **crawlers:** Infringement brn cannot be null for police crawler scheduler ([4fff611](https://github.com/entrostat/road-protect-fleet/commit/4fff6117e52810694e02a5426277de494aa50fb5))
* **crawlers:** Latest payment date updated on police ([f6027f6](https://github.com/entrostat/road-protect-fleet/commit/f6027f64d7e344cfda8c510703822419830d2375))
* **crawlers:** Logging details for create sync dto error ([bce16b4](https://github.com/entrostat/road-protect-fleet/commit/bce16b4ec9b2c6b82543798e211ec91e1d8f97ea))
* **crawlers:** Minor bugfixes to crawler infringement processing ([6d022bf](https://github.com/entrostat/road-protect-fleet/commit/6d022bffca1b511247343240ba188053237dbf94)), closes [#363](https://github.com/entrostat/road-protect-fleet/issues/363)
* **crawlers:** Removed all validation on crawler dtos ([c13f197](https://github.com/entrostat/road-protect-fleet/commit/c13f1977f48e928d53a94aaab9c8d05e6defa03a)), closes [#470](https://github.com/entrostat/road-protect-fleet/issues/470)
* **crawlers:** Separated dto logic and actual request and processing to make it easier for testing ([b50182a](https://github.com/entrostat/road-protect-fleet/commit/b50182a84c5122f256f81c2d1371d788620625d3)), closes [#349](https://github.com/entrostat/road-protect-fleet/issues/349)
* **crawlers:** Turned on schedulers ([9e126f5](https://github.com/entrostat/road-protect-fleet/commit/9e126f57fd73328fc7044babdecd073201753af0)), closes [#574](https://github.com/entrostat/road-protect-fleet/issues/574)
* **crawlers:** Update crawlers and added crawler scheduler enabled option to env ([8685b9c](https://github.com/entrostat/road-protect-fleet/commit/8685b9cd6e93e6bb2c1d7317f3a146e6b5d25f33)), closes [#458](https://github.com/entrostat/road-protect-fleet/issues/458)
* **crawlers:** Updated crawler BRN used ([dc3eb7a](https://github.com/entrostat/road-protect-fleet/commit/dc3eb7a8ba5455c40340b5006184ebd932ad2095))
* **crawlers:** Updating validation on crawler dtos ([f2bf60e](https://github.com/entrostat/road-protect-fleet/commit/f2bf60e69a1b1d9f365eba040de6caaead7a4d2d)), closes [#465](https://github.com/entrostat/road-protect-fleet/issues/465)
* **date-decorator:** Added a decorator that fixes the date and kicks out any old dates from the system ([3922cb0](https://github.com/entrostat/road-protect-fleet/commit/3922cb0cb67cac022915967884a5a98cf3226be0))
* **date-fixer:** Return null if we don't match a date ([54ea80c](https://github.com/entrostat/road-protect-fleet/commit/54ea80c08f78dd811b560fd8807fada8107e3bf6))
* **date-output:** Added a safer converter for the moment dates in class transformer ([26e3a1c](https://github.com/entrostat/road-protect-fleet/commit/26e3a1ca12f96130539ca8b001c8691a5914fcd4))
* **dates:** Added more entries to the fix date function so that we deal with more cases ([7be7789](https://github.com/entrostat/road-protect-fleet/commit/7be778931fe6534a470968f624c80b6740af6aef)), closes [#279](https://github.com/entrostat/road-protect-fleet/issues/279)
* **dates:** added the ability to fix dates on the DTO upload when they match a format that we know is valid but not what we want. ([d7a50cb](https://github.com/entrostat/road-protect-fleet/commit/d7a50cbfeaf268c3abd8b1a0f154e5b1a83ae388)), closes [#164](https://github.com/entrostat/road-protect-fleet/issues/164)
* **dates:** adjusted the date transformer and removed the need for the date string in the dto for lease creation ([86343ae](https://github.com/entrostat/road-protect-fleet/commit/86343ae0e09b6b0647989216d8d2f290401d8a20))
* **dates:** Ensure that the date fixer is okay with the dates it returns otherwise it clears them ([da519bd](https://github.com/entrostat/road-protect-fleet/commit/da519bd9a91493af430d91c7f2bc11ddab81f46f))
* **datetime:** Added the patter yyyy/mm/dd hh:mm ([634a001](https://github.com/entrostat/road-protect-fleet/commit/634a001fc290198fa5466e9e623d0aedc3e0e415))
* **debug:** added a payment endpoint to view the unencrypted payment details ([714bd9b](https://github.com/entrostat/road-protect-fleet/commit/714bd9b0fd104a57c7d695a62cecfbd3a6c96b3f))
* **debug:** added an endpoint to debug payment details ([c2bee9c](https://github.com/entrostat/road-protect-fleet/commit/c2bee9c84a52b5a467eea5d39ffd8e3edad4f6ab))
* **debug:** changed the endpoint for viewing payments ([353c67a](https://github.com/entrostat/road-protect-fleet/commit/353c67a420797f7287099e05c6533d84c767c6c1))
* **dependencies:** Installed bull types and debug ([be5f23a](https://github.com/entrostat/road-protect-fleet/commit/be5f23aed7cd581f4bd74a7eab7e8770b7949460))
* **dependencies:** Updated the package-lock.json with the new installs ([6a9df89](https://github.com/entrostat/road-protect-fleet/commit/6a9df8909ffad8dbf96142a787d056ab0dd9fd51))
* **deploy:** Typo in missing infringment service ([b5d0280](https://github.com/entrostat/road-protect-fleet/commit/b5d0280d27c981064ef9f4f73bb6cd37a612d88d))
* **devops:** added libxss to the document generator dockerfile ([f64da58](https://github.com/entrostat/road-protect-fleet/commit/f64da58c12e5c285c086c36bbfefcac84a0840b0))
* **devops:** Always run migrations ([c76f647](https://github.com/entrostat/road-protect-fleet/commit/c76f647bf76ad0e9852df5c058be360cb5c97576))
* **devops:** Authenticate docker with gcloud in tests ([e3d0a38](https://github.com/entrostat/road-protect-fleet/commit/e3d0a38263d8e4b65c60f43d37b53b941e79da1c))
* **devops:** Backend build has to run ([0dae381](https://github.com/entrostat/road-protect-fleet/commit/0dae381474644cac123b1469f19233575207b2d4))
* **devops:** Changed formatting to rebuild docker image ([a1b48a9](https://github.com/entrostat/road-protect-fleet/commit/a1b48a99271930401e87eeb3ef84baf42ad72433))
* **devops:** Disable crawler scheduler on queue worker container ([c043632](https://github.com/entrostat/road-protect-fleet/commit/c04363291beeab356c70f63ab4d94e351105c3a0))
* **devops:** Don't build crawlers for now ([b52f040](https://github.com/entrostat/road-protect-fleet/commit/b52f040591eca68e8e9c2605f0a65d94762441c7))
* **devops:** Don't build frontend ([83c2054](https://github.com/entrostat/road-protect-fleet/commit/83c2054552a654d0f5b6576b50830ab3dfddad4d))
* **devops:** Increased the memory usage allocated for the backend ([2a16150](https://github.com/entrostat/road-protect-fleet/commit/2a16150512d12e54e99cb59898b3150e4ae12c97))
* **devops:** Increased the timeout on staging ([c96af51](https://github.com/entrostat/road-protect-fleet/commit/c96af51b3c4640ac5b1d84f2556a77ae2eab265f))
* **devops:** Login to Entro Hash to allow us to hash data and see if it needs to change ([bbae934](https://github.com/entrostat/road-protect-fleet/commit/bbae934ffbbe28793b43a3dbebbbfe437ac0f535))
* **devops:** Modified testing to use file changes instead of the pattern match in local tests ([4773d7f](https://github.com/entrostat/road-protect-fleet/commit/4773d7fee0c692b7bfdd5c1fb2c24cb9c7c9c552))
* **devops:** Moved migrations above frontend build ([df41782](https://github.com/entrostat/road-protect-fleet/commit/df417823d3fa14207ab57337abc070d34fd7c450))
* **devops:** Must build backend ([52d1c8a](https://github.com/entrostat/road-protect-fleet/commit/52d1c8ac7a46127fb4db8201162dbf10e88020d4))
* **devops:** Removed es5 browser support ([6589aa5](https://github.com/entrostat/road-protect-fleet/commit/6589aa5a2c5f58a171058c4b23f6644d14378104))
* **devops:** Removed request-ip ([07a7883](https://github.com/entrostat/road-protect-fleet/commit/07a78830e5b79f308d1bb77b9142a05ae24971fd))
* **devops:** Removed the reference to secrets in the entro-ci call ([a47c571](https://github.com/entrostat/road-protect-fleet/commit/a47c571cc8d83ed407db10fb3795f5d0e25fb3a7))
* **devops:** Run migrations after the backend build ([4f94ec7](https://github.com/entrostat/road-protect-fleet/commit/4f94ec7dadbf1b09a203ec07f85b8e6c65b98dd7))
* **devops:** Set queue enabled to false on backend pod ([7547a5c](https://github.com/entrostat/road-protect-fleet/commit/7547a5c4893074461ed540d3f44c9e3c5bf3106a))
* **devops:** Skip the tagging during the release (rather create a release branch with the tag) ([130fa40](https://github.com/entrostat/road-protect-fleet/commit/130fa401f63603b8d99070abb8226024113f6be8))
* **devops:** Switched the .secrets and .env file around so that the .secrets overwrite the .env in dev ([3d66097](https://github.com/entrostat/road-protect-fleet/commit/3d660971adbd157a070aee6aa9f5d8f0e28a2a5d))
* **devops:** Updated backend env to match Kerren's latest .env ([3ad65ba](https://github.com/entrostat/road-protect-fleet/commit/3ad65bac8f25fb8a7b67ca30fd959ac273539547))
* **devops:** Updated staging env ([3f0128c](https://github.com/entrostat/road-protect-fleet/commit/3f0128c58aed1c94c9de810ab5ea6d989fadd25e))
* **devops:** Upgraded the production frontend node version to 12 lts ([1daf231](https://github.com/entrostat/road-protect-fleet/commit/1daf2316b32b8502fa14c771edd0642407c2786f))
* **devops:** Use the Github action secrets for Entro Hash credentials ([a167680](https://github.com/entrostat/road-protect-fleet/commit/a167680566ddeee922914b9e71b1429e8ec37645))
* **digital-nominations:** Added an endpoint to count the nominations missing contracts ([00efb04](https://github.com/entrostat/road-protect-fleet/commit/00efb044b00e664c47de17c3a0bb27e011fe4a7d)), closes [#218](https://github.com/entrostat/road-protect-fleet/issues/218)
* **digital-nominations:** Added an endpoint to return the count of infringements that should be nominated ([b3c4d38](https://github.com/entrostat/road-protect-fleet/commit/b3c4d38c5d25a93818d305d33fdf3f5865a2104c)), closes [#217](https://github.com/entrostat/road-protect-fleet/issues/217)
* **digital-nominations:** Added the nomination type as Digital to the fixes to ensure that we don't "fix" municiple redirections ([535e5c8](https://github.com/entrostat/road-protect-fleet/commit/535e5c8257395ef37e9ec8ee8b19de3353049803))
* **digital-nominations:** allow nominations to take place even if there aren't account users ([cd4a2de](https://github.com/entrostat/road-protect-fleet/commit/cd4a2deb332dd6d7e3981100f665e1e32385314e)), closes [#199](https://github.com/entrostat/road-protect-fleet/issues/199)
* **digital-nominations:** Ignore any nominations that are in Redirection Process or Redirection Completed ([97538a6](https://github.com/entrostat/road-protect-fleet/commit/97538a6c213e7f6cba150bff98d26b500d258d6b)), closes [#221](https://github.com/entrostat/road-protect-fleet/issues/221)
* **digital-nominations:** modified the digital nomination process to prepare it for the nomination service ([1c0ff8f](https://github.com/entrostat/road-protect-fleet/commit/1c0ff8fbbd39dfe9e0213be1216676287d8f902f)), closes [#168](https://github.com/entrostat/road-protect-fleet/issues/168)
* **digital-nominations:** Moved the endpoints above the param check because it was triggering the param endpoint ([adedba1](https://github.com/entrostat/road-protect-fleet/commit/adedba1516f2bffaecfa1ea6145302261d83c993))
* **digital-nominations:** Pull the contract owner ([1bf44b5](https://github.com/entrostat/road-protect-fleet/commit/1bf44b58312dc664bb925c9d2402681fa0e55bbc))
* **digital-nominations:** Return the infringements that should be nominated for further investigation ([ea40e60](https://github.com/entrostat/road-protect-fleet/commit/ea40e6015d4aa21a4b662f946b069aebf1f72917))
* **digital-nominations:** Return the nominations that do not have contracts linked to them for debugging ([4238262](https://github.com/entrostat/road-protect-fleet/commit/42382621931efd0ae475c98d620e001f11deafa8)), closes [#219](https://github.com/entrostat/road-protect-fleet/issues/219)
* **digital-nominations:** Run the function every 5 minutes because it's not heavy on the database ([2a581fe](https://github.com/entrostat/road-protect-fleet/commit/2a581fef40b6c15db279efaa04a0fc9f22a6539c))
* **digital-redirections:** Don't repeat a digital redirection if it has already taken place ([2e243ab](https://github.com/entrostat/road-protect-fleet/commit/2e243abb72b450ed6fefe06554aab8e666d72769)), closes [#431](https://github.com/entrostat/road-protect-fleet/issues/431)
* **document-api:** Changed port to 8080 ([3a396f6](https://github.com/entrostat/road-protect-fleet/commit/3a396f61737dc4624f85a683589986d71b13b444))
* **document-api:** updated the document-api port to 8081 Merge branch 'fix/RPF-383/document-rendering-connection' into develop ([d4f6c45](https://github.com/entrostat/road-protect-fleet/commit/d4f6c450d42ced327a37a54a0b4aff18d92f3c63))
* **dtos:** Exposed all of the keys on infringement dtos ([5176e2f](https://github.com/entrostat/road-protect-fleet/commit/5176e2f4bec5a912ae0fd39984263110db9e9a64))
* **dupliate-infringements:** Group by the issuer so that the unique constraint is the same as the database ([b9c5eff](https://github.com/entrostat/road-protect-fleet/commit/b9c5effd0dfebd56249403794438001e4186ddda))
* **duplicate-infringements:** Added the ability to find duplicate infringements (don't perform any actions yet) ([42cf09c](https://github.com/entrostat/road-protect-fleet/commit/42cf09c27c911b07b3416fbc9af3bcc4a1ebd2bc))
* **duplicate-infringements:** Added the ability to run through all of the infringements and correct the notice numbers ([88a2f69](https://github.com/entrostat/road-protect-fleet/commit/88a2f69db62271ca543087333024eae4659b8fb2))
* **duplicate-infringements:** Added the actual infringement ids so that they can be deleted ([dfcdd9a](https://github.com/entrostat/road-protect-fleet/commit/dfcdd9ad48daf35897e54410b1db46e73e9c7d65))
* **duplicate-infringements:** Added the decorators that are used to remove special characters and leading zeros from infringements ([3d0f1a7](https://github.com/entrostat/road-protect-fleet/commit/3d0f1a714fccbc99903a3ef5db553c132288a54a))
* **duplicate-infringements:** Don't do multiple joins to reduce the load on the server ([774e56e](https://github.com/entrostat/road-protect-fleet/commit/774e56ec2a4e07a3d5768219f7d25a1237697f9c))
* **duplicate-infringements:** Run the script to save the new infringement numbers to the system ([569e4ca](https://github.com/entrostat/road-protect-fleet/commit/569e4ca2fdaa4412706fa4485bd25527403ab595))
* **duplicate-infringments:** Added the ability to create a csv from the duplicate infringements ([ec88f7c](https://github.com/entrostat/road-protect-fleet/commit/ec88f7c4e2f0c5b12a10d7a3f99889b6b1d844fc))
* **edit-infringement:** Locked inputs that users cannot update ([a086884](https://github.com/entrostat/road-protect-fleet/commit/a0868844ce4c97dbc80c42385cf4ab16c1b962ea))
* **emailer-process:** Removed the reason and reason code from the generated csv file ([729f44c](https://github.com/entrostat/road-protect-fleet/commit/729f44c0fc9527f180ba833c5d610fdb2e8baa96))
* **emails:** Updated the staging email config with "incorrect" details. This is to avoid staging ever not selecting the dev settings and actually sending mails ([b76cb41](https://github.com/entrostat/road-protect-fleet/commit/b76cb4100f7a76c5c131d0f4352be19cfcc5fec3))
* **error-handling:** Throw an error if the spreadsheet upload fails on a row ([e3a9623](https://github.com/entrostat/road-protect-fleet/commit/e3a9623d425fdabe2232f3641d34850c813cf077))
* **external-payments:** Added the condition that the amount due being 0 should also trigger us to look at the infringement and maybe add a payment there ([b7c14b5](https://github.com/entrostat/road-protect-fleet/commit/b7c14b5f49a236aa548e643971e2ce1ea9fd2493))
* **filter-tables:** Reset the current page to 1 when filtering the data shown on the table ([fb0ca1e](https://github.com/entrostat/road-protect-fleet/commit/fb0ca1e3dd831076cd452bd7808739a5e78bb4b7))
* **filters:** added the Issuer Provider to the infringement view ([b1cc60d](https://github.com/entrostat/road-protect-fleet/commit/b1cc60dfe8df255222c9eda0ebadcebfb23a4d84)), closes [#134](https://github.com/entrostat/road-protect-fleet/issues/134)
* **filters:** Autocomplete only returns distinct values, Fix population of dropdown filters on refresh and clean up which filters are displayed in simple visibility ([e077ad5](https://github.com/entrostat/road-protect-fleet/commit/e077ad5c21f8a2c7a73764367490319ab29a6b94))
* **fix-date:** Return null if empty string ([bd30e95](https://github.com/entrostat/road-protect-fleet/commit/bd30e95bf9b9f279e6611b1289a9ee60de7982fe))
* **fix-nominations:** For now I'm only going to modify infringements that didn't have a redirection type ([d611380](https://github.com/entrostat/road-protect-fleet/commit/d6113800d440f9a2178ce03fd2dc6e94a20d21f9))
* **fix-nominations:** Remove the type of nomination before relinking ([6599ff4](https://github.com/entrostat/road-protect-fleet/commit/6599ff42ae0a3f6f293b5f249063ecf3ff6dda8f))
* **formatting:** ran prettier formatting across all of the folders to ensure consistency ([65d85cf](https://github.com/entrostat/road-protect-fleet/commit/65d85cfaab217ad6a9fa69e60d29328437f0ce2c)), closes [#166](https://github.com/entrostat/road-protect-fleet/issues/166)
* **frontend-runtime:** Check that the infringement is not undefined before retrieving the payment ([f502f34](https://github.com/entrostat/road-protect-fleet/commit/f502f340da663b9892e978b35e549fcf18b34e87))
* **graphing:** Calculate months in selected date range in single function which ensures UTC for all visualisations ([82daa2d](https://github.com/entrostat/road-protect-fleet/commit/82daa2d431a02067fc407035e651961706b7d3e6))
* **graphing:** Disable tooltips to fix error occuring when hovering over the graphs ([fc46963](https://github.com/entrostat/road-protect-fleet/commit/fc469631b06e11e5d953fc4a92aea5c46a378a40))
* **graphing:** Fix the alignment of cells in the aggregated table when viewed in Hebrew ([a0b07ae](https://github.com/entrostat/road-protect-fleet/commit/a0b07ae6bfc487171ee2bcfccbd3ba3bcd573cc1))
* **graphing-by-issuer:** Ensure x-axis is in the correct order and months with no infringements are plotted as zero in the line graph ([c9cf88a](https://github.com/entrostat/road-protect-fleet/commit/c9cf88a8acc61abf1a817de0933c829bf3e26ffe))
* **graphing-by-issuer:** Fix graphing problem ([fe0c45c](https://github.com/entrostat/road-protect-fleet/commit/fe0c45c7303cd94d67d3f7e676b5d0ec4bf38608))
* **graphing-by-issuer:** Styling in Hebrew of date range as well as the search bar ([a2b4ef6](https://github.com/entrostat/road-protect-fleet/commit/a2b4ef6dad67de55439496bad9970ab1059bd5c2))
* **graphing-by-status:** Fix bug that was causing line graph to not populate due to calculated totals ([e6285c7](https://github.com/entrostat/road-protect-fleet/commit/e6285c716e3f3fa0eee2901fdbb1026cdddf93d4))
* **graphing-by-status:** Fix Hebrew x-axis ticks positioning to be under the graph ([410d02d](https://github.com/entrostat/road-protect-fleet/commit/410d02db6417d2a39c2cb64e22454d73b3bc783f))
* **infringement:** Add logs for outstanding status transition ([4034684](https://github.com/entrostat/road-protect-fleet/commit/40346842a624ce1c3e184f4abac85be8eeccd7ce)), closes [#455](https://github.com/entrostat/road-protect-fleet/issues/455)
* **infringement:** Converted the redirection identifier to string ([8a02d97](https://github.com/entrostat/road-protect-fleet/commit/8a02d976a60c098318940b89a470acbe94327a85))
* **infringement:** Modified the return type of the redirection identifier decorator ([d674104](https://github.com/entrostat/road-protect-fleet/commit/d674104a422ce4c230284ed88ade8f1cc9ed86f8))
* **infringement:** Omit the null values before overwriting the data on infringements ([dc1c4bf](https://github.com/entrostat/road-protect-fleet/commit/dc1c4bf59fec78d2760641ab3085fd8271ac0967))
* **infringement:** Updated penalty amount filter to rely on total amount ([d9cf14b](https://github.com/entrostat/road-protect-fleet/commit/d9cf14b68055d83d854fba03d155aec4f788e75f)), closes [#424](https://github.com/entrostat/road-protect-fleet/issues/424)
* **infringement-actions:** Uncomment batch infringement actions ([999beb8](https://github.com/entrostat/road-protect-fleet/commit/999beb84e9a5efca423c5a667fa1bc887af05f87))
* **infringement-creation:** Modified the standard nomination rules so that we pull the latest nomination if it is not defined on the infringement (otherwise we get null errors) ([f5dfadf](https://github.com/entrostat/road-protect-fleet/commit/f5dfadf2f2143196267781d617e8cd544094e9c4))
* **infringement-graphing:** Fix bug that added empty 'Other' series after data manipulation when graphing by issuer and status ([400cf9e](https://github.com/entrostat/road-protect-fleet/commit/400cf9e2848450d569c6faa40d8dcb4757f50d92))
* **infringement-log:** Don't default the data to null ([f0f231a](https://github.com/entrostat/road-protect-fleet/commit/f0f231a46185825c0fdad0cc18bc5a9f285aa81b))
* **infringement-logger:** Added the ability to log infringement errors outside of a transaction so that it saves even if the data doesn't ([1dd0938](https://github.com/entrostat/road-protect-fleet/commit/1dd0938a93ab6df61c2576ce8f668b4084ae158f)), closes [#292](https://github.com/entrostat/road-protect-fleet/issues/292)
* **infringement-relink:** Do not fail relinking of other infringements if one fails ([9eab157](https://github.com/entrostat/road-protect-fleet/commit/9eab157db05f6803b9f127ed84feb7341a7c7f1c))
* **infringement-report:** Only report on infringements owned by the sender ([e883fc2](https://github.com/entrostat/road-protect-fleet/commit/e883fc2ab0f2ddd7bf01c30059fd26dc9e0645c5))
* **infringement-report-attachments:** Changed infringement report email attachment from xlsx spreadsheet to a pdf and a csv because of styling issues ([bbc7aea](https://github.com/entrostat/road-protect-fleet/commit/bbc7aeab2903cd7648b2771dd7008add634bdb54))
* **infringement-report-test:** Setup the database for the infringement report tests within the transaction ([64dee56](https://github.com/entrostat/road-protect-fleet/commit/64dee563ed1d417a36e172a7878c4a6c2e1ac3c2))
* **infringement-reporting:** Fix the reporting of infringements that do not have a location related with them and prevent for such issues to break the infringement reporting process in the future ([a1114e9](https://github.com/entrostat/road-protect-fleet/commit/a1114e9d716dc57a4a4b2b857b4795f4e85b5268))
* **infringement-rules:** Added a service that adjusts values on the infringements depending on whether certain criteria are met ([71cbb07](https://github.com/entrostat/road-protect-fleet/commit/71cbb07023e9dcab50a8d99e00ecf30fae31daaa))
* **infringement-statuses:** Set the status from outstanding to due if the total amount is equal to the original amount ([c64e230](https://github.com/entrostat/road-protect-fleet/commit/c64e23070a10dc0b0c8a5195c8d18784edd9e180))
* **infringement-table:** Sort the table by descending date of offence by default, show reason in tool-tip over location field ([1bd3446](https://github.com/entrostat/road-protect-fleet/commit/1bd344688ab7ad76af2b6870bf0376cd627986b6))
* **infringement-update:** New brn must be true if infringement.brn is currently null and must not cause an error ([d4e43e8](https://github.com/entrostat/road-protect-fleet/commit/d4e43e8cd9375c1186bbe088e1dab1c13ceac0c4)), closes [#394](https://github.com/entrostat/road-protect-fleet/issues/394)
* **infringement-upload:** Added the ability to skip redirections and move to the summary page. The buttons draw attention to skip redirections because running redirections is a dangerous operation. ([4d872a1](https://github.com/entrostat/road-protect-fleet/commit/4d872a1d0919976ab264c7be785eb663fcf84666)), closes [#245](https://github.com/entrostat/road-protect-fleet/issues/245)
* **infringement-upload:** Send progress before starting ([08af708](https://github.com/entrostat/road-protect-fleet/commit/08af7086530203d401693864a5a0057ef42e56aa))
* **infringement-upsert:** Allow for the payment reference to be anything (string or number) ([ddf007e](https://github.com/entrostat/road-protect-fleet/commit/ddf007ebc8b29b258cef787ca2bc32716766c94c))
* **infringement-upsert:** Force the issuer to be the same at the start of the process and during the upload to avoid business issues ([975ddb8](https://github.com/entrostat/road-protect-fleet/commit/975ddb823b39e6494aa1b44c616f92b4f017c83e)), closes [#244](https://github.com/entrostat/road-protect-fleet/issues/244)
* **infringement-view:** Fix errors occuring when infringement has missing fields ([c00b949](https://github.com/entrostat/road-protect-fleet/commit/c00b9490cbb62c621d28a5938a5aeb8f3286eefe))
* **infringement-view:** fixed account BRN columns to show BRNs ([a66392a](https://github.com/entrostat/road-protect-fleet/commit/a66392afcfd5aaa6b9c120bc6f6148939f70f079))
* **infringements:** Added minor delays to ensure that we don't fully block the event loop ([9b6570f](https://github.com/entrostat/road-protect-fleet/commit/9b6570f0d03284e3413970bc8bb5058421438064))
* **infringements:** Added the municiple redirection logic back ([e76fd91](https://github.com/entrostat/road-protect-fleet/commit/e76fd91bc038a9efc579f7f53a25c59abac9b87a))
* **infringements:** Check the iv value and if it's undefined then return null ([4ec49f9](https://github.com/entrostat/road-protect-fleet/commit/4ec49f9fd4be0147d7b8233045fc5b318afc1d67))
* **infringements:** Convert the reason to a string ([b0635fe](https://github.com/entrostat/road-protect-fleet/commit/b0635fef0ac1472cc7e0efcacea1e50ec1e03c75))
* **infringements:** Extract the year using regex and compare to a minium year before using moment ([9deadc5](https://github.com/entrostat/road-protect-fleet/commit/9deadc5f40eac4f9d7941e39b3e17b26e78aa276))
* **infringements:** Look for the total amount being the amount due ([161eae7](https://github.com/entrostat/road-protect-fleet/commit/161eae7ba714248ccf7385691d87cbc468e9d466))
* **infringements:** Modified the payment decryption function to not decrypt undefined data ([c06e82e](https://github.com/entrostat/road-protect-fleet/commit/c06e82e61b5cbac8f7013829c473f8a80d4ba311))
* **infringements:** Needed to get the infringements that had the original amount of zero ([b7bd367](https://github.com/entrostat/road-protect-fleet/commit/b7bd367648ea3a7d15ff329a1e39c07b5a8ee151))
* **infringements:** Remove the starting 'C' and last '0' on infringements ([2be362f](https://github.com/entrostat/road-protect-fleet/commit/2be362f70f27944383ec8a3405ff58af2772816e)), closes [#320](https://github.com/entrostat/road-protect-fleet/issues/320)
* **infringements:** Removed delay on each infringement ([be5ca5a](https://github.com/entrostat/road-protect-fleet/commit/be5ca5afcddb1354c48f7be9d8a68ea830f9827a))
* **infringements:** Removed the standard string decorator from dates ([855f99c](https://github.com/entrostat/road-protect-fleet/commit/855f99c6294eaa8ffbbf0f02130b567c513b962e))
* **infringements:** Set the initial infringement on the update ([a92754c](https://github.com/entrostat/road-protect-fleet/commit/a92754c518494843985c064f1935a6447d1c3a65))
* **infringements:** Set the original amount to amount due if it's set to zero ([5466f17](https://github.com/entrostat/road-protect-fleet/commit/5466f17235b9f7a5ac35587e1962757ecd50cc47))
* **integration-testing:** Fix to display null response and auth ([f7cedc3](https://github.com/entrostat/road-protect-fleet/commit/f7cedc356da405baaf7b9cd57ac6664e7b652b35))
* **integration-testing:** Fixed system header key ([16b9c2d](https://github.com/entrostat/road-protect-fleet/commit/16b9c2d73d8d2944f07b18b56d1d2efa1290f408))
* **integration-testing:** Log error message and not whole error ([eb883d2](https://github.com/entrostat/road-protect-fleet/commit/eb883d21b28ee2eaa47f37e3f9fa434721f0abd1))
* **integration-testing:** Log request, response, and error for integration tests ([3ae36e6](https://github.com/entrostat/road-protect-fleet/commit/3ae36e62b3c9c826d7c38ffb7690da23647ed737)), closes [#202](https://github.com/entrostat/road-protect-fleet/issues/202)
* **integration-testing:** Send typed dto (instead of plain object) to integration so that transforms apply ([1f339d3](https://github.com/entrostat/road-protect-fleet/commit/1f339d3cf7fbfb5e37275f2eed9eca7292906d99)), closes [#265](https://github.com/entrostat/road-protect-fleet/issues/265)
* **integration-tests:** Fixed key ([3d7598a](https://github.com/entrostat/road-protect-fleet/commit/3d7598af13578e43a90a67de20efc38de93c37e7))
* **integrations:** Added additional filter options for source on integration request log ([0255474](https://github.com/entrostat/road-protect-fleet/commit/02554746a7341617d48dacf6ca63c7677e10be8b)), closes [#579](https://github.com/entrostat/road-protect-fleet/issues/579)
* **integrations:** added the ability to login to the old fleets system via the api ([de1bb01](https://github.com/entrostat/road-protect-fleet/commit/de1bb01201d0e2155a88280802295abb0688c9cd))
* **integrations:** Added xml formatting for string request/responses in the integration request log ([69ae925](https://github.com/entrostat/road-protect-fleet/commit/69ae925d588fe22f2d6271d1370d98862cb61b86)), closes [#263](https://github.com/entrostat/road-protect-fleet/issues/263)
* **integrations:** Corrected timestamp display of created at date in integration request log ([1aa2bc6](https://github.com/entrostat/road-protect-fleet/commit/1aa2bc6ebcf40950d8f24add8b3b80409ee2b6fe))
* **integrations:** Don't save document to the integration logger ([4ad1b86](https://github.com/entrostat/road-protect-fleet/commit/4ad1b863e8a42e46b89ae1106b8495daf6a86571))
* **integrations:** modified the ATG payment integration to use the postal address if the physical is not specified ([1655da4](https://github.com/entrostat/road-protect-fleet/commit/1655da428d934fd9a10b10ae0c0226b9ba469600)), closes [#163](https://github.com/entrostat/road-protect-fleet/issues/163)
* **integrations:** replaced city with issuer name on ATG mapping integration ([466af49](https://github.com/entrostat/road-protect-fleet/commit/466af4924279efb7be99a0183c278f3d1239d45c)), closes [#139](https://github.com/entrostat/road-protect-fleet/issues/139)
* **invalid-redirections:** Added the service and controller to find invalid redirections ([5b99392](https://github.com/entrostat/road-protect-fleet/commit/5b993929779d0e489d55631fa570f540975c6d86))
* **invalid-redirections-controller:** Fixed the endpoint to call to check the invalid redirections ([2cd4890](https://github.com/entrostat/road-protect-fleet/commit/2cd4890835ea70100624a68cf60ccf4f35959575))
* **issuers:** Fixed rashut code on one of the metropark issuers ([edd1424](https://github.com/entrostat/road-protect-fleet/commit/edd1424be8fe7ffc7c400f238aa959c0ab939ad1)), closes [#433](https://github.com/entrostat/road-protect-fleet/issues/433)
* **latest-payment-date:** If the date is empty then we don't override it ([5a50cac](https://github.com/entrostat/road-protect-fleet/commit/5a50cac3dc78ee1fadb3cc89b38ab9ffc439760f))
* **lease-contract:** Fixed the labels on the lease contract upload screen ([e08461f](https://github.com/entrostat/road-protect-fleet/commit/e08461f9bbb50943fb73cc4f8a695414a65dc925))
* **line-graphs:** Months to graph calculation in line graphs ([194e524](https://github.com/entrostat/road-protect-fleet/commit/194e52430b9c20a09bf53d5709123f6fe6db5835))
* **locale:** Changed nomination status translations ([ef3fd48](https://github.com/entrostat/road-protect-fleet/commit/ef3fd48941aa41227cd01cf550eac4c9b7af92da))
* **locale:** Changed the translation of 'new' ([eaf2410](https://github.com/entrostat/road-protect-fleet/commit/eaf24104e3430b55151eb9e793e240a7def20cee))
* **locale:** renamed municiple nominations to municiple redirections ([8edea22](https://github.com/entrostat/road-protect-fleet/commit/8edea22ace22b58d4097a6a8b974386dd75bacb5)), closes [#151](https://github.com/entrostat/road-protect-fleet/issues/151)
* **logger:** Added the listener for errors on the logger itself ([51eb518](https://github.com/entrostat/road-protect-fleet/commit/51eb518dabc79dbeecf69641393c9ebd9dffcbde))
* **logger:** Catch errors with Winston fails and at that point just console log directly ([b62450f](https://github.com/entrostat/road-protect-fleet/commit/b62450f4346d465e78b2bcce059a5400c6128185))
* **logger:** Log detail[key] instead of result[key] (which is undefined) ([1f27f53](https://github.com/entrostat/road-protect-fleet/commit/1f27f534f0c76336fc1da52c0ff8f9a25e8ea4cb))
* **logger:** output the message by itself if it has one in the exception ([962dec1](https://github.com/entrostat/road-protect-fleet/commit/962dec15dcc5ffdbd035f2c662a8ac0c4316b1d1))
* **logger:** Remove circular dependency in the logger ([abe6e85](https://github.com/entrostat/road-protect-fleet/commit/abe6e85c7ef9488ce20f03bdfdf6701a87c89664))
* **logger:** Return the original value for the logger if something goes wrong ([12cab33](https://github.com/entrostat/road-protect-fleet/commit/12cab33768ebf5f52d1ec5dca18b09194cabd1ea))
* **logger:** Set the maximum depth in the logger ([67ecf5f](https://github.com/entrostat/road-protect-fleet/commit/67ecf5f2061f188235d708b5b3932a9b9cb4f659))
* **logger:** Use Winston as the error logger anyway ([65ba0d5](https://github.com/entrostat/road-protect-fleet/commit/65ba0d555813a843979cfc4ed9fc572f8ed77842))
* **logging:** Added a file that handles exceptions in Winston ([c6e5044](https://github.com/entrostat/road-protect-fleet/commit/c6e5044fea68d931569550c5e84eaee031ffe5a4))
* **logging:** Added a listener to catch all unhandled promises ([93c1c8f](https://github.com/entrostat/road-protect-fleet/commit/93c1c8f2480186e3a81fc6ec24c7a10195043156))
* **logging:** added a logger for exceptions that aren't http ([87f4f79](https://github.com/entrostat/road-protect-fleet/commit/87f4f79d8cd1c803557f4f0bfa1371aacf66b70c))
* **logging:** Added an on error listener to the transports ([ad554b6](https://github.com/entrostat/road-protect-fleet/commit/ad554b61ed5ca53a2c316670c03412ed976f620d))
* **logging:** Added logs to the old fleets sync to ensure that it is running correctly ([54d47e5](https://github.com/entrostat/road-protect-fleet/commit/54d47e590ce4faf4e202986a747f4330ebbc04bd))
* **logging:** Added the create and nominate dto to the logs when there is an error ([c000f6e](https://github.com/entrostat/road-protect-fleet/commit/c000f6ea9f1b13e7a6a581f19fe2ddc442fe2b8e))
* **logging:** changed the error message to be more understandable ([3e0c8f7](https://github.com/entrostat/road-protect-fleet/commit/3e0c8f726b95bdd121edcc68657576a104f1efe7))
* **logging:** Don't log the full error ([8e05c52](https://github.com/entrostat/road-protect-fleet/commit/8e05c52393ae01225d4566a4ee0b849b52deeeb3))
* **logging:** Handle logging exceptions through logger, we can't catch exceptions because it's not returning a promise (and we don't await that) ([8f5926a](https://github.com/entrostat/road-protect-fleet/commit/8f5926a507f4ca8499f76e28b1557d6e5a18bc64))
* **logging:** Never log an exception object ([0afbb7e](https://github.com/entrostat/road-protect-fleet/commit/0afbb7e080417ec38185aee8630bffa794e183c1))
* **logging:** Only add a log on the infringement if the brn has changed on the infringement (ie. even if the dto has a brn, if it's the same as the infringement then it won't log it) ([ae6476a](https://github.com/entrostat/road-protect-fleet/commit/ae6476a4ef4862d25aad906e9d6858324b1524f9))
* **logging:** Only log errors to console ([f35173c](https://github.com/entrostat/road-protect-fleet/commit/f35173cd52160f9c66a3a8abf71b3f9a38e7f3e4))
* **logging:** Rather make the logger write to a file ([2a73095](https://github.com/entrostat/road-protect-fleet/commit/2a73095597bb7767df7212cf69e89012c88d9812))
* **logging:** Remove exceptions from logs ([9cd4498](https://github.com/entrostat/road-protect-fleet/commit/9cd4498ca3d92c967ec0b404d6310a93e43d562b))
* **logging:** Removed the log of the extraction of redirection address because it's clogging the logs but not necessary ([93d45fc](https://github.com/entrostat/road-protect-fleet/commit/93d45fc63d3c4085093ba52fa1be82fc982cacf5))
* **logging:** Trying to add a rejection handler ([8f867d4](https://github.com/entrostat/road-protect-fleet/commit/8f867d44cfbdb15fc3287ad3c1fc70fb9ddd6e82))
* **logging:** Updated the grpc version to try to resolve the unhandled rejections ([6dfe01a](https://github.com/entrostat/road-protect-fleet/commit/6dfe01a65b0274eaf1de90ef7923d651c14506a9))
* **login:** Make email address case insensitive for log in ([afda1d9](https://github.com/entrostat/road-protect-fleet/commit/afda1d9809e06289af57709d477fdb390df5de81))
* **logs:** Send more logs to the frontend ([4cdb598](https://github.com/entrostat/road-protect-fleet/commit/4cdb598ddc73de5e124d572403c1c5cdf8bb383a))
* **mailer:** Added the decimals to the amounts ([e15c29e](https://github.com/entrostat/road-protect-fleet/commit/e15c29ed62cabf727c5779647266a25cd67b62be))
* **mailer-process:** Added Ari back to the BCC mail ([8d58f8b](https://github.com/entrostat/road-protect-fleet/commit/8d58f8b2e92d8bf5a2ba1394d81dd324a67161a0))
* **mailer-process:** Filter any infringements that were not verified recently ([733cb8e](https://github.com/entrostat/road-protect-fleet/commit/733cb8e62946f0d994c93eb520eb55128deb9d42))
* **mailer-process:** Modified the mailer process total calculations to use the original query values ([b6cad6c](https://github.com/entrostat/road-protect-fleet/commit/b6cad6c7d01f270cca6b51495d6f67366caecd8c)), closes [#456](https://github.com/entrostat/road-protect-fleet/issues/456)
* **mailer-process:** Removed Ari from the mailer process for now ([a3266be](https://github.com/entrostat/road-protect-fleet/commit/a3266bef19eaf87a1bb103a35ff6684ea534f805))
* **mailer-process:** Set the total amount to have 2 decimal places ([d67bb60](https://github.com/entrostat/road-protect-fleet/commit/d67bb6019cc7d82563cb8c998669f4bb565f821c))
* **mailers:** Updated the Hebrew in the mailer ([649913c](https://github.com/entrostat/road-protect-fleet/commit/649913c9112615cf11af39ed0549055970bfbee7))
* **manual-redirection-template:** Fix address population of the address and date formatting on the redirection template ([e2e55cc](https://github.com/entrostat/road-protect-fleet/commit/e2e55cc25b0b2ba359cab7a2717a3e23e89d760f))
* **manual-redirections:** Added the done button to the manual redirections summary page and fixed the missingInfringements array error where it could not read that array from a null object ([73bf583](https://github.com/entrostat/road-protect-fleet/commit/73bf583b2e78f466eea1759620043f2e318c5b09)), closes [#276](https://github.com/entrostat/road-protect-fleet/issues/276)
* **manual-redirections:** Don't allow manual redirections to the same account as the brn on the current infringement ([8693f0b](https://github.com/entrostat/road-protect-fleet/commit/8693f0b2f62f6894ce2c5d203c1f1fa351b2a731))
* **manual-redirections:** Force the identifier to be a number, strings should not be allowed ([9674b29](https://github.com/entrostat/road-protect-fleet/commit/9674b294c58ec21ea7cb73066603f911bdb85daa)), closes [#242](https://github.com/entrostat/road-protect-fleet/issues/242)
* **manual-redirections:** Only change the BRN on the infringement when the redirection goes through ([330a453](https://github.com/entrostat/road-protect-fleet/commit/330a453a3b1a0037f4cba196e90bfb30c10b1a63))
* **manual-redirections:** Set the BRN of the infringement to the BRN that it's being manually redirected to ([ac4147c](https://github.com/entrostat/road-protect-fleet/commit/ac4147c507963bf0b053ef9285ea4e3595a3e4de))
* **migration:** Remove integration request log change from redirection type enum ([04c81c1](https://github.com/entrostat/road-protect-fleet/commit/04c81c18d8520ede51672eead57f400820e50192))
* **migrations:** Added the migration to update the redirection type enumerations that exist ([021a4da](https://github.com/entrostat/road-protect-fleet/commit/021a4dac797c0b7a334e1b5d39be23fe3e7a0ec6))
* **migrations:** Archived notice number and vehicle unique constraint and will run manually when low system usage ([2e30f16](https://github.com/entrostat/road-protect-fleet/commit/2e30f160063caaf26442f15b386fb7d1461a449c))
* **migrations:** Archived the migrations that have run ([5c263f5](https://github.com/entrostat/road-protect-fleet/commit/5c263f58ccb3864016a0e94bf36cd908ff98f539))
* **missing-nominations:** Cater for null accounts when looking at the redirection identifier ([1e3414a](https://github.com/entrostat/road-protect-fleet/commit/1e3414ac8aaa9b63317ad8b87fb20feb537fd365))
* **nomination:** The nomination does not always exist on an infringement so the type could be undefined when looking for the power of attorney ([9c4cedd](https://github.com/entrostat/road-protect-fleet/commit/9c4ceddb7e055075824ba506522fcff4ae64f4b5))
* **nominations:** Added a service that allows us to run through the history and extract the first date that we received that an infringement was paid ([695207b](https://github.com/entrostat/road-protect-fleet/commit/695207bb681d39d0df0d5c7415772276f7226f48))
* **nominations:** Added the ability to try to digitally nominate the infringements that don't have a contract linked ([dab9253](https://github.com/entrostat/road-protect-fleet/commit/dab9253ddf21b366f9a0bcb43dffcfbc1a920942))
* **nominations:** Added the functionality to find nominations that are missing contracts ([3a8ea96](https://github.com/entrostat/road-protect-fleet/commit/3a8ea967a731c4d61497cfef6056e88afea9adb3))
* **nominations:** Always create a nomination for an infringement ([27e6d5c](https://github.com/entrostat/road-protect-fleet/commit/27e6d5cd7085a0cda42491968baa96a57d5b61d5))
* **nominations:** Always persist the final nomination even if there wasn't a change ([2998880](https://github.com/entrostat/road-protect-fleet/commit/2998880aaf412fe34eaeb43de7e532d2b404a2b5))
* **nominations:** Delay the errors ([444b2fa](https://github.com/entrostat/road-protect-fleet/commit/444b2fa8ce76460e05f59782d6226c482d92a79e))
* **nominations:** Don't ignore nominations that have a redirection identifier but no redirection date or letter send date ([7f1ded3](https://github.com/entrostat/road-protect-fleet/commit/7f1ded371a66cae183da650b4869e51ecbf6e002))
* **nominations:** Don't use upsert to create the new nomination ([d6874b0](https://github.com/entrostat/road-protect-fleet/commit/d6874b0566f4b2dae42453cacf95ebafb6074c40))
* **nominations:** Expose the nominations detail keys ([2f0bd19](https://github.com/entrostat/road-protect-fleet/commit/2f0bd190bd714e466e14b097e12db60b35186a99))
* **nominations:** Forgot to use andWhere when looking for empty accounts ([1a46dcb](https://github.com/entrostat/road-protect-fleet/commit/1a46dcbde174f5433471f2124f70061a238131f8))
* **nominations:** Only pull infringements that have contracts ([79f8342](https://github.com/entrostat/road-protect-fleet/commit/79f8342a420ddea9516efbabbce122656fbda29c))
* **nominations:** Only set the initial nomination when it's not null ([15c344d](https://github.com/entrostat/road-protect-fleet/commit/15c344dcbe9a22bed671b60e340b6c08d4b404a0))
* **nominations:** Remove redirection identifiers of 0 ([72b531d](https://github.com/entrostat/road-protect-fleet/commit/72b531d2e034a265a5b2abb607014d6569b6ca1d))
* **nominations:** Removed the autocreate ([381ae34](https://github.com/entrostat/road-protect-fleet/commit/381ae3419afbbc9a351fe10c75ce15243db405ce))
* **nominations:** Removed the limit ([4b6aad0](https://github.com/entrostat/road-protect-fleet/commit/4b6aad064057f7b1d4f2f1c7fa5bb4b5f933666b))
* **nominations:** Removed the manual redirection ([76a7b2d](https://github.com/entrostat/road-protect-fleet/commit/76a7b2d2d291ee763f2d6ee62493a8685be31f7d))
* **nominations:** Renamed the fix redirections service because it was vague before ([5194a0b](https://github.com/entrostat/road-protect-fleet/commit/5194a0bd136b48ef006d461fa5d600aa5d27b49c))
* **nominations:** Return from the manual nominations if they fail ([dde8ddf](https://github.com/entrostat/road-protect-fleet/commit/dde8ddfe3e852c20209439b6954fe29f5bbd17bf))
* **nominations:** Save the nomination before relinking ([7e07645](https://github.com/entrostat/road-protect-fleet/commit/7e076452dcfa02e080a877f7f461b2d50a8b2354))
* **nominations:** Set automated nominations do Digital not Municipal ([15088f0](https://github.com/entrostat/road-protect-fleet/commit/15088f02c7fafba144b47396fb9ccf3180a67a7c)), closes [#266](https://github.com/entrostat/road-protect-fleet/issues/266)
* **nominations:** Set the infringement id after the nomination ([cc95b6c](https://github.com/entrostat/road-protect-fleet/commit/cc95b6c7c16b8f4f72469a561b7b917c0923dc1a))
* **nominations:** Set the infringement id in the status updater ([135160a](https://github.com/entrostat/road-protect-fleet/commit/135160a98bf9d6fd757c5dea5ab70aec472950b5))
* **nominations:** Set the infringement on a nomination if it does not already exist ([4bc8a7a](https://github.com/entrostat/road-protect-fleet/commit/4bc8a7af9bebd5591a36bc2258d945592fa81b87))
* **nominations:** Set the initial nomination so that we can trigger a nomination update ([1d54e4b](https://github.com/entrostat/road-protect-fleet/commit/1d54e4b99428cab16653b861a8240d73e9c27816))
* **notifications:** added checks for infringement existence for router Merge branch 'fix/RPF-385/notification-button' into develop ([fd8d02a](https://github.com/entrostat/road-protect-fleet/commit/fd8d02a97692a1285aac2c2490e7a5c6bb858090))
* **ocr:** Allow users to override the OCR on create contract upload  Merge branch 'fix/RPF-399/override-create-contract-ocr' into develop ([b4734bb](https://github.com/entrostat/road-protect-fleet/commit/b4734bb18fa018d8fb1c641d4e37028504db3994))
* **old-fleets:** Check for null in the perform key ([3799618](https://github.com/entrostat/road-protect-fleet/commit/3799618170e3ac9b6ed76479eaa8b9686c6340df))
* **old-fleets:** don't check for dto validity in the test ([1d8eb87](https://github.com/entrostat/road-protect-fleet/commit/1d8eb8701ec489d282f8457cb807a35805b2f2a9))
* **old-fleets:** Enabled the validity check on the old fleets sync ([b4df432](https://github.com/entrostat/road-protect-fleet/commit/b4df4325ae1c3ed29020c15863e8cc0893927ec9))
* **old-fleets:** extract the issuer for the create and update functionality ([a452665](https://github.com/entrostat/road-protect-fleet/commit/a452665a77829fe9bfcc926da4d7b9fbfa1629e6))
* **old-fleets:** ignore the issuer code of 0 if it comes in from Old Fleets that way ([b98d4d0](https://github.com/entrostat/road-protect-fleet/commit/b98d4d05c4b52673efbeada672b076fb3ed964ad))
* **old-fleets:** pull the infringement amount from the amount paid if the status is paid ([b492081](https://github.com/entrostat/road-protect-fleet/commit/b492081903fa364ada8b87b78ab6d526246c224e))
* **old-fleets:** The query for finding infringements that had not been successfully performed was not correct ([0a232af](https://github.com/entrostat/road-protect-fleet/commit/0a232af00da7c8a4274d999d6827a25b42fc167c))
* **old-fleets:** Use the fine debit amount (which may include penalties) if the fine amount is not defined ([10449e2](https://github.com/entrostat/road-protect-fleet/commit/10449e2af5dd09782714004eba0d88f45aa29c04))
* **old-fleets:** Using the incorrect jsonb query for raw infringements ([11451b0](https://github.com/entrostat/road-protect-fleet/commit/11451b081b0caf2450129f3fedb98f15090140dd))
* **old-fleets-integration:** Added the ability to filter by notice number so that we can debug errors on the sync more easily. ([f66abaa](https://github.com/entrostat/road-protect-fleet/commit/f66abaa040ebf25fb04653c3096a76a7441c591d))
* **outstanding-balance:** Set infringements with an original amount of zero to the amount due ([0cebff0](https://github.com/entrostat/road-protect-fleet/commit/0cebff09920c7be6ac00f756a0342f46be9fc06c))
* **ownership-contracts:** Removed the isDateString decorator since we now have the fixDate decorator ([841e124](https://github.com/entrostat/road-protect-fleet/commit/841e124ee12ebdc186602b4ad8ad096faf82d4bc))
* **payment:** look at the raw response for the success code ([dd4acef](https://github.com/entrostat/road-protect-fleet/commit/dd4acef6811d1bef5221171ee6799658d2d8170f))
* **payment:** looking at preparsed values does not have the characters we expect so I've changed the search ([047e3d9](https://github.com/entrostat/road-protect-fleet/commit/047e3d99b9029eb41c6047f02685b377d15bb4e4))
* **payment:** removed the response check ([03ce40a](https://github.com/entrostat/road-protect-fleet/commit/03ce40a6c37724c06f0f9b82fa9e603d53089857))
* **payment:** removed the uneeded parsing ([c2c5e22](https://github.com/entrostat/road-protect-fleet/commit/c2c5e22dde434b064c70e63ff4db15ec489cd702))
* **payments:** added the card expiry date to payments ([5a2af6c](https://github.com/entrostat/road-protect-fleet/commit/5a2af6c4e728b96d332be461c4e5d1208f3d5d24))
* **payments:** Don't show payments for now ([c88a5d1](https://github.com/entrostat/road-protect-fleet/commit/c88a5d1d36a3b77ef560e05f04d2e31b0b0db9a3))
* **payments:** Make the payments display the payment date not the created date ([473624c](https://github.com/entrostat/road-protect-fleet/commit/473624c0def0f027d98b62397ac42ada7487b8a6)), closes [#411](https://github.com/entrostat/road-protect-fleet/issues/411)
* **payments:** Removed the / from the url in the environment for prod (we were getting //) ([9e771db](https://github.com/entrostat/road-protect-fleet/commit/9e771db37bf4b165be10b27b7b0f657e458b1abf))
* **payments:** the action code was not being parsed correctly, I now just look for the string ([1685efb](https://github.com/entrostat/road-protect-fleet/commit/1685efb0aaf104e857edc63b673dc7822334ffdc))
* **penalties:** Prevent penalties from being negative ([4a0db98](https://github.com/entrostat/road-protect-fleet/commit/4a0db989b040d4e1893a7a93afa8360aa806fc1d))
* **penalties:** Updated the definition of outstanding infrignements ([b768e77](https://github.com/entrostat/road-protect-fleet/commit/b768e7780d2dc527edcc9e33717e8c1056cd2910))
* **performance:** After removing the logger the speed has increased 10 fold, trying higher threads ([664f53b](https://github.com/entrostat/road-protect-fleet/commit/664f53b48a92918eb3d1f1fc6e28089ca7105fa0))
* **performance:** Increased the performance on the production system as well ([04f2bb9](https://github.com/entrostat/road-protect-fleet/commit/04f2bb96cb3442a9e96784c4213944ca3978234b))
* **performance:** It looks like 5 concurrent jobs is the right number ([20ebb10](https://github.com/entrostat/road-protect-fleet/commit/20ebb10303c01c9ffaa7604f6666afadb24dc316))
* **performance:** Modified the issuer restriction logic to search ([d164691](https://github.com/entrostat/road-protect-fleet/commit/d164691317e0c6ac534f221899129a8611fb6cc8))
* **performance:** Reduced concurrent jobs ([ff4a2a0](https://github.com/entrostat/road-protect-fleet/commit/ff4a2a0b3d8f4fef6b362eee16166024aff8b529))
* **performance:** Reduced the number of jobs that we can run at the same time ([399d7ff](https://github.com/entrostat/road-protect-fleet/commit/399d7ff55dbaaca31e389ccd91ca7a0677508e5d))
* **performance:** Reduced the number of jobs that we run at the same time to 10 ([1d39471](https://github.com/entrostat/road-protect-fleet/commit/1d394713cd8717da6226fbc090d7bdfa00369383))
* **performance:** Set the number of threads in the backend yaml file ([8cc976e](https://github.com/entrostat/road-protect-fleet/commit/8cc976e67ad15fb0dd6564deb28726f7aadddd16))
* **performance:** Updated the concurrency count for speedup ([d25705a](https://github.com/entrostat/road-protect-fleet/commit/d25705aa328d76c83922c30903d8e373860feca0))
* **permissions:** Fix permissions error that caused popup saying that user doesn't have permission ([b48a350](https://github.com/entrostat/road-protect-fleet/commit/b48a350cd5beb6eeada1dbc40ab6a1adbc9c8653))
* **query:** Set the graphing filter to false by default ([6ce48f2](https://github.com/entrostat/road-protect-fleet/commit/6ce48f24381f8bb291f2a18600d52c81d09abceb))
* **queue-workers:** Added the queue workers for ATG to the list ([ef9fb25](https://github.com/entrostat/road-protect-fleet/commit/ef9fb25b65518520690ff86be077e970faeba0a4))
* **rate-limit:** Don't block if the rate limit fails ([bbbd76e](https://github.com/entrostat/road-protect-fleet/commit/bbbd76e3355909bd38ef475829dab35fb442dc7d))
* **rate-limit:** Log the error on rate limit ([182669d](https://github.com/entrostat/road-protect-fleet/commit/182669d631bb1a16e5811eeaa41f338cf52cc44b))
* **rate-limit:** Set the rates high for now ([f981d9d](https://github.com/entrostat/road-protect-fleet/commit/f981d9ddd4c2d6f5c111bb5cc4fc8ed82dfb3465))
* **raw-infringement:** Added filter for notice number on raw infringement log ([0759282](https://github.com/entrostat/road-protect-fleet/commit/0759282a2bca8cccfdf8cfa4e1708431b260d3c6)), closes [#314](https://github.com/entrostat/road-protect-fleet/issues/314)
* **raw-infringement:** Added log for reprocessing raw infringements ([a11b813](https://github.com/entrostat/road-protect-fleet/commit/a11b81359e5d10dd95eeda57c6e1e6e8b533a226))
* **raw-infringement:** Added migrate data back ([e50bec0](https://github.com/entrostat/road-protect-fleet/commit/e50bec0853755c52a2f0073673c6daae8fbca43c))
* **raw-infringement:** Issuer and notice number corrected for manual insert raw infringement ([b0dd7bb](https://github.com/entrostat/road-protect-fleet/commit/b0dd7bbc06412b7f3945d7646600c2d0dd9ad056)), closes [#359](https://github.com/entrostat/road-protect-fleet/issues/359)
* **raw-infringement:** Omit null for atg raw data mapper ([3da6b5f](https://github.com/entrostat/road-protect-fleet/commit/3da6b5f70e394d67b57c471f633089f2d5f61959))
* **raw-infringement:** Omit null for atg raw data mapper ([78f386f](https://github.com/entrostat/road-protect-fleet/commit/78f386f96cb19fa027d00376265a20a4607daf0b))
* **raw-infringement:** Setting amount due from fine_debit field for old fleet mapper and added fields for notice number and issuer on raw infringement ([40dec6b](https://github.com/entrostat/road-protect-fleet/commit/40dec6b62d4f16adb1d1f1b7362ec27eb6f5adff))
* **raw-infringement:** Sync infringement issuer from old fleet only if issuer code is not zero ([80c68ed](https://github.com/entrostat/road-protect-fleet/commit/80c68ed464c9e6c85b91321236179a076d7de5b9))
* **raw-infringement:** Sync only valid infringement issuers from old fleet, do not try to sync by issuer name over issuer code ([3c1ff74](https://github.com/entrostat/road-protect-fleet/commit/3c1ff74d4c8ce361280cc58974195eafe65f0e9e))
* **raw-infringement:** Update dto must also set amount due from fine debit ([e53bdae](https://github.com/entrostat/road-protect-fleet/commit/e53bdae776bab20b4ae134ff8e7956430d50c9b6))
* **raw-infringement:** Update migration to not try add data ([2466cfa](https://github.com/entrostat/road-protect-fleet/commit/2466cfae57e1420603433c802edd5bdf1d0ea0e6))
* **raw-mappers:** Don't force vehicle to exist on infringement create in raw mapper ([bbec12c](https://github.com/entrostat/road-protect-fleet/commit/bbec12c8e0434f509f1f0d55a02c81f6ca4f43d3))
* **redirection:** check that a redirection user is defined and return an error if it is not ([b9b79dc](https://github.com/entrostat/road-protect-fleet/commit/b9b79dc867354327f2e4217f722ac50d6e74842b))
* **redirection-address:** Added zip code field for redirection address to actual request for both physical and postal locations ([5ab6b97](https://github.com/entrostat/road-protect-fleet/commit/5ab6b97ddc4fd24dae4d641ac7aacaa44d58e011))
* **redirection-address:** Removed apartment field and added zip code field for redirection address ([1b7cb30](https://github.com/entrostat/road-protect-fleet/commit/1b7cb30782d0f8a6605b57f4c1935647d5888aec))
* **redirection-email:** CC all redirection emails to support@roadprotect.co.il ([cffc8ad](https://github.com/entrostat/road-protect-fleet/commit/cffc8adf498883107b9299f860980a1fb811e753))
* **redirection-identifier:** Set the raw redirection identifier when manually overwritting the redirection status  ([7a22371](https://github.com/entrostat/road-protect-fleet/commit/7a22371cc68111da91240853c1a594e6da768a34))
* **redirection-message:** Fixed the redirection message when a nomination is manually redirected ([da1c09f](https://github.com/entrostat/road-protect-fleet/commit/da1c09f655a6065cc40262735001549b236e9b40))
* **redirections:** added a check for undefined variables Merge branch 'fix/RPF-386/redirection-loading' into develop ([89a9dba](https://github.com/entrostat/road-protect-fleet/commit/89a9dba4aab4d514155445de0ff78694768ba42f))
* **redirections:** Added additional logic checks to make sure we should run the nomination ([d5a63b1](https://github.com/entrostat/road-protect-fleet/commit/d5a63b1d09731315487a6346825e62fe0fdbe5a1))
* **redirections:** Added logging to the chunk pull of infringements ([8d9e8d5](https://github.com/entrostat/road-protect-fleet/commit/8d9e8d5808d354e70042ca9e78e51045a18190bd))
* **redirections:** Added logs to the infringement redirection logic ([42fb2cf](https://github.com/entrostat/road-protect-fleet/commit/42fb2cfacf2a7816f3395572b7dcdf749647f752))
* **redirections:** Added the ability to find invalid redirections ([ff7b973](https://github.com/entrostat/road-protect-fleet/commit/ff7b9736376e1ac9d9a66b01a977b7edbcbbeb7f))
* **redirections:** Added the functionality to remove all redirections that were done under the new logic ([8a0db58](https://github.com/entrostat/road-protect-fleet/commit/8a0db580703457bdc76f4ef425adda54066848fa))
* **redirections:** Allow for the previous BRN to be null ([89af9f2](https://github.com/entrostat/road-protect-fleet/commit/89af9f2fa7254f5c5b095cd79f92ac4740784117))
* **redirections:** Allow for the raw redirection identifier to be null ([189079c](https://github.com/entrostat/road-protect-fleet/commit/189079c7b30a3397e1c77387c7ca06e81ed89399))
* **redirections:** Allow infringements to go from Redirection Completed to Acknowledged ([fe949af](https://github.com/entrostat/road-protect-fleet/commit/fe949af21cdc6846783d26c21cb78482203948e8))
* **redirections:** Allow redirections to take place when it is already in progress ([1a198b3](https://github.com/entrostat/road-protect-fleet/commit/1a198b387c7fb1fdd01ea590ab88e6c72e3bc19f))
* **redirections:** Allow us to set the redirection identifier even on in redirection process ([3ea43bb](https://github.com/entrostat/road-protect-fleet/commit/3ea43bbfc9fbe49d4a8d4d1afd40e1bfe71a0e9e))
* **redirections:** Allow vehicle owners to redirect fines (if the contract owner has the same id as the current account id ([8498696](https://github.com/entrostat/road-protect-fleet/commit/8498696a194fb48d7711f1a035dcf1f15b1a60d1))
* **redirections:** Check for the expected test in the confirmation number or message ([6eaea72](https://github.com/entrostat/road-protect-fleet/commit/6eaea72a8c269c01a43a5eafbc9bbcfa58a7e292))
* **redirections:** Check that the redirection identifier is not null ([dbe0bc8](https://github.com/entrostat/road-protect-fleet/commit/dbe0bc8f49feca1ca8b832a2123a29bdef82e99b))
* **redirections:** Check the set redirection identifier on the NEW infringements ([7816077](https://github.com/entrostat/road-protect-fleet/commit/7816077e3bdd6ad279a31f817b0569d42ce4be9e))
* **redirections:** Don't acknowlege the fixed nomination for flags ([69b8046](https://github.com/entrostat/road-protect-fleet/commit/69b8046628e5f840b1182cb3606af56642813e9f))
* **redirections:** Don't allow overwriting the In Redirection Process status ([1f42af1](https://github.com/entrostat/road-protect-fleet/commit/1f42af1b259dcd542793906c5a404aad58a50366)), closes [#522](https://github.com/entrostat/road-protect-fleet/issues/522)
* **redirections:** Don't always expect the nomination dto to be defined ([dc5356a](https://github.com/entrostat/road-protect-fleet/commit/dc5356abbe3b6e4e77445de869a79362fa1eba50))
* **redirections:** Don't ignore the internal statuses ([7e5c07e](https://github.com/entrostat/road-protect-fleet/commit/7e5c07e804486a2afb2971c8c9cae798aba95bb5))
* **redirections:** Don't look at the type when fixing the municiple redirections because the raw identifier was a new addition ([9033f64](https://github.com/entrostat/road-protect-fleet/commit/9033f64fc9ba6ba45cbf10d14602ffc98a2666ef))
* **redirections:** Don't overwrite redirections that have taken place using ATG or manual email ([c789408](https://github.com/entrostat/road-protect-fleet/commit/c789408893c13cad9e74db3c5068deef87850929))
* **redirections:** Don't redirect during a digital nomination ([d64f9be](https://github.com/entrostat/road-protect-fleet/commit/d64f9bef6b5c21d05f7a25d6a214e4a849fd46dc))
* **redirections:** Don't set the completion date if the redirection is not complete ([08dbe0e](https://github.com/entrostat/road-protect-fleet/commit/08dbe0e5f18d9253800dda14e21850e73eb5943d))
* **redirections:** Don't set the status to pending once the infringement has been redirected, set it to acknowledged ([69098a8](https://github.com/entrostat/road-protect-fleet/commit/69098a8127c09ebe4539ffd7bc3861bf3cb39a24))
* **redirections:** Don't throw an error when the completion date exists but it's the wrong identifier ([f879958](https://github.com/entrostat/road-protect-fleet/commit/f87995864d8b76df68856f60a717476f0fb504e1))
* **redirections:** Extract limited information and return in the api request ([4a39231](https://github.com/entrostat/road-protect-fleet/commit/4a392311e0667e522bf53ad8407d21456fb0dfd3))
* **redirections:** Filter out the valid ones ([3cd4e41](https://github.com/entrostat/road-protect-fleet/commit/3cd4e419eb0c7306f82057d6c8d68466a48b9b23))
* **redirections:** Ignore null brn in infringement history ([7df9ab1](https://github.com/entrostat/road-protect-fleet/commit/7df9ab1a0bd2617c6f4cef91201befc4254cee60))
* **redirections:** Log the redirection reset for users to see ([92a1b51](https://github.com/entrostat/road-protect-fleet/commit/92a1b5105b5418fe0ee1c0898f04abae6c002367))
* **redirections:** Moved the redirection identifier filters to the simple view ([2b6c104](https://github.com/entrostat/road-protect-fleet/commit/2b6c10465a71a14c4490466c06aac1c3b45f87e4))
* **redirections:** Need to join nominations onto the infringements for the invalid redirection logic to work ([b99b21b](https://github.com/entrostat/road-protect-fleet/commit/b99b21b40cb6e7bf6440a317b40cfeb5a9e80b53))
* **redirections:** Not all history has the old object for an infringement ([efdebf8](https://github.com/entrostat/road-protect-fleet/commit/efdebf8beda94f8df4d92142db19fea2ea00094b))
* **redirections:** Override the raw redirection identifier when it's specified ([b562719](https://github.com/entrostat/road-protect-fleet/commit/b562719367fbd0f6753a530218d99898ef48f9d2))
* **redirections:** Overwrite incorrect nominations ([7536084](https://github.com/entrostat/road-protect-fleet/commit/75360847953ee31c4622bdfba916bbf6a1d95b16))
* **redirections:** Parse the Telaviv response if it is returned as a string ([b84396e](https://github.com/entrostat/road-protect-fleet/commit/b84396e58b5f0bf88ddf5d6632adcae44dbb1313))
* **redirections:** Prevented infringement from unnecessairly getting saved and creating a circular error `Merge branch 'fix/RPF-403/redirection-failure-internal-server-error' into develop ([7e60ffe](https://github.com/entrostat/road-protect-fleet/commit/7e60ffe3b2c01d9f05af250e1913f6aec6755103))
* **redirections:** Removed the update of the BRN to the new one when we run redirections ([6541f74](https://github.com/entrostat/road-protect-fleet/commit/6541f741f62fe93d958ec3be1e81f88652af77ad))
* **redirections:** Set street number to postOfficeBox rather than zip code when redirecting with postal address ([65e03f0](https://github.com/entrostat/road-protect-fleet/commit/65e03f05993d1acbf4c0bb34245cec69cdef7ed3)), closes [#298](https://github.com/entrostat/road-protect-fleet/issues/298)
* **redirections:** Set the house number to postal code on postal address ([2647450](https://github.com/entrostat/road-protect-fleet/commit/26474507bda09117d308063f756aed79b6f02a26))
* **redirections:** Set the redirection target id if it exists ([f82336f](https://github.com/entrostat/road-protect-fleet/commit/f82336f8a8ea64720b0c6217b82bc43295509b94))
* **redirections:** Set the street number to an empty string ([28bdc36](https://github.com/entrostat/road-protect-fleet/commit/28bdc364731bfb84051193281b8d9194c0f4828e))
* **redirections:** The split inverts the output because the string is right to left ([5921f69](https://github.com/entrostat/road-protect-fleet/commit/5921f69c35bd1a9c2dbb271dc475b6a4e43f56cb))
* **redirections:** Update the brn from issuer when the redirection is completed manually ([8e45048](https://github.com/entrostat/road-protect-fleet/commit/8e45048847f9d9b4a5648d041a5f8cbd83df93f7))
* **redirections:** Update the BRN on the infringement if the redirection is completed ([53f8915](https://github.com/entrostat/road-protect-fleet/commit/53f8915dc4495d228d7da1ddf2eb689a5788a2da))
* **registration-number:** Don't allow 0 ([c89225f](https://github.com/entrostat/road-protect-fleet/commit/c89225fa9e33184a9944c5b23c0583afcf8e4d09))
* **relations-email:** added account name from issuer to spreadsheet ([e91502e](https://github.com/entrostat/road-protect-fleet/commit/e91502e6f58b62e5b0b602daee7e52988c0da115))
* **remove-asterisks:** Remove asterisks from physical location while keeping it as a required field ([1e371d7](https://github.com/entrostat/road-protect-fleet/commit/1e371d71d851b5d2df51ee36891b6d2eb654aa38))
* **reporting:** Added Ari and Ore to the BCC ([96ef106](https://github.com/entrostat/road-protect-fleet/commit/96ef106203f00d9c4a459ae748031dd99995d66f))
* **reporting:** Don't run the cron, it seems to be out by a day ([84e648a](https://github.com/entrostat/road-protect-fleet/commit/84e648aa81ec0ef1dddf4a30509955868493655c))
* **reporting:** Don't select the issuer and vehicle table twice ([8aa271f](https://github.com/entrostat/road-protect-fleet/commit/8aa271f63adf2b4e9ed9b80fbaaf38d54cd62150))
* **reporting:** Output the total amount due without the Lodash getter ([4875d1b](https://github.com/entrostat/road-protect-fleet/commit/4875d1bd7e0a9df6d34b6378d3c2157522a12e0e))
* **reporting:** Switched the Hebrew text and account name around (RTL) ([413f98a](https://github.com/entrostat/road-protect-fleet/commit/413f98ab64ae38d97b5537d9c3f271b78919ba3f))
* **request:** Don't specify the method in the got call, rather call it as a function ([7a4a506](https://github.com/entrostat/road-protect-fleet/commit/7a4a5060166741865001e9d9127dd7dbbace9c51))
* **request:** Don't use got for requests ([3091404](https://github.com/entrostat/road-protect-fleet/commit/30914043f8be2c18f6d40badc5e20cc18d331502))
* **scheduler:** Run the bulk single infringements on Sunday at 9am ([6e060c4](https://github.com/entrostat/road-protect-fleet/commit/6e060c4eeb722124ba214b325cbc4635c859e40b))
* **security:** Allow for JSON parsing to fail as well ([101ef9f](https://github.com/entrostat/road-protect-fleet/commit/101ef9fe52f6d233e7433e62af32a61a8cbc6768))
* **security:** Don't throw decryption failures when we're in staging or development ([1d015d0](https://github.com/entrostat/road-protect-fleet/commit/1d015d0669f216e465eba4e482306605de398db2))
* **seeder:** Change infringement notice numbers to numerical values only ([f0e294a](https://github.com/entrostat/road-protect-fleet/commit/f0e294a1154780372dbfe777b0a72a0c53b2a946))
* **seeders:** Updated the names in the seeders ([2d4b3f9](https://github.com/entrostat/road-protect-fleet/commit/2d4b3f9d7545e2ce8ed3cb1d2a437efb8899a660))
* **sorting-infringements-table:** Fixed bug that occurred when sorting infringements table by contract user and owner ([1d2b34b](https://github.com/entrostat/road-protect-fleet/commit/1d2b34b418ee9561d01f28111720559a45e8f9f1))
* **spreadsheet:** Added the owner and user name and brn ([75c5b0a](https://github.com/entrostat/road-protect-fleet/commit/75c5b0ab19a5705cde6528f0c75d460db0628505))
* **spreadsheet:** Convert user identifier to user name in contract export ([3640556](https://github.com/entrostat/road-protect-fleet/commit/36405569b584fd5115b7f7b0da40c8fded5ae420))
* **spreadsheet-template:** Use i18next to translate the column headers on the spreadsheet template upload to ensure that they match the input labels ([a13f4e7](https://github.com/entrostat/road-protect-fleet/commit/a13f4e73ddc73fc1d83814a75129d67300793825))
* **spreadsheet-upload:** Added the ability to convert date to string before reading the spreadsheet ([b21cf55](https://github.com/entrostat/road-protect-fleet/commit/b21cf5503d89981159b2aaeecd64504a48100a2b))
* **spreadsheet-upload:** Read the data in as raw and ignore date parsing in the spreadsheet ([7fcfe88](https://github.com/entrostat/road-protect-fleet/commit/7fcfe883b3e588b012966ef0de978bab9461711b))
* **spreadsheets:** Ensured contract components were displaying in excel Merge branch 'fix/RPF-417/infringment-accounts-empty-in-excel' into develop ([4213ac3](https://github.com/entrostat/road-protect-fleet/commit/4213ac3653ba1a4714c065421abf494187331553))
* **status-mapper:** Don't map statuses as outstanding, rather leave as due ([c3545eb](https://github.com/entrostat/road-protect-fleet/commit/c3545eb9ac3e3cb331b116f6787ae399d7208278))
* **statuses:** Allow infringements to go from closed to open ([4ae0ded](https://github.com/entrostat/road-protect-fleet/commit/4ae0ded0bac16dc92008ba9ab425ce4d98e14018))
* **statuses:** Allow infringements to go from closed to paid ([d8b4916](https://github.com/entrostat/road-protect-fleet/commit/d8b491693c470f5adc1f80fa616bce2a666738e4))
* **test:** Updated the account tests to allow for the new address requirements ([d1d23e5](https://github.com/entrostat/road-protect-fleet/commit/d1d23e5c2943c441b4214368ed41e45387b5ebae)), closes [#304](https://github.com/entrostat/road-protect-fleet/issues/304)
* **testing:** Commented out the tests that use the document api ([f229a5f](https://github.com/entrostat/road-protect-fleet/commit/f229a5f933535deb10dea804a6b6244ea88a679c))
* **testing:** Trying to create a storge directory ([7de1cc7](https://github.com/entrostat/road-protect-fleet/commit/7de1cc714a36c7911389eb197465f3aea78ef54a))
* **tests:** Added a test for daylight savings ([f65d1a3](https://github.com/entrostat/road-protect-fleet/commit/f65d1a3dfccd742ef5dc7aa56fd8fcc5154373c7))
* **tests:** Added default tests for short-term before implementing the manual redirection tests ([78b2b47](https://github.com/entrostat/road-protect-fleet/commit/78b2b47ecf4a62079e9aa5103fc6089565f5994f))
* **tests:** Added the force exit to tests ([2b38b29](https://github.com/entrostat/road-protect-fleet/commit/2b38b29042088150de2a1e8fcf2b724aced72e7c))
* **tests:** Close the test app after all the tests have run ([fd52461](https://github.com/entrostat/road-protect-fleet/commit/fd52461ad8ac9c757e46df7afd336829b6738193))
* **tests:** Don't omit the BRN when running an infringement update ([6a27d63](https://github.com/entrostat/road-protect-fleet/commit/6a27d632db123117a6757c598b23f8e98c605db2))
* **tests:** Ensure that the test database does not link to the dev database ([3473d23](https://github.com/entrostat/road-protect-fleet/commit/3473d23e52f1d1da2a410199c35495306d144f9e))
* **tests:** Updated the tests locally that allow us to filter by file name (removed the git commit side) ([c0f4d26](https://github.com/entrostat/road-protect-fleet/commit/c0f4d265bda7d23a447b9dadc8c4b3b860fa0347))
* **timestamp-entity:** Don't typecast the date from string to moment ([1a450e5](https://github.com/entrostat/road-protect-fleet/commit/1a450e5088319dfccddd2efd604aace13c413a94))
* **timezones:** Added the new ISO pattern from ATG as an accepted format ([b9f3336](https://github.com/entrostat/road-protect-fleet/commit/b9f33360f6ebb5e5c4f22726574e51b5facd6ac1))
* **timezones:** Check for an offset on a date before doing the offset calculation and if there is one then use that instead of calculating an offset ([3650b37](https://github.com/entrostat/road-protect-fleet/commit/3650b378bb649bed9b4eafcdcd2c5c59f474b08c))
* **timezones:** Convert the lease and ownership timezones to UTC when creating them ([27cdda1](https://github.com/entrostat/road-protect-fleet/commit/27cdda150d3e121124d5b82ba8c491bbfd234090))
* **timezones:** created a function where I ignore the offset and create a standard ISO string ([ea576ff](https://github.com/entrostat/road-protect-fleet/commit/ea576ff3fcae1f59b1afb948fb29332f0aa529ab))
* **timezones:** don't convert to UTC, rather go directly to ISO because the dates don't have times for lease contracts ([839be8d](https://github.com/entrostat/road-protect-fleet/commit/839be8d0aa0193c05a2f8f56b9a061daf3e01b8e))
* **timezones:** Ensure that we pull the daylight savings timezone shift when possible ([eafe0b4](https://github.com/entrostat/road-protect-fleet/commit/eafe0b4807f4032d95f5beffcb10045976c93422))
* **timezones:** I want the timezones to carry through so I've removed the automated UTC timezone ([2df77f9](https://github.com/entrostat/road-protect-fleet/commit/2df77f97c02a6f60fe3205db69c28bf3913d4cd4))
* **timezones:** Just make all contract dates UTC, there is too much complexity in these offsets ([26b2fb4](https://github.com/entrostat/road-protect-fleet/commit/26b2fb44e310fdefe75638cb2418b98cc250be4a))
* **timezones:** removed the timezone conversion on the lease contract upload to avoid problems with the dates ([fb7fef6](https://github.com/entrostat/road-protect-fleet/commit/fb7fef60671b7fe0bd94bcffa1d7a531db7fcab2))
* **timezones:** Return the fixed date as UTC and then adjust the offset based on the date specified by the user upload ([9a4e414](https://github.com/entrostat/road-protect-fleet/commit/9a4e414c0580dd5d3af5e70aab83c2fb7866efdf))
* **timezones:** Set the default timezone to UTC during the conversion to get a valid adjustment ([c289d58](https://github.com/entrostat/road-protect-fleet/commit/c289d5897e82a4182b4099e5ed2d7e898e02c5e0))
* **timezones:** Try to insert the timezone when I have it available ([fcdcdff](https://github.com/entrostat/road-protect-fleet/commit/fcdcdff9a85bc96794625cb7c337b72238f493fd))
* **timezones:** Use a default timezone or one on the row if it's there ([0a2041f](https://github.com/entrostat/road-protect-fleet/commit/0a2041fe4a231149165069c26f98304e46f03e59))
* **timezones:** Use the date to determine the timezone due to daylight savings ([18a5742](https://github.com/entrostat/road-protect-fleet/commit/18a57428b80398c3f3cd8b863b155fef87747f30))
* **timezones:** Use the default timezone from the config if necessary ([3f8ee3b](https://github.com/entrostat/road-protect-fleet/commit/3f8ee3b2910e4acfbdde00cab361e6cb213e279d))
* **translation:** Fix postal code translation ([a3f6ec7](https://github.com/entrostat/road-protect-fleet/commit/a3f6ec711ad6c4c975d041fe2ae7dade4541a9db))
* **translations:** Change PO Box  to  PO Box / Street ([2c0b13d](https://github.com/entrostat/road-protect-fleet/commit/2c0b13df69223beb3839e885069b860a3295474a))
* **translations:** Changed the approved for payment date translation ([eca3bb0](https://github.com/entrostat/road-protect-fleet/commit/eca3bb04c1abaec754dc0a814b13329bbf9949a5))
* **translations:** Corrected the formatting again ([77f536a](https://github.com/entrostat/road-protect-fleet/commit/77f536a0ee97b7f93349dd3d730cf8fb0fb77c99))
* **translations:** Corrected the formatting in the translation file ([0b0e2de](https://github.com/entrostat/road-protect-fleet/commit/0b0e2de077d738734620f2f2249f916974ae29bc))
* **translations:** Replaced all places that the approved translation shows up ([a737b58](https://github.com/entrostat/road-protect-fleet/commit/a737b584c408940ab72649bb10dfd4e500c7e322))
* **translations:** Updated the EN translations ([ec6fa04](https://github.com/entrostat/road-protect-fleet/commit/ec6fa04ba8b139dcbd3739a1da03f52b823a941b))
* **translations:** Updated the translation files ([d6e77b9](https://github.com/entrostat/road-protect-fleet/commit/d6e77b99c0d4cb39ae4f32ac607f6ae2baca5609))
* **translations:** Updated unapprove for payment hebrew translation ([4198a97](https://github.com/entrostat/road-protect-fleet/commit/4198a976cbef87bb324a9b31438e09e35fa1750f))
* **typing:** Avoid using string key names in objects ([67ee359](https://github.com/entrostat/road-protect-fleet/commit/67ee35982051e0fb7e2a49f75b2a6be68effd2e8))
* **typo:** Changed the name of the sync function (was "clear" before) ([26275ee](https://github.com/entrostat/road-protect-fleet/commit/26275ee8a0d62f2fdb860da77faf169f9a1b9a0d))
* **ui:** Added redirection details to the nomination view ([67aab66](https://github.com/entrostat/road-protect-fleet/commit/67aab6640ba840c00ad2b0d309164866f8139239))
* **ui:** Added the ability to view the redirection letter send date on the frontend in the filters ([6a20532](https://github.com/entrostat/road-protect-fleet/commit/6a20532d97ab33e49cb375eab512b5e47cccf298))
* **ui:** Allow for account id of null on the nomination view ([901a601](https://github.com/entrostat/road-protect-fleet/commit/901a601216278afdfbcff2c5f3ba4406c70c8d28))
* **ui:** Changed the Redirected Date to output as a date string instead of a unix timestamp ([c317866](https://github.com/entrostat/road-protect-fleet/commit/c3178662a449f19535d2c91395ca9739698a5af5)), closes [#138](https://github.com/entrostat/road-protect-fleet/issues/138)
* **ui:** Changed the wording on the batch redirections modal to use the words "Requests" so that it's not misleading to the user around what has happened (ie. The request has sent but the redirection isn't successful yet) ([1c0df3c](https://github.com/entrostat/road-protect-fleet/commit/1c0df3c16d3ff08ca098b216825212a4dc0ec95e)), closes [#135](https://github.com/entrostat/road-protect-fleet/issues/135)
* **ui:** do not allow the button to process infringements if none meet the criteria ([05fa7d0](https://github.com/entrostat/road-protect-fleet/commit/05fa7d09f99e425c12ed0f7fa62168b42c5a4b8e)), closes [#146](https://github.com/entrostat/road-protect-fleet/issues/146)
* **ui:** Fixed the link to view a user (we need plural in the url) ([eb9e2be](https://github.com/entrostat/road-protect-fleet/commit/eb9e2be25a5dfa2ee4269f86edd024f27b993523))
* **ui:** Fixed the user stamp view, disabled the correct buttons when the stamp was uploaded and improved the css layout ([9187468](https://github.com/entrostat/road-protect-fleet/commit/91874681f91a1e567a7f26f38ff569be926453a0)), closes [#154](https://github.com/entrostat/road-protect-fleet/issues/154)
* **ui:** Increase contrast on disables buttons and filter placeholders ([365feb4](https://github.com/entrostat/road-protect-fleet/commit/365feb420ec1d997e54cf4959eee3dd607d8c3d5))
* **ui:** increased the width of the infringement modal to two columns ([1929526](https://github.com/entrostat/road-protect-fleet/commit/1929526ea3124764902234de2fb19a627089afdf)), closes [#143](https://github.com/entrostat/road-protect-fleet/issues/143)
* **ui:** Made the vehicle type visible on the simple view ([00ed023](https://github.com/entrostat/road-protect-fleet/commit/00ed023f71d044fabc75f720ca993f09a3e0885c))
* **ui:** Output the nomination and redirection status on an infringement so that users know if they are able to perform those actions ([767ae46](https://github.com/entrostat/road-protect-fleet/commit/767ae46ea71f35e86f22d3b98f6cb2d4c09f226c)), closes [#153](https://github.com/entrostat/road-protect-fleet/issues/153)
* **ui:** Removed the infringement upload date because users didn't understand what it meant ([72f2be8](https://github.com/entrostat/road-protect-fleet/commit/72f2be874b292898372dc07001c8ba1244ef4ee2))
* **ui:** Removed the nomination date from the nomination view because it's a confusing date (it doesn't represent the actual date, just when the nomination was started on the system) ([cc19ec2](https://github.com/entrostat/road-protect-fleet/commit/cc19ec2d0d469862e364086d5cbd74ff3c7173e1))
* **ui:** Set a minimum width on the issuer selection ([5534b5c](https://github.com/entrostat/road-protect-fleet/commit/5534b5c6fe9039c7e8652e89b832c664da3d61f1))
* **ui:** Show dates around payments and verifications in the simple filter ([4bfb976](https://github.com/entrostat/road-protect-fleet/commit/4bfb976cb28839601963cbdd2d83d3d10ea5ade6))
* **update-amount:** The original amount would sometimes return null ([b3f0a38](https://github.com/entrostat/road-protect-fleet/commit/b3f0a3853cd9aa1a3793b5be88e386964812130c))
* **update-infringement:** Check for the date letter sent key in order to trigger a relink of the infringement ([99f316d](https://github.com/entrostat/road-protect-fleet/commit/99f316da8a605afaa31158ba594947d50b634555))
* **update-infringement:** Could not update infringment dates ([0cdd409](https://github.com/entrostat/road-protect-fleet/commit/0cdd40936526e0711ae3aef1ffd8c11fe9dddefb))
* **update-infringements:** Prioritise rules over issuer status since we do not have a lot of rules but they should take preference ([2e345d6](https://github.com/entrostat/road-protect-fleet/commit/2e345d6e3a609425d05e92167b4df3cf8a04fb4a))
* **upload-spreadsheets:** Fix upload description for general entity spreadsheet upload ([f0fceef](https://github.com/entrostat/road-protect-fleet/commit/f0fceef9a4b48603f24e2c80a645a5cac13a89c7))
* **upsert:** Added a minor delay so that the websocket can process ([cf4fdea](https://github.com/entrostat/road-protect-fleet/commit/cf4fdeafaa561e6eb8677f3281ee670015f34531))
* **upsert:** Added a promise timeout of 30s for infringement ([12e81a4](https://github.com/entrostat/road-protect-fleet/commit/12e81a40142ccf0d953997656d9087aaee5590ec))
* **upsert:** Always merge the dto first and then the infringement id ([1fbf105](https://github.com/entrostat/road-protect-fleet/commit/1fbf105a970b0314b3d17c6dc2b550d1aacc7094))
* **upsert:** Don't call fixDate in the timezone adjustment transform ([69f4255](https://github.com/entrostat/road-protect-fleet/commit/69f4255a481a242c7f9e19ea19b309f87a1a1ad6))
* **upsert:** Reduced the number of concurrent jobs ([fda410b](https://github.com/entrostat/road-protect-fleet/commit/fda410b7275627b523b51a103dcf5e769b7cd385))
* **upsert:** Use promax instead of the previous promise map ([0735a85](https://github.com/entrostat/road-protect-fleet/commit/0735a856434af8c7ce9c9826c312746e1c778cfe))
* **upsert-infringement:** Chunk the query that looks for existing infringements ([e8aff4d](https://github.com/entrostat/road-protect-fleet/commit/e8aff4dbb68b53d5c03ba01c84dd7a4e4630492d)), closes [#351](https://github.com/entrostat/road-protect-fleet/issues/351)
* **upsert-infringement:** Validate upsert dto on spreadsheet upload ([b9bdfc8](https://github.com/entrostat/road-protect-fleet/commit/b9bdfc8004082ea63f35bcf1306c5b00d1cad583))
* **upsert-infringements:** Added debug logs to make sure that the upsert is running ([77b91f7](https://github.com/entrostat/road-protect-fleet/commit/77b91f759d356756794bfd8c6660c0790e7f98f9))
* **upsert-infringements:** Removed the transactional decorator on the upsert functions so that we can still write raw infringements ([88b7ced](https://github.com/entrostat/road-protect-fleet/commit/88b7cedd805646efaebe2c051f4be1a5bb0ef30c))
* **upsert-verification:** The verification of an upserted spreadsheet was failing due to a clash in endpoints ([f505426](https://github.com/entrostat/road-protect-fleet/commit/f50542640a6289399c32c6e45c7a185a350cd193)), closes [#289](https://github.com/entrostat/road-protect-fleet/issues/289)
* **validators:** Added the future offence date validator ([6c52712](https://github.com/entrostat/road-protect-fleet/commit/6c52712d5829ab5e1f1647362f3d68328d4c7ad2))
* **verifications:** Added loading on verify buttons and added batch verifications ([16c8dfe](https://github.com/entrostat/road-protect-fleet/commit/16c8dfe949a21c8d73d79015938ce56179781d2d)), closes [#386](https://github.com/entrostat/road-protect-fleet/issues/386)
* **verifications:** Added query param to specify provider when verifying unpaid infringements in bulk ([3eaf11a](https://github.com/entrostat/road-protect-fleet/commit/3eaf11a79abe99f55479c9f13ef29c23621ce011)), closes [#466](https://github.com/entrostat/road-protect-fleet/issues/466)
* **verifications:** Scheduler for unpaid verifications improved to try reduce load  ([12c2965](https://github.com/entrostat/road-protect-fleet/commit/12c2965749f13ad786fbaf642249da7805ec6f4b)), closes [#461](https://github.com/entrostat/road-protect-fleet/issues/461)
* **verifications:** Select required infringement by most recent offence date for batch crawler verification ([4f07309](https://github.com/entrostat/road-protect-fleet/commit/4f073091ee69c2e20a62f827ae2847173a5dc109)), closes [#423](https://github.com/entrostat/road-protect-fleet/issues/423)
* **verifications:** Update infringement reason in raw mappers ([9242867](https://github.com/entrostat/road-protect-fleet/commit/92428675d19a4648237af5f5af667ee834f45585)), closes [#395](https://github.com/entrostat/road-protect-fleet/issues/395)
* **verifications:** User type must be admin or developer to verify infringement ([2ff9e9b](https://github.com/entrostat/road-protect-fleet/commit/2ff9e9b4190d7a79c833c2957aaad46eb34655de))
* **verifications:** Various verification improvements to ensure crawler mappers running smoothly including awaiting dto validate, fixes to dtos, changes to tests ([ee911d2](https://github.com/entrostat/road-protect-fleet/commit/ee911d2609e5c2bd75600bf1a995a2f04a89c894)), closes [#422](https://github.com/entrostat/road-protect-fleet/issues/422)
* **verify-infringement:** Refresh nomination and infringement on store after verifying infringement ([8ade6b6](https://github.com/entrostat/road-protect-fleet/commit/8ade6b63af6cb332fc220da1d55e6c93260b80ed)), closes [#373](https://github.com/entrostat/road-protect-fleet/issues/373)
* **workflow:** Must build frontend ([e358a5f](https://github.com/entrostat/road-protect-fleet/commit/e358a5f44aa575070467f624c7f4ecb38770aaeb))

### [2.122.2](https://github.com/entrostat/road-protect-fleet/compare/v2.122.0...v2.122.2) (2021-02-25)


### Bug Fixes

* **crawler-schedulers:** Set crawler schedulers to run at 7am utc ([f688014](https://github.com/entrostat/road-protect-fleet/commit/f688014ed2f26ecb43b71896d07753aef99e6130))

### [2.122.1](https://github.com/entrostat/road-protect-fleet/compare/v2.122.0...v2.122.1) (2021-02-25)


### Bug Fixes

* **crawler-schedulers:** Set crawler schedulers to run at 7am utc ([f688014](https://github.com/entrostat/road-protect-fleet/commit/f688014ed2f26ecb43b71896d07753aef99e6130))

## [2.122.0](https://github.com/entrostat/road-protect-fleet/compare/v2.121.0...v2.122.0) (2021-02-23)


### Features

* **infringements-view:** Added the external redirection references Merge branch 'feature/RPF-418/add-external-redirection-reference-to-table' into develop ([0faacf0](https://github.com/entrostat/road-protect-fleet/commit/0faacf0792a9bec1b129743e73f2d2f0f365098e))
* **interation-tests:** Adjusted integration tests to search for new infringements Merge branch 'feature/RPF-416/integration-tests-new-infringement' into develop ([99733b9](https://github.com/entrostat/road-protect-fleet/commit/99733b98042d7e14d2c1c98cc3d904c85849c78f))


### Bug Fixes

* **bau:** missing accountId error on router link Merge branch 'fix/RPF-420/missing-account-id' into develop ([b6b5251](https://github.com/entrostat/road-protect-fleet/commit/b6b5251067020b1d5acd6b727ce9bc7a6db7c9c5))
* **spreadsheets:** Ensured contract components were displaying in excel Merge branch 'fix/RPF-417/infringment-accounts-empty-in-excel' into develop ([f64e68c](https://github.com/entrostat/road-protect-fleet/commit/f64e68c21c4f8857dddd11cb733f2d070b1151e0))

## [2.121.0](https://github.com/entrostat/road-protect-fleet/compare/v2.120.0...v2.121.0) (2021-02-19)


### Features

* **integration-tests:** Added a Telaviv Integration test with a notice number filter Merge branch 'feature/RPF-404/telaviv-single-infringement-integration-test' into develop ([7cfb22f](https://github.com/entrostat/road-protect-fleet/commit/7cfb22fb5df0a11cc07e2bae60f6173b61a9a460))
* **integration-tests:** Added Police integration test to include case number Merge branch 'feature/RPF-405/police-integration-test-by-number' into develop ([36c1ac4](https://github.com/entrostat/road-protect-fleet/commit/36c1ac418fb2c78ade77ec562aa54af7748ef839))


### Bug Fixes

* **batch-actions-on-admin-view:** Fixed which batch actions are shown in the admin infringements page ([0116f6b](https://github.com/entrostat/road-protect-fleet/commit/0116f6b88cbca4383b0f454b0e02f3ec3af2f5d4))

## [2.120.0](https://github.com/entrostat/road-protect-fleet/compare/v2.119.1...v2.120.0) (2021-02-19)


### Features

* **infringement-table:** Show the account tag that corresponds to the infringement's brn next to it in the table ([ce469db](https://github.com/entrostat/road-protect-fleet/commit/ce469db1dc95ef4a2e25f0eb3083e22cb4185976))
* **ocr:** Force upload a contract that has failed OCR Merge branch 'feature/RPF-395/force-upload-contract' into develop ([175e5ca](https://github.com/entrostat/road-protect-fleet/commit/175e5caea793dfbe949a5c18d657d57ed3949aea))


### Bug Fixes

* **infringement-view:** Fix errors occuring when infringement has missing fields ([40f6ec4](https://github.com/entrostat/road-protect-fleet/commit/40f6ec4e1060d4df0014eb42206d15d41918828e))
* **ocr:** Allow users to override the OCR on create contract upload  Merge branch 'fix/RPF-399/override-create-contract-ocr' into develop ([dd3e072](https://github.com/entrostat/road-protect-fleet/commit/dd3e0727405b8488d0ee977e51763b1a666e70b4))
* **redirections:** Prevented infringement from unnecessairly getting saved and creating a circular error `Merge branch 'fix/RPF-403/redirection-failure-internal-server-error' into develop ([3f25c54](https://github.com/entrostat/road-protect-fleet/commit/3f25c54cad0dfcaf0f61b9adf1899f014a4d79db))

### [2.119.1](https://github.com/entrostat/road-protect-fleet/compare/v2.119.0...v2.119.1) (2021-02-17)


### Bug Fixes

* **crawlers:** Fixed creation of an external payment  Merge branch 'fix/RPF-391/crawler-not-updating-infringement' into develop ([5d065ee](https://github.com/entrostat/road-protect-fleet/commit/5d065eebc8ed855ccf0514594db0acc28f1a429d))
* **document-api:** updated the document-api port to 8081 Merge branch 'fix/RPF-383/document-rendering-connection' into develop ([c5e49b8](https://github.com/entrostat/road-protect-fleet/commit/c5e49b89e8037824bb8d2c53ccff7178fd1a90c5))
* **notifications:** added checks for infringement existence for router Merge branch 'fix/RPF-385/notification-button' into develop ([ddab750](https://github.com/entrostat/road-protect-fleet/commit/ddab750d1be1efb73156a24264b911a67f19fccc))
* **redirections:** added a check for undefined variables Merge branch 'fix/RPF-386/redirection-loading' into develop ([c1ecbc7](https://github.com/entrostat/road-protect-fleet/commit/c1ecbc75ffe0f89360ad8c934b01e7887a932f34))
* **sorting-infringements-table:** Fixed bug that occurred when sorting infringements table by contract user and owner ([a03b65f](https://github.com/entrostat/road-protect-fleet/commit/a03b65f6d2eca14d188e6964a5a3aaef0ffe5ffd))
* **upload-spreadsheets:** Fix upload description for general entity spreadsheet upload ([625f61a](https://github.com/entrostat/road-protect-fleet/commit/625f61aceb3d8b56c0a6ab1efbf38d1d0cd9535b))

## [2.119.0](https://github.com/entrostat/road-protect-fleet/compare/v2.118.1...v2.119.0) (2021-02-16)


### Features

* **info-request:** Updated the infringement view radio button filters Merge branch 'feature/RPF-374/update-infringement-buttons' into develop ([fe78364](https://github.com/entrostat/road-protect-fleet/commit/fe78364dccdcaad880671ec1259c9f2b63dda0b3))

### [2.118.1](https://github.com/entrostat/road-protect-fleet/compare/v2.118.0...v2.118.1) (2021-02-15)


### Bug Fixes

* **update-amount:** The original amount would sometimes return null ([a0466c0](https://github.com/entrostat/road-protect-fleet/commit/a0466c04ea75ab7cfb4045ba2bf441808c330188))

## [2.118.0](https://github.com/entrostat/road-protect-fleet/compare/v2.117.1...v2.118.0) (2021-02-15)


### Features

* **payments:** Updated the Infringement-Payment relation to one-to-many Merge branch 'feature/RPF-372/one-to-many-payments' into develop ([ea3799a](https://github.com/entrostat/road-protect-fleet/commit/ea3799aa8680897a87e4ff9cfdb6706ca6cf3833))
* **penalty-calculations:** Updated the penalty calculations to a fixed column rather than calculated Merge branch 'feature/RPF-369/refine-penalty-amount' into develop ([79a7090](https://github.com/entrostat/road-protect-fleet/commit/79a709006a93c48ae95bbaceabd1eda8473be532))


### Bug Fixes

* **queue-workers:** Added the queue workers for ATG to the list ([25d40a3](https://github.com/entrostat/road-protect-fleet/commit/25d40a3948726010d83ed1697e20a7691e7b29ca))
* **redirections:** Don't throw an error when the completion date exists but it's the wrong identifier ([053fc56](https://github.com/entrostat/road-protect-fleet/commit/053fc56a5976ead1ae2293ad4818fde475ca2e8c))

### [2.117.1](https://github.com/entrostat/road-protect-fleet/compare/v2.117.0...v2.117.1) (2021-02-15)


### Bug Fixes

* **query:** Set the graphing filter to false by default ([a80148e](https://github.com/entrostat/road-protect-fleet/commit/a80148ea51f8b17eb1366ea115fcf22d7b82470f))

## [2.117.0](https://github.com/entrostat/road-protect-fleet/compare/v2.116.0...v2.117.0) (2021-02-15)


### Features

* **graphing-by-issuer:** Added the ability to view filtered infringements by clicking on the graph legend ([4e01f02](https://github.com/entrostat/road-protect-fleet/commit/4e01f0264b02c74aae1183af74b8ac26e5f5382c))
* **graphing-by-issuer:** Set parameters in NgRx store to filter infringements on graphing by issuer page infringements table ([536f76b](https://github.com/entrostat/road-protect-fleet/commit/536f76bfa263ad72c7e38ed7966de951f7e320bd))
* **graphing-by-issuer:** View infringements table in graphing by issuer page ([ca5fab4](https://github.com/entrostat/road-protect-fleet/commit/ca5fab449ef1c5623d33dbd1abbab2860f8de164))


### Bug Fixes

* **graphing:** Fix the alignment of cells in the aggregated table when viewed in Hebrew ([57a98ca](https://github.com/entrostat/road-protect-fleet/commit/57a98caf7fb713fc18ba3127b31cd36f3b1513c8))

## [2.116.0](https://github.com/entrostat/road-protect-fleet/compare/v2.115.0...v2.116.0) (2021-02-14)


### Features

* **babel:** Added the translation file to the project so that it can be opened anywhere ([8bdda8a](https://github.com/entrostat/road-protect-fleet/commit/8bdda8a02a769078989f46c6bc92ac9e82bd95ae))


### Bug Fixes

* **translations:** Replaced all places that the approved translation shows up ([1a2bd16](https://github.com/entrostat/road-protect-fleet/commit/1a2bd1648893d5c94611399f4cd680b03fd827d2))

## [2.115.0](https://github.com/entrostat/road-protect-fleet/compare/v2.114.0...v2.115.0) (2021-02-14)


### Features

* **queue-workers:** Added the queue workers to the system ([64bacc0](https://github.com/entrostat/road-protect-fleet/commit/64bacc09f15e5e212f1354a5ce41b71ee618d6ca))


### Bug Fixes

* **translations:** Changed the approved for payment date translation ([4933d8f](https://github.com/entrostat/road-protect-fleet/commit/4933d8fa0db19c5a9320326f83a0b8f871d32f21))

## [2.114.0](https://github.com/entrostat/road-protect-fleet/compare/v2.113.3...v2.114.0) (2021-02-12)


### Features

* **tests:** Use entro-jest-flags to filter tests ([1ecc922](https://github.com/entrostat/road-protect-fleet/commit/1ecc92262983f80ad6942e154c3cb05132fcc6f4))

### [2.113.3](https://github.com/entrostat/road-protect-fleet/compare/v2.113.2...v2.113.3) (2021-02-12)


### Bug Fixes

* **integrations:** Don't save document to the integration logger ([7f98828](https://github.com/entrostat/road-protect-fleet/commit/7f9882818231bdd831763498066cc5b8a2e6d845))

### [2.113.2](https://github.com/entrostat/road-protect-fleet/compare/v2.113.1...v2.113.2) (2021-02-12)


### Bug Fixes

* **redirections:** Removed the update of the BRN to the new one when we run redirections ([280bff8](https://github.com/entrostat/road-protect-fleet/commit/280bff80e2a4395c5193dfd0f908f8a9b9275916))

### [2.113.1](https://github.com/entrostat/road-protect-fleet/compare/v2.113.0...v2.113.1) (2021-02-12)


### Bug Fixes

* **redirections:** Don't set the completion date if the redirection is not complete ([2cf59e0](https://github.com/entrostat/road-protect-fleet/commit/2cf59e09e099fbf24a3d6fca5cbb115fa38832df))

## [2.113.0](https://github.com/entrostat/road-protect-fleet/compare/v2.112.1...v2.113.0) (2021-02-12)


### Features

* **redirections:** Changed the logic to look at the identifier and infringement brn only ([493d0b7](https://github.com/entrostat/road-protect-fleet/commit/493d0b7d84634979c20e93dd37c537691dbfcc79))


### Bug Fixes

* **redirections:** Update the BRN on the infringement if the redirection is completed ([cdc9c77](https://github.com/entrostat/road-protect-fleet/commit/cdc9c7792802d2db5e9113dc53308f41e692c1bb))

### [2.112.1](https://github.com/entrostat/road-protect-fleet/compare/v2.112.0...v2.112.1) (2021-02-11)


### Bug Fixes

* **devops:** Increased the memory usage allocated for the backend ([f89a9d1](https://github.com/entrostat/road-protect-fleet/commit/f89a9d15a4b5703e9a6382897f3673b8f9f9a5ad))

## [2.112.0](https://github.com/entrostat/road-protect-fleet/compare/v2.111.0...v2.112.0) (2021-02-11)


### Features

* **ui:** Added the additional date filters for infringements ([80f7951](https://github.com/entrostat/road-protect-fleet/commit/80f7951099eb9ea15c9954cdcd831680e0d88535)), closes [#533](https://github.com/entrostat/road-protect-fleet/issues/533)

## [2.111.0](https://github.com/entrostat/road-protect-fleet/compare/v2.110.0...v2.111.0) (2021-02-11)


### Features

* **graphing:** Show user when there is no aggregaed data to display ([ad2ba7b](https://github.com/entrostat/road-protect-fleet/commit/ad2ba7b508a27d274e154c04c577cd190b63a479))


### Bug Fixes

* **advanced-table:** Changed how the filter parameters were stored in the selectedFilters object to match how they were being stored when added through the form (flattened) so that they are cleared properly even after refreshing the page ([ef8c371](https://github.com/entrostat/road-protect-fleet/commit/ef8c3713986aa27e596a9d02dc2460188fd48d6b))
* **graphing:** Calculate months in selected date range in single function which ensures UTC for all visualisations ([da2e007](https://github.com/entrostat/road-protect-fleet/commit/da2e0076c6e2b8b669c9184eebd2567cf6730e0b))

## [2.110.0](https://github.com/entrostat/road-protect-fleet/compare/v2.109.2...v2.110.0) (2021-02-11)


### Features

* **ocr-updatelease:** Run new lease documents through OCR before uploading Merge branch 'feature/RPF-350/ocr-update-lease' into develop ([7a38b9d](https://github.com/entrostat/road-protect-fleet/commit/7a38b9d37da2bdf55a74fb2ec379d7710a023be3))


### Bug Fixes

* **redirections:** Check the set redirection identifier on the NEW infringements ([6e07fa4](https://github.com/entrostat/road-protect-fleet/commit/6e07fa424913c6eaa8b84e9a0356bafd35e8270b))

### [2.109.2](https://github.com/entrostat/road-protect-fleet/compare/v2.109.1...v2.109.2) (2021-02-10)


### Bug Fixes

* **tests:** Updated the tests locally that allow us to filter by file name (removed the git commit side) ([04c4d63](https://github.com/entrostat/road-protect-fleet/commit/04c4d630652ab76a1fc3ba10a0ce1aeb1dcb0015))

### [2.109.1](https://github.com/entrostat/road-protect-fleet/compare/v2.109.0...v2.109.1) (2021-02-10)


### Bug Fixes

* **redirections:** Don't ignore the internal statuses ([eb73e59](https://github.com/entrostat/road-protect-fleet/commit/eb73e5993a521dadb0f96c66b717ba225cf52977))

## [2.109.0](https://github.com/entrostat/road-protect-fleet/compare/v2.108.0...v2.109.0) (2021-02-10)


### Features

* **redirections:** Set the redirection identifier and other details at the end of an update and use the logic around redirections to determine if the status should change to a redirection status ([2b1d91d](https://github.com/entrostat/road-protect-fleet/commit/2b1d91d4e236b56ca4296eb870c2ab8aaeb8e779)), closes [#527](https://github.com/entrostat/road-protect-fleet/issues/527)

## [2.108.0](https://github.com/entrostat/road-protect-fleet/compare/v2.107.7...v2.108.0) (2021-02-10)


### Features

* **graphing-by-issuer:** Show comparison to previous year in the aggregate table ([25c52c0](https://github.com/entrostat/road-protect-fleet/commit/25c52c0d1a127087e435b78a032e9ea815d0b0ae))

### [2.107.7](https://github.com/entrostat/road-protect-fleet/compare/v2.107.6...v2.107.7) (2021-02-10)


### Bug Fixes

* **atg:** Type the inputs before running validation ([7d2a739](https://github.com/entrostat/road-protect-fleet/commit/7d2a73955e34a9f4411558f087bbd0606e96ca28))

### [2.107.6](https://github.com/entrostat/road-protect-fleet/compare/v2.107.5...v2.107.6) (2021-02-10)


### Bug Fixes

* **devops:** Moved migrations above frontend build ([c68067e](https://github.com/entrostat/road-protect-fleet/commit/c68067e8a605cd6804218c99c23dfdb253912308))

### [2.107.5](https://github.com/entrostat/road-protect-fleet/compare/v2.107.4...v2.107.5) (2021-02-10)


### Bug Fixes

* **devops:** Run migrations after the backend build ([baae3a1](https://github.com/entrostat/road-protect-fleet/commit/baae3a1879b0685056e58b6f05f40e8dc15b3c3e))

### [2.107.4](https://github.com/entrostat/road-protect-fleet/compare/v2.107.3...v2.107.4) (2021-02-10)


### Bug Fixes

* **devops:** Always run migrations ([5d9224a](https://github.com/entrostat/road-protect-fleet/commit/5d9224abbf7ad378a07817d10567e94e4716baba))

### [2.107.3](https://github.com/entrostat/road-protect-fleet/compare/v2.107.2...v2.107.3) (2021-02-10)


### Bug Fixes

* **document-api:** Changed port to 8080 ([6fccdee](https://github.com/entrostat/road-protect-fleet/commit/6fccdeec67f16a0f414a9c007854d0a0241ab3cd))

### [2.107.2](https://github.com/entrostat/road-protect-fleet/compare/v2.107.1...v2.107.2) (2021-02-10)

### [2.107.1](https://github.com/entrostat/road-protect-fleet/compare/v2.107.0...v2.107.1) (2021-02-10)

## [2.107.0](https://github.com/entrostat/road-protect-fleet/compare/v2.106.3...v2.107.0) (2021-02-09)


### Features

* **redirections:** Added the ability to specify redirection reference ([9ef3ae9](https://github.com/entrostat/road-protect-fleet/commit/9ef3ae9de7d41296b7ecbb1bbc20beaeea9351ef)), closes [#524](https://github.com/entrostat/road-protect-fleet/issues/524)


### Bug Fixes

* **redirections:** Set the redirection target id if it exists ([8942f78](https://github.com/entrostat/road-protect-fleet/commit/8942f7846b6377e4cc5d52d9f0ec1e6b1d41d8b4))

### [2.106.3](https://github.com/entrostat/road-protect-fleet/compare/v2.106.2...v2.106.3) (2021-02-09)


### Bug Fixes

* **rate-limit:** Log the error on rate limit ([cd38c8a](https://github.com/entrostat/road-protect-fleet/commit/cd38c8ae1f25d4172809ad625836f7f66e0de72d))

### [2.106.2](https://github.com/entrostat/road-protect-fleet/compare/v2.106.1...v2.106.2) (2021-02-09)


### Bug Fixes

* **rate-limit:** Don't block if the rate limit fails ([e941192](https://github.com/entrostat/road-protect-fleet/commit/e94119261acf0fbb83fd070d6fea858ccf7e8ecd))

### [2.106.1](https://github.com/entrostat/road-protect-fleet/compare/v2.106.0...v2.106.1) (2021-02-09)


### Bug Fixes

* **redirections:** Moved the redirection identifier filters to the simple view ([771623f](https://github.com/entrostat/road-protect-fleet/commit/771623f91ecc20b71730a4951049f80206840542))

## [2.106.0](https://github.com/entrostat/road-protect-fleet/compare/v2.105.3...v2.106.0) (2021-02-09)


### Features

* **redirections:** Added additional filters for the redirection identifier (exact match and exists) ([87dccf2](https://github.com/entrostat/road-protect-fleet/commit/87dccf295f44ffe3ab1b8eee8373260f76aea874))

### [2.105.3](https://github.com/entrostat/road-protect-fleet/compare/v2.105.2...v2.105.3) (2021-02-09)


### Bug Fixes

* **redirections:** Allow for the raw redirection identifier to be null ([6b1ff76](https://github.com/entrostat/road-protect-fleet/commit/6b1ff769e1f377e3e780e3a0b168ca321910a397))
* **redirections:** Override the raw redirection identifier when it's specified ([00b99b0](https://github.com/entrostat/road-protect-fleet/commit/00b99b0f976a508edf5b9608ff50b5fccd1981ed))

### [2.105.2](https://github.com/entrostat/road-protect-fleet/compare/v2.105.1...v2.105.2) (2021-02-09)


### Bug Fixes

* **build:** Export the rate limit interface ([e9d8566](https://github.com/entrostat/road-protect-fleet/commit/e9d8566e81a03c7dd56b7e1a820312885549c083))

### [2.105.1](https://github.com/entrostat/road-protect-fleet/compare/v2.105.0...v2.105.1) (2021-02-09)


### Bug Fixes

* **rate-limit:** Set the rates high for now ([63c10a1](https://github.com/entrostat/road-protect-fleet/commit/63c10a1d8a3947b7ab05be70e2011f904618f193))

## [2.105.0](https://github.com/entrostat/road-protect-fleet/compare/v2.104.4...v2.105.0) (2021-02-09)


### Features

* **rate-limiting:** Added rate limiting on an action level to prevent users from overusing certain actions ([918a7e0](https://github.com/entrostat/road-protect-fleet/commit/918a7e057f94846649f10c6b6e444c2207c76a3d)), closes [#520](https://github.com/entrostat/road-protect-fleet/issues/520)


### Bug Fixes

* **redirections:** Allow us to set the redirection identifier even on in redirection process ([173663f](https://github.com/entrostat/road-protect-fleet/commit/173663f32ca74cad0264ec8cdd897be905845c08))

### [2.104.4](https://github.com/entrostat/road-protect-fleet/compare/v2.104.3...v2.104.4) (2021-02-08)


### Bug Fixes

* **redirections:** Don't allow overwriting the In Redirection Process status ([9428320](https://github.com/entrostat/road-protect-fleet/commit/9428320e60da55c1902d13eca860f6d25472733f)), closes [#522](https://github.com/entrostat/road-protect-fleet/issues/522)

### [2.104.3](https://github.com/entrostat/road-protect-fleet/compare/v2.104.2...v2.104.3) (2021-02-08)


### Bug Fixes

* **spreadsheet:** Added the owner and user name and brn ([4c53dfc](https://github.com/entrostat/road-protect-fleet/commit/4c53dfc891394577da8e2e2be870353dd4465851))

### [2.104.2](https://github.com/entrostat/road-protect-fleet/compare/v2.104.1...v2.104.2) (2021-02-08)


### Bug Fixes

* **devops:** Removed request-ip ([decfdc3](https://github.com/entrostat/road-protect-fleet/commit/decfdc3b6a98e0fec391ed7237183bb9067a39c4))
* **spreadsheet:** Convert user identifier to user name in contract export ([e21aadb](https://github.com/entrostat/road-protect-fleet/commit/e21aadbcf36123310651c5290b7ce26293157c58))

### [2.104.1](https://github.com/entrostat/road-protect-fleet/compare/v2.104.0...v2.104.1) (2021-02-08)


### Bug Fixes

* **ui:** Allow for account id of null on the nomination view ([d111d13](https://github.com/entrostat/road-protect-fleet/commit/d111d13c408096294be4bc4c0dab844618d23dd8))

## [2.104.0](https://github.com/entrostat/road-protect-fleet/compare/v2.103.1...v2.104.0) (2021-02-08)


### Features

* **graphing:** Auto populate graphing pages  ([1926b14](https://github.com/entrostat/road-protect-fleet/commit/1926b14abbc0946e4641326894f231656f3a9213))


### Bug Fixes

* **graphing-by-status:** Fix bug that was causing line graph to not populate due to calculated totals ([284515a](https://github.com/entrostat/road-protect-fleet/commit/284515a08654e7ba472c644f262586b80fffb35e))

### [2.103.1](https://github.com/entrostat/road-protect-fleet/compare/v2.103.0...v2.103.1) (2021-02-07)

## [2.103.0](https://github.com/entrostat/road-protect-fleet/compare/v2.102.0...v2.103.0) (2021-02-07)


### Features

* **deploy:** Added scripts for running migrations and deployments using entro-ci ([6349eca](https://github.com/entrostat/road-protect-fleet/commit/6349ecaa17a7a942ac3271a77fd1730bf63bf4a7))
* **graphing-by-issuer:** Add tooltip for totals in graphing by issuer table ([fd2e649](https://github.com/entrostat/road-protect-fleet/commit/fd2e649c0540477a7cfd236fac69bf85cea08e67))


### Bug Fixes

* **graphing:** Disable tooltips to fix error occuring when hovering over the graphs ([73c444b](https://github.com/entrostat/road-protect-fleet/commit/73c444b8accc7f8847a9cca3fc303a1fe579b508))

## [2.102.0](https://github.com/entrostat/road-protect-fleet/compare/v2.101.2...v2.102.0) (2021-02-04)


### Features

* **git-secret:** Added git secret to the repository ([494348d](https://github.com/entrostat/road-protect-fleet/commit/494348da513e1bbf711a7245992d78ea87b38b96))

### [2.101.2](https://github.com/entrostat/road-protect-fleet/compare/v2.101.1...v2.101.2) (2021-02-04)


### Bug Fixes

* **line-graphs:** Months to graph calculation in line graphs ([c6403c1](https://github.com/entrostat/road-protect-fleet/commit/c6403c14d5911bc7652d714f6d18b6578d2b9dbe))

### [2.101.1](https://github.com/entrostat/road-protect-fleet/compare/v2.101.0...v2.101.1) (2021-02-04)


### Bug Fixes

* **graphing-by-issuer:** Fix graphing problem ([f51e8b7](https://github.com/entrostat/road-protect-fleet/commit/f51e8b7c49d3a0245f2c7680a44d011363d304a7))

## [2.101.0](https://github.com/entrostat/road-protect-fleet/compare/v2.100.0...v2.101.0) (2021-02-04)


### Features

* **graphing-by-issuer:** Show details of breakdown of infringements by status on clicking entries in the graphing by issuer table   ([741b537](https://github.com/entrostat/road-protect-fleet/commit/741b53712332d904ab0a616925f0f207f826a819))
* **infringement-table:** Refined the radio buttons for the infringement table views Merge branch 'feature/RPF-347/new-user-infringement-table-filter' into develop ([26a2f13](https://github.com/entrostat/road-protect-fleet/commit/26a2f13ddd012fa868f6941c6645dbea7a54c8c3))
* **infringement-view:** Added the account associated with the BRN to the infringement view Merge branch 'feature/RPF-348/add-account-name-to-infringement-view' into develop ([2e7fc0a](https://github.com/entrostat/road-protect-fleet/commit/2e7fc0a84f0728284972b85e2d20fd09e7d51c7c))


### Bug Fixes

* **build:** Update the apt sources before installing pdftk ([ac73a8a](https://github.com/entrostat/road-protect-fleet/commit/ac73a8a277d897dbff6bd08a1bbb0e090f78fcb9))
* **graphing-by-issuer:** Ensure x-axis is in the correct order and months with no infringements are plotted as zero in the line graph ([ccaa5c4](https://github.com/entrostat/road-protect-fleet/commit/ccaa5c434904ced9f40c21ac157dec543b276eca))

## [2.100.0](https://github.com/entrostat/road-protect-fleet/compare/v2.99.3...v2.100.0) (2021-02-03)


### Features

* **acount-relations:** Added all infringements with no BRN to the relations report email Merge branch 'feature/RPF-344/add-to-relation-emails' into develop ([15aacc7](https://github.com/entrostat/road-protect-fleet/commit/15aacc70723a4bb82bab784c41a0b24e39b82ce9))
* **redirections:** Only override the raw redirection identifier when it's an internal action ([7b7d63f](https://github.com/entrostat/road-protect-fleet/commit/7b7d63fb3e6b5c2f70eedabac052a474f6763b75)), closes [#507](https://github.com/entrostat/road-protect-fleet/issues/507)

### [2.99.3](https://github.com/entrostat/road-protect-fleet/compare/v2.99.2...v2.99.3) (2021-02-03)

### [2.99.2](https://github.com/entrostat/road-protect-fleet/compare/v2.99.1...v2.99.2) (2021-02-03)


### Bug Fixes

* **validators:** Added the future offence date validator ([bc02d3a](https://github.com/entrostat/road-protect-fleet/commit/bc02d3a114e531ec192cd96bf1e0e4f34d5701d3))

### [2.99.1](https://github.com/entrostat/road-protect-fleet/compare/v2.99.0...v2.99.1) (2021-02-03)


### Bug Fixes

* **timezones:** Added the new ISO pattern from ATG as an accepted format ([b32406c](https://github.com/entrostat/road-protect-fleet/commit/b32406c2eac72585e9f3eb1dd698c54d25168c17))

## [2.99.0](https://github.com/entrostat/road-protect-fleet/compare/v2.98.2...v2.99.0) (2021-02-03)


### Features

* **UI changes:** Spacing on view contract page, tags are removed to either look linkable or unlinkable depending on their behaviour, sidebar layout was changed ([498cf99](https://github.com/entrostat/road-protect-fleet/commit/498cf99cc294f6295f049f7802a32bf40587704f))

### [2.98.2](https://github.com/entrostat/road-protect-fleet/compare/v2.98.1...v2.98.2) (2021-02-02)

### [2.98.1](https://github.com/entrostat/road-protect-fleet/compare/v2.98.0...v2.98.1) (2021-02-02)


### Bug Fixes

* **redirections:** Update the brn from issuer when the redirection is completed manually ([ed6e556](https://github.com/entrostat/road-protect-fleet/commit/ed6e5566a3a30d525a69d2d1762cf84b9a31f553))

## [2.98.0](https://github.com/entrostat/road-protect-fleet/compare/v2.97.2...v2.98.0) (2021-02-02)


### Features

* **graphing-by-issuer:** Duplicate the general table into the graphing by issuer table component for further customisation.  ([67b816a](https://github.com/entrostat/road-protect-fleet/commit/67b816ab4ffe420db5715873fdec2eda144751fc))
* **infringement-table:** Added BRN and vehicle owner to the infringement table Merge branch 'feature/RPF-341/add-brn-to-infringement-table' into develop ([f76a92a](https://github.com/entrostat/road-protect-fleet/commit/f76a92a9f49dd31700b9dcd4230e68943652ce00))


### Bug Fixes

* **graphing-by-issuer:** Styling in Hebrew of date range as well as the search bar ([045e9f4](https://github.com/entrostat/road-protect-fleet/commit/045e9f4dd38ee2284097619970e8c97d12e7c130))
* **infringement-graphing:** Fix bug that added empty 'Other' series after data manipulation when graphing by issuer and status ([09bcfec](https://github.com/entrostat/road-protect-fleet/commit/09bcfec4dc5a8ac471e757c48fef4e4908d2c797))

### [2.97.2](https://github.com/entrostat/road-protect-fleet/compare/v2.97.1...v2.97.2) (2021-02-01)


### Bug Fixes

* **redirections:** Check for the expected test in the confirmation number or message ([b2c193b](https://github.com/entrostat/road-protect-fleet/commit/b2c193b459778d4e43eb62d16e666f77d1570f61))
* **redirections:** The split inverts the output because the string is right to left ([3b199a4](https://github.com/entrostat/road-protect-fleet/commit/3b199a498ba1bc38a4f3a5d89b2381c99e6e4be3))

### [2.97.1](https://github.com/entrostat/road-protect-fleet/compare/v2.97.0...v2.97.1) (2021-02-01)


### Bug Fixes

* **redirections:** Parse the Telaviv response if it is returned as a string ([ea28d1b](https://github.com/entrostat/road-protect-fleet/commit/ea28d1b3a881afda74c49db90c64a72c99770e00))

## [2.97.0](https://github.com/entrostat/road-protect-fleet/compare/v2.96.0...v2.97.0) (2021-02-01)


### Features

* **crawlers:** Updated crawler submodule ([387f5e8](https://github.com/entrostat/road-protect-fleet/commit/387f5e87fd4bc65acfab56672e34222596959a45))
* **graphiing-by-issuer:** Aggregate infringements by issuer data ([ebfcc12](https://github.com/entrostat/road-protect-fleet/commit/ebfcc12b8d75e065838fe174aa964a43940c82a9))
* **graphing-by-issuer:** Add table, line graph and bar chart for aggregated by issuer data. Add logic to only display the top 10 Issuers in the bar chart and line graphs ([c74fc19](https://github.com/entrostat/road-protect-fleet/commit/c74fc1989dd13a8e29e87f811ed2517c5f2ed650))

## [2.96.0](https://github.com/entrostat/road-protect-fleet/compare/v2.95.1...v2.96.0) (2021-02-01)


### Features

* **client-ip:** Extract the client IP from the request headers ([a0ecbd6](https://github.com/entrostat/road-protect-fleet/commit/a0ecbd6aa319d2fb0345e812bff7ea8e767d23f7)), closes [#493](https://github.com/entrostat/road-protect-fleet/issues/493)
* **crawlers:** Updated crawler functionality for Telaviv redirections ([688b9be](https://github.com/entrostat/road-protect-fleet/commit/688b9beb168c1ac40cf234e0178843dd94d9ce06))

### [2.95.1](https://github.com/entrostat/road-protect-fleet/compare/v2.95.0...v2.95.1) (2021-01-30)


### Bug Fixes

* **ui:** Made the vehicle type visible on the simple view ([0897f35](https://github.com/entrostat/road-protect-fleet/commit/0897f355f0ee03dd281375794da0afe2cb13b8b1))

## [2.95.0](https://github.com/entrostat/road-protect-fleet/compare/v2.94.5...v2.95.0) (2021-01-30)


### Features

* **vehicle-type:** Added the vehicle type to vehicles and allow filtering on the infringement page by this type ([3d71356](https://github.com/entrostat/road-protect-fleet/commit/3d7135677542ece9d66444a128e3b9717dc49a91)), closes [#492](https://github.com/entrostat/road-protect-fleet/issues/492)


### Bug Fixes

* **tests:** Ensure that the test database does not link to the dev database ([6d1423a](https://github.com/entrostat/road-protect-fleet/commit/6d1423a0397bd8aa4576ce73779cb37444365a21))

### [2.94.5](https://github.com/entrostat/road-protect-fleet/compare/v2.94.4...v2.94.5) (2021-01-29)


### Bug Fixes

* **scheduler:** Run the bulk single infringements on Sunday at 9am ([8ec3dd6](https://github.com/entrostat/road-protect-fleet/commit/8ec3dd62512d700312b87c331f443bc7a15a721f))

### [2.94.4](https://github.com/entrostat/road-protect-fleet/compare/v2.94.3...v2.94.4) (2021-01-29)


### Bug Fixes

* **devops:** Backend build has to run ([ea0b3a1](https://github.com/entrostat/road-protect-fleet/commit/ea0b3a1234fbaee9055cc09370cde12c1cc5cab1))

### [2.94.3](https://github.com/entrostat/road-protect-fleet/compare/v2.94.2...v2.94.3) (2021-01-29)


### Bug Fixes

* **migration:** Remove integration request log change from redirection type enum ([08cb214](https://github.com/entrostat/road-protect-fleet/commit/08cb21497cb20720f7cf9876de47f46dd325be18))

### [2.94.2](https://github.com/entrostat/road-protect-fleet/compare/v2.94.0...v2.94.2) (2021-01-29)

### [2.94.1](https://github.com/entrostat/road-protect-fleet/compare/v2.94.0...v2.94.1) (2021-01-29)

## [2.94.0](https://github.com/entrostat/road-protect-fleet/compare/v2.93.0...v2.94.0) (2021-01-29)


### Features

* **crawler-redirections:** Added Telaviv redirection flow via crawler ([51b8851](https://github.com/entrostat/road-protect-fleet/commit/51b8851ea92bc353a0ea7a342d6ab008de580bd8)), closes [#489](https://github.com/entrostat/road-protect-fleet/issues/489)
* **crawlers:** Refactored automation and manual redirection processes into their own services ([8d24a71](https://github.com/entrostat/road-protect-fleet/commit/8d24a715d3177f1aa29e4bea211ae9ac22a33bc1)), closes [#476](https://github.com/entrostat/road-protect-fleet/issues/476)
* **devops:** Added persistent volume for crawler api temp folder ([1b85194](https://github.com/entrostat/road-protect-fleet/commit/1b8519412ab6baf29f921e59068951fe8bd53abe)), closes [#491](https://github.com/entrostat/road-protect-fleet/issues/491)

## [2.93.0](https://github.com/entrostat/road-protect-fleet/compare/v2.92.0...v2.93.0) (2021-01-29)


### Features

* **crawlers:** Updated crawler submodule ([c907700](https://github.com/entrostat/road-protect-fleet/commit/c907700426063ee0b6492b7377c98b652aacb584))

## [2.92.0](https://github.com/entrostat/road-protect-fleet/compare/v2.91.0...v2.92.0) (2021-01-28)


### Features

* **status-immutability:** Ensure that the statuses are immutable ([a93cc54](https://github.com/entrostat/road-protect-fleet/commit/a93cc54b1f12c65e8a15802fd221ee5274139ab2)), closes [#487](https://github.com/entrostat/road-protect-fleet/issues/487)

## [2.91.0](https://github.com/entrostat/road-protect-fleet/compare/v2.90.0...v2.91.0) (2021-01-28)


### Features

* **crawlers:** Added shohar crawler and verifications ([23ee117](https://github.com/entrostat/road-protect-fleet/commit/23ee1172f7299df00bdafbbc95ffcc0c7d235bab)), closes [#448](https://github.com/entrostat/road-protect-fleet/issues/448)
* **crawlers:** Updated crawler submodule ([27507d6](https://github.com/entrostat/road-protect-fleet/commit/27507d664324d8602426444a27266dd7b0db06ab))
* **issuer:** Update verification provider and code on issuer ([4d26731](https://github.com/entrostat/road-protect-fleet/commit/4d267318ea2d84c34b32cbc7f7773de07812ddf6)), closes [#452](https://github.com/entrostat/road-protect-fleet/issues/452)
* **ocr:** Cleaned up ocr deployment ([0027f14](https://github.com/entrostat/road-protect-fleet/commit/0027f1404aa65066ef66b03b195e872cc56cd3a8)), closes [#464](https://github.com/entrostat/road-protect-fleet/issues/464)
* **ocr:** Implemented ocr microservice ([eeae577](https://github.com/entrostat/road-protect-fleet/commit/eeae577d0f10ec43e5d72eacffd2de74c565142b)), closes [#463](https://github.com/entrostat/road-protect-fleet/issues/463)


### Bug Fixes

* **crawlers:** Add shohar to provider list ([c968261](https://github.com/entrostat/road-protect-fleet/commit/c968261822630a76d703bfc1d50040170d41d372)), closes [#453](https://github.com/entrostat/road-protect-fleet/issues/453)
* **infringement:** Add logs for outstanding status transition ([69ac7f3](https://github.com/entrostat/road-protect-fleet/commit/69ac7f38f99dcac57d46010cf08f1d961a745bab)), closes [#455](https://github.com/entrostat/road-protect-fleet/issues/455)
* **infringement-log:** Don't default the data to null ([67fc227](https://github.com/entrostat/road-protect-fleet/commit/67fc227de2d06381b4437c260fe530b4733778c1))

## [2.90.0](https://github.com/entrostat/road-protect-fleet/compare/v2.89.2...v2.90.0) (2021-01-27)


### Features

* **infringement-logs:** Moved infringement log writing to a queue to avoid transaction issues ([86d4359](https://github.com/entrostat/road-protect-fleet/commit/86d4359e89e30474b67c49c44011cc310ee8e3e0)), closes [#483](https://github.com/entrostat/road-protect-fleet/issues/483)

### [2.89.2](https://github.com/entrostat/road-protect-fleet/compare/v2.89.1...v2.89.2) (2021-01-27)


### Bug Fixes

* **api-docs:** Changed the contacts on the documentation ([ef7c5dd](https://github.com/entrostat/road-protect-fleet/commit/ef7c5ddf7c097bdecebea32f99f6d5a330e40dbe))

### [2.89.1](https://github.com/entrostat/road-protect-fleet/compare/v2.89.0...v2.89.1) (2021-01-27)


### Bug Fixes

* **api-docs:** Updated the Swagger documentation, removed the "fix" endpoints ([f159fff](https://github.com/entrostat/road-protect-fleet/commit/f159fff171fd27f8c53e744df7f0874a2b9558d3))
* **devops:** Modified testing to use file changes instead of the pattern match in local tests ([0bba1b4](https://github.com/entrostat/road-protect-fleet/commit/0bba1b480aefea285914d36dcd1040957c1e13ee))

## [2.89.0](https://github.com/entrostat/road-protect-fleet/compare/v2.88.0...v2.89.0) (2021-01-27)


### Features

* **crawlers:** Updated crawler submodule ([b007370](https://github.com/entrostat/road-protect-fleet/commit/b00737064a2831739107070aed7f2844df26a92a))

## [2.88.0](https://github.com/entrostat/road-protect-fleet/compare/v2.87.0...v2.88.0) (2021-01-26)


### Features

* **graphing-by-status:** Added default date range buttons and translations ([8fa3831](https://github.com/entrostat/road-protect-fleet/commit/8fa3831915757b1b752f579647a076181964244d))

## [2.87.0](https://github.com/entrostat/road-protect-fleet/compare/v2.86.0...v2.87.0) (2021-01-26)


### Features

* **crawlers:** Updated crawler submodule ([c25cf6a](https://github.com/entrostat/road-protect-fleet/commit/c25cf6ae7ead5a9a6409fe9837390679ea1c7e83))

## [2.86.0](https://github.com/entrostat/road-protect-fleet/compare/v2.85.1...v2.86.0) (2021-01-26)


### Features

* **graphing-by-status:** Add graphs and table for infringements by status ([3b6ad40](https://github.com/entrostat/road-protect-fleet/commit/3b6ad40d327b624eea2485e4f639be1b90d76caa))
* **graphing-by-status:** Show count of infringements on the table as well as the formatted sum of their total amounts ([c6157aa](https://github.com/entrostat/road-protect-fleet/commit/c6157aa26a5443a4c979a78ff17d3af880ede870))


### Bug Fixes

* **graphing-by-status:** Fix Hebrew x-axis ticks positioning to be under the graph ([034cf61](https://github.com/entrostat/road-protect-fleet/commit/034cf613b1fb23f2d8bfe125fc47f085dae839a0))

### [2.85.1](https://github.com/entrostat/road-protect-fleet/compare/v2.85.0...v2.85.1) (2021-01-25)


### Bug Fixes

* **frontend-runtime:** Check that the infringement is not undefined before retrieving the payment ([e453370](https://github.com/entrostat/road-protect-fleet/commit/e45337061e3d5f2e567b3da41a45fba2c90cc0f6))

## [2.85.0](https://github.com/entrostat/road-protect-fleet/compare/v2.84.1...v2.85.0) (2021-01-25)


### Features

* **security:** Added the Google Recaptcha to the frontend and limit the number of login attempts ([1a0bca1](https://github.com/entrostat/road-protect-fleet/commit/1a0bca18b84fb6f206ac1ef52b98ded966ead492)), closes [#475](https://github.com/entrostat/road-protect-fleet/issues/475)


### Bug Fixes

* **request:** Don't specify the method in the got call, rather call it as a function ([bc00e64](https://github.com/entrostat/road-protect-fleet/commit/bc00e64ef6e05de709d2cf39c32ac454b3160b4d))
* **request:** Don't use got for requests ([5f41085](https://github.com/entrostat/road-protect-fleet/commit/5f410850548638bb405fed153f84d44ee622fe11))

### [2.84.1](https://github.com/entrostat/road-protect-fleet/compare/v2.84.0...v2.84.1) (2021-01-25)

## [2.84.0](https://github.com/entrostat/road-protect-fleet/compare/v2.83.4...v2.84.0) (2021-01-25)


### Features

* **crawlers:** Updated crawler submodule ([055b726](https://github.com/entrostat/road-protect-fleet/commit/055b7268c84fc0db967c5623b9b78c7eb4952ecc))

### [2.83.4](https://github.com/entrostat/road-protect-fleet/compare/v2.83.3...v2.83.4) (2021-01-24)


### Bug Fixes

* **datetime:** Added the patter yyyy/mm/dd hh:mm ([75217c4](https://github.com/entrostat/road-protect-fleet/commit/75217c4cf27a680cd53d268fc85f3abae35b6fca))

### [2.83.3](https://github.com/entrostat/road-protect-fleet/compare/v2.83.2...v2.83.3) (2021-01-22)


### Bug Fixes

* **mailer-process:** Added Ari back to the BCC mail ([30a1bae](https://github.com/entrostat/road-protect-fleet/commit/30a1bae393ba91d4b3019013a79b875a23df2afd))

### [2.83.2](https://github.com/entrostat/road-protect-fleet/compare/v2.83.1...v2.83.2) (2021-01-22)


### Bug Fixes

* **mailer-process:** Set the total amount to have 2 decimal places ([790f5cc](https://github.com/entrostat/road-protect-fleet/commit/790f5cc820a8daabe254f0e5163c9e1e4cc12383))

### [2.83.1](https://github.com/entrostat/road-protect-fleet/compare/v2.83.0...v2.83.1) (2021-01-22)


### Bug Fixes

* **mailer-process:** Filter any infringements that were not verified recently ([6c33211](https://github.com/entrostat/road-protect-fleet/commit/6c33211fc99d8940f1211b56d4a846f504aeb63a))

## [2.83.0](https://github.com/entrostat/road-protect-fleet/compare/v2.82.2...v2.83.0) (2021-01-22)


### Features

* **crawlers:** Add the notice number back into infringements from the crawlers ([a952a76](https://github.com/entrostat/road-protect-fleet/commit/a952a76dacf0169b4862323a706d9b69ce07e9a0)), closes [#472](https://github.com/entrostat/road-protect-fleet/issues/472)

### [2.82.2](https://github.com/entrostat/road-protect-fleet/compare/v2.82.1...v2.82.2) (2021-01-21)


### Bug Fixes

* **redirections:** Allow infringements to go from Redirection Completed to Acknowledged ([7bbaef7](https://github.com/entrostat/road-protect-fleet/commit/7bbaef7970c03ab441c137b8125257e20aa01156))

### [2.82.1](https://github.com/entrostat/road-protect-fleet/compare/v2.82.0...v2.82.1) (2021-01-21)

## [2.82.0](https://github.com/entrostat/road-protect-fleet/compare/v2.81.4...v2.82.0) (2021-01-21)


### Features

* **crawlers:** Updated crawler submodule ([55e8b39](https://github.com/entrostat/road-protect-fleet/commit/55e8b39e8921f6d5ef9ddc2ccc9310cd52858b6b))

### [2.81.4](https://github.com/entrostat/road-protect-fleet/compare/v2.81.3...v2.81.4) (2021-01-21)


### Bug Fixes

* **mailer:** Added the decimals to the amounts ([473426f](https://github.com/entrostat/road-protect-fleet/commit/473426fbfd3e57787d9de0bf41b8ab32db4cef23))
* **mailer-process:** Removed Ari from the mailer process for now ([d080222](https://github.com/entrostat/road-protect-fleet/commit/d08022287748c817bfbfc88fc5ca5a7124be7692))
* **mailers:** Updated the Hebrew in the mailer ([b043ab7](https://github.com/entrostat/road-protect-fleet/commit/b043ab78ee3b47f4fbe9ddcdd1e8f4d7bf990eed))

### [2.81.3](https://github.com/entrostat/road-protect-fleet/compare/v2.81.2...v2.81.3) (2021-01-21)


### Bug Fixes

* **account-relation:** Don't try to create Account Relation when one already exists with the same forward and reverse accounts ([b8686bc](https://github.com/entrostat/road-protect-fleet/commit/b8686bc1e6ca8f4edf7802539f999ef8d12fd8c7))

### [2.81.2](https://github.com/entrostat/road-protect-fleet/compare/v2.81.1...v2.81.2) (2021-01-21)


### Bug Fixes

* **crawlers:** Removed all validation on crawler dtos ([7dc674a](https://github.com/entrostat/road-protect-fleet/commit/7dc674ac4678c3f71513288b9695de331c38c3e8)), closes [#470](https://github.com/entrostat/road-protect-fleet/issues/470)

### [2.81.1](https://github.com/entrostat/road-protect-fleet/compare/v2.81.0...v2.81.1) (2021-01-21)


### Bug Fixes

* **crawlers:** For telaviv, don't validate if fine status is paid ([e9a1152](https://github.com/entrostat/road-protect-fleet/commit/e9a1152a3491339492e1b95322adc13f80210006))

## [2.81.0](https://github.com/entrostat/road-protect-fleet/compare/v2.79.1...v2.81.0) (2021-01-20)


### Features

* **security:** Control the ability of users to change their type or the type of others ([d83c789](https://github.com/entrostat/road-protect-fleet/commit/d83c78905622c4f20210cf358100753f3091daa9)), closes [#462](https://github.com/entrostat/road-protect-fleet/issues/462)


### Bug Fixes

* **crawlers:** Updating validation on crawler dtos ([4a41106](https://github.com/entrostat/road-protect-fleet/commit/4a41106a531ab97f9946102b3b1f5d3cc54e56fe)), closes [#465](https://github.com/entrostat/road-protect-fleet/issues/465)
* **verifications:** Added query param to specify provider when verifying unpaid infringements in bulk ([c6bf6c7](https://github.com/entrostat/road-protect-fleet/commit/c6bf6c789ce68286374da851ec9f22fe216f0c84)), closes [#466](https://github.com/entrostat/road-protect-fleet/issues/466)

## [2.80.0](https://github.com/entrostat/road-protect-fleet/compare/v2.79.1...v2.80.0) (2021-01-20)


### Features

* **security:** Control the ability of users to change their type or the type of others ([d83c789](https://github.com/entrostat/road-protect-fleet/commit/d83c78905622c4f20210cf358100753f3091daa9)), closes [#462](https://github.com/entrostat/road-protect-fleet/issues/462)

### [2.79.1](https://github.com/entrostat/road-protect-fleet/compare/v2.79.0...v2.79.1) (2021-01-20)


### Bug Fixes

* **verifications:** Scheduler for unpaid verifications improved to try reduce load  ([838c0c0](https://github.com/entrostat/road-protect-fleet/commit/838c0c0c50d2e726534df286b8ae19b0515c289e)), closes [#461](https://github.com/entrostat/road-protect-fleet/issues/461)

## [2.79.0](https://github.com/entrostat/road-protect-fleet/compare/v2.78.14...v2.79.0) (2021-01-20)


### Features

* **verifications:** Turned on unpaid verifications scheduler ([7895ed9](https://github.com/entrostat/road-protect-fleet/commit/7895ed977d6af4fa36d0a9efc63d96975c310180)), closes [#460](https://github.com/entrostat/road-protect-fleet/issues/460)


### Bug Fixes

* **crawlers:** Action date is optional for jerusalem crawler ([549f18d](https://github.com/entrostat/road-protect-fleet/commit/549f18d8c3a4baf6dcc8fc2aac53aa1f3ad3c517))

### [2.78.14](https://github.com/entrostat/road-protect-fleet/compare/v2.78.13...v2.78.14) (2021-01-19)

### [2.78.13](https://github.com/entrostat/road-protect-fleet/compare/v2.78.12...v2.78.13) (2021-01-19)


### Bug Fixes

* **crawlers:** Update crawlers and added crawler scheduler enabled option to env ([7879f2f](https://github.com/entrostat/road-protect-fleet/commit/7879f2f359187f7ed749251b7744cf75eeef2df3)), closes [#458](https://github.com/entrostat/road-protect-fleet/issues/458)

### [2.78.12](https://github.com/entrostat/road-protect-fleet/compare/v2.78.11...v2.78.12) (2021-01-19)


### Bug Fixes

* **infringement-upsert:** Allow for the payment reference to be anything (string or number) ([3fea1e5](https://github.com/entrostat/road-protect-fleet/commit/3fea1e59b7055f8426a94eb7424d954103bfdf20))

### [2.78.11](https://github.com/entrostat/road-protect-fleet/compare/v2.78.10...v2.78.11) (2021-01-19)


### Bug Fixes

* **reporting:** Added Ari and Ore to the BCC ([d69bdd1](https://github.com/entrostat/road-protect-fleet/commit/d69bdd17baec5a2e9d17dc3980487fce8303f57f))

### [2.78.10](https://github.com/entrostat/road-protect-fleet/compare/v2.78.9...v2.78.10) (2021-01-19)


### Bug Fixes

* **reporting:** Output the total amount due without the Lodash getter ([0f6087d](https://github.com/entrostat/road-protect-fleet/commit/0f6087da5ade90a5699369e2daf41de8eef46f32))

### [2.78.9](https://github.com/entrostat/road-protect-fleet/compare/v2.78.8...v2.78.9) (2021-01-19)


### Bug Fixes

* **reporting:** Don't select the issuer and vehicle table twice ([9c91af4](https://github.com/entrostat/road-protect-fleet/commit/9c91af418f139ec4bb7923dbfe55956f7c12a51e))

### [2.78.8](https://github.com/entrostat/road-protect-fleet/compare/v2.78.7...v2.78.8) (2021-01-19)


### Bug Fixes

* **crawlers:** Improved validation on crawlers so that more verification cases pass ([c48c740](https://github.com/entrostat/road-protect-fleet/commit/c48c740a5ef0925d160cd2ecbbbffe93337a2aae)), closes [#457](https://github.com/entrostat/road-protect-fleet/issues/457)
* **mailer-process:** Modified the mailer process total calculations to use the original query values ([db6dae5](https://github.com/entrostat/road-protect-fleet/commit/db6dae5685d4a94278df960e09c2871c4fcddc3e)), closes [#456](https://github.com/entrostat/road-protect-fleet/issues/456)

### [2.78.7](https://github.com/entrostat/road-protect-fleet/compare/v2.78.6...v2.78.7) (2021-01-19)


### Bug Fixes

* **fix-date:** Return null if empty string ([3d2b762](https://github.com/entrostat/road-protect-fleet/commit/3d2b76248fe74ef4cc8db9a59aa02bb5dac54e23))
* **latest-payment-date:** If the date is empty then we don't override it ([dd3319e](https://github.com/entrostat/road-protect-fleet/commit/dd3319efb948db6591bb910366f05150b6348b60))

### [2.78.6](https://github.com/entrostat/road-protect-fleet/compare/v2.78.5...v2.78.6) (2021-01-19)


### Bug Fixes

* **contractual-nominations:** Fix the nominations that have the raw redirection identifier as the owner BRN (set it to the user if it's in redirection process) ([e0b0281](https://github.com/entrostat/road-protect-fleet/commit/e0b0281489a055f17ec18aa9bebea2183da17bd5))

### [2.78.5](https://github.com/entrostat/road-protect-fleet/compare/v2.78.4...v2.78.5) (2021-01-18)


### Bug Fixes

* **devops:** Must build backend ([60f4c9e](https://github.com/entrostat/road-protect-fleet/commit/60f4c9ebdc5d04fef323538ed265129fe536fe45))

### [2.78.4](https://github.com/entrostat/road-protect-fleet/compare/v2.78.3...v2.78.4) (2021-01-18)


### Bug Fixes

* **devops:** Changed formatting to rebuild docker image ([27b476a](https://github.com/entrostat/road-protect-fleet/commit/27b476a647ad5023b2c604e3418d3c55d2004c13))

### [2.78.3](https://github.com/entrostat/road-protect-fleet/compare/v2.78.2...v2.78.3) (2021-01-18)


### Bug Fixes

* **devops:** Don't build frontend ([11763bc](https://github.com/entrostat/road-protect-fleet/commit/11763bcbd5160119d588d90082b80fa25bad18ca))

### [2.78.2](https://github.com/entrostat/road-protect-fleet/compare/v2.78.1...v2.78.2) (2021-01-18)

### [2.78.1](https://github.com/entrostat/road-protect-fleet/compare/v2.78.0...v2.78.1) (2021-01-18)


### Bug Fixes

* **migrations:** Added the migration to update the redirection type enumerations that exist ([c1a31b4](https://github.com/entrostat/road-protect-fleet/commit/c1a31b449193a342979453c58ca6b1128a78a97c))

## [2.78.0](https://github.com/entrostat/road-protect-fleet/compare/v2.77.1...v2.78.0) (2021-01-18)


### Features

* **default-filtering:** Filter the infringements table by Due and Outstanding statuses by default ([84d5b97](https://github.com/entrostat/road-protect-fleet/commit/84d5b97337c79c4465ad5d8f24d381b3c937adae))
* **infringement-display:** Show contract associated with the infringement with infringement details ([6d48b88](https://github.com/entrostat/road-protect-fleet/commit/6d48b88c0f8b258e028f44299c801597657d9ef6))
* **test-emails:** Moved from Ethereal Email to Mailhog so that we don't need to rely on their service uptime ([020fe72](https://github.com/entrostat/road-protect-fleet/commit/020fe72ba79c9ba9caf3f1291505ba5c12848136)), closes [#454](https://github.com/entrostat/road-protect-fleet/issues/454)


### Bug Fixes

* **cli:** Don't build when starting docker compose each time ([ff615d9](https://github.com/entrostat/road-protect-fleet/commit/ff615d98f2a6c760b90e149f2ae6573236090631))
* **date-fixer:** Return null if we don't match a date ([705c382](https://github.com/entrostat/road-protect-fleet/commit/705c3829c5f3c60720464029211bf102d858d838))
* **emailer-process:** Removed the reason and reason code from the generated csv file ([89cec2c](https://github.com/entrostat/road-protect-fleet/commit/89cec2c3f02573721eb194764514eca047ae3e88))
* **emails:** Updated the staging email config with "incorrect" details. This is to avoid staging ever not selecting the dev settings and actually sending mails ([7f4d0f3](https://github.com/entrostat/road-protect-fleet/commit/7f4d0f3a8895e70a937092390682f9fbb8cef926))
* **login:** Make email address case insensitive for log in ([b3f49b2](https://github.com/entrostat/road-protect-fleet/commit/b3f49b2d8d190d03f291e9e04163f807dc636b5f))
* **reporting:** Switched the Hebrew text and account name around (RTL) ([6063f89](https://github.com/entrostat/road-protect-fleet/commit/6063f89c64ba6083ad5a5c2577281261bf49a8fa))

### [2.77.1](https://github.com/entrostat/road-protect-fleet/compare/v2.77.0...v2.77.1) (2021-01-18)


### Bug Fixes

* **ui:** Increase contrast on disables buttons and filter placeholders ([110f23d](https://github.com/entrostat/road-protect-fleet/commit/110f23d3bbf6d898ec1f327645d494d3a98275c8))

## [2.77.0](https://github.com/entrostat/road-protect-fleet/compare/v2.76.0...v2.77.0) (2021-01-16)


### Features

* **external-redirections:** Created the ability to track if a redirection was done externally or internally and fix the nominations that are currently incorrect around this ([5ce24e2](https://github.com/entrostat/road-protect-fleet/commit/5ce24e28187b3b1ad7843088705d899ae9c321ce)), closes [#445](https://github.com/entrostat/road-protect-fleet/issues/445)
* **job:** Client notification of verification queued and socket updates for job status  ([6de11f4](https://github.com/entrostat/road-protect-fleet/commit/6de11f4def28f9d160770a2d6a11e3b0c39fcf56)), closes [#441](https://github.com/entrostat/road-protect-fleet/issues/441)

## [2.76.0](https://github.com/entrostat/road-protect-fleet/compare/v2.75.3...v2.76.0) (2021-01-13)


### Features

* **update-readme:** Updated the README to include submodule imports ([f044eed](https://github.com/entrostat/road-protect-fleet/commit/f044eed94ee5087450db05838ae6dba1fdca4e04))


### Bug Fixes

* **issuers:** Fixed rashut code on one of the metropark issuers ([e05bd32](https://github.com/entrostat/road-protect-fleet/commit/e05bd327ef83c1a23c269ab5b31fa5e0b134388e)), closes [#433](https://github.com/entrostat/road-protect-fleet/issues/433)

### [2.75.3](https://github.com/entrostat/road-protect-fleet/compare/v2.75.2...v2.75.3) (2021-01-12)


### Bug Fixes

* **digital-redirections:** Don't repeat a digital redirection if it has already taken place ([f51e2c7](https://github.com/entrostat/road-protect-fleet/commit/f51e2c74a4c92440c0368408e83869f5c94f7e59)), closes [#431](https://github.com/entrostat/road-protect-fleet/issues/431)
* **redirections:** Allow for the previous BRN to be null ([267e332](https://github.com/entrostat/road-protect-fleet/commit/267e33223cece65b047719007c046eaf17c94e46))

### [2.75.2](https://github.com/entrostat/road-protect-fleet/compare/v2.75.1...v2.75.2) (2021-01-12)


### Bug Fixes

* **infringement-reporting:** Fix the reporting of infringements that do not have a location related with them and prevent for such issues to break the infringement reporting process in the future ([5f97f14](https://github.com/entrostat/road-protect-fleet/commit/5f97f14b7e703bc1f0d1be854c1dcbe71c794769))

### [2.75.1](https://github.com/entrostat/road-protect-fleet/compare/v2.75.0...v2.75.1) (2021-01-11)


### Bug Fixes

* **infringements:** Check the iv value and if it's undefined then return null ([4b4ec73](https://github.com/entrostat/road-protect-fleet/commit/4b4ec738646ba8de0dfb3a652f94397fccd79057))

## [2.75.0](https://github.com/entrostat/road-protect-fleet/compare/v2.74.0...v2.75.0) (2021-01-11)


### Features

* **datetime:** Refactored the datetime pattern matcher to make it more manageable ([4bf052f](https://github.com/entrostat/road-protect-fleet/commit/4bf052fab557bffaf55e4d6ce955924aa7aa5943)), closes [#426](https://github.com/entrostat/road-protect-fleet/issues/426)


### Bug Fixes

* **infringements:** Modified the payment decryption function to not decrypt undefined data ([93d5a31](https://github.com/entrostat/road-protect-fleet/commit/93d5a31f6a7ae9d33c74250b00b6199a6b3fd073))

## [2.74.0](https://github.com/entrostat/road-protect-fleet/compare/v2.73.0...v2.74.0) (2021-01-11)


### Features

* **datetime-patterns:** Added HH:MM dd/mm/yyyy and other similar patterns to the system ([8606971](https://github.com/entrostat/road-protect-fleet/commit/860697160add96b508e3863e45fea50762c4cbc3)), closes [#425](https://github.com/entrostat/road-protect-fleet/issues/425)

## [2.73.0](https://github.com/entrostat/road-protect-fleet/compare/v2.72.0...v2.73.0) (2021-01-11)


### Features

* **unit-tests:** Modified the logic to ensure that all of the unit tests run ([6115fc3](https://github.com/entrostat/road-protect-fleet/commit/6115fc37bac933ff2d3bcb4b62e62b1b38c37d0c)), closes [#420](https://github.com/entrostat/road-protect-fleet/issues/420)


### Bug Fixes

* **devops:** Authenticate docker with gcloud in tests ([f36a47f](https://github.com/entrostat/road-protect-fleet/commit/f36a47fc713de83aee2c774fc05a21cfbf914883))
* **infringement:** Updated penalty amount filter to rely on total amount ([f859d36](https://github.com/entrostat/road-protect-fleet/commit/f859d3666a1f394f74178f11bbf90f1b445a77fa)), closes [#424](https://github.com/entrostat/road-protect-fleet/issues/424)
* **tests:** Added the force exit to tests ([566d44c](https://github.com/entrostat/road-protect-fleet/commit/566d44cb2dc0858cb32d1aacde9c2659892a9930))
* **verifications:** Select required infringement by most recent offence date for batch crawler verification ([77091b8](https://github.com/entrostat/road-protect-fleet/commit/77091b8d79e55e96e9eff80e7c979305ffec905c)), closes [#423](https://github.com/entrostat/road-protect-fleet/issues/423)
* **verifications:** Various verification improvements to ensure crawler mappers running smoothly including awaiting dto validate, fixes to dtos, changes to tests ([55e2f48](https://github.com/entrostat/road-protect-fleet/commit/55e2f485c2783eb0ca1ba8b7e4334a4f96be1f7d)), closes [#422](https://github.com/entrostat/road-protect-fleet/issues/422)

## [2.72.0](https://github.com/entrostat/road-protect-fleet/compare/v2.71.0...v2.72.0) (2021-01-08)


### Features

* **crawlers:** Telaviv paginated crawler request for batch infringements ([55b73c0](https://github.com/entrostat/road-protect-fleet/commit/55b73c0d4c80ff5f66a4d27bca9f243fa3d237a7)), closes [#419](https://github.com/entrostat/road-protect-fleet/issues/419)
* **logs:** Added job log for admins ([c2d6bed](https://github.com/entrostat/road-protect-fleet/commit/c2d6bed851eb4affee06a6aa0346c5b898f42ed3)), closes [#418](https://github.com/entrostat/road-protect-fleet/issues/418)

## [2.71.0](https://github.com/entrostat/road-protect-fleet/compare/v2.70.2...v2.71.0) (2021-01-08)


### Features

* **payment-reference:** Added the ability to upload the payment reference ([9fe15fb](https://github.com/entrostat/road-protect-fleet/commit/9fe15fb6aa3ef026cc28b12d5bb10b8a544c81f7)), closes [#417](https://github.com/entrostat/road-protect-fleet/issues/417)

### [2.70.2](https://github.com/entrostat/road-protect-fleet/compare/v2.70.1...v2.70.2) (2021-01-08)


### Bug Fixes

* **external-payments:** Added the condition that the amount due being 0 should also trigger us to look at the infringement and maybe add a payment there ([3f6bca0](https://github.com/entrostat/road-protect-fleet/commit/3f6bca005b0b0b7e821fe81b908c017252d4a91a))
* **infringement-actions:** Uncomment batch infringement actions ([b21af94](https://github.com/entrostat/road-protect-fleet/commit/b21af94f3cc188c04a86d30d289e2232d4c13c5e))
* **infringement-creation:** Modified the standard nomination rules so that we pull the latest nomination if it is not defined on the infringement (otherwise we get null errors) ([457c512](https://github.com/entrostat/road-protect-fleet/commit/457c51283679678a74c75064fc438314b9b26739))
* **infringement-rules:** Added a service that adjusts values on the infringements depending on whether certain criteria are met ([85d4c28](https://github.com/entrostat/road-protect-fleet/commit/85d4c2830fea7f2082afb63028fe59ca31137a19))
* **ui:** Removed the infringement upload date because users didn't understand what it meant ([84a24b8](https://github.com/entrostat/road-protect-fleet/commit/84a24b869a4c892e0c52f1180005483512e0993d))

### [2.70.1](https://github.com/entrostat/road-protect-fleet/compare/v2.70.0...v2.70.1) (2021-01-08)


### Bug Fixes

* **redirections:** Allow vehicle owners to redirect fines (if the contract owner has the same id as the current account id ([16c582a](https://github.com/entrostat/road-protect-fleet/commit/16c582ae03e5f0d2266850b658de4f5ed2b4a8d2))

## [2.70.0](https://github.com/entrostat/road-protect-fleet/compare/v2.69.0...v2.70.0) (2021-01-08)


### Features

* **status-change-dates:** Added the last change date on the infringement and nomination statuses so that we can track when last they were updated ([e6a748e](https://github.com/entrostat/road-protect-fleet/commit/e6a748e7a179235ca0fe76f9eb67ede45f67d0ad)), closes [#414](https://github.com/entrostat/road-protect-fleet/issues/414)

## [2.69.0](https://github.com/entrostat/road-protect-fleet/compare/v2.68.0...v2.69.0) (2021-01-07)


### Features

* **verifications:** Turned on crawler verifications and restricting verifications to accounts with non-hidden users ([141f236](https://github.com/entrostat/road-protect-fleet/commit/141f236c3b57c287d9238218bbca379f590563fe)), closes [#413](https://github.com/entrostat/road-protect-fleet/issues/413)

## [2.68.0](https://github.com/entrostat/road-protect-fleet/compare/v2.67.2...v2.68.0) (2021-01-07)


### Features

* **payment-upload:** Added the ability to upload payment dates and amounts in a spreadsheet ([2db22c7](https://github.com/entrostat/road-protect-fleet/commit/2db22c755e09fe9d0086ca5a7021bb7349435b08)), closes [#410](https://github.com/entrostat/road-protect-fleet/issues/410)


### Bug Fixes

* **build:** Import the payments module into the infringement module ([073610c](https://github.com/entrostat/road-protect-fleet/commit/073610c33710d3210d32782a61af3c3dc2a22dee))
* **build:** The payment amount must be a number ([974677a](https://github.com/entrostat/road-protect-fleet/commit/974677aacda3c827d11ceb74b60b7a08d50f3f45))
* **crawlers:** Added changes to queries for required infringement to improve query and ensure correct required infringement is selected  ([5d5050b](https://github.com/entrostat/road-protect-fleet/commit/5d5050bc9470699ed8b8570a83fefb53e107a972)), closes [#409](https://github.com/entrostat/road-protect-fleet/issues/409)
* **payments:** Make the payments display the payment date not the created date ([c01b4fa](https://github.com/entrostat/road-protect-fleet/commit/c01b4fa6f2744a958301616bee3a2f1fa8d8604c)), closes [#411](https://github.com/entrostat/road-protect-fleet/issues/411)

### [2.67.2](https://github.com/entrostat/road-protect-fleet/compare/v2.67.1...v2.67.2) (2021-01-06)


### Bug Fixes

* **build:** The payment date and payment amount are optional on upsert ([24a43c8](https://github.com/entrostat/road-protect-fleet/commit/24a43c861fa548973424868c41cca6ba864c8359))

### [2.67.1](https://github.com/entrostat/road-protect-fleet/compare/v2.67.0...v2.67.1) (2021-01-06)


### Bug Fixes

* **build:** The payment amount and date should be optional ([b32e2aa](https://github.com/entrostat/road-protect-fleet/commit/b32e2aa212030fbebceb2077deaf8b61820260d6))

## [2.67.0](https://github.com/entrostat/road-protect-fleet/compare/v2.66.0...v2.67.0) (2021-01-06)


### Features

* **payments:** Added the ability to upload payment information in the spreadsheet ([6f453d2](https://github.com/entrostat/road-protect-fleet/commit/6f453d20c7d3ada55e8e5c6bc45a93b8752284f1)), closes [#407](https://github.com/entrostat/road-protect-fleet/issues/407)

## [2.66.0](https://github.com/entrostat/road-protect-fleet/compare/v2.65.1...v2.66.0) (2021-01-06)


### Features

* **payments:** Added an external payment service that can be used to create and update existing payments ([d29f164](https://github.com/entrostat/road-protect-fleet/commit/d29f1644f67ffc2901fe41071f75fad4292cb89e)), closes [#406](https://github.com/entrostat/road-protect-fleet/issues/406)

### [2.65.1](https://github.com/entrostat/road-protect-fleet/compare/v2.65.0...v2.65.1) (2021-01-06)

## [2.65.0](https://github.com/entrostat/road-protect-fleet/compare/v2.64.5...v2.65.0) (2021-01-06)


### Features

* **verifications:** Individual verification job for ATG and scheduler to do batch verifications with ATG ([f6bcf3e](https://github.com/entrostat/road-protect-fleet/commit/f6bcf3e643b77765770988f9cd352a58d639f35c)), closes [#401](https://github.com/entrostat/road-protect-fleet/issues/401)
* **verifications:** Individual verification job for Metropark ([7ac56b6](https://github.com/entrostat/road-protect-fleet/commit/7ac56b6fdc83066a98c8fcbf80ce3ab61959602f)), closes [#402](https://github.com/entrostat/road-protect-fleet/issues/402)
* **verifications:** Individual verification jobs for Jerusalem, Telaviv, Mileon, and Police crawler queues ([a702fc0](https://github.com/entrostat/road-protect-fleet/commit/a702fc0c7c98761473d5135a72602fd17805534b)), closes [#400](https://github.com/entrostat/road-protect-fleet/issues/400)
* **verifications:** Job table created and jobs recorded during queue service dispatch and processing of jobs ([f2e05a3](https://github.com/entrostat/road-protect-fleet/commit/f2e05a377151a154a70e8faf56b71f35309034ee)), closes [#404](https://github.com/entrostat/road-protect-fleet/issues/404)
* **verifications:** Queueing logic developed further for verifications with job logging ([39d251b](https://github.com/entrostat/road-protect-fleet/commit/39d251bfe4527955f809933df2c2f2bf538b75f4)), closes [#405](https://github.com/entrostat/road-protect-fleet/issues/405)
* **verifications:** Turned on ATG cron job ([e2a162d](https://github.com/entrostat/road-protect-fleet/commit/e2a162d6c36e8ae9a5471fe946ede3634eb2255b))

### [2.64.5](https://github.com/entrostat/road-protect-fleet/compare/v2.64.4...v2.64.5) (2021-01-05)


### Bug Fixes

* **raw-mappers:** Don't force vehicle to exist on infringement create in raw mapper ([1efec9d](https://github.com/entrostat/road-protect-fleet/commit/1efec9d55160b15bbc923ec1a996b4bd95f857da))

### [2.64.4](https://github.com/entrostat/road-protect-fleet/compare/v2.64.3...v2.64.4) (2021-01-05)


### Bug Fixes

* **crawlers:** Infringement brn cannot be null for police crawler scheduler ([b8f0de4](https://github.com/entrostat/road-protect-fleet/commit/b8f0de40148f602ad965c1d4a5fe9e285f903f0e))

### [2.64.3](https://github.com/entrostat/road-protect-fleet/compare/v2.64.2...v2.64.3) (2021-01-05)


### Bug Fixes

* **crawlers:** Logging details for create sync dto error ([20a2d49](https://github.com/entrostat/road-protect-fleet/commit/20a2d49afb72b56e07eb60e3bd1527437ac5cf5e))

### [2.64.2](https://github.com/entrostat/road-protect-fleet/compare/v2.64.1...v2.64.2) (2021-01-05)


### Bug Fixes

* **outstanding-balance:** Set infringements with an original amount of zero to the amount due ([f8f2748](https://github.com/entrostat/road-protect-fleet/commit/f8f2748c0de007d57e48ad53efaed9065f0ebac2))

### [2.64.1](https://github.com/entrostat/road-protect-fleet/compare/v2.64.0...v2.64.1) (2021-01-05)


### Bug Fixes

* **devops:** Don't build crawlers for now ([aa9670a](https://github.com/entrostat/road-protect-fleet/commit/aa9670a026db9dd3880c85b976f5740dc5172934))

## [2.64.0](https://github.com/entrostat/road-protect-fleet/compare/v2.63.0...v2.64.0) (2021-01-05)


### Features

* **crawlers:** Added controller endpoint to manually trigger sync with crawlers ([6ed0da5](https://github.com/entrostat/road-protect-fleet/commit/6ed0da599fe94f08ef4df90cbc364fe57c54f831)), closes [#398](https://github.com/entrostat/road-protect-fleet/issues/398)
* **crawlers:** Police scheduler and queue worker to sync infringements with crawler ([e8f2c78](https://github.com/entrostat/road-protect-fleet/commit/e8f2c787c6b9ebf92e4eaf1d5d97ba9896fd7d47)), closes [#397](https://github.com/entrostat/road-protect-fleet/issues/397)

## [2.63.0](https://github.com/entrostat/road-protect-fleet/compare/v2.62.0...v2.63.0) (2021-01-04)


### Features

* **infringements:** Added the ability to fix infringements that had the outstanding status but an original amount of zero ([267724d](https://github.com/entrostat/road-protect-fleet/commit/267724dfe436c63499b6889b2c8153cc133c3670))


### Bug Fixes

* **infringements:** Look for the total amount being the amount due ([7e7a959](https://github.com/entrostat/road-protect-fleet/commit/7e7a959000bbc81358cd06e15f80e970dd079f60))
* **infringements:** Needed to get the infringements that had the original amount of zero ([47d3d14](https://github.com/entrostat/road-protect-fleet/commit/47d3d144aacf2534de718342babced70205e8a89))

## [2.62.0](https://github.com/entrostat/road-protect-fleet/compare/v2.61.8...v2.62.0) (2021-01-04)


### Features

* **crawlers:** Mileon scheduler and queue worker to sync infringements with crawler ([0a282e1](https://github.com/entrostat/road-protect-fleet/commit/0a282e152a666cd333c6587197ffa3131d04b3b7)), closes [#396](https://github.com/entrostat/road-protect-fleet/issues/396)


### Bug Fixes

* **dependencies:** Installed bull types and debug ([ab3ba5a](https://github.com/entrostat/road-protect-fleet/commit/ab3ba5aaeb3bab762280f6a626bf62788df201c7))
* **dependencies:** Updated the package-lock.json with the new installs ([ea6b9ce](https://github.com/entrostat/road-protect-fleet/commit/ea6b9cefbb858453f008939da9d9efa376b6744d))
* **infringements:** Set the original amount to amount due if it's set to zero ([5b6f4f8](https://github.com/entrostat/road-protect-fleet/commit/5b6f4f85186ecb03f4210f4339dc2e9344a289ae))

### [2.61.8](https://github.com/entrostat/road-protect-fleet/compare/v2.61.7...v2.61.8) (2021-01-04)


### Bug Fixes

* **infringement-update:** New brn must be true if infringement.brn is currently null and must not cause an error ([9c150a1](https://github.com/entrostat/road-protect-fleet/commit/9c150a12fefe0d68f0e1ad0976abfeed89716755)), closes [#394](https://github.com/entrostat/road-protect-fleet/issues/394)
* **verifications:** Update infringement reason in raw mappers ([6027c3c](https://github.com/entrostat/road-protect-fleet/commit/6027c3caa8255d69653e84227cf733958a050962)), closes [#395](https://github.com/entrostat/road-protect-fleet/issues/395)

### [2.61.7](https://github.com/entrostat/road-protect-fleet/compare/v2.61.6...v2.61.7) (2021-01-03)


### Bug Fixes

* **devops:** Removed the reference to secrets in the entro-ci call ([23017f8](https://github.com/entrostat/road-protect-fleet/commit/23017f8cbc0b598c8efd152cd93c6d6f2a2a3c89))

### [2.61.6](https://github.com/entrostat/road-protect-fleet/compare/v2.61.5...v2.61.6) (2021-01-03)


### Bug Fixes

* **devops:** Use the Github action secrets for Entro Hash credentials ([4515d3b](https://github.com/entrostat/road-protect-fleet/commit/4515d3bc003aec6db736536ca0b7c8efd7c1c24c))

### [2.61.5](https://github.com/entrostat/road-protect-fleet/compare/v2.61.4...v2.61.5) (2021-01-03)


### Bug Fixes

* **devops:** Login to Entro Hash to allow us to hash data and see if it needs to change ([4bc986b](https://github.com/entrostat/road-protect-fleet/commit/4bc986badacd5bca2c69373e282d0860ac72f363))

### [2.61.4](https://github.com/entrostat/road-protect-fleet/compare/v2.61.3...v2.61.4) (2021-01-03)


### Bug Fixes

* **ownership-contracts:** Removed the isDateString decorator since we now have the fixDate decorator ([97b9df9](https://github.com/entrostat/road-protect-fleet/commit/97b9df94578ef13cbc065b6956d95b20f224b33b))

### [2.61.3](https://github.com/entrostat/road-protect-fleet/compare/v2.61.2...v2.61.3) (2021-01-03)


### Bug Fixes

* **batch-actions:** Added the ability to batch approve for payments back ([ab766db](https://github.com/entrostat/road-protect-fleet/commit/ab766dba529b372dfa136089810e366e1f2ba0df))

### [2.61.2](https://github.com/entrostat/road-protect-fleet/compare/v2.61.1...v2.61.2) (2020-12-30)


### Bug Fixes

* **contacts:** Added the default timezones for fixing contracts ([9f00736](https://github.com/entrostat/road-protect-fleet/commit/9f0073633e2bdec549b8a5220f588a4588cebe5e))

### [2.61.1](https://github.com/entrostat/road-protect-fleet/compare/v2.61.0...v2.61.1) (2020-12-29)


### Bug Fixes

* **ui:** Show dates around payments and verifications in the simple filter ([6ab1624](https://github.com/entrostat/road-protect-fleet/commit/6ab16249b5036683243a8e9f8cebc2806f9b4593))

## [2.61.0](https://github.com/entrostat/road-protect-fleet/compare/v2.60.9...v2.61.0) (2020-12-29)


### Features

* **nominations:** Added the standard nomination rules to nominations so that the paid date and status update automatically ([478b025](https://github.com/entrostat/road-protect-fleet/commit/478b025620f1559c2a4416b092694a2dcdea02c9))
* **payment-reference:** Added external payment references to payments ([930e16f](https://github.com/entrostat/road-protect-fleet/commit/930e16f8f02b396e542dc66ec5f88c4c5ccc694e)), closes [#390](https://github.com/entrostat/road-protect-fleet/issues/390)
* **payment-view:** Added the payment information to infringements ([0c92771](https://github.com/entrostat/road-protect-fleet/commit/0c9277173d7e5ce9d5171e454bcf83e292927d96)), closes [#391](https://github.com/entrostat/road-protect-fleet/issues/391)


### Bug Fixes

* **devops:** Switched the .secrets and .env file around so that the .secrets overwrite the .env in dev ([2f1470d](https://github.com/entrostat/road-protect-fleet/commit/2f1470dbdd4ec1943a6cd8980ac178db31e7e775))
* **nominations:** Added a service that allows us to run through the history and extract the first date that we received that an infringement was paid ([c1e77ab](https://github.com/entrostat/road-protect-fleet/commit/c1e77ab88fc099c2386cef798336d73d06bd16f1))
* **nominations:** Renamed the fix redirections service because it was vague before ([44a882d](https://github.com/entrostat/road-protect-fleet/commit/44a882d9829b7464abd821ee116242c7bb981f4d))

### [2.60.9](https://github.com/entrostat/road-protect-fleet/compare/v2.60.8...v2.60.9) (2020-12-29)


### Bug Fixes

* **nominations:** Don't ignore nominations that have a redirection identifier but no redirection date or letter send date ([ac01762](https://github.com/entrostat/road-protect-fleet/commit/ac01762b893fbff9045ad24c4b7acf8a0567283f))

### [2.60.8](https://github.com/entrostat/road-protect-fleet/compare/v2.60.7...v2.60.8) (2020-12-28)


### Bug Fixes

* **nominations:** Set the initial nomination so that we can trigger a nomination update ([258331e](https://github.com/entrostat/road-protect-fleet/commit/258331edbfa142a02533d4f8f4f132cccdeff6b8))

### [2.60.7](https://github.com/entrostat/road-protect-fleet/compare/v2.60.6...v2.60.7) (2020-12-28)


### Bug Fixes

* **nominations:** Forgot to use andWhere when looking for empty accounts ([13280ae](https://github.com/entrostat/road-protect-fleet/commit/13280aece7e01a8647fa0dcabf4af8c0f31ce1d6))

### [2.60.6](https://github.com/entrostat/road-protect-fleet/compare/v2.60.5...v2.60.6) (2020-12-28)


### Bug Fixes

* **nominations:** Only pull infringements that have contracts ([3987c25](https://github.com/entrostat/road-protect-fleet/commit/3987c2545869f7bbe76e699a1d49f53df823ba7b))
* **nominations:** Removed the limit ([ce2d440](https://github.com/entrostat/road-protect-fleet/commit/ce2d440cd3a589c1097e864145eccff3bec95e36))

### [2.60.5](https://github.com/entrostat/road-protect-fleet/compare/v2.60.4...v2.60.5) (2020-12-28)


### Bug Fixes

* **nominations:** Added the ability to try to digitally nominate the infringements that don't have a contract linked ([13030f1](https://github.com/entrostat/road-protect-fleet/commit/13030f1421553afc9f5278802113a5083ce5661e))
* **nominations:** Added the functionality to find nominations that are missing contracts ([60fffd1](https://github.com/entrostat/road-protect-fleet/commit/60fffd108c5a581ff7a864af5ed89d3eb3528225))

### [2.60.4](https://github.com/entrostat/road-protect-fleet/compare/v2.60.3...v2.60.4) (2020-12-28)


### Bug Fixes

* **redirections:** Don't acknowlege the fixed nomination for flags ([6268df2](https://github.com/entrostat/road-protect-fleet/commit/6268df29bee879cd4f18fc5cfd6dc4cfbd5ce613))

### [2.60.3](https://github.com/entrostat/road-protect-fleet/compare/v2.60.2...v2.60.3) (2020-12-28)


### Bug Fixes

* **redirections:** Ignore null brn in infringement history ([71136ea](https://github.com/entrostat/road-protect-fleet/commit/71136ea08f6f72173c56e2a107836be9e48ae990))

### [2.60.2](https://github.com/entrostat/road-protect-fleet/compare/v2.60.1...v2.60.2) (2020-12-28)


### Bug Fixes

* **redirections:** Don't redirect during a digital nomination ([dd8815e](https://github.com/entrostat/road-protect-fleet/commit/dd8815ee96cc5b619e828300bca88176663de98b))

### [2.60.1](https://github.com/entrostat/road-protect-fleet/compare/v2.60.0...v2.60.1) (2020-12-27)


### Bug Fixes

* **performance:** It looks like 5 concurrent jobs is the right number ([4eae48c](https://github.com/entrostat/road-protect-fleet/commit/4eae48c3ce33814edb66351bf998c903568cbad7))

## [2.60.0](https://github.com/entrostat/road-protect-fleet/compare/v2.59.20...v2.60.0) (2020-12-27)


### Features

* **logger:** Removed the GCP logger to see if there are issues ([83a4fb1](https://github.com/entrostat/road-protect-fleet/commit/83a4fb12b0b4d261efe2f7feea18f97ac694135e))


### Bug Fixes

* **logger:** Set the maximum depth in the logger ([9e477f5](https://github.com/entrostat/road-protect-fleet/commit/9e477f5f23dc02602c1d97e039470cf0401791a2))
* **performance:** After removing the logger the speed has increased 10 fold, trying higher threads ([07ae2fe](https://github.com/entrostat/road-protect-fleet/commit/07ae2fe1285095f6dd296217bb1f00370d31daee))
* **performance:** Increased the performance on the production system as well ([10ac357](https://github.com/entrostat/road-protect-fleet/commit/10ac357aa3d38df0a8533056a0b41fef1ff5537a))
* **statuses:** Allow infringements to go from closed to open ([ff2bba3](https://github.com/entrostat/road-protect-fleet/commit/ff2bba3c0b82284ea3abe63f3d5b558e5b4c1ccd))
* **statuses:** Allow infringements to go from closed to paid ([d67e0ff](https://github.com/entrostat/road-protect-fleet/commit/d67e0ffc04f787a85fd91b5409e98389a0884ca5))

### [2.59.20](https://github.com/entrostat/road-protect-fleet/compare/v2.59.19...v2.59.20) (2020-12-27)


### Bug Fixes

* **logger:** Added the listener for errors on the logger itself ([2f7f45e](https://github.com/entrostat/road-protect-fleet/commit/2f7f45e17308c7464e9e761a1731c513d906f834))
* **logging:** Added a file that handles exceptions in Winston ([d340114](https://github.com/entrostat/road-protect-fleet/commit/d340114d49160c4047c4eacf906fe5884425426f))
* **logging:** Added a listener to catch all unhandled promises ([178e563](https://github.com/entrostat/road-protect-fleet/commit/178e56308ce0fd89aa0dca71ceeb3bba889e2fea))
* **logging:** Added an on error listener to the transports ([b651868](https://github.com/entrostat/road-protect-fleet/commit/b6518681bc09bb1df36be17274099d1b70aa8df0))
* **logging:** Handle logging exceptions through logger, we can't catch exceptions because it's not returning a promise (and we don't await that) ([6e0ed25](https://github.com/entrostat/road-protect-fleet/commit/6e0ed25476fc7d404c79f272db387f980171335a))
* **logging:** Only log errors to console ([4f4a616](https://github.com/entrostat/road-protect-fleet/commit/4f4a6166cf902ef71168c5012e57e710e3e1d455))
* **logging:** Rather make the logger write to a file ([8a10764](https://github.com/entrostat/road-protect-fleet/commit/8a10764aae7f24b46c0af7ca742e2b8acfffc7b6))
* **logging:** Trying to add a rejection handler ([f4dbe82](https://github.com/entrostat/road-protect-fleet/commit/f4dbe8213b4bdfe3ed6edb2df46ed4219bf160bf))
* **logging:** Updated the grpc version to try to resolve the unhandled rejections ([e44ddb1](https://github.com/entrostat/road-protect-fleet/commit/e44ddb1f970680ac909f62d27ced7da16585bbd1))
* **nominations:** Expose the nominations detail keys ([1dedc79](https://github.com/entrostat/road-protect-fleet/commit/1dedc798f6aaa4ce5c3422296e59048eb7f509a2))
* **payments:** Don't show payments for now ([83af540](https://github.com/entrostat/road-protect-fleet/commit/83af5404f8120649acb24188c1a3bb33043a6855))
* **performance:** Set the number of threads in the backend yaml file ([5849810](https://github.com/entrostat/road-protect-fleet/commit/58498106f478e3f465d317b83b73177df3dc7cf0))
* **upsert:** Added a minor delay so that the websocket can process ([b70867d](https://github.com/entrostat/road-protect-fleet/commit/b70867db4e1b43537f7cc3aedbbc3a083e55ba53))
* **upsert:** Added a promise timeout of 30s for infringement ([118ad11](https://github.com/entrostat/road-protect-fleet/commit/118ad113d7c2b1b104426f60ac283e4f5ee252c8))
* **upsert:** Use promax instead of the previous promise map ([2c3d84d](https://github.com/entrostat/road-protect-fleet/commit/2c3d84dc578008cdd9fce855913a4afef7a2a853))

### [2.59.19](https://github.com/entrostat/road-protect-fleet/compare/v2.59.18...v2.59.19) (2020-12-27)


### Bug Fixes

* **redirections:** Added additional logic checks to make sure we should run the nomination ([a342678](https://github.com/entrostat/road-protect-fleet/commit/a342678b10050210eb752df1c8df1ef7fad6e59d))

### [2.59.18](https://github.com/entrostat/road-protect-fleet/compare/v2.59.17...v2.59.18) (2020-12-25)


### Bug Fixes

* **logs:** Send more logs to the frontend ([568b37e](https://github.com/entrostat/road-protect-fleet/commit/568b37e7b37936dd5b1081cfe068b58b3e2e8b5f))
* **redirections:** Log the redirection reset for users to see ([03649c2](https://github.com/entrostat/road-protect-fleet/commit/03649c225b491a8a71216f741e6a1aac3ca258d9))

### [2.59.17](https://github.com/entrostat/road-protect-fleet/compare/v2.59.16...v2.59.17) (2020-12-25)


### Bug Fixes

* **redirections:** Check that the redirection identifier is not null ([995ea8b](https://github.com/entrostat/road-protect-fleet/commit/995ea8b6db9cf2d9a7c066812509151303a4138e))

### [2.59.16](https://github.com/entrostat/road-protect-fleet/compare/v2.59.15...v2.59.16) (2020-12-25)


### Bug Fixes

* **crawlers:** Added shared request timeout for crawlers of 3 minutes by default ([88ff7af](https://github.com/entrostat/road-protect-fleet/commit/88ff7afeae67a4b31d0f1771b32d9b6cfbb87555)), closes [#387](https://github.com/entrostat/road-protect-fleet/issues/387)
* **redirections:** Added logging to the chunk pull of infringements ([a592771](https://github.com/entrostat/road-protect-fleet/commit/a59277197281d4e26c2210e53a0cd5797e90bd04))
* **redirections:** Added logs to the infringement redirection logic ([a15da6d](https://github.com/entrostat/road-protect-fleet/commit/a15da6db398013e8fc0fd911340bdc3746bbf2df))
* **redirections:** Added the ability to find invalid redirections ([2f2607f](https://github.com/entrostat/road-protect-fleet/commit/2f2607f29219c45b9d5999efc96375cef76de9a5))
* **redirections:** Extract limited information and return in the api request ([28fac32](https://github.com/entrostat/road-protect-fleet/commit/28fac32841423913159abc2f19cc4a6709050d97))
* **redirections:** Filter out the valid ones ([40690b9](https://github.com/entrostat/road-protect-fleet/commit/40690b9cd3de06aa3cee2c75251e2b32b077c9a0))
* **redirections:** Need to join nominations onto the infringements for the invalid redirection logic to work ([8a0a5f2](https://github.com/entrostat/road-protect-fleet/commit/8a0a5f28ef407f9924c00710bad4d2c485280bec))
* **redirections:** Not all history has the old object for an infringement ([d2ea147](https://github.com/entrostat/road-protect-fleet/commit/d2ea147ca09dc3500e566df8ec808b4293aba975))
* **redirections:** Overwrite incorrect nominations ([3f385eb](https://github.com/entrostat/road-protect-fleet/commit/3f385ebd5e31301ea58f5fcb6c417746bfd1a621))
* **verifications:** Added loading on verify buttons and added batch verifications ([44073bd](https://github.com/entrostat/road-protect-fleet/commit/44073bdadf847be1c723c3950f792b6249d82536)), closes [#386](https://github.com/entrostat/road-protect-fleet/issues/386)

### [2.59.15](https://github.com/entrostat/road-protect-fleet/compare/v2.59.14...v2.59.15) (2020-12-24)


### Bug Fixes

* **nominations:** Set the infringement id in the status updater ([e222082](https://github.com/entrostat/road-protect-fleet/commit/e222082f1398ea27d3475b8effdcca4afab4226b))

### [2.59.14](https://github.com/entrostat/road-protect-fleet/compare/v2.59.13...v2.59.14) (2020-12-24)


### Bug Fixes

* **nominations:** Removed the manual redirection ([3832d96](https://github.com/entrostat/road-protect-fleet/commit/3832d964a15e0e3b422a09662eb3d953de541d6f))

### [2.59.13](https://github.com/entrostat/road-protect-fleet/compare/v2.59.12...v2.59.13) (2020-12-24)


### Bug Fixes

* **infringements:** Added the municiple redirection logic back ([74931b9](https://github.com/entrostat/road-protect-fleet/commit/74931b93a14de4634026d1497fcc4c486e77159a))

### [2.59.12](https://github.com/entrostat/road-protect-fleet/compare/v2.59.11...v2.59.12) (2020-12-24)


### Bug Fixes

* **nominations:** Removed the autocreate ([8847796](https://github.com/entrostat/road-protect-fleet/commit/8847796b29cd3d51be936c2c6e7c3ec8e8283f77))

### [2.59.11](https://github.com/entrostat/road-protect-fleet/compare/v2.59.10...v2.59.11) (2020-12-24)


### Bug Fixes

* **nominations:** Always create a nomination for an infringement ([e19fd3e](https://github.com/entrostat/road-protect-fleet/commit/e19fd3e699c4d0289c7c17f44307b05ca0beae5f))
* **nominations:** Always persist the final nomination even if there wasn't a change ([ac2a55e](https://github.com/entrostat/road-protect-fleet/commit/ac2a55ee532b4d854ed05ba30822cef902f51c71))
* **nominations:** Don't use upsert to create the new nomination ([2fd5c30](https://github.com/entrostat/road-protect-fleet/commit/2fd5c30c19cf1db49ccdd475fe93595a90d5d0e7))
* **nominations:** Save the nomination before relinking ([0611a08](https://github.com/entrostat/road-protect-fleet/commit/0611a08f0cea9cddcbcda75fe897e9dc50057d21))
* **nominations:** Set the infringement on a nomination if it does not already exist ([5360943](https://github.com/entrostat/road-protect-fleet/commit/5360943a660bcac8acf4629572df2492cc68ba50))
* **upsert:** Always merge the dto first and then the infringement id ([97e113f](https://github.com/entrostat/road-protect-fleet/commit/97e113ffdf7082768cad6d4f63a68ec73f08c9a0))
* **upsert:** Reduced the number of concurrent jobs ([affff5b](https://github.com/entrostat/road-protect-fleet/commit/affff5b1d67af3a327d47c104447cfc9e62c7385))

### [2.59.10](https://github.com/entrostat/road-protect-fleet/compare/v2.59.9...v2.59.10) (2020-12-24)


### Bug Fixes

* **infringements:** Removed delay on each infringement ([62650d2](https://github.com/entrostat/road-protect-fleet/commit/62650d2a3b37fe2dd565257b7d635e8c30a827ab))
* **infringements:** Set the initial infringement on the update ([de2aebd](https://github.com/entrostat/road-protect-fleet/commit/de2aebd1fa70c3bfec5d9e91c629fe159919248b))
* **nominations:** Delay the errors ([09a1c95](https://github.com/entrostat/road-protect-fleet/commit/09a1c953bb1839424121dcb3394fcf7d2673d97b))
* **nominations:** Only set the initial nomination when it's not null ([c90e3df](https://github.com/entrostat/road-protect-fleet/commit/c90e3dfb9c1eb8857a49e4901c684427a7dba22a))
* **nominations:** Set the infringement id after the nomination ([3e9c32e](https://github.com/entrostat/road-protect-fleet/commit/3e9c32e170dce233ad7e4845349a7853b2839d6c))

### [2.59.9](https://github.com/entrostat/road-protect-fleet/compare/v2.59.8...v2.59.9) (2020-12-24)


### Bug Fixes

* **nominations:** Remove redirection identifiers of 0 ([18df366](https://github.com/entrostat/road-protect-fleet/commit/18df366ad35b516c6e799a53b7d2e4c8acfdbb07))
* **registration-number:** Don't allow 0 ([b2c3195](https://github.com/entrostat/road-protect-fleet/commit/b2c31952dba079a077fa41945d901b2f37610db1))

### [2.59.8](https://github.com/entrostat/road-protect-fleet/compare/v2.59.7...v2.59.8) (2020-12-24)


### Bug Fixes

* **redirections:** Don't always expect the nomination dto to be defined ([3800235](https://github.com/entrostat/road-protect-fleet/commit/3800235d90d7951ce517958cb1cc7197a3c84922))

### [2.59.7](https://github.com/entrostat/road-protect-fleet/compare/v2.59.6...v2.59.7) (2020-12-24)


### Bug Fixes

* **infringements:** Added minor delays to ensure that we don't fully block the event loop ([bd066e9](https://github.com/entrostat/road-protect-fleet/commit/bd066e9026e0fabe13f8e3a6e2996056d1ca3df4))

### [2.59.6](https://github.com/entrostat/road-protect-fleet/compare/v2.59.5...v2.59.6) (2020-12-24)


### Bug Fixes

* **dates:** Ensure that the date fixer is okay with the dates it returns otherwise it clears them ([3917749](https://github.com/entrostat/road-protect-fleet/commit/3917749151a7b8a713df2f6fc1318783ca90d7b8))
* **devops:** Increased the timeout on staging ([a407905](https://github.com/entrostat/road-protect-fleet/commit/a407905ff4bafe066b036b7a80d1fc887c3999bd))
* **infringement:** Converted the redirection identifier to string ([71a5b6a](https://github.com/entrostat/road-protect-fleet/commit/71a5b6a9ac6377913b858fbcd220fac11c56c426))
* **logging:** Added the create and nominate dto to the logs when there is an error ([fbd364e](https://github.com/entrostat/road-protect-fleet/commit/fbd364e8228618979a1bc94443e2a3f985c4e6e7))

### [2.59.5](https://github.com/entrostat/road-protect-fleet/compare/v2.59.4...v2.59.5) (2020-12-24)


### Bug Fixes

* **infringement:** Modified the return type of the redirection identifier decorator ([a9046e0](https://github.com/entrostat/road-protect-fleet/commit/a9046e0d2d58a9fc2980d5f7afad455e10f59b2a))

### [2.59.4](https://github.com/entrostat/road-protect-fleet/compare/v2.59.3...v2.59.4) (2020-12-24)


### Bug Fixes

* **infringements:** Extract the year using regex and compare to a minium year before using moment ([5dfab41](https://github.com/entrostat/road-protect-fleet/commit/5dfab41a76bb46f888268e9ca9cfe6912358fe12))

### [2.59.3](https://github.com/entrostat/road-protect-fleet/compare/v2.59.2...v2.59.3) (2020-12-24)


### Bug Fixes

* **upsert-infringement:** Validate upsert dto on spreadsheet upload ([a5f5a92](https://github.com/entrostat/road-protect-fleet/commit/a5f5a9275b18c9a0cf02809e0c1c65c693519d54))

### [2.59.2](https://github.com/entrostat/road-protect-fleet/compare/v2.59.1...v2.59.2) (2020-12-24)


### Bug Fixes

* **date-decorator:** Added a decorator that fixes the date and kicks out any old dates from the system ([ba0489c](https://github.com/entrostat/road-protect-fleet/commit/ba0489cf8a651368019a2589297f67ce2d0785a3))
* **infringements:** Removed the standard string decorator from dates ([d66e65f](https://github.com/entrostat/road-protect-fleet/commit/d66e65fc10ef11e6878b9fea5a17d920fdea4176))

### [2.59.1](https://github.com/entrostat/road-protect-fleet/compare/v2.59.0...v2.59.1) (2020-12-23)


### Bug Fixes

* **performance:** Reduced concurrent jobs ([bd524d9](https://github.com/entrostat/road-protect-fleet/commit/bd524d9551f6dffc802c2afb7a738fe75ef54f3c))

## [2.59.0](https://github.com/entrostat/road-protect-fleet/compare/v2.58.2...v2.59.0) (2020-12-23)


### Features

* **crawlers:** Added external codes for mileon and metropark ([8440308](https://github.com/entrostat/road-protect-fleet/commit/8440308bd07d9bf5f926c7994582f3ddec97510e)), closes [#327](https://github.com/entrostat/road-protect-fleet/issues/327)
* **crawlers:** Added queue module ([6eb17c7](https://github.com/entrostat/road-protect-fleet/commit/6eb17c7530cd4b6dda4b4af59e28cb137ab392c0)), closes [#378](https://github.com/entrostat/road-protect-fleet/issues/378)
* **crawlers:** Dev docker compose crawler api setup with rp-fleet-crawlers submodule added ([ca5993e](https://github.com/entrostat/road-protect-fleet/commit/ca5993ed2e04ffefc3e33daac703fbb67e2836b7))
* **crawlers:** Error logging in crawler integrations ([53d611c](https://github.com/entrostat/road-protect-fleet/commit/53d611c0eff273193b4c4ec85dd28feb1be47101)), closes [#372](https://github.com/entrostat/road-protect-fleet/issues/372)
* **crawlers:** Feature merge for crawlers ([9383128](https://github.com/entrostat/road-protect-fleet/commit/9383128563f96a6824840cdd3ef1dc46b0fcedff)), closes [#384](https://github.com/entrostat/road-protect-fleet/issues/384)
* **crawlers:** Jerusalem raw infringement mapper and sync single infringement through crawler ([3539156](https://github.com/entrostat/road-protect-fleet/commit/353915681dec7050013e03d76afd11c1f34230f5))
* **crawlers:** Jerusalem scheduler and queue worker to sync infringements with crawler ([381a1fe](https://github.com/entrostat/road-protect-fleet/commit/381a1fe77348c09f78d56369c6ed87a4ce4434f5)), closes [#382](https://github.com/entrostat/road-protect-fleet/issues/382)
* **crawlers:** Jerusalem sync multiple infringements for vehicle ([dbe2c4e](https://github.com/entrostat/road-protect-fleet/commit/dbe2c4e5e72b3a2051b52a85ca1e2a57bea4767d)), closes [#332](https://github.com/entrostat/road-protect-fleet/issues/332)
* **crawlers:** Metropark raw infringement mapper and single infringement verification logic ([bdeb29c](https://github.com/entrostat/road-protect-fleet/commit/bdeb29c9e0f51b74b49577a34c2c5b3e47984073)), closes [#340](https://github.com/entrostat/road-protect-fleet/issues/340)
* **crawlers:** Mileon raw infringement mapper and single infringement verification logic ([3041d36](https://github.com/entrostat/road-protect-fleet/commit/3041d36fc0e80c2290b4634f58522b2f52bf6259)), closes [#324](https://github.com/entrostat/road-protect-fleet/issues/324)
* **crawlers:** Mileon raw infringement mapper and single infringement verification logic completed ([2656034](https://github.com/entrostat/road-protect-fleet/commit/265603498f991b408c0b63495a2357feb37f56e5)), closes [#328](https://github.com/entrostat/road-protect-fleet/issues/328)
* **crawlers:** Mileon sync multiple infringements for vehicle in a particular municipality ([c42dcfd](https://github.com/entrostat/road-protect-fleet/commit/c42dcfdac095d8aa883c7264c6a3c80338139e29)), closes [#339](https://github.com/entrostat/road-protect-fleet/issues/339)
* **crawlers:** Police raw infringement mapper and single infringement verification logic ([456a84e](https://github.com/entrostat/road-protect-fleet/commit/456a84e1831b7c2569c028f071eabacdebf1e4c0)), closes [#367](https://github.com/entrostat/road-protect-fleet/issues/367)
* **crawlers:** Police sync multiple infringements for vehicle ([cf526da](https://github.com/entrostat/road-protect-fleet/commit/cf526da964d67c108eb74ca9b17edc122e396d28)), closes [#374](https://github.com/entrostat/road-protect-fleet/issues/374)
* **crawlers:** Prod deployment setup of crawlers ([41a9929](https://github.com/entrostat/road-protect-fleet/commit/41a9929986fe84f396f3618340a15b617d6fcd93)), closes [#364](https://github.com/entrostat/road-protect-fleet/issues/364)
* **crawlers:** Puppeteer deployment fixed so that crawler deployment works ([2b069ee](https://github.com/entrostat/road-protect-fleet/commit/2b069eecd7386f80f0a1d8c7da8e97bbe6ab8ea0)), closes [#371](https://github.com/entrostat/road-protect-fleet/issues/371)
* **crawlers:** Refactor to create testable integrations for jerusalem and telaviv crawlers ([052a136](https://github.com/entrostat/road-protect-fleet/commit/052a1369bcbc96f7ef510c2c57c908b7c67bdf46)), closes [#313](https://github.com/entrostat/road-protect-fleet/issues/313)
* **crawlers:** Refactor to use integration details for selecting which verification flow to use ([5ee516f](https://github.com/entrostat/road-protect-fleet/commit/5ee516f876a7bb1c6fc5183e9c9c2e87235a59dd)), closes [#325](https://github.com/entrostat/road-protect-fleet/issues/325)
* **crawlers:** Staging deployment and service crawler api setup with workflows adjusted to work with submodules ([68a4c9c](https://github.com/entrostat/road-protect-fleet/commit/68a4c9c91c236f558ed42e1ca33a6a55a79c35c6))
* **crawlers:** Telaviv raw infringement mapper  ([e337115](https://github.com/entrostat/road-protect-fleet/commit/e337115a11cb6d67271429b15bfa6d89f135a6a5)), closes [#309](https://github.com/entrostat/road-protect-fleet/issues/309)
* **crawlers:** Telaviv scheduler and queue worker to sync infringements with crawler ([52598fa](https://github.com/entrostat/road-protect-fleet/commit/52598faeda1c032d089e35b79e7c05e9fa613327)), closes [#383](https://github.com/entrostat/road-protect-fleet/issues/383)
* **crawlers:** Telaviv sync multiple infringements for account ([1792ffe](https://github.com/entrostat/road-protect-fleet/commit/1792ffe44681ad282d04726270f618337c1a4150)), closes [#336](https://github.com/entrostat/road-protect-fleet/issues/336)
* **crawlers:** Test options added for testing sync of multiple infringements from available crawlers ([32a11fb](https://github.com/entrostat/road-protect-fleet/commit/32a11fb198e8cfee33550803a3fdda7574033281)), closes [#347](https://github.com/entrostat/road-protect-fleet/issues/347)
* **crawlers:** Verify infringement via Jerusalem crawler logic ([51d8512](https://github.com/entrostat/road-protect-fleet/commit/51d85124a27ac0f6bfc05d2a8b7cd7ce190ffd73)), closes [#315](https://github.com/entrostat/road-protect-fleet/issues/315)
* **crawlers:** Verify infringement via Telaviv crawler logic ([9c59e0b](https://github.com/entrostat/road-protect-fleet/commit/9c59e0b190e77336256fdf8d2a12a35ce5461dc4)), closes [#316](https://github.com/entrostat/road-protect-fleet/issues/316)
* **data-manipulators:** Added a decorator for standard strings on the dtos ([efce96f](https://github.com/entrostat/road-protect-fleet/commit/efce96ffa5bce653744175f7ae4754731467d727)), closes [#380](https://github.com/entrostat/road-protect-fleet/issues/380)


### Bug Fixes

* **crawlers:** Added additional external codes for mileon and metropark ([98edf4f](https://github.com/entrostat/road-protect-fleet/commit/98edf4fdd9e7a738234d1c0740d07c6eea660cdf))
* **crawlers:** Added exception throw if raw infringement process fails during verification ([b09a27c](https://github.com/entrostat/road-protect-fleet/commit/b09a27c4a4b0edd96986864eb6748bd8652210aa)), closes [#379](https://github.com/entrostat/road-protect-fleet/issues/379)
* **crawlers:** Added nomination dtos to existing crawlers ([91fe41a](https://github.com/entrostat/road-protect-fleet/commit/91fe41a4f90e3199310300bd7d48d15078fbfca9)), closes [#310](https://github.com/entrostat/road-protect-fleet/issues/310)
* **crawlers:** Escaped case number on police crawler and added loading to integration test submit button ([e121b45](https://github.com/entrostat/road-protect-fleet/commit/e121b453c3d0a8fed5021df827f83df156dd64f5)), closes [#375](https://github.com/entrostat/road-protect-fleet/issues/375)
* **crawlers:** Latest payment date updated on police ([950f7cc](https://github.com/entrostat/road-protect-fleet/commit/950f7ccba3aaf67b6c63b53055620c84099be225))
* **crawlers:** Minor bugfixes to crawler infringement processing ([7759d31](https://github.com/entrostat/road-protect-fleet/commit/7759d3151a3f6df2969fb17b901fc104667ec757)), closes [#363](https://github.com/entrostat/road-protect-fleet/issues/363)
* **crawlers:** Separated dto logic and actual request and processing to make it easier for testing ([b2f83c2](https://github.com/entrostat/road-protect-fleet/commit/b2f83c208d4350410f98dc5203a6792349252b45)), closes [#349](https://github.com/entrostat/road-protect-fleet/issues/349)
* **dtos:** Exposed all of the keys on infringement dtos ([a203af6](https://github.com/entrostat/road-protect-fleet/commit/a203af6fdeb3277cb0b5b806f9ff2d9ac9155bac))
* **infringement:** Omit the null values before overwriting the data on infringements ([b999cea](https://github.com/entrostat/road-protect-fleet/commit/b999cea2aa46fbd92626d577784f7af86c52d125))
* **infringement-upload:** Send progress before starting ([981e6bf](https://github.com/entrostat/road-protect-fleet/commit/981e6bf4555132e58914791e81007cc041a6e4c3))
* **logging:** Only add a log on the infringement if the brn has changed on the infringement (ie. even if the dto has a brn, if it's the same as the infringement then it won't log it) ([bbf4fef](https://github.com/entrostat/road-protect-fleet/commit/bbf4fefa7d117b41aee038f8c9b937307edc86e0))
* **performance:** Modified the issuer restriction logic to search ([4a709f9](https://github.com/entrostat/road-protect-fleet/commit/4a709f95265f3821f2ae38dd6f80fef8f8db8f69))
* **seeder:** Change infringement notice numbers to numerical values only ([b0242a9](https://github.com/entrostat/road-protect-fleet/commit/b0242a91de1cda10d2e47af69fff168f9c74d1ff))
* **upsert-infringements:** Added debug logs to make sure that the upsert is running ([56560c6](https://github.com/entrostat/road-protect-fleet/commit/56560c648796e2af938781d89ee13b539d9d1369))
* **verifications:** User type must be admin or developer to verify infringement ([c4c23a7](https://github.com/entrostat/road-protect-fleet/commit/c4c23a798416bd6ee91b8156f158bace7764a576))

### [2.58.2](https://github.com/entrostat/road-protect-fleet/compare/v2.58.1...v2.58.2) (2020-12-22)


### Bug Fixes

* **redirections:** Added the functionality to remove all redirections that were done under the new logic ([8b99d21](https://github.com/entrostat/road-protect-fleet/commit/8b99d214c0176a2406cd64e4f6e2694e06b62b68))
* **redirections:** Don't overwrite redirections that have taken place using ATG or manual email ([2b43cb2](https://github.com/entrostat/road-protect-fleet/commit/2b43cb2f40857157d0686e4a46b519e419f61a4a))

### [2.58.1](https://github.com/entrostat/road-protect-fleet/compare/v2.58.0...v2.58.1) (2020-12-22)


### Bug Fixes

* **redirections:** Don't look at the type when fixing the municiple redirections because the raw identifier was a new addition ([0aa9e6e](https://github.com/entrostat/road-protect-fleet/commit/0aa9e6e9b297c03ea84d225aa2b19ada03caf65a))

## [2.58.0](https://github.com/entrostat/road-protect-fleet/compare/v2.57.18...v2.58.0) (2020-12-22)


### Features

* **redirections:** Removed the municipal redirection service from the automatic nomination service ([c77b776](https://github.com/entrostat/road-protect-fleet/commit/c77b776b32117f4c35eb056d57220ec762d8e6b0))

### [2.57.18](https://github.com/entrostat/road-protect-fleet/compare/v2.57.17...v2.57.18) (2020-12-22)


### Bug Fixes

* **performance:** Reduced the number of jobs that we run at the same time to 10 ([63df0e7](https://github.com/entrostat/road-protect-fleet/commit/63df0e70685a483896f391df6d9b509593d55b6c))

### [2.57.17](https://github.com/entrostat/road-protect-fleet/compare/v2.57.16...v2.57.17) (2020-12-22)


### Bug Fixes

* **performance:** Reduced the number of jobs that we can run at the same time ([cd47627](https://github.com/entrostat/road-protect-fleet/commit/cd47627d18efe99638c5b070dcdeedd443c1ef29))

### [2.57.16](https://github.com/entrostat/road-protect-fleet/compare/v2.57.15...v2.57.16) (2020-12-22)


### Bug Fixes

* **infringements:** Convert the reason to a string ([a2788f3](https://github.com/entrostat/road-protect-fleet/commit/a2788f3db5f21cc94de698cacc63ab7e6b8e4a1a))

### [2.57.15](https://github.com/entrostat/road-protect-fleet/compare/v2.57.14...v2.57.15) (2020-12-22)


### Bug Fixes

* **timezones:** Use the default timezone from the config if necessary ([5f1f296](https://github.com/entrostat/road-protect-fleet/commit/5f1f296321d9f28ddba91e856e3ff1d774acf473))

### [2.57.14](https://github.com/entrostat/road-protect-fleet/compare/v2.57.13...v2.57.14) (2020-12-22)


### Bug Fixes

* **performance:** Updated the concurrency count for speedup ([1addb41](https://github.com/entrostat/road-protect-fleet/commit/1addb416d2c1b65d0d399550b5d8b55bb44f8d38))

### [2.57.13](https://github.com/entrostat/road-protect-fleet/compare/v2.57.12...v2.57.13) (2020-12-22)


### Bug Fixes

* **timezones:** Use a default timezone or one on the row if it's there ([c309e30](https://github.com/entrostat/road-protect-fleet/commit/c309e30f5ad7a8a6d95ef00e966fc542de64d401))

### [2.57.12](https://github.com/entrostat/road-protect-fleet/compare/v2.57.11...v2.57.12) (2020-12-21)


### Bug Fixes

* **contract-dates:** I need to convert the 10pms to the next day ([fbe2d30](https://github.com/entrostat/road-protect-fleet/commit/fbe2d3050b63bb97d5256d80698daf6049774837))
* **contract-dates:** Remove timezone issues from contracts ([30a418b](https://github.com/entrostat/road-protect-fleet/commit/30a418b4dcabaa371776f05749323091fac8a6ab))
* **contract-dates:** Set the dates on contracts using the new fix date function ([0098dfa](https://github.com/entrostat/road-protect-fleet/commit/0098dfaf4f0951700709f149a310b493d5bc799e))
* **contract-dates:** Set the shifted date equal to the shifted date ([490f436](https://github.com/entrostat/road-protect-fleet/commit/490f43639a9d9e50535bfe35c22279588f50c794))
* **contracts:** Added the logic to rectify the contract dates ([ba2ffad](https://github.com/entrostat/road-protect-fleet/commit/ba2ffad2eb6f242b523c83eb0e4674fd7d0773e7))

### [2.57.11](https://github.com/entrostat/road-protect-fleet/compare/v2.57.10...v2.57.11) (2020-12-21)


### Bug Fixes

* **duplicate-infringements:** Run the script to save the new infringement numbers to the system ([3cd1770](https://github.com/entrostat/road-protect-fleet/commit/3cd1770b12b648cc7580e19eceae6e59bcde6fb7))

### [2.57.10](https://github.com/entrostat/road-protect-fleet/compare/v2.57.9...v2.57.10) (2020-12-21)


### Bug Fixes

* **duplicate-infringements:** Added the ability to run through all of the infringements and correct the notice numbers ([2573a37](https://github.com/entrostat/road-protect-fleet/commit/2573a3787ee322598b905adb777355f17fc793cf))
* **duplicate-infringements:** Added the decorators that are used to remove special characters and leading zeros from infringements ([fd48f49](https://github.com/entrostat/road-protect-fleet/commit/fd48f49da642828dd0ff4b287b0f90f3ab73b180))

### [2.57.9](https://github.com/entrostat/road-protect-fleet/compare/v2.57.8...v2.57.9) (2020-12-21)


### Bug Fixes

* **duplicate-infringements:** Added the actual infringement ids so that they can be deleted ([45c05e6](https://github.com/entrostat/road-protect-fleet/commit/45c05e615f066dd8dbb8f329ecefa97e035a8810))

### [2.57.8](https://github.com/entrostat/road-protect-fleet/compare/v2.57.7...v2.57.8) (2020-12-21)


### Bug Fixes

* **duplicate-infringments:** Added the ability to create a csv from the duplicate infringements ([1dff122](https://github.com/entrostat/road-protect-fleet/commit/1dff1229292fba2fc399bcf598eab9e3935129c9))

### [2.57.7](https://github.com/entrostat/road-protect-fleet/compare/v2.57.6...v2.57.7) (2020-12-21)


### Bug Fixes

* **dupliate-infringements:** Group by the issuer so that the unique constraint is the same as the database ([7c9450f](https://github.com/entrostat/road-protect-fleet/commit/7c9450f801a6cc22c3314b7df27a1e8b70269467))

### [2.57.6](https://github.com/entrostat/road-protect-fleet/compare/v2.57.5...v2.57.6) (2020-12-21)


### Bug Fixes

* **duplicate-infringements:** Don't do multiple joins to reduce the load on the server ([89a4024](https://github.com/entrostat/road-protect-fleet/commit/89a4024ef018e980ce870bfafaaf097329fad2e3))

### [2.57.5](https://github.com/entrostat/road-protect-fleet/compare/v2.57.4...v2.57.5) (2020-12-21)


### Bug Fixes

* **duplicate-infringements:** Added the ability to find duplicate infringements (don't perform any actions yet) ([90842dc](https://github.com/entrostat/road-protect-fleet/commit/90842dcb88da9c7218a9e13ba4119cc622f70df1))
* **verify-infringement:** Refresh nomination and infringement on store after verifying infringement ([e94a714](https://github.com/entrostat/road-protect-fleet/commit/e94a714522ce4f0e87f532843b8136ba69d4b0e0)), closes [#373](https://github.com/entrostat/road-protect-fleet/issues/373)

### [2.57.4](https://github.com/entrostat/road-protect-fleet/compare/v2.57.3...v2.57.4) (2020-12-21)


### Bug Fixes

* **fix-nominations:** Remove the type of nomination before relinking ([ec33de5](https://github.com/entrostat/road-protect-fleet/commit/ec33de57e6d0fe3a66478523c1d07d98f6b3c212))

### [2.57.3](https://github.com/entrostat/road-protect-fleet/compare/v2.57.2...v2.57.3) (2020-12-21)


### Bug Fixes

* **fix-nominations:** For now I'm only going to modify infringements that didn't have a redirection type ([87c7e8d](https://github.com/entrostat/road-protect-fleet/commit/87c7e8d40db25b9a66accfb45846a2e250f9995d))

### [2.57.2](https://github.com/entrostat/road-protect-fleet/compare/v2.57.1...v2.57.2) (2020-12-20)


### Bug Fixes

* **invalid-redirections-controller:** Fixed the endpoint to call to check the invalid redirections ([d14de7c](https://github.com/entrostat/road-protect-fleet/commit/d14de7c2a0183e44737e877352d76afa0494e192))

### [2.57.1](https://github.com/entrostat/road-protect-fleet/compare/v2.57.0...v2.57.1) (2020-12-20)


### Bug Fixes

* **invalid-redirections:** Added the service and controller to find invalid redirections ([9d111f3](https://github.com/entrostat/road-protect-fleet/commit/9d111f35552a7b5a3f651f1206d56c7bc4446ef6))

## [2.57.0](https://github.com/entrostat/road-protect-fleet/compare/v2.56.3...v2.57.0) (2020-12-20)


### Features

* **redirections:** Added the frontend filter for invalid redirections ([3491e27](https://github.com/entrostat/road-protect-fleet/commit/3491e27a06746b2ba9fd8c65f59ea90bcaa99245)), closes [#369](https://github.com/entrostat/road-protect-fleet/issues/369)
* **redirections:** Refactored the logic to block redirections when the identifier is specified and we are trying to redirect infringements to identifiers that do not match ([993afc4](https://github.com/entrostat/road-protect-fleet/commit/993afc47e9d8a0e5cb4ae4baf0007546358972e2)), closes [#368](https://github.com/entrostat/road-protect-fleet/issues/368)

### [2.56.3](https://github.com/entrostat/road-protect-fleet/compare/v2.56.2...v2.56.3) (2020-12-18)


### Bug Fixes

* **manual-redirections:** Don't allow manual redirections to the same account as the brn on the current infringement ([2553e9b](https://github.com/entrostat/road-protect-fleet/commit/2553e9b03330bb44e99ba1e426e21554b314e623))
* **manual-redirections:** Only change the BRN on the infringement when the redirection goes through ([388a261](https://github.com/entrostat/road-protect-fleet/commit/388a261d80beff5af305e501b922c0381e241993))

### [2.56.2](https://github.com/entrostat/road-protect-fleet/compare/v2.56.1...v2.56.2) (2020-12-18)


### Bug Fixes

* **manual-redirections:** Set the BRN of the infringement to the BRN that it's being manually redirected to ([28de403](https://github.com/entrostat/road-protect-fleet/commit/28de403b596904f23982cb9ddb3d9217880bce51))

### [2.56.1](https://github.com/entrostat/road-protect-fleet/compare/v2.56.0...v2.56.1) (2020-12-18)


### Bug Fixes

* **redirections:** Allow redirections to take place when it is already in progress ([62558a4](https://github.com/entrostat/road-protect-fleet/commit/62558a4845fa6f16827bb674be10a0a4f6f3900b))

## [2.56.0](https://github.com/entrostat/road-protect-fleet/compare/v2.55.3...v2.56.0) (2020-12-18)


### Features

* **devops:** Added the ability to build or pull the backend and frontend images ([04e4c1e](https://github.com/entrostat/road-protect-fleet/commit/04e4c1ea87f5fb947398bed19d3fb92ac3649e6f))

### [2.55.3](https://github.com/entrostat/road-protect-fleet/compare/v2.55.2...v2.55.3) (2020-12-18)


### Bug Fixes

* **redirections:** Don't set the status to pending once the infringement has been redirected, set it to acknowledged ([d5695c0](https://github.com/entrostat/road-protect-fleet/commit/d5695c0ec2fd958f9278ba50439db87085cd1db1))

### [2.55.2](https://github.com/entrostat/road-protect-fleet/compare/v2.55.1...v2.55.2) (2020-12-18)


### Bug Fixes

* **infringement-report:** Only report on infringements owned by the sender ([08d8e52](https://github.com/entrostat/road-protect-fleet/commit/08d8e52b9a6d4b185a2564fedf50771a32864b90))
* **redirection-email:** CC all redirection emails to support@roadprotect.co.il ([1354c23](https://github.com/entrostat/road-protect-fleet/commit/1354c23eff7c7d442c665ff5c670f09572b37786))

### [2.55.1](https://github.com/entrostat/road-protect-fleet/compare/v2.55.0...v2.55.1) (2020-12-18)


### Bug Fixes

* **migrations:** Archived the migrations that have run ([951f53c](https://github.com/entrostat/road-protect-fleet/commit/951f53c8e7ab61582c1ce7521bf445aff524dcbc))
* **nomination:** The nomination does not always exist on an infringement so the type could be undefined when looking for the power of attorney ([3658b34](https://github.com/entrostat/road-protect-fleet/commit/3658b3434c05fd78172ad0f6adb7c530b5002511))

## [2.55.0](https://github.com/entrostat/road-protect-fleet/compare/v2.54.0...v2.55.0) (2020-12-18)


### Features

* **redirections:** Pull the power of attorney from the account matching the BRN on the infringement or the owner of the vehicle. Finally, if neither of those are available and the nominated account is a Municipal redirection, we try with the nominated account. ([5cefd0f](https://github.com/entrostat/road-protect-fleet/commit/5cefd0f37589b234ed875f63222d9b4a42889e84)), closes [#360](https://github.com/entrostat/road-protect-fleet/issues/360)


### Bug Fixes

* **raw-infringement:** Issuer and notice number corrected for manual insert raw infringement ([95f5f66](https://github.com/entrostat/road-protect-fleet/commit/95f5f666c401c50b4c48bad86fbd99a21ccd73b8)), closes [#359](https://github.com/entrostat/road-protect-fleet/issues/359)

## [2.54.0](https://github.com/entrostat/road-protect-fleet/compare/v2.53.6...v2.54.0) (2020-12-17)


### Features

* **redirection-template:**  Change default signature size, show Ore's name in Hebrew and change the display of the Issuer in the redirection template ([704e1f5](https://github.com/entrostat/road-protect-fleet/commit/704e1f5d9aa3ee9f0674d2c82af92979f448a3ea))

### [2.53.6](https://github.com/entrostat/road-protect-fleet/compare/v2.53.5...v2.53.6) (2020-12-17)


### Bug Fixes

* **security:** Allow for JSON parsing to fail as well ([aa60e12](https://github.com/entrostat/road-protect-fleet/commit/aa60e12b33bd7435b4d204a3a11a2e0d03513f4f))

### [2.53.5](https://github.com/entrostat/road-protect-fleet/compare/v2.53.4...v2.53.5) (2020-12-17)


### Bug Fixes

* **security:** Don't throw decryption failures when we're in staging or development ([8f0c22a](https://github.com/entrostat/road-protect-fleet/commit/8f0c22a564864d2b423845eda1ca59279d7ea8b5))

### [2.53.4](https://github.com/entrostat/road-protect-fleet/compare/v2.53.3...v2.53.4) (2020-12-17)


### Bug Fixes

* **logging:** Removed the log of the extraction of redirection address because it's clogging the logs but not necessary ([0e77d65](https://github.com/entrostat/road-protect-fleet/commit/0e77d657d14ddfe0c0f38854315e5c5713351ef4))

### [2.53.3](https://github.com/entrostat/road-protect-fleet/compare/v2.53.2...v2.53.3) (2020-12-17)


### Bug Fixes

* **country:** Added Israel as the default country when setting the location dto ([af54b55](https://github.com/entrostat/road-protect-fleet/commit/af54b5553e1a9e5f9023a279df2a430ecce72fe4))

### [2.53.2](https://github.com/entrostat/road-protect-fleet/compare/v2.53.1...v2.53.2) (2020-12-17)


### Bug Fixes

* **upsert-infringements:** Removed the transactional decorator on the upsert functions so that we can still write raw infringements ([d1e7c13](https://github.com/entrostat/road-protect-fleet/commit/d1e7c13930b72117893c560aabecef9c4386f8ff))

### [2.53.1](https://github.com/entrostat/road-protect-fleet/compare/v2.53.0...v2.53.1) (2020-12-16)


### Bug Fixes

* **logger:** Use Winston as the error logger anyway ([8932703](https://github.com/entrostat/road-protect-fleet/commit/8932703c07d1da69f24a2bc51589111706a66302))

## [2.53.0](https://github.com/entrostat/road-protect-fleet/compare/v2.52.0...v2.53.0) (2020-12-16)


### Features

* **redirection-template:**  Set the logo height to be the same for all logos in the redirection template ([dad600f](https://github.com/entrostat/road-protect-fleet/commit/dad600f6e74d2a06fa585ca677abb346acb705b2))


### Bug Fixes

* **logger:** Catch errors with Winston fails and at that point just console log directly ([8fc0134](https://github.com/entrostat/road-protect-fleet/commit/8fc0134549fe1ab4dfed3c76211bee755ade0818))

## [2.52.0](https://github.com/entrostat/road-protect-fleet/compare/v2.51.3...v2.52.0) (2020-12-14)


### Features

* **latest-payment-date:** Don't display time when showing the latest payment date ([de27689](https://github.com/entrostat/road-protect-fleet/commit/de27689ae599d02588b9fd0d7056db7c4057088b))


### Bug Fixes

* **infringement-report-test:** Setup the database for the infringement report tests within the transaction ([aa14204](https://github.com/entrostat/road-protect-fleet/commit/aa1420402e49ae5e488865e793bb5a70b4e298af))
* **tests:** Close the test app after all the tests have run ([00abccc](https://github.com/entrostat/road-protect-fleet/commit/00abccc66c9cfe0183185cb63b6f0b1eeca67888))
* **upsert-infringement:** Chunk the query that looks for existing infringements ([7d0a4fd](https://github.com/entrostat/road-protect-fleet/commit/7d0a4fdbfdf607ba391c3213de671dd2a862d801)), closes [#351](https://github.com/entrostat/road-protect-fleet/issues/351)

### [2.51.3](https://github.com/entrostat/road-protect-fleet/compare/v2.51.2...v2.51.3) (2020-12-12)


### Bug Fixes

* **missing-nominations:** Cater for null accounts when looking at the redirection identifier ([a71f23b](https://github.com/entrostat/road-protect-fleet/commit/a71f23b886c74512509f228013997e64e69b4aff))

### [2.51.2](https://github.com/entrostat/road-protect-fleet/compare/v2.51.1...v2.51.2) (2020-12-12)


### Bug Fixes

* **auth:** Need to use the user auth guard with the system admin guard ([3a486dc](https://github.com/entrostat/road-protect-fleet/commit/3a486dca482e96981728d31bca539f2cfec7f587))

### [2.51.1](https://github.com/entrostat/road-protect-fleet/compare/v2.51.0...v2.51.1) (2020-12-12)


### Bug Fixes

* **deploy:** Typo in missing infringment service ([0086652](https://github.com/entrostat/road-protect-fleet/commit/00866528f82c310a52c549870ebcb74fbbd9e0c1))

## [2.51.0](https://github.com/entrostat/road-protect-fleet/compare/v2.50.0...v2.51.0) (2020-12-12)


### Features

* **nominations:** Added the ability to fix the infringements that are missing nominations ([a4d78d0](https://github.com/entrostat/road-protect-fleet/commit/a4d78d057e05850ed3f6049d2ebd19a8a7d45828))

## [2.50.0](https://github.com/entrostat/road-protect-fleet/compare/v2.49.1...v2.50.0) (2020-12-12)


### Features

* **nominations:** Added the ability to pull infringements with missing nominations ([62c8619](https://github.com/entrostat/road-protect-fleet/commit/62c8619822162e9251b11dceb0b4f6914e1d3636)), closes [#344](https://github.com/entrostat/road-protect-fleet/issues/344)

### [2.49.1](https://github.com/entrostat/road-protect-fleet/compare/v2.49.0...v2.49.1) (2020-12-12)


### Bug Fixes

* **automatic-nomination:** Added the ability to redirect a nomination to a BRN that is not on the system using the redirection identifier logic ([8b2a1ea](https://github.com/entrostat/road-protect-fleet/commit/8b2a1ea32f7e23b05d2cc18bab9db897e9dfb11e)), closes [#343](https://github.com/entrostat/road-protect-fleet/issues/343)

## [2.49.0](https://github.com/entrostat/road-protect-fleet/compare/v2.48.0...v2.49.0) (2020-12-11)


### Features

* **email-redirection-template:** Adapt the email redirection template to enable the optional fleet management logo and vehicle officer approval image to the redirection template document ([07cf941](https://github.com/entrostat/road-protect-fleet/commit/07cf941e52af3ffe89aa4d104d0f199aac1c8f82))
* **infringement-upsert:** Added the ability to choose multiple or no issuers during the infringement upload ([094d052](https://github.com/entrostat/road-protect-fleet/commit/094d0524f301622e87b0ebeee09fff399305f759)), closes [#341](https://github.com/entrostat/road-protect-fleet/issues/341)
* **manual-status-changes:** Add a simple manual status change option as well as the existing advanced method ([e966b4d](https://github.com/entrostat/road-protect-fleet/commit/e966b4d4590ff14f93794cda0dc0596fb2223610))

## [2.48.0](https://github.com/entrostat/road-protect-fleet/compare/v2.47.1...v2.48.0) (2020-12-10)


### Features

* **old-fleets:** Disabled the sync with Ahmad's system ([35f4f07](https://github.com/entrostat/road-protect-fleet/commit/35f4f07bf80ebebd1951c5a9a57e8eaf6d270661))

### [2.47.1](https://github.com/entrostat/road-protect-fleet/compare/v2.47.0...v2.47.1) (2020-12-10)


### Bug Fixes

* **infringement-statuses:** Set the status from outstanding to due if the total amount is equal to the original amount ([379def5](https://github.com/entrostat/road-protect-fleet/commit/379def5d0cc02f8d81ab8e077635ad9975bfde8b))
* **status-mapper:** Don't map statuses as outstanding, rather leave as due ([59460a2](https://github.com/entrostat/road-protect-fleet/commit/59460a2268cbe1a162c67f693da37aff379a34fc))

## [2.47.0](https://github.com/entrostat/road-protect-fleet/compare/v2.46.1...v2.47.0) (2020-12-10)


### Features

* **spreadsheet-upload:** Parse the data on the backend for spreadsheets instead of passing it from the frontend. This allows the dates and timezones to be more consistent. ([5ec6316](https://github.com/entrostat/road-protect-fleet/commit/5ec63166cc2a2c2b101585b24dd3847d3b9f808e)), closes [#331](https://github.com/entrostat/road-protect-fleet/issues/331)


### Bug Fixes

* **code:** Removed console log ([7a1d5c7](https://github.com/entrostat/road-protect-fleet/commit/7a1d5c7a426ac201dd6e0675b888c38858ecaace))
* **spreadsheet-upload:** Added the ability to convert date to string before reading the spreadsheet ([e23a2ba](https://github.com/entrostat/road-protect-fleet/commit/e23a2ba86cf9afdc6cba68c9953c4e7b32ac5acd))
* **spreadsheet-upload:** Read the data in as raw and ignore date parsing in the spreadsheet ([809f98a](https://github.com/entrostat/road-protect-fleet/commit/809f98a25f0242a90c8818855aa6ca8173f3fba9))

### [2.46.1](https://github.com/entrostat/road-protect-fleet/compare/v2.46.0...v2.46.1) (2020-12-09)


### Bug Fixes

* **logger:** Remove circular dependency in the logger ([dabe4be](https://github.com/entrostat/road-protect-fleet/commit/dabe4bedaadd15c5c9ad51a40e6c9b1fe5aacd23))

## [2.46.0](https://github.com/entrostat/road-protect-fleet/compare/v2.45.1...v2.46.0) (2020-12-08)


### Features

* **infringement-report:** Remove penalty amount from infringement reporting and add total original amount. Remove newline characters  ([b98c202](https://github.com/entrostat/road-protect-fleet/commit/b98c20263da7d722f89f9803220a384b928bd5e1))


### Bug Fixes

* **infringement-table:** Sort the table by descending date of offence by default, show reason in tool-tip over location field ([1371b11](https://github.com/entrostat/road-protect-fleet/commit/1371b1118dae2b13a13911807e3096e5b30951b6))

### [2.45.1](https://github.com/entrostat/road-protect-fleet/compare/v2.45.0...v2.45.1) (2020-12-05)


### Bug Fixes

* **infringements:** Remove the starting 'C' and last '0' on infringements ([95087b6](https://github.com/entrostat/road-protect-fleet/commit/95087b6aef0796d53f7c926e3e6fb3f1d752a201)), closes [#320](https://github.com/entrostat/road-protect-fleet/issues/320)

## [2.45.0](https://github.com/entrostat/road-protect-fleet/compare/v2.44.9...v2.45.0) (2020-12-04)


### Features

* **infringement-table:** Change the order of columns of the infringement table as well as the items in the table ([9a0a172](https://github.com/entrostat/road-protect-fleet/commit/9a0a172d80f93fed4eca04f670b07b570148a6df))

### [2.44.9](https://github.com/entrostat/road-protect-fleet/compare/v2.44.8...v2.44.9) (2020-12-04)


### Bug Fixes

* **permissions:** Fix permissions error that caused popup saying that user doesn't have permission ([d1d3ffd](https://github.com/entrostat/road-protect-fleet/commit/d1d3ffd24c85828a6516598276bfac20d79ccebe))

### [2.44.8](https://github.com/entrostat/road-protect-fleet/compare/v2.44.7...v2.44.8) (2020-12-03)


### Bug Fixes

* **lease-contract:** Fixed the labels on the lease contract upload screen ([d1ea5fd](https://github.com/entrostat/road-protect-fleet/commit/d1ea5fdfde6b6896d54dca3d467c2fc372d5444d))

### [2.44.7](https://github.com/entrostat/road-protect-fleet/compare/v2.44.6...v2.44.7) (2020-12-03)


### Bug Fixes

* **redirection-message:** Fixed the redirection message when a nomination is manually redirected ([4637c69](https://github.com/entrostat/road-protect-fleet/commit/4637c690a8a17377d7e7f34010507d74d1fa0e2c))

### [2.44.6](https://github.com/entrostat/road-protect-fleet/compare/v2.44.5...v2.44.6) (2020-12-03)


### Bug Fixes

* **build:** Npm ci frontend was failing so deleted package-lock.json and reinstalled node modules ([6b14191](https://github.com/entrostat/road-protect-fleet/commit/6b1419193e5e5f098fbf4b79360e9e40ff952bc7))
* **devops:** Removed es5 browser support ([7326316](https://github.com/entrostat/road-protect-fleet/commit/73263161c9153106922eb9d18a69c00903f8c4a6))
* **devops:** Upgraded the production frontend node version to 12 lts ([38f8533](https://github.com/entrostat/road-protect-fleet/commit/38f85333032e6f00cbcc600e88821258cb6846f0))
* **raw-infringement:** Added filter for notice number on raw infringement log ([a42064e](https://github.com/entrostat/road-protect-fleet/commit/a42064e55f67b65a91de061fae8f764383ae726d)), closes [#314](https://github.com/entrostat/road-protect-fleet/issues/314)

### [2.44.5](https://github.com/entrostat/road-protect-fleet/compare/v2.44.4...v2.44.5) (2020-12-03)


### Bug Fixes

* **manual-redirection-template:** Fix address population of the address and date formatting on the redirection template ([9be7142](https://github.com/entrostat/road-protect-fleet/commit/9be714252f9cc59485276cecfbc177ba4ef5a37d))

### [2.44.4](https://github.com/entrostat/road-protect-fleet/compare/v2.44.3...v2.44.4) (2020-12-01)


### Bug Fixes

* **testing:** Commented out the tests that use the document api ([8af0dd2](https://github.com/entrostat/road-protect-fleet/commit/8af0dd2492d96806770bdc91b84b32aa40072f1b))
* **testing:** Trying to create a storge directory ([014ce0d](https://github.com/entrostat/road-protect-fleet/commit/014ce0d58a1c93e7672d9b5429c970497df04a2b))

### [2.44.3](https://github.com/entrostat/road-protect-fleet/compare/v2.44.2...v2.44.3) (2020-12-01)


### Bug Fixes

* **tests:** Don't omit the BRN when running an infringement update ([c949786](https://github.com/entrostat/road-protect-fleet/commit/c949786f882da4f66bb4c5138f35d0976efb1d3d))

### [2.44.2](https://github.com/entrostat/road-protect-fleet/compare/v2.44.1...v2.44.2) (2020-12-01)


### Bug Fixes

* **tests:** Added a test for daylight savings ([cb2918d](https://github.com/entrostat/road-protect-fleet/commit/cb2918db0db7dcab12c3ff76053bcaea60a2f0bb))

### [2.44.1](https://github.com/entrostat/road-protect-fleet/compare/v2.44.0...v2.44.1) (2020-12-01)


### Bug Fixes

* **timezones:** Ensure that we pull the daylight savings timezone shift when possible ([074068c](https://github.com/entrostat/road-protect-fleet/commit/074068c0257d4fc9f017f238701691b5c899fb00))

## [2.44.0](https://github.com/entrostat/road-protect-fleet/compare/v2.43.0...v2.44.0) (2020-12-01)


### Features

* **redirections:** Allow the redirection of an infringement that is in the pending or acknowledged status to go to redirection complete ([4dc328c](https://github.com/entrostat/road-protect-fleet/commit/4dc328c9948ba29ecadb99417066e6e94b9f38d5)), closes [#307](https://github.com/entrostat/road-protect-fleet/issues/307)


### Bug Fixes

* **test:** Updated the account tests to allow for the new address requirements ([be67219](https://github.com/entrostat/road-protect-fleet/commit/be67219d96c91d1914655654fa83bfd4ff8aceaa)), closes [#304](https://github.com/entrostat/road-protect-fleet/issues/304)

## [2.43.0](https://github.com/entrostat/road-protect-fleet/compare/v2.42.0...v2.43.0) (2020-11-30)


### Features

* **nomination-type:** Removed the old nomination types and replaced the old types with the new ones ([17079f4](https://github.com/entrostat/road-protect-fleet/commit/17079f4bb0efe4c86a455598ea95990b01072be4)), closes [#306](https://github.com/entrostat/road-protect-fleet/issues/306)

## [2.42.0](https://github.com/entrostat/road-protect-fleet/compare/v2.41.0...v2.42.0) (2020-11-30)


### Features

* **edit-status:** Allow user to select any nomination status and infringement status given that it is a valid combination ([1200bac](https://github.com/entrostat/road-protect-fleet/commit/1200bac2788ba2be4fd3ac4dfdbae3d3472301d0))
* **redirection-type:** Modified the redirection type to be more descriptive and added the Upload option ([61f2e89](https://github.com/entrostat/road-protect-fleet/commit/61f2e89b1829dc72a589007c5af29fd0fde7827d)), closes [#305](https://github.com/entrostat/road-protect-fleet/issues/305)


### Bug Fixes

* **atg-verify:** Use manual redirections to update nomination on receiving atg verify request but also update brn ([8f76cc4](https://github.com/entrostat/road-protect-fleet/commit/8f76cc476c415f8cc8aafce915eb15f88d0dd2fc)), closes [#302](https://github.com/entrostat/road-protect-fleet/issues/302)

## [2.41.0](https://github.com/entrostat/road-protect-fleet/compare/v2.40.4...v2.41.0) (2020-11-30)


### Features

* **issuer-dropdown:** Issuer autocomplete for all issuer name filters ([d338c8c](https://github.com/entrostat/road-protect-fleet/commit/d338c8c3602706a9192278af32f4cf67f8cdf3d8))


### Bug Fixes

* **atg-verify:** Fields for amount and penalty switch for this mapper ([d0c65ee](https://github.com/entrostat/road-protect-fleet/commit/d0c65ee217c3c07e3d168ebcb0686d51c4454a79)), closes [#300](https://github.com/entrostat/road-protect-fleet/issues/300)
* **atg-verify:** Set brn on infringemenet dto during update to ensure that redirection takes place via municipal flow instead of manual ([69286e9](https://github.com/entrostat/road-protect-fleet/commit/69286e9afbc1c1c8a67171ff40ef29bf9e7042e0)), closes [#301](https://github.com/entrostat/road-protect-fleet/issues/301)
* **redirections:** Set street number to postOfficeBox rather than zip code when redirecting with postal address ([cd534ea](https://github.com/entrostat/road-protect-fleet/commit/cd534ea200d3d27c2ce4e1e317bc2d1dae94024a)), closes [#298](https://github.com/entrostat/road-protect-fleet/issues/298)

### [2.40.4](https://github.com/entrostat/road-protect-fleet/compare/v2.40.2...v2.40.4) (2020-11-28)


### Bug Fixes

* **atg-verify:** Added trim transform and applied to ATG dtos ([0bfb11a](https://github.com/entrostat/road-protect-fleet/commit/0bfb11a0fd30eb70438763b2ff74308455303365)), closes [#297](https://github.com/entrostat/road-protect-fleet/issues/297)
* **logger:** Log detail[key] instead of result[key] (which is undefined) ([d3bb82c](https://github.com/entrostat/road-protect-fleet/commit/d3bb82cf4cb5a994fec0104b5af5c0660f92d41f))
* **logger:** Return the original value for the logger if something goes wrong ([aba0c7e](https://github.com/entrostat/road-protect-fleet/commit/aba0c7e6d1f495f5ecfa314a11e95dfac1a8466e))

### [2.40.3](https://github.com/entrostat/road-protect-fleet/compare/v2.40.2...v2.40.3) (2020-11-27)


### Bug Fixes

* **atg-verify:** Added trim transform and applied to ATG dtos ([0bfb11a](https://github.com/entrostat/road-protect-fleet/commit/0bfb11a0fd30eb70438763b2ff74308455303365)), closes [#297](https://github.com/entrostat/road-protect-fleet/issues/297)
* **logger:** Log detail[key] instead of result[key] (which is undefined) ([d3bb82c](https://github.com/entrostat/road-protect-fleet/commit/d3bb82cf4cb5a994fec0104b5af5c0660f92d41f))

### [2.40.2](https://github.com/entrostat/road-protect-fleet/compare/v2.40.1...v2.40.2) (2020-11-27)


### Bug Fixes

* **redirections:** Set the house number to postal code on postal address ([673fc4f](https://github.com/entrostat/road-protect-fleet/commit/673fc4fe8cbe82945b2cc1384d74ffa016aeed4d))

### [2.40.1](https://github.com/entrostat/road-protect-fleet/compare/v2.40.0...v2.40.1) (2020-11-27)


### Bug Fixes

* **redirections:** Set the street number to an empty string ([ed4db0f](https://github.com/entrostat/road-protect-fleet/commit/ed4db0f61c91f981dca9701361e87910c7394df8))

## [2.40.0](https://github.com/entrostat/road-protect-fleet/compare/v2.39.4...v2.40.0) (2020-11-27)


### Features

* **infringement-view:** Change order of fields displayed in infringement view  ([730a64e](https://github.com/entrostat/road-protect-fleet/commit/730a64e5dcbc4d848e669d038503df613b28b3d7))


### Bug Fixes

* **update-infringement:** Check for the date letter sent key in order to trigger a relink of the infringement ([c9ae937](https://github.com/entrostat/road-protect-fleet/commit/c9ae937d1fbe8c9303413528f1faeae7a542af87))

### [2.39.4](https://github.com/entrostat/road-protect-fleet/compare/v2.39.3...v2.39.4) (2020-11-26)


### Bug Fixes

* **nominations:** Return from the manual nominations if they fail ([8d1f13f](https://github.com/entrostat/road-protect-fleet/commit/8d1f13f0417784c9d3bf95d13555525e785d1aee))

### [2.39.3](https://github.com/entrostat/road-protect-fleet/compare/v2.39.2...v2.39.3) (2020-11-26)


### Bug Fixes

* **logging:** Remove exceptions from logs ([55e2491](https://github.com/entrostat/road-protect-fleet/commit/55e24913931639c870e4d2c8227ef0fbb3da3917))

### [2.39.2](https://github.com/entrostat/road-protect-fleet/compare/v2.39.1...v2.39.2) (2020-11-26)


### Bug Fixes

* **logging:** Never log an exception object ([3c7c9fc](https://github.com/entrostat/road-protect-fleet/commit/3c7c9fcaf8437b264a5bc289657622b0fc2d47dc))

### [2.39.1](https://github.com/entrostat/road-protect-fleet/compare/v2.39.0...v2.39.1) (2020-11-26)


### Bug Fixes

* **logging:** Don't log the full error ([0f41871](https://github.com/entrostat/road-protect-fleet/commit/0f41871a3c46c19f83d8e4261e32598da1cac9c7))

## [2.39.0](https://github.com/entrostat/road-protect-fleet/compare/v2.38.0...v2.39.0) (2020-11-26)


### Features

* **api:** Prevent updates to address on v1 update account endpoint which is used by Taavura ([2f8046d](https://github.com/entrostat/road-protect-fleet/commit/2f8046df5bf37e606c6976b8853cb628d2791794)), closes [#294](https://github.com/entrostat/road-protect-fleet/issues/294)
* **infringement-view:** Change order of fields displayed in infringement view and add a collapsible menu to see more details ([86d36ba](https://github.com/entrostat/road-protect-fleet/commit/86d36ba6bbe24f8830288850e2622d4238e1269e))


### Bug Fixes

* **coding-practices:** Removed the console log in the upsert service ([34c4a29](https://github.com/entrostat/road-protect-fleet/commit/34c4a29f52eaf40ee2a9e576eb553f1fb7c8118a))

## [2.38.0](https://github.com/entrostat/road-protect-fleet/compare/v2.37.0...v2.38.0) (2020-11-26)


### Features

* **atg-verify:** Scheduler to check redirected infringements for verifiable providers (CRON job not currently activated) ([d8aef88](https://github.com/entrostat/road-protect-fleet/commit/d8aef88a0604b05886dc535736b41ca77d957055)), closes [#291](https://github.com/entrostat/road-protect-fleet/issues/291)


### Bug Fixes

* **error-handling:** Throw an error if the spreadsheet upload fails on a row ([a5cf731](https://github.com/entrostat/road-protect-fleet/commit/a5cf731e8207e19075a5afc99d70f53c1948dcb2))
* **infringement-logger:** Added the ability to log infringement errors outside of a transaction so that it saves even if the data doesn't ([320ccde](https://github.com/entrostat/road-protect-fleet/commit/320ccde406bc4298a26ec30b9efb73fcc7c0fe7a)), closes [#292](https://github.com/entrostat/road-protect-fleet/issues/292)

## [2.37.0](https://github.com/entrostat/road-protect-fleet/compare/v2.36.1...v2.37.0) (2020-11-26)


### Features

* **atg-verify:** Scheduler to check unpaid infringements for verifiable providers (CRON job not currently activated) ([9806186](https://github.com/entrostat/road-protect-fleet/commit/9806186df0324f0f3782e9e32affc3b5d21adb87)), closes [#290](https://github.com/entrostat/road-protect-fleet/issues/290)


### Bug Fixes

* **seeders:** Updated the names in the seeders ([608ce6f](https://github.com/entrostat/road-protect-fleet/commit/608ce6f39ee16942e1178951cec6b6a707bc1205))
* **update-infringements:** Prioritise rules over issuer status since we do not have a lot of rules but they should take preference ([15c6ed6](https://github.com/entrostat/road-protect-fleet/commit/15c6ed69741202a66c1f0aa7d154bd2a5039ff72))

### [2.36.1](https://github.com/entrostat/road-protect-fleet/compare/v2.36.0...v2.36.1) (2020-11-26)


### Bug Fixes

* **upsert-verification:** The verification of an upserted spreadsheet was failing due to a clash in endpoints ([ffe8ece](https://github.com/entrostat/road-protect-fleet/commit/ffe8eceb5ee5e8c1a7ca0b5651e1c948865cca58)), closes [#289](https://github.com/entrostat/road-protect-fleet/issues/289)

## [2.36.0](https://github.com/entrostat/road-protect-fleet/compare/v2.35.1...v2.36.0) (2020-11-25)


### Features

* **edit-status:** Separate infringement and nomination status edits ([e2a4852](https://github.com/entrostat/road-protect-fleet/commit/e2a485249623d4bc53d2077dbbb53554b29617be))
* **edit-status:** Submit changes to infringement and nomination status ([efb567a](https://github.com/entrostat/road-protect-fleet/commit/efb567a1580af2aa23f7b7d6621cd40b28e7fe11))
* **edit-status:** User can edit infringement and nomination statuses if it is a valid transition ([8ef69ca](https://github.com/entrostat/road-protect-fleet/commit/8ef69ca2a42fd3f0613bf0d4840b16e780874e0e))
* **infringement-status:** Select infringement status to edit depending on selected nomination status ([c9531c5](https://github.com/entrostat/road-protect-fleet/commit/c9531c574b6a4a52401be8f318bd8a845a672eb9))
* **nomination-status:** Additional inputs depending on selected nomination status ([ae49338](https://github.com/entrostat/road-protect-fleet/commit/ae4933891016ff830f4b33c46c6928fcf00ea68c))
* **nomination-status:** Questions to guide user with nomination status selection ([d72ef5a](https://github.com/entrostat/road-protect-fleet/commit/d72ef5ac9e7502ea847472e190d2ddbe47c9cd60))
* **update-status:** Visual feedback on infringement and nomination status update ([6ed8c92](https://github.com/entrostat/road-protect-fleet/commit/6ed8c92498619d71549fce6bd57855893cbb57ef))

### [2.35.1](https://github.com/entrostat/road-protect-fleet/compare/v2.35.0...v2.35.1) (2020-11-25)


### Bug Fixes

* **ui:** Added the ability to view the redirection letter send date on the frontend in the filters ([ee001bd](https://github.com/entrostat/road-protect-fleet/commit/ee001bd143f96b1681983a7d4392f2b404d288a0))

## [2.35.0](https://github.com/entrostat/road-protect-fleet/compare/v2.34.0...v2.35.0) (2020-11-25)


### Features

* **redirection-letter-send-date:** Split the nomination date and redirection letter send date into two different dates ([bd76692](https://github.com/entrostat/road-protect-fleet/commit/bd76692602a8bfedc4ffbfdfea84cc78dac57e55)), closes [#286](https://github.com/entrostat/road-protect-fleet/issues/286)

## [2.34.0](https://github.com/entrostat/road-protect-fleet/compare/v2.33.0...v2.34.0) (2020-11-24)


### Features

* **atg-verify:** Manual infringement ATG verification ([fbf977e](https://github.com/entrostat/road-protect-fleet/commit/fbf977e4de0730948b4dd07b4f86e0e2a2b56ab5)), closes [#284](https://github.com/entrostat/road-protect-fleet/issues/284)
* **atg-verify:** Manual infringement ATG verification limited to admins with no redirection status updates ([51d7fb4](https://github.com/entrostat/road-protect-fleet/commit/51d7fb4a91b77bf2af7db4150a0c3c182d64ea7c)), closes [#275](https://github.com/entrostat/road-protect-fleet/issues/275)
* **atg-verify:** Update nomination if driver id is specified in ATG verify response ([e7f1e65](https://github.com/entrostat/road-protect-fleet/commit/e7f1e650f9e9ee46b739db03e8e5ef06c95372c4)), closes [#277](https://github.com/entrostat/road-protect-fleet/issues/277)

## [2.33.0](https://github.com/entrostat/road-protect-fleet/compare/v2.32.1...v2.33.0) (2020-11-24)


### Features

* **admin-log:** Added raw infringement log frontend and query controller backend ([b41c457](https://github.com/entrostat/road-protect-fleet/commit/b41c4574b7337e203f91d2a8cbf77c5f4ea485e4)), closes [#283](https://github.com/entrostat/road-protect-fleet/issues/283)


### Bug Fixes

* **timestamp-entity:** Don't typecast the date from string to moment ([a0d353b](https://github.com/entrostat/road-protect-fleet/commit/a0d353be5556730e9c795bbf56203d591f462798))

### [2.32.1](https://github.com/entrostat/road-protect-fleet/compare/v2.32.0...v2.32.1) (2020-11-24)


### Bug Fixes

* **date-output:** Added a safer converter for the moment dates in class transformer ([a238fb0](https://github.com/entrostat/road-protect-fleet/commit/a238fb0821cb03f8f6901df059fa61e7de5d2783))

## [2.32.0](https://github.com/entrostat/road-protect-fleet/compare/v2.31.0...v2.32.0) (2020-11-23)


### Features

* **redirections:** Allow owners to still redirect infringements even if they aren't nominated to them ([5baa0e3](https://github.com/entrostat/road-protect-fleet/commit/5baa0e37c122f8bc27bb9a728ca25cc3298a0e9e)), closes [#280](https://github.com/entrostat/road-protect-fleet/issues/280)


### Bug Fixes

* **dates:** Added more entries to the fix date function so that we deal with more cases ([e19c4ae](https://github.com/entrostat/road-protect-fleet/commit/e19c4aed7147ac71bb2a25618a4be6e754b68473)), closes [#279](https://github.com/entrostat/road-protect-fleet/issues/279)
* **nominations:** Set automated nominations do Digital not Municipal ([4ae7ceb](https://github.com/entrostat/road-protect-fleet/commit/4ae7ceb1dc26e2129ba7edb09fea77dd4797955e)), closes [#266](https://github.com/entrostat/road-protect-fleet/issues/266)

## [2.31.0](https://github.com/entrostat/road-protect-fleet/compare/v2.30.1...v2.31.0) (2020-11-23)


### Features

* **manual-redirections:** Added the ability to filter missing infringements by a customer so that there is not an overload of missing infringements on an issuer level. ([f074b50](https://github.com/entrostat/road-protect-fleet/commit/f074b50bf29cb435c4b3f13b5ad789e65972d30b)), closes [#278](https://github.com/entrostat/road-protect-fleet/issues/278)

### [2.30.1](https://github.com/entrostat/road-protect-fleet/compare/v2.30.0...v2.30.1) (2020-11-23)


### Bug Fixes

* **manual-redirections:** Added the done button to the manual redirections summary page and fixed the missingInfringements array error where it could not read that array from a null object ([f59d7c7](https://github.com/entrostat/road-protect-fleet/commit/f59d7c7cce441672fefc1c3032d352d9fdabb05e)), closes [#276](https://github.com/entrostat/road-protect-fleet/issues/276)
* **typing:** Avoid using string key names in objects ([319baaa](https://github.com/entrostat/road-protect-fleet/commit/319baaada85c30426e7b1967c931dddc81cb8a9f))
* **ui:** Set a minimum width on the issuer selection ([5d93fdf](https://github.com/entrostat/road-protect-fleet/commit/5d93fdf59dbe5188e1b818f859995149a1687f98))

## [2.30.0](https://github.com/entrostat/road-protect-fleet/compare/v2.29.4...v2.30.0) (2020-11-20)


### Features

* **timezones:** Added a new method to parse dates and add the timezone so that infringements are on the correct timezone ([34aa066](https://github.com/entrostat/road-protect-fleet/commit/34aa066370ff1d53b323388f29d9f5bae676f434)), closes [#271](https://github.com/entrostat/road-protect-fleet/issues/271)
* **timezones:** Added the ability to return null if a date is invalid and account for daylight savings ([2990937](https://github.com/entrostat/road-protect-fleet/commit/299093794b4d8619efdedf5ebfc8a133e5b44ff4)), closes [#274](https://github.com/entrostat/road-protect-fleet/issues/274)


### Bug Fixes

* **timezones:** Use the date to determine the timezone due to daylight savings ([feb5219](https://github.com/entrostat/road-protect-fleet/commit/feb521970376e1e711f6e32429584f568046dcfb))

### [2.29.4](https://github.com/entrostat/road-protect-fleet/compare/v2.29.3...v2.29.4) (2020-11-19)


### Bug Fixes

* **upsert:** Don't call fixDate in the timezone adjustment transform ([e95e69c](https://github.com/entrostat/road-protect-fleet/commit/e95e69c367c5e773a1abee06423b7540f0fdfb99))

### [2.29.3](https://github.com/entrostat/road-protect-fleet/compare/v2.29.2...v2.29.3) (2020-11-18)


### Bug Fixes

* **integration-testing:** Send typed dto (instead of plain object) to integration so that transforms apply ([d050cdb](https://github.com/entrostat/road-protect-fleet/commit/d050cdba807464d08473a66537d9f36fa99cd624)), closes [#265](https://github.com/entrostat/road-protect-fleet/issues/265)

### [2.29.2](https://github.com/entrostat/road-protect-fleet/compare/v2.29.1...v2.29.2) (2020-11-18)


### Bug Fixes

* **integrations:** Corrected timestamp display of created at date in integration request log ([181ae9f](https://github.com/entrostat/road-protect-fleet/commit/181ae9f30fe2806a5a1c7310f299749f7b0d533e))

### [2.29.1](https://github.com/entrostat/road-protect-fleet/compare/v2.29.0...v2.29.1) (2020-11-18)


### Bug Fixes

* **integrations:** Added xml formatting for string request/responses in the integration request log ([d4d99f1](https://github.com/entrostat/road-protect-fleet/commit/d4d99f1d5e7a5d0d293afed96a2db3cf5a11bc2f)), closes [#263](https://github.com/entrostat/road-protect-fleet/issues/263)

## [2.29.0](https://github.com/entrostat/road-protect-fleet/compare/v2.28.1...v2.29.0) (2020-11-18)


### Features

* **external-change-date:** Added the frontend view for the external change date ([ec59e7e](https://github.com/entrostat/road-protect-fleet/commit/ec59e7e1ec0fc55147d674d2fb4eeeca1512c1f0)), closes [#259](https://github.com/entrostat/road-protect-fleet/issues/259)
* **external-change-tracking:** Added the external date changed to infringements to track when an infringement changes due to an external source ([486191e](https://github.com/entrostat/road-protect-fleet/commit/486191e65e65352acc7f1a44849ae0ef48dbb0a8)), closes [#257](https://github.com/entrostat/road-protect-fleet/issues/257)
* **infringement-reporting:** Made changes to the formatting of the files attached to an infringement report email ([a88930f](https://github.com/entrostat/road-protect-fleet/commit/a88930f1cba573e0521740db44d922bfb725e5f7))
* **integrations:** Added integration request log entity that's used in various integrations and added admin log panel to view these logs ([c041ba8](https://github.com/entrostat/road-protect-fleet/commit/c041ba8ab83afc72cc61ccf35d1ff097b7fca8cd)), closes [#258](https://github.com/entrostat/road-protect-fleet/issues/258)

### [2.28.1](https://github.com/entrostat/road-protect-fleet/compare/v2.28.0...v2.28.1) (2020-11-17)


### Bug Fixes

* **build:** Force the type of the error ([158715c](https://github.com/entrostat/road-protect-fleet/commit/158715c31a5b5b91b7c8cd82b60c9d4a0c1770c0))

## [2.28.0](https://github.com/entrostat/road-protect-fleet/compare/v2.27.2...v2.28.0) (2020-11-17)


### Features

* **digital-nominations:** No longer allow digital nominations when they have been redirected ([20666d9](https://github.com/entrostat/road-protect-fleet/commit/20666d9df52a1c0d1e2504e5dc7b93395acd6984)), closes [#254](https://github.com/entrostat/road-protect-fleet/issues/254)


### Bug Fixes

* **build:** Added ts-ignore for now on element state model ([bf5379d](https://github.com/entrostat/road-protect-fleet/commit/bf5379de471919df31c633cb7a6a50c46b37ff4e))
* **remove-asterisks:** Remove asterisks from physical location while keeping it as a required field ([173a584](https://github.com/entrostat/road-protect-fleet/commit/173a58413c36a8e6034235473abc201f1049cb07))

### [2.27.2](https://github.com/entrostat/road-protect-fleet/compare/v2.27.1...v2.27.2) (2020-11-16)


### Bug Fixes

* **build:** Incorrect typing on the missing infringement response ([1f9ebfb](https://github.com/entrostat/road-protect-fleet/commit/1f9ebfb76ca9da3b765ab0fc4c1ad97b08193e63))

### [2.27.1](https://github.com/entrostat/road-protect-fleet/compare/v2.27.0...v2.27.1) (2020-11-16)


### Bug Fixes

* **build:** Adjusted the typing expected in the ngrx action for the upsert response ([51d394a](https://github.com/entrostat/road-protect-fleet/commit/51d394a50b78d60bef798a639ca3db5f4107dc8c))
* **infringement-upload:** Added the ability to skip redirections and move to the summary page. The buttons draw attention to skip redirections because running redirections is a dangerous operation. ([eedf61e](https://github.com/entrostat/road-protect-fleet/commit/eedf61ec92d2ed968c3ada000b7ed402ad5bace5)), closes [#245](https://github.com/entrostat/road-protect-fleet/issues/245)
* **infringement-upsert:** Force the issuer to be the same at the start of the process and during the upload to avoid business issues ([b5f5bc6](https://github.com/entrostat/road-protect-fleet/commit/b5f5bc674dca20ac17e4bca7258721ce29edc925)), closes [#244](https://github.com/entrostat/road-protect-fleet/issues/244)
* **manual-redirections:** Force the identifier to be a number, strings should not be allowed ([fd15c52](https://github.com/entrostat/road-protect-fleet/commit/fd15c5261bcb73bbf898a0227bce5d0b4a26f00e)), closes [#242](https://github.com/entrostat/road-protect-fleet/issues/242)
* **spreadsheet-template:** Use i18next to translate the column headers on the spreadsheet template upload to ensure that they match the input labels ([c682c3a](https://github.com/entrostat/road-protect-fleet/commit/c682c3a8bb7b5bda421c849fe46907f83c83bcfd))
* **ui:** Added redirection details to the nomination view ([0268f16](https://github.com/entrostat/road-protect-fleet/commit/0268f16526198edc8b90e77dcd3ad3f61f69a761))
* **ui:** Removed the nomination date from the nomination view because it's a confusing date (it doesn't represent the actual date, just when the nomination was started on the system) ([e7b93ca](https://github.com/entrostat/road-protect-fleet/commit/e7b93ca6a0237b96eb1db82da93da77810e9327d))

## [2.27.0](https://github.com/entrostat/road-protect-fleet/compare/v2.26.0...v2.27.0) (2020-11-13)


### Features

* **integrations:** Added integration testing page for update vehicle ([a53a0f3](https://github.com/entrostat/road-protect-fleet/commit/a53a0f3c6e93633915dc5c634f0eefdaed4bdff3)), closes [#241](https://github.com/entrostat/road-protect-fleet/issues/241)

## [2.26.0](https://github.com/entrostat/road-protect-fleet/compare/v2.25.1...v2.26.0) (2020-11-12)


### Features

* **manual-redirections:** Added the ability to run manual redirections through the frontend and we look at missing infringements on an issuer level to determine if the redirection should be marked as complete ([b8ba68b](https://github.com/entrostat/road-protect-fleet/commit/b8ba68b038069b930214e19c4d9d5e7434edcf6f)), closes [#240](https://github.com/entrostat/road-protect-fleet/issues/240)

### [2.25.1](https://github.com/entrostat/road-protect-fleet/compare/v2.25.0...v2.25.1) (2020-11-11)


### Bug Fixes

* **translations:** Updated unapprove for payment hebrew translation ([1b6ccf6](https://github.com/entrostat/road-protect-fleet/commit/1b6ccf63d6006e2ab0457e491dfc20b601b8003f))

## [2.25.0](https://github.com/entrostat/road-protect-fleet/compare/v2.24.0...v2.25.0) (2020-11-11)


### Features

* **integrations:** Added integration testing page for add vehicle ([09282eb](https://github.com/entrostat/road-protect-fleet/commit/09282ebba82953b8c731626b7100195f0867ea16)), closes [#238](https://github.com/entrostat/road-protect-fleet/issues/238)
* **nomination:** Unapprove infringement nomination for payment ([2d38d63](https://github.com/entrostat/road-protect-fleet/commit/2d38d6387b9c35c7d20563edd1bb642126e9a4f7)), closes [#236](https://github.com/entrostat/road-protect-fleet/issues/236)

## [2.24.0](https://github.com/entrostat/road-protect-fleet/compare/v2.23.2...v2.24.0) (2020-11-09)


### Features

* **nomination:** Include specific nomination details on the created or updated nomination during infringment create or update ([899f156](https://github.com/entrostat/road-protect-fleet/commit/899f1568ca4f3f40ca0afa57a312769294fa1edc))


### Bug Fixes

* **raw-infringement:** Sync infringement issuer from old fleet only if issuer code is not zero ([5442880](https://github.com/entrostat/road-protect-fleet/commit/5442880573e9423ede5d96ceef230da8b36dc18c))
* **raw-infringement:** Sync only valid infringement issuers from old fleet, do not try to sync by issuer name over issuer code ([4ca9cc0](https://github.com/entrostat/road-protect-fleet/commit/4ca9cc08aad4df5fa6ef7e7362aa833561327c8b))

### [2.23.2](https://github.com/entrostat/road-protect-fleet/compare/v2.23.1...v2.23.2) (2020-11-09)


### Bug Fixes

* **redirection-address:** Added zip code field for redirection address to actual request for both physical and postal locations ([ae14243](https://github.com/entrostat/road-protect-fleet/commit/ae14243e77289da5a04c4f7fd8d7ff575d907a42))

### [2.23.1](https://github.com/entrostat/road-protect-fleet/compare/v2.23.0...v2.23.1) (2020-11-05)


### Bug Fixes

* **migrations:** Archived notice number and vehicle unique constraint and will run manually when low system usage ([586e132](https://github.com/entrostat/road-protect-fleet/commit/586e1324d49a97f8cee6f781554c606f9d6229b9))
* **redirection-address:** Removed apartment field and added zip code field for redirection address ([b4a554e](https://github.com/entrostat/road-protect-fleet/commit/b4a554e27196c6e16e2a88f3e4f5f57a55a6316c))

## [2.23.0](https://github.com/entrostat/road-protect-fleet/compare/v2.22.1...v2.23.0) (2020-11-05)


### Features

* **infringement:** Added constraint for vehicle and notice number ([35f2b5c](https://github.com/entrostat/road-protect-fleet/commit/35f2b5cc754b8de966d4b8fac9904b9cc0bcdb26))
* **translation:** Updated English translation for date redirected to date redirection sent be more specific ([928d01e](https://github.com/entrostat/road-protect-fleet/commit/928d01ed8a7ce2ec508a674c799f03d15d7e5863))


### Bug Fixes

* **translations:** Corrected the formatting again ([6a7331b](https://github.com/entrostat/road-protect-fleet/commit/6a7331b0d2bc2e5b1bc8c3ebaa81d181eaf45047))
* **translations:** Corrected the formatting in the translation file ([01bdb4a](https://github.com/entrostat/road-protect-fleet/commit/01bdb4aee5cf41b50a8958239287788777ad4007))
* **translations:** Updated the EN translations ([d46e5a9](https://github.com/entrostat/road-protect-fleet/commit/d46e5a92d683b64c2c6b0fae3706752d6aefb11d))

### [2.22.1](https://github.com/entrostat/road-protect-fleet/compare/v2.22.0...v2.22.1) (2020-11-03)


### Bug Fixes

* **raw-infringement:** Omit null for atg raw data mapper ([dd9e42d](https://github.com/entrostat/road-protect-fleet/commit/dd9e42d0be027f663baea239a8bde929c67e3ee0))
* **raw-infringement:** Omit null for atg raw data mapper ([9f5efc9](https://github.com/entrostat/road-protect-fleet/commit/9f5efc912ffe8679bd47da9a194a54de2492fe38))

## [2.22.0](https://github.com/entrostat/road-protect-fleet/compare/v2.21.1...v2.22.0) (2020-11-03)


### Features

* **infringement:** Allow original amount to be updated ([a5e7af7](https://github.com/entrostat/road-protect-fleet/commit/a5e7af7d394066d29dca372697cc9ab23fe3c974))
* **raw-infringement:** Update original amount during infringement update and process ATG updates ([51aaf39](https://github.com/entrostat/road-protect-fleet/commit/51aaf398b268be990c6293c65ee6db1a5a176c05))

### [2.21.1](https://github.com/entrostat/road-protect-fleet/compare/v2.21.0...v2.21.1) (2020-11-03)


### Bug Fixes

* **digital-nominations:** Run the function every 5 minutes because it's not heavy on the database ([b13a691](https://github.com/entrostat/road-protect-fleet/commit/b13a69106752b91f949faf749efc98ddb020a902))

## [2.21.0](https://github.com/entrostat/road-protect-fleet/compare/v2.20.12...v2.21.0) (2020-11-03)


### Features

* **digital-nominations:** Added a cron job to digitally nominate infringements automatically ([442a171](https://github.com/entrostat/road-protect-fleet/commit/442a171f7de9d1caae8ecaa80ef5fd65774bdb3e))

### [2.20.12](https://github.com/entrostat/road-protect-fleet/compare/v2.20.11...v2.20.12) (2020-11-02)


### Bug Fixes

* **raw-infringement:** Update dto must also set amount due from fine debit ([0f4e6b5](https://github.com/entrostat/road-protect-fleet/commit/0f4e6b5058c5043f0a932feec9c662efb097181a))

### [2.20.11](https://github.com/entrostat/road-protect-fleet/compare/v2.20.10...v2.20.11) (2020-11-02)


### Bug Fixes

* **raw-infringement:** Added log for reprocessing raw infringements ([5b00d0c](https://github.com/entrostat/road-protect-fleet/commit/5b00d0c2fcd4fef4381dff2b37fd68f2e58b2917))

### [2.20.10](https://github.com/entrostat/road-protect-fleet/compare/v2.20.9...v2.20.10) (2020-11-02)


### Bug Fixes

* **raw-infringement:** Added log for reprocessing raw infringements ([5b00d0c](https://github.com/entrostat/road-protect-fleet/commit/5b00d0c2fcd4fef4381dff2b37fd68f2e58b2917))
* **raw-infringement:** Added migrate data back ([6de62a0](https://github.com/entrostat/road-protect-fleet/commit/6de62a0890d7974e2744455048383623e9b2f55a))

### [2.20.9](https://github.com/entrostat/road-protect-fleet/compare/v2.20.8...v2.20.9) (2020-11-02)


### Bug Fixes

* **raw-infringement:** Update migration to not try add data ([fae660e](https://github.com/entrostat/road-protect-fleet/commit/fae660ef88ef93f92fbbacd0f17f6b3a197c2945))

### [2.20.8](https://github.com/entrostat/road-protect-fleet/compare/v2.20.6...v2.20.8) (2020-11-02)


### Bug Fixes

* **digital-nominations:** Ignore any nominations that are in Redirection Process or Redirection Completed ([23e8090](https://github.com/entrostat/road-protect-fleet/commit/23e80901ff36e7dbc91f71f0d939590e49b26ee9)), closes [#221](https://github.com/entrostat/road-protect-fleet/issues/221)
* **raw-infringement:** Setting amount due from fine_debit field for old fleet mapper and added fields for notice number and issuer on raw infringement ([4251c83](https://github.com/entrostat/road-protect-fleet/commit/4251c834d4f158233b6a035f3d7cd3ee23a4b718))

### [2.20.7](https://github.com/entrostat/road-protect-fleet/compare/v2.20.6...v2.20.7) (2020-11-02)


### Bug Fixes

* **raw-infringement:** Setting amount due from fine_debit field for old fleet mapper and added fields for notice number and issuer on raw infringement ([4251c83](https://github.com/entrostat/road-protect-fleet/commit/4251c834d4f158233b6a035f3d7cd3ee23a4b718))

### [2.20.6](https://github.com/entrostat/road-protect-fleet/compare/v2.20.5...v2.20.6) (2020-11-02)


### Bug Fixes

* **digital-nominations:** Added the nomination type as Digital to the fixes to ensure that we don't "fix" municiple redirections ([59e1666](https://github.com/entrostat/road-protect-fleet/commit/59e1666b8db36b96610b1482746cb64adef0d2f9))

### [2.20.5](https://github.com/entrostat/road-protect-fleet/compare/v2.20.4...v2.20.5) (2020-11-02)


### Bug Fixes

* **digital-nominations:** Pull the contract owner ([12ffb2a](https://github.com/entrostat/road-protect-fleet/commit/12ffb2ab65ce1aa63b3e5062b568b049cfe9db33))

### [2.20.4](https://github.com/entrostat/road-protect-fleet/compare/v2.20.3...v2.20.4) (2020-11-02)


### Bug Fixes

* **digital-nominations:** Moved the endpoints above the param check because it was triggering the param endpoint ([20dec52](https://github.com/entrostat/road-protect-fleet/commit/20dec524fa5c6d43de5a8f3267a1a9a456898617))

### [2.20.3](https://github.com/entrostat/road-protect-fleet/compare/v2.20.2...v2.20.3) (2020-11-02)


### Bug Fixes

* **digital-nominations:** Return the nominations that do not have contracts linked to them for debugging ([6ff89f3](https://github.com/entrostat/road-protect-fleet/commit/6ff89f381cfc6d546ab9cb11c68ea35ef8162d84)), closes [#219](https://github.com/entrostat/road-protect-fleet/issues/219)

### [2.20.2](https://github.com/entrostat/road-protect-fleet/compare/v2.20.1...v2.20.2) (2020-11-02)


### Bug Fixes

* **digital-nominations:** Added an endpoint to count the nominations missing contracts ([ea97675](https://github.com/entrostat/road-protect-fleet/commit/ea976754d55914fb30438008ccd9dced22b9c9a7)), closes [#218](https://github.com/entrostat/road-protect-fleet/issues/218)

### [2.20.1](https://github.com/entrostat/road-protect-fleet/compare/v2.20.0...v2.20.1) (2020-11-02)


### Bug Fixes

* **digital-nominations:** Added an endpoint to return the count of infringements that should be nominated ([b0f37f3](https://github.com/entrostat/road-protect-fleet/commit/b0f37f30b6ebfd92df50f52b78a0b727306d94b7)), closes [#217](https://github.com/entrostat/road-protect-fleet/issues/217)

## [2.20.0](https://github.com/entrostat/road-protect-fleet/compare/v2.19.2...v2.20.0) (2020-11-02)


### Features

* **digital-nominations:** Added the ability to run digital nominations for a single infringement to test the logic ([70176ea](https://github.com/entrostat/road-protect-fleet/commit/70176ea037ba290ab8f2f62bb48772d57207d6db)), closes [#216](https://github.com/entrostat/road-protect-fleet/issues/216)


### Bug Fixes

* **tests:** Added default tests for short-term before implementing the manual redirection tests ([45fc850](https://github.com/entrostat/road-protect-fleet/commit/45fc8507b3ab76f355201295470f45a4850cbbb2))

### [2.19.2](https://github.com/entrostat/road-protect-fleet/compare/v2.19.1...v2.19.2) (2020-11-02)


### Bug Fixes

* **translation:** Fix postal code translation ([ecae8c3](https://github.com/entrostat/road-protect-fleet/commit/ecae8c394323c251454f4c0412f0c342a6de96df))
* **translations:** Change PO Box  to  PO Box / Street ([a51d4de](https://github.com/entrostat/road-protect-fleet/commit/a51d4de47c08edd9355056c77e06abb6f6a75f54))

### [2.19.1](https://github.com/entrostat/road-protect-fleet/compare/v2.19.0...v2.19.1) (2020-11-02)


### Bug Fixes

* **locale:** Changed nomination status translations ([0c25bec](https://github.com/entrostat/road-protect-fleet/commit/0c25becb37c59b4b3e3451ce6d965c0d313196d1))

## [2.19.0](https://github.com/entrostat/road-protect-fleet/compare/v2.16.0...v2.19.0) (2020-10-31)


### Features

* **redirections:** Added the ability to make manual redirections on the system ([b088e3f](https://github.com/entrostat/road-protect-fleet/commit/b088e3fe607b50931ec37a16950b1fb2cf3157e2)), closes [#213](https://github.com/entrostat/road-protect-fleet/issues/213)


### Bug Fixes

* **filters:** Autocomplete only returns distinct values, Fix population of dropdown filters on refresh and clean up which filters are displayed in simple visibility ([5e1f3ca](https://github.com/entrostat/road-protect-fleet/commit/5e1f3cad1b0926c0e8cbb2457d8b9b3824369052))
* **locale:** Changed the translation of 'new' ([5845ed4](https://github.com/entrostat/road-protect-fleet/commit/5845ed48aaed2102bfb02fda733d95b546e8aa68))

## [2.18.0](https://github.com/entrostat/road-protect-fleet/compare/v2.16.0...v2.18.0) (2020-10-31)


### Features

* **redirections:** Added the ability to make manual redirections on the system ([b088e3f](https://github.com/entrostat/road-protect-fleet/commit/b088e3fe607b50931ec37a16950b1fb2cf3157e2)), closes [#213](https://github.com/entrostat/road-protect-fleet/issues/213)


### Bug Fixes

* **filters:** Autocomplete only returns distinct values, Fix population of dropdown filters on refresh and clean up which filters are displayed in simple visibility ([5e1f3ca](https://github.com/entrostat/road-protect-fleet/commit/5e1f3cad1b0926c0e8cbb2457d8b9b3824369052))
* **locale:** Changed the translation of 'new' ([5845ed4](https://github.com/entrostat/road-protect-fleet/commit/5845ed48aaed2102bfb02fda733d95b546e8aa68))

## [2.17.0](https://github.com/entrostat/road-protect-fleet/compare/v2.16.0...v2.17.0) (2020-10-29)


### Features

* **redirections:** Added the ability to make manual redirections on the system ([b088e3f](https://github.com/entrostat/road-protect-fleet/commit/b088e3fe607b50931ec37a16950b1fb2cf3157e2)), closes [#213](https://github.com/entrostat/road-protect-fleet/issues/213)

## [2.16.0](https://github.com/entrostat/road-protect-fleet/compare/v2.15.0...v2.16.0) (2020-10-29)


### Features

* **infringement:** Added total amount field to infringement entity; changed outstanding status to only represent infringements that have total amount greater than outstanding amount; set infringement status to outstanding only during scheduler and not at status mapper level ([8c69661](https://github.com/entrostat/road-protect-fleet/commit/8c69661817e259082486631f0b48801b6bcf10f0)), closes [#212](https://github.com/entrostat/road-protect-fleet/issues/212)

## [2.15.0](https://github.com/entrostat/road-protect-fleet/compare/v2.14.0...v2.15.0) (2020-10-29)


### Features

* **multiple-select:** Enable multiple selection on dropdown filters ([68dbe9f](https://github.com/entrostat/road-protect-fleet/commit/68dbe9fa203747db5db8fee5252c041a6e96c6c7))


### Bug Fixes

* **translations:** Updated the translation files ([3e0379b](https://github.com/entrostat/road-protect-fleet/commit/3e0379b87a40f32113731853fb3be00bf152f374))
* **ui:** Fixed the link to view a user (we need plural in the url) ([3107281](https://github.com/entrostat/road-protect-fleet/commit/31072813dc5b92e8f2e82d1175961103356d2ec4))

## [2.14.0](https://github.com/entrostat/road-protect-fleet/compare/v2.13.0...v2.14.0) (2020-10-28)


### Features

* **exact-filter:** Filter infringements by infringement notice number and vehicle registration with an exact match ([7f18d9e](https://github.com/entrostat/road-protect-fleet/commit/7f18d9e3d4a825275211cec590a35f00b07e300e))

## [2.13.0](https://github.com/entrostat/road-protect-fleet/compare/v2.12.10...v2.13.0) (2020-10-27)


### Features

* **address:** Made postal address optional on frontend and adjusted update of account so that postal address is nullified if no longer valid and changed the redirection request to ATG to exclude the postal box in street number when postal address is used ([a38edb0](https://github.com/entrostat/road-protect-fleet/commit/a38edb02ea595603b2c5f241a25b93cbd9be5bed)), closes [#206](https://github.com/entrostat/road-protect-fleet/issues/206)
* **contracts:** Added the ability to upsert lease and ownership contracts ([3bab723](https://github.com/entrostat/road-protect-fleet/commit/3bab723fd1d45f7592d0af3115177d25cba4b62d)), closes [#203](https://github.com/entrostat/road-protect-fleet/issues/203)
* **ui-changes:** Increase font size across the project, remove icons from filters, align columns of filter descriptions, remove filter placeholders except for ranges, use the same placeholders for date and number ranges, add text wrapping on fields in tables with popover to see full text, checkbox colour in Hebrew now the same as in English, move delete button to the opposite side of the row in all tables, increase default number of rows in the table from 10 to 20, move advanced filter buttons to the bottom of the table, use excel icon rather than ng-zorro icon for exporting the table, change Account Users and Users from general table component to the advanced table component, don't show time in date range filters ([bd6f207](https://github.com/entrostat/road-protect-fleet/commit/bd6f2077c52d5ab8021ba24b7178bc67eda680a7))


### Bug Fixes

* **address-dropdown:** Address dropdown fixed so that street is not empty on viewing and city is selected first ([1459be7](https://github.com/entrostat/road-protect-fleet/commit/1459be784184276d7c3895cfbe56656c03191c66))

### [2.12.10](https://github.com/entrostat/road-protect-fleet/compare/v2.12.9...v2.12.10) (2020-10-26)


### Bug Fixes

* **integration-testing:** Log error message and not whole error ([bdaf0cc](https://github.com/entrostat/road-protect-fleet/commit/bdaf0ccfcabd8ec7669f273cb6cd2dc44833ae31))
* **integration-testing:** Log request, response, and error for integration tests ([93036cc](https://github.com/entrostat/road-protect-fleet/commit/93036ccdb2a5b3a2d42e59fc04fc597b486d6291)), closes [#202](https://github.com/entrostat/road-protect-fleet/issues/202)

### [2.12.9](https://github.com/entrostat/road-protect-fleet/compare/v2.12.8...v2.12.9) (2020-10-26)


### Bug Fixes

* **atg:** Changed tranId to be uuid for atg verify infringement integration ([9f58c9c](https://github.com/entrostat/road-protect-fleet/commit/9f58c9c59877926432cdca05528c034fae016da4))

### [2.12.8](https://github.com/entrostat/road-protect-fleet/compare/v2.12.7...v2.12.8) (2020-10-22)


### Bug Fixes

* **timezones:** Just make all contract dates UTC, there is too much complexity in these offsets ([cf69040](https://github.com/entrostat/road-protect-fleet/commit/cf6904005188a92d47c3e087c1aeb972c309beb6))

### [2.12.7](https://github.com/entrostat/road-protect-fleet/compare/v2.12.6...v2.12.7) (2020-10-22)


### Bug Fixes

* **timezones:** Convert the lease and ownership timezones to UTC when creating them ([bdf5fbd](https://github.com/entrostat/road-protect-fleet/commit/bdf5fbd9dea111caf355039ab8fdbaf2f3c3c3f9))
* **timezones:** Set the default timezone to UTC during the conversion to get a valid adjustment ([4d6d061](https://github.com/entrostat/road-protect-fleet/commit/4d6d0619e833d2f2bda9b405db723038ba883784))

### [2.12.6](https://github.com/entrostat/road-protect-fleet/compare/v2.12.5...v2.12.6) (2020-10-22)


### Bug Fixes

* **timezones:** Check for an offset on a date before doing the offset calculation and if there is one then use that instead of calculating an offset ([b9fbc2b](https://github.com/entrostat/road-protect-fleet/commit/b9fbc2b6cbdd2808a18a055719a5a8b6713b6f30))

### [2.12.5](https://github.com/entrostat/road-protect-fleet/compare/v2.12.4...v2.12.5) (2020-10-22)


### Bug Fixes

* **timezones:** Return the fixed date as UTC and then adjust the offset based on the date specified by the user upload ([b4707e3](https://github.com/entrostat/road-protect-fleet/commit/b4707e3fc23cee1101fd4b811ccf71e6b34266bb))

### [2.12.4](https://github.com/entrostat/road-protect-fleet/compare/v2.12.3...v2.12.4) (2020-10-21)


### Bug Fixes

* **old-fleets:** Use the fine debit amount (which may include penalties) if the fine amount is not defined ([c916a31](https://github.com/entrostat/road-protect-fleet/commit/c916a312bd4c96c9b149315281cf177d28eca745))

### [2.12.3](https://github.com/entrostat/road-protect-fleet/compare/v2.12.2...v2.12.3) (2020-10-21)


### Bug Fixes

* **old-fleets-integration:** Added the ability to filter by notice number so that we can debug errors on the sync more easily. ([4a4f85f](https://github.com/entrostat/road-protect-fleet/commit/4a4f85f45e078148fd906a187cc9b590c49f8a2a))

### [2.12.2](https://github.com/entrostat/road-protect-fleet/compare/v2.12.1...v2.12.2) (2020-10-20)


### Bug Fixes

* **logging:** Added logs to the old fleets sync to ensure that it is running correctly ([6a5f010](https://github.com/entrostat/road-protect-fleet/commit/6a5f010c5150ab8a4ebdc25ccdaa606a9b07fe3b))

### [2.12.1](https://github.com/entrostat/road-protect-fleet/compare/v2.12.0...v2.12.1) (2020-10-19)


### Bug Fixes

* **digital-nominations:** allow nominations to take place even if there aren't account users ([19c5c98](https://github.com/entrostat/road-protect-fleet/commit/19c5c98cbe2fb7ddfbd07ba8791f03df66361670)), closes [#199](https://github.com/entrostat/road-protect-fleet/issues/199)

## [2.12.0](https://github.com/entrostat/road-protect-fleet/compare/v2.11.1...v2.12.0) (2020-10-16)


### Features

* **test-infringement-reporting:** Added tests for logic used to select which infringements are reported on and made a few fixes to the infringement reporting ([e08c152](https://github.com/entrostat/road-protect-fleet/commit/e08c152e929a5545f1489ccb45ee526b209bbbe3))


### Bug Fixes

* **infringement-report-attachments:** Changed infringement report email attachment from xlsx spreadsheet to a pdf and a csv because of styling issues ([4634371](https://github.com/entrostat/road-protect-fleet/commit/46343713999a14cc54c4d038ececc4e30dd08aa5))

### [2.11.1](https://github.com/entrostat/road-protect-fleet/compare/v2.11.0...v2.11.1) (2020-10-14)


### Bug Fixes

* **infringement-relink:** Do not fail relinking of other infringements if one fails ([9a7ae37](https://github.com/entrostat/road-protect-fleet/commit/9a7ae376942698dbf3190f9bfbc60597671086bd))

## [2.11.0](https://github.com/entrostat/road-protect-fleet/compare/v2.10.3...v2.11.0) (2020-10-13)


### Features

* **manual-infringements:** added the ability to create or update infringements manually ([5943940](https://github.com/entrostat/road-protect-fleet/commit/5943940242c282ad7934b8f8fac3d426fb02eb18)), closes [#191](https://github.com/entrostat/road-protect-fleet/issues/191)

### [2.10.3](https://github.com/entrostat/road-protect-fleet/compare/v2.10.2...v2.10.3) (2020-10-06)


### Bug Fixes

* **contracts:** removed the document requirement for uploading lease and ownership contracts manually ([090431b](https://github.com/entrostat/road-protect-fleet/commit/090431beb4da42ec880bdaf7cf26b4094201d3c4)), closes [#190](https://github.com/entrostat/road-protect-fleet/issues/190)

### [2.10.2](https://github.com/entrostat/road-protect-fleet/compare/v2.10.1...v2.10.2) (2020-10-06)

### [2.10.1](https://github.com/entrostat/road-protect-fleet/compare/v2.10.0...v2.10.1) (2020-10-06)


### Bug Fixes

* **accounts:** allow for the primary contact to be changed on accounts ([798837a](https://github.com/entrostat/road-protect-fleet/commit/798837ab377999697076e29407341fb4d854e3dc)), closes [#187](https://github.com/entrostat/road-protect-fleet/issues/187)

## [2.10.0](https://github.com/entrostat/road-protect-fleet/compare/v2.9.2...v2.10.0) (2020-10-03)


### Features

* **address:** Searchable autocomplete and select street and city for account location ([b04227f](https://github.com/entrostat/road-protect-fleet/commit/b04227f762c60ddb9a61a0307b6c913f9b11e46b))
* **automated-tests:** added automated tests when you merge into develop or master to ensure that we're not breaking anything ([0b99b54](https://github.com/entrostat/road-protect-fleet/commit/0b99b541010ac3856aaba2fe028a580ce5de5a9c)), closes [#186](https://github.com/entrostat/road-protect-fleet/issues/186)
* **roles:** added the ability to add multiple roles to each account so that we can control what access each user has on the frontend ([c666d7b](https://github.com/entrostat/road-protect-fleet/commit/c666d7ba79343c91a4ba1d7112c57ca9398bd2f1)), closes [#183](https://github.com/entrostat/road-protect-fleet/issues/183)


### Bug Fixes

* **integration-testing:** Fix to display null response and auth ([74f185e](https://github.com/entrostat/road-protect-fleet/commit/74f185ec7a9779dcd47884fce8b5a550216b10e2))
* **integration-testing:** Fixed system header key ([f0c2e77](https://github.com/entrostat/road-protect-fleet/commit/f0c2e778d9a888b0c6bf0f9cb9dd42bf5f1d2930))
* **integration-tests:** Fixed key ([b9e46d5](https://github.com/entrostat/road-protect-fleet/commit/b9e46d506e145d7fcb328e02de831c507d3c299d))

### [2.9.2](https://github.com/entrostat/road-protect-fleet/compare/v2.9.1...v2.9.2) (2020-10-01)


### Bug Fixes

* **batch-redirection-modal:** improve interface of batch digital redirection modal ([0737fe1](https://github.com/entrostat/road-protect-fleet/commit/0737fe126c1ef6d5616c3772824b18519104103c))
* **workflow:** Must build frontend ([8c91440](https://github.com/entrostat/road-protect-fleet/commit/8c914402ee0059dbdaf9e36bd365948b9123d6a3))

### [2.9.1](https://github.com/entrostat/road-protect-fleet/compare/v2.9.0...v2.9.1) (2020-09-30)


### Bug Fixes

* **dates:** adjusted the date transformer and removed the need for the date string in the dto for lease creation ([10228e4](https://github.com/entrostat/road-protect-fleet/commit/10228e4f900a120a936776523eddd817c8af8d9b))

## [2.9.0](https://github.com/entrostat/road-protect-fleet/compare/v2.8.1...v2.9.0) (2020-09-30)


### Features

* **document-upload:** added a safe parser and exceptions to the document service to improve stability and detect runtime errors ([90e43cb](https://github.com/entrostat/road-protect-fleet/commit/90e43cb5374dc8f1e5bfa8dc08602cc3a78ad6d9)), closes [#181](https://github.com/entrostat/road-protect-fleet/issues/181)

### [2.8.1](https://github.com/entrostat/road-protect-fleet/compare/v2.8.0...v2.8.1) (2020-09-30)


### Bug Fixes

* **contracts:** enabled the deletion of contracts via the API ([ae451cc](https://github.com/entrostat/road-protect-fleet/commit/ae451cc6baefc40a4b8135b0b11dd1816c17f010))

## [2.8.0](https://github.com/entrostat/road-protect-fleet/compare/v2.7.6...v2.8.0) (2020-09-30)


### Features

* **contracts:** added the ability to delete contracts on an account level through the API ([3823532](https://github.com/entrostat/road-protect-fleet/commit/38235328d4ce64a1ef7fa3d03b1123e3fc0a786d)), closes [#180](https://github.com/entrostat/road-protect-fleet/issues/180)

### [2.7.6](https://github.com/entrostat/road-protect-fleet/compare/v2.7.5...v2.7.6) (2020-09-22)


### Bug Fixes

* **old-fleets:** The query for finding infringements that had not been successfully performed was not correct ([1070713](https://github.com/entrostat/road-protect-fleet/commit/1070713c20964c79a1587fac4530b9152c9376fe))

### [2.7.5](https://github.com/entrostat/road-protect-fleet/compare/v2.7.3...v2.7.5) (2020-09-22)


### Bug Fixes

* **old-fleets:** Enabled the validity check on the old fleets sync ([66c4422](https://github.com/entrostat/road-protect-fleet/commit/66c44222b5f26fba1d45803730e05c2ed563002a))

### [2.7.4](https://github.com/entrostat/road-protect-fleet/compare/v2.7.3...v2.7.4) (2020-09-22)


### Bug Fixes

* **old-fleets:** Enabled the validity check on the old fleets sync ([66c4422](https://github.com/entrostat/road-protect-fleet/commit/66c44222b5f26fba1d45803730e05c2ed563002a))

### [2.7.3](https://github.com/entrostat/road-protect-fleet/compare/v2.7.2...v2.7.3) (2020-09-22)


### Bug Fixes

* **old-fleets:** Check for null in the perform key ([ec08e38](https://github.com/entrostat/road-protect-fleet/commit/ec08e38a924cf145fbf456ef2295fb1cbf3732a2))

### [2.7.2](https://github.com/entrostat/road-protect-fleet/compare/v2.7.1...v2.7.2) (2020-09-22)


### Bug Fixes

* **old-fleets:** Using the incorrect jsonb query for raw infringements ([0a40b65](https://github.com/entrostat/road-protect-fleet/commit/0a40b651c32528ba3b1c56860b0835d251d2fe2a))

### [2.7.1](https://github.com/entrostat/road-protect-fleet/compare/v2.7.0...v2.7.1) (2020-09-22)


### Bug Fixes

* **old-fleets:** don't check for dto validity in the test ([3eb51df](https://github.com/entrostat/road-protect-fleet/commit/3eb51df9d5d10143093759003bc28ed3e18816a3))

## [2.7.0](https://github.com/entrostat/road-protect-fleet/compare/v2.6.3...v2.7.0) (2020-09-22)


### Features

* **infringement-update-logic:** improved the update logic for checking validity of whether or not raw data should be considered ([fb43c38](https://github.com/entrostat/road-protect-fleet/commit/fb43c38c66aa0179c2bdfaad4eb9cedb99fb5e16)), closes [#177](https://github.com/entrostat/road-protect-fleet/issues/177)


### Bug Fixes

* **old-fleets:** extract the issuer for the create and update functionality ([49bbc83](https://github.com/entrostat/road-protect-fleet/commit/49bbc833bf662e251b0eefc3cbf9ff328cf679a6))

### [2.6.3](https://github.com/entrostat/road-protect-fleet/compare/v2.6.2...v2.6.3) (2020-09-21)


### Bug Fixes

* **old-fleets:** ignore the issuer code of 0 if it comes in from Old Fleets that way ([2b9bc1b](https://github.com/entrostat/road-protect-fleet/commit/2b9bc1b90e9a40b3bb10a3d00177aa0646727a32))
* **old-fleets:** pull the infringement amount from the amount paid if the status is paid ([6818883](https://github.com/entrostat/road-protect-fleet/commit/6818883d8aaf0d4f4691cb32ee2bb4aa6c924b09))

### [2.6.2](https://github.com/entrostat/road-protect-fleet/compare/v2.6.1...v2.6.2) (2020-09-18)


### Bug Fixes

* **timezones:** Try to insert the timezone when I have it available ([5b46480](https://github.com/entrostat/road-protect-fleet/commit/5b464804a4235ec02f833772575d159e1893defd))

### [2.6.1](https://github.com/entrostat/road-protect-fleet/compare/v2.6.0...v2.6.1) (2020-09-18)


### Bug Fixes

* **timezones:** I want the timezones to carry through so I've removed the automated UTC timezone ([ef36d5f](https://github.com/entrostat/road-protect-fleet/commit/ef36d5f87b959efdcac14a090881e5deab89efd5))

## [2.6.0](https://github.com/entrostat/road-protect-fleet/compare/v2.5.0...v2.6.0) (2020-09-18)


### Features

* **timezones:** added an automated timezone fixer to try to cater for different formats coming in ([1693c46](https://github.com/entrostat/road-protect-fleet/commit/1693c464872d0c8e46b04793e93160703675402f)), closes [#175](https://github.com/entrostat/road-protect-fleet/issues/175)

## [2.5.0](https://github.com/entrostat/road-protect-fleet/compare/v2.4.5...v2.5.0) (2020-09-17)


### Features

* **digital-nomiations:** added the ability to process batch nominations across the whole system ([0d17fbd](https://github.com/entrostat/road-protect-fleet/commit/0d17fbd8a73f43ce6eaf9093f169b804e07a6040)), closes [#174](https://github.com/entrostat/road-protect-fleet/issues/174)

### [2.4.5](https://github.com/entrostat/road-protect-fleet/compare/v2.4.4...v2.4.5) (2020-09-16)


### Bug Fixes

* **integrations:** added the ability to login to the old fleets system via the api ([060a4e5](https://github.com/entrostat/road-protect-fleet/commit/060a4e538083bc173603ecc886b3e5b18c917597))

### [2.4.4](https://github.com/entrostat/road-protect-fleet/compare/v2.4.3...v2.4.4) (2020-09-15)


### Bug Fixes

* **timezones:** created a function where I ignore the offset and create a standard ISO string ([190bc89](https://github.com/entrostat/road-protect-fleet/commit/190bc89bb96808e8d91a56ce1901776fa3f8872d))

### [2.4.3](https://github.com/entrostat/road-protect-fleet/compare/v2.4.2...v2.4.3) (2020-09-15)


### Bug Fixes

* **timezones:** don't convert to UTC, rather go directly to ISO because the dates don't have times for lease contracts ([e061eff](https://github.com/entrostat/road-protect-fleet/commit/e061efff6f7dec9c69248432ee2fdce7c86c017d))

### [2.4.2](https://github.com/entrostat/road-protect-fleet/compare/v2.4.1...v2.4.2) (2020-09-15)


### Bug Fixes

* **timezones:** removed the timezone conversion on the lease contract upload to avoid problems with the dates ([d45d29b](https://github.com/entrostat/road-protect-fleet/commit/d45d29b207a1a459d396c160e5f60eb9bde75462))

### [2.4.1](https://github.com/entrostat/road-protect-fleet/compare/v2.4.0...v2.4.1) (2020-09-15)


### Bug Fixes

* **contracts:** allow you to specify the end date on lease contract uploads ([9cbf4b3](https://github.com/entrostat/road-protect-fleet/commit/9cbf4b3ff0b3a7df4ab1cf520996b5b3944acd44))

## [2.4.0](https://github.com/entrostat/road-protect-fleet/compare/v2.3.0...v2.4.0) (2020-09-15)


### Features

* **batch-nominations:** added the ability to batch digitally nominate infringements from the frontend ([9d60d18](https://github.com/entrostat/road-protect-fleet/commit/9d60d18e42996497c24959ee5765d6e6882f59b6)), closes [#172](https://github.com/entrostat/road-protect-fleet/issues/172)
* **digital-nominations:** enabled digital nominations on creation of a new infringement ([e377179](https://github.com/entrostat/road-protect-fleet/commit/e3771798d9536f4d458f281ae7f95f3780ca34b1)), closes [#171](https://github.com/entrostat/road-protect-fleet/issues/171)
* **digital=nominations:** enabled digital nominations on creation of a new infringement ([e8f2a57](https://github.com/entrostat/road-protect-fleet/commit/e8f2a57f55a0367df0c6106877c19128c98d7815)), closes [#171](https://github.com/entrostat/road-protect-fleet/issues/171)

## [2.3.0](https://github.com/entrostat/road-protect-fleet/compare/v2.2.11...v2.3.0) (2020-09-14)


### Features

* **digital-nomination:** modified the digital nomination service to ensure that we check all of the rules before nominating ([7f05bef](https://github.com/entrostat/road-protect-fleet/commit/7f05bef0d98e77cb8376d461a6fc72737f498c2f)), closes [#169](https://github.com/entrostat/road-protect-fleet/issues/169)
* **filters:** automatically add the filter data from the query parameters if they exist for any table on the system ([c30fa82](https://github.com/entrostat/road-protect-fleet/commit/c30fa8263a33103261cf35fa278565bba51e6213)), closes [#167](https://github.com/entrostat/road-protect-fleet/issues/167)


### Bug Fixes

* **digital-nominations:** modified the digital nomination process to prepare it for the nomination service ([ab3f2ab](https://github.com/entrostat/road-protect-fleet/commit/ab3f2ab21da863407af4456fb7de927f5614ba6b)), closes [#168](https://github.com/entrostat/road-protect-fleet/issues/168)

### [2.2.11](https://github.com/entrostat/road-protect-fleet/compare/v2.2.10...v2.2.11) (2020-09-09)


### Bug Fixes

* **formatting:** ran prettier formatting across all of the folders to ensure consistency ([74ed2ea](https://github.com/entrostat/road-protect-fleet/commit/74ed2ea7c3aa98ff31b0ea38a94abad58eafd856)), closes [#166](https://github.com/entrostat/road-protect-fleet/issues/166)

### [2.2.10](https://github.com/entrostat/road-protect-fleet/compare/v2.2.9...v2.2.10) (2020-09-08)


### Bug Fixes

* **payment:** looking at preparsed values does not have the characters we expect so I've changed the search ([d130296](https://github.com/entrostat/road-protect-fleet/commit/d130296480b2dde028a499fb8a6c07ff98d7e9c3))

### [2.2.9](https://github.com/entrostat/road-protect-fleet/compare/v2.2.8...v2.2.9) (2020-09-08)


### Bug Fixes

* **payment:** removed the response check ([070188c](https://github.com/entrostat/road-protect-fleet/commit/070188cf078e00dab45bdee512129b907adffba1))

### [2.2.8](https://github.com/entrostat/road-protect-fleet/compare/v2.2.7...v2.2.8) (2020-09-08)


### Bug Fixes

* **payment:** removed the uneeded parsing ([0eb05a6](https://github.com/entrostat/road-protect-fleet/commit/0eb05a68a99711358435409f03bebde384708ca2))

### [2.2.7](https://github.com/entrostat/road-protect-fleet/compare/v2.2.6...v2.2.7) (2020-09-08)


### Bug Fixes

* **payment:** look at the raw response for the success code ([bd96f14](https://github.com/entrostat/road-protect-fleet/commit/bd96f146518ead08c97942735127a4de6af410f6))

### [2.2.6](https://github.com/entrostat/road-protect-fleet/compare/v2.2.5...v2.2.6) (2020-09-08)


### Bug Fixes

* **payments:** the action code was not being parsed correctly, I now just look for the string ([20fb48a](https://github.com/entrostat/road-protect-fleet/commit/20fb48a664a6d09264ac118e2a2fd6fb7a8a5522))

### [2.2.5](https://github.com/entrostat/road-protect-fleet/compare/v2.2.4...v2.2.5) (2020-09-08)


### Bug Fixes

* **payments:** added the card expiry date to payments ([951a639](https://github.com/entrostat/road-protect-fleet/commit/951a639e68fc25d5b7b6495ba4de3d18c40c9994))

### [2.2.4](https://github.com/entrostat/road-protect-fleet/compare/v2.2.3...v2.2.4) (2020-09-08)


### Bug Fixes

* **debug:** added an endpoint to debug payment details ([794e4e4](https://github.com/entrostat/road-protect-fleet/commit/794e4e456d46d102853ea63b1452ef9db0003430))
* **debug:** changed the endpoint for viewing payments ([5f65f16](https://github.com/entrostat/road-protect-fleet/commit/5f65f16b60eee8aa1416cdcd751c7925812674a6))

### [2.2.3](https://github.com/entrostat/road-protect-fleet/compare/v2.2.2...v2.2.3) (2020-09-08)


### Bug Fixes

* **debug:** added a payment endpoint to view the unencrypted payment details ([899eb64](https://github.com/entrostat/road-protect-fleet/commit/899eb64b3f3aca7a1d3503c0ecd54863b2750516))
* **logging:** changed the error message to be more understandable ([66c75db](https://github.com/entrostat/road-protect-fleet/commit/66c75db8dbf0b6f2cc5b623fcf299043744af64e))

### [2.2.2](https://github.com/entrostat/road-protect-fleet/compare/v2.2.1...v2.2.2) (2020-09-08)


### Bug Fixes

* **logger:** output the message by itself if it has one in the exception ([a415306](https://github.com/entrostat/road-protect-fleet/commit/a415306abde0d781c9b9d13c3510b7492f18338c))
* **redirection:** check that a redirection user is defined and return an error if it is not ([1fbb05c](https://github.com/entrostat/road-protect-fleet/commit/1fbb05c0012ed8366db16285d9e98a1d33dadc61))

### [2.2.1](https://github.com/entrostat/road-protect-fleet/compare/v2.2.0...v2.2.1) (2020-09-08)


### Bug Fixes

* **logging:** added a logger for exceptions that aren't http ([2ed6129](https://github.com/entrostat/road-protect-fleet/commit/2ed6129c1ce38c970d7d07975c4af30581614098))

## [2.2.0](https://github.com/entrostat/road-protect-fleet/compare/v2.1.0...v2.2.0) (2020-09-08)


### Features

* **ui:** added payment details to the infringement view (hidden for now because we need to refactor payments to be a one-to-many) ([e09440d](https://github.com/entrostat/road-protect-fleet/commit/e09440d3b72d197db794fa5f061560e11ccb67dc)), closes [#148](https://github.com/entrostat/road-protect-fleet/issues/148)


### Bug Fixes

* **dates:** added the ability to fix dates on the DTO upload when they match a format that we know is valid but not what we want. ([a153249](https://github.com/entrostat/road-protect-fleet/commit/a153249b2a0c0da49b512dcb8810355340973b8e)), closes [#164](https://github.com/entrostat/road-protect-fleet/issues/164)
* **integrations:** modified the ATG payment integration to use the postal address if the physical is not specified ([8869302](https://github.com/entrostat/road-protect-fleet/commit/88693020895f96cc2366b791f68785fdf0e87df9)), closes [#163](https://github.com/entrostat/road-protect-fleet/issues/163)
* **locale:** renamed municiple nominations to municiple redirections ([5fc0155](https://github.com/entrostat/road-protect-fleet/commit/5fc01555112f94d0e371a023ce6f5ea324a476a4)), closes [#151](https://github.com/entrostat/road-protect-fleet/issues/151)
* **ui:** Fixed the user stamp view, disabled the correct buttons when the stamp was uploaded and improved the css layout ([bd70f01](https://github.com/entrostat/road-protect-fleet/commit/bd70f01a7915a00f68225004ae4ed4609538bbf7)), closes [#154](https://github.com/entrostat/road-protect-fleet/issues/154)
* **ui:** Output the nomination and redirection status on an infringement so that users know if they are able to perform those actions ([1bbc594](https://github.com/entrostat/road-protect-fleet/commit/1bbc5943bd077c1210087ce281efd727da9a926b)), closes [#153](https://github.com/entrostat/road-protect-fleet/issues/153)

## [2.1.0](https://github.com/entrostat/road-protect-fleet/compare/v2.0.0...v2.1.0) (2020-09-04)


### Features

* **reporting:** added an infringement type map to the system so that we can use that in Metabase reports ([51be340](https://github.com/entrostat/road-protect-fleet/commit/51be34094bda2b1067e22fc1a57e3b7a444710b6)), closes [#141](https://github.com/entrostat/road-protect-fleet/issues/141)
* **verification:** added the ability to run verification (and batch) over infringements ([bbfa667](https://github.com/entrostat/road-protect-fleet/commit/bbfa66729ce36e1c56865d1c76449cac0e4efddd)), closes [#145](https://github.com/entrostat/road-protect-fleet/issues/145)


### Bug Fixes

* **core:** allow status transition from in-process to complete for redirections ([f231810](https://github.com/entrostat/road-protect-fleet/commit/f2318101a231a83c6a2876e665f07ab442fc4657)), closes [#140](https://github.com/entrostat/road-protect-fleet/issues/140)
* **integrations:** replaced city with issuer name on ATG mapping integration ([9ac6574](https://github.com/entrostat/road-protect-fleet/commit/9ac657454d376d08167e8fdbdd7b52b024bb8afc)), closes [#139](https://github.com/entrostat/road-protect-fleet/issues/139)
* **ui:** Changed the Redirected Date to output as a date string instead of a unix timestamp ([a33270c](https://github.com/entrostat/road-protect-fleet/commit/a33270c1587bd14b4ce10ff2e5073f305ac08f41)), closes [#138](https://github.com/entrostat/road-protect-fleet/issues/138)
* **ui:** Changed the wording on the batch redirections modal to use the words "Requests" so that it's not misleading to the user around what has happened (ie. The request has sent but the redirection isn't successful yet) ([c5aa38d](https://github.com/entrostat/road-protect-fleet/commit/c5aa38d24fc8b54bc8fc19e610f0a9872ef94366)), closes [#135](https://github.com/entrostat/road-protect-fleet/issues/135)
* **ui:** do not allow the button to process infringements if none meet the criteria ([06ed12b](https://github.com/entrostat/road-protect-fleet/commit/06ed12b6f68dc9716d712add33e9aaea555ef29f)), closes [#146](https://github.com/entrostat/road-protect-fleet/issues/146)
* **ui:** increased the width of the infringement modal to two columns ([9250846](https://github.com/entrostat/road-protect-fleet/commit/92508464af99fa25b0fb2ea1ad8d0db4e0ba4c86)), closes [#143](https://github.com/entrostat/road-protect-fleet/issues/143)

## [2.0.0](https://github.com/entrostat/road-protect-fleet/compare/v1.0.0...v2.0.0) (2020-08-26)


### Bug Fixes

* **devops:** added libxss to the document generator dockerfile ([85cfdeb](https://github.com/entrostat/road-protect-fleet/commit/85cfdebe4199000e00023fa0191dcf9bf0b667b0))
* **filters:** added the Issuer Provider to the infringement view ([7fda1dc](https://github.com/entrostat/road-protect-fleet/commit/7fda1dca6aabb1bb37ca76be71cd0d72a358ddd5)), closes [#134](https://github.com/entrostat/road-protect-fleet/issues/134)
