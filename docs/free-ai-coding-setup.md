# Running Claude Code on free LLM APIs

These notes come from cloning and reading all 8 repositories on 2026-10-31.

## The key fact

Claude Code only speaks the **Anthropic Messages API** (`POST /v1/messages`). You point it at a proxy with two environment variables:

```bash
export ANTHROPIC_BASE_URL=http://localhost:<port>   # no /v1 suffix
export ANTHROPIC_AUTH_TOKEN=<proxy's own API key>
export ANTHROPIC_MODEL=<model id the proxy knows>   # optional
claude
```

So a proxy works **directly** only if it serves `/v1/messages`. Proxies that only serve OpenAI-style `/v1/chat/completions` need a translator in front of them, such as LiteLLM or `claude-code-router`.

## The 8 repos compared

| # | Repo | Language | Endpoint | Works with Claude Code? | Notes |
|---|------|----------|----------|-------------------------|-------|
| 7 | `tashfeenahmed/freellmapi` | TS / Docker | OpenAI **+ Anthropic `/v1/messages`** | ✅ Directly | Keys are stored encrypted. Has a dashboard and `npx freellmapi launch` for Claude Code. **Best pick.** |
| 8 | `Gmagl/omniroute` | TS / npm | OpenAI **+ Anthropic `/v1/messages`** | ✅ Directly | Very large (13k+ files) and needs about 1 GB+ RAM. ⚠️ See the warning below. |
| 2 | `kaiser-data/free-llm-proxy-router` | Go binary | OpenAI only | ⚠️ Needs a translator | Small and simple. Falls back from Groq → Gemini → Cerebras … |
| 1 | `Devansh-365/freellm` | TS / Docker | OpenAI only | ⚠️ Needs a translator | 8 providers. |
| 5 | `alienz-dev/llm-router` | Python | OpenAI only | ⚠️ Needs a translator | 11 providers, quota tracking. No LICENSE file. |
| 6 | `MajidAsghariTabrizi/free-best-router` | Node ≥22 | OpenAI only | ⚠️ Needs a translator | |
| 4 | `YeomanYe/free-llm-router` | Node lib/CLI | Library / CLI | ❌ Not a server for Claude Code | Uses Anthropic as an *upstream* provider only. No LICENSE file. |
| 3 | `nabinkhadka/free-llm-api` | Python lib | Python function call | ❌ | A library, not an HTTP proxy. |

## Recommended setup: FreeLLMAPI, step by step

### Step 0: Prerequisites
- **Docker** installed and running (Docker Desktop on Mac/Windows). Check with `docker --version`.
- **Claude Code** installed. Check with `claude --version`.
- On Windows you can skip Docker entirely: use the `.exe` installer from https://github.com/tashfeenahmed/freellmapi/releases/latest and go to Step 2.

### Step 1: Install and start FreeLLMAPI
Option A, the one-liner (macOS, Linux, or WSL). Open https://freellmapi.co/install.sh first and read it, then run:
```bash
curl -fsSL https://freellmapi.co/install.sh | bash
```
It creates `~/freellmapi`, generates an encryption key in `.env`, pulls the Docker image, and starts it on port 3001.

Option B, Docker Compose by hand (if you'd rather not pipe a script into bash):
```bash
git clone https://github.com/tashfeenahmed/freellmapi.git
cd freellmapi
printf "ENCRYPTION_KEY=%s\nPORT=3001\n" "$(openssl rand -hex 32)" > .env
docker compose up -d
```
Keep `.env` safe. If you lose the `ENCRYPTION_KEY`, the stored provider keys can't be decrypted.

### Step 2: Open the dashboard
Go to http://localhost:3001 and create your dashboard login.
If the page doesn't load, run `docker ps` to check that the container is running, and `docker compose logs -f` (inside `~/freellmapi`) to see errors.

### Step 3: Get free provider API keys
Two keys are enough to start:
- **Groq**: https://console.groq.com/keys (fast)
- **Google Gemini**: https://aistudio.google.com/apikey (large context window, which helps with Claude Code's big prompts)

Optional extras for more fallback room: Cerebras, OpenRouter (`:free` models), Mistral.
Use one account per provider.

### Step 4: Add the keys in the dashboard
1. Open the **Keys** page and add each provider key.
2. Drag the providers in the **Fallback Chain** into the order you want them tried.
3. Copy your **unified API key** from the Keys page header. It starts with `freellmapi-`. This is the only key Claude Code will see.
4. Optional: on the **Keys → Anthropic** tab, choose which free model each Claude family (`opus`, `sonnet`, `haiku`, `default`) maps to. Leave it on `auto` to let the router pick.

### Step 5: Test the endpoint
```bash
curl http://localhost:3001/v1/messages \
  -H "x-api-key: freellmapi-YOUR-UNIFIED-KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{"model":"claude-sonnet-4-5","max_tokens":100,"messages":[{"role":"user","content":"hi"}]}'
```
A JSON reply containing text means the router works.

### Step 6: Start Claude Code through FreeLLMAPI
Easiest: the launcher injects the settings for that one run only, and changes no config files.
```bash
npx freellmapi launch --api-key freellmapi-YOUR-UNIFIED-KEY
```

Or set the variables yourself.

macOS / Linux:
```bash
unset ANTHROPIC_API_KEY
export ANTHROPIC_BASE_URL=http://localhost:3001      # no /v1 at the end
export ANTHROPIC_AUTH_TOKEN=freellmapi-YOUR-UNIFIED-KEY
claude
```
Windows PowerShell:
```powershell
Remove-Item Env:ANTHROPIC_API_KEY -ErrorAction SilentlyContinue
$env:ANTHROPIC_BASE_URL="http://localhost:3001"
$env:ANTHROPIC_AUTH_TOKEN="freellmapi-YOUR-UNIFIED-KEY"
claude
```
Use `ANTHROPIC_AUTH_TOKEN`, **not** `ANTHROPIC_API_KEY`. Claude Code refuses to start if `ANTHROPIC_API_KEY` is also set.

### Step 7: Check that it works
Inside Claude Code, ask something small, like "list the files in this folder". The FreeLLMAPI dashboard should show the request and which provider handled it. If something seems wrong, run `npx freellmapi doctor claude` to check whether Claude Code's requests reach the gateway.

### Troubleshooting
| Symptom | Fix |
|---|---|
| `claude` asks you to log in, or ignores the proxy | The env vars weren't set in *this* terminal. Set them again, or use `npx freellmapi launch`. |
| Credential conflict error at startup | `unset ANTHROPIC_API_KEY` |
| 404 errors | Remove `/v1` from `ANTHROPIC_BASE_URL` |
| 401 errors | Wrong unified key. Copy it again from the dashboard. |
| 429 errors, or "all providers exhausted" | The free quotas ran out. Add another provider key or wait for the reset. |
| Very slow replies, or edits that go wrong | Map `sonnet`/`default` to a stronger free model on the Anthropic tab (a big-context Gemini model, for example) |

### Stop or update
```bash
cd ~/freellmapi && docker compose down       # stop
curl -fsSL https://freellmapi.co/install.sh | bash   # update (keeps .env and keys)
```

### Alternative: an OpenAI-only router plus a translator

```bash
# e.g. run kaiser-data/free-llm-proxy-router on :8080, then put a translator in front:
npm i -g @musistudio/claude-code-router   # or: pip install 'litellm[proxy]'
# configure it to use http://localhost:8080/v1 as an OpenAI provider,
# then set ANTHROPIC_BASE_URL to the translator's address
```

## Caveats (read these)

- **Quality drops.** Free models (Llama, Qwen, Gemini Flash, and others) are weaker than Claude at tool calling and multi-file agentic edits. Expect more failed edits and loops. Use them for small tasks.
- **Context limits.** Claude Code sends a large system prompt plus tool definitions. Many free models have small context windows or tight tokens-per-minute limits, so requests can fail or get truncated. Set `CLAUDE_CODE_MAX_OUTPUT_TOKENS` lower if needed.
- **Privacy.** Your code goes to whichever free provider handles the request. Some free tiers (for example, the Gemini free tier) may use prompts for training. Don't send secrets or client code you're not allowed to share.
- **Provider terms.** Use one honest account and key per provider. Making several accounts to multiply free quota usually breaks the provider's terms and can get you banned.
- **⚠️ OmniRoute subscription/OAuth mode.** OmniRoute can also route through consumer *subscription* logins with "TLS stealth" and copied billing headers. Reusing a Claude, ChatGPT, or other subscription token outside its official client breaks those providers' terms and can get the account suspended. If you use OmniRoute, stick to its **API-key / free-tier** providers.
- **Unvetted code.** These are small third-party projects that will hold your API keys. Pin a specific version, read the install script before running it, and keep the proxy bound to `localhost`.
- **Going back to Claude:** `unset ANTHROPIC_BASE_URL ANTHROPIC_AUTH_TOKEN ANTHROPIC_MODEL`, then restart `claude`.
