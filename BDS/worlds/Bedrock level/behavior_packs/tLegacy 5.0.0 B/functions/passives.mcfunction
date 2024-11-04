## gamerule sendcommandfeedback false

scoreboard objectives add purity dummy purity
scoreboard objectives add poison dummy poison
scoreboard objectives add poison_backfire dummy poison_backfire

scoreboard players remove @e[scores={purity=1..}] purity 1
scoreboard players remove @e[scores={poison=1..}] poison 1
scoreboard players remove @e[scores={poison_backfire=1..}] poison_backfire 1

execute as @a[hasitem={item=hax:guidebook}] run execute as @s at @s run function get_guidebook