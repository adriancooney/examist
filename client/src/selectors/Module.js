export function byId(id) {
    return (state) => state.modules[id];
} 