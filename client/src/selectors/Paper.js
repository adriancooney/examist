export function getPaper(module, year, period) {
    return (state) => state.papers.find(paper => 
        paper.module === module && paper.year === year && paper.period === period);
}

export function byId(id) {
    return (state) => state.papers.find(paper => paper.id === id);
}

export function getQuestions(id) {
    return (state) => state.questions.filter(question => question.paper === id);
}