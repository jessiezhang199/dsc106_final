
<script>
  import { Router, Route } from "svelte-routing";

  import HomePage from "./Home.svelte";
  import YesPage from "./Yespage.svelte";
  import NoPage from "./Nopage.svelte";
  import Graph from "./Global.svelte";

</script>
<HomePage />
<Router>
<Route path="/yes" component={YesPage} />
<Route path="/no" component={NoPage} />
<!-- <Route path="/home" component={HomePage} /> -->
</Router>

