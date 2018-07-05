'use strict';
const PuppeteerTask = require('./job/puppeteer_task');
const FeedparserTask = require('./job/feedparser_task');

/**
 * Puppeteer解析网页信息
 */
// PuppeteerTask('https://36kr.com/').then(function(result) {
//     console.log('PuppeteerTask',result);
// }).catch(function(error) {
//     console.log('PuppeteerTask error:', error);
// });

/**
 * Feedparser解析XML信息
 */
FeedparserTask('https://www.techmeme.com/feed.xml').then(function(result) {
    console.log('FeedparserTask',result);
}).catch(function(error) {
    console.log('FeedparserTask error:', error);
});