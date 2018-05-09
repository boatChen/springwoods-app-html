export function animation(to, from) {
    const toIndex = to.meta.index;
    const fromIndex = from.meta.index;
    document.toIndex = toIndex;
    return toIndex < fromIndex ? "slide-right" : "slide-left";
}