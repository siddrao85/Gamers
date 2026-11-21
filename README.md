# Home Server Stack

Docker Compose setup for a Ryzen 7 7735HS mini PC (Radeon 680M, 24GB LPDDR5):

| Service | URL | Purpose |
|---|---|---|
| Open WebUI | `http://<server-ip>:3000` | Chat interface for local models |
| Ollama | `127.0.0.1:11434` (server only) | Runs LLMs on the 680M via Vulkan |
| Jellyfin | `http://<server-ip>:8096` | Media server with hardware transcoding |

## Setup (Ubuntu Server 24.04 recommended)

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # log out and back in afterwards

# 2. Check the GPU is visible, and note the group IDs
ls /dev/dri                     # should list card* and renderD128
getent group video render       # put these numbers in .env

# 3. Configure
cp .env.example .env
nano .env                       # set WEBUI_SECRET_KEY, MEDIA_PATH, GIDs, TZ

# 4. Start
docker compose up -d
```

## Pull models

Good fits for 24GB of shared RAM:

```bash
docker exec -it ollama ollama pull llama3.1:8b     # fast all-rounder (~5GB)
docker exec -it ollama ollama pull gpt-oss:20b     # strongest that runs well (~13GB)
docker exec -it ollama ollama pull qwen3:30b-a3b   # MoE, good quality (~18GB, tight)
```

Then open Open WebUI, create your admin account (the first account becomes admin),
and set `WEBUI_ENABLE_SIGNUP=false` in `.env` followed by `docker compose up -d`.

**Check the GPU is used:** run `docker logs ollama` and look for a Vulkan device
mentioning the Radeon 680M. If Vulkan misbehaves, set `OLLAMA_VULKAN=0` to fall
back to the CPU.

## Jellyfin hardware transcoding

Dashboard → Playback → Transcoding:
- Hardware acceleration: **Video Acceleration API (VAAPI)**
- VA-API device: `/dev/dri/renderD128`
- Enable hardware decoding for H.264, HEVC, VP9 and AV1
- Enable hardware encoding (H.264/HEVC; the 680M cannot encode AV1)

## Memory budget

All services share 24GB. Ollama keeps one model loaded and unloads it after 10
minutes idle; Jellyfin is capped at 4GB. In the BIOS, keep the GPU memory setting
("UMA Frame Buffer Size") low, at 1–2GB: on Linux the GPU borrows system RAM as needed.

## Remote access

Use [Tailscale](https://tailscale.com) rather than forwarding router ports.

## Updating

```bash
docker compose pull && docker compose up -d
```
