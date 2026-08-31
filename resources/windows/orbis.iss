; Orbis's Windows installer.
;
; Per-user by design: %LOCALAPPDATA%\Programs needs no elevation, which is
; what lets the in-app updater re-run this silently without a UAC prompt.
; See RELEASING.md and docs/windows.md.
;
; Built by scripts/bundle-windows.ts, which supplies:
;   /DAppVersion=<version>  /DArch=<x86_64|aarch64>
;   /DStageDir=<dir with the built executables>  /DOutputDir=<dir>

#ifndef AppVersion
  #error AppVersion must be defined (ISCC /DAppVersion=...)
#endif
#ifndef Arch
  #error Arch must be defined (ISCC /DArch=...)
#endif
#ifndef StageDir
  #error StageDir must be defined (ISCC /DStageDir=...)
#endif
#ifndef OutputDir
  #define OutputDir "."
#endif

; An x64 build is worth allowing on Arm, where it runs emulated; an arm64
; build on x64 is not, so refuse it up front rather than installing something
; that cannot start.
#if Arch == "aarch64"
  #define Architectures "arm64"
#else
  #define Architectures "x64compatible"
#endif

[Setup]
; Never change AppId: it is how Windows and every later installer recognize
; an existing install, and how the updater replaces rather than duplicates it.
AppId={{8B6C6E4A-3E0F-4F0B-9C5F-2E0E9C4B7A11}
AppName=Orbis
AppVersion={#AppVersion}
VersionInfoVersion={#AppVersion}
AppPublisher=Orbis
AppPublisherURL=https://orbis.sh
AppSupportURL=https://github.com/wisnuwiry/orbis/issues
AppUpdatesURL=https://github.com/wisnuwiry/orbis/releases
DefaultDirName={autopf}\Orbis
DefaultGroupName=Orbis
UninstallDisplayName=Orbis
UninstallDisplayIcon={app}\orbis.exe
LicenseFile={#StageDir}\LICENSE
OutputDir={#OutputDir}
OutputBaseFilename=Orbis-{#AppVersion}-{#Arch}-Setup
SetupIconFile=AppIcon.ico
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
ArchitecturesAllowed={#Architectures}
ArchitecturesInstallIn64BitMode={#Architectures}
; What docs/windows.md promises. Enforcing it here beats installing onto a
; system that cannot run the result.
MinVersion=10.0.17763
; Two installers must not race — the updater can be triggered again while an
; update is already applying.
SetupMutex=OrbisSetup
; No elevation, so an update never has to ask for it either.
PrivilegesRequired=lowest
DisableProgramGroupPage=yes
DisableReadyPage=yes
; The updater passes /DIR, and a manual reinstall should land where the
; previous one did rather than asking again.
UsePreviousAppDir=yes
; Orbis persists continuously to SQLite, so closing it is safe; a silent
; update cannot stop to ask, and a locked orbis.exe would fail the install.
CloseApplications=force
RestartApplications=no

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
Source: "{#StageDir}\orbis.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#StageDir}\orbis-daemon.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#StageDir}\LICENSE"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{group}\Orbis"; Filename: "{app}\orbis.exe"
Name: "{userdesktop}\Orbis"; Filename: "{app}\orbis.exe"; Tasks: desktopicon

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; Flags: unchecked

[Run]
; No skipifsilent: this is also how the updater's silent run brings Orbis back.
Filename: "{app}\orbis.exe"; Description: "{cm:LaunchProgram,Orbis}"; Flags: nowait postinstall
