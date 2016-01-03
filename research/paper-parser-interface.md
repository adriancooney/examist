# Exam Paper Parser interface
The paper parser interface will exist to build a dataset for future use with machine learning and to tweak (or revert) the content of an exam question.

## Functional requirements
* The ability to revert an edited question back to the exam paper.
  This requires having the existing paper layout already generated. The user must be able to select a question from the layout, which will highlight the selected question on the PDF and allow the user to revert to this content.

* Allow use to type data in manually for when exam paper content cannot be extracted.