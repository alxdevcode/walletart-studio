<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- App state (designs, active design, overlay flag, theme) lives in `src/lib/store.ts` persisted to localStorage — designs must stay on-device, no bank data ever.
- All Android overlay calls go through `overlayBridge` in `src/lib/native-overlay-bridge.ts` — native Capacitor plugin "NativeOverlay" is built separately; web fallback only tracks UI state.
- Crop math (bank-card ratio) is centralized in `src/lib/crop.ts` so the editor preview and the saved render match.
