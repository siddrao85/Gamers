# 22. How to Edit Reels Using Claude

**Source:** Instagram reel by Shubham (@walkingmile)
**Category:** Tech & Coding
**Filed:** 2026-11-27

## Step-by-step setup

1. **Install the Claude desktop app.** He says the browser version won't work, because Claude needs access to files on your computer.
2. **Create the folder structure.** Make a main folder named `AI-Video-Editor` with three subfolders:
   ```
   AI-Video-Editor/
   ├── Raw Footage/
   ├── References/
   └── Exports/
   ```
3. **Point Claude at the folder.** Open Claude, choose **"This computer"** as the environment, and pick the `AI-Video-Editor` folder so Claude can read and write your local files.
4. **Give Claude its tools.** Send a prompt that lists five GitHub projects for Claude to install:
   | Tool | Purpose |
   |------|---------|
   | Remotion | Programmatic video rendering |
   | Hyperframes | (named in the reel; purpose not explained) |
   | FFmpeg | Video processing |
   | Whisper.cpp | Transcription for captions |
   | yt-dlp | Downloading reference videos |
5. **Teach Claude your editing style.** Paste links to reference reels you like and ask Claude to analyze them. He also uses a "brand sheet" so edits keep a consistent style.
6. **Edit.** Put raw footage in `Raw Footage` and ask Claude to turn it into an Instagram Reel: cut the silences, apply the brand sheet, and add captions, music and graphics. After you approve it, Claude exports the finished video to `Exports`.

## Before you start

- **Prompts aren't copied here.** The exact prompt texts appear as on-screen overlays in the reel ("pause and copy them"), so copy them from the reel. His full written guide is comment-gated: comment "EDIT" on the post and he DMs it to you.
- **Plan requirement is unclear.** Commenters ask whether this needs a paid Claude plan, and the post doesn't answer publicly.
- **Check your machine first.** This runs through the Claude desktop app on your own machine. Make sure it installs cleanly on the Intel MacBook before spending time on the folder and tool setup.
