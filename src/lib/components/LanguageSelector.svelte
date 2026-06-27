<script lang="ts">
	import { locale } from '$lib/i18n';

	const languages = [
		{ code: 'en', name: 'English', flag: '🇬🇧' },
	];

	let currentLanguage = $derived(languages.find((lang) => lang.code === $locale) ?? languages[0]);

	function setLocale(code: string) {
		locale.set(code);
	}
</script>

<div class="dropdown dropdown-end">
	<div role="button" class="btn btn-ghost">
		<span class="text-xl">{currentLanguage.flag}</span>
		<svg
			width="12px"
			height="12px"
			class="h-2 w-2 fill-current opacity-60 inline-block"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 2048 2048"
			><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg
		>
	</div>
	<ul class="dropdown-content z-[1] p-2 shadow-2xl bg-base-300 rounded-box w-40">
		{#each languages as lang}
			<li>
				<button
					class="btn btn-sm btn-block btn-ghost justify-start"
					class:btn-active={$locale === lang.code}
					onclick={() => setLocale(lang.code)}
				>
					<span class="text-lg mr-2">{lang.flag}</span>
					{lang.name}
				</button>
			</li>
		{/each}
	</ul>
</div>