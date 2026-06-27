<script>
    let { isSaveOrDelete, onSave, onDelete, lastSave } = $props();

    let showConfirm = $state(false);

    const formatTime = (date) => {
        if (!date) return "";
        return new Intl.DateTimeFormat("en-GB", {
            // en-GB гарантирует 24-часовой формат
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(new Date(date));
    };
</script>

<div
    class="bg-white/90 backdrop-blur border border-slate-200 shadow-lg p-3 flex items-center justify-between"
>
    <div class="flex items-center gap-4">
        <span class="text-xs text-slate-500 font-medium">
            {#if isSaveOrDelete}
                Сохранение...
            {:else}
                {lastSave
                    ? `Все изменения сохранены (${formatTime(lastSave)})`
                    : ""}
            {/if}
        </span>
        <button
            onclick={onSave}
            disabled={isSaveOrDelete}
            class="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-slate-300 transition-all shadow-sm"
        >
            {isSaveOrDelete ? "Сохраняю..." : "Обновить"}
        </button>
    </div>

    <button
        onclick={() => (showConfirm = true)}
        disabled={isSaveOrDelete}
        class="px-5 py-2 bg-slate-200 text-black text-sm font-medium rounded-lg hover:bg-slate-100 transition-all shadow-sm"
    >
        Переименовать
    </button>

    <button
        onclick={() => (showConfirm = true)}
        disabled={isSaveOrDelete}
        class="px-5 py-2 bg-slate-200 text-black text-sm font-medium rounded-lg hover:bg-slate-100 transition-all shadow-sm"
    >
        Удалить
    </button>
</div>

{#if showConfirm}
    <div
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    >
        <div
            class="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full border border-slate-100"
        >
            <h3 class="text-base font-semibold text-slate-900">
                Удалить этот документ?
            </h3>
            <p class="text-sm text-slate-500 mt-2">
                Это действие необратимо. Вы уверены, что хотите полностью
                удалить файл?
            </p>

            <div class="flex justify-end gap-3 mt-6">
                <button
                    onclick={() => (showConfirm = false)}
                    class="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    Нет, отмена
                </button>
                <button
                    onclick={() => {
                        showConfirm = false; // Закрываем окно
                        onDelete(); // Вызываем функцию удаления
                    }}
                    class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                >
                    Да, удалить
                </button>
            </div>
        </div>
    </div>
{/if}
