import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, validateContent } from '../scripts/build.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(path.join(root, 'src/content.json'), 'utf8'));
const built = await render();

test('navigation, skip link and section references resolve to unique IDs', () => {
  const ids = [...built.html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, target] of built.html.matchAll(/\bhref="#([^"]+)"/g)) assert.ok(ids.includes(target), `Missing anchor ${target}`);
  for (const [, target] of built.html.matchAll(/\baria-(?:labelledby|controls)="([^"]+)"/g)) assert.ok(ids.includes(target), `Missing accessible reference ${target}`);
});

test('every local published link and asset exists', async () => {
  for (const [, url] of built.html.matchAll(/\b(?:href|src)="(\.\/[^"]+)"/g)) await access(path.join(root, 'dist', url));
  await access(path.join(root, 'dist/assets/social-card.png'));
});

test('search metadata describes the correct person and current student status', () => {
  assert.equal((built.html.match(/<h1\b/g) || []).length, 1);
  assert.ok(built.html.includes('<html lang="en">'));
  assert.equal(built.structured.mainEntity.name, 'Francesco Maria Arezzo');
  assert.match(built.structured.mainEntity.description, /Undergraduate student/);
  assert.ok(built.html.includes('https://www.francescoarezzo.com/assets/social-card.png'));
});

test('academic qualifications and project statuses stay explicit', () => {
  for (const record of data.education) {
    assert.ok(built.html.includes(record.institution));
    if (record.status === 'Incoming exchange') assert.ok(built.html.includes('Incoming exchange'));
  }
  for (const project of data.projects) assert.ok(built.html.includes(`· ${project.status}</span>`));
  assert.ok(built.html.includes(data.experience.status));
  assert.doesNotMatch(built.html, /MERCURY|your\.email|example\.com|lorem ipsum|TODO/i);
});

test('invalid project status and duplicate project IDs fail the build', () => {
  const invalid = structuredClone(data);
  invalid.projects[0].status = 'Expert';
  assert.throws(() => validateContent(invalid), /explicit status/);
  const duplicate = structuredClone(data);
  duplicate.projects[1].id = duplicate.projects[0].id;
  assert.throws(() => validateContent(duplicate), /unique/);
});

test('profile is a real PDF and project details remain native HTML', async () => {
  const pdf = await readFile(path.join(root, 'dist/assets/Francesco_Arezzo_Profile.pdf'));
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-');
  assert.equal((built.html.match(/<details class="project"/g) || []).length, data.projects.length);
  assert.equal((built.html.match(/<summary>/g) || []).length, data.projects.length + data.experience.contributions.length);
  assert.doesNotMatch(built.html, /<script[^>]+src=|<link[^>]+fonts\.googleapis|\sonclick=/i);
  assert.doesNotMatch(built.html, /data:application\/pdf|<section[^>]*(?:hidden|inert)/i);
  assert.ok(built.html.includes(`href="${data.site.profile}" download=`));
});

test('external tabs use safe relationship attributes', () => {
  for (const [, tag] of built.html.matchAll(/(<a\b[^>]+target="_blank"[^>]*>)/g)) assert.match(tag, /rel="noopener noreferrer"/);
});
