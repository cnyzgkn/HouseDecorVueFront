// 处理消息的函数式组件
export default{
  functional:true,
  render:(h,ctx) => {
    return ctx.scopedSlots.default && ctx.scopedSlots.default(ctx.props || {})
  }
}