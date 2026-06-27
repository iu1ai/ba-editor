<script lang="ts">
    import { page } from "$app/state";
    import { supabase } from "$lib/supabase/client";
    import { auth } from "$lib/stores/auth";
    import Editor from "$lib/components/Editor.svelte";
    import DocumentSidebar from "$lib/components/DocumentSidebar.svelte";
    import StatusBar from "$lib/components/StatusBar.svelte";

    let doc = $state(null);
    let isSaveOrDelete = $state(false);
    let currentJson = $state(null);
    let lastSave = $state(null);

    $effect(() => {
        async function loadDoc() {
            const id = page.params.id;
            if (!id) {
                doc = null;
                return;
            }

            const { data } = await supabase
                .from("documents")
                .select("*")
                .eq("id", id)
                .single();

            doc = data;
            currentJson = data.content;
        }
        loadDoc();
    });

    async function handleSave() {
        if (!doc || !currentJson) return;

        isSaveOrDelete = true;
        const { data, error } = await supabase
            .from("documents")
            .update({ content: currentJson })
            .eq("id", doc.id)
            .select("updated_at")
            .single();

        isSaveOrDelete = false;

        if (!error && data?.updated_at) {
            lastSave = new Date(data.updated_at);
        }
    }

    async function handleDelete() {
        if (!doc) return;

        isSaveOrDelete = true;
        await supabase
            .from("documents")
            .delete()
            .eq("id", doc.id)
            .then(() => (isSaveOrDelete = false));
    }
</script>

{#if $auth.user}
    <main class="grid grid-cols-[20%_80%] fixed top-16 inset-0 overflow-hidden">
        <aside class="border-r border-slate-200 h-full overflow-y-auto">
            <DocumentSidebar />
        </aside>

        <section class="relative h-full bg-slate-50/50 overflow-hidden">
            {#if doc}
                {#key doc.id}
                    <Editor
                        content={doc.content}
                        onUpdate={(json) => (currentJson = json)}
                    />
                {/key}
            {:else}
                <div class="p-10 text-slate-400">
                    Выберите документ для редактирования
                </div>
            {/if}

            {#if doc}
                <div class="absolute bottom-0 left-0 right-0 z-50">
                    <StatusBar
                        {isSaveOrDelete}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        {lastSave}
                    />
                </div>
            {/if}
        </section>
    </main>
{/if}
