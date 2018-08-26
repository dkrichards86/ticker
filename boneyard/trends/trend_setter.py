from scipy.stats import linregress


class TrendSetter():
    """
    TrendSetter calculates a trend score from a list of observations by comparing
    predicted values using two separate regressions.
    """
    def __init__(self, counts, resolution=24):
        self.counts = counts
        self.resolution = resolution

    @staticmethod
    def _get_regression(counts):
        """
        Calculate a linear regression.

        :param counts: list of observations
        :returns: LinearRegression
        """
        return linregress(range(len(counts)), counts)

    @staticmethod
    def _get_prediction(x, regression):
        """
        Predict a value using a provided linear regression.

        :param x: x coordinate to predict
        :param regression: LinearRegression
        :returns: Predicted Y value
        """
        return (regression.slope * x) + regression.intercept

    def calculate(self):
        """
        Calculate a trend score by comparing predictions from two linear
        regressions. First, calculate a linear regression using the full set of
        observations. Then calcualte a second regression using the last n
        observations (as identified by resolution). Using the two regressions,
        predict a Y value n steps into the future (as defined by resolution).
        Finally, calculate the ratio between the subset prediction and the full
        prediction.

        :returns: float ratio of subset to full set of observations
        """
        daily_subset = self.counts[-1 * self.resolution:]

        weekly_regression = self._get_regression(self.counts)
        daily_regression = self._get_regression(daily_subset)

        _weekly_x = len(self.counts) + self.resolution
        weekly_prediction = self._get_prediction(_weekly_x, weekly_regression)
        _daily_x = len(daily_subset) + self.resolution
        daily_prediction = self._get_prediction(_daily_x, daily_regression)

        if daily_prediction == 0 or weekly_prediction == 0:
            return 0
        else:
            return daily_prediction / weekly_prediction
