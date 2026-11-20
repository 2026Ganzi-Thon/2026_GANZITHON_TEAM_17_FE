/** Coordinates in the fixed element's viewport, bounded by its app frame. */
export function navigationFrame(rect: {left:number;width:number;top:number;bottom:number}, viewportBottom: number, viewportTop = 0) {
  return {
    left: rect.left,
    width: rect.width,
    bottom: Math.max(0, viewportBottom - rect.bottom),
    visible: rect.width > 0 && rect.bottom > viewportTop && rect.top < viewportBottom,
  };
}
