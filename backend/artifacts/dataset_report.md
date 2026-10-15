# Phish360 Dataset Forensics Report
Generated: 2026-09-05T19:40:43

## Totals
- Samples found: **10748**
- Complete (all 4 modalities present): **10718**
- Incomplete: **30**

## By split
- test: 2771
- trainval: 7977

## By label
- legitimate: 6416
- phish: 1272
- santander: 57
- sparkasse: 39
- itau: 102
- orange: 129
- xfinity: 35
- impots: 15
- irs: 24
- boa: 130
- adobe: 82
- dropbox: 82
- chase: 182
- office: 179
- cibc: 34
- bradesco: 40
- alibaba: 107
- facebook: 219
- amazon: 77
- yahoo: 101
- google: 89
- ebay: 23
- aol: 26
- att: 91
- linkedin: 34
- microsoft: 82
- dhl: 115
- paypal: 211
- amex: 46
- apple: 107
- sfr: 39
- navy: 13
- match: 22
- hsbc: 14
- wellsfargo: 125
- outlook: 93
- netflix: 53
- caixa: 21
- tmobile: 22
- mic: 19
- usaa: 37
- natwest: 26
- bmo: 33
- nab: 38
- bt: 16
- capitalone: 10
- cox: 19
- alllegro: 2

## By split x label
- **test**: legitimate=1499, phish=1272
- **trainval**: legitimate=4917, santander=57, sparkasse=39, itau=102, orange=129, xfinity=35, impots=15, irs=24, boa=130, adobe=82, dropbox=82, chase=182, office=179, cibc=34, bradesco=40, alibaba=107, facebook=219, amazon=77, yahoo=101, google=89, ebay=23, aol=26, att=91, linkedin=34, microsoft=82, dhl=115, paypal=211, amex=46, apple=107, sfr=39, navy=13, match=22, hsbc=14, wellsfargo=125, outlook=93, netflix=53, caixa=21, tmobile=22, mic=19, usaa=37, natwest=26, bmo=33, nab=38, bt=16, capitalone=10, cox=19, alllegro=2

## Integrity issues
- label_folder_vs_file_mismatches: 10627
- zero_byte_html_files: 0
- zero_byte_screenshots: 0
- html_encoding_not_utf8: 0
- corrupt_or_unreadable_screenshots: 18

## File size stats (bytes)
- **html**: {'count': 10718, 'min': 4003, 'max': 15590579, 'mean': 88552.2, 'median': 40370}
- **screenshot**: {'count': 10748, 'min': 10457, 'max': 16107041, 'mean': 555240.9, 'median': 365338}
- **url**: {'count': 10748, 'min': 18, 'max': 1646, 'mean': 61.1, 'median': 48}

## Duplicate / leakage summary
- html_duplicate_groups: 136
- html_cross_split_leaks: 11
- screenshot_duplicate_groups: 8
- screenshot_cross_split_leaks: 3
- url_duplicate_groups: 103
- url_cross_split_leaks: 14

_See dataset_report.json for full duplicate group listings, incomplete sample IDs, and label-mismatch sample IDs._