@echo off
setlocal
if exist app\admin\layout.tsx del /f /q app\admin\layout.tsx
if exist app\admin\page.tsx del /f /q app\admin\page.tsx
if exist app\admin\reservations rmdir /s /q app\admin\reservations
if exist app\admin\inquiries rmdir /s /q app\admin\inquiries
if exist app\admin\payments rmdir /s /q app\admin\payments
if exist app\admin\experiences rmdir /s /q app\admin\experiences
if exist app\admin\legal rmdir /s /q app\admin\legal
if exist app\admin\settings rmdir /s /q app\admin\settings
if exist app\admin\users rmdir /s /q app\admin\users
if exist app\admin\media rmdir /s /q app\admin\media
if exist app\admin\payment-settings rmdir /s /q app\admin\payment-settings
echo Old admin routes cleaned.
endlocal
