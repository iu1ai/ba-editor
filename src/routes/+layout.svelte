<script lang="ts">
	import "../app.css";

	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { auth } from "$lib/stores/auth";
	import { i18nInit, t, locale } from "$lib/i18n";
	import { uiStore } from "$lib/stores/ui.svelte";
	import { Settings, LogOut, ChevronDown, X } from "lucide-svelte";

	let { children } = $props();

	$effect(() => {
		const pathname: string = $page.url.pathname;
		const unsubscribe = auth.subscribe((state) => {
			if (!state.loading) {
				if (state.user) {
					const userLang = state.user?.user_metadata?.language;
					if (userLang) {
						locale.set(userLang);
					}
				}

				const isAuthPage =
					pathname === "/login" || pathname === "/register";

				//const isProtectedPage = pathname === "/dashboard";

				// Redirect unauthenticated users from protected pages to login
				//if (isProtectedPage && !state.user) {
				//	goto("/login");
				//}

				// Redirect authenticated users from auth pages to dashboard
				if (isAuthPage && state.user) {
					goto("/");
				}
			}
		});

		return () => unsubscribe();
	});

	let isDropdownOpen = $state(false);
	let isSettingsModalOpen = $state(false);

	function handleLogout() {
		// Твоя логика выхода
		isDropdownOpen = false;
	}
</script>

{#await i18nInit}
	<div class="min-h-screen flex items-center justify-center bg-base-200">
		<div class="text-center">
			<span class="loading loading-spinner loading-lg"></span>
		</div>
	</div>
{:then}
	<div class="drawer">
		<div class="drawer-content flex flex-col">
			<!-- Navbar -->
			{#if $auth.user}
				<div class="navbar bg-base-100 shadow-lg sticky top-0 z-9">
					<button
						onclick={() =>
							(uiStore.isSidebarOpen = !uiStore.isSidebarOpen)}
						aria-label="Open Sidebar"
						class="p-2 border rounded-lg transition-all border border-transparent
         bg-slate-200 text-slate-900 shadow-inner hidden max-[1024px]:flex items-center justify-center transition-colors mr-4"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							><line x1="4" x2="20" y1="12" y2="12" /><line
								x1="4"
								x2="20"
								y1="6"
								y2="6"
							/><line x1="4" x2="20" y1="18" y2="18" /></svg
						>
					</button>
					<div class="flex-1 p-2">
						<h1>BA Editor</h1>
					</div>
					<div class="flex-none relative">
						<button
							onclick={() => (isDropdownOpen = !isDropdownOpen)}
							class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:text-slate-700 hover:bg-slate-100 transition-colors"
						>
							<span class="text-sm font-medium"
								>{$auth.user.email}</span
							>
							<ChevronDown size={16} class="text-slate-400" />
						</button>

						{#if isDropdownOpen}
							<button
								onclick={() => (isDropdownOpen = false)}
								class="fixed inset-0 z-40 cursor-default w-full h-full"
								aria-label="Закрыть меню"
							></button>

							<div
								class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50"
							>
								<button
									onclick={() => {
										isSettingsModalOpen = true;
										isDropdownOpen = false;
									}}
									class="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left"
								>
									<Settings
										size={16}
										class="text-slate-400"
									/>
									{$t('nav.settings')}
								</button>

								<div class="h-px bg-slate-100 my-1"></div>

								<button
									onclick={handleLogout}
									class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
								>
									<LogOut size={16} />
									{$t('nav.logout')}
								</button>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			{#if isSettingsModalOpen}
				<div
					class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
				>
					<div
						class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
					>
						<div
							class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50"
						>
							<h2 class="text-lg font-semibold text-slate-800">
								{$t('nav.settings')}
							</h2>
							<button
								onclick={() => (isSettingsModalOpen = false)}
								class="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
							>
								<X size={20} />
							</button>
						</div>

						<div class="p-6 overflow-y-auto flex-1">
							<p class="text-slate-500 text-sm">
								Здесь скоро появятся настройки профиля и
								редактора...
							</p>
						</div>

						<div
							class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50"
						>
							<button
								onclick={() => (isSettingsModalOpen = false)}
								class="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
							>
								{$t('m.close')}
							</button>
							<button
								class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
							>
								{$t('m.save')}
							</button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Page content -->
			<main class="flex-1">
				{@render children()}
			</main>
		</div>
	</div>
{/await}
