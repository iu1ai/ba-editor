<script>
    import { t } from "svelte-i18n";

    let { isSaveOrDelete, lastSave, onSave, onDelete, onChangeName } = $props();

    // Раздельные состояния для двух модалок
    let showDeleteConfirm = $state(false);
    let showRenameModal = $state(false);
    let newTitle = $state("");

    const formatTime = (date) => {
        if (!date) return "";
        return new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(new Date(date));
    };

    function handleRename() {
        if (!newTitle.trim()) return;
        onChangeName(newTitle.trim());
        showRenameModal = false;
        newTitle = "";
    }
</script>

<div
    class="bg-white/90 backdrop-blur border border-slate-200 shadow-lg p-3 rounded-xl flex items-center justify-between"
>
    <div class="flex items-center gap-4">
        <span class="text-xs text-slate-500 font-medium">
            {#if isSaveOrDelete}
                {$t("status_bar.saving2")}
            {:else}
                {lastSave
                    ? $t("status_bar.saving") + ` (${formatTime(lastSave)})`
                    : ""}
            {/if}
        </span>
        <button
            onclick={onSave}
            disabled={isSaveOrDelete}
            class="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-sm"
        >
            {isSaveOrDelete
                ? $t("status_bar.saving_2")
                : $t("status_bar.update")}
        </button>
    </div>

    <div class="flex items-center gap-3">
        <button
            onclick={() => (showRenameModal = true)}
            disabled={isSaveOrDelete}
            class="px-5 py-2 bg-slate-200 text-black text-sm font-medium rounded-lg hover:bg-slate-100 transition-all shadow-sm"
        >
            {$t("status_bar.rename")}
        </button>

        <button
            onclick={() => (showDeleteConfirm = true)}
            disabled={isSaveOrDelete}
            class="px-5 py-2 bg-slate-200 text-black text-sm font-medium rounded-lg hover:bg-slate-100 transition-all shadow-sm"
        >
            {$t("status_bar.delete")}
        </button>
    </div>
</div>

{#if showRenameModal}
    <div
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    >
        <div
            class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full border border-slate-100"
        >
            <h3 class="text-base font-semibold text-slate-900">
                {$t("status_bar.rename_document")}
            </h3>
            <input
                bind:value={newTitle}
                type="text"
                placeholder={$t("status_bar.rename_placeholder")}
                class="w-full text-slate-900 text-sm p-3 border border-slate-200 rounded-lg mt-3 focus:outline-none focus:border-blue-500"
                onkeydown={(e) => e.key === "Enter" && handleRename()}
            />
            <div class="flex justify-end gap-3 mt-6">
                <button
                    onclick={() => {
                        showRenameModal = false;
                        newTitle = "";
                    }}
                    class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                    {$t("m.close")}
                </button>
                <button
                    onclick={handleRename}
                    disabled={!newTitle.trim()}
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-slate-300"
                >
                    {$t("status_bar.rename")}
                </button>
            </div>
        </div>
    </div>
{/if}

{#if showDeleteConfirm}
    <div
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    >
        <div
            class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full border border-slate-100"
        >
            <h3 class="text-base font-semibold text-slate-900">
                {$t("status_bar.delete_question")}
            </h3>
            <p class="text-sm text-slate-500 mt-2">
                {$t("status_bar.delete_note")}
            </p>
            <div class="flex justify-end gap-3 mt-6">
                <button
                    onclick={() => (showDeleteConfirm = false)}
                    class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
                >
                    {$t("status_bar.delete_no")}
                </button>
                <button
                    onclick={() => {
                        showDeleteConfirm = false;
                        onDelete();
                    }}
                    class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                    {$t("status_bar.delete_yes")}
                </button>
            </div>
        </div>
    </div>
{/if}
