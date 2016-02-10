from setuptools import setup, find_packages

setup(
    name = 'Examist',
    version = '0.0.3',
    description = 'Examist Server',
    author = 'Adrian Cooney',
    author_email = 'cooney.adrian@gmail.com',
    url = 'https://github.com/examist',
    package_dir = { 'server': '' },
    packages = ["server"] + ["server.%s" % pkg for pkg in find_packages()]
)