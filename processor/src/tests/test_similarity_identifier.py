from unittest import TestCase
from processor.similarity_identifier import SimilarityIdentifier


ALL_DOCS = [
    (0, "Lorem ipsum dolor sit amet, consectetur adipiscing elit."),
    (1, "Nullam malesuada ultrices odio quis vulputate."),
    (2, "Cras ullamcorper sapien in dui imperdiet placerat."),
    (3, "Donec nisl quam, hendrerit vel bibendum a, aliquam fringilla nisl."),
    (4, "Maecenas interdum at lacus eleifend pharetra."),
    (5, "Quisque malesuada feugiat ante, a rhoncus nisi dignissim convallis."),
    (6, "Sed ultrices orci molestie, suscipit est vitae, placerat tortor."),
    (7, "Nulla ullamcorper enim sit amet nisi bibendum tristique."),
    (8, "Donec elementum in augue ac suscipit."),
    (9, "Vivamus massa ipsum, commodo non elit sit amet, convallis molestie erat."),
    (10, "Maecenas mattis velit nec nunc volutpat aliquet."),
    (11, "Donec volutpat mi eu fermentum volutpat.")
]

NEW_DOCS = [
    (12, "Donec ullamcorper sodales dapibus. Ut a semper leo, non vestibulum metus."),
    (13, "Duis semper nulla a magna ornare, et maximus dui molestie."),
    (14, "Nullam nunc sem, ullamcorper sed magna ut, sodales blandit dui."),
    (15, "Donec quis lobortis orci. Curabitur sagittis sem a sem dignissim mollis.")
]


class SimilarityIdentifierTestCase(TestCase):
    def test_calculate(self):
        sims = SimilarityIdentifier(NEW_DOCS, ALL_DOCS, threshold=0.75)
        results = sims.calculate()

        self.assertEqual(sims.threshold, 0.75)

        self.assertEqual(len(results[12]), 3)
        self.assertEqual(list(results[12])[1], (8, 0.77))

        self.assertEqual(len(results[15]), 4)
        self.assertEqual(list(results[15])[2], (1, 0.78))
