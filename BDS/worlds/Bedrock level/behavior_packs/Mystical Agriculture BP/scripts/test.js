const pot = {
    "format_version": "1.20.50",
    "minecraft:block": {
        "description": {
            "identifier": "strat:mystical_growth_pot",
            "states": {
                "crop_category": [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9
                ],
                "crop_type": [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10,
                    11,
                    12,
                    13,
                    14,
                    15
                ],
                "strat:growth_stage": [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7
                ],
                "strat:automatic": [
                    false,
                    true
                ]
            },
            "menu_category": {
                "category": "items"
            }
        },
        "components": {
            "minecraft:light_dampening": 0,
            "minecraft:destructible_by_mining": {
                "seconds_to_destroy": 0.6
            },
            "minecraft:material_instances": {
                "*": {
                    "texture": "hardened_clay",
                    "render_method": "alpha_test"
                },
                "soil": {
                    "texture": "farmland",
                    "render_method": "alpha_test"
                },
                "hopper": {
                    "texture": "hopper_inside",
                    "render_method": "alpha_test"
                }
            },
            "minecraft:geometry": {
                "identifier": "geometry.strat_growth_pot",
                "bone_visibility": {
                    "crop": "query.block_state('crop_type') > 0",
                    "hopper_indicator": "query.block_state('strat:automatic') == true"
                }
            },
            "minecraft:collision_box": {
                "origin": [
                    -7,
                    0,
                    -7
                ],
                "size": [
                    14,
                    8,
                    14
                ]
            },
            "minecraft:selection_box": {
                "origin": [
                    -7,
                    0,
                    -7
                ],
                "size": [
                    14,
                    8,
                    14
                ]
            },
            "minecraft:custom_components": [
                "strat:growth_pot"
            ]
        },
        "permutations": [
            {
                "condition": "query.block_state('crop_type') == 0",
                "components": {}
            },
            {
                "condition": "query.block_state('crop_type') > 0",
                "components": {
                    "minecraft:custom_components": [
                        "strat:growth_pot_tick"
                    ]
                }
            },
            {
                "condition": "query.block_state('crop_category') < 5 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') == 0",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_resource_crop_0",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') < 5 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') == 1",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_resource_crop_1",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') < 5 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') == 2",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_resource_crop_2",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') < 5 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') == 3",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_resource_crop_3",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') < 5 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') == 4",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_resource_crop_4",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') < 5 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') == 5",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_resource_crop_5",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') < 5 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') > 5",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_resource_crop_6",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') > 4 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') == 0",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_mob_crop_0",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') > 4 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') == 1",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_mob_crop_1",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') > 4 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') == 2",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_mob_crop_2",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') > 4 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') == 3",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_mob_crop_3",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') > 4 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') == 4",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_mob_crop_4",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') > 4 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') == 5",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_mob_crop_5",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('crop_category') > 4 && query.block_state('crop_type') > 0 && query.block_state('strat:growth_stage') > 5",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_mob_crop_6",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:growth_stage') == 7 && query.block_state('strat:automatic') == false",
                "components": {
                    "minecraft:tick": {
                        "interval_range": [
                            20,
                            20
                        ],
                        "looping": true
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 1 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_air_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 2 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_earth_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 3 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_fire_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 4 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_water_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 5 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_inferium_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 6 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_wood_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 7 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_dirt_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 8 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_stone_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 9 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_deepslate_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 10 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_ice_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 11 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_marble_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 12 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_flarestone_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 0 && query.block_state('strat:crop_type') == 13 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_limestone_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 1 && query.block_state('strat:crop_type') == 1 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_coal_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 1 && query.block_state('strat:crop_type') == 2 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_amethyst_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 1 && query.block_state('strat:crop_type') == 3 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_nature_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 1 && query.block_state('strat:crop_type') == 4 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_nether_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 1 && query.block_state('strat:crop_type') == 5 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_honey_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 2 && query.block_state('strat:crop_type') == 1 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_iron_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 2 && query.block_state('strat:crop_type') == 2 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_copper_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 2 && query.block_state('strat:crop_type') == 3 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_redstone_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 2 && query.block_state('strat:crop_type') == 4 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_obsidian_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 2 && query.block_state('strat:crop_type') == 5 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_nether_quartz_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 2 && query.block_state('strat:crop_type') == 6 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_glowstone_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 2 && query.block_state('strat:crop_type') == 7 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_prismarine_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 2 && query.block_state('strat:crop_type') == 8 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_pig_iron_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 2 && query.block_state('strat:crop_type') == 9 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_tin_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 2 && query.block_state('strat:crop_type') == 10 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_bronze_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 2 && query.block_state('strat:crop_type') == 11 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_aluminium_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 1 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_gold_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 2 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_lapis_lazuli_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 3 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_electrum_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 4 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_lead_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 5 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_steel_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 6 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_silver_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 7 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_ruby_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 8 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_cobalt_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 9 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_ardite_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 10 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_end_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 11 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_alumite_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 12 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_soulium_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 13 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_rose_gold_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 14 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_titanium_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 3 && query.block_state('strat:crop_type') == 15 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_sapphire_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 4 && query.block_state('strat:crop_type') == 1 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_diamond_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 4 && query.block_state('strat:crop_type') == 2 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_emerald_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 4 && query.block_state('strat:crop_type') == 3 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_netherite_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 4 && query.block_state('strat:crop_type') == 4 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_manyullyn_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 4 && query.block_state('strat:crop_type') == 5 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_enderium_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 4 && query.block_state('strat:crop_type') == 6 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_platinum_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 4 && query.block_state('strat:crop_type') == 7 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_enderite_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 5 && query.block_state('strat:crop_type') == 1 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_cow_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 5 && query.block_state('strat:crop_type') == 2 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_pig_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 5 && query.block_state('strat:crop_type') == 3 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_chicken_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 5 && query.block_state('strat:crop_type') == 4 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_sheep_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 5 && query.block_state('strat:crop_type') == 5 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_fish_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 5 && query.block_state('strat:crop_type') == 6 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_squid_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 5 && query.block_state('strat:crop_type') == 7 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_turtle_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 5 && query.block_state('strat:crop_type') == 8 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_slime_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 6 && query.block_state('strat:crop_type') == 1 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_creeper_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 6 && query.block_state('strat:crop_type') == 2 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_zombie_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 6 && query.block_state('strat:crop_type') == 3 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_skeleton_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 6 && query.block_state('strat:crop_type') == 4 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_spider_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 6 && query.block_state('strat:crop_type') == 5 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_rabbit_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 7 && query.block_state('strat:crop_type') == 1 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_blaze_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 7 && query.block_state('strat:crop_type') == 2 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_enderman_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 7 && query.block_state('strat:crop_type') == 3 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_ghast_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            },
            {
                "condition": "query.block_state('strat:crop_category') == 8 && query.block_state('strat:crop_type') == 1 && query.block_state('strat:growth_stage') == 7",
                "components": {
                    "minecraft:material_instances": {
                        "*": {
                            "texture": "hardened_clay",
                            "render_method": "alpha_test"
                        },
                        "soil": {
                            "texture": "farmland",
                            "render_method": "alpha_test"
                        },
                        "hopper": {
                            "texture": "hopper_inside",
                            "render_method": "alpha_test"
                        },
                        "crop": {
                            "texture": "mystical_wither_skeleton_crop_7",
                            "render_method": "alpha_test"
                        }
                    }
                }
            }
        ]
    }
}
const crops = [
    {
        "type": 'strat:air_seeds',
        "crop_category": 0,
        "crop_type": 1
    },
    {
        "type": 'strat:earth_seeds',
        "crop_category": 0,
        "crop_type": 2
    },
    {
        "type": 'strat:fire_seeds',
        "crop_category": 0,
        "crop_type": 3
    },
    {
        "type": 'strat:water_seeds',
        "crop_category": 0,
        "crop_type": 4
    },
    {
        "type": 'strat:inferium_seeds',
        "crop_category": 0,
        "crop_type": 5
    },
    {
        "type": 'strat:wood_seeds',
        "crop_category": 0,
        "crop_type": 6
    },
    {
        "type": 'strat:dirt_seeds',
        "crop_category": 0,
        "crop_type": 7
    },
    {
        "type": 'strat:stone_seeds',
        "crop_category": 0,
        "crop_type": 8
    },
    {
        "type": 'strat:deepslate_seeds',
        "crop_category": 0,
        "crop_type": 9
    },
    {
        "type": 'strat:ice_seeds',
        "crop_category": 0,
        "crop_type": 10
    },
    {
        "type": 'strat:marble_seeds',
        "crop_category": 0,
        "crop_type": 11
    },
    {
        "type": 'strat:flarestone_seeds',
        "crop_category": 0,
        "crop_type": 12
    },
    {
        "type": 'strat:limestone_seeds',
        "crop_category": 0,
        "crop_type": 13
    }, {
        "type": 'strat:coal_seeds',
        "crop_category": 1,
        "crop_type": 1
    },
    {
        "type": 'strat:amethyst_seeds',
        "crop_category": 1,
        "crop_type": 2
    },
    {
        "type": 'strat:nature_seeds',
        "crop_category": 1,
        "crop_type": 3
    },
    {
        "type": 'strat:nether_seeds',
        "crop_category": 1,
        "crop_type": 4
    },
    {
        "type": 'strat:honey_seeds',
        "crop_category": 1,
        "crop_type": 5
    }, {
        "type": 'strat:iron_seeds',
        "crop_category": 2,
        "crop_type": 1
    },
    {
        "type": 'strat:copper_seeds',
        "crop_category": 2,
        "crop_type": 2
    },
    {
        "type": 'strat:redstone_seeds',
        "crop_category": 2,
        "crop_type": 3
    },
    {
        "type": 'strat:obsidian_seeds',
        "crop_category": 2,
        "crop_type": 4
    },
    {
        "type": 'strat:nether_quartz_seeds',
        "crop_category": 2,
        "crop_type": 5
    },
    {
        "type": 'strat:glowstone_seeds',
        "crop_category": 2,
        "crop_type": 6
    },
    {
        "type": 'strat:prismarine_seeds',
        "crop_category": 2,
        "crop_type": 7
    },
    {
        "type": 'strat:pig_iron_seeds',
        "crop_category": 2,
        "crop_type": 8
    },
    {
        "type": 'strat:tin_seeds',
        "crop_category": 2,
        "crop_type": 9
    },
    {
        "type": 'strat:bronze_seeds',
        "crop_category": 2,
        "crop_type": 10
    },
    {
        "type": 'strat:aluminium_seeds',
        "crop_category": 2,
        "crop_type": 11
    }, {
        "type": 'strat:gold_seeds',
        "crop_category": 3,
        "crop_type": 1
    },
    {
        "type": 'strat:lapis_lazuli_seeds',
        "crop_category": 3,
        "crop_type": 2
    },
    {
        "type": 'strat:electrum_seeds',
        "crop_category": 3,
        "crop_type": 3
    },
    {
        "type": 'strat:lead_seeds',
        "crop_category": 3,
        "crop_type": 4
    },
    {
        "type": 'strat:steel_seeds',
        "crop_category": 3,
        "crop_type": 5
    },
    {
        "type": 'strat:silver_seeds',
        "crop_category": 3,
        "crop_type": 6
    },
    {
        "type": 'strat:ruby_seeds',
        "crop_category": 3,
        "crop_type": 7
    },
    {
        "type": 'strat:cobalt_seeds',
        "crop_category": 3,
        "crop_type": 8
    },
    {
        "type": 'strat:ardite_seeds',
        "crop_category": 3,
        "crop_type": 9
    },
    {
        "type": 'strat:end_seeds',
        "crop_category": 3,
        "crop_type": 10
    },
    {
        "type": 'strat:alumite_seeds',
        "crop_category": 3,
        "crop_type": 11
    },
    {
        "type": 'strat:soulium_seeds',
        "crop_category": 3,
        "crop_type": 12
    },
    {
        "type": 'strat:rose_gold_seeds',
        "crop_category": 3,
        "crop_type": 13
    },
    {
        "type": 'strat:titanium_seeds',
        "crop_category": 3,
        "crop_type": 14
    },
    {
        "type": 'strat:sapphire_seeds',
        "crop_category": 3,
        "crop_type": 15
    }, {
        "type": 'strat:diamond_seeds',
        "crop_category": 4,
        "crop_type": 1
    },
    {
        "type": 'strat:emerald_seeds',
        "crop_category": 4,
        "crop_type": 2
    },
    {
        "type": 'strat:netherite_seeds',
        "crop_category": 4,
        "crop_type": 3
    },
    {
        "type": 'strat:manyullyn_seeds',
        "crop_category": 4,
        "crop_type": 4
    },
    {
        "type": 'strat:enderium_seeds',
        "crop_category": 4,
        "crop_type": 5
    },
    {
        "type": 'strat:platinum_seeds',
        "crop_category": 4,
        "crop_type": 6
    },
    {
        "type": 'strat:enderite_seeds',
        "crop_category": 4,
        "crop_type": 7
    }, {
        "type": 'strat:cow_seeds',
        "crop_category": 5,
        "crop_type": 1
    },
    {
        "type": 'strat:pig_seeds',
        "crop_category": 5,
        "crop_type": 2
    },
    {
        "type": 'strat:chicken_seeds',
        "crop_category": 5,
        "crop_type": 3
    },
    {
        "type": 'strat:sheep_seeds',
        "crop_category": 5,
        "crop_type": 4
    },
    {
        "type": 'strat:fish_seeds',
        "crop_category": 5,
        "crop_type": 5
    },
    {
        "type": 'strat:squid_seeds',
        "crop_category": 5,
        "crop_type": 6
    },
    {
        "type": 'strat:turtle_seeds',
        "crop_category": 5,
        "crop_type": 7
    },
    {
        "type": 'strat:slime_seeds',
        "crop_category": 5,
        "crop_type": 8
    }, {
        "type": 'strat:creeper_seeds',
        "crop_category": 6,
        "crop_type": 1
    },
    {
        "type": 'strat:zombie_seeds',
        "crop_category": 6,
        "crop_type": 2
    },
    {
        "type": 'strat:skeleton_seeds',
        "crop_category": 6,
        "crop_type": 3
    },
    {
        "type": 'strat:spider_seeds',
        "crop_category": 6,
        "crop_type": 4
    },
    {
        "type": 'strat:rabbit_seeds',
        "crop_category": 6,
        "crop_type": 5
    }, {
        "type": 'strat:blaze_seeds',
        "crop_category": 7,
        "crop_type": 1
    },
    {
        "type": 'strat:enderman_seeds',
        "crop_category": 7,
        "crop_type": 2
    },
    {
        "type": 'strat:ghast_seeds',
        "crop_category": 7,
        "crop_type": 3
    }, {
        "type": 'strat:wither_skeleton_seeds',
        "crop_category": 8,
        "crop_type": 1
    }
]

const fs = require('fs')

const mycrops = {};

crops.forEach((crop)=> {
    pot["minecraft:block"].permutations.push({
        "condition": `query.block_state('strat:crop_category') == ${crop.crop_category} && query.block_state('strat:crop_type') == ${crop.crop_type} && query.block_state('strat:growth_stage') == 7`,
        "components": {
            "minecraft:material_instances": {
                "*": {
                    "texture": "hardened_clay",
                    "render_method": "alpha_test"
                },
                "soil": {
                    "texture": "farmland",
                    "render_method": "alpha_test"
                },
                "hopper": {
                    "texture": "hopper_inside",
                    "render_method": "alpha_test"
                },
                "crop": {
                    "texture": `mystical_${crop.type.split(":")[1].replace("seeds", "crop")}_7`,
                    "render_method": "alpha_test"
                }
            }
        }
    },)

    mycrops[crop.type] = {
        crop_category: crop.crop_category,
        crop_type: crop.crop_type
    }
});

console.log(mycrops);
fs.writeFileSync("test.json", JSON.stringify(pot, null, 4));

[
    [
      null,
      'strat:air_seeds',
      'strat:earth_seeds',        
      'strat:fire_seeds',
      'strat:water_seeds',        
      'strat:inferium_seeds',     
      'strat:wood_seeds',
      'strat:dirt_seeds',
      'strat:stone_seeds',        
      'strat:deepslate_seeds',    
      'strat:ice_seeds',
      'strat:marble_seeds',       
      'strat:flarestone_seeds',   
      'strat:limestone_seeds'     
    ],
    [
      null,
      'strat:coal_seeds',
      'strat:amethyst_seeds',     
      'strat:nature_seeds',       
      'strat:nether_seeds',       
      'strat:honey_seeds'
    ],
    [
      null,
      'strat:iron_seeds',
      'strat:copper_seeds',       
      'strat:redstone_seeds',     
      'strat:obsidian_seeds',     
      'strat:nether_quartz_seeds',
      'strat:glowstone_seeds',    
      'strat:prismarine_seeds',   
      'strat:pig_iron_seeds',     
      'strat:tin_seeds',
      'strat:bronze_seeds',       
      'strat:aluminium_seeds'     
    ],
    [
      null,
      'strat:gold_seeds',
      'strat:lapis_lazuli_seeds', 
      'strat:electrum_seeds',     
      'strat:lead_seeds',
      'strat:steel_seeds',        
      'strat:silver_seeds',       
      'strat:ruby_seeds',
      'strat:cobalt_seeds',       
      'strat:ardite_seeds',       
      'strat:end_seeds',
      'strat:alumite_seeds',
      'strat:soulium_seeds',
      'strat:rose_gold_seeds',
      'strat:titanium_seeds',
      'strat:sapphire_seeds'
    ],
    [
      null,
      'strat:diamond_seeds',
      'strat:emerald_seeds',
      'strat:netherite_seeds',
      'strat:manyullyn_seeds',
      'strat:enderium_seeds',
      'strat:platinum_seeds',
      'strat:enderite_seeds'
    ],
    [
      null,
      'strat:cow_seeds',
      'strat:pig_seeds',
      'strat:chicken_seeds',
      'strat:sheep_seeds',
      'strat:fish_seeds',
      'strat:squid_seeds',
      'strat:turtle_seeds',
      'strat:slime_seeds'
    ],
    [
      null,
      'strat:creeper_seeds',
      'strat:zombie_seeds',
      'strat:skeleton_seeds',
      'strat:spider_seeds',
      'strat:rabbit_seeds'
    ],
    [
      null,
      'strat:blaze_seeds',
      'strat:enderman_seeds',
      'strat:ghast_seeds'
    ],
    [ null, 'strat:wither_skeleton_seeds' ]
  ]