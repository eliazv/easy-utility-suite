@echo off
echo ================================
echo    DEPLOY VERCEL - Easy Utility Suite
echo ================================
echo.

echo [1/3] Preparazione del deploy...
echo Triggering deployment via Vercel API...
echo.

echo [2/3] Chiamata API Vercel...
curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_r7UCVTr2Lli4WhFJ1DkqfaBl793T/Lbb2nLa4Ss" ^
     -H "Content-Type: application/json" ^
     -d "{}"

echo.
echo.
echo [3/3] Deploy completato!
echo ================================
echo Il deploy e' stato avviato su Vercel.
echo Controlla il dashboard di Vercel per lo stato del deployment.
echo ================================
echo.
pause
