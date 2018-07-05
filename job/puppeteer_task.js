const puppeteer = require('puppeteer');

module.exports = async function run(url) {
    const browser = await puppeteer.launch({
        // headless:false
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url);
    await page.setViewport({
        width: 1424,
        height: 5072
    });
    await page.waitFor(2 * 1000);
    await page.screenshot({ path: './page.png' });

    const result = await page.evaluate(() => {
        const data = [];
        const elements = document.querySelectorAll('.feed_ul>li>div.inner_li');
        for (const ele of elements) {
            const aTag = ele.querySelector('a');
            const infoClassName = aTag.querySelector('.info');

            if (infoClassName) {
                data.push({
                    url: aTag.href,
                    title: infoClassName.querySelector('.title').innerText,
                    desc: infoClassName.querySelector('.desc').innerText,
                    img: aTag.querySelector('.img-pad').style.backgroundImage.split('url("')[1].split('")')[0],
                    pubDate: '',
                    author: '专题',
                    source: '36kr'
                });
            } else {
                const imgTag = aTag.querySelector('.load-img');
                data.push({
                    url: aTag.href,
                    title: aTag.querySelector('h3').innerText,
                    desc: aTag.querySelector('.abstract').innerText,
                    img: imgTag.getAttribute('data-src') || imgTag.getAttribute('src'),
                    pubDate: ele.querySelector('.time-div .time').getAttribute('title'),
                    author: ele.querySelector('.user-info .name').innerText,
                    source: '36kr'
                });
            }
        }

        return data;
    });

    await browser.close();
    // console.log('result',result)
    return result;
};

