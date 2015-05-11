import sys
import site

sys.path.insert(0, '/var/python/flask/')
sys.path.insert(0, '/var/www/hochzeit.knoeppler.org')
sys.path.insert(1, '/var/www')

site.addsitedir('/var/python/flask/lib/python2.7/site-packages')

from main_app import app as application
