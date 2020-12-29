/* Die Datei hält die Daten für die auswaehlbaren Farben.
 *
 * Version 1.0 Attribute:
 *  - name: Das Attribut hält den Namen der Farben, welche im UI zu sehen ist
 *  - nameI18N: Das Attribut dient für den Anzeigetext, welcher abhängig von der ausgewählten Sprache des Anwenders ist (Hat bisher keinen Nutzen und ist nur ein Platzhalter für eine spätere Versionen)
 *  - hsv: Das Attribut hält den HSV-Wert der Farbe. Wird für Farbkonvertierungen und Berechnungen benutzt (siehe  ffr_martianColor).
 *  - rgb: Das Attribut hält den RGB-Wert der Farbe. Wird für Farbkonvertierungen und Berechnungen benutzt (siehe  ffr_martianColor).
 *  - hex: Das Attribut hält den HEX-Wert der Farbe. Wird für Farbkonvertierungen, Berechnungen (siehe  ffr_martianColor) und zur Darstellung der Farbe im UI benutzt.
 *  - specifications: Das Attribut stellt eine Menge an Farbobjekten dar. Diese Objecte stellen wiederum Untertöne der jeweiligen Farbe dar.
 *  - representative: Das Atrtribut stellt eine Menge an Farbobjekten dar, welche die repräsentative Farbe der Farbfamilie ist.
 *  - tints: Das Atrtribut stellt eine Menge an Farbobjekten dar, welche die Farbabstufungen der repräsentative Farbe darstellen (repräsentative Farbe + Weiß).
 *  - shades: Das Atrtribut stellt eine Menge an Farbobjekten dar, welche die Farbabstufungen der repräsentative Farbe darstellen (repräsentative Farbe + Schwarz).
 *
 *  - identifier: Ist eine Eingrenzung des Farbobjekts in eine Gruppierung. Diese helfen beim Filtern der bspw. additiven Primärfarben (siehe ffr_martianColor).
 *  - colorFamily: Ist die Farbfamilie des Farbobjekts. Dies ist eine generelle Bezeichnung aller beinhalteten Farben. Red, Bordeaux, Ham gehören bspw. der Farbfamilie Red an.
 *  - colorFamily: Ist der Name der Farbfamilie, welcher abhängig von der ausgewählten Sprache des Anwenders ist.
 */

export default {
    "achromaticColors": [
        {
            "name": "Black",
            "nameI18N": "Black",
            "hsv": "hsv(0, 0%, 0%)",
            "rgb": "rgb(0, 0, 0)",
            "hex": "#000000"
        },
        {
            "name": "White",
            "nameI18N": "White",
            "hsv": "hsv(0, 100%, 100%)",
            "rgb": "rgb(255, 0, 0)",
            "hex": "#ffffff"
        },
        {
            "name": "Grey",
            "nameI18N": "Grey",
            "hsv": "hsv(0, 100%, 50%)",
            "rgb": "rgb(128, 0, 0)",
            "hex": "#808080",
            "specifications": [
                {
                    "name": "Dark Grey",
                    "nameI18N": "Dark Gray",
                    "hsv": "hsv(192, 20%, 20%)",
                    "rgb": "rgb(41, 49, 51)",
                    "hex": "#293133"
                },
                {
                    "name": "Light Grey",
                    "nameI18N": "Light Gray",
                    "hsv": "hsv(0, 100%, 65%)",
                    "rgb": "rgb(166, 0, 0)",
                    "hex": "#a6a6a6"
                }
            ]
        }
    ],
    "martianColors": {
        "0": {
            "identifier": "Additive Primary Color",
            "colorFamily": "Red",
            "colorFamilyI18N": "Red",
            "representative": {
                "name": "Red",
                "nameI18N": "Red",
                "hsv": "hsv(0, 100%, 100%)",
                "rgb": "rgb(255, 0, 0)",
                "hex": "#ff0000"
            },
            "shades": [
                {
                    "name": "Dark Red",
                    "nameI18N": "Dark Red",
                    "hsv": "hsv(0, 100%, 63%)",
                    "rgb": "rgb(161, 0, 0)",
                    "hex": "#a10000"
                },
                {
                    "name": "Maroon",
                    "nameI18N": "Maroon",
                    "hsv": "hsv(0, 100%, 40%)",
                    "rgb": "rgb(102, 0, 0)",
                    "hex": "#660000"
                }
            ],
            "tints": [
                {
                    "name": "Pale Raspberry",
                    "nameI18N": "Pale Raspberry",
                    "hsv": "hsv(0, 52%, 100%)",
                    "rgb": "rgb(255, 122, 122)",
                    "hex": "#ff7a7a"
                },
                {
                    "name": "Ham",
                    "nameI18N": "Ham",
                    "hsv": "hsv(0, 30%, 100%)",
                    "rgb": "rgb(255, 179, 179)",
                    "hex": "#ffb3b3"
                }
            ]
        },
        "30": {
            "identifier": "Tertiary Color",
            "colorFamily": "Orange",
            "colorFamilyI18N": "Orange",
            "representative": {
                "name": "Orange",
                "nameI18N": "Orange",
                "hsv": "hsv(30, 100%, 100%)",
                "rgb": "rgb(255, 128, 0)",
                "hex": "#ff8000"
            },
            "shades": [
                {
                    "name": "Brown",
                    "nameI18N": "Brown",
                    "hsv": "hsv(30, 100%, 65%)",
                    "rgb": "rgb(166, 83, 0)",
                    "hex": "#a65300"
                },
                {
                    "name": "Dark Brown",
                    "nameI18N": "Dark Brown",
                    "hsv": "hsv(30, 100%, 37%)",
                    "rgb": "rgb(94, 47, 0)",
                    "hex": "#5e2f00"
                }
            ],
            "tints": [
                {
                    "name": "Peanut Butter",
                    "nameI18N": "Peanut Butter",
                    "hsv": "hsv(30, 60%, 100%)",
                    "rgb": "rgb(255, 179, 102)",
                    "hex": "#ffb366"
                },
                {
                    "name": "Parmesan Cheese",
                    "nameI18N": "Parmesan Cheese",
                    "hsv": "hsv(30, 35%, 100%)",
                    "rgb": "rgb(255, 210, 166)",
                    "hex": "#ffd2a6"
                }
            ]
        },
        "42": {
            "identifier": "Secondary Color",
            "colorFamily": "Turmeric",
            "colorFamilyI18N": "Turmeric",
            "representative":
                {
                    "name": "Yellow Ochre",
                    "nameI18N": "Yellow Ochre",
                    "hsv": "hsv(42, 100%, 85%)",
                    "rgb": "rgb(217, 152, 0)",
                    "hex": "#d99800"
                },
            "shades": [
                {
                    "name": "Tan",
                    "nameI18N": "Tan",
                    "hsv": "hsv(42, 100%, 60%)",
                    "rgb": "rgb(153, 107, 0)",
                    "hex": "#996b00"
                },
                {
                    "name": "Milk Chocolate",
                    "nameI18N": "Milk Chocolate",
                    "hsv": "hsv(42, 100%, 32%)",
                    "rgb": "rgb(82, 57, 0)",
                    "hex": "#523900"
                }
            ],
            "tints": [
                {
                    "name": "Turmeric",
                    "nameI18N": "Turmeric",
                    "hsv": "hsv(42, 100%, 100%)",
                    "rgb": "rgb(255, 179, 0)",
                    "hex": "#ffb300"
                },
                {
                    "name": "Buff",
                    "nameI18N": "Buff",
                    "hsv": "hsv(42, 35%, 100%)",
                    "rgb": "rgb(255, 228, 166)",
                    "hex": "#ffe4a6"
                }
            ]
        },
        "50": {
            "identifier": "Tertiary Color",
            "colorFamily": "Yellow Cheese",
            "colorFamilyI18N": "Yellow Cheese",
            "representative":
                {
                    "name": "Olive Oil",
                    "nameI18N": "Olive Oil",
                    "hsv": "hsv(50, 100%, 80%)",
                    "rgb": "rgb(204, 170, 0)",
                    "hex": "#ccaa00"
                },
            "shades": [
                {
                    "name": "Cane Toad",
                    "nameI18N": "Cane Toad",
                    "hsv": "hsv(50, 100%, 55%)",
                    "rgb": "rgb(140, 117, 0)",
                    "hex": "#8c7500"
                },
                {
                    "name": "Cow Dung",
                    "nameI18N": "Cow Dung",
                    "hsv": "hsv(50, 100%, 28%)",
                    "rgb": "rgb(71, 60, 0)",
                    "hex": "#473c00"
                }
            ],
            "tints": [
                {
                    "name": "Yellow Cheese",
                    "nameI18N": "Yellow Cheese",
                    "hsv": "hsv(50, 100%, 100%)",
                    "rgb": "rgb(255, 213, 0)",
                    "hex": "#ffd500"
                },
                {
                    "name": "Wheat Ear",
                    "nameI18N": "Wheat Ear",
                    "hsv": "hsv(50, 37%, 100%)",
                    "rgb": "rgb(255, 239, 161)",
                    "hex": "#ffefa1"
                }
            ]
        },
        "60": {
            "identifier": "Subtractive Primary Color",
            "colorFamily": "Yellow",
            "colorFamilyI18N": "Yellow",
            "representative":
                {
                    "name": "Yellow",
                    "nameI18N": "Yellow",
                    "hsv": "hsv(60, 100%, 100%)",
                    "rgb": "rgb(255, 255, 0)",
                    "hex": "#ffff00"
                },
            "shades": [
                {
                    "name": "Olive",
                    "nameI18N": "Olive",
                    "hsv": "hsv(60, 100%, 54%)",
                    "rgb": "rgb(138, 138, 0)",
                    "hex": "#8a8a00"
                },
                {
                    "name": "Olive Drab",
                    "nameI18N": "Olive Drab",
                    "hsv": "hsv(60, 100%, 27%)",
                    "rgb": "rgb(69, 69, 0)",
                    "hex": "#454500"
                }
            ],
            "tints": [
                {
                    "name": "Wasabi",
                    "nameI18N": "Wasabi",
                    "hsv": "hsv(60, 100%, 77%)",
                    "rgb": "rgb(196, 196, 0)",
                    "hex": "#c4c400"
                },
                {
                    "name": "Butter",
                    "nameI18N": "Butter",
                    "hsv": "hsv(60, 35%, 100%)",
                    "rgb": "rgb(255, 255, 166)",
                    "hex": "#ffffa6"
                }
            ]
        },
        "65": {
            "identifier": "Tertiary Color",
            "colorFamily": "Green Grape",
            "colorFamilyI18N": "Green Grape",
            "representative": {
                "name": "Green Grape",
                "nameI18N": "Green Grape",
                "hsv": "hsv(65, 100%, 78%)",
                "rgb": "rgb(182, 199, 0)",
                "hex": "#b6c700"
            },
            "shades": [
                {
                    "name": "Light Kelp",
                    "nameI18N": "Light Kelp",
                    "hsv": "hsv(65, 100%, 52%)",
                    "rgb": "rgb(122, 133, 0)",
                    "hex": "#7a8500"
                },
                {
                    "name": "Dark Kelp",
                    "nameI18N": "Dark Kelp",
                    "hsv": "hsv(65, 100%, 26%)",
                    "rgb": "rgb(61, 66, 0)",
                    "hex": "#3d4200"
                }
            ],
            "tints": [
                {
                    "name": "Golden Delicious",
                    "nameI18N": "Golden Delicious",
                    "hsv": "hsv(65, 100%, 100%)",
                    "rgb": "rgb(234, 255, 0)",
                    "hex": "#eaff00"
                },
                {
                    "name": "Champagne",
                    "nameI18N": "Champagne",
                    "hsv": "hsv(65, 35%, 100%)",
                    "rgb": "rgb(248, 255, 166)",
                    "hex": "#f8ffa6"
                }
            ]
        },
        "76": {
            "identifier": "Secondary Color",
            "colorFamily": "Chartreuse",
            "colorFamilyI18N": "Chartreuse",
            "representative": {
                "name": "Celery",
                "nameI18N": "Celery",
                "hsv": "hsv(76, 100%, 80%)",
                "rgb": "rgb(150, 204, 0)",
                "hex": "#96cc00"
            },
            "shades": [
                {
                    "name": "Sage",
                    "nameI18N": "Sage",
                    "hsv": "hsv(76, 100%, 57%)",
                    "rgb": "rgb(107, 145, 0)",
                    "hex": "#6b9100"
                },
                {
                    "name": "Oak Leaf",
                    "nameI18N": "Oak Leaf",
                    "hsv": "hsv(76, 100%, 27%)",
                    "rgb": "rgb(50, 69, 0)",
                    "hex": "#324500"
                }
            ],
            "tints": [
                {
                    "name": "Chartreuse",
                    "nameI18N": "Chartreuse",
                    "hsv": "hsv(76, 100%, 100%)",
                    "rgb": "rgb(187, 255, 0)",
                    "hex": "#bbff00"
                },
                {
                    "name": "Avacado",
                    "nameI18N": "Avacado",
                    "hsv": "hsv(76, 38%, 100%)",
                    "rgb": "rgb(229, 255, 158)",
                    "hex": "#e5ff9e"
                }
            ]
        },
        "87": {
            "identifier": "Tertiary Color",
            "colorFamily": "Green Pea",
            "colorFamilyI18N": "Green Pea",
            "representative": {
                "name": "Basil",
                "nameI18N": "Basil",
                "hsv": "hsv(87, 100%, 77%)",
                "rgb": "rgb(108, 196, 0)",
                "hex": "#6cc400"
            },
            "shades": [
                {
                    "name": "Spinach",
                    "nameI18N": "Spinach",
                    "hsv": "hsv(87, 100%, 60%)",
                    "rgb": "rgb(84, 153, 0)",
                    "hex": "#549900"
                },
                {
                    "name": "Rhubarb Leaf",
                    "nameI18N": "Rhubarb Leaf",
                    "hsv": "hsv(87, 100%, 29%)",
                    "rgb": "rgb(41, 74, 0)",
                    "hex": "#294a00"
                }
            ],
            "tints": [
                {
                    "name": "Green Pea",
                    "nameI18N": "Green Pea",
                    "hsv": "hsv(87, 100%, 100%)",
                    "rgb": "rgb(140, 255, 0)",
                    "hex": "#8cff00"
                },
                {
                    "name": "Green Cabbage",
                    "nameI18N": "Green Cabbage",
                    "hsv": "hsv(87, 38%, 100%)",
                    "rgb": "rgb(211, 255, 158)",
                    "hex": "#d3ff9e"
                }
            ]
        },
        "120": {
            "identifier": "Additive Primary Color",
            "colorFamily": "Green",
            "colorFamilyI18N": "Green",
            "representative": {
                "name": "Green",
                "nameI18N": "Green",
                "hsv": "hsv(120, 100%, 75%)",
                "rgb": "rgb(0, 191, 0)",
                "hex": "#00bf00"
            },
            "shades": [
                {
                    "name": "Green Grass",
                    "nameI18N": "Green Grass",
                    "hsv": "hsv(120, 100%, 60%)",
                    "rgb": "rgb(0, 153, 0)",
                    "hex": "#009900"
                },
                {
                    "name": "Zucchini",
                    "nameI18N": "Zucchini",
                    "hsv": "hsv(120, 100%, 31%)",
                    "rgb": "rgb(0, 79, 0)",
                    "hex": "#004f00"
                }
            ],
            "tints": [
                {
                    "name": "Granny Smith",
                    "nameI18N": "Granny Smith",
                    "hsv": "hsv(120, 100%, 100%)",
                    "rgb": "rgb(0, 255, 0)",
                    "hex": "#00ff00"
                },
                {
                    "name": "Green Hellebore",
                    "nameI18N": "Green Hellebore",
                    "hsv": "hsv(120, 36%, 100%)",
                    "rgb": "rgb(163, 255, 163)",
                    "hex": "#a3ffa3"
                }
            ]
        },
        "147": {
            "identifier": "Tertiary Color",
            "colorFamily": "Clover",
            "colorFamilyI18N": "Clover",
            "representative": {
                "name": "Clover",
                "nameI18N": "Clover",
                "hsv": "hsv(147, 100%, 71%)",
                "rgb": "rgb(0, 181, 81)",
                "hex": "#00b551"
            },
            "shades": [
                {
                    "name": "Shaded Fern",
                    "nameI18N": "Shaded Fern",
                    "hsv": "hsv(147, 100%, 60%)",
                    "rgb": "rgb(0, 153, 69)",
                    "hex": "#009945"
                },
                {
                    "name": "Cucumber",
                    "nameI18N": "Cucumber",
                    "hsv": "hsv(147, 100%, 31%)",
                    "rgb": "rgb(0, 79, 36)",
                    "hex": "#004f24"
                }
            ],
            "tints": [
                {
                    "name": "Chayote",
                    "nameI18N": "Chayote",
                    "hsv": "hsv(147, 100%, 100%)",
                    "rgb": "rgb(0, 255, 115)",
                    "hex": "#00ff73"
                },
                {
                    "name": "Celadon",
                    "nameI18N": "Celadon",
                    "hsv": "hsv(147, 34%, 100%)",
                    "rgb": "rgb(168, 255, 207)",
                    "hex": "#a8ffcf"
                }
            ]
        },
        "160": {
            "identifier": "Secondary Color",
            "colorFamily": "Emerald",
            "colorFamilyI18N": "Emerald",
            "representative": {
                "name": "Light Emerald",
                "nameI18N": "Light Emerald",
                "hsv": "hsv(160, 100%, 70%)",
                "rgb": "rgb(0, 179, 119)",
                "hex": "#00b377"
            },
            "shades": [
                {
                    "name": "Emerald",
                    "nameI18N": "Emerald",
                    "hsv": "hsv(160, 100%, 58%)",
                    "rgb": "rgb(0, 148, 99)",
                    "hex": "#009463"
                },
                {
                    "name": "Brunswick Green",
                    "nameI18N": "Brunswick Green",
                    "hsv": "hsv(160, 100%, 30%)",
                    "rgb": "rgb(0, 77, 51)",
                    "hex": "#004d33"
                }
            ],
            "tints": [
                {
                    "name": "Chrysolite",
                    "nameI18N": "Chrysolite",
                    "hsv": "hsv(160, 100%, 100%)",
                    "rgb": "rgb(0, 255, 170)",
                    "hex": "#00ffaa"
                },
                {
                    "name": "Variscite",
                    "nameI18N": "Variscite",
                    "hsv": "hsv(160, 33%, 100%)",
                    "rgb": "rgb(171, 255, 227)",
                    "hex": "#abffe3"
                }
            ]
        },
        "172": {
            "identifier": "Tertiary Color",
            "colorFamily": "Malachite",
            "colorFamilyI18N": "Malachite",
            "representative": {
                "name": "Shallow Sea Green",
                "nameI18N": "Shallow Sea Green",
                "hsv": "hsv(172, 100%, 72%)",
                "rgb": "rgb(0, 184, 159)",
                "hex": "#00b89f"
            },
            "shades": [
                {
                    "name": "Broccoli",
                    "nameI18N": "Broccoli",
                    "hsv": "hsv(172, 100%, 57%)",
                    "rgb": "rgb(0, 145, 126)",
                    "hex": "#00917e"
                },
                {
                    "name": "Malachite",
                    "nameI18N": "Malachite",
                    "hsv": "hsv(172, 100%, 30%)",
                    "rgb": "rgb(0, 77, 66)",
                    "hex": "#004d42"
                }
            ],
            "tints": [
                {
                    "name": "Verdigris",
                    "nameI18N": "Verdigris",
                    "hsv": "hsv(172, 100%, 100%)",
                    "rgb": "rgb(0, 255, 221)",
                    "hex": "#00ffdd"
                },
                {
                    "name": "Blue Agave",
                    "nameI18N": "Blue Agave",
                    "hsv": "hsv(172, 36%, 100%)",
                    "rgb": "rgb(163, 255, 243)",
                    "hex": "#a3fff3"
                }
            ]
        },
        "180": {
            "identifier": "Subtractive Primary Color",
            "colorFamily": "Cyan",
            "colorFamilyI18N": "Cyan",
            "representative": {
                "name": "Dark Cyan",
                "nameI18N": "Dark Cyan",
                "hsv": "hsv(180, 100%, 70%)",
                "rgb": "rgb(0, 179, 179)",
                "hex": "#00b3b3"
            },
            "shades": [
                {
                    "name": "Blue Spruce Dark",
                    "nameI18N": "Blue Spruce Dark",
                    "hsv": "hsv(180, 100%, 55%)",
                    "rgb": "rgb(0, 140, 140)",
                    "hex": "#008c8c"
                },
                {
                    "name": "Pthalo Green",
                    "nameI18N": "Pthalo Green",
                    "hsv": "hsv(180, 100%, 29%)",
                    "rgb": "rgb(0, 74, 74)",
                    "hex": "#004a4a"
                }
            ],
            "tints": [
                {
                    "name": "Cyan",
                    "nameI18N": "Cyan",
                    "hsv": "hsv(180, 100%, 100%)",
                    "rgb": "rgb(0, 255, 255)",
                    "hex": "#00ffff"
                },
                {
                    "name": "Blue Spruce Light",
                    "nameI18N": "Blue Spruce Light",
                    "hsv": "hsv(180, 35%, 100%)",
                    "rgb": "rgb(166, 255, 255)",
                    "hex": "#a6ffff"
                }
            ]
        },
        "190": {
            "identifier": "Tertiary Color",
            "colorFamily": "Turquoise",
            "colorFamilyI18N": "Turquoise",
            "representative": {
                "name": "Blue Topaz",
                "nameI18N": "Blue Topaz",
                "hsv": "hsv(190, 100%, 72%)",
                "rgb": "rgb(0, 153, 184)",
                "hex": "#0099b8"
            },
            "shades": [
                {
                    "name": "Sea Green",
                    "nameI18N": "Sea Green",
                    "hsv": "hsv(190, 100%, 60%)",
                    "rgb": "rgb(0, 127, 153)",
                    "hex": "#007f99"
                },
                {
                    "name": "Dark Sea Green",
                    "nameI18N": "Dark Sea Green",
                    "hsv": "hsv(190, 100%, 31%)",
                    "rgb": "rgb(0, 66, 79)",
                    "hex": "#00424f"
                }
            ],
            "tints": [
                {
                    "name": "Turquoise",
                    "nameI18N": "Turquoise",
                    "hsv": "hsv(190, 100%, 100%)",
                    "rgb": "rgb(0, 212, 255)",
                    "hex": "#00d4ff"
                },
                {
                    "name": "Uranus",
                    "nameI18N": "Uranus",
                    "hsv": "hsv(190, 40%, 100%)",
                    "rgb": "rgb(153, 238, 255)",
                    "hex": "#99eeff"
                }
            ]
        },
        "200": {
            "identifier": "Secondary Color",
            "colorFamily": "Azure",
            "colorFamilyI18N": "Azure",
            "representative": {
                "name": "Dark Azure",
                "nameI18N": "Dark Azure",
                "hsv": "hsv(200, 100%, 70%)",
                "rgb": "rgb(0, 119, 179)",
                "hex": "#0077b3"
            },
            "shades": [
                {
                    "name": "Cobalt Blue",
                    "nameI18N": "Cobalt Blue",
                    "hsv": "hsv(200, 100%, 53%)",
                    "rgb": "rgb(0, 90, 135)",
                    "hex": "#005a87"
                },
                {
                    "name": "Prussian Blue",
                    "nameI18N": "Prussian Blue",
                    "hsv": "hsv(200, 100%, 34%)",
                    "rgb": "rgb(0, 58, 87)",
                    "hex": "#003a57"
                }
            ],
            "tints": [
                {
                    "name": "Light Azure",
                    "nameI18N": "Light Azure",
                    "hsv": "hsv(200, 100%, 100%)",
                    "rgb": "rgb(0, 170, 255)",
                    "hex": "#00aaff"
                },
                {
                    "name": "Powder Blue",
                    "nameI18N": "Powder Blue",
                    "hsv": "hsv(200, 43%, 100%)",
                    "rgb": "rgb(145, 218, 255)",
                    "hex": "#91daff"
                }
            ]
        },
        "214": {
            "identifier": "Tertiary Color",
            "colorFamily": "Royal Blue",
            "colorFamilyI18N": "Royal Blue",
            "representative": {
                "name": "Delphinium Blue",
                "nameI18N": "Delphinium Blue",
                "hsv": "hsv(214, 100%, 100%)",
                "rgb": "rgb(0, 111, 255)",
                "hex": "#006fff"
            },
            "shades": [
                {
                    "name": "Royal Blue",
                    "nameI18N": "Royal Blue",
                    "hsv": "hsv(214, 100%, 60%)",
                    "rgb": "rgb(0, 66, 153)",
                    "hex": "#004299"
                },
                {
                    "name": "Dark Royal Blue",
                    "nameI18N": "Dark Royal Blue",
                    "hsv": "hsv(214, 100%, 40%)",
                    "rgb": "rgb(0, 44, 102)",
                    "hex": "#002c66"
                }
            ],
            "tints": [
                {
                    "name": "Sky Blue",
                    "nameI18N": "Sky Blue",
                    "hsv": "hsv(214, 55%, 100%)",
                    "rgb": "rgb(115, 176, 255)",
                    "hex": "#73b0ff"
                },
                {
                    "name": "Pale Sky Blue",
                    "nameI18N": "Pale Sky Blue",
                    "hsv": "hsv(214, 39%, 100%)",
                    "rgb": "rgb(156, 199, 255)",
                    "hex": "#9cc7ff"
                }
            ]
        },
        "240": {
            "identifier": "Additive Primary Color",
            "colorFamily": "Blue",
            "colorFamilyI18N": "Blue",
            "representative": {
                "name": "Light Blue",
                "nameI18N": "Light Blue",
                "hsv": "hsv(240, 70%, 100%)",
                "rgb": "rgb(77, 77, 255)",
                "hex": "#4d4dff"
            },
            "shades": [
                {
                    "name": "Blue",
                    "nameI18N": "Blue",
                    "hsv": "hsv(240, 100%, 100%)",
                    "rgb": "rgb(0, 0, 255)",
                    "hex": "#0000ff"
                },
                {
                    "name": "Dark Blue",
                    "nameI18N": "Dark Blue",
                    "hsv": "hsv(240, 100%, 48%)",
                    "rgb": "rgb(0, 0, 122)",
                    "hex": "#00007a"
                }
            ],
            "tints": [
                {
                    "name": "Cornflower",
                    "nameI18N": "Cornflower",
                    "hsv": "hsv(240, 48%, 100%)",
                    "rgb": "rgb(133, 133, 255)",
                    "hex": "#8585ff"
                },
                {
                    "name": "Forget-Me-Not",
                    "nameI18N": "Forget-Me-Not",
                    "hsv": "hsv(240, 33%, 100%)",
                    "rgb": "rgb(171, 171, 255)",
                    "hex": "#ababff"
                }
            ]
        },
        "267": {
            "identifier": "Tertiary Color",
            "colorFamily": "Dioxazine",
            "colorFamilyI18N": "Dioxazine",
            "representative": {
                "name": "Dark Lavender",
                "nameI18N": "Dark Lavender",
                "hsv": "hsv(267, 100%, 100%)",
                "rgb": "rgb(115, 0, 255)",
                "hex": "#7300ff"
            },
            "shades": [
                {
                    "name": "Han Purple",
                    "nameI18N": "Han Purple",
                    "hsv": "hsv(267, 100%, 70%)",
                    "rgb": "rgb(80, 0, 179)",
                    "hex": "#5000b3"
                },
                {
                    "name": "Dioxazine",
                    "nameI18N": "Dioxazine",
                    "hsv": "hsv(267, 100%, 50%)",
                    "rgb": "rgb(57, 0, 128)",
                    "hex": "#390080"
                }
            ],
            "tints": [
                {
                    "name": "Lavender",
                    "nameI18N": "Lavender",
                    "hsv": "hsv(267, 50%, 100%)",
                    "rgb": "rgb(185, 128, 255)",
                    "hex": "#b980ff"
                },
                {
                    "name": "Rose de France",
                    "nameI18N": "Rose de France",
                    "hsv": "hsv(267, 25%, 100%)",
                    "rgb": "rgb(220, 191, 255)",
                    "hex": "#dcbfff"
                }
            ]
        },
        "280": {
            "identifier": "Secondary Color",
            "colorFamily": "Violet",
            "colorFamilyI18N": "Violet",
            "representative": {
                "name": "Violet",
                "nameI18N": "Violet",
                "hsv": "hsv(280, 100%, 100%)",
                "rgb": "rgb(170, 0, 255)",
                "hex": "#aa00ff"
            },
            "shades": [
                {
                    "name": "Dark Violet",
                    "nameI18N": "Dark Violet",
                    "hsv": "hsv(280, 100%, 70%)",
                    "rgb": "rgb(119, 0, 179)",
                    "hex": "#7700b3"
                },
                {
                    "name": "Spectral Violet",
                    "nameI18N": "Spectral Violet",
                    "hsv": "hsv(280, 100%, 45%)",
                    "rgb": "rgb(77, 0, 115)",
                    "hex": "#4d0073"
                }
            ],
            "tints": [
                {
                    "name": "Kunzite",
                    "nameI18N": "Kunzite",
                    "hsv": "hsv(280, 50%, 100%)",
                    "rgb": "rgb(213, 128, 255)",
                    "hex": "#d580ff"
                },
                {
                    "name": "Mauve",
                    "nameI18N": "Mauve",
                    "hsv": "hsv(280, 25%, 100%)",
                    "rgb": "rgb(234, 191, 255)",
                    "hex": "#eabfff"
                }
            ]
        },
        "290": {
            "identifier": "Tertiary Color",
            "colorFamily": "Aniline",
            "colorFamilyI18N": "Aniline",
            "representative": {
                "name": "Purple Daisy",
                "nameI18N": "Purple Daisy",
                "hsv": "hsv(290, 100%, 100%)",
                "rgb": "rgb(213, 0, 255)",
                "hex": "#d500ff"
            },
            "shades": [
                {
                    "name": "Aniline",
                    "nameI18N": "Aniline",
                    "hsv": "hsv(290, 100%, 70%)",
                    "rgb": "rgb(149, 0, 179)",
                    "hex": "#9500b3"
                },
                {
                    "name": "Amethyst",
                    "nameI18N": "Amethyst",
                    "hsv": "hsv(290, 100%, 42%)",
                    "rgb": "rgb(89, 0, 107)",
                    "hex": "#59006b"
                }
            ],
            "tints": [
                {
                    "name": "Rose Of Sharon",
                    "nameI18N": "Rose Of Sharon",
                    "hsv": "hsv(290, 45%, 100%)",
                    "rgb": "rgb(236, 140, 255)",
                    "hex": "#ec8cff"
                },
                {
                    "name": "Lilac",
                    "nameI18N": "Lilac",
                    "hsv": "hsv(290, 25%, 100%)",
                    "rgb": "rgb(244, 191, 255)",
                    "hex": "#f4bfff"
                }
            ]
        },
        "300": {
            "identifier": "Subtractive Primary Color",
            "colorFamily": "Magenta",
            "colorFamilyI18N": "Magenta",
            "representative": {
                "name": "Dark Magenta",
                "nameI18N": "Dark Magenta",
                "hsv": "hsv(300, 100%, 100%)",
                "rgb": "rgb(255, 0, 255)",
                "hex": "#ff00ff"
            },
            "shades": [
                {
                    "name": "Light Purple",
                    "nameI18N": "Light Purple",
                    "hsv": "hsv(300, 100%, 40%)",
                    "rgb": "rgb(102, 0, 102)",
                    "hex": "#660066"
                },
                {
                    "name": "Purple",
                    "nameI18N": "Purple",
                    "hsv": "hsv(300, 100%, 65%)",
                    "rgb": "rgb(166, 0, 166)",
                    "hex": "#a600a6"
                }
            ],
            "tints": [
                {
                    "name": "Magenta",
                    "nameI18N": "Magenta",
                    "hsv": "hsv(300, 40%, 100%)",
                    "rgb": "rgb(255, 153, 255)",
                    "hex": "#ff99ff"
                },
                {
                    "name": "Musk",
                    "nameI18N": "Musk",
                    "hsv": "hsv(300, 25%, 100%)",
                    "rgb": "rgb(255, 191, 255)",
                    "hex": "#ffbfff"
                }
            ]
        },
        "310": {
            "identifier": "Tertiary Color",
            "colorFamily": "Bougainvillea",
            "colorFamilyI18N": "Bougainvillea",
            "representative": {
                "name": "Shocking Pink",
                "nameI18N": "Shocking Pink",
                "hsv": "hsv(310, 100%, 100%)",
                "rgb": "rgb(255, 0, 212)",
                "hex": "#ff00d4"
            },
            "shades": [
                {
                    "name": "Purple Bougainvillea",
                    "nameI18N": "Purple Bougainvillea",
                    "hsv": "hsv(310, 100%, 70%)",
                    "rgb": "rgb(179, 0, 149)",
                    "hex": "#b30095"
                },
                {
                    "name": "Purple Bean",
                    "nameI18N": "Purple Bean",
                    "hsv": "hsv(310, 100%, 42%)",
                    "rgb": "rgb(107, 0, 89)",
                    "hex": "#6b0059"
                }
            ],
            "tints": [
                {
                    "name": "Purple Loosestrife",
                    "nameI18N": "Purple Loosestrife",
                    "hsv": "hsv(310, 45%, 100%)",
                    "rgb": "rgb(255, 140, 236)",
                    "hex": "#ff8cec"
                },
                {
                    "name": "Dog Rose",
                    "nameI18N": "Dog Rose",
                    "hsv": "hsv(310, 25%, 100%)",
                    "rgb": "rgb(255, 191, 244)",
                    "hex": "#ffbff4"
                }
            ]
        },
        "320": {
            "identifier": "Secondary Color",
            "colorFamily": "Pink",
            "colorFamilyI18N": "Pink",
            "representative": {
                "name": "Dark Pink",
                "nameI18N": "Dark Pink",
                "hsv": "hsv(320, 100%, 100%)",
                "rgb": "rgb(255, 0, 170)",
                "hex": "#ff00aa"
            },
            "shades": [
                {
                    "name": "Prickly Pear",
                    "nameI18N": "Prickly Pear",
                    "hsv": "hsv(320, 100%, 70%)",
                    "rgb": "rgb(179, 0, 119)",
                    "hex": "#b30077"
                },
                {
                    "name": "Elderberry",
                    "nameI18N": "Elderberry",
                    "hsv": "hsv(320, 100%, 44%)",
                    "rgb": "rgb(112, 0, 75)",
                    "hex": "#70004b"
                }
            ],
            "tints": [
                {
                    "name": "Pink",
                    "nameI18N": "Pink",
                    "hsv": "hsv(320, 50%, 100%)",
                    "rgb": "rgb(255, 128, 213)",
                    "hex": "#ff80d5"
                },
                {
                    "name": "Light Pink",
                    "nameI18N": "Light Pink",
                    "hsv": "hsv(320, 25%, 100%)",
                    "rgb": "rgb(255, 191, 234)",
                    "hex": "#ffbfea"
                }
            ]
        },
        "333": {
            "identifier": "Tertiary Color",
            "colorFamily": "Red Plum",
            "colorFamilyI18N": "Red Plum",
            "representative": {
                "name": "Dragon Fruit",
                "nameI18N": "Dragon Fruit",
                "hsv": "hsv(333, 100%, 100%)",
                "rgb": "rgb(255, 0, 115)",
                "hex": "#ff0073"
            },
            "shades": [
                {
                    "name": "Chinese Straw-Berry",
                    "nameI18N": "Chinese Straw-Berry",
                    "hsv": "hsv(333, 100%, 70%)",
                    "rgb": "rgb(179, 0, 80)",
                    "hex": "#b30050"
                },
                {
                    "name": "Red Plum",
                    "nameI18N": "Red Plum",
                    "hsv": "hsv(333, 100%, 45%)",
                    "rgb": "rgb(115, 0, 52)",
                    "hex": "#730034"
                }
            ],
            "tints": [
                {
                    "name": "Pink Hydrangea",
                    "nameI18N": "Pink Hydrangea",
                    "hsv": "hsv(333, 50%, 100%)",
                    "rgb": "rgb(255, 128, 185)",
                    "hex": "#ff80b9"
                },
                {
                    "name": "Baby Pink",
                    "nameI18N": "Baby Pink",
                    "hsv": "hsv(333, 24%, 100%)",
                    "rgb": "rgb(255, 194, 221)",
                    "hex": "#ffc2dd"
                }
            ]
        }
    }
}
