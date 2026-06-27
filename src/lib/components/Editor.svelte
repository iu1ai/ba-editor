<script>
  import {
    Bold,
    Italic,
    Heading2,
    Heading3,
    List,
    AlignLeft,
    AlignCenter,
    Link,
  } from "lucide-svelte";
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import TextAlign from "@tiptap/extension-text-align";
  import UniqueId from "tiptap-unique-id";
  import ToolbarButton from "$lib/components/ToolbarButton.svelte";
  import TraceManager from "$lib/components/TraceManager.svelte";

  let element;
  let editor = $state(null);
  let currentJSON = {};
  let { content, onUpdate } = $props();

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          defaultAlignment: "left",
        }),
        UniqueId.configure({
          attributeName: "id",
          types: [
            "paragraph",
            "heading",
            "orderedList",
            "bulletList",
            "listItem",
          ],
          createId: () => crypto.randomUUID(),
        }),
      ],
      content: content,
      onUpdate: ({ editor }) => {
        currentJSON = editor.getJSON();

        if (onUpdate) onUpdate(editor.getJSON());

        console.clear(); // Очищает консоль, чтобы не спамить историями изменений
        console.log(
          "Текущая структура документа (JSON AST):",
          editor.getJSON(),
        );
      },
      // Принудительно обновляем UI при изменении позиции курсора
      onSelectionUpdate: () => {
        editor = editor;
      },
    });
  });

  onDestroy(() => editor?.destroy());
</script>

<div class="w-full h-full flex flex-col bg-white overflow-hidden">
  {#if editor}
    <div class="flex items-center gap-1 p-2 bg-slate-50/50 flex-wrap shrink-0">
      <ToolbarButton {editor} command="toggleBold" name="bold" icon={Bold} />
      <ToolbarButton
        {editor}
        command="toggleItalic"
        name="italic"
        icon={Italic}
      />

      <div class="h-4 w-[1px] bg-slate-200 mx-1"></div>

      <ToolbarButton
        {editor}
        command="toggleHeading"
        name="heading"
        args={{ level: 2 }}
        icon={Heading2}
      />
      <ToolbarButton
        {editor}
        command="toggleHeading"
        name="heading"
        args={{ level: 3 }}
        icon={Heading3}
      />

      <div class="h-4 w-[1px] bg-slate-200 mx-1"></div>

      <ToolbarButton
        {editor}
        command="toggleBulletList"
        name="bulletList"
        icon={List}
      />

      <div class="h-4 w-[1px] bg-slate-200 mx-1"></div>

      <ToolbarButton
        {editor}
        command="setTextAlign"
        name={{ textAlign: "left" }}
        args={{ textAlign: "left" }}
        icon={AlignLeft}
      />
      <ToolbarButton
        {editor}
        command="setTextAlign"
        name={{ textAlign: "center" }}
        args={{ textAlign: "center" }}
        icon={AlignCenter}
      />

      <div class="h-4 w-[1px] bg-slate-200 mx-1"></div>
      <TraceManager {editor} />
    </div>
  {/if}

  <div
    bind:this={element}
    class="prose-container flex-1 overflow-y-auto min-h-0"
  ></div>
</div>

<style>
  :global(.prose-container [contenteditable="true"]) {
    padding: 24px;
    width: 100%;
    min-height: 100%;
    outline: none;
    overflow-y: visible;
    padding-bottom: 140px;
    box-sizing: border-box;
  }
  :global(.prose-container h2) {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: #1e293b;
  }
  :global(.prose-container h3) {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #334155;
  }
  :global(.prose-container p) {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: #475569;
  }
  :global(.prose-container ul) {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }
</style>
