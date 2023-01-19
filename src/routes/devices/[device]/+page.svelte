<script lang="ts">
  import { page } from '$app/stores';
  import { state } from '$lib/stores';
</script>

<h1>Device {$page.params.device}</h1>

<pre>
  {JSON.stringify($state, null, 2)}
</pre>
