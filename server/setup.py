from distutils.core import setup

setup(
    name = 'Examist',
    version = '0.0.3',
    description = 'Examist Server',
    author = 'Adrian Cooney',
    author_email = 'cooney.adrian@gmail.com',
    url = 'https://github.com/examist',
    package_dir = { 'server': '' },
    packages = ['server', 'server.api', 'server.library', 'server.test', 'server.model']
)