import os, json, urllib.request

token = os.environ.get('GITHUB_TOKEN', '')
# Try to read from ~/.env
env_path = os.path.expanduser('~/.env')
if not token and os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            if line.startswith('GITHUB_TOKEN='):
                token = line.strip().split('=', 1)[1]
                break

if not token:
    print("ERROR: no token found")
    exit(1)

# 1. Get repo node_id
req = urllib.request.Request(
    'https://api.github.com/repos/skappafrost/azota-automate',
    headers={'Authorization': f'token {token}', 'Accept': 'application/vnd.github.v3+json'}
)
resp = urllib.request.urlopen(req)
repo = json.loads(resp.read())
node_id = repo['node_id']
name = repo['full_name']
print(f"Repo: {name}")
print(f"Node ID: {node_id}")
print(f"Private: {repo.get('private')}")
print(f"URL: {repo.get('html_url')}")

# 2. Try to pin via GraphQL
query = {
    'query': f'mutation {{ addProfilePin(input: {{repositoryId: "{node_id}"}}) {{ clientMutationId }} }}'
}
req2 = urllib.request.Request(
    'https://api.github.com/graphql',
    data=json.dumps(query).encode(),
    headers={
        'Authorization': f'bearer {token}',
        'Content-Type': 'application/json',
    }
)
try:
    resp2 = urllib.request.urlopen(req2)
    result = json.loads(resp2.read())
    if 'errors' in result:
        print(f"GraphQL errors: {result['errors']}")
    else:
        print(f"Pin result: {result.get('data', {})}")
except urllib.error.HTTPError as e:
    print(f"GraphQL HTTP error: {e.code} {e.reason}")
    body = e.read().decode()
    print(f"Body: {body[:500]}")
