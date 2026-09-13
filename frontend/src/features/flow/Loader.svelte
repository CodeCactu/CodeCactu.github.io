<script lang="ts">
  import classes from "./Loader.module.css"

  const {size}:{
    size?: number
  } = $props()
</script>

<div class={classes.loader} style={!size ? undefined : `height:${size}px`}>
  <span></span>
  <span></span>
  <span></span>
</div>
