# Content component – usage guide

The **Content** component is a three-slot layout (left, center, right) with **defaults** and optional **overrides** per slot. Use it for headers, toolbars, or any row where you want a stable structure and the ability to inject or replace content from the outside.

---

## API at a glance

| Prop | Purpose |
|------|--------|
| `defaults` | `{ left?, center?, right? }` – Default React nodes for each slot. |
| `content` | `ContentParts` – Optional overrides per slot: `replace`, `prepend`, `append`, `className`. |
| `slotClasses` | Module/theme classes for each slot wrapper (merged after built-in defaults). |
| `className` | Classes on the root flex container. |

---

## Slot override shape (`ContentParts` / `SlotContent`)

For each slot you can pass:

- **`replace`** – Renders instead of the default (default is not shown).
- **`prepend`** – Renders before the default.
- **`append`** – Renders after the default.
- **`className`** – Applied to that slot’s wrapper (in addition to `slotClasses`).

Only one of `replace` vs (`prepend`/`append`) applies per slot; `replace` wins when present.

---

## Using a single child per slot (fragment for multiple siblings)

Each slot accepts **one** React node as its default and one as `replace`. If you want several elements (e.g. multiple buttons) to sit **as siblings** in the same slot, you must pass **a single parent**. The right way to do that is a **React fragment** (`<>...</>`).

- If you pass multiple elements without a fragment, only one will be used (or behavior is undefined).
- Wrapping in a fragment gives one logical “child” to the slot, so all items render as true siblings inside the slot’s wrapper and layout (e.g. flex + gap) applies correctly.

**Example (from GraphExplorer):** the right slot has several icon buttons. They are wrapped in one fragment so they are one default for the slot and lay out as siblings:

```tsx
<Content
  defaults={{
    left: (
      <CardTitle className="text-lg font-semibold">
        {title}
      </CardTitle>
    ),
    right: (
      <>
        {!hideExpandControls && (
          <>
            <IconButton2 icon={...} label="Expand all groups" onAction={handleExpandAll} />
            <IconButton2 icon={...} label="Collapse all groups" onAction={handleCollapseAll} />
          </>
        )}
        <IconButton2 icon={...} label="Debug" onAction={handleDebugClick} />
        <IconButton2 icon={...} label={viewMode === "tree" ? "Flat View" : "Tree View"} onAction={...} />
      </>
    ),
  }}
  slotClasses={{ right: "gap-1" }}
  content={headerContent}
/>
```

So: **one fragment per slot when you have multiple sibling elements** – that’s the only way to get defaults (and overrides like `prepend`/`append`) to behave as true siblings inside the common slot parent.

---

## Class system

Classes are applied in a fixed order so you can rely on overrides winning.

1. **Root row**  
   - `className` on `<Content>` → applied to the outer flex container (`flex items-center gap-2 min-w-0`).

2. **Per-slot wrapper** (left, center, right)  
   For each slot div, `cn()` is called with, in order:
   - **Built-in slot defaults**  
     - `left`: `"flex items-center"`  
     - `center`: `"flex-1 flex justify-center min-w-0"`  
     - `right`: `"flex items-center"`
   - **`slotClasses`**  
     - e.g. `slotClasses={{ right: "gap-1" }}` for layout/theme overrides.
   - **`content?.left|center|right?.className`**  
     - Per-slot override from `content` (e.g. from a consumer like GraphExplorer’s `headerContent`).

So: **default slot layout → `slotClasses` (module/theme) → `content.*.className` (consumer override)**. Later values override earlier ones when using `cn()`.

---

## Example: consumer override via `content`

The same GraphExplorer passes `headerContent` so parents can inject or replace slot content:

```tsx
// GraphExplorer receives headerContent?: ContentParts and forwards it:
<Content
  defaults={{ left: <CardTitle>...</CardTitle>, right: <>...</> }}
  slotClasses={{ right: "gap-1" }}
  content={headerContent}
/>
```

A consumer can then do, for example:

```tsx
<GraphExplorer
  headerContent={{
    right: { append: <Button>Extra action</Button> },
    left: { className: "text-primary" },
  }}
  ...
/>
```

Defaults still render; `append` adds after the default in the right slot, and `className` customizes the left slot wrapper.

---

## Summary

- Use **one React node per slot** for defaults and for `replace`; use **`<>...</>`** when a slot has multiple sibling elements.
- **Class order:** built-in slot classes → `slotClasses` → `content.*.className`.
- Use **`content`** for optional prepend/append/replace/className from outside without changing the component’s default layout.
