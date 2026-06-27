import { supabase } from "$lib/supabase/client";

class DocumentsStore {
    // Централизованное состояние списка
    list = $state([]);

    async load() {
        const { data } = await supabase
            .from("documents")
            .select("id, title")
            .order("created_at", { ascending: false });
        this.list = data || [];
    }

    add(newDoc) {
        this.list = [newDoc, ...this.list];
    }

    updateTitle(id, title) {
        const target = this.list.find(d => d.id === id);
        if (target) target.title = title;
    }

    remove(id) {
        this.list = this.list.filter(d => d.id !== id);
    }
}

// Экспортируем один единственный экземпляр класса (синглтон)
export const docStore = new DocumentsStore();