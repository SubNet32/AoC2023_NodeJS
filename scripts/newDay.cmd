@echo off

:try_again
set /P "day=Enter day : "
echo %day%|findstr /r "[^0-9]" && (
    echo enter a number
    goto :try_again
)

if %day% lss 10 (
  set "day=0%day%"
)
type nul > "../Files/day%day%.txt"

mkdir "../src/Days/Day%day%"
set "file=../src/Days/Day%day%/day.ts"
echo import { DayResult } from '../../types' > %file%
echo. >> %file%
echo export default function Day(): DayResult { >> %file%
echo async function solve1(input: string[]) {return ''} >> %file%
echo. >> %file%
echo async function solve2(input: string[]) {return ''} >> %file%
echo. >> %file%
echo return { solve1, solve2 } >> %file%
echo. >> %file%
echo } >> %file%

 code ../Files/Day%day%.txt %file%