const matter = require('gray-matter')

const body = {
  action: 'opened',
  issue: {
    url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/issues/66',
    repository_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi',
    labels_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/issues/66/labels{/name}',
    comments_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/issues/66/comments',
    events_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/issues/66/events',
    html_url: 'https://github.com/rishi-raj-jain/itsmy.fyi/issues/66',
    id: 1551402816,
    node_id: 'I_kwDOIxsUic5ceIdA',
    number: 66,
    title: 'itsmy.fyi - @FredKSchott',
    user: {
      login: 'FredKSchott',
      id: 622227,
      node_id: 'MDQ6VXNlcjYyMjIyNw==',
      avatar_url: 'https://avatars.githubusercontent.com/u/622227?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/FredKSchott',
      html_url: 'https://github.com/FredKSchott',
      followers_url: 'https://api.github.com/users/FredKSchott/followers',
      following_url: 'https://api.github.com/users/FredKSchott/following{/other_user}',
      gists_url: 'https://api.github.com/users/FredKSchott/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/FredKSchott/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/FredKSchott/subscriptions',
      organizations_url: 'https://api.github.com/users/FredKSchott/orgs',
      repos_url: 'https://api.github.com/users/FredKSchott/repos',
      events_url: 'https://api.github.com/users/FredKSchott/events{/privacy}',
      received_events_url: 'https://api.github.com/users/FredKSchott/received_events',
      type: 'User',
      site_admin: false,
    },
    labels: [],
    state: 'open',
    locked: false,
    assignee: null,
    assignees: [],
    milestone: null,
    comments: 0,
    created_at: '2023-01-20T20:21:43Z',
    updated_at: '2023-01-20T20:21:43Z',
    closed_at: null,
    author_association: 'NONE',
    active_lock_reason: null,
    body: '### itsmy.fyi Profile Data\n\n```Markdown\n---\r\nslug: fks\r\nname: Fred K Schott\r\nabout: "Astro co-creator • CEO of HTML"\r\nimage: https://avatars.githubusercontent.com/u/622227?s=80&v=4\r\nlinks: [["astro.build", "https://astro.build"]]\r\nsocials: [["Twitter", "https://twitter.com/fredkschott"]]\r\n- ga:\r\n    enabled: false\r\n---\r\n\r\n\r\nThe expected format for itsmy.fyi to parse your data would be:\r\n\r\n## Required\r\n\r\n- slug: **required**, String (without quotes, newline, let\'s keep it simple!)\r\n- name: **required**, String (without quotes or newline)\r\n- image: **required**, String (without quotes or newline)\r\n- links: **required**, but can be empty array [], (examples: [["My Website", "https://rishi.app"], ["Web", "https://rishi.app", "https://rishi.app/static/favicon-image.jpg"]])\r\n- socials: **required**, but can be empty array [], (example: [["twitter", "https://twitter.com/rishi_raj_jain_"], ["linkedin", "https://linked.com/in/rishi-raj-jain"]])\r\n\r\n## Optional\r\n\r\n- about: optional, String (without quotes or newline)\r\n- og:\r\n    image: optional, String (without quotes or newline)\r\n- ga:\r\n    enabled: boolean, true or false (without quotes or newline)\r\n    configID: **required if enabled is true**, String\r\n- background:\r\n    color: optional, can be a String, Hexcode or anything that background-color supports\r\n    image: optional, an absolute URL\n```\n',
    reactions: {
      url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/issues/66/reactions',
      total_count: 0,
      '+1': 0,
      '-1': 0,
      laugh: 0,
      hooray: 0,
      confused: 0,
      heart: 0,
      rocket: 0,
      eyes: 0,
    },
    timeline_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/issues/66/timeline',
    performed_via_github_app: null,
    state_reason: null,
  },
  repository: {
    id: 588977289,
    node_id: 'R_kgDOIxsUiQ',
    name: 'itsmy.fyi',
    full_name: 'rishi-raj-jain/itsmy.fyi',
    private: false,
    owner: {
      login: 'rishi-raj-jain',
      id: 46300090,
      node_id: 'MDQ6VXNlcjQ2MzAwMDkw',
      avatar_url: 'https://avatars.githubusercontent.com/u/46300090?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/rishi-raj-jain',
      html_url: 'https://github.com/rishi-raj-jain',
      followers_url: 'https://api.github.com/users/rishi-raj-jain/followers',
      following_url: 'https://api.github.com/users/rishi-raj-jain/following{/other_user}',
      gists_url: 'https://api.github.com/users/rishi-raj-jain/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/rishi-raj-jain/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/rishi-raj-jain/subscriptions',
      organizations_url: 'https://api.github.com/users/rishi-raj-jain/orgs',
      repos_url: 'https://api.github.com/users/rishi-raj-jain/repos',
      events_url: 'https://api.github.com/users/rishi-raj-jain/events{/privacy}',
      received_events_url: 'https://api.github.com/users/rishi-raj-jain/received_events',
      type: 'User',
      site_admin: false,
    },
    html_url: 'https://github.com/rishi-raj-jain/itsmy.fyi',
    description: 'Take control of your online presence with itsmy.fyi - the true open-source alternative to Linktree.',
    fork: false,
    url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi',
    forks_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/forks',
    keys_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/keys{/key_id}',
    collaborators_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/collaborators{/collaborator}',
    teams_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/teams',
    hooks_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/hooks',
    issue_events_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/issues/events{/number}',
    events_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/events',
    assignees_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/assignees{/user}',
    branches_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/branches{/branch}',
    tags_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/tags',
    blobs_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/git/blobs{/sha}',
    git_tags_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/git/tags{/sha}',
    git_refs_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/git/refs{/sha}',
    trees_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/git/trees{/sha}',
    statuses_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/statuses/{sha}',
    languages_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/languages',
    stargazers_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/stargazers',
    contributors_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/contributors',
    subscribers_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/subscribers',
    subscription_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/subscription',
    commits_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/commits{/sha}',
    git_commits_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/git/commits{/sha}',
    comments_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/comments{/number}',
    issue_comment_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/issues/comments{/number}',
    contents_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/contents/{+path}',
    compare_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/compare/{base}...{head}',
    merges_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/merges',
    archive_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/{archive_format}{/ref}',
    downloads_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/downloads',
    issues_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/issues{/number}',
    pulls_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/pulls{/number}',
    milestones_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/milestones{/number}',
    notifications_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/notifications{?since,all,participating}',
    labels_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/labels{/name}',
    releases_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/releases{/id}',
    deployments_url: 'https://api.github.com/repos/rishi-raj-jain/itsmy.fyi/deployments',
    created_at: '2023-01-14T17:04:48Z',
    updated_at: '2023-01-20T20:13:37Z',
    pushed_at: '2023-01-20T19:43:50Z',
    git_url: 'git://github.com/rishi-raj-jain/itsmy.fyi.git',
    ssh_url: 'git@github.com:rishi-raj-jain/itsmy.fyi.git',
    clone_url: 'https://github.com/rishi-raj-jain/itsmy.fyi.git',
    svn_url: 'https://github.com/rishi-raj-jain/itsmy.fyi',
    homepage: 'https://itsmy.fyi',
    size: 6309,
    stargazers_count: 3,
    watchers_count: 3,
    language: 'JavaScript',
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    has_discussions: true,
    forks_count: 0,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 3,
    license: {
      key: 'agpl-3.0',
      name: 'GNU Affero General Public License v3.0',
      spdx_id: 'AGPL-3.0',
      url: 'https://api.github.com/licenses/agpl-3.0',
      node_id: 'MDc6TGljZW5zZTE=',
    },
    allow_forking: true,
    is_template: false,
    web_commit_signoff_required: false,
    topics: [
      'astro',
      'caching',
      'edgio',
      'fyi',
      'github-actions',
      'github-issue-forms',
      'itsmyfyi',
      'linktree',
      'linktree-alternative',
      'littlelink',
      'stale-while-revalidate',
      'tailwindcss',
    ],
    visibility: 'public',
    forks: 0,
    open_issues: 3,
    watchers: 3,
    default_branch: 'main',
  },
  sender: {
    login: 'FredKSchott',
    id: 622227,
    node_id: 'MDQ6VXNlcjYyMjIyNw==',
    avatar_url: 'https://avatars.githubusercontent.com/u/622227?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/FredKSchott',
    html_url: 'https://github.com/FredKSchott',
    followers_url: 'https://api.github.com/users/FredKSchott/followers',
    following_url: 'https://api.github.com/users/FredKSchott/following{/other_user}',
    gists_url: 'https://api.github.com/users/FredKSchott/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/FredKSchott/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/FredKSchott/subscriptions',
    organizations_url: 'https://api.github.com/users/FredKSchott/orgs',
    repos_url: 'https://api.github.com/users/FredKSchott/repos',
    events_url: 'https://api.github.com/users/FredKSchott/events{/privacy}',
    received_events_url: 'https://api.github.com/users/FredKSchott/received_events',
    type: 'User',
    site_admin: false,
  },
}

const validateBody = (body) => {
  try {
    const { data } = matter(body)
    if (data.hasOwnProperty('disabled') && data.disabled === 'yes') {
      process.exit(1)
    }
    if (!(typeof data.name === 'string')) {
      return false
    }
    if (!(typeof data.slug === 'string')) {
      return false
    }
    if (!(typeof data.image === 'string')) {
      return false
    }
    if (!Array.isArray(data.links)) {
      return false
    }
    if (!Array.isArray(data.socials)) {
      return false
    }
    const { name, slug, image, links, socials, og = {}, about = '', background = {}, ga = {}, icon } = data
    return { name, slug, image, links, socials, og, about, background, ga, icon }
  } catch (e) {
    console.error(e.message || e.toString())
    return false
  }
}

const validateEvent = (context) => {
  try {
    if (!(typeof context.issue.number === 'number')) {
      return false
    }
    const body = context.issue.body
    const start = body.indexOf('---\r\n')
    const end = body.lastIndexOf('\r\n---')
    return {
      ...validateBody(body.substring(start, end + 5)),
      issue: context.issue.number,
    }
  } catch (e) {
    console.error(e.message || e.toString())
    return false
  }
}

const data = validateEvent(body)

console.log(data)
