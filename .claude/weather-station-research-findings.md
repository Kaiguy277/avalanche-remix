# Weather Station Zone Mapping - Research Findings

Compiled from 12 research agents investigating each avalanche center's actual weather station usage.
Research date: 2026-03-15

## Status Key
- ✅ No changes needed
- ⚠️ Minor improvements recommended
- 🔴 Critical fix needed

---

## ALASKA - CNFAIC (Chugach National Forest Avalanche Info Center)

### turnagain-girdwood 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | HILA2 | Anchorage Hillside | 2,080 ft | 61.113 | -149.684 |
| OLD | TUGA2 | Turnagain Pass | 1,880 ft | 60.780 | -149.183 |
| OLD | SUUA2 | Summit Creek | 1,400 ft | 60.617 | -149.531 |
| **NEW** | **TUGA2** | **Turnagain Pass** | **1,880 ft** | **60.780** | **-149.183** |
| **NEW** | *TBD* | *Mt. Alyeska SNOTEL (1103:AK:SNTL)* | *1,539 ft* | *60.96* | *-149.09* |
| **NEW** | *TBD* | *Sunburst or Seattle Ridge (if on Synoptic)* | *2,400-3,812 ft* | | |

**Issue:** HILA2 is in Chugach State Park (Glen Alps), not Turnagain. SUUA2 is in Summit Lake area. CNFAIC groups neither under their Turnagain/Girdwood zone.
**Action needed:** Verify Mt. Alyeska SNOTEL Synoptic STID. Find ridgetop station STID.

### summit ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | TUGA2 | Turnagain Pass | 1,880 ft | 60.780 | -149.183 |
| OLD | SUUA2 | Summit Creek | 1,400 ft | 60.617 | -149.531 |
| OLD | SRPA2 | Seward Hwy @ Turnagain Pass | 1,033 ft | 60.804 | -149.185 |
| **NEW** | **SUUA2** | **Summit Creek** | **1,400 ft** | **60.617** | **-149.531** |
| **NEW** | **TUGA2** | **Turnagain Pass** | **1,880 ft** | **60.780** | **-149.183** |
| **NEW** | *TBD* | *Grandview or Sterling Wye Ridgetop* | | | |

**Issue:** SRPA2 is a DOT road station at the top of Turnagain Pass, not in Summit Lake area. Drop it.

### seward ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | SUUA2 | Summit Creek | 1,400 ft | 60.617 | -149.531 |
| OLD | PEDA2 | Pedersen Lagoon | 625 ft | 59.894 | -149.731 |
| OLD | EXGA2 | Exit Glacier | 400 ft | 60.190 | -149.621 |
| **NEW** | **EXGA2** | **Exit Glacier** | **400 ft** | **60.190** | **-149.621** |
| **NEW** | **PEDA2** | **Pedersen Lagoon** | **625 ft** | **59.894** | **-149.731** |
| **NEW** | *TBD* | *Cooper Lake SNOTEL (959:AK:SNTL)* | *1,150 ft* | *60.39* | *-149.69* |

**Issue:** SUUA2 is 40mi north in Summit Lake area. Replace with Cooper Lake if Synoptic STID available.

### chugach-state-park 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | MORA2 | Moraine | 2,100 ft | 61.377 | -148.999 |
| OLD | HILA2 | Anchorage Hillside | 2,080 ft | 61.113 | -149.684 |
| OLD | TUGA2 | Turnagain Pass | 1,880 ft | 60.780 | -149.183 |
| **NEW** | **HILA2** | **Anchorage Hillside** | **2,080 ft** | **61.113** | **-149.684** |
| **NEW** | *TBD* | *Indian Pass SNOTEL (946:AK:SNTL)* | *2,400 ft* | *61.07* | *-149.49* |
| **NEW** | **MORA2** | **Moraine** | **2,100 ft** | **61.377** | **-148.999** |

**Issue:** TUGA2 is 25mi south in Kenai Mountains, not in CSP. CNFAIC groups HILA2 and Indian Pass under their Anchorage zone (=CSP).

### hatcher-pass ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | HATA2 | Independence Mine | 3,550 ft | 61.791 | -149.280 |
| OLD | FBBA2 | Frostbite Bottom | 2,700 ft | 61.750 | -149.270 |
| OLD | MORA2 | Moraine | 2,100 ft | 61.377 | -148.999 |
| **NEW** | **HATA2** | **Independence Mine** | **3,550 ft** | **61.791** | **-149.280** |
| **NEW** | **FBBA2** | **Frostbite Bottom** | **2,700 ft** | **61.750** | **-149.270** |
| **NEW** | *TBD* | *Gold Cord Mine or Hatch Peak (if on Synoptic)* | *4,050-4,561 ft* | | |

**Issue:** MORA2 is 30mi south in Knik area. Neither CNFAIC nor HPAC lists it for Hatcher Pass. May need to drop to 2 stations if no 3rd available on Synoptic.

---

## ALASKA - VAC, EARAC, CAAC, HAC
*Agent still running — will be added when complete*

---

## NWAC - Northwest Avalanche Center (Washington)

### olympics ✅
No changes needed. HUR53, WHSW1, BKHW1 are all correct.

### west-slopes-north ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | EPSW1 | Easy Pass | 5,270 ft | 48.859 | -121.439 |
| OLD | MNOW1 | MF Nooksack | 4,970 ft | 48.825 | -121.930 |
| OLD | WCSW1 | Wells Creek | 4,030 ft | 48.866 | -121.790 |
| **NEW** | **MTB50** | **Mt Baker Pan Dome** | **~5,000 ft** | **~48.86** | **~-121.69** |
| **NEW** | **MNOW1** | **MF Nooksack** | **4,970 ft** | **48.825** | **-121.930** |
| **NEW** | **WCSW1** | **Wells Creek** | **4,030 ft** | **48.866** | **-121.790** |

**Issue:** EPSW1 (Easy Pass) is east of the crest. Replace with NWAC's own Mt Baker station.

### west-slopes-central ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | MTNW1 | Quartz Mountain | 5,860 ft | 47.067 | -121.079 |
| OLD | SAWW1 | Sawmill Ridge | 4,640 ft | 47.160 | -121.422 |
| OLD | SASW1 | Sasse Ridge | 4,340 ft | 47.385 | -121.063 |

**Issue:** All 3 are east-side SNOTEL stations near Cle Elum — identical to snoqualmie-pass. This zone covers Mountain Loop Hwy / Hwy 2 west of Skykomish. NWAC has limited stations here.
**Action needed:** Research west-side stations. KUSW1 (Skookum Creek) + EPSW1 (Easy Pass) + STS48 (Stevens Pass Grace Lakes) could work.

### west-slopes-south 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | CAYW1 | Cayuse Pass | 5,240 ft | 46.870 | -121.534 |
| OLD | LOHW1 | Lost Horse | 5,120 ft | 46.358 | -121.081 |
| OLD | KCHW1 | ASSGN20190819 | 2,326 ft | 46.729 | -121.856 |
| **NEW** | **CMT69** | **Crystal Mt Summit** | **~6,900 ft** | **~46.94** | **~-121.47** |
| **NEW** | **PVC55** | **Paradise (Mt Rainier)** | **~5,500 ft** | **~46.79** | **~-121.74** |
| **NEW** | **WPS59** | **White Pass Top** | **~5,900 ft** | **~46.64** | **~-121.39** |

**Issue:** KCHW1 "ASSGN20190819" is a bogus placeholder station. Replace entire set with NWAC-operated stations.

### stevens-pass 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | SASW1 | Sasse Ridge | 4,340 ft | 47.385 | -121.063 |
| OLD | KUSW1 | Skookum Creek | 3,310 ft | 47.684 | -121.610 |
| OLD | CPPW1 | Cooper Pass | 3,278 ft | 47.463 | -121.211 |
| **NEW** | **STS40** | **Stevens Pass Schmidt Haus** | **3,950 ft** | **47.746** | **-121.093** |
| **NEW** | **STS52** | **Stevens Pass Skyline** | **~5,200 ft** | **~47.75** | **~-121.09** |
| **NEW** | **STS48** | **Stevens Pass Grace Lakes** | **~4,800 ft** | **~47.75** | **~-121.09** |

**Issue:** No actual Stevens Pass stations! All 3 current are SNOTEL stations miles away. Use NWAC's own Stevens Pass network.

### snoqualmie-pass 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | MTNW1 | Quartz Mountain | 5,860 ft | 47.067 | -121.079 |
| OLD | SAWW1 | Sawmill Ridge | 4,640 ft | 47.160 | -121.422 |
| OLD | SASW1 | Sasse Ridge | 4,340 ft | 47.385 | -121.063 |
| **NEW** | **ALP44** | **Alpental Mid-Mountain** | **~4,400 ft** | **~47.44** | **~-121.43** |
| **NEW** | **SNO30** | **Snoqualmie Pass** | **~3,010 ft** | **~47.43** | **~-121.41** |
| **NEW** | **MTW43** | **Mt Washington** | **~4,300 ft** | **~47.39** | **~-121.41** |

**Issue:** All 3 are east-side SNOTEL stations, identical to west-slopes-central. Use NWAC's own Snoqualmie stations.

### east-slopes-north ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | HRPW1 | Harts Pass | 6,490 ft | 48.710 | -120.659 |
| OLD | SWSW1 | Swamp Creek | 3,930 ft | 48.571 | -120.783 |
| OLD | NLM34 | Newhalem | 3,430 ft | 48.686 | -121.252 |
| **NEW** | **HRPW1** | **Harts Pass** | **6,490 ft** | **48.710** | **-120.659** |
| **NEW** | **WAP55** | **Washington Pass** | **~5,500 ft** | **~48.52** | **~-120.67** |
| **NEW** | **SWSW1** | **Swamp Creek** | **3,930 ft** | **48.571** | **-120.783** |

**Issue:** NLM34 (Newhalem) is west of the crest. Replace with NWAC Washington Pass station.

### east-slopes-central ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | MTNW1 | Quartz Mountain | 5,860 ft | 47.067 | -121.079 |
| OLD | TRGW1 | Trough | 5,480 ft | 47.233 | -120.294 |
| OLD | GRCW1 | Grouse Camp | 5,390 ft | 47.281 | -120.488 |
| **NEW** | **MSR53** | **Mission Ridge Mid** | **~5,300 ft** | **~47.29** | **~-120.40** |
| **NEW** | **TRGW1** | **Trough** | **5,480 ft** | **47.233** | **-120.294** |
| **NEW** | **GRCW1** | **Grouse Camp** | **5,390 ft** | **47.281** | **-120.488** |

**Issue:** MTNW1 shared with 2 other zones. Replace with NWAC Mission Ridge station.

### east-slopes-south ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | WPS58 | White Pass Upper | 5,800 ft | 46.621 | -121.387 |
| OLD | LOHW1 | Lost Horse | 5,120 ft | 46.358 | -121.081 |
| OLD | OHAW1 | Ohanapecosh | 1,950 ft | 46.731 | -121.571 |
| **NEW** | **WPS58** | **White Pass Upper** | **5,800 ft** | **46.621** | **-121.387** |
| **NEW** | **LOHW1** | **Lost Horse** | **5,120 ft** | **46.358** | **-121.081** |
| **NEW** | **CHP55** | **Chinook Pass** | **~5,500 ft** | **~46.87** | **~-121.52** |

**Issue:** OHAW1 (Ohanapecosh, 1,950 ft) is valley bottom. Replace with NWAC Chinook Pass station.

---

## OREGON

### mt-hood ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | TIM59 | Timberline Lodge | 5,800 ft | 45.330 | -121.711 |
| OLD | GVT50 | Skibowl Summit | 5,010 ft | 45.289 | -121.783 |
| OLD | FFMO3 | Fifteenmile | 5,970 ft | 45.350 | -121.530 |
| **NEW** | **MTHO3** | **Mt Hood Test Site SNOTEL** | **5,380 ft** | **45.32** | **-121.72** |
| **NEW** | **GVT50** | **Skibowl Summit** | **5,010 ft** | **45.289** | **-121.783** |
| **NEW** | **FFMO3** | **Fifteenmile** | **5,970 ft** | **45.350** | **-121.530** |

**Issue:** TIM59 may be inactive. Replace with MTHO3 (Mt Hood Test Site SNOTEL).

### central-cascades ✅
Keep current: BEDO3, TCMO3, RORO3. Verify RORO3 is active.

### newberry ✅
Keep current: BEDO3, TCMO3, CSTO3. Good mapping.

### northern-wallowas ✅
Keep current: TYLO3, MHWO3, ANRO3. Correct for northern zone.

### southern-wallowas ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | TYLO3 | Taylor Green | 5,740 ft | 45.077 | -117.551 |
| OLD | MHWO3 | Mt Howard | 7,910 ft | 45.265 | -117.174 |
| OLD | ANRO3 | Aneroid Lake #2 | 7,400 ft | 45.213 | -117.193 |
| **NEW** | **TYLO3** | **Taylor Green** | **5,740 ft** | **45.077** | **-117.551** |
| **NEW** | **ANRO3** | **Aneroid Lake #2** | **7,400 ft** | **45.213** | **-117.193** |
| **NEW** | *TBD* | *Kip Rand station (WAC-operated, need STID)* | *7,434 ft* | | |

**Issue:** Identical to northern-wallowas. MHWO3 is in far northern end. Need Kip Rand STID from WAC.

### elkhorns ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | BORO3 | Bourne | 5,850 ft | 44.831 | -118.188 |
| OLD | WFCO3 | Wolf Creek | 5,630 ft | 45.067 | -118.152 |
| OLD | EIMO3 | Eilertson Meadows | 5,510 ft | 44.869 | -118.114 |
| **NEW** | *TBD* | *Anthony Lake SNOTEL (site 1245)* | *7,160 ft* | *44.97* | *-118.23* |
| **NEW** | **BORO3** | **Bourne** | **5,850 ft** | **44.831** | **-118.188** |
| **NEW** | **EIMO3** | **Eilertson Meadows** | **5,510 ft** | **44.869** | **-118.114** |

**Issue:** Missing Anthony Lake SNOTEL (7,160 ft) — highest station in the Elkhorns. Need to verify Synoptic STID.

### blues ✅
Keep current: BLPO3, BORO3, GLDO3. Good mapping.

### southern-oregon ✅
Keep current: SWNO3, SSSO3, BCDO3. Good mapping.

### mount-shasta 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | BCDO3 | Billie Creek Divide (OR!) | 5,280 ft | 42.407 | -122.266 |
| OLD | BRMO3 | Big Red Mountain (OR!) | 6,050 ft | 42.053 | -122.855 |
| OLD | FRLO3 | Fourmile Lake (OR!) | 5,970 ft | 42.439 | -122.229 |
| **NEW** | **MSGRB** | **Gray Butte** | **7,958 ft** | **41.345** | **-122.196** |
| **NEW** | **MSSKI** | **Ski Bowl** | **7,617 ft** | **41.358** | **-122.207** |
| **NEW** | **SDFC1** | **Sand Flat** | **6,811 ft** | **41.349** | **-122.246** |

**Issue:** ALL 3 stations are in Oregon, 40-80 miles north. MSAC operates their own stations on Mt Shasta with confirmed Synoptic STIDs.

---

## CALIFORNIA

### central-sierra-nevada ✅
Keep current: ILKC1, LLSC1, SQWC1. Good mapping.

### eastside-region ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | TIRC1 | Tioga Pass Entry | 10,000 ft | 37.911 | -119.259 |
| OLD | XMPC1 | Mean Peak | 9,867 ft | 38.397 | -119.525 |
| OLD | TIOC1 | Tioga Pass-Dana Meadows | 9,816 ft | 37.896 | -119.257 |
| **NEW** | **TIRC1** | **Tioga Pass Entry** | **10,000 ft** | **37.911** | **-119.259** |
| **NEW** | **RCKC1** | **Rock Creek Lakes** | **9,744 ft** | **37.458** | **-118.735** |
| **NEW** | **XMPC1** | **Mean Peak** | **9,867 ft** | **38.397** | **-119.525** |

**Issue:** TIRC1 and TIOC1 are essentially co-located (both at Tioga Pass). Replace TIOC1 with RCKC1 for southern ESAC coverage.

### bridgeport 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | TIRC1 | Tioga Pass Entry | 10,000 ft | 37.911 | -119.259 |
| OLD | XMPC1 | Mean Peak | 9,867 ft | 38.397 | -119.525 |
| OLD | TIOC1 | Tioga Pass-Dana Meadows | 9,816 ft | 37.896 | -119.257 |
| **NEW** | **XMPC1** | **Mean Peak** | **9,867 ft** | **38.397** | **-119.525** |
| **NEW** | **MNPC1** | **Monitor Pass** | **8,304 ft** | **38.668** | **-119.609** |
| **NEW** | **LVTC1** | **Leavitt Meadows** | **7,197 ft** | **38.304** | **-119.551** |

**Issue:** Identical to ESAC — but BAC covers Sonora Pass/Bridgeport area, distinctly different zone.

---

## NEW MEXICO & ARIZONA

### northern-new-mexico ✅
Keep current: TABN5, SHUN5, RRPN5. Good mapping.

### san-francisco-peaks 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | XSCA3 | Snowslide Canyon | 9,730 ft | 35.342 | -111.651 |
| OLD | MMNA3 | Mormon Mtn Summit | 8,500 ft | 34.970 | -111.509 |
| OLD | MRMA3 | Mormon Mountain | 7,500 ft | 34.941 | -111.518 |
| **NEW** | **ASBTP** | **AZ Snowbowl Top Patrol** | **11,555 ft** | **35.326** | **-111.686** |
| **NEW** | **XSCA3** | **Snowslide Canyon** | **9,730 ft** | **35.342** | **-111.651** |
| **NEW** | **JE356** | **Upper Weatherford** | **10,025 ft** | **35.320** | **-111.641** |

**Issue:** 2 Mormon Mountain stations are 26 miles away on a different mountain. KPAC has stations directly on the San Francisco Peaks.

---

## IDAHO - SNFAC (Sawtooth)

### banner-summit ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | ATAI1 | Atlanta Summit | 7,580 ft | 43.757 | -115.239 |
| OLD | BNRI1 | Banner Summit | 7,100 ft | 44.303 | -115.233 |
| OLD | JKPI1 | Jackson Peak | 7,070 ft | 44.051 | -115.443 |
| **NEW** | **BNRI1** | **Banner Summit ITD** | **7,100 ft** | **44.303** | **-115.233** |
| **NEW** | **BASI1** | **Banner Summit SNOTEL** | **7,040 ft** | **44.303** | **-115.233** |
| **NEW** | **BENLK** | **Bench Lakes** | **7,770 ft** | **~43.97** | **~-114.94** |

**Issue:** ATAI1 (Atlanta Summit) is 35+ mi south. JKPI1 also far south.

### galena-summit-eastern-mtns 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | VNNI1 | Vienna Mine | 8,960 ft | 43.799 | -114.853 |
| OLD | ATAI1 | Atlanta Summit | 7,580 ft | 43.757 | -115.239 |
| OLD | ITD42 | Smiley Creek Airport | 7,237 ft | 43.910 | -114.795 |
| **NEW** | **GLSI1** | **Galena Summit SNOTEL** | **8,790 ft** | **43.87** | **-114.71** |
| **NEW** | **SVT** | **Titus Ridge** | **10,000 ft** | **~43.87** | **~-114.71** |
| **NEW** | **LWDI1** | **Lost-Wood Divide SNOTEL** | **7,870 ft** | **43.82** | **-114.27** |

**Issue:** Identical to 2 other zones. Now differentiated with Galena-specific stations. SVT provides critical ridgeline wind data.

### sawtooth-western-smoky-mtns 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | VNNI1 | Vienna Mine | 8,960 ft | 43.799 | -114.853 |
| OLD | ATAI1 | Atlanta Summit | 7,580 ft | 43.757 | -115.239 |
| OLD | ITD42 | Smiley Creek Airport | 7,237 ft | 43.910 | -114.795 |
| **NEW** | **VNNI1** | **Vienna Mine SNOTEL** | **8,960 ft** | **43.799** | **-114.853** |
| **NEW** | **VINMT** | **Vienna Mine Wind** | **9,590 ft** | **~43.80** | **~-114.85** |
| **NEW** | **BENLK** | **Bench Lakes** | **7,770 ft** | **~43.97** | **~-114.94** |

**Issue:** Was identical to 2 other zones. Now uses Sawtooth/Smoky-specific stations.

### soldier-wood-river-valley-mtns 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | VNNI1 | Vienna Mine | 8,960 ft | 43.799 | -114.853 |
| OLD | ATAI1 | Atlanta Summit | 7,580 ft | 43.757 | -115.239 |
| OLD | ITD42 | Smiley Creek Airport | 7,237 ft | 43.910 | -114.795 |
| **NEW** | **DHDI1** | **Dollarhide Summit SNOTEL** | **8,390 ft** | **43.60** | **-114.67** |
| **NEW** | **SVB1H** | **Bald Mountain (Sun Valley)** | **9,010 ft** | **~43.67** | **~-114.35** |
| **NEW** | **HYNI1** | **Hyndman SNOTEL** | **7,590 ft** | **43.72** | **-114.17** |

**Issue:** Was identical to 2 other zones. Now uses Wood River Valley-specific stations.

---

## IDAHO - PAC (Payette)

### salmon-river-mountains ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | BNRI1 | Banner Summit | 7,100 ft | 44.303 | -115.233 |
| OLD | BKSI1 | Big Creek Summit | 6,580 ft | 44.626 | -115.794 |
| OLD | ITD68 | Little Donner | 5,239 ft | 44.580 | -116.039 |
| **NEW** | **GRAMT** | **Granite Mountain** | **~7,500 ft** | **~45.10** | **~-116.20** |
| **NEW** | **BKSI1** | **Big Creek Summit** | **6,580 ft** | **44.626** | **-115.794** |
| **NEW** | **DDSI1** | **Deadwood Summit SNOTEL** | **6,990 ft** | **44.55** | **-115.57** |

**Issue:** BNRI1 is in SNFAC territory. ITD68 is a low highway station. Use PAC's primary station (Granite Mountain).

### west-mountains ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | BKSI1 | Big Creek Summit | 6,580 ft | 44.626 | -115.794 |
| OLD | ITD69 | Goose Creek Grade | 5,417 ft | 44.929 | -116.156 |
| OLD | ITD68 | Little Donner | 5,239 ft | 44.580 | -116.039 |
| **NEW** | **GRAMT** | **Granite Mountain** | **~7,500 ft** | **~45.10** | **~-116.20** |
| **NEW** | **BRRI1** | **Brundage Reservoir SNOTEL** | **6,280 ft** | **45.05** | **-116.13** |
| **NEW** | **BKSI1** | **Big Creek Summit** | **6,580 ft** | **44.626** | **-115.794** |

**Issue:** Two low highway stations replaced with actual SNOTEL and PAC's primary station.

---

## IDAHO/MONTANA - IPAC (Idaho Panhandle)

### selkirk-mountains ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | STZI1 | Schweitzer Basin | 6,090 ft | 48.374 | -116.639 |
| OLD | BRMI1 | Bear Mountain | 5,400 ft | 48.306 | -116.074 |
| OLD | MYRI1 | Myrtle Creek | 3,520 ft | 48.723 | -116.463 |
| **NEW** | **STZI1** | **Schweitzer Basin** | **6,090 ft** | **48.374** | **-116.639** |
| **NEW** | **HDLI1** | **Hidden Lake** | **5,000 ft** | **48.894** | **-116.757** |
| **NEW** | **BRMI1** | **Bear Mountain** | **5,400 ft** | **48.306** | **-116.074** |

**Issue:** MYRI1 (3,520 ft) too low. Replace with HDLI1 (5,000 ft).

### west-cabinet-mountains ✅
Keep current: CHIM8, BRMI1, MOQI1. Idaho-side stations are correct.

### east-cabinet-mountains 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | CHIM8 | Chicago Ridge | 5,800 ft | 48.060 | -115.700 |
| OLD | BRMI1 | Bear Mountain | 5,400 ft | 48.306 | -116.074 |
| OLD | MOQI1 | Mosquito Ridge | 5,200 ft | 48.057 | -116.231 |
| **NEW** | **CHIM8** | **Chicago Ridge** | **5,800 ft** | **48.060** | **-115.700** |
| **NEW** | **PMNM8** | **Poorman Creek** | **5,050 ft** | **48.127** | **-115.623** |
| **NEW** | **BANM8** | **Banfield Mountain** | **5,580 ft** | **48.571** | **-115.446** |

**Issue:** Was identical to west-cabinet. Now differentiated with Montana-side stations.

### silver-valley-bitterroot-mountains 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | ITDA7 | Lookout Pass | 4,526 ft | 47.461 | -115.694 |
| OLD | ITD90 | Wallace Viaduct | 2,792 ft | 47.474 | -115.908 |
| OLD | ITDA6 | Cataldo | 2,175 ft | 47.547 | -116.331 |
| **NEW** | **LKTI1** | **Lookout SNOTEL** | **5,180 ft** | **47.458** | **-115.706** |
| **NEW** | **SNSI1** | **Sunset** | **5,570 ft** | **47.555** | **-115.824** |
| **NEW** | **HUGI1** | **Humboldt Gulch** | **4,260 ft** | **47.533** | **-115.783** |

**Issue:** ALL 3 were highway stations (2,175-4,526 ft). Replaced with mountain SNOTEL stations.

### purcell-mountains ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | CHIM8 | Chicago Ridge | 5,800 ft | 48.060 | -115.700 |
| OLD | BRMI1 | Bear Mountain | 5,400 ft | 48.306 | -116.074 |
| OLD | BANM8 | Banfield Mountain | 5,600 ft | 48.571 | -115.446 |
| **NEW** | **BANM8** | **Banfield Mountain** | **5,580 ft** | **48.571** | **-115.446** |
| **NEW** | **HAWM8** | **Hawkins Lake** | **6,460 ft** | **48.967** | **-115.950** |
| **NEW** | **STAM8** | **Stahl Peak** | **6,040 ft** | **48.917** | **-114.867** |

**Issue:** CHIM8 and BRMI1 are Cabinet Mountains stations. Replace with Purcell-area stations.

---

## MONTANA - GNFAC (Gallatin)

### bridger-range ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | BRCM8 | Brackett Creek | 7,320 ft | 45.891 | -110.939 |
| OLD | BZNM8 | Bozeman | 4,905 ft | 45.663 | -111.072 |
| OLD | SFSM8 | S Fork Shields | 8,100 ft | 46.090 | -110.434 |
| **NEW** | **BRCM8** | **Brackett Creek SNOTEL** | **7,320 ft** | **45.891** | **-110.939** |
| **NEW** | **SAJM8** | **Sacajawea SNOTEL** | **6,550 ft** | **45.874** | **-110.928** |
| **NEW** | **BBALP** | **Bridger Bowl Alpine** | **7,500 ft** | **45.829** | **-110.922** |

**Issue:** BZNM8 (Bozeman) is valley floor. SFSM8 is wrong side of range.

### northern-gallatin-range 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | YCTIM | YC Timber Station | 9,400 ft | 45.231 | -111.451 |
| OLD | YCAND | YC Andesite Mountain | 8,850 ft | 45.263 | -111.408 |
| OLD | YCBAS | YC Base Area | 7,200 ft | 45.239 | -111.415 |
| **NEW** | **SHFM8** | **Shower Falls SNOTEL** | **8,060 ft** | **45.401** | **-110.958** |
| **NEW** | **LCKM8** | **Lick Creek SNOTEL** | **6,860 ft** | **45.504** | **-110.966** |
| **NEW** | **BRCM8** | **Brackett Creek SNOTEL** | **7,320 ft** | **45.891** | **-110.939** |

**Issue:** ALL 3 are Yellowstone Club stations in the Madison Range — wrong mountain range entirely!

### southern-gallatin-range 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | YCTIM | YC Timber Station | 9,400 ft | 45.231 | -111.451 |
| OLD | YCAND | YC Andesite Mountain | 8,850 ft | 45.263 | -111.408 |
| OLD | YCBAS | YC Base Area | 7,200 ft | 45.239 | -111.415 |
| **NEW** | **SHFM8** | **Shower Falls SNOTEL** | **8,060 ft** | **45.401** | **-110.958** |
| **NEW** | **LCKM8** | **Lick Creek SNOTEL** | **6,860 ft** | **45.504** | **-110.966** |
| **NEW** | **CRRM8** | **Carrot Basin SNOTEL** | **9,000 ft** | **44.962** | **-111.294** |

**Issue:** Same wrong-range problem. CRRM8 adds southern/high-elevation coverage.

### northern-madison-range ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | YCTIM | YC Timber Station | 9,400 ft | 45.231 | -111.451 |
| OLD | YCAND | YC Andesite Mountain | 8,850 ft | 45.263 | -111.408 |
| OLD | YCBAS | YC Base Area | 7,200 ft | 45.239 | -111.415 |
| **NEW** | **BSKM8** | **Lone Mountain SNOTEL** | **8,880 ft** | **45.274** | **-111.427** |
| **NEW** | **YCTIM** | **YC Timber Station** | **9,400 ft** | **45.231** | **-111.451** |
| **NEW** | **YCAND** | **YC Andesite Mountain** | **8,850 ft** | **45.263** | **-111.408** |

**Issue:** YC stations are in Madison Range (correct range!) but add GNFAC's primary SNOTEL. Drop base area station.

### southern-madison-range 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | YCTIM | YC Timber Station | 9,400 ft | 45.231 | -111.451 |
| OLD | YCAND | YC Andesite Mountain | 8,850 ft | 45.263 | -111.408 |
| OLD | WYSM8 | West Yellowstone | 6,700 ft | 44.659 | -111.092 |
| **NEW** | **CRRM8** | **Carrot Basin SNOTEL** | **9,000 ft** | **44.962** | **-111.294** |
| **NEW** | **BEVM8** | **Beaver Creek SNOTEL** | **7,850 ft** | **44.950** | **-111.359** |
| **NEW** | **WYSM8** | **West Yellowstone** | **6,700 ft** | **44.659** | **-111.092** |

**Issue:** YCTIM/YCAND are 20+ mi north in N. Madison. Use GNFAC's actual S. Madison stations.

### lionhead-area ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | BLBM8 | Black Bear | 8,170 ft | 44.514 | -111.128 |
| OLD | WYSM8 | West Yellowstone | 6,700 ft | 44.659 | -111.092 |
| OLD | ITD55 | Henry's Lake | 6,617 ft | 44.618 | -111.335 |
| **NEW** | **MPLM8** | **Madison Plateau SNOTEL** | **7,750 ft** | **~44.583** | **~-111.117** |
| **NEW** | **WYSM8** | **West Yellowstone** | **6,700 ft** | **44.659** | **-111.092** |
| **NEW** | **WSKM8** | **Whiskey Creek SNOTEL** | **6,800 ft** | **44.611** | **-111.150** |

**Issue:** ITD55 is road station. BLBM8 more relevant to Island Park. Use GNFAC's Lionhead stations.

### island-park ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | BLBM8 | Black Bear | 8,170 ft | 44.514 | -111.128 |
| OLD | WYSM8 | West Yellowstone | 6,700 ft | 44.659 | -111.092 |
| OLD | ITD55 | Henry's Lake | 6,617 ft | 44.618 | -111.335 |
| **NEW** | **WHEI1** | **White Elephant SNOTEL** | **7,710 ft** | **44.533** | **-111.411** |
| **NEW** | **BLBM8** | **Black Bear SNOTEL** | **8,170 ft** | **44.684** | **-111.128** |
| **NEW** | **ISPI1** | **Island Park SNOTEL** | **6,290 ft** | **44.420** | **-111.385** |

**Issue:** Was identical to Lionhead. Now differentiated with GNFAC's actual Island Park stations.

### cooke-city 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | PRKW4 | Parker Peak | 9,400 ft | 44.734 | -109.915 |
| OLD | BLTW4 | Beartooth Lake | 9,360 ft | 44.943 | -109.567 |
| OLD | EVNW4 | Evening Star | 9,200 ft | 44.653 | -109.784 |
| **NEW** | **FSHM8** | **Fisher Creek SNOTEL** | **9,100 ft** | **45.062** | **-109.945** |
| **NEW** | **MNPM8** | **Monument Peak SNOTEL** | **8,850 ft** | **45.218** | **-110.237** |
| **NEW** | **WHTM8** | **White Mill SNOTEL** | **8,700 ft** | **45.046** | **-109.910** |

**Issue:** ALL 3 were distant Wyoming stations (19+ mi away). Use GNFAC's actual Cooke City stations.

---

## MONTANA - FAC (Flathead) + WCMAC (West Central Montana)

### whitefish-range ✅
Keep current: LKMMT, BIGMS, FTMM8. Good mapping.

### swan-range 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | MTM94 | CSKT Bison Range | 2,667 ft | 47.366 | -114.258 |
| OLD | MSPM8 | Moss Peak | 6,780 ft | 47.685 | -113.962 |
| OLD | NFJM8 | North Fork Jocko | 6,330 ft | 47.273 | -113.756 |
| **NEW** | **NOIM8** | **Noisy Basin SNOTEL** | **6,070 ft** | **48.150** | **-113.950** |
| **NEW** | **MSPM8** | **Moss Peak SNOTEL** | **6,780 ft** | **47.685** | **-113.962** |
| **NEW** | **MAEMT** | **Mount Aeneas** | **7,186 ft** | **~47.8** | **~-113.8** |

**Issue:** MTM94 is a valley-floor agricultural station at 2,667 ft. NOIM8 is FAC's "favorite mountain SNOTEL."

### flathead-range-glacier-np ✅
Keep current: S11MT, FTMM8, PICM8. Good mapping.

### seeley-lake ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | MTM94 | CSKT Bison Range | 2,667 ft | 47.366 | -114.258 |
| OLD | STTM8 | Stuart Mountain | 7,400 ft | 46.995 | -113.927 |
| OLD | MSPM8 | Moss Peak | 6,780 ft | 47.685 | -113.962 |
| **NEW** | **STTM8** | **Stuart Mountain SNOTEL** | **7,270 ft** | **47.000** | **-113.927** |
| **NEW** | **NFJM8** | **North Fork Jocko SNOTEL** | **6,110 ft** | **47.273** | **-113.756** |
| **NEW** | **MSPM8** | **Moss Peak SNOTEL** | **6,780 ft** | **47.685** | **-113.962** |

**Issue:** MTM94 (2,667 ft agricultural station) replaced with NFJM8.

### rattlesnake ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | MTM94 | CSKT Bison Range | 2,667 ft | 47.366 | -114.258 |
| OLD | STTM8 | Stuart Mountain | 7,400 ft | 46.995 | -113.927 |
| OLD | NFJM8 | North Fork Jocko | 6,330 ft | 47.273 | -113.756 |
| **NEW** | **STTM8** | **Stuart Mountain SNOTEL** | **7,270 ft** | **47.000** | **-113.927** |
| **NEW** | **NFJM8** | **North Fork Jocko SNOTEL** | **6,110 ft** | **47.273** | **-113.756** |
| **NEW** | **NOIM8** | **Noisy Basin SNOTEL** | **6,070 ft** | **48.150** | **-113.950** |

**Issue:** MTM94 replaced with NOIM8.

### bitterroot ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | ITD28 | Lolo Pass (road) | 5,262 ft | 46.636 | -114.580 |
| OLD | LPSI1 | Lolo Pass (SNOTEL) | 5,240 ft | 46.634 | -114.581 |
| OLD | TWLM8 | Twin Lakes | 6,400 ft | 46.144 | -114.506 |
| **NEW** | **SDMM8** | **Saddle Mtn SNOTEL** | **7,890 ft** | **45.700** | **-113.967** |
| **NEW** | **LPSI1** | **Lolo Pass SNOTEL** | **5,280 ft** | **46.634** | **-114.581** |
| **NEW** | **TWLM8** | **Twin Lakes SNOTEL** | **6,400 ft** | **46.144** | **-114.506** |

**Issue:** Two co-located Lolo Pass stations. Replace road station with Saddle Mtn for high-elevation S. Bitterroot.

---

## WYOMING - BTAC (Bridger-Teton) + EWYAIX

### tetons ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | JHR | Jackson Hole-Raymer | 9,657 ft | 43.604 | -110.856 |
| OLD | GTHW4 | Grand Targhee | 9,260 ft | 43.779 | -110.928 |
| OLD | SNKWY | Snow King | 7,808 ft | 43.463 | -110.763 |
| **NEW** | **JHR** | **Jackson Hole-Raymer** | **9,657 ft** | **43.604** | **-110.856** |
| **NEW** | **GTHW4** | **Grand Targhee** | **9,260 ft** | **43.779** | **-110.928** |
| **NEW** | **SPMBT** | **Surprise Meadow** | **9,580 ft** | **43.729** | **-110.776** |

**Issue:** SNKWY (Snow King) is in-town Jackson. Replace with BTAC's own Grand Teton NP station. Fallback: PHBW4 (Phillips Bench 8,170 ft).

### togwotee-pass ✅
Keep current: TOGW4, LTWW4, TOPW4. Good mapping.

### snake-river-range ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | JHR | Jackson Hole-Raymer | 9,657 ft | 43.604 | -110.856 |
| OLD | GTHW4 | Grand Targhee | 9,260 ft | 43.779 | -110.928 |
| OLD | ITD56 | Botts RWIS | 6,005 ft | 43.878 | -111.362 |
| **NEW** | **PHBW4** | **Phillips Bench SNOTEL** | **8,170 ft** | **43.517** | **-110.917** |
| **NEW** | **GTHW4** | **Grand Targhee** | **9,260 ft** | **43.779** | **-110.928** |
| **NEW** | **INCW4** | **Indian Creek SNOTEL** | **9,400 ft** | **42.300** | **-110.683** |

**Issue:** JHR duplicated from Tetons. ITD56 is highway station. Use Snake River Range-area stations.

### salt-river-wyoming-ranges ✅
Keep current: SCDW4, BBSW4, TRPW4. Excellent coverage.

### big-horns ✅
Keep current: CPKW4, BGEW4, SCRW4. Excellent coverage.

### snowy-range ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | BKLW4 | Brooklyn Lake | 10,240 ft | 41.359 | -106.232 |
| OLD | BLHW4 | Blackhall Mtn | 9,820 ft | 41.056 | -106.714 |
| OLD | MBSW4 | Med Bow | 10,500 ft | 41.378 | -106.347 |
| **NEW** | **BKLW4** | **Brooklyn Lake** | **10,240 ft** | **41.359** | **-106.232** |
| **NEW** | **MBSW4** | **Med Bow** | **10,500 ft** | **41.378** | **-106.347** |
| **NEW** | **WBSW4** | **Webber Springs** | **9,250 ft** | **41.167** | **-106.933** |

**Issue:** BLHW4 (Blackhall Mtn) is in Sierra Madre range, not Snowy Range.

### sierra-madre ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | BLHW4 | Blackhall Mtn | 9,820 ft | 41.056 | -106.714 |
| OLD | C3RED | Red Creek | 8,228 ft | 40.772 | -106.983 |
| OLD | OLDW4 | Old Battle | 10,000 ft | 41.154 | -106.969 |
| **NEW** | **BLHW4** | **Blackhall Mtn** | **9,820 ft** | **41.056** | **-106.714** |
| **NEW** | **WKPW4** | **Whiskey Park SNOTEL** | **8,950 ft** | **41.000** | **-106.900** |
| **NEW** | **OLDW4** | **Old Battle** | **10,000 ft** | **41.154** | **-106.969** |

**Issue:** C3RED is unverifiable station. Replace with established Whiskey Park SNOTEL.

---

## UTAH - UAC (Utah Avalanche Center)

### logan ✅
Keep current: CRDUT, PSINK, WSUBC. Good mapping.

### ogden ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | UTPWD | Powder Mountain | 8,897 ft | 41.370 | -111.764 |
| OLD | UTPW2 | Powder Mountain 2 | 8,460 ft | 41.374 | -111.767 |
| OLD | CKRU1 | Chicken Ridge | 7,648 ft | 41.332 | -111.303 |
| **NEW** | **UTPWD** | **Powder Mountain** | **8,897 ft** | **41.370** | **-111.764** |
| **NEW** | **CKRU1** | **Chicken Ridge** | **7,648 ft** | **41.332** | **-111.303** |
| **NEW** | **BLPU1** | **Ben Lomond Peak SNOTEL** | **7,688 ft** | **41.376** | **-111.944** |

**Issue:** Two Powder Mountain stations redundant (<0.5 mi apart). Add Ben Lomond Peak for western Ogden coverage.

### salt-lake ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | IFF | Cardiff Peak | 10,059 ft | 40.595 | -111.652 |
| OLD | SOL | Solitude Powderhorn | 9,888 ft | 40.608 | -111.604 |
| OLD | BUNUT | Bunnells Ridge | 8,800 ft | 40.315 | -111.564 |
| **NEW** | **IFF** | **Cardiff Peak** | **10,059 ft** | **40.595** | **-111.652** |
| **NEW** | **SOL** | **Solitude Powderhorn** | **9,888 ft** | **40.608** | **-111.604** |
| **NEW** | **CLN** | **Alta Collins** | **9,662 ft** | **40.576** | **-111.638** |

**Issue:** BUNUT is in Utah County (Provo zone). Replace with Alta Collins in Little Cottonwood Canyon.

### provo 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | IFF | Cardiff Peak (Salt Lake!) | 10,059 ft | 40.595 | -111.652 |
| OLD | SOL | Solitude Powderhorn (Salt Lake!) | 9,888 ft | 40.608 | -111.604 |
| OLD | BUNUT | Bunnells Ridge | 8,800 ft | 40.315 | -111.564 |
| **NEW** | **BUNUT** | **Bunnells Ridge** | **8,800 ft** | **40.315** | **-111.564** |
| **NEW** | **TIMU1** | **Timpanogos Divide SNOTEL** | **8,170 ft** | **40.428** | **-111.617** |
| **NEW** | **CAMU1** | **Cascade Mountain SNOTEL** | **7,747 ft** | **40.283** | **-111.610** |

**Issue:** IFF and SOL are in Salt Lake County, 15+ mi north. Complete replacement with Provo-area stations.

### uintas ✅
Keep current: GSTPS, TRLU1, TPRUT. Good mapping.

### skyline ✅
Keep current: SEEU1, SKY, ULAMB. Good mapping.

### moab ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | GOLDB | Goldbasin | 10,050 ft | 38.465 | -109.264 |
| OLD | UTLSD | La Sal Divide | 7,734 ft | 38.343 | -109.209 |
| OLD | GDBU1 | Gold Basin | 10,076 ft | 38.470 | -109.260 |
| **NEW** | **GOLDB** | **Goldbasin** | **10,050 ft** | **38.465** | **-109.264** |
| **NEW** | **UTLSD** | **La Sal Divide** | **7,734 ft** | **38.343** | **-109.209** |
| **NEW** | **LSMU1** | **La Sal Mountain SNOTEL** | **9,577 ft** | **38.482** | **-109.272** |

**Issue:** GOLDB and GDBU1 are the same location. Replace duplicate with La Sal Mountain SNOTEL.

### abajos ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | UTMPO | Monticello POE (highway) | 6,821 ft | 37.873 | -109.306 |
| OLD | BUCU1 | Buckboard Flat | 8,923 ft | 37.869 | -109.447 |
| OLD | CJSU1 | Camp Jackson | 8,857 ft | 37.813 | -109.487 |
| **NEW** | **ABAUT** | **Abajo Peak** | **11,330 ft** | **37.841** | **-109.462** |
| **NEW** | **BUCU1** | **Buckboard Flat** | **8,923 ft** | **37.869** | **-109.447** |
| **NEW** | **CJSU1** | **Camp Jackson** | **8,857 ft** | **37.813** | **-109.487** |

**Issue:** UTMPO is a highway station. Replace with UAC's Abajo Peak ridgetop station (wind/temp only, no snow depth).

### southwest ✅
Keep current: BHCU1, UT14S, MDVU1. Good mapping.

---

## COLORADO - CAIC

### caic-front-range-north ✅
Keep current: LKIC2, WPRC2, CACMP. Good mapping.

### caic-front-range-boulder ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | BTSC2 | Berthoud Summit | 11,300 ft | 39.804 | -105.778 |
| OLD | LKIC2 | Lake Irene | 10,700 ft | 40.414 | -105.820 |
| OLD | WPRC2 | Willow Park | 10,700 ft | 40.433 | -105.733 |
| **NEW** | **CABTP** | **Berthoud Pass (CAIC)** | **11,861 ft** | **~39.80** | **~-105.77** |
| **NEW** | **BTSC2** | **Berthoud Summit SNOTEL** | **11,300 ft** | **39.804** | **-105.778** |
| **NEW** | **LBAC2** | **Loveland Basin SNOTEL** | **11,400 ft** | **~39.67** | **~-105.90** |

**Issue:** LKIC2 and WPRC2 are 40mi north in RMNP. Replace with Berthoud/Loveland area stations.

### caic-front-range-south 🔴
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | KAFF | Air Force Academy | 6,572 ft | 38.967 | -104.817 |
| OLD | KCOS | Colorado Springs Airport | 6,186 ft | 38.809 | -104.689 |
| OLD | KFCS | Butts Army Airfield | 5,842 ft | 38.683 | -104.760 |
| **NEW** | **GLNC2** | **Glen Cove (Pikes Peak) SNOTEL** | **11,460 ft** | **38.876** | **-105.074** |
| **NEW** | **ECLC2** | **Echo Lake SNOTEL** | **10,600 ft** | **39.660** | **-105.590** |
| **NEW** | **K4BM** | **Wilkerson Pass CDOT AWOS** | **11,279 ft** | **~39.04** | **~-105.48** |

**Issue:** ALL 3 are plains airport/military stations (5,800-6,600 ft). Worst mapping in entire config.

### caic-vail-summit-county ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | HOOC2 | Hoosier Pass | 11,611 ft | 39.361 | -106.060 |
| OLD | BTSC2 | Berthoud Summit | 11,300 ft | 39.804 | -105.778 |
| OLD | MIHC2 | Michigan Creek | 10,600 ft | 39.436 | -105.911 |
| **NEW** | **HOOC2** | **Hoosier Pass SNOTEL** | **11,400 ft** | **39.361** | **-106.060** |
| **NEW** | **CPMC2** | **Copper Mountain SNOTEL** | **10,550 ft** | **~39.49** | **~-106.17** |
| **NEW** | **CAABT** | **A-Basin Summit (CAIC)** | **12,462 ft** | **~39.64** | **~-105.87** |

**Issue:** BTSC2 shared with Front Range. Replace with zone-specific CAIC and SNOTEL stations.

### caic-elk-mountains ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | CAPC2 | Castle Peak | 11,500 ft | 39.000 | -106.840 |
| OLD | ASEC2 | Castle Creek/Aspen | 11,394 ft | 39.008 | -106.792 |
| OLD | SOSC2 | Schofield Pass | 10,700 ft | 39.015 | -107.049 |
| **NEW** | **CAAXH** | **Aspen SA Far East (CAIC)** | **11,250 ft** | | |
| **NEW** | **IDPC2** | **Independence Pass SNOTEL** | **10,600 ft** | **39.08** | **-106.61** |
| **NEW** | **SOSC2** | **Schofield Pass SNOTEL** | **10,700 ft** | **39.015** | **-107.049** |

**Issue:** CAPC2 and ASEC2 shared with Sawatch. Use Aspen-specific CAIC station + Independence Pass.

### caic-sawatch-range ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | CAPC2 | Castle Peak | 11,500 ft | 39.000 | -106.840 |
| OLD | ASEC2 | Castle Creek/Aspen | 11,394 ft | 39.008 | -106.792 |
| OLD | PRPC2 | Porphyry Creek | 10,760 ft | 38.489 | -106.340 |
| **NEW** | **CAMNP** | **Monarch Mountain (CAIC)** | **11,951 ft** | | |
| **NEW** | **PRPC2** | **Porphyry Creek SNOTEL** | **10,760 ft** | **38.489** | **-106.340** |
| **NEW** | **SGMC2** | **Sargents Mesa SNOTEL** | **11,530 ft** | **38.29** | **-106.37** |

**Issue:** Castle Peak/Creek are Aspen zone stations. Use Sawatch-specific stations (Monarch, Sargents Mesa).

### caic-grand-mesa-west-elk ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | CAELT | Dan K-Elkton | 11,147 ft | 38.970 | -107.040 |
| OLD | SOSC2 | Schofield Pass | 10,700 ft | 39.015 | -107.049 |
| OLD | CAIRW | Irwin Guides | 10,423 ft | 38.887 | -107.108 |
| **NEW** | **CAELT** | **Dan K-Elkton (CAIC)** | **11,147 ft** | **38.970** | **-107.040** |
| **NEW** | **CAIRW** | **Irwin Guides (CAIC)** | **10,423 ft** | **38.887** | **-107.108** |
| **NEW** | **CACB1** | **Crested Butte Mtn Resort (CAIC)** | **11,300 ft** | | |

**Issue:** SOSC2 shared with Elk Mountains. Replace with CAIC Crested Butte station.

### caic-park-range ✅
Keep current: ARPC2, STORM, TOWC2. Good mapping.

### caic-northern-san-juan ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | CATEL | Telluride Ski Resort | 12,159 ft | 37.899 | -107.821 |
| OLD | SLMC2 | Slumgullion | 11,440 ft | 37.991 | -107.203 |
| OLD | RMPC2 | Red Mountain Pass | 11,200 ft | 37.892 | -107.713 |
| **NEW** | **CATEL** | **Telluride Ski Resort (CAIC)** | **12,159 ft** | **37.899** | **-107.821** |
| **NEW** | **RMPC2** | **Red Mountain Pass SNOTEL** | **11,200 ft** | **37.892** | **-107.713** |
| **NEW** | **CASBK** | **Senator Beck (CSAS/CAIC)** | **12,186 ft** | | |

**Issue:** SLMC2 is on eastern edge of zone. Replace with Senator Beck — Colorado's premier avalanche research station.

### caic-southern-san-juan ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | WCSC2 | Wolf Creek Summit | 11,000 ft | 37.479 | -106.802 |
| OLD | URGC2 | Upper Rio Grande | 9,400 ft | 37.722 | -107.260 |
| OLD | GYBC2 | Grayback | 11,620 ft | 37.470 | -106.538 |
| **NEW** | **WCSC2** | **Wolf Creek Summit SNOTEL** | **10,930 ft** | **37.479** | **-106.802** |
| **NEW** | **GYBC2** | **Grayback SNOTEL** | **11,620 ft** | **37.470** | **-106.538** |
| **NEW** | **ELWC2** | **Elwood Pass SNOTEL** | **11,680 ft** | **37.41** | **-106.64** |

**Issue:** URGC2 at 9,400 ft is too low. Replace with Elwood Pass (11,680 ft).

### caic-sangre-de-cristo ⚠️
| | STID | Name | Elevation | Lat | Lon |
|---|---|---|---|---|---|
| OLD | SCYC2 | South Colony | 10,800 ft | 37.968 | -105.538 |
| OLD | UTCC2 | Ute Creek | 10,650 ft | 37.615 | -105.373 |
| OLD | CYNC2 | PSF3 Canon City QD | 11,569 ft | 38.042 | -105.186 |
| **NEW** | **SCYC2** | **South Colony SNOTEL** | **10,800 ft** | **37.968** | **-105.538** |
| **NEW** | **UTCC2** | **Ute Creek SNOTEL** | **10,650 ft** | **37.615** | **-105.373** |
| **NEW** | **HPAC2** | **Hayden Pass SNOTEL** | **10,700 ft** | **38.293** | **-105.851** |

**Issue:** CYNC2 is INACTIVE (no longer reporting). Replace with Hayden Pass SNOTEL.

---

## Stations Requiring STID Verification

Before implementing changes, the following station STIDs need verification via the Synoptic API:

### Alaska
- Mt. Alyeska SNOTEL (1103:AK:SNTL) — need Synoptic STID
- Indian Pass SNOTEL (946:AK:SNTL) — need Synoptic STID
- Cooper Lake SNOTEL (959:AK:SNTL) — need Synoptic STID
- Gold Cord Mine / Hatch Peak (HPAC) — may not be on Synoptic

### Oregon
- Anthony Lake SNOTEL (site 1245) — need Synoptic STID
- Kip Rand station (WAC) — need Synoptic STID

### NWAC (approximate elevations need verification)
- MTB50, STS40, STS52, STS48, ALP44, SNO30, MTW43, WAP55, MSR53, CMT69, PVC55, WPS59, CHP55

### Idaho
- SVT (Titus Ridge) — verify on Synoptic
- VINMT (Vienna Mine Wind) — verify on Synoptic
- SVB1H (Bald Mountain) — verify on Synoptic
- BENLK (Bench Lakes) — verify on Synoptic
- GRAMT (Granite Mountain) — verify on Synoptic

### Montana
- MAEMT (Mount Aeneas) — wind-only station, verify on Synoptic
- BBALP (Bridger Bowl Alpine) — verify on Synoptic
- ISPI1 (Island Park) — verify exact STID

### Wyoming
- SPMBT (Surprise Meadow) — may show as inactive
- INCW4 (Indian Creek) — verify exact STID

### Colorado
- CABTP (Berthoud Pass CAIC) — verify on Synoptic
- CAABT (A-Basin Summit CAIC) — verify on Synoptic
- CAAXH (Aspen SA Far East CAIC) — verify on Synoptic
- CAMNP (Monarch Mountain CAIC) — verify on Synoptic
- CACB1 (Crested Butte CAIC) — verify on Synoptic
- CASBK (Senator Beck CAIC) — verify on Synoptic
- K4BM (Wilkerson Pass) — verify on Synoptic
- GLNC2 (Glen Cove) — verify on Synoptic
