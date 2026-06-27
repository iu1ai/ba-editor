<script>
    import { Plus, FileText } from "lucide-svelte";
    import { supabase } from "$lib/supabase/client";
    import { t } from "svelte-i18n";

    let documents = $state([]);

    $effect(() => {
        async function load() {
            const { data } = await supabase
                .from("documents")
                .select("id, title")
                .order("created_at", { ascending: false });
            documents = data || [];
        }
        load();
    });

    async function addDocument() {
        // Достаем название из i18n (замени 'documents.untitled' на свой ключ)
        const defaultTitle = $t("documents.untitled", { default: "Untitled" });

        const { data, error } = await supabase
            .from("documents")
            .insert([
                {
                    title: defaultTitle,
                    content: { type: "doc", content: [] },
                },
            ])
            .select("id, title") // Сразу забираем сгенерированный UUID id обратно
            .single();

        if (!error && data) {
            documents = [data, ...documents];
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
    {#each documents as doc}
        <a
            href="/docs/{doc.id}"
            class="flex items-center gap-3 p-2 text-sm rounded transition-colors hover:bg-slate-400 hover:text-black"
        >
            <FileText size={16} class="text-slate-400" />
            <span class="truncate">{doc.title}</span>
        </a>
    {/each}
</nav>
