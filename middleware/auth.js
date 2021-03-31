export default ctx => {
  if (ctx.route.path === "/member" && ctx.store.state.auth.isLogin) {
    ctx.redirect("/");
  } else if (ctx.route.path !== "/member" && !ctx.store.state.auth.isLogin) {
    ctx.redirect("/member");
  }
};
