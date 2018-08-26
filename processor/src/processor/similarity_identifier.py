from itertools import product
import spacy
from textacy.similarity import word2vec
nlp = spacy.load('en')


class SimilarityIdentifier():
    """
    SimilarityIdentifier accepts a list of tuples in the shape of (id, text) and
    measures similarity between them using Word2vec.

    See: https://en.wikipedia.org/wiki/Word2vec
    """

    def __init__(self, new_docs, all_docs, threshold=0.95):
        self.new_docs = self._nlpize(new_docs)
        self.all_docs = self._nlpize(all_docs)
        self.threshold = threshold

    @staticmethod
    def _nlpize(docs):
        return [(i, nlp(doc)) for i, doc in docs]

    def calculate(self):
        """
        Calculate similarity using Word2Vec.

        :returns: dict in the shape of {id: [(similar post id, similarity score)]}
        """
        similarity = {}
        for ref_post, comp_post in product(self.new_docs, self.all_docs):
            ref_id, ref_text = ref_post
            comp_id, comp_text = comp_post
            score = round(float(word2vec(ref_text, comp_text)), 2)
            if bool(self.threshold < score < 1):
                try:
                    _ = similarity[ref_id]  # noqa
                except KeyError:
                    similarity[ref_id] = set()
                finally:
                    similarity[ref_id].add((comp_id, round(score, 3)))

        return similarity
