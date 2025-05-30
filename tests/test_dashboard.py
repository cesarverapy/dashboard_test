import subprocess

JS_FILES = [
    'dashboard/app.js',
    'dashboard/supabaseClient.js',
    'dashboard/env.example.js',
]

def run_node_check(path):
    result = subprocess.run(['node', '--check', path], capture_output=True, text=True)
    assert result.returncode == 0, f"Syntax error in {path}: {result.stderr}"

def test_js_syntax():
    for path in JS_FILES:
        run_node_check(path)

def test_index_includes_env_before_app():
    html = open('dashboard/index.html').read()
    env_pos = html.find('<script src="env.js"')
    app_pos = html.find('<script type="module" src="app.js"')
    assert env_pos != -1, 'env.js script tag missing'
    assert app_pos != -1, 'app.js script tag missing'
    assert env_pos < app_pos, 'env.js should be loaded before app.js'

def test_env_example_placeholders():
    text = open('dashboard/env.example.js').read()
    assert 'your-project.supabase.co' in text
    assert 'your-anon-key' in text

def test_supabase_client_create_client():
    text = open('dashboard/supabaseClient.js').read()
    assert 'createClient' in text

def test_readme_mentions_env_setup():
    readme = open('README.md').read().lower()
    assert 'copy `dashboard/env.example.js`' in readme
