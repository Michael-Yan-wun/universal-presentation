import test from 'node:test';
import assert from 'node:assert/strict';
import {chapters,chapterNavigation,chapterFor,resolveChapterRoute} from '../dist/content.js';

test('company history leads with the castle, then growth, learning and the new product',()=>{
 assert.deepEqual(chapters.map(c=>c.slug),[
  'intro','company','company-history','castle','first-contact','decade',
  'analytics','chat','connected-intelligence','winedge','inspection','temperature','knowledge','closing'
 ]);
 assert.equal(chapters[chapterFor('castle')].stage,'overview');
 assert.equal(chapters[chapterFor('winedge')+1].kind,'case');
 assert.equal(new Set(chapters.map(c=>c.slug)).size,chapters.length);
});

test('chapter navigation is ordered, and old entry links still resolve to the intended scenes',()=>{
 const indexes=chapterNavigation.map(c=>chapterFor(c.slug));
 assert.ok(indexes.every((value,i)=>value>=0&&(i===0||value>indexes[i-1])));
 assert.deepEqual(resolveChapterRoute('visual'),{index:chapterFor('first-contact'),senseMode:'cameras'});
 assert.deepEqual(resolveChapterRoute('numeric'),{index:chapterFor('first-contact'),senseMode:'data'});
 assert.equal(chapterFor('one-more-thing'),chapterFor('winedge'));
});
