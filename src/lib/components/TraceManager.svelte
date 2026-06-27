<script>
  import { Crosshair, X, Check } from "lucide-svelte";

  let { editor } = $props();

  let isTracing = $state(false);
  let targetId = $state(null);
  let sourceId = $state(null);
  let traces = $state([]);
  let selectionKey = $state(0);

  let canTrace = $derived.by(() => {
    selectionKey;
    if (!editor) return false;

    const { selection } = editor.state;

    // Самое главное: если это просто курсор (нет выделенного текста) - отключаем!
    if (selection.empty) return false;

    const parent = editor.state.doc.resolve(selection.from).parent;

    // Проверяем наличие ID у блока
    return (
      typeof parent.attrs.id === "string" && parent.attrs.id.trim().length > 0
    );
  });

  let canConfirm = $derived.by(() => {
    selectionKey;
    if (!editor || !isTracing) return false;

    // Должен быть выделен текст (не просто клик)
    if (editor.state.selection.empty) return false;

    // И должен быть найден корректный ID цели
    return targetId !== null;
  });

  function startTracing() {
    sourceId = editor.state.doc.resolve(editor.state.selection.from).parent
      .attrs.id;
    isTracing = true;
  }

  function cancelTracing() {
    isTracing = false;
    sourceId = null;
    targetId = null;
  }

  function confirmTrace() {
    const newTrace = {
      source: sourceId,
      target: targetId,
      timestamp: Date.now(),
    };

    // В Svelte 5 можно просто пушить в $state массив
    traces.push(newTrace);
    console.log("Итоговая связь:", JSON.stringify(newTrace, null, 2));

    cancelTracing();
  }

  $effect(() => {
    if (!editor) return;
    const updateKey = () => {
      selectionKey++;
    };
    editor.on("selectionUpdate", updateKey);
    return () => {
      editor.off("selectionUpdate", updateKey);
    };
  });

  $effect(() => {
    if (!editor) return;
    if (!isTracing) return;

    const updateSelection = () => {
      const node = editor.state.doc.resolve(editor.state.selection.from).parent;
      const currentId = node.attrs.id;
      targetId = currentId !== sourceId ? currentId : null;
    };

    editor.on("selectionUpdate", updateSelection);

    return () => {
      editor.off("selectionUpdate", updateSelection);
    };
  });
</script>

<button
  onclick={() => {
    if (!isTracing) startTracing();
  }}
  disabled={!canTrace || isTracing}
  class="px-3 py-1.5 rounded text-lg disabled:opacity-50
  {canTrace & !isTracing
    ? 'text-indigo-600'
    : 'text-slate-600'}"
>
  {isTracing ? "Select target..." : "Trace"}
</button>

{#if isTracing}
  <button onclick={cancelTracing} class="p-2 text-red-700"
    ><X size={22} /></button
  >
  <button
    disabled={!canConfirm}
    onclick={confirmTrace}
    class="p-2 text-green-900 {canConfirm ? 'opacity-100' : 'opacity-30'}"
    ><Check size={22} /></button
  >
{/if}
