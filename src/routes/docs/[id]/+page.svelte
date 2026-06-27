<script lang="ts">
    import { page } from "$app/state";
    import { supabase } from "$lib/supabase/client";
    import { auth } from "$lib/stores/auth";
    import Editor from "$lib/components/Editor.svelte";
    import DocumentSidebar from "$lib/components/DocumentSidebar.svelte";
    import StatusBar from "$lib/components/StatusBar.svelte";
    import { docStore } from "$lib/stores/documents.svelte";
    import { uiStore } from "$lib/stores/ui.svelte";

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
        const { error } = await supabase
            .from("documents")
            .delete()
            .eq("id", doc.id);

        if (!error) {
            docStore.remove(doc.id); // Удаляем из стора
            doc = null;
        }

        isSaveOrDelete = false;
    }

    async function handleChangeName(title: string) {
        if (!doc) return;

        isSaveOrDelete = true;
        const { error } = await supabase
            .from("documents")
            .update({ title })
            .eq("id", doc.id);

        if (!error) {
            doc.title = title;
            docStore.updateTitle(doc.id, title); // Обновляем в сторе
        }
        isSaveOrDelete = false;
    }
</script>

{#if $auth.user}
    <main class="flex fixed top-16 inset-0 overflow-hidden">
        {#if uiStore.isSidebarOpen}
            <button
                aria-label="CloseSidebar"
                onclick={() => (uiStore.isSidebarOpen = false)}
                class="fixed inset-0 backdrop-blur-xs z-40 hidden max-[1024px]:block"
            ></button>
        {/if}

        <aside
            class="
            w-72 shrink-0 border-r border-slate-200 h-full overflow-y-auto transition-transform duration-300 z-40
            max-[1024px]:fixed max-[1024px]:top-16 max-[1024px]:left-0 bg-base-100
            {uiStore.isSidebarOpen
                ? 'max-[1024px]:translate-x-0'
                : 'max-[1024px]:-translate-x-full'}
        "
        >
            <DocumentSidebar />
        </aside>

        <section class="flex-1 relative h-full bg-slate-50/50 overflow-hidden">
            {#if doc}
                {#key doc.id}
                    <Editor
                        content={doc.content}
                        onUpdate={(json) => (currentJson = json)}
                    />
                {/key}
            {:else}
                <div class="p-10 max-[1024px]:pl-16 text-slate-400">
                    Выберите документ для редактирования
                </div>
            {/if}

            {#if doc}
                <div class="absolute bottom-0 left-0 right-0 z-50">
                    <StatusBar
                        {isSaveOrDelete}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        onChangeName={handleChangeName}
                        {lastSave}
                    />
                </div>
            {/if}
        </section>
    </main>
{/if}
