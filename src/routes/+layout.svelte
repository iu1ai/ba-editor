<script lang="ts">
	import "../app.css";

	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { auth } from "$lib/stores/auth";
	import { i18nInit, t, locale } from "$lib/i18n";
	import LanguageSelector from "$lib/components/LanguageSelector.svelte";

	let drawerOpen = $state(false);
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
		<input
			id="drawer-toggle"
			type="checkbox"
			class="drawer-toggle"
			bind:checked={drawerOpen}
		/>
		<div class="drawer-content flex flex-col">
			<!-- Navbar -->
			{#if $auth.user}
				<div class="navbar bg-base-100 shadow-lg sticky top-0 z-9">
					<!-- 
						<div class="flex-none">
							<label
								for="drawer-toggle"
								class="btn btn-square btn-ghost drawer-button"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									class="inline-block h-5 w-5 stroke-current"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 6h16M4 12h16M4 18h16"
									></path>
								</svg>
							</label>
						</div>
					
					-->
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

		<!-- Drawer Sidebar 
		<div class="drawer-side">
			<label for="drawer-toggle" class="drawer-overlay"></label>
			<ul
				class="menu p-4 w-80 min-h-full bg-base-200 text-base-content z-60"
			>
				{#if $auth.user}
					<li><a href="/">{$t("nav.home")}</a></li>
					<li>
						<button
							onclick={async () => {
								await auth.signOut();
								goto("/login");
							}}
						>
							{$t("nav.logout")}
						</button>
					</li>
				{:else}
					<li><a href="/login">{$t("nav.login")}</a></li>
				{/if}
			</ul>
		</div>
	-->
	</div>
{/await}
