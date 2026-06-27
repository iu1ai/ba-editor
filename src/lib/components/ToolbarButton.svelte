<script>
    let { editor, command, name, args, icon: Icon } = $props();

    let tick = $state(0);

    $effect(() => {
        if (!editor) return;
        const handler = () => {
            tick++;
        };
        editor.on("transaction", handler);
        editor.on("selectionUpdate", handler);
        return () => {
            editor.off("transaction", handler);
            editor.off("selectionUpdate", handler);
        };
    });

    let active = $derived.by(() => {
        tick;
        if (!editor || !name) return false;

        // Если есть args, проверяем с ними, если нет — только по имени
        return args ? editor.isActive(name, args) : editor.isActive(name);
    });

    function handleClick() {
        if (!editor) return;
        // Для выравнивания TipTap ждет вызов вида setTextAlign('center'), а не передачу объекта
        if (command === "setTextAlign") {
            editor.chain().focus()[command](args.textAlign).run();
        } else {
            editor.chain().focus()[command](args).run();
        }
    }
</script>

<button
    type="button"
    onclick={handleClick}
    class="p-2 rounded-lg transition-all border border-transparent
         {active
        ? 'bg-slate-200 text-slate-900 shadow-inner'
        : 'hover:bg-slate-100 text-slate-600'}
         disabled:opacity-30"
>
    <Icon size={18} />
</button>
