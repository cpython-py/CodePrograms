try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

config = {
    'description': 'My project',
    'author': 'wonder',
    'url': 'none',
    'download_url': 'none',
    'author_email': 'zero888_666@qq.com',
    'version': '0.1',
    'install_requires': [],
    'packages': ['ex47'],
    'scripts': [],
    'name': 'projectname'
}

setup(**config)