<script>
    import { Plus, FileText } from "lucide-svelte";
    import { supabase } from "$lib/supabase/client";
    import { t } from "svelte-i18n";
    import { docStore } from "$lib/stores/documents.svelte";

    $effect(() => {
        if (docStore.list.length === 0) docStore.load();
    });

    async function addDocument() {
        const defaultTitle = $t("documents.untitled", { default: "Untitled" });

        const { data, error } = await supabase
            .from("documents")
            .insert([
                { title: defaultTitle, content: { type: "doc", content: [] } },
            ])
            .select("id, title")
            .single();

        if (!error && data) {
            docStore.add(data); // Пушим в стор
        }
    }
</script>

<div class="p-4 flex items-center justify-between">
    <span class="text-xs font-bold text-slate-400 tracking-wider"
        >Мои файлы</span
    >
    <button
        onclick={addDocument}
        class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
    >
        <Plus size={18} strokeWidth={3} />
    </button>
</div>

<nav class="flex-1 overflow-y-auto">
    {#each docStore.list as doc}
        <a
            href="/docs/{doc.id}"
            class="flex items-center gap-3 p-2 text-sm rounded transition-colors hover:bg-slate-400 hover:text-black"
        >
            <FileText size={16} class="text-slate-400" />
            <span class="truncate">{doc.title}</span>
        </a>
    {/each}
</nav>
