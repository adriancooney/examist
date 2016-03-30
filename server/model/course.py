import nltk
import scipy as sp
import numpy as np
from datetime import datetime
from nltk.stem.porter import PorterStemmer
from nltk.tokenize import RegexpTokenizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship, object_session
from sqlalchemy.schema import UniqueConstraint
from server.library.model import Serializable
from server.database import Model, get_model
from server.model.institution import Institution

class Course(Model, Serializable):
    __tablename__ = "course"
    __table_args__ = (
        UniqueConstraint("code", "institution_id"),
    )

    id = Column(Integer, primary_key=True)
    code = Column(String)
    name = Column(String)
    
    # Foreign keys
    institution_id = Column(Integer, ForeignKey("institution.id"))

    # Relationships
    papers = relationship("Paper", lazy="joined")

    SIMILARITY_THRESHOLD = 0.5

    def __init__(self, name, code, institution):
        self.name = name
        self.code = code

        if isinstance(institution, Institution):
            self.institution = institution
        else:
            self.institution_id = institution

    def index_questions(self):
        session = object_session(self)
        questions = []

        self.vectorize()

        for question in self.questions:
            similar_questions = self.find_similar_questions(question)

            # Filter out similar questions unless they are above a threshold
            question.similar = filter(lambda q: q.question.id != question.id and q.similarity > Course.SIMILARITY_THRESHOLD, 
                similar_questions)

            questions.append(question)

        return questions

    def get_questions(self):
        Question = get_model("Question")
        Paper = get_model("Paper")

        return object_session(self)\
            .query(Question)\
            .filter(
                (Paper.course_id == self.id) &
                (Question.paper_id == Paper.id)
            ).all()

    def vectorize(self):
        """
            So let's begin our process of TFIDF vectorization of our documents.
            We're given a document set D and we want:

                1. Remove the stop words.
                2. Stem.
                3. Get the TFIDF for each document.
        """
        # Retrieve our list of documents (i.e. the questions from each paper)
        self.questions = self.get_questions()

        # Filter out questions without content
        self.questions = filter(lambda q: q.revision != None, self.questions)

        # First, let's remove the stop words using the default SKLearn
        # stop word dictionary, stem the words and count each word.
        # We'll use the handy sklearn.feature_extraction.CountVectorizer
        # to do this in one fell swoop.

        # Create our tokenizer to hand to the CountVectorizer. This will stem
        # each token and return it. We'll be using the NLTK stem package which
        # will do the work for us. We also need to grab out NLTK tokenizer.
        stemmer = PorterStemmer()
        stopwords = nltk.corpus.stopwords.words('english')
        tokenizer = RegexpTokenizer(r'\w+')
        
        # And now define the `tokenize` method
        def tokenize(text):
            # Convert our document to a list of tokens (remove whitespace, punctuation)
            # WARNING: This needs to be improved to preserve some punctuation (it's or lion's)
            # and preserve marking.
            tokens = tokenizer.tokenize(text)

            # Remove stop words then stem
            return map(stemmer.stem, tokens)

        # Create our vectorizer with our tokenizer
        self.vectorizer = CountVectorizer(stop_words=stopwords, decode_error="replace")
        
        # Fit the questions and save the word counts
        self.documents = self.vectorizer.fit_transform(map(lambda q: q.revision.content, self.questions))
        self.dictionary = self.vectorizer.get_feature_names()

        # So now we have counts for every word in the every document (i.e. tf)
        # Define our TFIDF generation functions
        N = len(self.questions)
        tf = lambda document, term: self.documents[document, term]
        df = lambda term: self.documents[:, term].sign().sum()
        idf = lambda term: np.math.log10(float(N) / float(df(term)))
        tfidf = lambda document, term: float(tf(document, term)) * idf(term)

        # Initilize our TFIDF sparse matrix
        self.tfidf_documents = sp.sparse.lil_matrix(self.documents.shape, dtype=float)

        # Fill it with the tfidf for all terms and we're done!
        for document, term in zip(*self.documents.nonzero()):
            self.tfidf_documents[document, term] = tfidf(document, term)

    def find_similar_questions(self, question):
        # Compute the tf-idf if not already completed
        if not self.vectorizer:
            self.vectorize()

        # Grab the question we have to find similar for's index
        question_index = 0
        for i, q in enumerate(self.questions):
            if question.id == q.id:
                question_index = i
                break

        # Grab our question vector
        query = self.tfidf_documents[question_index, :]

        # Compute the similarity and return a gram matrix
        # of D_n x Query and stick it in a datafram
        similarity = cosine_similarity(self.tfidf_documents, query).flatten()

        # Grab the similiar model
        Similar = get_model("Similar");

        # Generate the similarity objects
        return [Similar(question=q, similarity=s) for q, s in zip(self.questions, similarity)]

    def get_popular_questions(self):
        """Find the most popular questions. 

        This loops through all the questions, find's the similar questions
        and ranks them by sum(similarity)
        """
        session = object_session(self)

        # SQL:
        # exam_papers=# select question_id, sum(similarity) as similarity from similar_questions 
        #   where similarity > 0.6 and question_id != similar_question_id 
        #   group by question_id order by similarity DESC;

        popular = (session.query(
            Similar.question_id.label("question_id"), 
            func.sum(Similar.similarity).label("cum_similarity")
        ).group_by(Similar.question_id)).subquery()

        questions = session.query(Question)\
            .join(popular, Question.id == popular.c.question_id)\
            .join(Paper, Paper.id == Question.paper_id)\
            .filter(Paper.module_id == self.id)\
            .order_by(popular.c.cum_similarity.desc())\
            .limit(25)

        return questions.all()