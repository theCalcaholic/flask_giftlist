from flask.ext.testing import TestCase
from . import app

class BaseTestCase(TestCase):
    """A base test class for the wedding-wishlist-app"""

    def create_app(self):
        app.config.from_object('config.TestConfiguration')
        return app

    def setUp(self):
        pass

    def tearDown(self):
        pass


