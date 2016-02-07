def find(items, predicate):
    """Simple find in array function. Returns first match."""
    for item in items:
        if predicate(item):
            return item

    return None # Defaults to None