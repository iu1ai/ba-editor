<script lang="ts">
	import "../app.css";

	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { auth } from "$lib/stores/auth";
	import { i18nInit, t, locale } from "$lib/i18n";
	import { uiStore } from "$lib/stores/ui.svelte";

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

	// Handle email confirmation callback
	onMount(() => {
		const hashParams = new URLSearchParams(
			window.location.hash.substring(1),
		);
		const accessToken = hashParams.get("access_token");
		const refreshToken = hashParams.get("refresh_token");
		const type = hashParams.get("type");

		if (accessToken && refreshToken && type === "recovery") {
			// Handle email confirmation or password reset
			window.location.hash = "";
		}
	});
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
						<h1>BA Workspace Editor</h1>
					</div>
					<div class="flex-none">
						<span class="text-sm mr-2">{$auth.user.email}</span>
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
