<script>
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
</script>


<div style="display: flex; justify-content: center; margin-top: 20px;">
    <button on:click={() => goto(`${base}/vis`)}>Learn more</button>
</div>

<p style="position: absolute; top: 700px; right: 20px;">
  Image Source: <a href="https://www.xiaohongshu.com/user/profile/6033ab1800000000010075ac?xhsshare=CopyLink&appuid=5c4e9b04000000001203ea7e&apptime=1709362317" target="_blank">xiaohongshu</a>
</p>