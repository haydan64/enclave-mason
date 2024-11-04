scoreboard objectives add void_cooldown dummy void_cooldown

scoreboard players remove @e[scores={void_cooldown=1..}] void_cooldown 1
execute as @e[scores={void_cooldown=1..}] as @s at @s anchored feet run particle minecraft:end_chest ^^0.25^
execute as @e[scores={void_cooldown=1..}] as @s at @s anchored eyes run particle minecraft:mob_portal ^^-0.25^
execute as @e[scores={void_cooldown=..0}] run scoreboard players reset @s void_cooldown