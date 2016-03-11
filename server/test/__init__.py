import warnings as _warnings
import os as _os
from contextlib import contextmanager
from tempfile import mkdtemp
from werkzeug.test import Client, EnvironBuilder
from json import loads, dumps

def assert_api_error(resp, code, message = None, meta = None):
    data = loads(resp.get_data())

    assert resp.status_code == code, "Unexpected status code %r, expected %r" % (resp.status_code, code)
    assert data["error"], "API has not errored."
    
    if message:
        assert data["message"], "API did not return expected message"
        assert message in data["message"], "Error message '%s' does not contain '%s'" % (data["message"], message)

    if meta:
        respMeta = data["meta"]
        assert_shallow_compare(respMeta, meta, "Response Meta")

@contextmanager
def assert_api_response(resp):
    assert resp.status_code == 200, "Incorrect status code."

    resp_raw = resp.get_data()
    assert len(resp_raw) > 0, "No data returned."
    
    print resp_raw

    yield loads(resp_raw)

def assert_shallow_compare(actual, expected, name="Object"):
    for key, value in expected.iteritems():
        assert key in actual, "%s does not contain expected key '%s'" % (name, key)
        assert value == expected[key], "%s key ('%s') value does not contain expected value '%r' == '%r'" % (name, key, value, expected[key])

class APIClient(Client):
    default_environ = dict(
        content_type = "application/json"
    )

    def __init__(self, *args, **kwargs):
        self.default_environ = APIClient.default_environ
        return super(APIClient, self).__init__(*args, **kwargs)

    def open(self, *args, **environ):
        # Apply the base environ
        environ["environ_base"] = self.default_environ

        # Convert any data to JSON
        data = environ.get("data", False)

        if data:
            environ["data"] = dumps(data)
            
        print "\n[CLIENT] ----> %s %s %r" % (environ["method"], args[0] if args[0] else environ["path"], environ.get("data", None))

        # Fix for `content_type` being overridden by Werkzerug (bug)
        # TODO: Report bug to werkzeug repo.
        if not environ.get("content_type", False):
            environ["content_type"] = self.default_environ.get("content_type", None)

        if not environ.get("headers", False):
            environ["headers"] = self.default_environ.get("headers", None)

        # Call the open on the Werkzeug client
        return super(APIClient, self).open(*args, **environ)

# Shim for the Python 3 tempfile.TemporaryDirectory
class TemporaryDirectory(object):
    """Create and return a temporary directory.  This has the same
    behavior as mkdtemp but can be used as a context manager.  For
    example:

        with TemporaryDirectory() as tmpdir:
            ...

    Upon exiting the context, the directory and everything contained
    in it are removed.
    """

    def __init__(self, suffix="", prefix="tmp", dir=None):
        self._closed = False
        self.name = None # Handle mkdtemp raising an exception
        self.name = mkdtemp(suffix, prefix, dir)

    def __repr__(self):
        return "<{} {!r}>".format(self.__class__.__name__, self.name)

    def __enter__(self):
        return self.name

    def cleanup(self, _warn=False):
        if self.name and not self._closed:
            try:
                self._rmtree(self.name)
            except (TypeError, AttributeError) as ex:
                # Issue #10188: Emit a warning on stderr
                # if the directory could not be cleaned
                # up due to missing globals
                if "None" not in str(ex):
                    raise
                print "ERROR: {!r} while cleaning up {!r}".format(ex, self,)
                return
            self._closed = True
            if _warn:
                self._warn("Implicitly cleaning up {!r}".format(self),
                           ResourceWarning)

    def __exit__(self, exc, value, tb):
        self.cleanup()

    def __del__(self):
        # Issue a ResourceWarning if implicit cleanup needed
        self.cleanup(_warn=True)

    # XXX (ncoghlan): The following code attempts to make
    # this class tolerant of the module nulling out process
    # that happens during CPython interpreter shutdown
    # Alas, it doesn't actually manage it. See issue #10188
    _listdir = staticmethod(_os.listdir)
    _path_join = staticmethod(_os.path.join)
    _isdir = staticmethod(_os.path.isdir)
    _islink = staticmethod(_os.path.islink)
    _remove = staticmethod(_os.remove)
    _rmdir = staticmethod(_os.rmdir)
    _warn = _warnings.warn

    def _rmtree(self, path):
        # Essentially a stripped down version of shutil.rmtree.  We can't
        # use globals because they may be None'ed out at shutdown.
        for name in self._listdir(path):
            fullname = self._path_join(path, name)
            try:
                isdir = self._isdir(fullname) and not self._islink(fullname)
            except OSError:
                isdir = False
            if isdir:
                self._rmtree(fullname)
            else:
                try:
                    self._remove(fullname)
                except OSError:
                    pass
        try:
            self._rmdir(path)
        except OSError:
            pass