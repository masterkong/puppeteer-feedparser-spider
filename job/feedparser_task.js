const FeedParser = require('feedparser');
const request = require('request');
const dateFnsFormat = require('date-fns/format');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

module.exports = function run(url) {
    return new Promise(function (resolve, reject) {
        const posts = [];
        const req = request(url, {
            timeout: 10000,
            pool: false
        });
        req.setMaxListeners(50);
        // Some feeds do not respond without user-agent and accept headers.
        req.setHeader('user-agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36');
        req.setHeader('accept', 'text/html,application/xhtml+xml');

        const feedparser = new FeedParser({});
        req.on('error', reject);
        req.on('response', function(res) {
            if (res.statusCode !== 200) return this.emit('error', new Error('Bad status code'));
            /*
            var encoding = res.headers['content-encoding'] || 'identity'
              , charset = getParams(res.headers['content-type'] || '').charset;
            res = maybeDecompress(res, encoding);
            res = maybeTranslate(res, charset);
            */
            // res.pipe(feedparser);
        }).pipe(feedparser);


        feedparser.on('error', reject);
        feedparser.on('end', function (err) {
            if (err) {
                reject(err);
            }
            resolve(posts);
        });

        feedparser.on('readable', function() {
            let post;
            let html = '';
            while (post = this.read()) {
                const dom = new JSDOM(post.description);
                const img = dom.window.document.querySelector('img').src;
                const url = dom.window.document.querySelector('p>span a').href;
                // console.log(dom.window.document.querySelector('p>span a').textContent)
                const description = dom.window.document.querySelector('p').lastChild.textContent;
                const author = dom.window.document.querySelector('p').childNodes[1].nodeValue + dom.window.document.querySelector('p').children[1].textContent;

                posts.push({
                    url: url,
                    title: post.title,
                    desc: description,
                    img: img,
                    pubDate: dateFnsFormat(new Date(post.pubdate), 'YYYY-MM-DD hh:mm:ss'),
                    author: author,
                    source: 'techmeme'
                });
            }
        });
    });
};
