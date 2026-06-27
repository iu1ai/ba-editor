<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase/client';
	import { t, locale } from '$lib/i18n';

	let email = $state('');
	let token = $state('');
	let loading = $state(false);
	let error = $state('');
	let message = $state('');
	let otpSent = $state(false);

	onMount(() => {
		const urlError = $page.url.searchParams.get('error');
		if (urlError) {
			error = decodeURIComponent(urlError);
		}
	});

	async function handleSendOtp() {
		loading = true;
		error = '';
		message = '';

		try {
			const { error: authError } = await supabase.auth.signInWithOtp({
				email,
				options: {
					shouldCreateUser: true
				}
			});

			if (authError) {
				error = authError.message;
			} else {
				message = $t('login.otp_sent_message');
				otpSent = true;
			}
		} catch (e) {
			error = $t('login.unexpected_error');
		} finally {
			loading = false;
		}
	}

	async function handleVerifyOtp() {
		loading = true;
		error = '';

		try {
			const {
				data: { session },
				error: authError
			} = await supabase.auth.verifyOtp({
				email,
				token,
				type: 'email'
			});

			if (authError) {
				error = authError.message;
			} else if (session) {
				goto('/');
			} else {
				error = $t('login.invalid_otp');
			}
		} catch (e) {
			error = $t('login.unexpected_error');
		} finally {
			loading = false;
		}
	}
</script>

<div class="min-h-screen flex items-center justify-center bg-base-200 p-4">
	<div class="card w-full max-w-sm bg-base-100 shadow-xl">
		<div class="card-body">
			<h2 class="card-title text-3xl mb-4 text-center">{$t('login.title')}</h2>

			{#if error}
				<div role="alert" class="alert alert-error mb-4 w-full">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="stroke-current shrink-0 h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<span>{error}</span>
				</div>
			{/if}

			{#if message}
				<div role="alert" class="alert alert-info mb-4 w-full">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						class="stroke-current shrink-0 w-6 h-6"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						></path></svg
					>
					<span>{message}</span>
				</div>
			{/if}

			<form
				class="w-full space-y-4"
				onsubmit={(e) => {
					e.preventDefault();
					if (otpSent) {
						handleVerifyOtp();
					} else {
						handleSendOtp();
					}
				}}
			>
				{#if !otpSent}
					<div class="form-control w-full">
						<label class="label" for="login-email">
							<span class="label-text text-lg mb-1">{$t('login.email_label')}</span>
						</label>
						<input
							id="login-email"
							type="email"
							placeholder="email@example.com"
							class="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
							bind:value={email}
							required
							disabled={loading}
						/>
					</div>
				{/if}

				{#if otpSent}
					<div class="form-control w-full">
						<label class="label" for="login-token">
							<span class="label-text text-lg mb-1">{$t('login.otp_label')}</span>
						</label>
						<input
							id="login-token"
							type="text"
							placeholder="123456"
							class="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
							bind:value={token}
							required
							disabled={loading}
						/>
					</div>
				{/if}

				<div class="form-control mt-6 w-full">
					<button type="submit" class="btn btn-primary w-full" disabled={loading}>
						{#if loading}
							<span class="loading loading-spinner"></span>
						{:else if otpSent}
							{$t('login.verify_button_text')}
						{:else}
							{$t('login.send_otp_button_text')}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
</div>