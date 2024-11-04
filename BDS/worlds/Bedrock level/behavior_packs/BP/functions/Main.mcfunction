execute as @a [tag=!staff] run execute as @s at @s in overworld if entity @s [r=1] unless entity @s[x=-4000,y=-100,z=-4000,dx=8000,dy=1000,dz=8000] run scriptevent enclave:border_fling
execute as @a [tag=!staff] run execute as @s at @s in overworld if entity @s [r=1] unless entity @s[x=-3950,y=-100,z=-3950,dx=7900,dy=1000,dz=7900] run title @s actionbar §4You are near the world border!

execute as @a [tag=!staff] at @s unless block ~ 0 ~ allow unless block ~ -64 ~ allow run tag @s remove protect
execute as @e [tag=!staff] at @s if block ~ -64 ~ allow run tag @s add protect
execute as @e [tag=!staff] at @s if block ~ 0 ~ allow run tag @s add protect

execute as @e [tag=protect,type=fishing_hook] run scriptevent enclave:despawn

execute as @a [tag=mason] at @s if block ~ -64 ~ bedrock run tp @s -40 80 -530

gamemode a @a[tag=protect,tag=!staff,m=!a]
execute as @e [family=monster] at @s if block ~ -64 ~ allow run scriptevent enclave:despawn
execute as @e [family=monster] at @s if block ~ 0 ~ allow run scriptevent enclave:despawn
effect @a[tag=protect] weakness 1 255 true
effect @a[tag=protect] resistance 1 255 true
effect @a[tag=protect] fire_resistance 1 255 true
effect @a[tag=protect] regeneration 1 255 true
gamemode s @a[m=!s,tag=!protect,tag=!staff]


execute at @a run fill ~-8 ~-4 ~-8 ~8 ~12 ~8 diamond_block replace mob_spawner
clear @a empty_map
clear @a filled_map

playsound enclave:metal_pipe @a[hasitem={item=enclave:metal_pipe}]
clear @a enclave:metal_pipe

