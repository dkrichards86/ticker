from unittest import TestCase
from feed.trend_setter import TrendSetter
from scipy.stats import linregress


COUNT_SET_1 = [
    0, 3, 7, 0, 3, 2, 6, 4, 8, 7, 0, 5, 3, 7, 6, 5, 7, 1, 7, 0, 4, 8, 1, 4, 
    7, 3, 6, 7, 1, 7, 1, 7, 1, 0, 7, 7, 5, 1, 2, 0, 8, 6, 2, 8, 7, 3, 8, 7,
    7, 6, 3, 6, 6, 7, 0, 1, 8, 7, 3, 3, 5, 5, 3, 5, 5, 5, 3, 7, 4, 6, 4, 8
]
COUNT_SET_2 = [
    1, 5, 5, 4, 5, 7, 0, 5, 1, 2, 0, 5, 5, 0, 2, 5, 8, 7, 0, 1, 3, 4, 2, 5,
    1, 2, 5, 3, 7, 8, 2, 6, 1, 0, 4, 7, 1, 7, 3, 4, 6, 0, 0, 0, 3, 1, 7, 4,
    2, 4, 8, 7, 7, 5, 6, 7, 2, 7, 6, 0, 8, 6, 0, 2, 7, 0, 1, 4, 6, 4, 2, 4
]
COUNT_SET_3 = [
    3, 6, 4, 4, 8, 2, 1, 6, 0, 5, 4, 2, 7, 6, 7, 6, 6, 0, 1, 2, 7, 2, 7, 2,
    2, 2, 1, 0, 6, 8, 5, 6, 3, 7, 8, 6, 1, 1, 0, 1, 7, 5, 1, 2, 5, 0, 1, 4,
    1, 2, 1, 8, 8, 1, 6, 2, 3, 5, 4, 1, 8, 3, 6, 2, 0, 2, 7, 3, 2, 6, 6, 4
]


class TrendSetterTestCase(TestCase):
    def test_get_regression(self):
        regression_1 = TrendSetter._get_regression(COUNT_SET_1)
        self.assertEqual(round(regression_1.slope, 3), 0.019)
        self.assertEqual(round(regression_1.intercept, 3), 3.846)

        regression_2 = TrendSetter._get_regression(COUNT_SET_2)
        self.assertEqual(round(regression_2.slope, 3), 0.011)
        self.assertEqual(round(regression_2.intercept, 3), 3.334)

        regression_3 = TrendSetter._get_regression(COUNT_SET_3)
        self.assertEqual(round(regression_3.slope, 3), -0.007)
        self.assertEqual(round(regression_3.intercept, 3), 4.0)

    def test_get_prediction(self):
        regression_1 = TrendSetter._get_regression(COUNT_SET_1)
        prediction_1 = TrendSetter._get_prediction(len(COUNT_SET_1) + 24, regression_1)
        self.assertEqual(round(prediction_1, 3), 5.689)

        regression_2 = TrendSetter._get_regression(COUNT_SET_2)
        prediction_2 = TrendSetter._get_prediction(len(COUNT_SET_2) + 24, regression_2)
        self.assertEqual(round(prediction_2, 3), 4.422)

        regression_3 = TrendSetter._get_regression(COUNT_SET_3)
        prediction_3 = TrendSetter._get_prediction(len(COUNT_SET_3) + 24, regression_3)
        self.assertEqual(round(prediction_3, 3), 3.362)

    def test_calculate(self):
        ts_1 = TrendSetter(COUNT_SET_1)
        self.assertEqual(round(ts_1.calculate(), 3), 0.927)

        ts_2 = TrendSetter(COUNT_SET_2)
        self.assertEqual(round(ts_2.calculate(), 3), -0.012)

        ts_3 = TrendSetter(COUNT_SET_3)
        self.assertEqual(round(ts_3.calculate(), 3), 1.548)

    def test_calculate_with_resolution(self):
        ts_1 = TrendSetter(COUNT_SET_1, 12)
        self.assertEqual(round(ts_1.calculate(), 3), 1.437)

        ts_2 = TrendSetter(COUNT_SET_2, 12)
        self.assertEqual(round(ts_2.calculate(), 3), 0.252)

        ts_3 = TrendSetter(COUNT_SET_3, 12)
        self.assertEqual(round(ts_3.calculate(), 3), 1.13)
