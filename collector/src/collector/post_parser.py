from hashlib import sha1
from bs4 import BeautifulSoup
from time import mktime
from datetime import datetime


class PostParser():
    """
    PostParser accepts a `feedparser` post object and normalizes it for
    ingestion into the ticker application.

    See: https://pythonhosted.org/feedparser/index.html
    """

    def __init__(self, post):
        self.post = post

        self.title = self.get_title()
        self.link = self.get_link()
        self.description = self.get_description()
        self.datetime = self.get_datetime()

    @staticmethod
    def _hash(text):
        """
        Create a SHA1 hash from a given string.
        """
        return sha1(str.encode(text)).hexdigest()

    def get_datetime(self):
        """
        Get a datetime from the post. If the post doesn't exist, use the current
        datetime.
        """
        if hasattr(self.post, 'published_parsed'):
            try:
                return datetime.fromtimestamp(mktime(self.post.published_parsed))
            except TypeError:
                raise AttributeError('Unable to parse datetime')
        else:
            raise AttributeError('No pubished datetime provided')

    def get_description(self):
        """
        Pull a description from the feed. In the case of RSS feeds, this is
        accessible in the 'description' attribute. In Atom feeds, this is pulled
        from the 'summary' attribute. Once we have a description, use
        BeautifulSoup to strip markup, leaving raw text. Finally, strip all
        trailing whitespace.
        """
        if hasattr(self.post, 'description') and self.post.description:
            # RSS feed
            return BeautifulSoup(self.post.description, "lxml").text.rstrip()
        elif hasattr(self.post, 'summary') and self.post.summary:
            # Atom feed
            return BeautifulSoup(self.post.summary, "lxml").text.rstrip()
        else:
            return ''

    def get_link(self):
        """
        Treat post link as an attribute
        """
        if hasattr(self.post, 'link') and self.post.link:
            return self.post.link
        else:
            raise AttributeError

    def get_title(self):
        """
        Treat post title as an attribute
        """
        if hasattr(self.post, 'title') and self.post.title:
            return self.post.title
        else:
            raise AttributeError

    @property
    def link_hash(self):
        """
        Hash the post link as an attribute
        """
        try:
            return self._hash(self.link)
        except AttributeError:
            raise
