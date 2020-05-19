@echo off
Mode con cols=90 lines=15
set Location=C:\...\Documents
Set FileName=NodeScriptsInFolder.bat
Set Tmp=Tmp.txt
Set SearchResult=SearchResult.txt
echo( & cls
echo(  & echo  Please Wait for moment .... Searching for "%FileName%" on "%Location%"
where /r "%Location%" "%FileName%" > %Tmp%
Cmd /U /C Type %Tmp% > %SearchResult%
Del %Tmp%
Start %SearchResult%