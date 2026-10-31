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

## Recommended setup: FreeLLMAPI

1. **Install it.** Docker is required. Read the script before you run it: https://freellmapi.co/install.sh
   ```bash
   curl -fsSL https://freellmapi.co/install.sh | bash
   ```
2. **Get free keys:**
   - Groq: https://console.groq.com/keys
   - Gemini: https://aistudio.google.com/apikey
   - Others: Cerebras, OpenRouter (`:free` models), Mistral, and so on.
3. **Add the keys.** Open http://localhost:3001, go to the **Keys** page, add your provider keys, and set the **Fallback Chain** order.
4. **Connect Claude Code.** Copy the *unified key* from the Keys page header, then:
   ```bash
   npx freellmapi launch          # sets the env vars and starts `claude`
   # or manually:
   export ANTHROPIC_BASE_URL=http://localhost:3001
   export ANTHROPIC_AUTH_TOKEN=<unified key>
   claude
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
