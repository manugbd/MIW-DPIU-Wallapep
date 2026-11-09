// Keep nested controls and portalled dialogs independent from the product surface.
export const isProductSurfaceClick = (event) =>
  event.currentTarget.contains(event.target) &&
  !event.target.closest('a, button, input, select, textarea, [role="button"], [role="dialog"], .ant-input-number, .ant-select');
