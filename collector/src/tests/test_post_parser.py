from unittest import TestCase
from collector.post_parser import PostParser
from datetime import datetime, date


class FauxFeed():
    def __init__(self, opts):
        self.title = opts['title']
        self.link = opts['link']

        if 'description' in opts:
            self.description = opts['description']
        if 'summary' in opts:
            self.summary = opts['summary']
        if 'datetime' in opts:
            self.published_parsed = opts['datetime']


class PostParserTestCase(TestCase):
    def setUp(self):
        self._rss = PostParser(FauxFeed({
            'title': 'Ticker',
            'link': 'http://localhost.com',
            'description': 'A description',
            'datetime': (2018, 5, 5, 12, 0, 0, 6, 250, 0)
        }))

        self._atom = PostParser(FauxFeed({
            'title': 'Ticker',
            'link': 'http://localhost.com',
            'summary': 'A description',
            'datetime': (2018, 5, 5, 12, 0, 0, 6, 250, 0)
        }))

    def test_hash(self):
        expected = PostParser._hash('pineapple')
        actual = 'ff9907a80070300578eb65a2137670009e8c17cf'
        self.assertEqual(expected, actual)

    def test_datetime(self):
        self.assertEqual(self._rss.datetime.date(), date(2018, 5, 5))
        self.assertEqual(self._atom.datetime.date(), date(2018, 5, 5))

        with self.assertRaises(AttributeError) as context:
            _nodt = PostParser(FauxFeed({
                'title': 'Ticker',
                'link': 'http://localhost.com',
                'description': 'A description     '
            }))

        self.assertTrue('No pubished datetime provided' in str(context.exception))

    def test_description(self):
        expected = "A description"
        self.assertEqual(self._rss.description, expected)
        self.assertEqual(self._atom.description, expected)

        _desc_markup = PostParser(FauxFeed({
            'title': 'Ticker',
            'link': 'http://localhost.com',
            'datetime': (2018, 5, 5, 12, 0, 0, 6, 250, 0),
            'description': 'A description <br/>'
        }))

        self.assertEqual(_desc_markup.description, expected)

    def test_link(self):
        expected = 'http://localhost.com'
        self.assertEqual(self._rss.link, expected)
        self.assertEqual(self._atom.link, expected)

    def test_link_hash(self):
        expected = '745476e8bdb181fedeb500f8ba2ab92ab631b434'
        self.assertEqual(self._rss.link_hash, expected)
        self.assertEqual(self._atom.link_hash, expected)

    def test_title(self):
        expected = 'Ticker'
        self.assertEqual(self._rss.title, expected)
        self.assertEqual(self._atom.title, expected)
