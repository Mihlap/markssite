import assert from 'node:assert/strict';
import { createElement } from 'react';
import { matchPath, matchRoutes, Navigate, NavLink } from 'react-router';

const routes = [
  { path: '/' },
  { path: '/project' },
  { path: '/project/:id' },
  { path: '/company' },
  { path: '/publication' },
  { path: '/publication/:id' },
  { path: '/journalPage' },
  { path: '/journal/:id' },
  { path: '/contacts' },
  { path: '/information' },
  { path: '/hr/home' },
  { path: '/hr/vacancies' },
  { path: '/hr/internships' },
  { path: '/hr/vacancies/:id' },
  { path: '/footerForm' },
  { path: '/signup' },
  { path: '/login' },
  { path: '/admin/*' },
  { path: '*' },
];

const adminChildRoutes = [
  { path: 'home' },
  { path: 'add-a-project' },
  { path: 'add-a-articles' },
  { path: 'add-hr-portal' },
  { path: 'add-a-company' },
  { path: 'add-a-applications' },
];

function expectMatch(pathname, pattern, params = {}) {
  const match = matchPath({ path: pattern, end: true }, pathname);
  assert.ok(match, `expected ${pathname} to match ${pattern}`);
  for (const [key, value] of Object.entries(params)) {
    assert.equal(match.params[key], value, `${pathname} param ${key}`);
  }
}

const cases = [
  ['/', '/'],
  ['/contacts', '/contacts'],
  ['/company', '/company'],
  ['/publication', '/publication'],
  ['/publication/42', '/publication/:id', { id: '42' }],
  ['/project', '/project'],
  ['/project/7', '/project/:id', { id: '7' }],
  ['/journalPage', '/journalPage'],
  ['/journal/15', '/journal/:id', { id: '15' }],
  ['/hr/home', '/hr/home'],
  ['/hr/vacancies', '/hr/vacancies'],
  ['/hr/internships', '/hr/internships'],
  ['/hr/vacancies/9', '/hr/vacancies/:id', { id: '9' }],
  ['/login', '/login'],
  ['/signup', '/signup'],
  ['/information', '/information'],
  ['/admin/home', '/admin/*'],
  ['/admin/add-a-project', '/admin/*'],
];

for (const [pathname, pattern, params] of cases) {
  expectMatch(pathname, pattern, params);
}

const deep = matchRoutes(routes, '/project/123');
assert.ok(deep?.length, 'deep link /project/123 should resolve');
assert.equal(deep[0].params.id, '123');

const admin = matchRoutes(routes, '/admin/home');
assert.ok(admin?.length, '/admin/home should resolve via splat');

for (const child of adminChildRoutes) {
  const absolute = `/admin/${child.path}`;
  assert.ok(
    matchPath({ path: '/admin/*', end: true }, absolute),
    `admin child ${absolute} should match /admin/*`,
  );
}

assert.ok(Navigate);
assert.ok(NavLink);
assert.ok(createElement(Navigate, { to: 'home', replace: true }));
assert.ok(createElement(NavLink, { to: '/admin/home' }, 'admin'));

const pkg = await import('react-router/package.json', { with: { type: 'json' } }).catch(() => null);
const version = pkg?.default?.version ?? '7.18.1';

console.log('smoke-react-router: ok');
console.log(
  JSON.stringify(
    {
      reactRouter: version,
      matchedDeepLink: deep[0].route.path,
      matchedAdmin: admin[0].route.path,
      navigateType: typeof Navigate,
      navLinkType: typeof NavLink,
    },
    null,
    2,
  ),
);
