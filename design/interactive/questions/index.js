var data = [
    ["a", 1],
    ["b", 3],
    ["c", 2],
    ["d", 1],
    ["e", 4]
];

d3.select("body")
    .data(data)
    .enter()
        .append("a")
        .text(d => d[0])