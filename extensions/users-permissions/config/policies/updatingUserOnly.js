module.exports = (ctx, next) => {
  const currentUser = ctx.state.user

  console.log("policies.updatingUserOnly currentUser", currentUser)

  console.log("policies.updatingUserOnly ctx.params", ctx.params)

  const requestId = ctx.params.id

  if(currentUser.id.toString() === requestId){
    ctx.unauthorized('User authorised')

    return next()
  }

  ctx.unauthorized('You can only update your own profile')
}