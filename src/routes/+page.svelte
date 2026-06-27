<script lang="ts">
    import { page } from "$app/state";
    import { supabase } from "$lib/supabase/client";
    import { auth } from "$lib/stores/auth";
    import DocumentSidebar from "$lib/components/DocumentSidebar.svelte";

    $effect(() => {});
</script>

{#if $auth.user}
    <main class="grid grid-cols-[20%_80%] fixed top-16 inset-0 overflow-hidden">
        <aside class="border-r border-slate-200 h-full overflow-y-auto">
            <DocumentSidebar />
        </aside>

        <section class="relative h-full overflow-hidden">
            <div class="p-10">
                Выберите документ для редактирования
            </div>
        </section>
    </main>
{/if}
